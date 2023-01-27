function(properties, context) {
      if (!context.keys["apikey"]) {
      throw new Error("Missing API key. " +
                      "Please go to Plugins => 'docMaker (dM) Create beautiful pdf', " + 
                      "then fill in the 'API key' field with your " + 
                     "API key. You can create a new API key here: " +
                     "https://docmaker.co/dashboard");
  }

  var APIkey = context.keys["apikey"];

    // Adjust appURL
    if(properties.appURL.substring(0,8)=="https://"){
        var myApp= properties.appURL
    } else {
        var myApp = "https://"+ properties.appURL;
    };
    
    let varBody ={};
    varBody.upload_output_file = properties.upload_to_docmaker
    varBody.name = properties.filename;
	varBody.url= properties.page_url;
	varBody.pageSize = properties.page_size;
	varBody.loadTime= properties.min_load_time;
 	if(properties.page_orientation == "Landscape"){
    	varBody.landscape= true
    } else {varBody.landscape= false};
  	varBody.marginLeft= properties.marginleft;
  	varBody.marginRight= properties.marginright;
  	varBody.marginTop= properties.margintop;
  	varBody.marginBottom= properties.marginbottom;
    varBody.timeZone= properties.timezone;

    varBody.vWidth= properties.browserwidth;
    varBody.vHeight= properties.browserheight;
    varBody.showURLinLogs= true;
    varBody.getBase64 = true
    varBody.username = properties.username;
    varBody.password = properties.password;
    
    //add webhook data if provided
    if(properties.webhook_url){
    	varBody.bubbleUpload = myApp
        varBody.webhook_url = properties.webhook_url
        varBody.webhook_object_type = properties.webhook_object_type;
        varBody.webhook_object_id = properties.webhook_object
    }
    
    if(properties.pageranges){
        varBody.pageRanges = properties.pageranges
    }

    if(properties.footer == "Page numbers"){
    	varBody.showFooter = "pageNumbers"
	} else if (properties.footer == "Custom footer"){
      	varBody.showFooter = "customFooter";
        varBody.htmlFooter = properties.custom_footer;
    };
    
    // Call docx to  pdf API
  	var options = {
        method: 'POST',
        uri: 'https://api.docmaker.co/page_pdf',
        headers: {
          'authorization': APIkey,
          'Content-Type' : "application/json"
        },
        body: JSON.stringify(varBody)
      };

    var response = context.request(options);		
	var bodyJson = JSON.parse(response.body);
     if(bodyJson.status_code !== 200){ 
             console.log(
		      "Error creating pdf! Response:",
		      response.statusCode,
			     response.body
 	   );
  	  return {
      	success: false,
      	error: "Error. Could not create pdf." + response.body
   		 }
    }
	else{
		if(!bodyJson.output_file.includes(" webhook")){
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


            if(properties.base64 == true){ 
                return {statuscode: String(bodyJson.status_code),
                        output_file: bodyJsonU,
                        output_file_base64: String(bodyJson.file_base64),
                        error: String(bodyJson.status_description)}
            }
            if(properties.base64 == false){ 
                return {statuscode: String(bodyJson.status_code),
                        output_file: bodyJsonU,
                        output_file_base64: "You did not select the base64 option in the plugin interface",
                        error: String(bodyJson.status_description)}
            }
           
        } else {
                return {statuscode: "200",
                        output_file: "output file sent to webhook",
                        output_file_base64: "output file sent to webhook"}
        }
    }           
}