/* jshint ignore:start */
#include "lib/ui.jsx"
#include "../node_modules/aequery/dist/aequery.js"
/* jshint ignore:end */

(function (thisObj) {  
  /// Globals Variables 
  var SCRIPTNAME = "Shape Color";
  var SCRIPTVERSION = "0.0.1";
  var COLORS =  []
  var NEW_COLORS = [];
  COLORS = getMasterColors();
//  assignSourceColors();
 
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
    
    sourceColors = colorGrp.add("panel", [0, 170, 240, 350]);
    srcColorOne_btn = sourceColors.add("button", [200, 50, 220, 70], "");
    srcColorTwo_btn = sourceColors.add("button", [200, 75, 220, 95], "");
    srcColorThree_btn = sourceColors.add("button", [200, 100, 220, 120], "");
    srcColorFour_btn = sourceColors.add("button", [200, 25, 220, 45], "");

    destColors = colorGrp.add("panel", [0, 170, 240, 350]);
    destColorOne_btn = destColors.add("button", [200, 50, 220, 70], "");
    destColorTwo_btn = destColors.add("button", [200, 75, 220, 95], "");
    destColorThree_btn = destColors.add("button", [200, 100, 220, 120], "");
    destColorFour_btn = destColors.add("button", [200, 25, 220, 45], "");

    changeColors_btn = manualPanel.add("button", [5, 130, 225, 155], "CHANGE COLORS");


//////// UI FUNCTIONS
   
relaodBtn.onClick = function() {
  
      butColor(srcColorOne_btn, COLORS[0]);
      butColor(srcColorTwo_btn, COLORS[1]);
      butColor(srcColorThree_btn, COLORS[2]);
      butColor(srcColorFour_btn, COLORS[3]);
    
  }

  destColorOne_btn.onClick = function() {
    var colorOne = pickColor();
    butColor(destColorOne_btn, colorOne);
    NEW_COLORS[0] = colorOne;
  }

  destColorTwo_btn.onClick = function() {
    var colorTwo = pickColor();
    butColor(destColorTwo_btn, colorTwo);
    NEW_COLORS[1] = colorTwo;
  }

  destColorThree_btn.onClick = function() {
    var colorThree = pickColor();
    butColor(destColorThree_btn, colorThree);
    NEW_COLORS[2] = colorThree;
  }

  destColorFour_btn.onClick = function() {
    var colorFour = pickColor();
    butColor(destColorFour_btn, colorFour);
    NEW_COLORS[3] = colorFour;
  }

changeColors_btn.onClick = function() {
  app.beginUndoGroup("Hangar Change Colors");
  var comp = app.project.activeItem;
  if (comp && (comp instanceof CompItem)) {
    var colorLayer = comp.layer(comp.numLayers);
    if (colorLayer.name == "MasterColors") {
      
      var allProps = aeq.arrayEx(ChangeColors.createProps());
      alert(COLORS);
      allProps.forEach(function(p){
        ChangeColors.changePopKeys(p,COLORS,NEW_COLORS);
      })
      
      /// UPDATE THE MASTER COLORS
      // comp.layer(comp.numLayers).property("Effects").property("colorOne").property("Color").setValue(NEW_COLORS[0]);
      // comp.layer(comp.numLayers).property("Effects").property("colorTwo").property("Color").setValue(NEW_COLORS[1]);
      // comp.layer(comp.numLayers).property("Effects").property("colorThree").property("Color").setValue(NEW_COLORS[2]);
      // comp.layer(comp.numLayers).property("Effects").property("colorFour").property("Color").setValue(NEW_COLORS[3]);

      //
    } else {
      alert("Could not Find color layer. Make sure a Master Comp is Active");
    }
  }
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



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////// MAIN SCRIPT FUNCTION  /////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMasterColors(){
  var comp = app.project.activeItem;
  var mastercolorOne = comp.layer(comp.numLayers).property("Effects").property("colorOne").property("Color").valueAtTime(comp.time, false);
  var mastercolorTwo = comp.layer(comp.numLayers).property("Effects").property("colorTwo").property("Color").valueAtTime(comp.time, false);
  var mastercolorThree = comp.layer(comp.numLayers).property("Effects").property("colorThree").property("Color").valueAtTime(comp.time, false);
  var mastercolorFour = comp.layer(comp.numLayers).property("Effects").property("colorFour").property("Color").valueAtTime(comp.time, false);

  return [mastercolorOne,mastercolorTwo,mastercolorThree,mastercolorFour];
}



function assignSourceColors(){
  butColor(srcColorOne_btn, COLORS[0]);
  butColor(srcColorTwo_btn, COLORS[1]);
  butColor(srcColorThree_btn, COLORS[2]);
  butColor(srcColorFour_btn, COLORS[3]);
}

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

      var matchProps = props.filter(function(prop) {
        return prop.matchName == "ADBE Vector Stroke Color" || prop.matchName == "ADBE Vector Fill Color"; 
      });
      
      matchProps.forEach(function(p){
        tmpProps.push(p);
      })
    });
  
  return tmpProps;
}
  
function changePopKeys(prop , oldColors, newColors) {

  if(prop.numKeys > 0 ) {
    for (var i = 1; i <= prop.numKeys; i++) {
      alert(prop.keyValue(i));
      if(prop.keyValue(i) == oldColors[0]) {prop.setValueAtKey(i,[0,0,0])};
      else if(prop.keyValue(i) == oldColors[1]) {prop.setValueAtKey(i,newColors[1])};
      else if(prop.keyValue(i) == oldColors[2]) {prop.setValueAtKey(i,newColors[2])};
      else if(prop.keyValue(i) == oldColors[3]) {prop.setValueAtKey(i,newColors[3])};
      else {prop.setValueAtKey(i,prop.keyValue(i))};
    }
}else{
  if(prop.valueAtTime(comp.time,true) == oldColors[0]) {prop.setValue(newColors[0])};
      else if(prop.valueAtTime(comp.time,true) == oldColors[1]) {prop.setValue(newColors[1])};
      else if(prop.valueAtTime(comp.time,true) == oldColors[2]) {prop.setValue(newColors[2])};
      else if(prop.valueAtTime(comp.time,true) == oldColors[3]){prop.setValue(newColors[3])};
      
}
  
}


return{createProps : createProps,
  changePopKeys : changePopKeys
}

})();

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

  function getUserDataFolder() {

    var userDataFolder = Folder.userData;
    var aescriptsFolder = Folder(userDataFolder.toString() + "/Aescripts/HANGAR_v1/yourImg");
    if (!aescriptsFolder.exists) {
      var checkFolder = aescriptsFolder.create();
      if (!checkFolder) {
        alert("Error creating ");
        aescriptsFolder = Folder.temp;
      }
    }
    return aescriptsFolder.toString();
  }

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


})(this);