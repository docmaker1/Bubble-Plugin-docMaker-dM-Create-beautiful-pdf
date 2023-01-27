function(properties, context) {
    var APIkey = context.keys["apikey"];
 
    // Adjust appURL
    if(properties.appURL.substring(0,8)=="https://"){
        var myApp= properties.appURL
    } else {
        var myApp = "https://"+ properties.appURL;
    };
    
    let varBody ={};
    
    varBody.name = properties.filename;
	varBody.url= properties.page_url;
    varBody.type= properties.type;
  	if(properties.fullPage == "true"){
    	varBody.fullPage= true
    } else {varBody.fullPage= false};
	varBody.loadTime= properties.min_load_time;
 	if(properties.omitBackground == "true"){
    	varBody.omitBackground= true
    } else {varBody.omitBackground= false};
    if(properties.type ==="jpeg"){
	  	varBody.quality= Number(properties.quality);       
    }
  	varBody.clipX= properties.clipX;
  	varBody.clipY= properties.clipY;
  	varBody.clipWidth= properties.clipWidth;
  	varBody.clipHeight= properties.clipHeight;
    
    varBody.vWidth= properties.browserwidth;
    varBody.vHeight= properties.browserheight;
        varBody.showURLinLogs= true;

    
        // Call docx to  pdf API
  	var options = {
        method: 'POST',
        uri: 'https://api.docmaker.co/page_screenshot',
        headers: {
          'authorization': APIkey,
          'Content-Type' : "application/json"
        },
        body: JSON.stringify(varBody)
      };

    var response = context.request(options);		
	var bodyJson = JSON.parse(response.body);

        // Call upload file API
    var bodyU = {"contents" : bodyJson.file_base64,
                "name" : properties.filename};
    
  	var optionsU = {
    	method: 'POST',
    	uri: myApp + '/fileupload',
  	  	headers: {
      		'Content-Type' : "application/json"
    	},
    	body: JSON.stringify(bodyU)
  	}; 
    var responseU = context.request(optionsU);
	var bodyJsonU = JSON.parse(responseU.body);

    return {statuscode: String(bodyJson.status_code),
	 		output_file: bodyJsonU,
            output_file_base64: String(bodyJson.file_base64),
            error: String(bodyJson.status_description)
	}

}