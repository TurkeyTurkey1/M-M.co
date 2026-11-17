/**
 * Year 10 SEPEP Netball — Live Ladder & Schedule
 * Google Sheets + Apps Script backend.
 *
 * Quick start:
 * 1. Create a blank Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Paste this whole file over Code.gs. It already contains the app HTML.
 * 4. Deploy > New deployment > Web app.
 * 5. Execute as: Me. Who has access: choose based on your school privacy needs.
 * 6. Open the web app URL. The first run creates and seeds the tabs.
 *
 * If this script is NOT bound to a spreadsheet, paste the Sheet ID below
 * (the long id in https://docs.google.com/spreadsheets/d/THIS_PART/edit).
 */
const SPREADSHEET_ID = '';

const SHEETS = {
  TEAMS: 'Teams',
  FIXTURES: 'Fixtures',
  ROLES: 'Roles',
  SETTINGS: 'Settings',
  LADDER: 'Ladder',
  AUDIT: 'AuditLog'
};

const CORE_ROLES = [
  'Technical Coach / Captain',
  'Tactical Coach / Vice-Captain',
  'Fitness Coach',
  'Umpire / Referee',
  'Scorer / Timekeeper',
  'Media / Publicist',
  'Equipment Manager'
];

const DEFAULT_EDIT_KEY = 'sepep-netball';
const TEAM_SEED = [
  { id: 'team-1', slot: 1, className: 'DUNC', name: 'M&M&CO', motto: 'Taste the Rainbow', chant: 'M! M! M&M! IT IS US, HERE WE GO AGAIN', uniform: 'Plain coloured shirt with a white M in posca pen', mascot: 'Official M&M characters', website: '' },
  { id: 'team-2', slot: 2, className: 'DUNC', name: 'PINKISH', motto: 'On Wednesdays we wear pink', chant: "We're pink donuts, full attack, eat our sprinkles, watch your back, coming in hot, blazing the game watch far our trail, its in the name! sweet but lazy, just kidding baby, pink donut club, we're driving Y'all CRAZY!", uniform: 'Girls: Pink ribbons, black shorts, school PE shirt / AADP. Boys: Pink socks, black shorts, school PE shirt / AADP.', mascot: 'Pink Donut inflatable', website: '' },
  { id: 'team-3', slot: 3, className: 'ROLN', name: 'The Dewgs', motto: 'I am the DEWG', chant: 'Dewgy, Dewgy - Roof, Roof, Roof. We will, we will, win by far; watch us, watch us, we will win. We will fight for victory, go DEWGS!', uniform: 'PE uniform + purple tutu', mascot: 'Not listed', website: '' },
  { id: 'team-4', slot: 4, className: 'ROLN', name: 'Team 4', motto: 'Play fast. Step quick. Dominate the game in a flick.', chant: 'Not listed', uniform: 'PE uniform + blue accessories', mascot: 'Not listed', website: '' }
];

const ROLE_SEED = [
  ['team-1', 'Macca', 'Technical Coach / Captain', 'technical captain'],
  ['team-1', 'Maddie', 'Technical Coach / Captain', 'technical coach/vice captain'],
  ['team-1', 'Max', 'Tactical Coach / Vice-Captain', 'tactical coach'],
  ['team-1', 'Micah', 'Tactical Coach / Vice-Captain', 'tactical coach/vice captain'],
  ['team-1', 'Mia', 'Fitness Coach', 'warmups'],
  ['team-1', 'Ella', 'Umpire / Referee', 'umpire'],
  ['team-1', 'Wil', 'Umpire / Referee', 'umpire'],
  ['team-1', 'Grace', 'Scorer / Timekeeper', 'score/timer'],
  ['team-1', 'Charlotte', 'Media / Publicist', 'publicist'],
  ['team-1', 'Alex', 'Equipment Manager', 'equipment manager'],
  ['team-1', 'Jack', 'Unassigned', 'not assigned'],

  ['team-2', 'Evie', 'Technical Coach / Captain', 'captain/technical coach'],
  ['team-2', 'Milly', 'Tactical Coach / Vice-Captain', 'vice captain/tactical coach'],
  ['team-2', 'Amelia', 'Fitness Coach', 'fitness coach'],
  ['team-2', 'Tom', 'Umpire / Referee', 'umpire'],
  ['team-2', 'Torza', 'Umpire / Referee', 'umpire'],
  ['team-2', 'Sybella', 'Scorer / Timekeeper', 'scorer/timekeeper'],
  ['team-2', 'Jasmine', 'Media / Publicist', 'media'],
  ['team-2', 'Lachie', 'Media / Publicist', 'publicist'],
  ['team-2', 'Kabe', 'Equipment Manager', 'equipment manager'],

  ['team-3', 'Nate', 'Technical Coach / Captain', 'technical coach/captain'],
  ['team-3', 'Yiheng', 'Technical Coach / Captain', 'technical coach'],
  ['team-3', 'Bella', 'Tactical Coach / Vice-Captain', 'tactical coach/vice'],
  ['team-3', 'Eve', 'Tactical Coach / Vice-Captain', 'tactical coach'],
  ['team-3', 'Cody', 'Fitness Coach', 'fitness coach'],
  ['team-3', 'Amber', 'Umpire / Referee', 'umpire'],
  ['team-3', 'Levi', 'Umpire / Referee', 'umpire'],
  ['team-3', 'Emily', 'Scorer / Timekeeper', 'scorer'],
  ['team-3', 'Ava', 'Media / Publicist', 'publicist'],
  ['team-3', 'Zofia', 'Equipment Manager', 'equipment manager'],

  ['team-4', 'Lachlan', 'Technical Coach / Captain', 'technical coach'],
  ['team-4', 'Riley', 'Technical Coach / Captain', 'technical coach'],
  ['team-4', 'Sav', 'Tactical Coach / Vice-Captain', 'tactical coach'],
  ['team-4', 'Harper', 'Tactical Coach / Vice-Captain', 'tactical coach'],
  ['team-4', 'Maya', 'Fitness Coach', 'fitness coach'],
  ['team-4', 'Jesse', 'Fitness Coach', 'fitness coach'],
  ['team-4', 'Jenson', 'Umpire / Referee', 'umpire'],
  ['team-4', 'Ryder', 'Umpire / Referee', 'umpire'],
  ['team-4', 'Asha', 'Scorer / Timekeeper', 'scorer/timer'],
  ['team-4', 'Bella', 'Media / Publicist', 'media'],
  ['team-4', 'Liam', 'Equipment Manager', 'equipment manager']
];

