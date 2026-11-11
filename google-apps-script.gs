/**
 * Popis gostiju + personalizirane pozivnice + potvrde dolaska.
 * Zalijepite ovaj kod u: Google tablica → Proširenja → Apps Script.
 *
 * List „Gosti”: upišete Ime i prezime + Mobitel, a skripta sama doda gumb „Pošalji”.
 * Klik na „Pošalji” označi pozivnicu kao poslanu i otvori WhatsApp s gotovom porukom.
 * Kad gost otvori pozivnicu, upiše se „Otvoreno”; kad potvrdi, upiše se odgovor.
 */

// ✏️ 1) Adresa pozivnice
const INVITE_URL = 'https://barbararacki.github.io/Pozivnica-za-vjencanje/';
// ✏️ 2) Nakon prve implementacije ovdje zalijepite URL web-aplikacije (…/exec) i spremite
const WEB_APP_URL = '';
// ✏️ 3) Tekst WhatsApp poruke. {ime} i {link} se zamijene automatski.
const MESSAGE =
  '{ime}, s velikim veseljem pozivamo vas na naše vjenčanje 17. srpnja 2027.! 💍\n\n' +
  'Ovdje je vaša pozivnica, molimo vas da na njoj potvrdite dolazak:\n{link}\n\n' +
  'Dora i Filip';

const SHEET_NAME = 'Gosti';
const HEADERS = ['Ime i prezime', 'Mobitel', 'Pošalji', 'Poslano', 'Otvoreno',
                 'Dolazi', 'Broj osoba', 'Prehrana', 'Poruka', 'Potvrđeno', 'ID'];
const COL = { name: 1, phone: 2, send: 3, sent: 4, opened: 5, coming: 6,
              guests: 7, menu: 8, msg: 9, confirmed: 10, id: 11 };

/* ---------- Postavljanje ---------- */

// Pokrenite jednom (▶ Pokreni) — napravi list „Gosti” i zatraži dozvole.
function postavi() {
  const sheet = getSheet();
  pripremiSve();
  return sheet.getName();
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('💌 Pozivnica')
    .addItem('Pripremi gumbe za slanje', 'pripremiSve')
    .addToUi();
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME, 0);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#f3ead9');
    sheet.setFrozenRows(1);
    sheet.getRange('B:B').setNumberFormat('@');           // mobitel kao tekst (čuva nulu)
    sheet.getRange('D:E').setNumberFormat('d.m.yyyy. H:mm');
    sheet.getRange('J:J').setNumberFormat('d.m.yyyy. H:mm');
    sheet.setColumnWidth(COL.name, 200);
    sheet.setColumnWidth(COL.msg, 250);
  }
  return sheet;
}

/* ---------- Automatski gumb „Pošalji” kad upišete gosta ---------- */

function onEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  const first = Math.max(2, e.range.getRow());
  const last = e.range.getLastRow();
  if (e.range.getColumn() > COL.phone) return;
  for (let r = first; r <= last; r++) prepareRow(sheet, r);
}

function pripremiSve() {
  const sheet = getSheet();
  for (let r = 2; r <= sheet.getLastRow(); r++) prepareRow(sheet, r);
}

function prepareRow(sheet, row) {
  const name = String(sheet.getRange(row, COL.name).getValue()).trim();
  if (!name) return;
  let id = String(sheet.getRange(row, COL.id).getValue()).trim();
  if (!id) {
    id = Utilities.getUuid().replace(/-/g, '').slice(0, 10);
    sheet.getRange(row, COL.id).setValue(id);
  }
  const cell = sheet.getRange(row, COL.send);
  if (!WEB_APP_URL) { cell.setValue('⚠ upišite WEB_APP_URL u skriptu'); return; }
  cell.setFormula('=HYPERLINK("' + WEB_APP_URL + '?send=' + id + '";"📲 Pošalji")');
}

/* ---------- Web-aplikacija ---------- */

function doGet(e) {
  const p = e.parameter || {};
  if (p.send) return sendPage(p.send);
  if (p.open) {
    const sheet = getSheet();
    const row = findRow(sheet, p.open);
    if (row && !sheet.getRange(row, COL.opened).getValue()) sheet.getRange(row, COL.opened).setValue(new Date());
    return json({ ok: true });
  }
  return json({ ok: true });
}

function sendPage(id) {
  const sheet = getSheet();
  const row = findRow(sheet, id);
  if (!row) return page('<p>Gost nije pronađen.</p>');
  const name = String(sheet.getRange(row, COL.name).getValue()).trim();
  const phone = normalizePhone(sheet.getRange(row, COL.phone).getValue());
  if (!phone) return page('<p>Za gosta <b>' + esc(name) + '</b> nije upisan broj mobitela.</p>');

  const link = INVITE_URL + '?g=' + id + '&n=' + encodeURIComponent(name);
  const text = MESSAGE.replace('{ime}', name).replace('{link}', link);
  const wa = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);

  if (!sheet.getRange(row, COL.sent).getValue()) sheet.getRange(row, COL.sent).setValue(new Date());

  return page(
    '<p>Pozivnica za <b>' + esc(name) + '</b> je označena kao poslana ✓</p>' +
    '<a class="btn" href="' + esc(wa) + '" target="_top">Otvori WhatsApp</a>' +
    '<p class="small">U WhatsAppu samo dodirnite „Pošalji”.</p>'
  );
}

// Potvrda dolaska s pozivnice
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    let row = d.id ? findRow(sheet, d.id) : 0;
    if (!row) {                                   // gost bez osobne poveznice
      sheet.appendRow([clean(d.name)]);
      row = sheet.getLastRow();
      sheet.getRange(row, COL.id).setValue(Utilities.getUuid().replace(/-/g, '').slice(0, 10));
    }
    sheet.getRange(row, COL.coming, 1, 5).setValues([[
      clean(d.coming), Number(d.guests) || 0, clean(d.menu), clean(d.message), new Date()
    ]]);
    sheet.getRange(row, COL.coming).setBackground(d.coming === 'DA' ? '#d9ead3' : '#f4cccc');
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Pomoćne funkcije ---------- */

function findRow(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const ids = sheet.getRange(2, COL.id, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

// 091 722 1056 → 385917221056 ; +385 91… → 38591… ; 00385… → 385…
function normalizePhone(v) {
  let s = String(v || '').replace(/\D/g, '');
  if (!s) return '';
  if (s.startsWith('00')) s = s.slice(2);
  else if (s.startsWith('0')) s = '385' + s.slice(1);
  else if (s.length <= 9) s = '385' + s;          // npr. 917221056 (izgubljena nula)
  return s;
}

function clean(v) {
  const s = String(v == null ? '' : v).slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function page(body) {
  return HtmlService.createHtmlOutput(
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>body{font-family:Georgia,serif;text-align:center;padding:40px 20px;background:#faf6f0;color:#3d3530;font-size:20px}' +
    '.btn{display:inline-block;margin:20px 0;padding:16px 32px;border-radius:40px;background:#25d366;color:#fff;text-decoration:none;font-family:sans-serif;font-size:20px}' +
    '.small{color:#8a7d72;font-size:16px}</style>' + body
  ).setTitle('Pošalji pozivnicu');
}
