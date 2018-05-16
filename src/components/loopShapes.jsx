#include "../../node_modules/aequery/dist/aeq.js"

function loopProps() {
    //var layers = aeq.getSelectedLayers().filter(aeq.isShapeLayer);
    var comp = aeq.getActiveComp();
    var layers = aeq.getSelectedLayersOrAll();
    var keyProps;

    if (layers.length < 1) {
      alert("Please, select a layer!");
    }
    var shapesProps = [];

    layers.forEach(function(shapeLayer) {
      var props = aeq.arrayEx(
        aeq.getPropertyChildren(shapeLayer, {
          props: true,
          separate: false,
          groups: true
        })
      );

      var shapesGroup = props.filter(function(prop) {
        try {
          prop.selected = false;
        } catch (e) {}
        return prop.matchName == "ADBE Vector Stroke Color" || prop.matchName == "ADBE Vector Fill Color";
      });
      
      shapesGroup.forEach(function(prop) {
        //   var propObject = {};
        //   propObject["compId"] = comp.id;
        //   propObject["layer"] = shapeLayer.index;
        //   propObject["propPath"] = getPropPath(prop);
        // var absolutePath = buildPropPath(findItemById(comp.id),shapeLayer.index,propObject.propPath);
        // propObject["absolutePath"] = absolutePath;
        //   propObject["value"] = prop.valueAtTime(0,true);
        shapesProps.push(prop);
        
      });
    
    });

    function getPropPath(prop){
	var layerRoot = false;
	var propPath = "";
	
	while(prop.parentProperty)
	{
        // propPath = "('"+prop.name+"')"+propPath;
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
function checkPropKeys(layer,curComp) {
    markerProps = layer.property("Marker");
    var digit = /^\d/g;
    for (var i = 1; i <= markerProps.numKeys; i++) {
      marker = new Object();
      var comment = markerProps.keyValue(i).comment;
      marker.id = comment;
      marker.text = markerProps.keyValue(i).chapter;
      marker.time = markerProps.keyTime(i);
      marker.layerIndex = layer.index;
      marker.comp = curComp.id;
      layerMarkers.push(marker);
      if(marker.id.match(digit)){
        groupMarkers.push(marker);
      }
    }
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
   
  return shapesProps;
  }

  var allProps = loopProps();
  

  