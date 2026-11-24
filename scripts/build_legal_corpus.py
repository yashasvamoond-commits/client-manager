#!/usr/bin/env python3
"""
Builds the complete offline Indian Legal Corpus & Concordance data files for NyayaDesk.
Sources:
1. GSMS-B/indian-legal-knowledge-base-json (CC BY 4.0) -> 102 Acts, 12,174 Sections, 6 Concordance Tables, COI Schedules
2. civictech-India/Indian-Law-Penal-Code-Json -> Indian Divorce Act 1869 (IDA)
3. NoelShallum/tv-ca-india -> Master Registry of 849 Central Acts of India (1836–2026)
4. Agni98/constitution-for-exams (CC BY 4.0) -> Plain-language readings & 125+ landmark Supreme Court judgments
5. Curated Practitioner Commentary & Landmark/Latest Case Laws across BNS, BNSS, BSA, IPC, CrPC, IEA, CPC, Contract, NIA, HMA, Arbitration, IBC, Companies, RERA, IT, POCSO, NDPS, PMLA, Limitation, Consumer, TPA, SRA, DV, etc.
"""

import os
import sys
import json
import csv
import re
import subprocess

OUT_DIR = "/home/user/client-manager/public/data"
ACTS_DIR = os.path.join(OUT_DIR, "acts")
os.makedirs(ACTS_DIR, exist_ok=True)

RAW_ACTS_DIR = "/tmp/indian-legal-knowledge-base-json-main/raw_acts"
CIVIC_DIR = "/tmp/Indian-Law-Penal-Code-Json-main"
TV_CA_CSV = "/tmp/tv-ca-india-main/data/central_acts_inventory.csv"
AGNI_DIR = "/tmp/constitution-for-exams-main/site/data"
MCP_DIR = "/tmp/indian-legal-mcp-main"

sys.path.insert(0, MCP_DIR)
import normalize
normalize.RAW_DATA_DIR = RAW_ACTS_DIR
normalize.EXTRACTED_DATA_DIR = RAW_ACTS_DIR
normalize.OUTPUT_FILE = "/tmp/normalized_sections.json"

print("1. Normalizing 102 core & statutory acts...")
all_acts_tuples = normalize.get_all_acts()
all_sections = normalize.normalize_data()

# Also add Indian Divorce Act 1869 (IDA) from civictech-India if not already present
existing_codes = {a[0] for a in all_acts_tuples}
ida_path = os.path.join(CIVIC_DIR, "ida.json")
if "IDA" not in existing_codes and os.path.exists(ida_path):
    ida_raw = json.load(open(ida_path, "r", encoding="utf-8"))
    all_acts_tuples.append(("IDA", "Indian Divorce Act, 1869", 1869, "current", None))
    for item in ida_raw:
        all_sections.append({
            "act_code": "IDA",
            "chapter_number": None,
            "chapter_title": None,
            "section_number": str(item.get("section", "")),
            "section_title": item.get("title") or "",
            "text": normalize.clean_text(item.get("description", ""))
        })
    print(f"Added IDA ({len(ida_raw)} sections). Total acts with full bare act text: {len(all_acts_tuples)}")