const FIXTURE_SEED = [
  { id: 'fixture-g3', round: 3, week: 'Week 4', date: '', time: '', court: '', homeTeamId: 'team-1', awayTeamId: 'team-3', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
  { id: 'fixture-g4', round: 4, week: 'Week 4', date: '', time: '', court: '', homeTeamId: 'team-2', awayTeamId: 'team-4', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
  { id: 'fixture-g7', round: 7, week: 'Week 5', date: '', time: '', court: '', homeTeamId: 'team-1', awayTeamId: 'team-4', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
  { id: 'fixture-g8', round: 8, week: 'Week 5', date: '', time: '', court: '', homeTeamId: 'team-2', awayTeamId: 'team-3', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
  { id: 'fixture-g9', round: 9, week: 'Week 6', date: '', time: '', court: '', homeTeamId: 'team-1', awayTeamId: 'team-2', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
  { id: 'fixture-g10', round: 10, week: 'Week 6', date: '', time: '', court: '', homeTeamId: 'team-3', awayTeamId: 'team-4', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' }
];

const SETTINGS_SEED = [
  ['competition_name', 'Year 10 SEPEP Netball'],
  ['competition_label', 'Combined DUNC + ROLN'],
  ['season', '2026 SEPEP'],
  ['ladder_note', 'No premiership points are awarded. Ladder is ranked by wins, then goal percentage, then goals for, then head-to-head.'],
  ['edit_key', DEFAULT_EDIT_KEY],
  ['updated_at', new Date().toISOString()]
];

function doGet() {
  try {
    ensureReady_();
  } catch (error) {
    console.warn('SEPEP setup check failed: ' + (error && error.message ? error.message : error));
  }
  return HtmlService.createHtmlOutput(getAppHtml_())
    .setTitle('Year 10 SEPEP Netball — Live Ladder & Schedule')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Returns the app HTML.
 *
 * First it looks for a real HTML file in the project (SEPEP, Index, or the
 * same names with .html kept in them). If none of those exist or the file is
 * empty/partial, it returns the embedded copy at the bottom of this file.
 * That means the web app can never come up blank because of a file name.
 */
function getAppHtml_() {
  const candidates = ['SEPEP', 'SEPEP.html', 'Index', 'Index.html', 'SEPEP.html.html', 'Index.html.html'];
  const attempted = [];
  for (let i = 0; i < candidates.length; i++) {
    try {
      const content = HtmlService.createTemplateFromFile(candidates[i]).evaluate().getContent() || '';
      if (content.length > 5000 && /<body[\s>]/i.test(content) && /<\/html>/i.test(content)) {
        return content;
      }
      attempted.push(candidates[i] + ' (empty or incomplete)');
    } catch (error) {
      attempted.push(candidates[i] + ' (not found)');
    }
  }
  console.warn('SEPEP: using the embedded app HTML. Looked for: ' + attempted.join(' | '));
  return APP_HTML;
}

/**
 * Run this from the Apps Script editor (select debugApp, click Run) to see
 * which HTML file the web app will use. Open View > Logs / Executions.
 */
function debugApp() {
  const candidates = ['SEPEP', 'SEPEP.html', 'Index', 'Index.html', 'SEPEP.html.html', 'Index.html.html'];
  candidates.forEach(function(name) {
    try {
      const content = HtmlService.createTemplateFromFile(name).evaluate().getContent() || '';
      console.log(name + ': FOUND, ' + content.length + ' characters, complete: ' + (content.length > 5000 && /<body[\s>]/i.test(content) && /<\/html>/i.test(content)));
    } catch (error) {
      console.log(name + ': not found');
    }
  });
  console.log('Embedded fallback: ' + APP_HTML.length + ' characters');
}

/**
 * Run this from the Apps Script editor (select debugSetup, click Run) to see
 * exactly why the web app cannot read the Sheet. Open View > Logs.
 */
function debugSetup() {
  try {
    const ss = getSpreadsheet_();
    console.log('Spreadsheet OK: ' + ss.getName() + ' | id: ' + ss.getId());
    ensureReady_();
    const tabs = ss.getSheets().map(function(sheet) { return sheet.getName(); });
    console.log('Tabs: ' + tabs.join(', '));
    ['Teams', 'Fixtures', 'Roles', 'Settings', 'Ladder'].forEach(function(name) {
      const sheet = ss.getSheetByName(name);
      console.log(name + ': ' + (sheet ? sheet.getLastRow() + ' rows' : 'MISSING'));
    });
    const data = getCompetitionData();
    console.log('Teams: ' + data.teams.length + ', fixtures: ' + data.fixtures.length + ', roles: ' + data.roles.length + ', ladder: ' + data.ladder.length);
    console.log('Everything works. The web app should load now.');
  } catch (error) {
    console.error('SETUP ERROR: ' + (error && error.message ? error.message : error));
    console.error(error && error.stack ? error.stack : '');
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SEPEP Netball')
    .addItem('Check setup', 'checkSetup')
    .addItem('Refresh Ladder tab', 'refreshLadderFromMenu')
    .addSeparator()
    .addItem('Reset to starter data…', 'resetToSeedFromMenu')
    .addToUi();
}

function checkSetup() {
  const ss = getSpreadsheet_();
  ensureReady_();
  SpreadsheetApp.getUi().alert('Setup looks good.\n\nSheet: ' + ss.getName() + '\nTeams: ' + readObjects_(ss.getSheetByName(SHEETS.TEAMS)).length + '\nFixtures: ' + readObjects_(ss.getSheetByName(SHEETS.FIXTURES)).length + '\nRole assignments: ' + readObjects_(ss.getSheetByName(SHEETS.ROLES)).length);
}

function refreshLadderFromMenu() {
  const ss = getSpreadsheet_();
  refreshLadder_(ss);
  SpreadsheetApp.getUi().alert('Ladder tab refreshed.');
}

function resetToSeedFromMenu() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert('Reset to starter data?', 'This replaces Teams, Fixtures, Roles and Settings with the Year 10 SEPEP starter data. Ladder and AuditLog will be rebuilt/appended.', ui.ButtonSet.YES_NO);
  if (response !== ui.Button.YES) return;
  const ss = getSpreadsheet_();
  resetToSeed_(ss);
  ui.alert('Starter data restored.');
}

function getCompetitionData() {
  const ss = getSpreadsheet_();
  ensureReady_();
  const teams = readObjects_(ss.getSheetByName(SHEETS.TEAMS));
  const fixtures = readObjects_(ss.getSheetByName(SHEETS.FIXTURES));
  const roles = readObjects_(ss.getSheetByName(SHEETS.ROLES));
  const settings = readSettings_(ss.getSheetByName(SHEETS.SETTINGS));
  const publicSettings = {};
  Object.keys(settings).forEach(function(key) {
    if (key !== 'edit_key') publicSettings[key] = settings[key];
  });
  return {
    teams: teams,
    fixtures: fixtures,
    roles: roles,
    settings: publicSettings,
    coreRoles: CORE_ROLES,
    ladder: computeStandings_(teams, fixtures),
    generatedAt: new Date().toISOString()
  };
}

function verifyEditKey(key) {
  const ss = getSpreadsheet_();
  ensureReady_();
  return String(key || '') === String(readSettings_(ss.getSheetByName(SHEETS.SETTINGS)).edit_key || DEFAULT_EDIT_KEY);
}

function saveFixture(key, fixture) {
  const ss = getSpreadsheet_();
  requireEditKey_(ss, key);
  if (!fixture || typeof fixture !== 'object') throw new Error('Fixture data is missing.');

  const teams = readObjects_(ss.getSheetByName(SHEETS.TEAMS));
  const teamIds = teams.map(function(team) { return String(team.id); });
  const saved = sanitiseFixture_(fixture, teamIds);
  const sheet = ss.getSheetByName(SHEETS.FIXTURES);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(String);
  const idIndex = headers.indexOf('id');
  let rowNumber = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === saved.id) {
      rowNumber = i + 1;
      break;
    }
  }

  const values = headers.map(function(header) { return saved[header] !== undefined ? saved[header] : ''; });
  if (rowNumber === -1) {
    sheet.appendRow(values);
    setTextFormat_(sheet, sheet.getLastRow(), 1, headers.length);
    appendAudit_(ss, 'fixture.created', saved.id + ' — ' + saved.week + ' Game ' + saved.round);
  } else {
    sheet.getRange(rowNumber, 1, 1, headers.length).setValues([values]);
    setTextFormat_(sheet, rowNumber, 1, headers.length);
    appendAudit_(ss, 'fixture.updated', saved.id + ' — ' + saved.homeTeamId + ' vs ' + saved.awayTeamId + ' — ' + saved.status);
  }
  refreshLadder_(ss);
  return getCompetitionData();
}

function deleteFixture(key, fixtureId) {
  const ss = getSpreadsheet_();
  requireEditKey_(ss, key);
  const sheet = ss.getSheetByName(SHEETS.FIXTURES);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(String);
  const idIndex = headers.indexOf('id');
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(fixtureId)) {
      sheet.deleteRow(i + 1);
      appendAudit_(ss, 'fixture.deleted', String(fixtureId));
      refreshLadder_(ss);
      return getCompetitionData();
    }
  }
  throw new Error('Fixture not found.');
}

function saveTeamWebsite(key, teamId, website) {
  const ss = getSpreadsheet_();
  requireEditKey_(ss, key);
  const sheet = ss.getSheetByName(SHEETS.TEAMS);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(String);
  const idIndex = headers.indexOf('id');
  const websiteIndex = headers.indexOf('website');
  if (websiteIndex === -1) throw new Error('Teams sheet is missing the website column.');
  const clean = sanitiseUrl_(website);
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(teamId)) {
      sheet.getRange(i + 1, websiteIndex + 1).setValue(clean);
      appendAudit_(ss, 'team.website.updated', String(teamId) + ' — ' + (clean || '(blank)'));
      return getCompetitionData();
    }
  }
  throw new Error('Team not found.');
}

function replaceCompetitionData(key, backup) {
  const ss = getSpreadsheet_();
  requireEditKey_(ss, key);
  if (!backup || !Array.isArray(backup.teams) || !Array.isArray(backup.fixtures) || !Array.isArray(backup.roles)) {
    throw new Error('Backup must include teams, fixtures and roles arrays.');
  }
  writeObjects_(ss.getSheetByName(SHEETS.TEAMS), backup.teams, ['id', 'slot', 'className', 'name', 'motto', 'chant', 'uniform', 'mascot', 'website']);
  writeObjects_(ss.getSheetByName(SHEETS.FIXTURES), backup.fixtures, ['id', 'round', 'week', 'date', 'time', 'court', 'homeTeamId', 'awayTeamId', 'status', 'homeScore', 'awayScore', 'notes']);
  writeObjects_(ss.getSheetByName(SHEETS.ROLES), backup.roles, ['teamId', 'player', 'role', 'detail']);
  if (backup.settings && typeof backup.settings === 'object') {
    const current = readSettings_(ss.getSheetByName(SHEETS.SETTINGS));
    Object.keys(backup.settings).forEach(function(settingKey) {
      if (settingKey !== 'edit_key') current[settingKey] = String(backup.settings[settingKey]);
    });
    writeSettings_(ss.getSheetByName(SHEETS.SETTINGS), current);
  }
  appendAudit_(ss, 'backup.imported', 'Full competition data replaced from uploaded backup');
  refreshLadder_(ss);
  return getCompetitionData();
}

function ensureReady_() {
  const ss = getSpreadsheet_();
  Object.keys(SHEETS).forEach(function(name) {
    const sheetName = SHEETS[name];
    if (!ss.getSheetByName(sheetName)) ss.insertSheet(sheetName);
  });
  let seeded = false;
  if (isSheetEmpty_(ss.getSheetByName(SHEETS.TEAMS))) {
    writeObjects_(ss.getSheetByName(SHEETS.TEAMS), TEAM_SEED, ['id', 'slot', 'className', 'name', 'motto', 'chant', 'uniform', 'mascot', 'website']);
    seeded = true;
  }
  if (isSheetEmpty_(ss.getSheetByName(SHEETS.ROLES))) {
    writeObjects_(ss.getSheetByName(SHEETS.ROLES), ROLE_SEED.map(function(row) { return { teamId: row[0], player: row[1], role: row[2], detail: row[3] }; }), ['teamId', 'player', 'role', 'detail']);
    seeded = true;
  }
  if (isSheetEmpty_(ss.getSheetByName(SHEETS.FIXTURES))) {
    writeObjects_(ss.getSheetByName(SHEETS.FIXTURES), FIXTURE_SEED, ['id', 'round', 'week', 'date', 'time', 'court', 'homeTeamId', 'awayTeamId', 'status', 'homeScore', 'awayScore', 'notes']);
    seeded = true;
  }
  if (isSheetEmpty_(ss.getSheetByName(SHEETS.SETTINGS))) writeSettings_(ss.getSheetByName(SHEETS.SETTINGS), arrayToSettings_(SETTINGS_SEED));
  if (seeded) refreshLadder_(ss);
}

function resetToSeed_(ss) {
  writeObjects_(ss.getSheetByName(SHEETS.TEAMS), TEAM_SEED, ['id', 'slot', 'className', 'name', 'motto', 'chant', 'uniform', 'mascot', 'website']);
  writeObjects_(ss.getSheetByName(SHEETS.FIXTURES), FIXTURE_SEED, ['id', 'round', 'week', 'date', 'time', 'court', 'homeTeamId', 'awayTeamId', 'status', 'homeScore', 'awayScore', 'notes']);
  writeObjects_(ss.getSheetByName(SHEETS.ROLES), ROLE_SEED.map(function(row) { return { teamId: row[0], player: row[1], role: row[2], detail: row[3] }; }), ['teamId', 'player', 'role', 'detail']);
  const existingSettings = readSettings_(ss.getSheetByName(SHEETS.SETTINGS));
  const nextSettings = arrayToSettings_(SETTINGS_SEED);
  if (existingSettings.edit_key) nextSettings.edit_key = existingSettings.edit_key;
  writeSettings_(ss.getSheetByName(SHEETS.SETTINGS), nextSettings);
  appendAudit_(ss, 'seed.reset', 'Starter data restored');
  refreshLadder_(ss);
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error('No active spreadsheet found. Bind the Apps Script project to a Google Sheet, or set SPREADSHEET_ID at the top of Code.gs.');
}

function requireEditKey_(ss, key) {
  const settings = readSettings_(ss.getSheetByName(SHEETS.SETTINGS));
  if (String(key || '') !== String(settings.edit_key || DEFAULT_EDIT_KEY)) {
    throw new Error('Edit key is incorrect.');
  }
}

function sanitiseFixture_(fixture, teamIds) {
  const id = String(fixture.id || ('fixture-' + Date.now())).trim().slice(0, 80);
  const homeTeamId = String(fixture.homeTeamId || '').trim();
  const awayTeamId = String(fixture.awayTeamId || '').trim();
  if (teamIds.indexOf(homeTeamId) === -1 || teamIds.indexOf(awayTeamId) === -1) throw new Error('Choose valid home and away teams.');
  if (homeTeamId === awayTeamId) throw new Error('A team cannot play itself.');

  const status = String(fixture.status || 'Scheduled');
  const allowedStatus = ['Scheduled', 'Live', 'Final', 'Postponed'];
  if (allowedStatus.indexOf(status) === -1) throw new Error('Status must be Scheduled, Live, Final or Postponed.');

  const round = Number(fixture.round || 0);
  if (!isFinite(round) || round < 1) throw new Error('Round must be a positive number.');

  let homeScore = fixture.homeScore === '' ? '' : Number(fixture.homeScore);
  let awayScore = fixture.awayScore === '' ? '' : Number(fixture.awayScore);
  if (homeScore !== '' && (!isFinite(homeScore) || homeScore < 0)) throw new Error('Home score must be zero or more.');
  if (awayScore !== '' && (!isFinite(awayScore) || awayScore < 0)) throw new Error('Away score must be zero or more.');
  if (status === 'Final' && (homeScore === '' || awayScore === '')) throw new Error('Final fixtures need both scores.');

  return {
    id: id,
    round: Math.floor(round),
    week: safeText_(fixture.week || 'Week', 80),
    date: safeText_(fixture.date || '', 40),
    time: safeText_(fixture.time || '', 40),
    court: safeText_(fixture.court || '', 80),
    homeTeamId: homeTeamId,
    awayTeamId: awayTeamId,
    status: status,
    homeScore: homeScore,
    awayScore: awayScore,
    notes: safeText_(fixture.notes || '', 500)
  };
}

function safeText_(value, maxLength) {
  let text = String(value == null ? '' : value).trim();
  if (text.length > maxLength) text = text.slice(0, maxLength);
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function sanitiseUrl_(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (!/^https?:\/\//i.test(text)) return 'https://' + text.replace(/^\/+/, '');
  return text.slice(0, 300);
}

function isSheetEmpty_(sheet) {
  return sheet.getLastRow() === 0 || (sheet.getLastRow() === 1 && sheet.getLastColumn() === 1 && sheet.getRange(1, 1).getValue() === '');
}

function readObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1).filter(function(row) { return row.some(function(cell) { return String(cell).trim() !== ''; }); }).map(function(row) {
    const obj = {};
    headers.forEach(function(header, i) { obj[header] = row[i]; });
    return obj;
  });
}

function writeObjects_(sheet, objects, headers) {
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#17202A').setFontColor('#FFFFFF');
  if (objects.length) {
    const rows = objects.map(function(obj) {
      return headers.map(function(header) { return obj[header] !== undefined ? obj[header] : ''; });
    });
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    setTextFormat_(sheet, 2, 1, headers.length, rows.length);
  }
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function setTextFormat_(sheet, row, column, columns, numRows) {
  sheet.getRange(row, column, numRows || 1, columns).setNumberFormat('@');
}

function arrayToSettings_(rows) {
  const settings = {};
  rows.forEach(function(row) { settings[row[0]] = row[1]; });
  return settings;
}

function readSettings_(sheet) {
  const values = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 0; i < values.length; i++) {
    const key = String(values[i][0] || '').trim();
    if (key) settings[key] = values[i][1];
  }
  return settings;
}

function writeSettings_(sheet, settings) {
  sheet.clearContents();
  sheet.getRange(1, 1, 1, 2).setValues([['Key', 'Value']]).setFontWeight('bold').setBackground('#17202A').setFontColor('#FFFFFF');
  const keys = Object.keys(settings);
  if (keys.length) sheet.getRange(2, 1, keys.length, 2).setValues(keys.map(function(key) { return [key, settings[key]]; }));
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 2);
}

