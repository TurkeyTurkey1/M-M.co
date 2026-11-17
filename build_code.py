"""
Regenerate apps-script/Code.gs so it contains an embedded copy of SEPEP.html.

Why: a Google Apps Script web app shows a blank page if the HTML file is
missing, empty or named differently (Index.html, SEPEP.html.html, ...).
Code.gs still prefers a real HTML file when it finds one, but falls back to
this embedded copy so the deployed app always renders.

Run:  python build_code.py
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent
APPS = ROOT / "apps-script"
HTML_PATH = APPS / "SEPEP.html"
CODE_PATH = APPS / "Code.gs"

START_MARK = "// ==== EMBEDDED APP HTML (generated from SEPEP.html by build_code.py) ===="
END_MARK = "// ==== END EMBEDDED APP HTML ===="

FUNCTIONS = """function doGet() {
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
      if (content.length > 5000 && /<body[\\s>]/i.test(content) && /<\\/html>/i.test(content)) {
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
      console.log(name + ': FOUND, ' + content.length + ' characters, complete: ' + (content.length > 5000 && /<body[\\s>]/i.test(content) && /<\\/html>/i.test(content)));
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

"""


def main() -> None:
    html = HTML_PATH.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")
    if "`" in html or "${" in html:
        raise SystemExit("SEPEP.html contains a backtick or ${ which cannot be embedded safely.")

    code = CODE_PATH.read_text(encoding="utf-8")

    # Drop an older embedded copy, if any.
    if START_MARK in code and END_MARK in code:
        before, rest = code.split(START_MARK, 1)
        _, after = rest.split(END_MARK, 1)
        code = before.rstrip() + "\n" + after.lstrip()

    # Replace doGet(...) through the function before onOpen() with the new block.
    start = code.find("function doGet()")
    end = code.find("function onOpen()")
    if start == -1 or end == -1 or end < start:
        raise SystemExit("Could not find the doGet/onOpen region in Code.gs.")
    code = code[:start] + FUNCTIONS + code[end:]

    embedded = (
        "\n" + START_MARK + "\n"
        "// Keep this in sync with SEPEP.html by running: python build_code.py\n"
        "const APP_HTML = String.raw`" + html + "`;\n"
        + END_MARK + "\n"
    )
    CODE_PATH.write_text(code.rstrip() + "\n" + embedded, encoding="utf-8")
    print(f"Wrote {CODE_PATH} ({CODE_PATH.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
