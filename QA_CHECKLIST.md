QA CHECKLIST

Structure matched to uploaded version:
- Public front page
- Login/Register
- Dashboard-gated application
- Left sidebar tabs
- Dashboard
- Inventory
- Calculators
- Peptide Log
- Half-Life Database
- Estimated Levels
- Health Tracker
- Dose Log
- COA Tracker
- Lab Markers
- Protocol Builder
- Cost Tracking
- Vendor Database
- PDF COA Storage
- Import / Export Backup
- LUMINA™ Advertising
- Settings
- Reports
- Admin Center
- Measurements
- Journal
- AI Insights
- Audit Trail
- Notes

Fixes included:
- Half-Life Database organized as Peptide | Alias | Category | Half-life | Route | Notes
- Duplicate COA/PDF COA sidebar conflict fixed
- PDF COA Storage has its own working localStorage table


LUMINA UPDATE QA:
- LUMINA section remains in place.
- Marketing image added as lumina-before-after-results.png.
- Marketing Images & Results Gallery added.
- Testimonials section added.
- Cosmetic disclaimer added.
- No other website sections intentionally changed.


LEGAL & COMPLIANCE UPDATE QA:
- Privacy Policy panel added.
- Terms of Use panel added.
- Medical Disclaimer panel added.
- Legal Notice panel added.
- Footer links added.
- Educational research banner added.
- Calculator, half-life, protocol, and LUMINA disclaimers added where matching sections exist.
- Existing site sections were preserved.


LIVE TRENDS FIX QA:
- Health Tracker live charts added for weight, BP systolic, glucose, heart rate, and BMI.
- Estimated Medication Levels live chart added.
- Charts refresh after form submit, delete/clear clicks, and localStorage updates.
- Multiple existing localStorage key names are supported for compatibility with prior builds.


ALL SECTIONS LIVE QA HDSS:
- Fixed PDF COA Storage sidebar tab to open its own pdfcoa panel.
- Added robust tab navigation handler for every .tab[data-tab].
- Added global live refresh after form submits, button clicks, input changes, and localStorage updates.
- Health Tracker trends and Estimated Medication Levels refresh through renderAllLiveTrends.
- Existing site content preserved; only live hooks/navigation safety patches added.


UNIVERSAL LIVE ENGINE FIX:
- Added central live-update engine.
- Normalizes Health Tracker data into shared localStorage.
- Normalizes Peptide Log data into shared localStorage.
- Updates Health Trends immediately.
- Updates Estimated Medication Levels immediately.
- Updates dashboard counts immediately.
- Refreshes on form submit, delete, clear, tab change, and localStorage writes.


HEALTH & LAB FIX:
- Body Measurement Tracker merged into Health & Measurements section.
- Separate Body Measurement sidebar tab removed if present.
- Measurement records save locally.
- Waist and body-fat charts update live.
- Medical Lab Marker category dropdown populated.
- Medical Lab Marker marker dropdown updates based on category.


PREMIUM UPGRADE QA:
- Visible master-login credentials removed from front page text.
- Executive Dashboard added.
- Real-Time Body-Load Engine added.
- Lab Correlation Analytics added.
- PDF / Print Reports Center added.
- Admin & Backup Center added.
- Premium sections refresh from localStorage.


HEALTH LIVE TYPING FIX:
- Health & Measurements charts now update while entering values.
- Unsaved form values appear as live green preview points.
- Saved data continues to display after submit.
- Health summary cards update while typing.


FINAL HEALTH & MEASUREMENTS FIX:
- Duplicate Live Health Trends blocks removed.
- One Live Health Trends block remains in Health & Measurements.
- Weight, Blood Pressure, Blood Glucose, Heart Rate, and BMI update live while typing.
- Body Measurement Tracker saves and updates charts/table live.
- Waist and Body Fat charts update while typing and after saving.


REAL FIELD HEALTH FIX:
- Live charts now read input name, id, placeholder, and stored object keys.
- Weight supports Weight, weight, Weight lb, weightLb, bodyWeight.
- BP supports systolic/diastolic and single 120/80 field.
- Glucose supports glucose, Blood Glucose, bloodSugar.
- Heart Rate supports heartRate, HR, pulse.
- BMI calculates from weight and height fields when present.
- Measurement charts read name/id/placeholder fields.


MYPEPTIDEAPP CSV IMPORT:
- Parsed section-based CSV export.
- Peptide logs imported into Peptide Log / Estimated Levels.
- Health metrics imported into Health & Measurements.
- Body fat imported into Body Measurements.
- Inventory section imported if rows exist.
- Counts: {'inventory': 0, 'health': 96, 'measurements': 1, 'labs': 0, 'peptide': 98, 'dose': 0, 'coa': 0, 'costs': 0, 'vendors': 0, 'notes': 1, 'protocols': 0}


BMI + EDIT BUTTON FIX:
- Health & Measurements BMI column no longer pulls heart-rate/body-fat data.
- Body Fat imported rows are moved to Body Measurements.
- Health table displays Weight, BP, Glucose, Heart Rate, BMI, Notes correctly.
- Edit buttons added through universal edit modal for main stored sections.
- Delete buttons preserved/added where universal tables are rendered.


EXACT REQUEST FIX:
- Existing layout kept the same.
- Health BMI values like 73, 83, 75, 81 are moved to Heart Rate when they are heart-rate-only rows.
- BMI is blank for those rows.
- Every supported data table row gets Edit next to Delete.


