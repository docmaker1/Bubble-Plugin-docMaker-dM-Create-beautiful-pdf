function(properties, context) {

 fetch("https:" + properties.file)
  .then(resp => resp.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download =  properties.name
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
 })

}
