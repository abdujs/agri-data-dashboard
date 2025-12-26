
# Agri Data Dashboard

A professional, responsive dashboard for visualizing agricultural yields and related metadata. Built with React, TypeScript, Vite, and Chart.js. Supports robust fallback CSS and a flexible data pipeline.

---

## Features
- **Interactive Dashboard:** Visualizes agricultural data with charts and KPIs.
- **Country, Crop, and Year Filters:** Easily filter and explore data.
- **Export:** Download selected country's time-series as CSV.
- **Responsive UI:** Works on desktop and mobile.
- **Styling:** Uses Tailwind CSS (if available) with fallback CSS for reliability.
- **Data Pipeline:** Regenerate data from CSV using the provided Python script.

---

## Quick Start

### Prerequisites
- Node.js v18+ and npm (or pnpm/yarn)
- Python 3.8+ (optional, for data processing)

### Setup
1. **Install dependencies:**
  ```bash
  npm install
  ```
2. **(Optional) Rebuild data from CSV:**
  ```bash
  python process-crop-data.py
  # Outputs written into src/data/
  ```
3. **Run the dev server:**
  ```bash
  npm run dev
  ```
  Open the app at the address printed by Vite (usually http://localhost:5173).

4. **Build for production:**
  ```bash
  npm run build
  npm run preview
  ```

---

## Project Structure
- `src/` — React app source
  - `components/layout/Dashboard.tsx` — main dashboard view
  - `components/charts/` — chart components (Line, Pie, Bar, DualAxis)
  - `components/filters/` — filter components (Country, Crop, YearRange, AdvancedMultiSelect)
  - `data/` — processed JSON outputs: `cropData.json`, `chartData.json`, `metadata.json`, `summary.json`
  - `App.css` — global and fallback CSS
- `process-crop-data.py` — CSV → JSON processor
- `package.json`, `vite.config.ts` — project tooling and scripts

---

## Data Pipeline
- Run `python process-crop-data.py` to process `yield_df.csv` and generate JSON files in `src/data/`.
- The dashboard reads from these JSON files for all visualizations and filters.

---

## Troubleshooting
- **Tailwind CSS not working:** Ensure all dependencies are installed and your terminal is not PowerShell. Use CMD or Git Bash for `npx` commands.
- **Missing/empty charts:** Regenerate data with `python process-crop-data.py`.
- **Export not working:** Make sure the selected country exists in the data.

---

## Contributing
- Small, focused PRs are welcome.
- Please run `npm run build` and ensure no TypeScript errors before submitting.

---

## License
Add your license file as needed.

---

## Credits
- Data from FAO/World Bank Agricultural Data
- Built for Climate Fellowship Application
    npm run preview
    ```

    ---

    Exporting data

    - The dashboard's **Export Data** button downloads the selected country's time-series as a CSV (year,value). To extend exports (full filtered rows or other charts) see `src/components/layout/Dashboard.tsx` and the `exportSelectedCountryCSV` handler.

    ---

    Styling & Tailwind notes

    - The project was made resilient to Tailwind/PostCSS issues: `src/App.css` contains fallback styles so the UI remains polished even if Tailwind utilities are not generated.
    - If you prefer full Tailwind processing, ensure the correct packages are installed and PostCSS is configured. A common fix for Tailwind/PostCSS build problems:

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

    Then confirm `postcss.config.cjs` loads the Tailwind adapter and `tailwind.config.js` includes the `src/**/*` content paths. If you see PostCSS errors like "Cannot apply unknown utility class", re-install the correct `postcss`/`tailwindcss` versions and restart `npm run dev`.

    If your dev server exits with a non-zero code (for example `130`), paste the terminal output and I'll help diagnose the PostCSS/Vite logs.

    ---

    Developer notes

    - The Dashboard has been converted to use semantic class names and a polished fallback stylesheet in `src/App.css` to reduce dependency on Tailwind utilities.
    - Filters use compact chips with keyboard support. Charts read from `src/data/chartData.json` by default.
    - To change the primary palette, edit the `:root` variables at the top of `src/App.css`.

    ---

    Troubleshooting tips

    - Build or CSS errors: check `postcss.config.cjs` and `tailwind.config.js`, and ensure the installed `postcss`/`tailwindcss` versions are compatible.
    - Missing/empty charts: confirm `src/data/chartData.json` contains data; regenerate via `python process-crop-data.py`.
    - Export not triggering: verify the selected country exists in `chartData.lineChart` and check browser popup/download blockers.

    ---

    Contributing

    Small, focused PRs preferred. Please run `npm run build` and ensure no TypeScript errors before submitting.

    ---

    License

    This project contains user-provided data and example code. Add your license file as needed.

    ---

    If you want, I can:
    - Add a short screenshot and usage GIF to the README,
    - Add a step-by-step dev checklist (lint, format, test), or
    - Create a `CONTRIBUTING.md` with contribution guidelines.

    Tell me which and I'll add it.
