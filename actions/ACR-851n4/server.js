function(properties, context) {
      function sanitizeJSON(unsanitized){
              return unsanitized.replace(/_text/g, "").replace(/_number/g, "").replace(/_date/g, "").replace(/__number/g, "");  
  };
  var myObjList = [];
  var resultJson = "";
  var resultJsonList = "";
  var main = JSON.parse(properties.main)
  var s_main = sanitizeJSON(properties.search_field_in_main)
  s_main = s_main.toLowerCase();
  var s_nested = sanitizeJSON(properties.search_field_in_nested)
  s_nested = s_nested.toLowerCase();
  var tag = properties.tag
  var i = 0

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

var nested = JSON.parse(resultJson)


Object.keys(main).forEach(item =>{
        Object.keys(nested).forEach(blob =>{
 //           variables.push({[nested[blob][s_nested]] : [main[item][s_main]]})
             
            if(nested[blob][s_nested] === main[item][s_main]){

                if(main[item][tag] === undefined){
                    i++;
                    console.log(i + " nested lines");
                    main[item][tag] = []
                }
                main[item][tag].push(nested[blob])
            }
     }
    )
})
  return {jsonvalue : JSON.stringify(main),
         nested_lines : i}
}