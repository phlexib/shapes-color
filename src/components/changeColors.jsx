/* jshint ignore:start */
// #include "../../node_modules/aequery/dist/aequery.js"
/* jshint ignore:end */
var ChangeColors = (function() {

    var comp = aeq.getActiveComp();
    var layers = aeq.getSelectedLayersOrAll();
    var oldPadColors = [];
    var compColors = aeq.arrayEx();
  /**
   * First Transform Old Colors into a padded version
   * Then loop through keys to change Colors
   * @param {Array} oldColors 
   * @param {Array} newColors 
   */
    
    function getColors (){
      var collectedColors = aeq.arrayEx();

      layers.forEach(function(shapeLayer) {
        var props = aeq.arrayEx(
          aeq.getPropertyChildren(shapeLayer, {
            props: true,
            separate: false,
            groups: true
          })
        );

        // grab comp colors
        props.forEach(function(prop) {
          if((prop.matchName === "ADBE Vector Stroke Color") || (prop.matchName === "ADBE Vector Fill Color")){
            if(prop.numKeys > 0){
              for(var i = 1; i <= prop.numKeys; i++){
                compColors.push(prop.keyValue(i));
              }
            }else{
              compColors.push(prop.valueAtTime(comp.time,true));
            }
          }
          });

        // remove doubles in colors
          for (var u = 0; u < compColors.length; u++) {
            if (findInArray(collectedColors, compColors[u]) !== true) {
              collectedColors.push(compColors[u]);
            }
          }
      });

      return collectedColors;
    }

    function updateColors (oldColors,newColors){
      layers.forEach(function(shapeLayer) {
        var props = aeq.arrayEx(
          aeq.getPropertyChildren(shapeLayer, {
            props: true,
            separate: false,
            groups: true
          })
        );

      // assign colors from hard coded
      props.forEach(function(prop) {
        if((prop.matchName === "ADBE Vector Stroke Color") || (prop.matchName === "ADBE Vector Fill Color")){
          if(prop.numKeys > 0){
            for(var i = 1; i <= prop.numKeys; i++){
              var keyColor = prop.keyValue(i);
              for (var oc = 0 ; oc < oldColors.length; oc++){
                if(isEqual(keyColor,oldColors[oc])){
                  prop.setValueAtKey(i,newColors[oc]);
                }
              }
            }
          }
          else{
            var keyColor = prop.valueAtTime(comp.time,true);
              for (var oc = 0 ; oc < oldColors.length; oc++){
                if(isEqual(keyColor,oldColors[oc])){
                  prop.setValue(newColors[oc]);
                }
              }
          }
        }
        });
      });
    }

  /**
   * Transform An Array of Colors with x digits into
   * An array with only the number of digits in paramter two 
   * If no number given, defaults to 2 digits
   * @param {Array} colorArray 
   * @param {Number} pad 
   * @return {Array}  
   */
  function padColors(colorArray,pad){
    if(!pad) pad = 2;
    return [colorArray[0].toFixed(pad),colorArray[1].toFixed(pad),colorArray[2].toFixed(pad),colorArray[3].toFixed(pad)];  
  }

  /**
   * Compare Two Objects and return true if strictly identical
   * @param {Object} value 
   * @param {Obbject} other 
   * @return {Boolean}
   */
  var isEqual = function (value, other) {

    // Get the value type
    var type = Object.prototype.toString.call(value);
  
    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;
  
    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
  
    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;
  
    // Compare two items
    var compare = function (item1, item2) {
  
      // Get the object type
      var itemType = Object.prototype.toString.call(item1);
  
      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!isEqual(item1, item2)) return false;
      }
  
      // Otherwise, do a simple comparison
      else {
  
        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) return false;
  
        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) return false;
        } else {
          if (item1 !== item2) return false;
        }
  
      }
    };
  
    // Compare properties
    if (type === '[object Array]') {
      for (var i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          if (compare(value[key], other[key]) === false) return false;
        }
      }
    }
    // If nothing failed, return true
    return true;
  
  };

  function findInArray(arr, val) {
    var found = false;
    for (var i = 0; i < arr.length; i++) {
      if (isEqual( arr[i],val)) {
        found = true;
        return found;
      }
    }
    return found;
  }


  return {
    updateColors:updateColors,
    getColors:getColors}
})();

// hard coded colors for test purposes
// var NEWCOLORS = [[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1],[0.5,0.5,0.5,1]];
// var OLDCOLORS = [[1,1,1,1],[0,0,0,1],[0.18627451360226,0.52549022436142,0.96666669845581,1],[0.36566525697708,0.39095237851143,0.73595279455185,1]];
//var colors = ChangeColors.getColors();
