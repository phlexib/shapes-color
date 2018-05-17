#include "../../node_modules/aequery/dist/aeq.js"
var ChangeColors = (function () {
 
    var comp = aeq.getActiveComp();
    var layers = aeq.getSelectedLayersOrAll();
    
    if (layers.length < 1) {
      alert("Please, select a layer!");
    }
   
    function createProps(){

      var tmpProps = []
      layers.forEach(function(shapeLayer) {
        var props = aeq.arrayEx(
          aeq.getPropertyChildren(shapeLayer, {
            props: true,
            separate: false,
            groups: true
          })
        );

        props.filter(function(prop) {
          return prop.matchName == "ADBE Vector Stroke Color" || prop.matchName == "ADBE Vector Fill Color";
        });
        props.forEach(function(p){
          tmpProps.push(p);
        })
      });
    
    return tmpProps;
  }
    
  function changePopKeys(prop , oldColors, newColors) {
    
    var keyList = aeq.arrayEx();
    if(prop.numKeys <0) {
      for (var i = 1; i <= prop.numKeys; i++) {
        alert(prop[i].keyValue + "|" + oldColors);
        if(prop[i].keyValue == oldColors[0]) {prop[i].keyValue = newColors[0]};
        else if(prop[i].keyValue == oldColors[1]) {prop[i].keyValue = newColors[1]};
        else if(prop[i].keyValue == oldColors[2]) {prop[i].keyValue = newColors[2]};
        else if(prop[i].keyValue == oldColors[3]) {prop[i].keyValue = newColors[3]};
        else { prop[i].keyValue = prop[i].keyValue;}
      }
  }else{
    alert(prop[i].value + "|" + oldColors);
  }
    return keyList;
  }


  return{createProps : createProps,
    changePopKeys : changePopKeys
  }

})();

