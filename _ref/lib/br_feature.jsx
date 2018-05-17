function Feature(csvFeatureObj,index,mission,mainComp){
    
	var topLeftMain = findElement("TopLeft-Main",{type:CompItem});
	var topLeftSub = findElement("TopLeft-Sub",{type:CompItem});
    var topRightMain = findElement("TopRight-Main",{type:CompItem});
    var topRightSub = findElement("TopRight-Sub",{type:CompItem});
    // var primaryText, secondaryText, tcIn, zone, order, isReady, colorExpressions, index, position;
    this.primaryText = csvFeatureObj.Feature;
    this.secondaryText = csvFeatureObj.Proximity;
    this.zone = csvFeatureObj.Zone;
    this.mainComp = mainComp;
    this.index = index;
    this.mission = mission;
    this.orientation = function (){
      var str = csvFeatureObj.Orientation.replace(":", "");
      return parseInt(str,10);
    };

    /// COLOR EXPRESSIONS TO LINK FEATURES COLORS TO MAIN COMP COLOR LAYER. IT'S VERY IMPORTANT NOT TO RENAME THE MAIN COMP.
    this.colorExpressions = function (){
      return {primaryTextColorExpression : "comp(\"" + mainComp.name + "\").layer(\"colors\").effect(\"Main Text Color\")(\"Color\")",
              secondaryTextColorExpression : "comp(\"" + mainComp.name + "\").layer(\"colors\").effect(\"Secondary Text Color\")(\"Color\")",
              primaryBgColorExpression : "comp(\"" + mainComp.name + "\").layer(\"colors\").effect(\"Main BG Color\")(\"Color\")",
              secondaryBgColorExpression : "comp(\"" + mainComp.name + "\").layer(\"colors\").effect(\"Secondary BG Color\")(\"Color\")"
            };
  	};


    // check if orientation is valid format.
    function checkOrientationFormat(){
      var orientation = csvFeatureObj.Orientation;
      if(orientation.match(/((:00)|(:30))/g)){
        isReady = true;
      }else{
        isReady = false;
      }
    };

    function selectFeatureRefComp(){
      var newFeatureComp;
      if (index === 0){
        newFeatureComp = checkAmenitiesLength();
      }
      else if (this.index % 2 === 0) {
        newFeatureComp = topRightSub.duplicate();
        position = "right";
        pinX = 400;
      } else {
        newFeatureComp = topLeftSub.duplicate();
        position = "left";
        pinX = 1520;
      }
      return newFeatureComp;
    };

    function makeFeatureComp(){
      // DEAL WITH FEATURE
      newFeatureComp.name = comp.name.replace("_MASTER", "_") + "Feature_" + f;
      newFeatureComp.parentFolder = folder;
      newFeatureComp.layer("FEATURE").text.sourceText.setValue(new TextDocument(feature));
      newFeatureComp.layer("FEATURE").property("Effects").property("Fill").property("Color").expression = colorExpressions.mainTextColorExpression;
      newFeatureComp.layer("mainBG").property("Effects").property("changeColor").property("To").expression = colorExpressions.mainBgColorExpression;

      // ONLY IF THERE IS A PROXIMITY VALUE, DEAL WITH IT. OTHERWISE TURN OFF ALL PROXIMITY LAYERS
      if (featureList[f].Proximity) {
        var proximity = featureList[f].Proximity.toUpperCase();
        newFeatureComp.layer("PROXIMITY").text.sourceText.setValue(new TextDocument(proximity));
        newFeatureComp.layer("PROXIMITY").property("Effects").property("Fill").property("Color").expression = colorExpressions.proximityTextColorExpression;
        newFeatureComp.layer("secondaryBG").property("Effects").property("changecolor").property("Map White To").expression = colorExpressions.econdaryBgColorExpression;
      }
    };
  };