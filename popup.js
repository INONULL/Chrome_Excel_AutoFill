var previousTabId = null;
var PopupId = null;
chrome.runtime.onMessage.addListener(function (request) {
  if (request.message === "lastUsedTabId") {
    console.log(request.message);
    previousTabId = request.data;
  }
  if (request.message === "PopupId") {
    console.log(request.message);
    PopupId = request.data;
  }
});

document.getElementById('autofillButton').addEventListener('click', function () {
  try{
    var fileInput = document.getElementById('excelFile');
    var file = fileInput.files[0];
    var currentUrl = window.location.href;
    console.log('Excel_File_Selected');

    var num_row = document.getElementById('num_row').value;
    if(num_row == null){
      alert('Please enter the row number');
    }else{
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        chrome.runtime.sendMessage({
          message: "Popup_to_Background",
          data: data,
          nrow: num_row,
        });
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if(previousTabId != null){
            console.log('previousTabId: ' + previousTabId);
            chrome.tabs.update(previousTabId, { active: true });
            //setTimeout(function(){
            chrome.tabs.sendMessage(previousTabId, { message: "autofill", data: data, nrow: num_row });
            //    }, 500);
        }
        if(previousTabId == null){
            console.log("tabs[0].id: " + tabs[0].id);
            chrome.tabs.sendMessage(tabs[0].id, { message: "autofill", data: data, nrow: num_row });
        }
          console.log('chrome.tabs.sendMessage(tabs[0].id), { message: "autofill"}');
          previousTabId = null; // reset
          PopupId = null;
        });
      };
      console.log('Excel file loaded');
      reader.readAsBinaryString(file);
    } else {
      alert('Please select a file.');
    }
  }
  }catch(err){
    console.log(err +'  on popup.js');
  }
});