function computeStandings_(teams, fixtures) {
  const table = {};
  teams.forEach(function(team) {
    table[String(team.id)] = {
      teamId: String(team.id),
      slot: Number(team.slot || 999),
      team: String(team.name || team.id),
      className: String(team.className || ''),
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      percentage: 0,
      headToHeadWins: 0
    };
  });

  const finals = fixtures.filter(function(fixture) { return String(fixture.status) === 'Final'; });
  finals.forEach(function(fixture) {
    const home = table[String(fixture.homeTeamId)];
    const away = table[String(fixture.awayTeamId)];
    if (!home || !away) return;
    const hs = Number(fixture.homeScore);
    const as = Number(fixture.awayScore);
    if (!isFinite(hs) || !isFinite(as)) return;
    home.played += 1;
    away.played += 1;
    home.goalsFor += hs;
    home.goalsAgainst += as;
    away.goalsFor += as;
    away.goalsAgainst += hs;
    if (hs > as) { home.wins += 1; away.losses += 1; }
    else if (hs < as) { away.wins += 1; home.losses += 1; }
    else { home.draws += 1; away.draws += 1; }
  });

  Object.keys(table).forEach(function(id) {
    const row = table[id];
    row.percentage = row.goalsAgainst === 0 ? (row.goalsFor === 0 ? 0 : 1000) : (row.goalsFor / row.goalsAgainst) * 100;
  });

  // Head-to-head is applied when teams are level on wins, percentage and goals for.
  const rows = Object.keys(table).map(function(id) { return table[id]; });
  rows.sort(function(a, b) {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.percentage !== a.percentage) return b.percentage - a.percentage;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    const h2h = headToHead_(finals, a.teamId, b.teamId);
    if (h2h !== 0) return h2h;
    return a.slot - b.slot;
  });
  rows.forEach(function(row, index) { row.rank = index + 1; });
  return rows;
}

function headToHead_(fixtures, teamA, teamB) {
  let aWins = 0, bWins = 0;
  fixtures.forEach(function(fixture) {
    const home = String(fixture.homeTeamId), away = String(fixture.awayTeamId);
    const hs = Number(fixture.homeScore), as = Number(fixture.awayScore);
    if (!isFinite(hs) || !isFinite(as) || hs === as) return;
    if ((home === teamA && away === teamB) || (home === teamB && away === teamA)) {
      const winner = hs > as ? home : away;
      if (winner === teamA) aWins += 1;
      if (winner === teamB) bWins += 1;
    }
  });
  if (aWins > bWins) return -1;
  if (bWins > aWins) return 1;
  return 0;
}

