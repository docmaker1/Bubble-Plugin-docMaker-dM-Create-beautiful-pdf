function(properties, context) {
 var testData = {"key1": "value1"};
  var myObjList = [];
  var resultJson = "";
  var resultJsonList = "";
  var myObj = {};
  if (properties.itemlist && properties.itemlist.length) {
    if (properties.itemlist.length() > 0) {
      var thingsList = properties.itemlist;
      for (var itms = 0; itms < properties.itemlist.length(); itms++) {

        myObj[thingsList.get(itms,1)[0].get(properties.tags_column)] = thingsList.get(itms,1)[0].get(properties.values_column);
      }
    };

    var resultJson = JSON.stringify(myObj);
  };
  return {jsonvalue : resultJson}
}