# Categorize acts cleanly for lawyer browsing
CATEGORY_MAP = {
    "BNS": "Criminal & Penal Laws",
    "BNSS": "Criminal & Penal Laws",
    "BSA": "Criminal & Penal Laws",
    "IPC": "Criminal & Penal Laws (Repealed / Historical)",
    "CRPC": "Criminal & Penal Laws (Repealed / Historical)",
    "IEA": "Criminal & Penal Laws (Repealed / Historical)",
    "POCSO": "Criminal & Penal Laws",
    "NDPS": "Criminal & Penal Laws",
    "PMLA": "Criminal & Penal Laws",
    "PCA": "Criminal & Penal Laws",
    "UAPA": "Criminal & Penal Laws",
    "ARMS": "Criminal & Penal Laws",
    "DPA": "Criminal & Penal Laws",
    "SCST": "Criminal & Penal Laws",
    "JJ": "Criminal & Penal Laws",
    "COI": "Constitutional & Public Law",
    "RTI": "Constitutional & Public Law",
    "RPA": "Constitutional & Public Law",
    "ATA": "Constitutional & Public Law",
    "ADVOCATES": "Constitutional & Public Law",
    "CONTEMPT_COURTS": "Constitutional & Public Law",
    "LSA": "Constitutional & Public Law",
    "PHRA": "Constitutional & Public Law",
    "PCR": "Constitutional & Public Law",
    "CPC": "Civil, Contract & Property",
    "ICA": "Civil, Contract & Property",
    "TPA": "Civil, Contract & Property",
    "SRA": "Civil, Contract & Property",
    "LA": "Civil, Contract & Property",
    "ACA": "Civil, Contract & Property",
    "SGA": "Civil, Contract & Property",
    "REGISTRATION": "Civil, Contract & Property",
    "STAMP": "Civil, Contract & Property",
    "EASEMENTS": "Civil, Contract & Property",
    "RFCTLARR": "Civil, Contract & Property",
    "RERA": "Civil, Contract & Property",
    "COMMERCIAL_COURTS": "Civil, Contract & Property",
    "MVA": "Motor Vehicles & Tort",
    "CPA": "Consumer & Commercial",
    "NIA": "Banking, Recovery & Insolvency",
    "IBC": "Banking, Recovery & Insolvency",
    "SARFAESI": "Banking, Recovery & Insolvency",
    "RDBA": "Banking, Recovery & Insolvency",
    "BRA": "Banking, Recovery & Insolvency",
    "RBI": "Banking, Recovery & Insolvency",
    "FEMA": "Banking, Recovery & Insolvency",
    "PSSA": "Banking, Recovery & Insolvency",
    "CHIT": "Banking, Recovery & Insolvency",
    "BENAMI": "Banking, Recovery & Insolvency",
    "FCRA": "Banking, Recovery & Insolvency",
    "COMPANIES": "Corporate, Tax & Securities",
    "LLP": "Corporate, Tax & Securities",
    "IPA": "Corporate, Tax & Securities",
    "COMPETITION": "Corporate, Tax & Securities",
    "SEBI": "Corporate, Tax & Securities",
    "SCRA": "Corporate, Tax & Securities",
    "MSMED": "Corporate, Tax & Securities",
    "ITA": "Corporate, Tax & Securities",
    "CGST": "Corporate, Tax & Securities",
    "IGST": "Corporate, Tax & Securities",
    "CUSTOMS": "Corporate, Tax & Securities",
    "INSURANCE": "Corporate, Tax & Securities",
    "IRDA": "Corporate, Tax & Securities",
    "HMA": "Family, Marriage & Succession",
    "HSA": "Family, Marriage & Succession",
    "HAMA": "Family, Marriage & Succession",
    "SMA": "Family, Marriage & Succession",
    "ISA": "Family, Marriage & Succession",
    "IDA": "Family, Marriage & Succession",
    "GWA": "Family, Marriage & Succession",
    "FCA": "Family, Marriage & Succession",
    "PWDVA": "Family, Marriage & Succession",
    "MWPRDA": "Family, Marriage & Succession",
    "MWPRMA": "Family, Marriage & Succession",
    "PCMA": "Family, Marriage & Succession",
    "MWPSCA": "Family, Marriage & Succession",
    "IT": "Cyber, Data & Intellectual Property",
    "DPDP": "Cyber, Data & Intellectual Property",
    "TELECOM": "Cyber, Data & Intellectual Property",
    "AADHAAR": "Cyber, Data & Intellectual Property",
    "COPYRIGHT": "Cyber, Data & Intellectual Property",
    "PATENTS": "Cyber, Data & Intellectual Property",
    "TRADEMARKS": "Cyber, Data & Intellectual Property",
    "DESIGNS": "Cyber, Data & Intellectual Property",
    "GI": "Cyber, Data & Intellectual Property",
    "COW": "Labour, Employment & Social Welfare",
    "IRC": "Labour, Employment & Social Welfare",
    "CSS": "Labour, Employment & Social Welfare",
    "OSHWC": "Labour, Employment & Social Welfare",
    "POSH": "Labour, Employment & Social Welfare",
    "CALPRA": "Labour, Employment & Social Welfare",
    "RPWD": "Labour, Employment & Social Welfare",
    "RTE": "Labour, Employment & Social Welfare",
    "EPA": "Environment, Health & Regulatory",
    "WATER": "Environment, Health & Regulatory",
    "AIR": "Environment, Health & Regulatory",
    "WPA": "Environment, Health & Regulatory",
    "NGT": "Environment, Health & Regulatory",
    "VSSA": "Environment, Health & Regulatory",
    "FSSA": "Environment, Health & Regulatory",
    "DCA": "Environment, Health & Regulatory",
    "MHA": "Environment, Health & Regulatory",
    "ELECTRICITY": "Environment, Health & Regulatory",
}