function refreshLadder_(ss) {
  const teams = readObjects_(ss.getSheetByName(SHEETS.TEAMS));
  const fixtures = readObjects_(ss.getSheetByName(SHEETS.FIXTURES));
  const ladder = computeStandings_(teams, fixtures);
  const sheet = ss.getSheetByName(SHEETS.LADDER);
  sheet.clearContents();
  const headers = ['Rank', 'Team', 'Class', 'GP', 'W', 'D', 'L', 'Goals For', 'Goals Against', 'Percentage', 'Updated'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#17202A').setFontColor('#FFFFFF');
  if (ladder.length) {
    const updated = new Date();
    const rows = ladder.map(function(row) {
      return [row.rank, row.team, row.className, row.played, row.wins, row.draws, row.losses, row.goalsFor, row.goalsAgainst, Number(row.percentage.toFixed(2)), updated];
    });
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function appendAudit_(ss, action, details) {
  const sheet = ss.getSheetByName(SHEETS.AUDIT);
  if (isSheetEmpty_(sheet)) sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Action', 'Details', 'User']]).setFontWeight('bold').setBackground('#17202A').setFontColor('#FFFFFF');
  let user = 'web app user';
  try { user = Session.getActiveUser().getEmail() || user; } catch (error) { console.warn('Could not read active user email', error); }
  sheet.appendRow([new Date(), safeText_(action, 80), safeText_(details, 500), user]);
  sheet.setFrozenRows(1);
}

// ==== EMBEDDED APP HTML (generated from SEPEP.html by build_code.py) ====
// Keep this in sync with SEPEP.html by running: python build_code.py
const APP_HTML = String.raw`<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Year 10 SEPEP Netball — Live Ladder & Schedule</title>
  <style>
    :root {
      --ink: #17202a;
      --muted: #667085;
      --paper: #fffaf0;
      --card: #ffffff;
      --line: #e7dfd2;
      --red: #b42318;
      --red-dark: #8f1d13;
      --coral: #f04438;
      --teal: #0e7490;
      --teal-dark: #155e75;
      --lime: #65a30d;
      --gold: #f59e0b;
      --shadow: 0 18px 50px rgba(23, 32, 42, .12);
      --radius: 22px;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 8% 8%, rgba(240, 68, 56, .18), transparent 28rem),
        radial-gradient(circle at 92% 2%, rgba(14, 116, 144, .18), transparent 26rem),
        var(--paper);
    }
    button, input, select, textarea { font: inherit; }
    button { cursor: pointer; }
    .skip-link {
      position: absolute; left: -9999px; top: 1rem; z-index: 10;
      background: var(--ink); color: white; padding: .75rem 1rem; border-radius: .5rem;
    }
    .skip-link:focus { left: 1rem; }
    .app-header {
      display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: center;
      padding: 1.4rem clamp(1rem, 4vw, 3rem);
      border-bottom: 1px solid rgba(23, 32, 42, .1);
      background: rgba(255, 250, 240, .82);
      backdrop-filter: blur(14px);
      position: sticky; top: 0; z-index: 5;
    }
    .brand { display: flex; gap: 1rem; align-items: center; min-width: 0; }
    .ball {
      flex: 0 0 auto; width: 58px; height: 58px; border-radius: 18px;
      display: grid; place-items: center;
      background: linear-gradient(145deg, var(--coral), var(--red-dark));
      box-shadow: var(--shadow);
    }
    .eyebrow {
      margin: 0 0 .15rem; color: var(--teal-dark); font-size: .78rem; font-weight: 900;
      letter-spacing: .09em; text-transform: uppercase;
    }
    h1 { margin: 0; font-size: clamp(1.45rem, 3vw, 2.3rem); letter-spacing: -.04em; line-height: 1.02; }
    .subtitle { margin: .35rem 0 0; color: var(--muted); max-width: 62ch; }
    .header-actions { display: flex; gap: .65rem; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
    .pill {
      display: inline-flex; align-items: center; gap: .4rem; padding: .45rem .7rem;
      border: 1px solid var(--line); border-radius: 999px; background: white;
      color: var(--muted); font-size: .82rem; font-weight: 800; white-space: nowrap;
    }
    .pill.good { color: var(--teal-dark); border-color: rgba(14, 116, 144, .25); background: #ecfeff; }
    .pill.demo { color: #92400e; border-color: rgba(245, 158, 11, .3); background: #fffbeb; }
    .btn {
      border: 0; border-radius: 14px; padding: .72rem 1rem; font-weight: 900;
      background: var(--ink); color: white; box-shadow: 0 8px 18px rgba(23, 32, 42, .16);
      transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
    }
    .btn:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(23, 32, 42, .2); }
    .btn:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 3px solid rgba(14, 116, 144, .35); outline-offset: 2px; }
    .btn.secondary { background: white; color: var(--ink); border: 1px solid var(--line); box-shadow: none; }
    .btn.danger { background: var(--red); }
    .btn.small { padding: .5rem .7rem; border-radius: 10px; font-size: .84rem; }
    .btn[disabled] { opacity: .5; cursor: not-allowed; transform: none; }
    .banner {
      margin: 1rem auto 0; max-width: 1180px; padding: .8rem 1rem; border-radius: 16px;
      border: 1px solid rgba(245, 158, 11, .35); background: #fffbeb; color: #92400e;
      font-size: .92rem; display: none;
    }
    .tabs {
      max-width: 1180px; margin: 1rem auto 0; padding: 0 1rem;
      display: flex; gap: .5rem; overflow-x: auto; scrollbar-width: thin;
    }
    .tab {
      border: 1px solid transparent; background: transparent; color: var(--muted);
      padding: .72rem 1rem; border-radius: 14px; font-weight: 900; white-space: nowrap;
    }
    .tab[aria-selected="true"] { background: var(--ink); color: white; box-shadow: var(--shadow); }
    main { max-width: 1180px; margin: 0 auto; padding: 1rem 1rem 4rem; }
    .panel { display: none; }
    .panel.active { display: block; animation: rise .25s ease; }
    @keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .grid { display: grid; gap: 1rem; }
    .two-col { grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr); align-items: start; }
    .card {
      background: rgba(255, 255, 255, .92); border: 1px solid var(--line);
      border-radius: var(--radius); box-shadow: var(--shadow); padding: 1rem;
    }
    .card h2, .card h3 { margin: 0 0 .75rem; letter-spacing: -.03em; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: .75rem; flex-wrap: wrap; }
    .muted { color: var(--muted); }
    .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 18px; }
    table { width: 100%; border-collapse: collapse; min-width: 760px; background: white; }
    th, td { padding: .72rem .75rem; text-align: left; border-bottom: 1px solid var(--line); }
    thead th { background: var(--ink); color: white; font-size: .78rem; letter-spacing: .06em; text-transform: uppercase; }
    tbody tr:nth-child(even) { background: #fffdf7; }
    tbody tr.top { background: #f0fdfa; }
    .rank { font-weight: 950; font-size: 1.1rem; }
    .tag { display: inline-flex; align-items: center; border-radius: 999px; padding: .22rem .5rem; font-size: .72rem; font-weight: 900; background: #f2f4f7; color: #344054; }
    .tag.final { background: #ecfdf3; color: #027a48; }
    .tag.live { background: #fef3f2; color: #b42318; }
    .tag.scheduled { background: #eff8ff; color: #175cd4; }
    .tag.postponed { background: #f4f3ff; color: #5925dc; }
    .filters { display: flex; gap: .6rem; flex-wrap: wrap; margin-bottom: .8rem; }
    .field { display: grid; gap: .35rem; margin-bottom: .7rem; }
    label { font-size: .78rem; font-weight: 900; color: #344054; letter-spacing: .01em; }
    input, select, textarea {
      width: 100%; border: 1px solid var(--line); border-radius: 12px; padding: .68rem .75rem;
      background: white; color: var(--ink);
    }
    textarea { min-height: 74px; resize: vertical; }
    .fixture-list { display: grid; gap: .65rem; }
    .fixture {
      display: grid; grid-template-columns: auto 1fr auto; gap: .75rem; align-items: center;
      border: 1px solid var(--line); background: white; border-radius: 18px; padding: .75rem;
    }
    .round-badge { width: 48px; height: 48px; border-radius: 15px; display: grid; place-items: center; background: #fff1f0; color: var(--red); font-weight: 950; }
    .fixture strong { display: block; }
    .fixture small { color: var(--muted); display: block; margin-top: .2rem; }
    .score { font-size: 1.35rem; font-weight: 950; letter-spacing: -.04em; white-space: nowrap; }
    .teams-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
    .team-card { display: grid; gap: .65rem; }
    .team-card .slot { width: 42px; height: 42px; border-radius: 13px; display: grid; place-items: center; background: var(--ink); color: white; font-weight: 950; }
    .team-card dl { display: grid; grid-template-columns: auto 1fr; gap: .35rem .65rem; margin: 0; font-size: .9rem; }
    .team-card dt { color: var(--muted); font-weight: 800; }
    .team-card dd { margin: 0; }
    .callout { border-left: 5px solid var(--teal); background: #f0fdfa; padding: .75rem .9rem; border-radius: 14px; color: #134e4a; }
    .matrix-layout { display: grid; grid-template-columns: 280px 1fr; gap: 1rem; align-items: start; }
    .coverage-list { display: grid; gap: .55rem; }
    .coverage-item { display: flex; justify-content: space-between; gap: .5rem; align-items: center; padding: .55rem .65rem; border: 1px solid var(--line); border-radius: 13px; background: white; }
    .coverage-item.covered { border-left: 5px solid var(--lime); }
    .coverage-item.missing { border-left: 5px solid var(--coral); }
    .guide-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .guide-card { background: white; border: 1px solid var(--line); border-radius: 18px; padding: 1rem; }
    .guide-card ul { margin: .5rem 0 0 1.1rem; padding: 0; }
    .admin-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; align-items: start; }
    .notice { padding: .75rem; border-radius: 14px; background: #eff8ff; color: #175cd4; border: 1px solid #b2ddff; }
    .form-status {
      display: none; margin: .85rem 0 0; padding: .7rem .85rem; border-radius: 12px;
      font-size: .9rem; font-weight: 800; line-height: 1.35;
    }
    .form-status.show { display: block; }
    .form-status.ok { background: #ecfdf3; color: #027a48; border: 1px solid #abefc6; }
    .form-status.error { background: #fef3f2; color: #b42318; border: 1px solid #fecdca; }
    .form-status.info { background: #eff8ff; color: #175cd4; border: 1px solid #b2ddff; }
    .lock-hint { margin: .6rem 0 0; font-size: .85rem; font-weight: 800; color: #b42318; }
    .lock-hint.unlocked { color: #027a48; }
    .toast {
      position: fixed; bottom: 1rem; left: 50%; transform: translate(-50%, 10px); opacity: 0;
      background: var(--ink); color: white; padding: .8rem 1rem; border-radius: 14px;
      box-shadow: var(--shadow); pointer-events: none; transition: .2s ease; z-index: 20;
      max-width: min(520px, 92vw);
    }
    .toast.show { opacity: 1; transform: translate(-50%, 0); }
    .print-only { display: none; }
    @media (max-width: 980px) {
      .app-header { grid-template-columns: 1fr; position: static; }
      .header-actions { justify-content: flex-start; }
      .two-col, .matrix-layout, .admin-grid, .guide-grid { grid-template-columns: 1fr; }
      .teams-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 620px) {
      .teams-grid { grid-template-columns: 1fr; }
      .fixture { grid-template-columns: auto 1fr; }
      .fixture .score { grid-column: 2; }
      .brand { align-items: flex-start; }
      .ball { width: 48px; height: 48px; border-radius: 15px; }
    }
    @media print {
      body { background: white; color: black; }
      .app-header, .tabs, .banner, .filters, .toolbar .btn, #results .card, #admin, .toast, .no-print { display: none !important; }
      main { padding: 0; max-width: none; }
      .panel { display: none !important; }
      .panel.print-target { display: block !important; }
      .card { box-shadow: none; border: 0; padding: 0; }
      .table-wrap { border: 0; overflow: visible; }
      table { min-width: 0; }
      .print-only { display: block; }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="app-header">
    <div class="brand">
      <div class="ball" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 64 64" fill="none" role="img" aria-label="Netball">
          <circle cx="32" cy="32" r="29" stroke="white" stroke-width="4"/>
          <path d="M17 15c8 10 8 24 0 34M47 15c-8 10-8 24 0 34M8 32h48M32 3v58" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div>
        <p class="eyebrow">Year 10 SEPEP · Netball</p>
        <h1>Live Ladder & Schedule</h1>
        <p class="subtitle">Combined DUNC + ROLN competition. Fixtures, results and role coverage update from one shared Google Sheet.</p>
      </div>
    </div>
    <div class="header-actions no-print">
      <span id="connectionPill" class="pill">Connecting…</span>
      <span id="updatedPill" class="pill">Updated —</span>
      <button id="printBtn" class="btn secondary small" type="button">Print ladder</button>
    </div>
  </header>

  <div id="connectionBanner" class="banner" role="status"></div>

  <nav class="tabs no-print" role="tablist" aria-label="Competition sections">
    <button class="tab" role="tab" aria-selected="true" aria-controls="ladder" id="tab-ladder">Ladder</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="fixtures" id="tab-fixtures">Fixtures</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="results" id="tab-results">Enter results</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="teams" id="tab-teams">Teams</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="roles" id="tab-roles">Role matrix</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="guide" id="tab-guide">Role guide</button>
    <button class="tab" role="tab" aria-selected="false" aria-controls="admin" id="tab-admin">Admin</button>
  </nav>

  <main id="main">
    <section id="ladder" class="panel active print-target" role="tabpanel" aria-labelledby="tab-ladder">
      <p class="print-only">Year 10 SEPEP Netball — Combined DUNC + ROLN ladder</p>
      <div class="card">
        <div class="toolbar">
          <div>
            <h2>Overall ladder</h2>
            <p class="muted" id="ladderNote">No premiership points. Ranked by wins, percentage, goals for, then head-to-head.</p>
          </div>
          <button class="btn secondary small no-print" id="refreshBtn" type="button">Refresh</button>
        </div>
        <div class="table-wrap">
          <table aria-label="Live ladder">
            <thead>
              <tr><th>#</th><th>Team</th><th>GP</th><th>W</th><th>D</th><th>L</th><th>For</th><th>Against</th><th>%</th></tr>
            </thead>
            <tbody id="ladderBody"></tbody>
          </table>
        </div>
        <p class="muted" id="emptyLadder" hidden>No teams loaded yet. Check the setup instructions.</p>
      </div>
    </section>

    <section id="fixtures" class="panel" role="tabpanel" aria-labelledby="tab-fixtures">
      <div class="card">
        <div class="toolbar">
          <div>
            <h2>Fixtures & schedule</h2>
            <p class="muted">Seeded from your media ladder. No finals are included yet; add them once qualification is known.</p>
          </div>
          <button class="btn small no-print" id="addFixtureBtn" type="button">Add fixture</button>
        </div>
        <div class="filters no-print" aria-label="Fixture filters">
          <input id="fixtureSearch" type="search" placeholder="Search team or court…" aria-label="Search fixtures">
          <select id="weekFilter" aria-label="Filter by week"><option value="">All weeks</option></select>
          <select id="statusFilter" aria-label="Filter by status"><option value="">All statuses</option><option>Scheduled</option><option>Live</option><option>Final</option><option>Postponed</option></select>
        </div>
        <div id="fixtureList" class="fixture-list" aria-live="polite"></div>
      </div>
    </section>

    <section id="results" class="panel" role="tabpanel" aria-labelledby="tab-results">
      <div class="grid two-col">
        <form class="card" id="fixtureForm">
          <h2>Enter / edit result</h2>
          <p class="muted">Teacher edit key required. Students can view the ladder and fixtures; nominated students can be given the key to enter scores.</p>
          <input type="hidden" id="fixtureId">
          <div class="grid" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
            <div class="field"><label for="weekInput">Week</label><input id="weekInput" required placeholder="Week 4"></div>
            <div class="field"><label for="roundInput">Game number</label><input id="roundInput" required type="number" min="1" step="1" placeholder="3"></div>
            <div class="field"><label for="dateInput">Date</label><input id="dateInput" type="text" placeholder="Tue 12 May"></div>
            <div class="field"><label for="timeInput">Time</label><input id="timeInput" type="text" placeholder="11:30–12:10"></div>
          </div>
          <div class="field"><label for="courtInput">Court</label><input id="courtInput" placeholder="Court 2 / main gym"></div>
          <div class="grid" style="grid-template-columns: 1fr auto 1fr; align-items: end;">
            <div class="field"><label for="homeTeamInput">Home team</label><select id="homeTeamInput" required></select></div>
            <div class="muted" style="padding-bottom:.75rem;font-weight:900;">vs</div>
            <div class="field"><label for="awayTeamInput">Away team</label><select id="awayTeamInput" required></select></div>
          </div>
          <div class="grid" style="grid-template-columns: 1fr 1fr 1fr;">
            <div class="field"><label for="homeScoreInput">Home score</label><input id="homeScoreInput" type="number" min="0" step="1" placeholder="—"></div>
            <div class="field"><label for="awayScoreInput">Away score</label><input id="awayScoreInput" type="number" min="0" step="1" placeholder="—"></div>
            <div class="field"><label for="statusInput">Status</label><select id="statusInput"><option>Scheduled</option><option>Live</option><option>Final</option><option>Postponed</option></select></div>
          </div>
          <div class="field"><label for="notesInput">Notes</label><textarea id="notesInput" placeholder="E.g. washed out, scorer absent, final score checked by umpire"></textarea></div>
          <div class="toolbar" style="margin-bottom:0;">
            <button class="btn" id="saveFixtureBtn" type="submit">Save fixture</button>
            <button class="btn secondary" id="newFixtureBtn" type="button">New fixture</button>
            <button class="btn danger" id="deleteFixtureBtn" type="button" hidden>Delete</button>
          </div>
          <p id="lockHint" class="lock-hint">Editing is locked. Open the Admin tab and enter the edit key, then save.</p>
          <p id="formStatus" class="form-status" role="status" aria-live="polite"></p>
        </form>
        <aside class="card">
          <h3>Recently completed</h3>
          <div id="recentResults" class="fixture-list"></div>
          <div class="callout" style="margin-top:1rem;">
            <strong>Scoring reminder:</strong><br>
            5 points for a goal from outside the circle, 2 inside the circle, 1 for hitting the ring. Ladder still uses W/D/L only, not goal points.
          </div>
        </aside>
      </div>
    </section>

    <section id="teams" class="panel" role="tabpanel" aria-labelledby="tab-teams">
      <div class="teams-grid" id="teamsGrid"></div>
    </section>

    <section id="roles" class="panel" role="tabpanel" aria-labelledby="tab-roles">
      <div class="matrix-layout">
        <aside class="card">
          <h2>Coverage</h2>
          <div class="field no-print"><label for="roleTeamFilter">Team</label><select id="roleTeamFilter"><option value="">All teams</option></select></div>
          <div id="coverageList" class="coverage-list"></div>
          <p class="muted">Coverage is based on the seven SEPEP roles. Edit names and roles in the Google Sheet <code>Roles</code> tab; Refresh here updates the matrix.</p>
        </aside>
        <div class="card">
          <div class="toolbar"><h2>Team role matrix</h2><button class="btn secondary small no-print" id="copyMatrixBtn">Copy matrix</button></div>
          <div class="table-wrap">
            <table aria-label="Team role matrix"><thead><tr><th>Team</th><th>Player</th><th>Role group</th><th>Listed as</th></tr></thead><tbody id="rolesBody"></tbody></table>
          </div>
        </div>
      </div>
    </section>

    <section id="guide" class="panel" role="tabpanel" aria-labelledby="tab-guide">
      <div class="card">
        <h2>Role requirements</h2>
        <p class="muted">Condensed from your Role Requirements sheet. Tick these off before games and before teams add their website sections.</p>
        <div id="roleGuide" class="guide-grid"></div>
      </div>
    </section>

    <section id="admin" class="panel" role="tabpanel" aria-labelledby="tab-admin">
      <div class="admin-grid">
        <form class="card" id="unlockForm">
          <h2>Admin access</h2>
          <p class="muted">Enter the edit key to save fixtures, enter results and change team website links. The key is checked by the sheet, not stored in this page.</p>
          <div class="field"><label for="editKeyInput">Edit key</label><input id="editKeyInput" type="password" autocomplete="current-password" placeholder="Default: sepep-netball"></div>
          <label style="display:flex;align-items:center;gap:.5rem;font-weight:700;margin-bottom:.7rem;"><input id="rememberKey" type="checkbox" style="width:auto;"> Remember on this device</label>
          <button class="btn" type="submit">Unlock editing</button>
          <p id="unlockStatus" class="muted" role="status"></p>
        </form>
        <div class="card">
          <h2>Backup & restore</h2>
          <p class="muted">Export a JSON backup before big changes. Import replaces Teams, Fixtures and Roles; the edit key itself is not overwritten.</p>
          <div class="toolbar"><button class="btn secondary" id="exportBackupBtn" type="button">Export backup</button><label class="btn secondary" style="display:inline-flex;align-items:center;">Import backup<input id="importBackupInput" type="file" accept="application/json" hidden></label></div>
          <div class="notice"><strong>Privacy:</strong> this starter includes first names and roles only. It does not include heights, birth years, junior clubs, strengths/weaknesses or other profile details from the source files.</div>
          <h3 style="margin-top:1rem;">Sheet tabs created</h3>
          <p class="muted">Teams · Fixtures · Roles · Settings · Ladder · AuditLog</p>
        </div>
      </div>
    </section>
  </main>

  <div id="toast" class="toast" role="status" aria-live="polite"></div>

  <script>
    'use strict';

    const STORAGE_KEY = 'sepep-netball-data-v1';
    const SAVED_KEY_STORAGE = 'sepep-netball-edit-key';
    const DEFAULT_EDIT_KEY = 'sepep-netball';
    const CORE_ROLES = ['Technical Coach / Captain', 'Tactical Coach / Vice-Captain', 'Fitness Coach', 'Umpire / Referee', 'Scorer / Timekeeper', 'Media / Publicist', 'Equipment Manager'];
    const TEAM_SEED = [
      { id: 'team-1', slot: 1, className: 'DUNC', name: 'M&M&CO', motto: 'Taste the Rainbow', chant: 'M! M! M&M! IT IS US, HERE WE GO AGAIN', uniform: 'Plain coloured shirt with a white M in posca pen', mascot: 'Official M&M characters', website: '' },
      { id: 'team-2', slot: 2, className: 'DUNC', name: 'PINKISH', motto: 'On Wednesdays we wear pink', chant: "We're pink donuts, full attack, eat our sprinkles, watch your back, coming in hot, blazing the game watch far our trail, its in the name! sweet but lazy, just kidding baby, pink donut club, we're driving Y'all CRAZY!", uniform: 'Girls: Pink ribbons, black shorts, school PE shirt / AADP. Boys: Pink socks, black shorts, school PE shirt / AADP.', mascot: 'Pink Donut inflatable', website: '' },
      { id: 'team-3', slot: 3, className: 'ROLN', name: 'The Dewgs', motto: 'I am the DEWG', chant: 'Dewgy, Dewgy - Roof, Roof, Roof. We will, we will, win by far; watch us, watch us, we will win. We will fight for victory, go DEWGS!', uniform: 'PE uniform + purple tutu', mascot: 'Not listed', website: '' },
      { id: 'team-4', slot: 4, className: 'ROLN', name: 'Team 4', motto: 'Play fast. Step quick. Dominate the game in a flick.', chant: 'Not listed', uniform: 'PE uniform + blue accessories', mascot: 'Not listed', website: '' }
    ];
    const ROLE_SEED = [
      ['team-1','Macca','Technical Coach / Captain','technical captain'], ['team-1','Maddie','Technical Coach / Captain','technical coach/vice captain'], ['team-1','Max','Tactical Coach / Vice-Captain','tactical coach'], ['team-1','Micah','Tactical Coach / Vice-Captain','tactical coach/vice captain'], ['team-1','Mia','Fitness Coach','warmups'], ['team-1','Ella','Umpire / Referee','umpire'], ['team-1','Wil','Umpire / Referee','umpire'], ['team-1','Grace','Scorer / Timekeeper','score/timer'], ['team-1','Charlotte','Media / Publicist','publicist'], ['team-1','Alex','Equipment Manager','equipment manager'], ['team-1','Jack','Unassigned','not assigned'],
      ['team-2','Evie','Technical Coach / Captain','captain/technical coach'], ['team-2','Milly','Tactical Coach / Vice-Captain','vice captain/tactical coach'], ['team-2','Amelia','Fitness Coach','fitness coach'], ['team-2','Tom','Umpire / Referee','umpire'], ['team-2','Torza','Umpire / Referee','umpire'], ['team-2','Sybella','Scorer / Timekeeper','scorer/timekeeper'], ['team-2','Jasmine','Media / Publicist','media'], ['team-2','Lachie','Media / Publicist','publicist'], ['team-2','Kabe','Equipment Manager','equipment manager'],
      ['team-3','Nate','Technical Coach / Captain','technical coach/captain'], ['team-3','Yiheng','Technical Coach / Captain','technical coach'], ['team-3','Bella','Tactical Coach / Vice-Captain','tactical coach/vice'], ['team-3','Eve','Tactical Coach / Vice-Captain','tactical coach'], ['team-3','Cody','Fitness Coach','fitness coach'], ['team-3','Amber','Umpire / Referee','umpire'], ['team-3','Levi','Umpire / Referee','umpire'], ['team-3','Emily','Scorer / Timekeeper','scorer'], ['team-3','Ava','Media / Publicist','publicist'], ['team-3','Zofia','Equipment Manager','equipment manager'],
      ['team-4','Lachlan','Technical Coach / Captain','technical coach'], ['team-4','Riley','Technical Coach / Captain','technical coach'], ['team-4','Sav','Tactical Coach / Vice-Captain','tactical coach'], ['team-4','Harper','Tactical Coach / Vice-Captain','tactical coach'], ['team-4','Maya','Fitness Coach','fitness coach'], ['team-4','Jesse','Fitness Coach','fitness coach'], ['team-4','Jenson','Umpire / Referee','umpire'], ['team-4','Ryder','Umpire / Referee','umpire'], ['team-4','Asha','Scorer / Timekeeper','scorer/timer'], ['team-4','Bella','Media / Publicist','media'], ['team-4','Liam','Equipment Manager','equipment manager']
    ].map(function(row) { return { teamId: row[0], player: row[1], role: row[2], detail: row[3] }; });
    const FIXTURE_SEED = [
      { id: 'fixture-g3', round: 3, week: 'Week 4', date: '', time: '', court: '', homeTeamId: 'team-1', awayTeamId: 'team-3', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
      { id: 'fixture-g4', round: 4, week: 'Week 4', date: '', time: '', court: '', homeTeamId: 'team-2', awayTeamId: 'team-4', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
      { id: 'fixture-g7', round: 7, week: 'Week 5', date: '', time: '', court: '', homeTeamId: 'team-1', awayTeamId: 'team-4', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
      { id: 'fixture-g8', round: 8, week: 'Week 5', date: '', time: '', court: '', homeTeamId: 'team-2', awayTeamId: 'team-3', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
      { id: 'fixture-g9', round: 9, week: 'Week 6', date: '', time: '', court: '', homeTeamId: 'team-1', awayTeamId: 'team-2', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' },
      { id: 'fixture-g10', round: 10, week: 'Week 6', date: '', time: '', court: '', homeTeamId: 'team-3', awayTeamId: 'team-4', status: 'Scheduled', homeScore: '', awayScore: '', notes: 'Imported from Live ladder & Schedule' }
    ];
    const SETTINGS_SEED = { competition_name: 'Year 10 SEPEP Netball', competition_label: 'Combined DUNC + ROLN', season: '2026 SEPEP', ladder_note: 'No premiership points are awarded. Ladder is ranked by wins, then goal percentage, then goals for, then head-to-head.', edit_key: DEFAULT_EDIT_KEY };
    const ROLE_GUIDE = [
      { role: 'Technical Coach / Captain', description: 'Organises technical skill practices so every member can practise skills and apply them in the game.', breakdown: ['Design 5 technical sessions for 20–30 minutes each.', 'Sessions need a clear goal and direction.', 'Technical skills: passing, catching, shooting, defending and footwork.', 'Give the team sheet to umpires/scorer at the start of the game.', 'Add your part to the team website.'] },
      { role: 'Tactical Coach / Vice-Captain', description: 'Organises practices that use technical skills for game strategies and tactics. Arranges positions and helps ensure equal game time.', breakdown: ['Design 5 tactical sessions for 20–30 minutes each.', 'Sessions need a clear goal and direction.', 'Tactical skills: offensive and defensive plays.', 'Arrange positions and rotate players fairly.', 'Give the team sheet to umpires/scorer at the start of the game.', 'Add your part to the team website.'] },
      { role: 'Fitness Coach', description: 'Organises warm-ups, cool-downs, agility and game-fitness sessions for reaction time, endurance and capability.', breakdown: ['Design 5 warm-up and fitness sessions, focused on agility and/or reaction time.', 'Sessions should be 15–20 minutes.', 'Fitness focus: explosive power, repeated efforts, reaction time, agility/change of direction and breathing techniques.', 'Add your part to the team website.'] },
      { role: 'Umpire / Referee', description: 'Understands the rules, controls game situations, assists with officiating and helps agree on rule modifications with teams.', breakdown: ['Design and create the modified rules of the game.', 'Take rules back to teams, collect feedback and finalise.', 'Umpire games in an umpire/player capacity.', 'Add your part to the team website.'] },
      { role: 'Scorer / Timekeeper', description: 'Scores games, enters scores, times games and keeps the association ladder up to date.', breakdown: ['Use the score card to identify centre passes and scores.', 'Work as scorer/player.', 'Update statistics and the ladder in the spreadsheet/web app.', 'Time games so there is enough time to play and pack up.', 'Add your part to the team website.'] },
      { role: 'Media / Publicist', description: 'Communicates relevant team information to the class and wider school community.', breakdown: ['Create player profiles for each team member.', 'Write mini game reports/recaps as post-game reflections, 50–100 words.', 'Add your part to the team website.'] },
      { role: 'Equipment Manager', description: 'Ensures equipment is accounted for and does not interfere with practices or games.', breakdown: ['Collect and organise equipment for practise sessions and game day.', 'Set up before the team arrives.', 'Communicate with coaches about what they need.', 'Discuss requests, concerns and questions with the teacher.', 'Add your part to the team website.'] }
    ];

    const state = { data: null, editKey: '', unlocked: false, dirty: false, pollId: null };
    const $ = function(selector) { return document.querySelector(selector); };
    const $$ = function(selector) { return Array.from(document.querySelectorAll(selector)); };
    const isOnline = function() { return !!(window.google && window.google.script && window.google.script.run); };
    const clone = function(value) { return JSON.parse(JSON.stringify(value)); };
    const teamName = function(id) { const team = (state.data && state.data.teams || []).find(function(t) { return String(t.id) === String(id); }); return team ? team.name : id; };
    const statusClass = function(status) { return String(status || 'Scheduled').toLowerCase(); };
    const formatPercent = function(value) { return Number(value || 0).toFixed(1); };
    const escapeCsv = function(value) { return String(value == null ? '' : value).replace(/"/g, '""'); };

    function defaultLocalData() {
      return {
        teams: clone(TEAM_SEED),
        fixtures: clone(FIXTURE_SEED),
        roles: clone(ROLE_SEED),
        settings: clone(SETTINGS_SEED),
        coreRoles: CORE_ROLES.slice(),
        ladder: computeStandings(TEAM_SEED, FIXTURE_SEED),
        generatedAt: new Date().toISOString()
      };
    }
    function readLocalData() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) { const seeded = defaultLocalData(); localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded)); return seeded; }
        const parsed = JSON.parse(raw);
        parsed.coreRoles = CORE_ROLES.slice();
        parsed.ladder = computeStandings(parsed.teams || [], parsed.fixtures || []);
        return parsed;
      } catch (error) {
        console.error(error);
        const seeded = defaultLocalData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
        return seeded;
      }
    }
    function writeLocalData(data) {
      data.generatedAt = new Date().toISOString();
      data.ladder = computeStandings(data.teams || [], data.fixtures || []);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
    function publicLocalData(data) {
      const copy = clone(data);
      copy.coreRoles = CORE_ROLES.slice();
      copy.settings = Object.assign({}, copy.settings || {});
      delete copy.settings.edit_key;
      copy.ladder = computeStandings(copy.teams || [], copy.fixtures || []);
      return copy;
    }
    function sanitiseFixtureLocal(fixture) {
      const current = readLocalData();
      const teamIds = (current.teams || []).map(function(team) { return String(team.id); });
      const homeTeamId = String(fixture.homeTeamId || '');
      const awayTeamId = String(fixture.awayTeamId || '');
      if (teamIds.indexOf(homeTeamId) === -1 || teamIds.indexOf(awayTeamId) === -1) throw new Error('Choose valid home and away teams.');
      if (homeTeamId === awayTeamId) throw new Error('A team cannot play itself.');
      const round = Number(fixture.round);
      if (!isFinite(round) || round < 1) throw new Error('Round must be a positive number.');
      const status = String(fixture.status || 'Scheduled');
      if (['Scheduled', 'Live', 'Final', 'Postponed'].indexOf(status) === -1) throw new Error('Invalid status.');
      const homeScore = fixture.homeScore === '' ? '' : Number(fixture.homeScore);
      const awayScore = fixture.awayScore === '' ? '' : Number(fixture.awayScore);
      if (homeScore !== '' && (!isFinite(homeScore) || homeScore < 0)) throw new Error('Home score must be zero or more.');
      if (awayScore !== '' && (!isFinite(awayScore) || awayScore < 0)) throw new Error('Away score must be zero or more.');
      if (status === 'Final' && (homeScore === '' || awayScore === '')) throw new Error('Final fixtures need both scores.');
      return Object.assign({}, fixture, {
        id: fixture.id || ('fixture-' + Date.now()),
        round: Math.floor(round), week: String(fixture.week || 'Week'), date: String(fixture.date || ''), time: String(fixture.time || ''), court: String(fixture.court || ''),
        homeTeamId, awayTeamId, status, homeScore, awayScore, notes: String(fixture.notes || '')
      });
    }
    function localApi(method) {
      const args = Array.prototype.slice.call(arguments, 1);
      const data = readLocalData();
      switch (method) {
        case 'getCompetitionData': return Promise.resolve(publicLocalData(data));
        case 'verifyEditKey': return Promise.resolve(String(args[0] || '') === String((data.settings && data.settings.edit_key) || DEFAULT_EDIT_KEY));
        case 'saveFixture': {
          if (String(args[0] || '') !== String((data.settings && data.settings.edit_key) || DEFAULT_EDIT_KEY)) return Promise.reject(new Error('Edit key is incorrect.'));
          const saved = sanitiseFixtureLocal(args[1] || {});
          const index = data.fixtures.findIndex(function(item) { return item.id === saved.id; });
          if (index >= 0) data.fixtures[index] = saved; else data.fixtures.push(saved);
          return Promise.resolve(publicLocalData(writeLocalData(data)));
        }
        case 'deleteFixture': {
          if (String(args[0] || '') !== String((data.settings && data.settings.edit_key) || DEFAULT_EDIT_KEY)) return Promise.reject(new Error('Edit key is incorrect.'));
          data.fixtures = data.fixtures.filter(function(item) { return item.id !== args[1]; });
          return Promise.resolve(publicLocalData(writeLocalData(data)));
        }
        case 'saveTeamWebsite': {
          if (String(args[0] || '') !== String((data.settings && data.settings.edit_key) || DEFAULT_EDIT_KEY)) return Promise.reject(new Error('Edit key is incorrect.'));
          const team = data.teams.find(function(item) { return item.id === args[1]; });
          if (!team) return Promise.reject(new Error('Team not found.'));
          let url = String(args[2] || '').trim();
          if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url.replace(/^\/+/, '');
          team.website = url.slice(0, 300);
          return Promise.resolve(publicLocalData(writeLocalData(data)));
        }
        case 'replaceCompetitionData': {
          if (String(args[0] || '') !== String((data.settings && data.settings.edit_key) || DEFAULT_EDIT_KEY)) return Promise.reject(new Error('Edit key is incorrect.'));
          const backup = args[1] || {};
          if (!Array.isArray(backup.teams) || !Array.isArray(backup.fixtures) || !Array.isArray(backup.roles)) return Promise.reject(new Error('Backup must include teams, fixtures and roles arrays.'));
          data.teams = backup.teams; data.fixtures = backup.fixtures; data.roles = backup.roles;
          data.settings = Object.assign({}, data.settings, backup.settings || {}, { edit_key: data.settings.edit_key || DEFAULT_EDIT_KEY });
          return Promise.resolve(publicLocalData(writeLocalData(data)));
        }
        default: return Promise.reject(new Error('Unknown local action: ' + method));
      }
    }
    function api(method) {
      const args = Array.prototype.slice.call(arguments, 1);
      if (!isOnline()) return localApi.apply(null, arguments);
      return new Promise(function(resolve, reject) {
        const runner = window.google.script.run.withSuccessHandler(resolve).withFailureHandler(function(error) { reject(new Error(error && error.message ? error.message : String(error))); });
        if (typeof runner[method] !== 'function') { reject(new Error('Server action not found: ' + method)); return; }
        runner[method].apply(runner, args);
      });
    }
    function computeStandings(teams, fixtures) {
      const table = {};
      (teams || []).forEach(function(team) {
        table[String(team.id)] = { teamId: String(team.id), slot: Number(team.slot || 999), team: String(team.name || team.id), className: String(team.className || ''), played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, percentage: 0 };
      });
      const finals = (fixtures || []).filter(function(fixture) { return String(fixture.status) === 'Final'; });
      finals.forEach(function(fixture) {
        const home = table[String(fixture.homeTeamId)], away = table[String(fixture.awayTeamId)];
        if (!home || !away) return;
        const hs = Number(fixture.homeScore), as = Number(fixture.awayScore);
        if (!isFinite(hs) || !isFinite(as)) return;
        home.played += 1; away.played += 1; home.goalsFor += hs; home.goalsAgainst += as; away.goalsFor += as; away.goalsAgainst += hs;
        if (hs > as) { home.wins += 1; away.losses += 1; } else if (hs < as) { away.wins += 1; home.losses += 1; } else { home.draws += 1; away.draws += 1; }
      });
      Object.values(table).forEach(function(row) { row.percentage = row.goalsAgainst === 0 ? (row.goalsFor === 0 ? 0 : 1000) : (row.goalsFor / row.goalsAgainst) * 100; });
      const rows = Object.values(table);
      rows.sort(function(a, b) {
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        const h2h = headToHead(finals, a.teamId, b.teamId);
        if (h2h !== 0) return h2h;
        return a.slot - b.slot;
      });
      rows.forEach(function(row, index) { row.rank = index + 1; });
      return rows;
    }
    function headToHead(fixtures, teamA, teamB) {
      let aWins = 0, bWins = 0;
      (fixtures || []).forEach(function(fixture) {
        if (String(fixture.status) !== 'Final') return;
        const home = String(fixture.homeTeamId), away = String(fixture.awayTeamId);
        const hs = Number(fixture.homeScore), as = Number(fixture.awayScore);
        if (!isFinite(hs) || !isFinite(as) || hs === as) return;
        if ((home === teamA && away === teamB) || (home === teamB && away === teamA)) {
          const winner = hs > as ? home : away;
          if (winner === teamA) aWins += 1; else if (winner === teamB) bWins += 1;
        }
      });
      return aWins === bWins ? 0 : (aWins > bWins ? -1 : 1);
    }
    function showToast(message) {
      const toast = $('#toast');
      toast.textContent = message;
      toast.classList.add('show');
      window.clearTimeout(showToast.timer);
      showToast.timer = window.setTimeout(function() { toast.classList.remove('show'); }, 3400);
    }
    function setBanner(message) {
      const banner = $('#connectionBanner');
      banner.textContent = message || '';
      banner.style.display = message ? 'block' : 'none';
    }
    function updatePills() {
      const online = isOnline();
      $('#connectionPill').textContent = online ? 'Live Google Sheet' : 'Demo mode';
      $('#connectionPill').className = 'pill ' + (online ? 'good' : 'demo');
      $('#updatedPill').textContent = 'Updated ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    async function loadData(options) {
      options = options || {};
      try {
        const data = await api('getCompetitionData');
        state.data = data;
        updatePills();
        renderAll();
        if (!isOnline()) setBanner('Demo mode: changes are saved in this browser only. Deploy with Google Apps Script + Sheets for shared live updates.'); else setBanner('');
        if (options.toast) showToast(options.toast);
      } catch (error) {
        console.error(error);
        setBanner('Could not load competition data. ' + (error && error.message ? error.message + ' — ' : '') + 'Check the Apps Script deployment and Sheet setup.');
        showToast(error.message || 'Could not load data.');
      }
    }
    function renderAll() {
      if (!state.data) return;
      renderLadder();
      renderFixtures();
      renderFixtureFormOptions();
      renderRecentResults();
      renderTeams();
      renderRoleControls();
      renderRoles();
      renderGuide();
      updateAdminState();
      $('#ladderNote').textContent = (state.data.settings && state.data.settings.ladder_note) || 'No premiership points are awarded.';
    }
    function renderLadder() {
      const body = $('#ladderBody');
      body.textContent = '';
      const ladder = state.data.ladder || computeStandings(state.data.teams, state.data.fixtures);
      $('#emptyLadder').hidden = ladder.length !== 0;
      ladder.forEach(function(row) {
        const tr = document.createElement('tr');
        if (row.rank <= 2) tr.className = 'top';
        [row.rank, row.team + ' (' + row.className + ')', row.played, row.wins, row.draws, row.losses, row.goalsFor, row.goalsAgainst, formatPercent(row.percentage)].forEach(function(value, index) {
          const td = document.createElement('td');
          td.textContent = value;
          if (index === 0) td.className = 'rank';
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
    }
    function filteredFixtures() {
      const search = ($('#fixtureSearch').value || '').trim().toLowerCase();
      const week = $('#weekFilter').value;
      const status = $('#statusFilter').value;
      return (state.data.fixtures || []).filter(function(fixture) {
        const haystack = [fixture.week, fixture.round, fixture.court, fixture.date, fixture.time, teamName(fixture.homeTeamId), teamName(fixture.awayTeamId), fixture.status].join(' ').toLowerCase();
        if (search && haystack.indexOf(search) === -1) return false;
        if (week && fixture.week !== week) return false;
        if (status && fixture.status !== status) return false;
        return true;
      }).sort(function(a, b) { return String(a.week).localeCompare(String(b.week)) || Number(a.round) - Number(b.round); });
    }
    function renderFixtures() {
      const list = $('#fixtureList');
      list.textContent = '';
      const weeks = Array.from(new Set((state.data.fixtures || []).map(function(f) { return f.week; }).filter(Boolean))).sort();
      const weekSelect = $('#weekFilter');
      const previous = weekSelect.value;
      weekSelect.textContent = '';
      const all = document.createElement('option'); all.value = ''; all.textContent = 'All weeks'; weekSelect.appendChild(all);
      weeks.forEach(function(week) { const option = document.createElement('option'); option.value = week; option.textContent = week; weekSelect.appendChild(option); });
      weekSelect.value = weeks.indexOf(previous) >= 0 ? previous : '';
      const fixtures = filteredFixtures();
      if (!fixtures.length) { const empty = document.createElement('p'); empty.className = 'muted'; empty.textContent = 'No fixtures match those filters.'; list.appendChild(empty); return; }
      fixtures.forEach(function(fixture) {
        const article = document.createElement('article');
        article.className = 'fixture';
        const badge = document.createElement('div'); badge.className = 'round-badge'; badge.textContent = fixture.round || '?';
        const middle = document.createElement('div');
        const title = document.createElement('strong'); title.textContent = teamName(fixture.homeTeamId) + ' vs ' + teamName(fixture.awayTeamId);
        const meta = document.createElement('small'); meta.textContent = [fixture.week, fixture.date, fixture.time, fixture.court].filter(Boolean).join(' · ') || 'Date/time/court to be confirmed';
        const tag = document.createElement('span'); tag.className = 'tag ' + statusClass(fixture.status); tag.textContent = fixture.status || 'Scheduled';
        middle.appendChild(title); middle.appendChild(meta); middle.appendChild(tag);
        const right = document.createElement('div');
        const score = document.createElement('div'); score.className = 'score';
        score.textContent = fixture.homeScore === '' || fixture.awayScore === '' ? '— : —' : fixture.homeScore + ' : ' + fixture.awayScore;
        const edit = document.createElement('button'); edit.className = 'btn secondary small no-print'; edit.type = 'button'; edit.textContent = 'Edit';
        edit.addEventListener('click', function() { selectFixture(fixture.id); switchTab('results'); });
        right.appendChild(score); right.appendChild(edit);
        article.appendChild(badge); article.appendChild(middle); article.appendChild(right);
        list.appendChild(article);
      });
    }
    function renderFixtureFormOptions() {
      const home = $('#homeTeamInput'), away = $('#awayTeamInput');
      const selectedHome = home.value, selectedAway = away.value;
      [home, away].forEach(function(select) {
        select.textContent = '';
        (state.data.teams || []).slice().sort(function(a, b) { return Number(a.slot) - Number(b.slot); }).forEach(function(team) { const option = document.createElement('option'); option.value = team.id; option.textContent = team.name + ' (' + team.className + ')'; select.appendChild(option); });
      });
      if (selectedHome) home.value = selectedHome;
      if (selectedAway) away.value = selectedAway;
      const weeks = Array.from(new Set((state.data.fixtures || []).map(function(f) { return f.week; }).filter(Boolean))).sort();
      if (!$('#weekInput').value && weeks[0]) $('#weekInput').value = weeks[0];
    }
    function renderRecentResults() {
      const container = $('#recentResults');
      container.textContent = '';
      const finals = (state.data.fixtures || []).filter(function(fixture) { return fixture.status === 'Final'; }).slice().sort(function(a, b) { return String(b.week).localeCompare(String(a.week)) || Number(b.round) - Number(a.round); }).slice(0, 4);
      if (!finals.length) { const p = document.createElement('p'); p.className = 'muted'; p.textContent = 'No final results yet.'; container.appendChild(p); return; }
      finals.forEach(function(fixture) {
        const item = document.createElement('div'); item.className = 'fixture';
        const badge = document.createElement('div'); badge.className = 'round-badge'; badge.textContent = fixture.round;
        const middle = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = teamName(fixture.homeTeamId) + ' vs ' + teamName(fixture.awayTeamId); const small = document.createElement('small'); small.textContent = [fixture.week, fixture.date].filter(Boolean).join(' · '); middle.appendChild(strong); middle.appendChild(small);
        const score = document.createElement('div'); score.className = 'score'; score.textContent = fixture.homeScore + ' : ' + fixture.awayScore;
        item.appendChild(badge); item.appendChild(middle); item.appendChild(score); container.appendChild(item);
      });
    }
    function renderTeams() {
      const grid = $('#teamsGrid'); grid.textContent = '';
      (state.data.teams || []).slice().sort(function(a, b) { return Number(a.slot) - Number(b.slot); }).forEach(function(team) {
        const card = document.createElement('article'); card.className = 'card team-card';
        const top = document.createElement('div'); top.style.display = 'flex'; top.style.justifyContent = 'space-between'; top.style.gap = '.5rem'; top.style.alignItems = 'center';
        const slot = document.createElement('div'); slot.className = 'slot'; slot.textContent = 'T' + team.slot;
        const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = team.className;
        top.appendChild(slot); top.appendChild(tag);
        const title = document.createElement('h2'); title.textContent = team.name;
        const dl = document.createElement('dl');
        [['Motto', team.motto], ['Chant', team.chant], ['Uniform', team.uniform], ['Mascot', team.mascot]].forEach(function(pair) {
          const dt = document.createElement('dt'); dt.textContent = pair[0]; const dd = document.createElement('dd'); dd.textContent = pair[1] || 'Not listed'; dl.appendChild(dt); dl.appendChild(dd);
        });
        card.appendChild(top); card.appendChild(title); card.appendChild(dl);
        const web = document.createElement('div');
        if (team.website) { const a = document.createElement('a'); a.href = team.website; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'Team website'; web.appendChild(a); }
        else { const span = document.createElement('span'); span.className = 'muted'; span.textContent = 'Website not added yet'; web.appendChild(span); }
        card.appendChild(web);
        grid.appendChild(card);
      });
    }
    function renderRoleControls() {
      const select = $('#roleTeamFilter'); const previous = select.value;
      select.textContent = ''; const all = document.createElement('option'); all.value = ''; all.textContent = 'All teams'; select.appendChild(all);
      (state.data.teams || []).slice().sort(function(a, b) { return Number(a.slot) - Number(b.slot); }).forEach(function(team) { const option = document.createElement('option'); option.value = team.id; option.textContent = team.name; select.appendChild(option); });
      select.value = previous;
    }
    function roleIsAssigned(role) { return role && String(role).toLowerCase() !== 'unassigned'; }
    function renderRoles() {
      const filter = $('#roleTeamFilter').value;
      const roles = (state.data.roles || []).filter(function(row) { return !filter || String(row.teamId) === filter; });
      const body = $('#rolesBody'); body.textContent = '';
      roles.slice().sort(function(a, b) { return String(a.teamId).localeCompare(String(b.teamId)) || String(a.player).localeCompare(String(b.player)); }).forEach(function(row) {
        const tr = document.createElement('tr');
        [teamName(row.teamId), row.player, row.role, row.detail || ''].forEach(function(value) { const td = document.createElement('td'); td.textContent = value; tr.appendChild(td); });
        body.appendChild(tr);
      });
      const coverage = $('#coverageList'); coverage.textContent = '';
      const teams = (state.data.teams || []).filter(function(team) { return !filter || String(team.id) === String(filter); });
      teams.forEach(function(team) {
        const teamRoles = (state.data.roles || []).filter(function(row) { return String(row.teamId) === String(team.id) && roleIsAssigned(row.role); });
        const covered = CORE_ROLES.filter(function(core) { return teamRoles.some(function(row) { return row.role === core; }); });
        const item = document.createElement('div'); item.className = 'coverage-item ' + (covered.length >= 6 ? 'covered' : 'missing');
        const left = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = team.name; const small = document.createElement('small'); small.className = 'muted'; small.textContent = covered.length + '/' + CORE_ROLES.length + ' core roles covered'; left.appendChild(strong); left.appendChild(small);
        const right = document.createElement('span'); right.className = 'tag'; right.textContent = covered.length >= CORE_ROLES.length ? 'Full' : 'Needs ' + (CORE_ROLES.length - covered.length);
        item.appendChild(left); item.appendChild(right); coverage.appendChild(item);
      });
    }
    function renderGuide() {
      const container = $('#roleGuide'); container.textContent = '';
      ROLE_GUIDE.forEach(function(item) {
        const card = document.createElement('article'); card.className = 'guide-card';
        const h = document.createElement('h3'); h.textContent = item.role;
        const p = document.createElement('p'); p.textContent = item.description;
        const ul = document.createElement('ul');
        item.breakdown.forEach(function(point) { const li = document.createElement('li'); li.textContent = point; ul.appendChild(li); });
        card.appendChild(h); card.appendChild(p); card.appendChild(ul); container.appendChild(card);
      });
    }
    function selectFixture(id) {
      const fixture = (state.data.fixtures || []).find(function(item) { return item.id === id; });
      if (!fixture) return;
      $('#fixtureId').value = fixture.id;
      $('#weekInput').value = fixture.week || '';
      $('#roundInput').value = fixture.round || '';
      $('#dateInput').value = fixture.date || '';
      $('#timeInput').value = fixture.time || '';
      $('#courtInput').value = fixture.court || '';
      $('#homeTeamInput').value = fixture.homeTeamId || '';
      $('#awayTeamInput').value = fixture.awayTeamId || '';
      $('#homeScoreInput').value = fixture.homeScore === '' ? '' : fixture.homeScore;
      $('#awayScoreInput').value = fixture.awayScore === '' ? '' : fixture.awayScore;
      $('#statusInput').value = fixture.status || 'Scheduled';
      $('#notesInput').value = fixture.notes || '';
      $('#deleteFixtureBtn').hidden = false;
      state.dirty = false;
    }
    function resetFixtureForm() {
      $('#fixtureForm').reset();
      $('#fixtureId').value = '';
      $('#statusInput').value = 'Scheduled';
      $('#deleteFixtureBtn').hidden = true;
      state.dirty = false;
      renderFixtureFormOptions();
    }
    function collectFixtureForm() {
      return { id: $('#fixtureId').value || undefined, week: $('#weekInput').value, round: Number($('#roundInput').value), date: $('#dateInput').value, time: $('#timeInput').value, court: $('#courtInput').value, homeTeamId: $('#homeTeamInput').value, awayTeamId: $('#awayTeamInput').value, homeScore: $('#homeScoreInput').value, awayScore: $('#awayScoreInput').value, status: $('#statusInput').value, notes: $('#notesInput').value };
    }
    function setFormStatus(message, kind) {
      const el = $('#formStatus');
      if (!el) return;
      if (!message) { el.textContent = ''; el.className = 'form-status'; return; }
      el.textContent = message;
      el.className = 'form-status show ' + (kind || 'info');
    }
    async function saveCurrentFixture(event) {
      event.preventDefault();
      if (!state.unlocked) {
        setFormStatus('Locked. Enter the edit key in the Admin tab first, then save again.', 'error');
        showToast('Unlock admin access first.');
        switchTab('admin');
        return;
      }
      const fixture = collectFixtureForm();
      if (!fixture.week) { setFormStatus('Add the week, for example “Week 4”.', 'error'); return; }
      if (!fixture.round || fixture.round < 1) { setFormStatus('Add a game number (1 or higher).', 'error'); return; }
      if (fixture.homeTeamId === fixture.awayTeamId) { setFormStatus('A team cannot play itself — pick two different teams.', 'error'); return; }
      if (fixture.status === 'Final' && (fixture.homeScore === '' || fixture.awayScore === '')) { setFormStatus('A Final needs both scores filled in.', 'error'); return; }
      setFormStatus('Saving…', 'info');
      try {
        const updated = await api('saveFixture', state.editKey, fixture);
        state.data = updated; state.dirty = false; renderAll();
        $('#deleteFixtureBtn').hidden = false;
        setFormStatus('Saved ✓ ' + (fixture.week || '') + ' · Game ' + fixture.round + ' — ' + teamName(fixture.homeTeamId) + ' vs ' + teamName(fixture.awayTeamId) + (fixture.status ? ' (' + fixture.status + ')' : ''), 'ok');
        showToast('Fixture saved.');
      } catch (error) {
        setFormStatus('Could not save: ' + (error.message || 'unknown error'), 'error');
        showToast(error.message || 'Could not save fixture.');
      }
    }
    async function deleteCurrentFixture() {
      const id = $('#fixtureId').value;
      if (!id) { setFormStatus('Pick a fixture first.', 'error'); return; }
      if (!state.unlocked) {
        setFormStatus('Locked. Enter the edit key in the Admin tab first.', 'error');
        showToast('Unlock admin access first.');
        switchTab('admin');
        return;
      }
      if (!window.confirm('Delete this fixture? This cannot be undone except from a backup.')) return;
      try {
        const updated = await api('deleteFixture', state.editKey, id);
        state.data = updated; resetFixtureForm(); renderAll();
        $('#deleteFixtureBtn').hidden = true;
        setFormStatus('Fixture deleted.', 'ok');
        showToast('Fixture deleted.');
      } catch (error) {
        setFormStatus('Could not delete: ' + (error.message || 'unknown error'), 'error');
        showToast(error.message || 'Could not delete fixture.');
      }
    }
    function switchTab(name) {
      $$('.tab').forEach(function(tab) { const active = tab.id === 'tab-' + name; tab.setAttribute('aria-selected', String(active)); });
      $$('.panel').forEach(function(panel) { panel.classList.toggle('active', panel.id === name); panel.classList.toggle('print-target', panel.id === 'ladder'); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function updateAdminState() {
      const hint = $('#lockHint');
      if (hint) {
        hint.textContent = state.unlocked ? 'Editing unlocked — you can save fixtures now.' : 'Editing is locked. Open the Admin tab and enter the edit key, then save.';
        hint.className = 'lock-hint' + (state.unlocked ? ' unlocked' : '');
      }
      $('#unlockStatus').textContent = state.unlocked ? 'Editing unlocked for this session.' : 'Editing is locked — enter the key to save changes.';
    }
    function exportBackup() {
      if (!state.data) return;
      const backup = { teams: state.data.teams, fixtures: state.data.fixtures, roles: state.data.roles, settings: Object.assign({}, state.data.settings), exportedAt: new Date().toISOString() };
      delete backup.settings.edit_key;
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'sepep-netball-backup.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    }
    async function importBackup(file) {
      if (!file) return;
      if (!state.unlocked) { showToast('Unlock admin access first.'); return; }
      try {
        const backup = JSON.parse(await file.text());
        if (!window.confirm('Import backup? This replaces Teams, Fixtures and Roles.')) return;
        const updated = await api('replaceCompetitionData', state.editKey, backup);
        state.data = updated; resetFixtureForm(); renderAll(); showToast('Backup imported.');
      } catch (error) { showToast(error.message || 'Could not import backup.'); }
      finally { $('#importBackupInput').value = ''; }
    }
    function matrixAsCsv() {
      const rows = [['Team', 'Player', 'Role group', 'Listed as']];
      (state.data.roles || []).forEach(function(row) { rows.push([teamName(row.teamId), row.player, row.role, row.detail || '']); });
      return rows.map(function(row) { return row.map(function(cell) { return '"' + escapeCsv(cell) + '"'; }).join(','); }).join('\n');
    }
    function copyMatrix() {
      const csv = matrixAsCsv();
      const done = function() { showToast('Role matrix copied as CSV.'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(csv).then(done).catch(function() { showToast('Could not copy to clipboard.'); });
      else showToast('Clipboard is not available in this browser.');
    }
    function printLadder() { $$('.panel').forEach(function(panel) { panel.classList.toggle('print-target', panel.id === 'ladder'); }); window.print(); }
    function bindEvents() {
      $$('.tab').forEach(function(tab) { tab.addEventListener('click', function() { switchTab(tab.id.replace('tab-', '')); }); });
      ['fixtureSearch', 'weekFilter', 'statusFilter'].forEach(function(id) { $('#' + id).addEventListener('input', renderFixtures); $('#' + id).addEventListener('change', renderFixtures); });
      $('#refreshBtn').addEventListener('click', function() { loadData({ toast: 'Refreshed.' }); });
      $('#printBtn').addEventListener('click', printLadder);
      $('#fixtureForm').addEventListener('submit', saveCurrentFixture);
      $('#newFixtureBtn').addEventListener('click', resetFixtureForm);
      $('#deleteFixtureBtn').addEventListener('click', deleteCurrentFixture);
      $('#addFixtureBtn').addEventListener('click', function() { resetFixtureForm(); switchTab('results'); if (!state.unlocked) showToast('Unlock admin access to save the new fixture.'); });
      $('#roleTeamFilter').addEventListener('change', renderRoles);
      $('#fixtureForm').addEventListener('input', function() { state.dirty = true; });
      $('#unlockForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const key = $('#editKeyInput').value.trim();
        if (!key) { $('#unlockStatus').textContent = 'Type the edit key first.'; return; }
        try {
          const ok = await api('verifyEditKey', key);
          state.unlocked = !!ok;
          state.editKey = ok ? key : '';
          if (ok) {
            if ($('#rememberKey').checked) localStorage.setItem(SAVED_KEY_STORAGE, key);
            else localStorage.removeItem(SAVED_KEY_STORAGE);
            setFormStatus('Editing unlocked. Open Enter results and save your fixture.', 'ok');
          } else {
            setFormStatus('That edit key did not match the value in the Settings tab.', 'error');
          }
          updateAdminState();
          $('#unlockStatus').textContent = ok ? 'Editing unlocked for this session.' : 'That key did not match.';
          showToast(ok ? 'Editing unlocked.' : 'Incorrect edit key.');
        } catch (error) {
          $('#unlockStatus').textContent = 'Could not check the key: ' + (error.message || 'unknown error');
          showToast(error.message || 'Could not verify key.');
        }
      });
      $('#exportBackupBtn').addEventListener('click', exportBackup);
      $('#importBackupInput').addEventListener('change', function(event) { importBackup(event.target.files[0]); });
      $('#copyMatrixBtn').addEventListener('click', copyMatrix);
    }
    async function restoreUnlock() {
      try {
        const saved = localStorage.getItem(SAVED_KEY_STORAGE);
        if (!saved) return;
        const ok = await api('verifyEditKey', saved);
        if (ok) {
          state.unlocked = true;
          state.editKey = saved;
          $('#editKeyInput').value = saved;
          $('#rememberKey').checked = true;
          updateAdminState();
        } else {
          localStorage.removeItem(SAVED_KEY_STORAGE);
        }
      } catch (error) {
        console.warn('Could not restore the saved edit key', error);
      }
    }
    function startPolling() {
      if (!isOnline()) return;
      state.pollId = window.setInterval(function() { if (!state.dirty) loadData(); }, 20000);
    }
    bindEvents();
    loadData();
    restoreUnlock();
    startPolling();
  </script>
</body>
</html>
`;
// ==== END EMBEDDED APP HTML ====
