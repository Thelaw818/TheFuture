# COA Upload Merge Report

Updated: 2026-07-05

## Added to Future COA database

Added 7 new COA records to:
- `COA Database`
- `Certificates`
- `Inventory`
- dashboard counts
- embedded workbook fallback in `index.html`

All uploaded COA files were copied into `assets/coa/`.

| COA ID | Compound | Lab | File | Result |
|---|---|---|---|---|
| COA-0028 | BPC/TB Blend 10mg | Testides | PT-BPCTB-10-062226-01.pdf | 11.85mg, 99.81% |
| COA-0029 | MOTS-C 40mg | Testides | PT-MOTS-40-062226-01.pdf | 45.03mg, 99.39% |
| COA-0030 | Retatrutide 20mg | Testides | PT-RETA-20-062226-01.pdf | 21.40mg, 99.49% |
| COA-0031 | Retatrutide 30mg | Testides | PT-RETA-30-062226-01.pdf | 33.77mg, 99.58% |
| COA-0032 | Semaglutide 15mg | Kovera Labs | photo_2026-07-04_22-14-31.jpg | 15.53mg, 99.642% |
| COA-0033 | Tirzepatide 30mg | Kovera Labs | photo_2026-07-04_22-34-37.jpg | 33.24mg, 99.600% |
| COA-0034 | Tirzepatide 15mg | Kovera Labs | photo_2026-07-04_22-35-21.jpg | 15.59mg, 99.747% |

## Duplicate check

No exact duplicate was found by matching compound + lab + test/certified date + report/file identifier + actual content. Similar products already existed, but they are different labs, strengths, report IDs, or batch details, so they were kept as separate COA records.

## Items to review

- The three Kovera image COAs have report number, access code, client, and batch redacted in the image. They were added, but the database marks these fields as `Redacted`.
- The Testides PDF COAs list lot number as `BATCH-01` for all four PDFs. They were kept separate by report number and compound/strength.
- The PDF preview PNGs were copied into `assets/coa/` as backup/preview files, but only the PDFs were linked as certificate files.