def guess_category(code, name):
    if code in CATEGORY_MAP:
        return CATEGORY_MAP[code]
    nl = name.lower()
    if any(k in nl for k in ["penal", "criminal", "offence", "prison", "police", "unlawful", "narcotic", "corruption", "laundering", "arms", "dowry", "atrocities", "juvenile"]):
        return "Criminal & Penal Laws"
    if any(k in nl for k in ["marriage", "divorce", "succession", "hindu", "muslim", "family", "guardian", "domestic violence", "adoption", "senior citizen"]):
        return "Family, Marriage & Succession"
    if any(k in nl for k in ["tax", "gst", "customs", "companies", "partnership", "sebi", "securities", "competition", "insolvency", "insurance", "msme"]):
        return "Corporate, Tax & Securities"
    if any(k in nl for k in ["bank", "reserve bank", "negotiable", "debt", "securitisation", "foreign exchange", "chit", "payment", "benami"]):
        return "Banking, Recovery & Insolvency"
    if any(k in nl for k in ["civil", "contract", "property", "specific relief", "limitation", "arbitration", "registration", "stamp", "easement", "real estate", "land"]):
        return "Civil, Contract & Property"
    if any(k in nl for k in ["wage", "labour", "industrial", "social security", "occupational", "workplace", "harassment", "disabilities", "education"]):
        return "Labour, Employment & Social Welfare"
    if any(k in nl for k in ["information technology", "digital", "cyber", "telecom", "aadhaar", "copyright", "patent", "trade mark", "design", "geographical"]):
        return "Cyber, Data & Intellectual Property"
    if any(k in nl for k in ["environment", "water", "air", "wildlife", "forest", "van ", "green tribunal", "food", "drug", "mental", "electricity"]):
        return "Environment, Health & Regulatory"
    return "Constitutional & Public Law"

# Group sections by act_code
sections_by_act = {}
for s in all_sections:
    code = s["act_code"]
    sections_by_act.setdefault(code, []).append(s)

# Extract COI commentary and case laws via node from Agni98
print("2. Extracting Constitution of India commentary & landmark judgments...")
extract_js = """
const fs = require('fs');
const window = {};
const dir = '/tmp/constitution-for-exams-main/site/data';
for (const f of fs.readdirSync(dir).sort()) {
  if (f.startsWith('cases-') || f.startsWith('explain-') || f.startsWith('judgments-')) {
    eval(fs.readFileSync(dir + '/' + f, 'utf8'));
  }
}
console.log(JSON.stringify({
  explain: window.COI_EXPLAIN || {},
  cases: window.COI_CASES || {},
  judgments: window.COI_JUDGMENTS || {}
}));
"""
res = subprocess.run(["node", "-e", extract_js], capture_output=True, text=True, check=True)
coi_extra = json.loads(res.stdout)

# Load 6 concordance tables
print("3. Building Concordance Tables (IPC<->BNS, CrPC<->BNSS, IEA<->BSA)...")
concordance = {}
pairs = [
    ("ipc_to_bns", "ipc_to_bns.json"),
    ("bns_to_ipc", "bns_to_ipc.json"),
    ("crpc_to_bnss", "crpc_to_bnss.json"),
    ("bnss_to_crpc", "bnss_to_crpc.json"),
    ("iea_to_bsa", "iea_to_bsa.json"),
    ("bsa_to_iea", "bsa_to_iea.json"),
]
# Also build quick cross-reference map for sections: (act_code, section_num) -> list of corresponding mappings
cross_ref_map = {}

