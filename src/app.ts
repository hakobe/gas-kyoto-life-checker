/// <reference path="typings/bundle.d.ts" />

var KYOTO_LIFE_SEARCH_URL = 'http://www.kyoto-life.co.jp/search/result/mode/10/lin/763';

var sheet = SpreadsheetApp.getActive().getSheetByName('records');

function search() {
  var html = UrlFetchApp.fetch(KYOTO_LIFE_SEARCH_URL).getContentText();
  var urls = html.match(/.*?bukken-title.*?(\/search\/detail\/\d+).*?/g).map(function(e,i) {
    var m = e.match(/\/search\/detail\/\d+/);
    return 'http://www.kyoto-life.co.jp' + m[0];
  });
  return urls;
}

function addUrl(url: string) {
  sheet.insertRowAfter(1);
  var range = sheet.getRange(2, 1, 1, 8);
  range.setValues([[
    url,
    '= IMPORTXML(A2, "//*[@id=\'main\']/div[1]/div/div/div[1]/div[1]/h2")',
    '= JOIN("", IMPORTXML(A2, "//*[@id=\'main\']/div[1]/div/div/div[1]/div[2]/div[1]/div/div[2]/dl[1]/dd/text()"))',
    '= IMPORTXML(A2, "//*[@id=\'main\']/div[1]/div/div/div[1]/div[2]/div[1]/div/div[1]/dl[1]/dd/span")',
    '= IMPORTXML(A2, "//*[@id=\'main\']/div[1]/div/div/div[1]/div[2]/div[1]/div/div[1]/dl[4]/dd")',
    '= IMPORTXML(A2, "//*[@id=\'main\']/div[1]/div/div/div[1]/div[2]/div[1]/div/div[3]/dl[1]/dd")',
    '= IMPORTXML(A2, "//*[@id=\'main\']/div[1]/div/div/div[1]/div[2]/div[1]/div/div[3]/dl[2]/dd/text() ")',
    '= IMPORTXML(A2, "//*[@id=\'main\']/div[1]/div/div/div[1]/div[2]/div[1]/div/div[3]/dl[2]/dd[2]")',
  ]]);
}

function main() {
  var last = sheet.getLastRow();
  var range = sheet.getRange(2, 1, last);
  var savedUrls = {};
  range.getValues().forEach(function(savedUrl: any) {
    savedUrls[savedUrl] = true;
  });
  Logger.log(savedUrls);

  var newUrls : string[] = [];
  search().reverse().forEach(function(url) {
    if (!savedUrls[url]) {
      addUrl(url);
      newUrls.push(url);
    }
  });
  if (newUrls.length > 0) {
    MailApp.sendEmail('hoge@example.com', 'title', 'body');
  }
}
