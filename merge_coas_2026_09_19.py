#!/usr/bin/env python3
import hashlib
import json
import re
import shutil
from pathlib import Path

import update_coas as base

ROOT = Path(__file__).resolve().parent
INCOMING = ROOT.parent.parent / "newcoas"


def make_record(cid, compound, ctype, labeled, actual, purity, lab, test_date,
                batch, source, cap, crimp, notes):
    variance = round(actual - labeled, 3)
    pct = variance / labeled
    status = "Overfilled" if pct > 0.05 else "Underfilled" if pct < -0.05 else "On label"
    return [cid, compound, ctype, labeled, actual, variance, pct, purity, status,
            lab, "Confirmed", test_date, "Redacted", "Redacted", batch, source,
            "Pass", "Unique product/strength/date/lab record", notes, crimp, cap,
            f"{cap} flip-off cap with {crimp.lower()} aluminum crimp, as shown/listed in the COA."]


SPECS = [
    ("COA-0086", "BPC-157", "Healing / Recovery", 20, 22.06, 99.16,
     "Freedom Diagnostics", "2026-09-16", "BPC15720-2609-01-PUR-SLV",
     "BPC157 20MG 9-16-26.jpg", "Purple", "Silver",
     "Identity confirmed by LC-MS; HPLC-UV purity 99.16%; net content 22.06 mg. Endotoxin replicates PASS; PCR found no detectable microbial DNA; ICP-MS elemental impurities passed; no fentanyl detected. Samples: 99.16% / 22.26 mg and 99.15% / 21.85 mg."),
    ("COA-0087", "KPV", "Healing / Anti-Inflammatory Research", 10, 13.04, 99.79,
     "Freedom Diagnostics", "2026-09-16", "KPV10-2609-01-BLU-SLV",
     "KPV10MG 9-18-26.jpg", "Blue", "Silver",
     "Identity confirmed by LC-MS; HPLC-UV purity 99.79%; net content 13.04 mg. Endotoxin replicates PASS; PCR found no detectable microbial DNA; ICP-MS elemental impurities passed; no fentanyl detected. Samples: 99.78% / 13.21 mg and 99.80% / 12.87 mg."),
    ("COA-0088", "MOTS-C", "Metabolic / Mitochondrial Research", 20, 22.84, 99.74,
     "Freedom Diagnostics", "2026-09-18", "MOTSC20-2609-01-BLK-SLV",
     "MotsC20MG 9-18-26.jpg", "Black", "Silver",
     "Identity confirmed by LC-MS; HPLC-UV purity 99.74%; net content 22.84 mg. Endotoxin replicates PASS; PCR found no detectable microbial DNA; ICP-MS elemental impurities passed; no fentanyl detected. Samples: 99.73% / 22.96 mg and 99.75% / 22.71 mg."),
    ("COA-0089", "Retatrutide", "GLP-1 / Weight Research", 10, 11.76, 99.74,
     "Freedom Diagnostics", "2026-09-18", "GLPRT10-2609-01-CLR-COP",
     "RT10MG9-18-26.jpg", "Clear", "Copper",
     "Identity confirmed as GLP-RT by LC-MS; HPLC-UV purity 99.74%; net content 11.76 mg. Endotoxin replicates PASS; PCR found no detectable microbial DNA; ICP-MS elemental impurities passed; no fentanyl detected. Samples: 99.75% / 11.49 mg and 99.72% / 12.03 mg."),
    ("COA-0090", "SS-31", "Metabolic / Mitochondrial Research", 50, 58.95, 99.82,
     "Freedom Diagnostics", "2026-09-16", "FPC3150-2609-01-PUR-SLV",
     "SS31 50MG 9-16-26.jpg", "Purple", "Silver",
     "Identity confirmed by LC-MS; HPLC-UV purity 99.82%; net content 58.95 mg. Endotoxin replicates PASS; PCR found no detectable microbial DNA; ICP-MS elemental impurities passed; no fentanyl detected. Samples: 99.84% / 59.02 mg and 99.79% / 58.88 mg."),
    ("COA-0091", "Tirzepatide", "GLP-1 / Weight Research", 30, 32.14, 99.233,
     "Kovera Labs", "2026-08-20", "Redacted",
     "photo_2026-09-18_21-57-14.jpg", "Blue", "Silver",
     "Identity confirmed as TRZ by LC-MS; batch average purity 99.233%; batch average net content 32.14 mg. Endotoxin safety screen PASS; arsenic, cadmium, lead, and mercury negative. Vials: 99.307% / 32.51 mg and 99.158% / 31.77 mg."),
    ("COA-0092", "Tirzepatide", "GLP-1 / Weight Research", 60, 63.89, 99.727,
     "Kovera Labs", "2026-08-20", "Redacted",
     "photo_2026-09-18_21-57-16.jpg", "Yellow", "Silver",
     "Identity confirmed as TRZ by LC-MS; batch average purity 99.727%; batch average net content 63.89 mg. Endotoxin safety screen PASS; arsenic, cadmium, lead, and mercury negative. Vials: 99.676% / 63.96 mg and 99.777% / 63.81 mg."),
]


