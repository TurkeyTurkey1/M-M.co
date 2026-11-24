# M&M&CO Website

SEPEP netball team website for **M&M&CO** — *"Taste the Rainbow"*.

## One site, ten tabs
Everything lives on the main page as tabs:

- **Home** — team, uniform, player profiles, training sessions and extra info
- **Fitness Coach** — warm-up planner with saved plans
- **Positions Manager** — interactive netball court, saved setups and share links
- **Equipment Manager** — equipment checklists and notes
- **Statistics** — full netball statistics tracker with CSV export
- **Feedback** — coach feedback from the last four sessions
- **Rules & Tribunals** — modified rules, agreed changes, card meanings and offence charges
- **Tactical Drills** — create and save attacking, defending and transition drills
- **Technical Drills** — create and save passing, footwork, catching and shooting drills
- **Cloud Sync** — connect saved data to a Google Sheet so it updates across devices

Tabs update the page content without leaving the site, and each tab has its own link:
`index.html#fitness`, `index.html#positions`, `index.html#equipment`, `index.html#statistics`, `index.html#feedback`, `index.html#rules`, `index.html#tactical`, `index.html#technical`, `index.html#sync`.

## Google Sheets sync
`google-apps-script.gs` is the backend. To use it:
1. Open the Google Sheet and go to **Extensions → Apps Script**.
2. Paste the file contents into `Code.gs` and save.
3. Deploy as a **Web app**: Execute as **Me**, Who has access **Anyone**.
4. The Web app URL is already built into the site, so sync starts automatically. If the URL changes, update it in the **Cloud Sync** tab.

The script creates a `WebsiteData` worksheet and leaves existing tabs untouched. Saved data then syncs between devices. Anyone with the site link can edit, and the last save wins if two people edit at the same time.

## Data & sharing
- By default saved data lives in the browser's local storage.
- Once Google Sheets sync is configured, saved data is written to the Sheet and pulled down on other devices.
- The Positions Manager can also generate a **share link** that contains the full setup.
- If sync is not configured, share links/exports are the only way to move data between devices.

## View locally
Open `index.html` in a web browser.
