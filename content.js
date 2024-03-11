chrome.runtime.onMessage.addListener(function (request) {
  try{
  if(request.message == "autofill") {
    console.log("Background_to_Content")
    var data = request.data; // Excel data
    var num_row = request.nrow // Target row
    var workbook = XLSX.read(data, { type: 'binary' });

    var sheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[sheetName];
    var range = XLSX.utils.decode_range(sheet['!ref']); // Get size of the chsoen excel file


// Assuming 'id' is in row 0, and 'value' is in row 1
//for (var rowNum = range.s.r+1; rowNum <= range.e.r; rowNum++){
    for (var colNum = range.s.c; colNum <= range.e.c; colNum++) {
      // Assuming 'id' is in row 0, and 'value' is in row 1
      var cellId = sheet[XLSX.utils.encode_cell({ r: 0, c: colNum })]; // num row 4 or 5
      var cellValue = sheet[XLSX.utils.encode_cell({ r: num_row-1, c: colNum })];
      if ((cellId && cellId.v !== undefined) && (cellValue && cellValue.v !== undefined)) { // Ignore empty cellId
        var id = cellId.v;
        var value = cellValue.v;
        console.log('ID:', id);
        console.log('Value:', value);
        document.getElementById(id).value = value;
      }
    }
//  }
    chrome.runtime.sendMessage({ // Filling Done
      message: "Done"
    });
  }
}catch(err){
  console.log(err +'   on content.js')
}
});