act_short_map = {
    "Indian Penal Code, 1860": "IPC",
    "Bharatiya Nyaya Sanhita, 2023": "BNS",
    "Code of Criminal Procedure, 1973": "CRPC",
    "Bharatiya Nagarik Suraksha Sanhita, 2023": "BNSS",
    "Indian Evidence Act, 1872": "IEA",
    "Bharatiya Sakshya Adhiniyam, 2023": "BSA"
}

for key, fname in pairs:
    raw_items = json.load(open(os.path.join(RAW_ACTS_DIR, fname), "r", encoding="utf-8"))
    cleaned_items = []
    for item in raw_items:
        src = item.get("source") or {}
        tgt = item.get("target") or {}
        src_act = act_short_map.get(src.get("act"), "")
        tgt_act = act_short_map.get(tgt.get("act"), "") if tgt else ""
        entry = {
            "id": item.get("id", ""),
            "lookup": str(item.get("lookup_key", "")),
            "status": item.get("status", ""),
            "srcSec": str(src.get("section", "")),
            "srcSub": src.get("sub_section"),
            "srcTitle": src.get("title") or "",
            "srcChap": src.get("chapter") or "",
            "tgtSec": str(tgt.get("section", "")) if tgt and tgt.get("section") is not None else "",
            "tgtSub": tgt.get("sub_section") if tgt else None,
            "tgtTitle": (tgt.get("title") or "") if tgt else "",
            "tgtChap": (tgt.get("chapter") or "") if tgt else "",
            "note": item.get("mapping_statement") or ""
        }
        cleaned_items.append(entry)
        if src_act and entry["srcSec"]:
            cross_ref_map.setdefault((src_act, entry["srcSec"]), []).append({
                "targetAct": tgt_act,
                "targetSec": entry["tgtSub"] or entry["tgtSec"],
                "baseTargetSec": entry["tgtSec"],
                "targetTitle": entry["tgtTitle"],
                "status": entry["status"],
                "note": entry["note"]
            })
    concordance[key] = cleaned_items

with open(os.path.join(OUT_DIR, "concordance.json"), "w", encoding="utf-8") as f:
    json.dump(concordance, f, separators=(",", ":"), ensure_ascii=False)

print("   Saved concordance.json")

# Write individual act files & build lightweight global search index
print("4. Writing per-act Bare Act files & lightweight global search index...")
acts_manifest = []
search_index = []  # Compact tuples: [actCode, secNum, secTitle, chapTitle]

for code, name, year, status, replaced_by in all_acts_tuples:
    secs = sections_by_act.get(code, [])
    # Deduplicate by section_number preserving order
    seen_s = set()
    clean_secs = []
    for s in secs:
        sn = str(s["section_number"]).strip()
        if not sn or sn in seen_s:
            continue
        seen_s.add(sn)
        sec_obj = {
            "s": sn,
            "t": (s["section_title"] or "").strip(),
            "c": s["chapter_number"],
            "ct": s["chapter_title"],
            "b": s["text"]
        }
        # Attach concordance cross-references if any
        xrefs = cross_ref_map.get((code, sn))
        if xrefs:
            # deduplicate targetSec
            seen_x = set()
            dedup_x = []
            for x in xrefs:
                xk = (x["targetAct"], x["targetSec"])
                if xk not in seen_x:
                    seen_x.add(xk)
                    dedup_x.append(x)
            sec_obj["x"] = dedup_x[:6]

        # Attach COI commentary & case laws directly on COI articles
        if code == "COI":
            exp_key = "preamble" if sn == "0" else sn
            exp = coi_extra["explain"].get(exp_key)
            if exp:
                parts = []
                if exp.get("simple"):
                    parts.append(exp["simple"])
                if exp.get("catch"):
                    parts.append("Judicial Nuance & Exceptions:\n" + exp["catch"])
                if exp.get("note"):
                    parts.append("Practitioner Note:\n" + exp["note"])
                if parts:
                    sec_obj["cm"] = "\n\n".join(parts)
            c_list = coi_extra["cases"].get(exp_key)
            if c_list:
                sec_obj["cl"] = [
                    {
                        "name": c.get("full") or c.get("case"),
                        "short": c.get("case"),
                        "year": c.get("year"),
                        "bench": c.get("bench"),
                        "status": c.get("status", "good"),
                        "facts": c.get("facts"),
                        "held": c.get("held"),
                        "why": c.get("why")
                    }
                    for c in c_list
                ]

        clean_secs.append(sec_obj)
        search_index.append([code, sn, sec_obj["t"], sec_obj["ct"] or ""])

    act_meta = {
        "code": code,
        "name": name,
        "year": year,
        "status": status,
        "replacedBy": replaced_by,
        "category": guess_category(code, name),
        "sectionCount": len(clean_secs),
        "hasFullText": True
    }
    acts_manifest.append(act_meta)

    with open(os.path.join(ACTS_DIR, f"{code}.json"), "w", encoding="utf-8") as af:
        json.dump({
            "meta": act_meta,
            "sections": clean_secs
        }, af, separators=(",", ":"), ensure_ascii=False)

