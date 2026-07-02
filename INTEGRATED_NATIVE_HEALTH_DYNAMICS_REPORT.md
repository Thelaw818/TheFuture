# Native Health Dynamics Integration

This build adds Health Dynamics as a native tab inside the existing peptide inventory web app.

## What changed
- Added a visible left-sidebar tab: Health Dynamics.
- Removed iframe/separate-page dependency to prevent GitHub Pages 404 errors.
- Added a native Health Dynamics workspace inside index.html.
- Health data is stored locally in the browser using localStorage.
- Existing inventory, COA, half-life, calculator, workbook, and dosage tabs remain intact.

## Health Dynamics modules
- Dashboard
- Vitals
- Weight
- Water
- Sleep & Mood
- Medication
- Journal
- Cost Analysis
- Reports/Export
- Privacy / Terms / Medical Disclaimer

## Deployment
Upload every file in this folder to the GitHub Pages repository root. The main entry file remains index.html.
