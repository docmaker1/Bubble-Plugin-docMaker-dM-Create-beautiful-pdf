function(properties, context) {

  var file = properties.file;
  var fileName = properties.name;
  
  var blob = null;
  
  if (!file) {
    alert("Please select a file!");
  } else if (file.split(",").length > 1) {
    alert("Please select only a single file!");
  } else {
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", file); 
    xhr.responseType = "blob";
    xhr.onload = function() // Runs after the request is received
    {
      if (xhr.status != 200) {
        console.log("Status error: " + xhr.status);
        alert("There was an issue generating your file. Please check your file type and try again.");
      } else {
      blob = xhr.response;
      download(blob, fileName);
      }
    }
    xhr.send();
  }

}