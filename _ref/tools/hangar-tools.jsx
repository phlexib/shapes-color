function Asset(){}








/// Feature tools to make it modular and easy to update

function Feature(csvFeatureObj,mision,clockTime,mainComp){
  // var primaryText, secondaryText, tcIn, zone, order, isReady, colorExpressions, index, position;
  this.primaryText = csvFeatureObj["Feature"];
  this.secondaryText = csvFeatureObj["Proximity"];
  this.zone = csvFeatureObj["Zone"];
  this.mainComp = mainComp;
  this.orientation = csvFeatureObj.orientation;
  this.mssion = mision;

  /// COLOR EXPRESSIONS TO LINK FEATURES COLORS TO MAIN COMP COLOR LAYER. IT'S VERY IMPORTANT NOT TO RENAME THE MAIN COMP.
  this.colorsExpressions = function (){
    return {primaryTextColorExpression : "comp(\"" + mainComp.name + "\").layer(\"colors\").effect(\"Main Text Color\")(\"Color\")",
            secondaryTextColorExpression = "comp(\"" + mainComp.name + "\").layer(\"colors\").effect(\"Secondary Text Color\")(\"Color\")",
            primaryBgColorExpression = "comp(\"" + mainComp.name + "\").layer(\"colors\").effect(\"Main BG Color\")(\"Color\")",
            secondaryBgColorExpression = "comp(\"" + mainComp.name + "\").layer(\"colors\").effect(\"Secondary BG Color\")(\"Color\")"
}

  // check if orientation is valid format.
  function checkOrientationFormat(csvFeatureObj["Orientation"]){
    var orientation = csvFeatureObj["Orientation"];
    if(orientation.match(/((:00)|(:30))/g)){
      isReady = true;
    }else{
      isReady = false;
    }
  }
  
  function selectFeatureRefComp(){
    var newFeatureComp;
    if (index === 0){
      newFeatureComp = checkAmenitiesLength();
    }
    else if (this.index % 2 == 0) {
      newFeatureComp = topRightSub.duplicate();
      position = "right";
      pinX = 400;
    } else {
      newFeatureComp = topLeftSub.duplicate();
      position = "left";
      pinX = 1520;
    }
    return newFeatureComp;
  }

  function getClocktimes(mission){
    switch (mission){
      case "CH100"
    }
  }
  function makeFeatureComp(){
    // DEAL WITH FEATURE
    newFeatureComp.name = comp.name.replace("_MASTER", "_") + "Feature_" + f;
    newFeatureComp.parentFolder = folder;
    newFeatureComp.layer("FEATURE").text.sourceText.setValue(new TextDocument(feature));
    newFeatureComp.layer("FEATURE").property("Effects").property("Fill").property("Color").expression = colorExpressions.mainTextColorExpression;
    newFeatureComp.layer("mainBG").property("Effects").property("changeColor").property("To").expression = colorExpressions.mainBgColorExpression;

    // ONLY IF THERE IS A PROXIMITY VALUE, DEAL WITH IT. OTHERWISE TURN OFF ALL PROXIMITY LAYERS
    if (featureList[f].Proximity) {
      var proximity = featureList[f]["Proximity"].toUpperCase();
      newFeatureComp.layer("PROXIMITY").text.sourceText.setValue(new TextDocument(proximity));
      newFeatureComp.layer("PROXIMITY").property("Effects").property("Fill").property("Color").expression = colorExpressions.proximityTextColorExpression;
      newFeatureComp.layer("secondaryBG").property("Effects").property("changecolor").property("Map White To").expression = colorExpressions.econdaryBgColorExpression;
    }
  }

  var clock = {
    "CH100": {
      "start": "0:00:05:00",
      "11:30": "0:00:42:25",
      "11:00": "0:00:49:06",
      "10:30": "0:00:55:21",
      "10:00": "0:01:01:27",
      "9:30": "0:01:08:24",
      "9:00": "0:01:15:18",
      "8:30": "0:01:23:02",
      "8:00": "0:01:30:13",
      "7:30": "0:01:37:25",
      "7:00": "0:01:45:09",
      "6:30": "0:01:53:05",
      "6:00": "0:02:01:04",
      "5:30": "0:02:08:25",
      "5:00": "0:02:16:08",
      "4:30": "0:02:22:16",
      "4:00": "0:02:28:15",
      "3:30": "0:02:33:28",
      "3:00": "0:02:39:01",
      "2:30": "0:02:46:03",
      "2:00": "0:02:52:27",
      "1:30": "0:02:59:06",
      "1:00": "0:03:05:05",
      "0:30": "0:03:11:08",
      "0:00": "0:03:16:28",
      "end": "0:03:35:05"
    },
    "CH200": {
      "start": "0:00:05:00",
      "11:30": "0:00:42:25",
      "11:00": "0:00:49:06",
      "10:30": "0:00:55:21",
      "10:00": "0:01:01:27",
      "9:30": "0:01:08:24",
      "9:00": "0:01:15:18",
      "8:30": "0:01:23:02",
      "8:00": "0:01:30:13",
      "7:30": "0:01:37:25",
      "7:00": "0:01:45:09",
      "6:30": "0:01:53:05",
      "6:00": "0:02:01:04",
      "5:30": "0:02:08:25",
      "5:00": "0:02:16:08",
      "4:30": "0:02:22:16",
      "4:00": "0:02:28:15",
      "3:30": "0:02:33:28",
      "3:00": "0:02:39:01",
      "2:30": "0:02:46:03",
      "2:00": "0:02:52:27",
      "1:30": "0:02:59:06",
      "1:00": "0:03:05:05",
      "0:30": "0:03:11:08",
      "0:00": "0:03:16:28",
      "end": "0:03:35:05"
    },
    "masscherry70v1": {
      "start": "0:00:32:05",
      "11:30": "0:01:00:13",
      "11:00": "0:01:12:07",
      "10:30": "0:01:25:16",
      "10:00": "0:01:39:00",
      "9:30": "0:01:52:11",
      "9:00": "0:02:08:25",
      "8:30": "0:02:25:18",
      "8:00": "0:02:41:17",
      "7:30": "0:02:54:17",
      "7:00": "0:03:07:11",
      "6:30": "0:03:23:12",
      "6:00": "0:03:38:07",
      "5:30": "0:03:55:06",
      "5:00": "0:04:07:07",
      "4:30": "0:04:18:26",
      "4:00": "0:04:33:03",
      "3:30": "0:04:50:20",
      "3:00": "0:05:06:17",
      "2:30": "0:05:18:04",
      "2:00": "0:05:29:15",
      "1:30": "0:05:40:02",
      "1:00": "0:05:51:15",
      "0:30": "0:06:01:23",
      "0:00": "0:06:14:10",
      "end": "0:07:05:28"
    }
  };

}
