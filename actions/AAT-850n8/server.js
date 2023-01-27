function(properties, context) {
      function sanitizeJSON(unsanitized){
              return unsanitized.replace(/_text/g, "").replace(/___number/g, "").replace(/__number/g, "").replace(/_number/g, "").replace(/_date/g, "");  
  };
  var myObjList = [];
  var resultJson = "";
  var resultJsonList = "";

  if (properties.itemlist && properties.itemlist.length) {
    if (properties.itemlist.length() > 0) {
      var thingsList = properties.itemlist;
      for (var itms = 0; itms < properties.itemlist.length(); itms++) {
        var myObj = {};
        var thingProperties = thingsList.get(itms,1)[0].listProperties();
        for (var j = 0; j < thingProperties.length; j++) {
          myObj[thingProperties[j].replace(" ", "_")] = thingsList.get(itms,1)[0].get(thingProperties[j]);
        }
        myObjList[itms] = myObj;
      }
    };
    resultJson = sanitizeJSON(JSON.stringify(myObjList));
//     resultJson = JSON.stringify(myObjList);test22
  };
  return {jsonvalue : resultJson}
}