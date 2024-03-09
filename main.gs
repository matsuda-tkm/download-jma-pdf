function main() {
  var pdfFolderId = "1bgjPL8ksPGbhB0dF26admMy24jmL2pOC";
  var txtFolderId = "1K6VILi33MyrTeNAm_n6uJzu3_QNg1QOE";
  var now = new Date();
  var timeZone = Session.getScriptTimeZone();
  var format = "yyyyMMdd_HHmmss";
  var fileName = Utilities.formatDate(now, timeZone, format);
  var fileId = savePDF(fileName, pdfFolderId);
  var text = convertPdfToText(fileId, pdfFolderId);
  saveTEXT(extractAndFormatDateTime(text), text, txtFolderId);
}