#include "../../node_modules/aequery/dist/aeq.js"

var ChangeColors = (function () {

    var comp = aeq.getActiveComp();
    var layers = aeq.getSelectedLayersOrAll();
    var keyProps;
    var shapesProps = [];

    if (layers.length < 1) {
      alert("Please, select a layer!");
    }
   

    layers.forEach(function(shapeLayer) {
      var props = aeq.arrayEx(
        aeq.getPropertyChildren(shapeLayer, {
          props: true,
          separate: false,
          groups: true
        })
      );

      var shapesGroup = props.filter(function(prop) {
        return prop.matchName == "ADBE Vector Stroke Color" || prop.matchName == "ADBE Vector Fill Color";
      });
      
      shapesGroup.forEach(function(prop) {
        
        var propObject = new Object;
        propObject["prop"] = prop;
        propObject["keyList"] = getPopKeys(prop);
        shapesProps.push(propObject);
      });
    
    });
    
    function getPropPath (prop) {
      var layerRoot = false;
      var propPath = "";
	
    while(prop.parentProperty)
      {
        propPath = "('"+prop.name+"')"+propPath;
        prop = prop.parentProperty;
      }
      return propPath;
    }
    
    function buildPropPath (compIndex,id,propPath){
        var cleaned = propPath.replace(/(^\()|(\)$)/g,"");
     //return app.project.item(compIndex).layer(id).property(cleaned);
    }
    
    //// find markers on layer
    // function getPopKeys(prop) {
    //   var keyList = aeq.arrayEx();
    //   for (var i = 1; i <= prop.numKeys; i++) {
    //     var keyObject = new Object();
    //     keyObject.["keyIndex"] = i;
    //     keyObject.["value"] = prop[i].keyValue;
    //     keyList.push(keyObject);
    //   }
    //   return keyList;
    // }

    function changePopKeys(prop , oldColors, newColors) {
      
      var keyList = aeq.arrayEx();
      for (var i = 1; i <= prop.numKeys; i++) {
        if(prop[i].keyValue == oldColors[0]) {prop[i].keyValue = newColors[0]};
        else if(prop[i].keyValue == oldColors[1]) {prop[i].keyValue = newColors[1]};
        else if(prop[i].keyValue == oldColors[2]) {prop[i].keyValue = newColors[2]};
        else if(prop[i].keyValue == oldColors[3]) {prop[i].keyValue = newColors[3]};
        else { prop[i].keyValue = prop[i].keyValue;}
      }
      return keyList;
    }

    //// UTILS
    function findItemById(id) {
      for (var item = 1; item <= app.project.numItems; item++) {
        var curItem = app.project.item(item);
        if (curItem.id === id) {
          return item;
          break;
        }
      }
    };

    var allProps = new aeq.arrayEx(loopProps());
  var unique = new aeq.arrayEx;
  for (var u = 0; u < allProps.length; u++) {
    if (findInArray(unique, allProps[u].value) === false) {
      unique.push(allProps[u].value);
    }
  }

  function findInArray(arr, val) {
    var found = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].value == val) {
        found = true;
        return found;
      }
    }
    return found;
  }

})();

  