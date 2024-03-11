var lastUsedTabId = null;
var PopupId = null;
var popupmode = false;
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "excel_upload_content",
    title: "excel_upload",
  });
  console.log("Program_Started");
});

// Individual Popup_Handler
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  try{
  if (info.menuItemId === "excel_upload_content") {
    console.log("excel_upload_content_clicked");
    console.log("Info:", info); 
    console.log("Tab:", tab);
    lastUsedTabId = tab.id;
    console.log(lastUsedTabId)

    //Created embedded popup
    chrome.windows.create({ url: "popup.html", type: "popup", width: 300, height: 150 }, function (window) {
      popupmode = true;
      console.log(window.tabs[0].id);
      PopupId = window.tabs[0].id;
      setTimeout(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(PopupId, { message: "lastUsedTabId", data: lastUsedTabId })
          chrome.tabs.sendMessage(PopupId, { message: "PopupId", data: PopupId })
        });
      }, 500);
    });
    //
  }
}catch(err){
  console.log(err + '  on background.js(1)');
}
});

chrome.runtime.onMessage.addListener(function (request) {
  try{
  if (request.message == 'Popup_to_Background') {
    console.log("Popup_to_Background");
  }
  if (request.message == 'Done') {
    console.log("Done");
  if(popupmode){
    chrome.tabs.remove(PopupId);
    popupmode = false;
    PopupId = null;
    lastUsedTabId = null;
  }else{
    popupmode = false;
    PopupId = null;
    lastUsedTabId = null;
  }
}
  }catch(err){
    console.log(err + '   on background.js(2');
  }
});