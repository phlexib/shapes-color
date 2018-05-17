(function (thisObj) {  
#include "lib/ui.jsx"
#include "../node_modules/aequery/dist/aequery.js"
#include "../src/components/changeColors.jsx"
  /// Globals Variables 
  var SCRIPTNAME = "Shape Color";
  var SCRIPTVERSION = "0.0.1";
  var COLORS = [];
  var NEW_COLORS = [];

  ///// START UI
  var win = buildUI(thisObj);  
  function buildUI(thisObj) {  
      var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", SCRIPTNAME + "-"+SCRIPTVERSION, undefined,
      {  
          resizeable: true
      });  
      return pal;
    }

    //// TITLE GRP
titleGrp = win.add("group", [0, 0, 300, 20]);
titleGrp.orientation = "row";
titleGrp.alignment = "left";
title = titleGrp.add("statictext", [0, 10, 50, 20], "v" + SCRIPTVERSION);

manualPanel = win.add("panel", [5, 160, 245, 500], "CHANGE SHAPES COLORS");
    relaodBtn = manualPanel.add("button", [000, 75, 220, 95], "RELOAD");   
    colorGrp = manualPanel.add("panel", [0, 170, 240, 350]);
    colorGrp.borderless = true;
    colorGrp.orientation = "row";
    
    sourceColorsGrp = colorGrp.add("group", [0, 170, 240, 350]);
    var colorGrp = sourceColorsGrp.add("group", [10, 120, 385, 180], "Group Markers", {
      orientation: "row",
      alignment: "fill"
    });
    colorGrp.add("statictext", [0, 10, 50, 20], "src");
    colorGrp.add("statictext", [0, 10, 50, 20], "dst");
    changeColors_btn = manualPanel.add("button", [5, 130, 225, 155], "CHANGE COLORS");


//////// UI FUNCTIONS
   
relaodBtn.onClick = function() {
  app.beginUndoGroup("Reload Colors");
  COLORS =[];
  NEW_COLORS = [];
  COLORS = ChangeColors.getColors();
  NEW_COLORS = COLORS;
  for(var c=0 ; c< COLORS.length ; c++){
      addColorGrp(sourceColorsGrp,COLORS[c],[c]);
    }
  app.endUndoGroup();
  }

changeColors_btn.onClick = function() {
  app.beginUndoGroup("Hangar Change Colors");
  var currentColors = ChangeColors.getColors();
  ChangeColors.updateColors(currentColors,NEW_COLORS);
  app.endUndoGroup();
}

win.onResizing = win.onResize = function() {
    this.layout.resize();
  };

  if (win instanceof Window) {
    win.center();
    win.show();
  } else {
    win.layout.layout(true);
    win.layout.resize();
  }

//UPDATE UI EASILY TO REFLECT ADD/REMOVE CHANGES
function updateUILayout(container) {
    container.layout.layout(true); //Update the container
    win.layout.layout(true); //Then update the main UI layout
  }
  win.active = true;
  win.layout.layout(true);
  win.layout.resize();
  win.onResizing = win.onResize = function() {
    this.layout.resize();
  };

  ///ADD NEW MARKER GROUP
  function addColorGrp(parent, color,index) {
    var colorGrp = parent.add("group", [10, 120, 385, 180], "Group Markers", {
      orientation: "row",
      alignment: "fill"
    });
    colorText = colorGrp.add("staticText",[10,10,30,30],index);
    colorSrcBtn = colorGrp.add("button", [10, 10, 30, 30], "");
    butColor(colorSrcBtn, color);
    colorSrcBtn.helpTip = "Current Color";
    dstColorBtn = colorGrp.add("button", [100, 10, 120, 30], "");
    butColor(dstColorBtn, color);
    dstColorBtn.onClick = function() {
      var pickedColor = pickColor();
      butColor(this, pickedColor);
      NEW_COLORS[index] = pickedColor;
    };

    parent.orientation = "column";

    updateUILayout(parent); //Update UI
  }


  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////// MAIN SCRIPT FUNCTION  /////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////// TOOLS  /////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // COLORS PALETTE FEATURES
  var pickColor = function() {
    var myDecColor = 0;
    myDecColor = $.colorPicker();

    var myHexColor = myDecColor.toString(16);

    r = HexToR(myHexColor) / 255;
    g = HexToG(myHexColor) / 255;
    b = HexToB(myHexColor) / 255;
    var colors = [r, g, b, 1];

    function HexToR(h) {
      return parseInt((cutHex(h)).substring(0, 2), 16);
    }

    function HexToG(h) {
      return parseInt((cutHex(h)).substring(2, 4), 16);
    }

    function HexToB(h) {
      return parseInt((cutHex(h)).substring(4, 6), 16);
    }

    function cutHex(h) {
      return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }
    return colors;
  };

  var butColor = function(object, color) {

    if (String(color) != "undefined" && String(color) != "NaN")
    if (color[0] > 0) {
      object.onDraw = fillRect;
      object.fillBrush = object.graphics.newBrush(object.graphics.BrushType.SOLID_COLOR, color);
      object.visible = 0;
      object.visible = 1;
    }

    function fillRect() {
      with(this) {
        try {
          graphics.drawOSControl();
          graphics.rectPath(0, 0, size[0] - 2, size[1] - 2);
          graphics.fillPath(fillBrush);
        } catch (err) {}
      }
    }
  };

  function createResourceFile(filename, binaryString, resourceFolder) {

    var myFile = new File(resourceFolder + "/" + filename);
    if (!File(myFile).exists) {
      if (!(isSecurityPrefSet())) {
        alert("This script requires access to write files. Go to the  General  panel of the application preferences and make sure  Allow Scripts to Write Files and Access Network  is checked.");
        try {
          app.executeCommand(2359);
        } catch (e) {
          alert(e);
        }
        if (!isSecurityPrefSet()) return null;
      }
      myFile.encoding = "BINARY";
      myFile.open("w");
      myFile.write(binaryString);
      myFile.close();
    }
    return myFile;
  }

  function isSecurityPrefSet () {
    var securitySetting;
    try {
      securitySetting = app.preferences.getPrefAsLong("Main Pref Section",
      "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
      return (securitySetting == 1);
    } catch (e) {
      return (securitySetting = 1);
    }
  }

  /////// CHANGE COLRS MODULE
  /* jshint ignore:start */
// #include "../../node_modules/aequery/dist/aequery.js"
/* jshint ignore:end */
var ChangeColors = (function() {

  var comp = aeq.getActiveComp();
  var layers = aeq.getSelectedLayersOrAll();
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

})(this);