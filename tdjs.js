function buildUSBDLink(accountIndex, sessionKey, fromDate, toDate) {
  
  return "https://onlinebanking.usbank.com/USB/af(" + sessionKey +
         ")/AccountDashboard/DownloadTrans.ashx?index=" + String(accountIndex)
         + "&from=" + fromDate
         + "&to=" + toDate
         + "&type=csv";
}

function runDownload() {
    
    //Get all loaded downloads
    var adl = $(".account");

    //Find pending item      
    for (var i = 0; i < adl.length; i++) {
      if ($(adl[i]).children(".status").children(".data").text() == "Pending") {
        
        //Set as Downloading
        $(adl[i]).children(".status").children(".data").text("Downloading");
        
        //Click download link
        window.open(String($(adl[i]).children(".download").children("a").attr("href")), "_blank");
        
        //Set next as pending
        if (i + 1 < adl.length) {
          
          $(adl[i + 1]).children(".status").children(".data").text("Pending");
        }
        
        break;
      }
    }
    
    //Check for remaining downloads
    var hasRemaining = false;
    
    for (var i = 0; i < adl.length; i++) {
      if ($(adl[i]).children(".status").children(".data").text() == "Pending") {
        
        hasRemaining = true;
        break;
      }
    }
    
    if (hasRemaining) {
       var intv = Number($("#dlInterval").val());
        intv = (intv < 3 ? 3 : intv)*1000;
            
      setTimeout(runDownload, intv);
    }
}

$(document).ready(function(){
  
  $(".datepicker" ).datepicker();
  
  $("#submitButton").click(function(e) {

    //Load up accounts
    var accounts = JSON.parse(String($("#accountsInput").val()));
    
    //Load up sessionKey
    var sessionKey = $("#sessionInput").val();
    var fromDateString = $("#fromDatePicker").val();
    var toDateString = $("#toDatePicker").val();
    
    for (var i = 0; i < accounts.length; i++) {
      
      if (accounts[i] != "") {
      
        var row = $(".account-template").clone();
        
        row.removeClass("account-template");
        row.addClass("account");
        
        row.children(".accountName").children(".data").text(String(accounts[i]));
        row.children(".accountIndex").children(".data").text(String(i));
        row.children(".download").children("a").attr("href", buildUSBDLink(String(i), sessionKey, fromDateString, toDateString));
        row.children(".startDate").children(".data").text(fromDateString);
        row.children(".endDate").children(".data").text(toDateString);
        
        
        row.removeClass("hidden-element");
        
        row.appendTo($("#processingPanel"));
      }
    }
    
  });
  
  $("#autoDownloadButton").click(function(){
    
    //Get all loaded downloads
    var adl = $(".account");

    //Set as queued    
    for (var i = 0; i < adl.length; i++) {
      
      //Set first as Pending
      if (i == 0) {
        $(adl[i]).children(".status").children(".data").text("Pending");
      }
      else {
        $(adl[i]).children(".status").children(".data").text("Queued");
      }
    }

    var intv = Number($("#dlInterval").val());
    intv = (intv < 3 ? 3 : intv)*1000;
        
    setTimeout(runDownload, intv);
    
  });
  
});