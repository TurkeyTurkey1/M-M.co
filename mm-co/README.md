# M&M&CO Website

SEPEP netball team website for **M&M&CO** — *"Taste the Rainbow"*.

## One site, six tabs
Everything lives on the main page as tabs:

- **Home** — team, uniform, player profiles, training sessions and extra info
- **Fitness Coach** — warm-up planner with saved plans
- **Positions Manager** — interactive netball court, saved setups and share links
- **Equipment Manager** — equipment checklists and notes
- **Statistics** — full netball statistics tracker with CSV export
- **Feedback** — coach feedback from the last four sessions

Tabs update the page content without leaving the site, and each tab has its own link:
`index.html#fitness`, `index.html#positions`, `index.html#equipment`, `index.html#statistics`, `index.html#feedback`.

## Data & sharing
This is a static site (GitHub Pages), so saved data lives in the browser's local storage:
- Warm-up plans, position setups, checklists, and stats stay on the device that entered them.
- The Positions Manager can generate a **share link** that contains the full setup, so teammates can open the same court layout.
- For fully shared live data across devices, a backend/database would be needed.

## View locally
Open `index.html` in a web browser.