BODY MEASUREMENT GRAPH RESTORE:
- Restored Body Measurement Tracker inside Health & Measurements.
- Includes Date, Neck, Chest, Waist, Hips, Arms, Thighs, Body Fat %, Notes.
- Graphs added for Neck, Chest, Waist, Hips, Arms average, Thighs average, Body Fat %.
- Table has Edit and Delete buttons.


UNIVERSAL EDIT BUTTON UPDATE:
- Added universal Edit buttons next to Delete across supported tables.
- Edit modal saves back to localStorage.
- Tables refresh after edit, delete, save, tab changes, and storage changes.
- Supported: Health, Measurements, Peptide Logs, Inventory, Labs, COA, PDF COA, Costs, Vendors, Notes, Protocols, Journal.


VISIBLE EDIT BUTTON FIX:
- Edit buttons are forced into visible data table rows.
- Does not rely only on exact table IDs.
- Adds Actions header when missing.
- Edit modal opens from visible table rows.


ACTIONS COLUMN EDIT BUTTON FIX:
- Forces an Edit button directly into the Actions column for each visible table row.
- Adds Actions header if missing.
- Edit opens modal and saves back to localStorage.
- Delete remains next to Edit.


SECTION ATTACHMENTS UPDATE:
- Attachment upload card added to each main section.
- Shows Attach / Choose File and No file chosen.
- Multiple files supported.
- Files are stored locally under each section key.
- Uploaded files show inside the correct section with Download/Delete.


HEALTH CLEANUP + LIVE CHECK:
- Imported MyPeptideApp/CSV health seed scripts removed.
- Health & Measurements imported records cleared once on first load of this build.
- Manual Clear Health & Measurements button added.
- Live refresh hooks call charts, tables, edit buttons, attachments, dashboard, and premium sections after saves/clicks/tabs.
- Existing non-health site data and sections preserved.


ATTACHMENT HOME CLEANUP:
- Removed static attachment blocks from Home/Login where present.
- Attachment cards excluded from Home, Login, Landing, Dashboard, Reports, Admin, Settings, and Legal pages.
- Duplicate attachment cards removed.
- Attachments remain available on data sections only.


LEGAL NOTICE + SMART UPLOAD UPDATE:
- Attachments removed/excluded from Legal Notice.
- Attachments remain only on allowed data sections.
- CSV/TXT uploads are imported into the section where uploaded when recognized.
- Lab uploads update lab records.
- Health uploads update health charts/records.
- Peptide log uploads update peptide records/estimated levels.
- Inventory, COA, cost, vendor, notes uploads map to their sections.


PDF COA / CERTIFICATION CLEANUP:
- Removed generic Attachments block from PDF COA Storage / Certification Tracker.
- Excluded COA/PDF COA/certification pages from generic section attachments.
- Existing COA-specific storage/upload controls remain unchanged.


COA ATTACH BUTTON UPDATE:
- Added Attach COA file / No file chosen directly next to Add COA.
- COA files store locally and appear in COA file list.
- COA CSV/TXT imports create COA records and refresh tables/charts.
- PDF COA Storage records are created for attached files.
- Existing section smart uploads remain active.


COA SINGLE ATTACH CONTROL:
- COA attach controls found after cleanup: 1
- COA file inputs found after cleanup: 1
- Generic attachment card blocked for COA/PDF COA/certification sections.


COA FILE STATUS CLEANUP:
- Removed default "No file chosen" text next to Attach COA file.
- Status area stays blank until a file is selected.
- After CSV/TXT import, status shows import count only.


DOSE LOG ATTACHMENT CLEANUP:
- Removed generic Attachments block from Dose Log / Peptide Log section.
- Generic section attachments are now excluded from Dose Log / Peptide Log.
- Existing dose log records and forms remain unchanged.


COA TRACKER ATTACH REMOVAL:
- Removed Attach COA file from COA Tracker section.
- Kept Attach COA file only in PDF COA Storage / Certification Tracker where available.
- Attach COA controls in final HTML: 1
- COA file inputs in final HTML: 1


FULL SITE AUDIT:
- Full HTML/site file audit completed.
- Duplicate scripts deduplicated where found.
- COA upload count verified.
- Excluded-page attachment cleanup guard added.
- Final live refresh guard added.
- See FULL_SITE_QA_REPORT.md and FULL_SITE_QA_REPORT.json.


LAB MARKER DROPDOWN FIX:
- Category dropdown now populates reliably.
- Marker dropdown updates when category changes.
- Missing category/marker selects are created if needed.
- Stable field names set: category and marker.


DAILY STEPS TRACKER:
- Added Daily Steps Tracker inside Health & Measurements.
- Live chart updates while typing and after saving.
- Table supports Edit and Delete.


FINAL LIVE & DROPDOWN AUDIT:
- Added master dropdown/live guard.
- Lab marker category and marker dropdowns patched.
- Half-life unit dropdowns patched where present.
- Tabs refresh live data after click.
- See FINAL_LIVE_DROPDOWN_QA_REPORT.md.


FINAL HDTCH:
- Fixed Lab Markers tab target from lab to labs.
- Final QA now shows no missing tab panels and no duplicate IDs/scripts.


PROFESSIONAL UPGRADE:
- Added Professional Executive Dashboard.
- Added Inventory Forecast.
- Added Cost Analytics.
- Added Advanced Lab Analytics.
- Added Research Insights.
- Added Import Center.
- Final QA report included.
