/**
 * M&M&CO website - Google Sheets sync backend
 *
 * SETUP (one time, in your Google Sheet):
 * 1. In your Sheet, open Extensions > Apps Script.
 * 2. Delete whatever is in Code.gs and paste this entire file.
 * 3. Your Sheet ID is already filled in at the top - leave it as it is.
 * 4. Click Save.
 * 5. Click Deploy > New deployment > Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Send the Web app URL to the website maintainer.
 *
 * The script creates its own worksheet called "WebsiteData".
 * Your existing worksheets are left untouched.
 */

var SHEET_ID = '1RMGsuXXfmq1ni4TIgwaTqvXW3heHiEwszxNGLCk6Eyo';
var DATA_SHEET = 'WebsiteData';

function getDataSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(DATA_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(DATA_SHEET);
    sheet.appendRow(['key', 'value', 'updated']);
  }
  return sheet;
}

function readAll_() {
  var sheet = getDataSheet_();
  var rows = sheet.getDataRange().getValues();
  var out = {};
  for (var i = 1; i < rows.length; i++) {
    var key = String(rows[i][0] || '').trim();
    if (!key) continue;
    out[key] = {
      value: String(rows[i][1] || ''),
      updated: String(rows[i][2] || '')
    };
  }
  return out;
}

function writeOne_(key, value) {
  var sheet = getDataSheet_();
  var rows = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === key) {
      rowIndex = i + 1;
      break;
    }
  }
  var row = [key, String(value), new Date().toISOString()];
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, 3).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
}

/** Read endpoint. Returns JSONP so the static website can read it cross-origin. */
function doGet(e) {
  var params = (e && e.parameter) || {};
  var callback = String(params.cb || 'callback').replace(/[^A-Za-z0-9_$]/g, '');
  if (!callback) callback = 'callback';
  var payload = {
    ok: true,
    action: params.action || 'read',
    data: readAll_()
  };
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(payload) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/** Write endpoint. Accepts a hidden form POST with a "payload" field. */
function doPost(e) {
  var raw = '';
  try {
    raw = (e && e.parameter && e.parameter.payload) || (e && e.postData && e.postData.contents) || '';
  } catch (err) {}
  var obj = {};
  try { obj = JSON.parse(raw); } catch (err) { obj = {}; }
  if (obj && obj.key && typeof obj.value === 'string') {
    writeOne_(obj.key, obj.value);
    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  }
  return ContentService.createTextOutput('ERR').setMimeType(ContentService.MimeType.TEXT);
}
