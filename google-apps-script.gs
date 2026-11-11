/**
 * Prima potvrde dolaska s pozivnice i upisuje ih u Google tablicu, jednu ispod druge.
 * Zalijepite ovaj kod u: Google tablica → Proširenja → Apps Script.
 */
const SHEET_NAME = 'Potvrde';
const HEADERS = ['Vrijeme', 'Ime i prezime', 'Dolazi', 'Broj osoba', 'Prehrana', 'Poruka'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      clean(d.name),
      clean(d.coming),
      Number(d.guests) || 0,
      clean(d.menu),
      clean(d.message)
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Sprječava da tekst gosta bude protumačen kao formula u tablici.
function clean(v) {
  const s = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
