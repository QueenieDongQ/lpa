var spreadsheet = SpreadsheetApp.getActive();

var dailyPlan = spreadsheet.getSheetByName("Layered Audit Plan- Daily");
var weeklyPlan = spreadsheet.getSheetByName("Layered Audit Plan- Weekly  IS Edit Use");
var monthlyPlan = spreadsheet.getSheetByName("Layered Audit Plan- Monthly");

var dailyChecklist = spreadsheet.getSheetByName("Layered Audit Checklist -Daily");
var weeklyChecklist = spreadsheet.getSheetByName("Layered Audit Checklist- Weekly");
var monthlyChecklist = spreadsheet.getSheetByName("Layered Audit Checklist -Monthly&Quartely");

var authorInfomation = spreadsheet.getSheetByName("Auditor information");
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
  return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate().setTitle("Layered Process Audit");
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

//return the index of value
function getIndex(value,array){
  for(var i=0;i<array.length;i++){
    if(value === array[i].toString()){
      return i;
    }
  }
}

function getAuditorTask(){
  var sheet = authorInfomation;
  var range = sheet.getRange("D:D");
  var value = range.getValues();

  var mail = getMail();
  var index = getIndex(mail, value);
  Logger.log(index);
  var task ="";
  if(index!=""){
    var task = sheet.getRange(index+1, 1).getValue();
  }
  else{
    task="NOTinList";
  }
   Logger.log(task);
  return task;
}

function getOrganization(){
  var sheet = authorInfomation;
  var maxRow = sheet.getLastRow();
  var value = sheet.getRange("A1:D"+maxRow).getValues();
  Logger.log(value);
  return value;
}


/*找到 PSQ01-03 生产线及工序对照表 中产线对应的APU
因为表中许多处地方都merge了cells 因此对应起来 只有第一个cell有值，产线需要去找到对应的APU
getIndex -- 找到产线所在行数
cellVall -- 对应到APU*/
//function getAPU(line){
//  var lineSheet = SpreadsheetApp.openById("1SKJo9OOOK49pLkj5OFkD5oXwTg3x-7J5BKkg0uQp81E").getSheetByName("生产线名标准化");
//  var maxRow = lineSheet.getLastRow();
//  var range = lineSheet.getRange("B3:B"+maxRow);
//  var value = range.getValues();
////  Logger.log(line);
////  var a = "";
//  var index = getIndex(line ,value );
////  Logger.log(index);
//  var apu = cellVal("A"+(index+3));
////  Logger.log(apu);
//  return apu;
//
//}
//function cellVal(cellAddress) {
//  var cell = SpreadsheetApp.openById("1SKJo9OOOK49pLkj5OFkD5oXwTg3x-7J5BKkg0uQp81E").getSheetByName("生产线名标准化").getRange(cellAddress);
//  return (cell.isPartOfMerge() ? cell.getMergedRanges()[0].getCell(1, 1) : cell).getValue();
//}
///*查找结束  END*/

function get_apu_Line(name){
  name = "weekly";
  switch(name){
    case "daily":
      var sheet = dailyPlan;
      break;
    case "weekly":
      var sheet = weeklyPlan;
      break;
    case "monthly":
      var sheet = monthlyPlan;
      break;
  }

  var maxRow = sheet.getLastRow(),
      range = sheet.getRange("A3:B"+maxRow),
      value = range.getValues(),
      wks = sheet.getRange("E3:E"+maxRow).getValues();

  wks=[].concat.apply([],wks);
  var apu=[],weeks=[];
  for(var i=0;i<value.length;i++){

    if(apu.indexOf(value[i][0]) == -1){
       apu.push(value[i][0]);
    }
  }
  Logger.log(wks);
  return [apu,value,wks];
}

function getChecklistPage(name){
  name = "weekly";
  switch(name){
    case "daily":
      var sheet = dailyChecklist;
      break;
    case "weekly":
      var sheet = weeklyChecklist;
      break;
    case "monthly":
      var sheet = monthlyChecklist;
      break;
  }

  var maxRow = sheet.getLastRow();
  var range = sheet.getRange("B4:C"+(maxRow-1));
  var value = range.getValues();

  var index=0,arr=[],items=[],requirements=[];
  for(var i=0;i<value.length;i++){
    var item = value[i][0];
    requirements.push(value[i][1]);//get array of requirements
    if(item!=""){
      index=index+1;
      arr[i]=index;    //get  coordinate array for requirements
      items.push(item); //get array of Audit items
    }
    if(item==""){
      arr[i]=index;
    }
  }

  var info = [items,arr,requirements];
  Logger.log(info);
  return info;
}