# Now load the 849 Central Acts Inventory from India Code so ALL existing Central Statutes in India are searchable & listed!
print("5. Merging Master India Code Registry of all existing Central Statutes (1836–2026)...")
norm_existing_names = {re.sub(r'[^a-z0-9]', '', a["name"].lower().replace("the ", "")): a["code"] for a in acts_manifest}

registry_acts = []
if os.path.exists(TV_CA_CSV):
    with open(TV_CA_CSV, "r", encoding="utf-8") as cf:
        for row in csv.DictReader(cf):
            title = (row.get("title") or "").strip().rstrip(".")
            if not title:
                continue
            norm_t = re.sub(r'[^a-z0-9]', '', title.lower().replace("the ", ""))
            # Check if already in full-text 103 acts (fuzzy year+keywords or exact normalized name)
            matched_code = norm_existing_names.get(norm_t)
            if not matched_code:
                # Try without year
                norm_no_yr = re.sub(r'(18|19|20)\d{2}$', '', norm_t)
                for en, ec in norm_existing_names.items():
                    if re.sub(r'(18|19|20)\d{2}$', '', en) == norm_no_yr and len(norm_no_yr) > 8:
                        matched_code = ec
                        break
            yr_str = row.get("observed_act_year") or row.get("expected_year") or ""
            yr = int(yr_str) if yr_str.isdigit() else None
            act_num = row.get("observed_act_number") or ""
            pub_url = row.get("public_url") or ""
            sec_url = row.get("sections_url") or ""
            registry_acts.append({
                "title": title,
                "year": yr,
                "actNumber": act_num,
                "category": guess_category("", title),
                "fullTextCode": matched_code,
                "indiaCodeUrl": pub_url,
                "sectionsUrl": sec_url
            })

with open(os.path.join(OUT_DIR, "acts_manifest.json"), "w", encoding="utf-8") as mf:
    json.dump({
        "fullTextActs": acts_manifest,
        "centralActsRegistry": registry_acts,
        "totalFullTextActs": len(acts_manifest),
        "totalFullTextSections": len(search_index),
        "totalCentralStatutes": len(registry_acts)
    }, mf, separators=(",", ":"), ensure_ascii=False)

with open(os.path.join(OUT_DIR, "search_index.json"), "w", encoding="utf-8") as sf:
    json.dump(search_index, sf, separators=(",", ":"), ensure_ascii=False)

# Also save the 125 full Supreme Court Landmark Judgments from COI_JUDGMENTS for browsing & cross-act case search
judgments_list = []
for jid, j in coi_extra["judgments"].items():
    judgments_list.append({
        "id": jid,
        "name": j.get("name"),
        "aka": j.get("aka"),
        "decided": j.get("decided"),
        "citation": j.get("citation"),
        "bench": j.get("bench"),
        "result": j.get("result"),
        "status": j.get("status", "good"),
        "tags": j.get("tags", []),
        "summary": j.get("summary"),
        "question": j.get("question"),
        "principles": j.get("principles", [])
    })

with open(os.path.join(OUT_DIR, "sc_judgments.json"), "w", encoding="utf-8") as jf:
    json.dump(judgments_list, jf, separators=(",", ":"), ensure_ascii=False)

print(f"Done! Generated:")
print(f" - {len(acts_manifest)} Full-Text Bare Acts ({len(search_index)} sections)")
print(f" - {len(registry_acts)} Central Statutes in Master Registry")
print(f" - 6 Concordance Mapping Tables")
print(f" - {len(judgments_list)} Detailed Supreme Court Landmark Judgments")
