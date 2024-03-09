// 気象庁のHPから短期予報解説資料をPDFでダウンロード
function savePDF(fileName, folderId) {
  var url = "https://www.data.jma.go.jp/fcd/yoho/data/jishin/kaisetsu_tanki_latest.pdf";
  var response = UrlFetchApp.fetch(url);

  if (response.getResponseCode() == 200) {
    var blob = response.getBlob();
    var fileName = fileName + ".pdf";
    var folder = DriveApp.getFolderById(folderId);
    var file = folder.createFile(blob.setName(fileName));
    var pdfFileId = file.getId();
    Logger.log("saved PDF");
    Logger.log("  URL : " + file.getUrl());
    Logger.log("  Name: " + fileName);
    return pdfFileId;
  } else {
    Logger.log("failed to save PDF: " + response.getResponseCode());    
  }
}

// PDFをGoogleドキュメントで開き、テキストを抽出
function convertPdfToText(pdfFileId, folderId) {
  var pdfFile = DriveApp.getFileById(pdfFileId);
  var blob = pdfFile.getBlob();
  var resource = {
    title: pdfFile.getName(),
    parents: [{id: folderId}],
    mimeType: MimeType.PLAIN_TEXT
  };
  var converted = Drive.Files.insert(resource, blob, {convert: true});
  var doc = DocumentApp.openById(converted.id);
  var text = doc.getBody().getText();
  var docFile = DriveApp.getFileById(converted.id);
  docFile.setTrashed(true);
  Logger.log(text);
  return text;
}

// テキストを.txtで保存
function saveTEXT(fileName, text, folderId) {
  var folder = DriveApp.getFolderById(folderId);
  var file = folder.createFile(fileName + ".txt", text);
  Logger.log("saved TEXT");
  Logger.log("  URL : " + file.getUrl());
  Logger.log("  Name: " + fileName + ".txt");
}

// テキストから発表日時を抽出
function extractAndFormatDateTime(text) {
  // 全角 --> 半角
  function fullWidthToHalfWidth(str) {
    return str.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }
  // 正規表現
  var regex = /(\d{4})年(\d{1,2})月(\d{1,2})日(\d{1,2})時(\d{1,2})分発表/;
  var textWithHalfWidthNumbers = fullWidthToHalfWidth(text);
  var matches = textWithHalfWidthNumbers.match(regex);

  if (matches) {
    var year = matches[1];
    var month = matches[2];
    var day = matches[3];
    var hour = matches[4];
    var minute = matches[5];
    month = month.padStart(2, '0');
    day = day.padStart(2, '0');
    hour = hour.padStart(2, '0');
    minute = minute.padStart(2, '0');
    var formattedDateTime = year + month + day + "_" + hour + minute;
    return formattedDateTime;
  } else {
    return "日付と時刻の形式が正しくありません。";
  }
}