def destination(spec):
    _, compound, _, labeled, _, _, lab, date, _, incoming, _, _, _ = spec
    lab_slug = "freedom-diagnostics" if lab == "Freedom Diagnostics" else "kovera-labs"
    product_slug = compound.lower().replace("+", "plus").replace("-", "-").replace(" ", "-")
    clean_date = date
    name = f"{compound}-{labeled}mg-{clean_date}-{'Freedom' if lab_slug == 'freedom-diagnostics' else 'Kovera'}.jpg"
    return Path("assets/coa/images") / lab_slug / product_slug / name


def add_detail(sheets, row, spec):
    detail = base.detail_sheet(row)
    detail[15:15] = [
        ["Identity Method", "LC-MS"], ["Purity Method", "HPLC-UV"],
        ["Form", "White Lyophilized Powder"], ["Endotoxin", "Pass"],
        ["Heavy Metals", "Pass/Negative"],
    ]
    sheets[f"COA_{row[0].replace('-', '_')}"] = detail


def main():
    data = json.loads((ROOT / "coa-database.json").read_text(encoding="utf-8"))
    sheets = data["sheets"]
    existing = {r[0] for r in sheets["COA Database"][1:]}
    records = []
    gallery = []
    for spec in SPECS:
        rel = destination(spec)
        target = ROOT / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(INCOMING / spec[9], target)
        row = make_record(*spec[:9], rel.as_posix(), *spec[10:])
        records.append(row)
        if row[0] not in existing:
            sheets["COA Database"].append(row)
        add_detail(sheets, row, spec)
        gallery.append(f'  {{preview:"{rel.as_posix().removeprefix("assets/coa/")}", pdf:null, label:"{row[1]} {row[3]}mg — {row[0]} — {row[20]} cap / {row[19]} crimp"}},')

    base.rebuild_sheets(sheets)
    labs = {}
    for r in sheets["COA Database"][1:]:
        labs[r[9]] = labs.get(r[9], 0) + 1
    sheets["Lab Directory"] = [["Lab", "COA Records", "Available in Filters"]] + [[k, labs[k], "Yes"] for k in sorted(labs)]
    data["version"] = "2026-09-19-coa-0092-complete-sync"
    (ROOT / "coa-database.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    base.records = records
    for name in ("inventory.xlsx", "inventory_updated.xlsx"):
        base.update_workbook(ROOT / name, sheets)
    base.update_index(sheets)

    gallery_path = ROOT / "coa-pictures.html"
    text = gallery_path.read_text(encoding="utf-8")
    if "COA-0086" not in text:
        text = text.replace("const NEW_ITEMS = [", "const NEW_ITEMS = [\n" + "\n".join(gallery), 1)
    gallery_path.write_text(text, encoding="utf-8")

    manifest_path = ROOT / "COA_FILE_MANIFEST.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    known = {x.get("path") for x in manifest.get("files", [])}
    for spec, row in zip(SPECS, records):
        rel = row[15]
        file_path = ROOT / rel
        if rel not in known:
            manifest["files"].append({"path": rel, "category": "COA image", "lab": row[9], "product": row[1], "role": "image", "sha256": hashlib.sha256(file_path.read_bytes()).hexdigest(), "bytes": file_path.stat().st_size})
    manifest["total_files"] = len(manifest["files"])
    manifest["generated"] = "2026-09-19T00:00:00Z"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    mirror = ROOT / "UPLOAD-FIRST-COA-ONLY"
    for row in records:
        src = ROOT / row[15]
        dst = mirror / row[15]
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
    for name in ("coa-database.json", "coa-pictures.html"):
        shutil.copy2(ROOT / name, mirror / name)
    print(f"Merged {len(records)} COAs; total records: {len(sheets['COA Database']) - 1}")


if __name__ == "__main__":
    main()
