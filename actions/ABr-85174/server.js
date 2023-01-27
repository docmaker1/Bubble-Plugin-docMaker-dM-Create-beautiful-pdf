function(properties, context) {
    var APIkey = context.keys["apikey"];
  
    // Adjust appURL
    if(properties.appURL.substring(0,8)=="https://"){
        var myApp= properties.appURL
    } else {
        var myApp = "https://"+ properties.appURL;
    };
    
  

        let varBody ={};
    let docxurl;

    // Adjust template URL and initalize varBody variable
    switch(properties.word_template.substring(0, 18)){
    
        case '//s3.amazonaws.com':
        	docxurl = "https:" + properties.word_template;
            varBody = {
                aws_link: docxurl,
                name: "output_file.docx"};
            break;
            
	    case 'https://s3.amazona':
            varBody = {
                aws_link: properties.word_template,
                name: "output_file.docx"};
			break;
            
		case 'https://drive.goog':
            varBody = {
                google_drive_link: properties.word_template,
                name: "output_file.docx"}
			break;
            
        default:
            return {error : "template file not found, please use only aws or google drive hosted files"};
    };//"template file not found, please use only aws or google drive hosted files"

    varBody.bubbleUpload = myApp;
    varBody.getBase64 = properties.base64
  

  // Call docxtopdf API
  var options = {
    method: 'POST',
    uri: 'https://api.docmaker.co/docx_convert',
  	  headers: {
      'authorization': APIkey,
      'Content-Type' : "application/json"
    },
    body: JSON.stringify(varBody)

  };
    var response = context.request(options);
	var bodyJson = JSON.parse(response.body);
    
    if(bodyJson.status_code !== 200){
   		  throw new Error(bodyJson.status_description);
    }
	else{   
        if(properties.base64 == true){ 
            return {statuscode: String(bodyJson.status_code),
                    output_file: bodyJson.output_file.replace("https:",""),
                    output_file_base64: String(bodyJson.file_base64),
                    error: String(bodyJson.status_description)}
        }
        if(properties.base64 == false){ 
            return {statuscode: String(bodyJson.status_code),
                    output_file: bodyJson.output_file.replace("https:",""),
                    output_file_base64: "You did not select the base64 option in the plugin interface",
                    error: String(bodyJson.status_description)}
        }
    }
}