var spreadsheet = SpreadsheetApp.getActive();
/**
 * Get the URL for the Google Apps Script running as a WebApp.
 */
function getScriptUrl() {
 var url = ScriptApp.getService().getUrl();
 return url;
}

/**
 * Get "home page", or a requested page.
 * Expects a 'page' parameter in querystring.
 *
 * @param {event} e Event passed to doGet, with querystring
 * @returns {String/html} Html to be served
 */

function doGet(e) {
  Logger.log( Utilities.jsonStringify(e) );
  if (!e.parameter.page) {
    // When no specific page requested, return "home page"
    return HtmlService.createTemplateFromFile('Home').evaluate().setTitle("Layered Process Audit");
  }
  // else, use page parameter to pick an html file from the script
  return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate();
}

function include( filename ) {
  // https://developers.google.com/apps-script/guides/html/templates
  return HtmlService.createTemplateFromFile(filename)
  .evaluate()
  .setTitle("Layered Process Audit")
  .getContent();
}

function getMail(){
  var mail = Session.getActiveUser().getEmail();
  return mail;
}

function getIndex(value,array){
  for(var i=0;i<array.length;i++){
    if(value === array[i].toString()){
      return i;
    }
  }
}

function getAuditorTask(){
  var sheet = spreadsheet.getSheetByName("Auditor information");
  var range = sheet.getRange("D:D");
  var value = range.getValues();

  var mail = getMail();
  var index = getIndex(mail, value);

  var task = sheet.getRange(index+1, 1).getValue();
  return task;
}

function getOrganization(){
  var sheet = spreadsheet.getSheetByName("Auditor information");
  var value = sheet.getRange("A:D").getValues();
  Logger.log(value);
  return value;
}
