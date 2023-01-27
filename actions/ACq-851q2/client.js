function(properties, context) {

var dataStr = "data:text/plain;base64," + properties.base64
    
const a = document.createElement('a');
    a.style.display = 'none';
    a.href = dataStr;
    // the filename you want
    a.download = properties.name;
    document.body.appendChild(a);
    a.click();



}