/* jshint ignore:start */
#include "lib/ui.jsx"
/* jshint ignore:end */

(function (thisObj) {  
  /// Globals Variables 
  var SCRIPTNAME = "Shape Color";
  var SCRIPTVERSION = "0.0.1";
 
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

  //// END UI
    alert("Hello World");















})(this);