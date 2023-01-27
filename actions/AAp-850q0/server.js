function(properties, context) {


    var APIkey = context.keys["apikey"];
    if (APIkey === undefined || APIkey === "" || APIkey === null) {
        throw new Error("missing or invalid API key")
    }
    let varBody = {};

    // Adjust appURL
    if (!properties.appURL) {
        throw new Error("missing home URL")
    }

    if (properties.appURL.substring(0, 8) == "https://") {
        var myApp = properties.appURL
    } else {
        var myApp = "https://" + properties.appURL;
    };


    // Adjust template URL and initalize varBody variable
    if (properties.word_template !== null) {
        varBody.templateURL = properties.word_template
    } else if (properties.templateid !== null) {
        varBody.templateID = properties.templateid
    } else {
        return { error: "template file or ID not found, please provide either a template ID or a template URL" };
    }


    let customObj = {};
    let customImages = {};

    // Add forceWidth to body
    if (properties.forceWidth !== null) {
        varBody.forceWidth = properties.forceWidth;
    }

    if (properties.pdfengine === "Custom") {
        varBody.PdfEngine = "custom";
    } else if (properties.pdfengine === "Standard") {
        varBody.PdfEngine = "standard";
    }


    varBody.upload_output_file = properties.upload_to_docmaker
        //Format image data to update URL and add a blank image URL if image value is missing
    if (properties.image_sub_tags !== null) {
        properties.image_sub_tags.forEach(item => {

            // if item value is not empty add https and push item in result array
            if (item.value !== null && item.value !== "") {
                if (item.value.substring(0, 4) == '//s3') {
                    item.value = "https:" + item.value;
                }
                customImages[item.key] = item.value;
            } else {
                item.value = "https://s3.amazonaws.com/appforest_uf/f1625496715627x166827169332435680/1x1-00000000.png";
                customImages[item.key] = item.value;
            };

        });
    };

    //Add text data to customObj    
    if (properties.sub_tags !== null) {
        properties.sub_tags.forEach(item => {
            customObj[item.key] = item.value
        });
    };


    //Add conditions tags data to customObj    
    if (properties.conditions_tags !== null) {
        properties.conditions_tags.forEach(item => {
            if (item.value == null) {
                customObj[item.key] = false;
            }
            if (item.value == true) {
                customObj[item.key] = true;
            }
        });
    };


    //Add loops data to customObj
    if (properties.loops_sub_data !== null) {
        properties.loops_sub_data.forEach(item => {
            //Add formatting object if data format required => to be added soon         
            customObj[item.key] = JSON.parse(item.value)
        });
    };
    //Add dynamic sub_tags to customObj
   if(properties.dynamic_sub_tags){
   		 var str=properties.dynamic_sub_tags.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
     	customObj = Object.assign(customObj, JSON.parse(str));
     }
    
	 

    //Declare isEmpty function
    const isEmpty = inputObject => {
        return Object.keys(inputObject).length === 0;
    };

    // Add customObj and customImages to API call body if they are not empty
    if (!isEmpty(customObj)) {
        varBody.data = customObj
    };
    if (!isEmpty(customImages)) {
        varBody.image_data = customImages;
    };
    if (isEmpty(customImages) && isEmpty(customObj)) {
        throw new Error("aucune donnée fournie")
    };



    varBody.upload_output_file = properties.upload_to_docmaker
    varBody.outputType = properties.outputType;
    varBody.emptyTags = properties.emptytags;
    varBody.showURLinLogs = true;
    varBody.getBase64 = true;

    //add webhook data if provided
    if (properties.webhook_url && !properties.bubble_upload) {
        varBody.webhook_object_type = properties.webhook_object_type;
        varBody.webhook_url = properties.webhook_url
        varBody.webhook_object_id = properties.webhook_object
    } else if (properties.webhook_url && properties.bubble_upload) {
        varBody.bubbleUpload = myApp
        varBody.webhook_object_type = properties.webhook_object_type;
        varBody.webhook_url = properties.webhook_url
        varBody.webhook_object_id = properties.webhook_object
    }

    //Add metadata
    varBody.metadata = properties.metadata;

    console.log(varBody);

    // Call docxtopdf API docxtopdf-api.herokuapp.com
    var options = {
        method: 'POST',
        uri: 'https://api.docmaker.co/docx_fill_convert',
        headers: {
            'authorization': APIkey,
            'Content-Type': "application/json"
        },
        timeout: 60000,
        body: JSON.stringify(varBody)

    };
    var response = context.request(options);
    var bodyJson = JSON.parse(response.body);

    if (bodyJson.status_code !== 200) {
        if (bodyJson.status_description.includes("scope parser")) {
            throw new Error(bodyJson.status_description + " Please check that your tags do not start with a number. They should only start with letters.");
        } else {
            throw new Error(bodyJson.status_description);
        }
    } else {
        if (!bodyJson.output_file.includes("webhook")) {
            // Call upload file API
            var bodyU = {
                "contents": bodyJson.file_base64,
                "name": properties.filename
            };
            // File is private and attach user specified
            if (properties.private && properties.attach_to != null) {
                bodyU.private = true;
                bodyU.attach_to = properties.attach_to.get("_id");
            }

            // File is private default to current user
            else if (properties.private) {
                bodyU.private = true;
                bodyU.attach_to = context.currentUser.get("_id");
            }

            var optionsU = {
                method: 'POST',
                uri: myApp + '/fileupload',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(bodyU)

            };
            var responseU = context.request(optionsU);
            var bodyJsonU = JSON.parse(responseU.body);


            if (properties.base64 == true) {
                return {
                    statuscode: String(bodyJson.status_code),
                    output_file: bodyJsonU,
                    output_file_base64: String(bodyJson.file_base64),
                    error: String(bodyJson.status_description)
                }
            }
            if (properties.base64 == false) {
                return {
                    statuscode: String(bodyJson.status_code),
                    output_file: bodyJsonU,
                    output_file_base64: "You did not select the base64 option in the plugin interface",
                    error: String(bodyJson.status_description)
                }
            }

        } else {
            return {
                statuscode: "200",
                output_file: "output file sent to webhook",
                output_file_base64: "output file sent to webhook"
            }
        }
    }

}