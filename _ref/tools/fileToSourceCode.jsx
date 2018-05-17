function fileToBinaryString(){

  var input = File.openDialog("Choose some file to convert to source code");
  if(input === null) return;

  var rawData = readBinaryFile(input);
  var variableName = convertStringtoValidVariableName(input.name);
  var sourceCode = convertRawDataToSourceCode(rawData,variableName);
  writeTextFile(input.fsName + ".jsx", sourceCode);


  function convertRawDataToSourceCode(rawData, variableName){
    var contentAsString = rawData.toSource();
    var sourceCode = "var "+variableName+ " = " + contentAsString + ";\n";
    return sourceCode;
  }

  function readBinaryFile(file){
    file.encoding = "BINARY";
    file.open("r");
    var content = file.read();
    file.close();
    return content;
  }

  function writeTextFile(filePath, content){
    var output = new File(filePath);
    output.open("w");
    output.write(sourceCode);
    output.close();

  }

// replace any striong that strats with non special character or numner
  function convertStringtoValidVariableName(anyString){
    return anyString.name.replace(/\W/g,"").replace(/^\d+/g,"");
  }

}

fileToBinaryString();
