# NyayaDesk — Advocate Client Manager & Indian Law Suite (Android & iOS)

**NyayaDesk** is an offline-first mobile and desktop Client Manager built specifically for Indian Advocates and Law Chambers.

## Key Modules Built for Advocates

1. **Client & Fee Ledger Manager (`Clients & Fees`)**
   - Record complete client details, matter/brief particulars (what you are dealing with), court/forum, CNR/FIR/Case number, opposite party, and sections involved.
   - Track **Fee Quoted vs. Fee Paid vs. Balance Receivable**, out-of-pocket disbursements, court hearing logs, **1-click Official PDF Fee Receipts**, and **WhatsApp Fee Reminders**.

2. **Legal Agreement, Quotation & Chamber Drafter (`Agreements & Quotations`)**
   - Auto-fills directly from any selected client docket and generates print/PDF-ready legal documents compliant with the **Advocates Act, 1961** & **Bar Council of India Rules**:
     - **Client–Lawyer Legal Engagement & Fee Retainer Agreement**
     - **Itemised Professional Fee Quotation** (with INR words conversion & UPI/Bank schedule)
     - **Court Vakalatnama**
     - **Statutory Legal Notice**
     - **Section 63(4) BSA, 2023 Electronic Evidence Certificate** (Part A & Part B with SHA-256 hash)

3. **100% Offline Criminal Sanhita Converter & Table Generator (`IPC/BNS • CrPC/BNSS • IEA/BSA`)**
   - Bi-directional offline concordance across **2,629 statutory mappings**:
     - **IPC (1860) ↔ BNS (2023)**
     - **CrPC (1973) ↔ BNSS (2023)**
     - **Indian Evidence Act (1872) ↔ Bharatiya Sakshya Adhiniyam (2023)**
   - **Multi-Section FIR / Charge-Sheet Comparative Table Generator** — enter comma-separated sections (e.g., `302, 307, 420, 498A, 120B`) to generate a printable comparative chart for court annexures.

4. **All-India Statutory Corpus, Bare Acts, Commentary & Case Laws (`Indian Laws & Case Laws`)**
   - **103 Complete Full-Text Bare Acts (12,238 Sections Cached Offline)** across Criminal, Constitutional, Civil, Contract, Property, Family, Corporate, Banking/IBC, Labour, Cyber/IPR, Tax, and Environment domains.
   - **Master Registry of All 849 Existing Central Statutes in India (1836–2026)** with Act Numbers, Years, and India Code links.
   - **Section-Level Commentary, Ingredients, Practice Tips & Landmark / Latest Supreme Court Case Laws** (including 125+ Constitution Bench & landmark Supreme Court rulings and latest 2024–2025 BNS/BNSS/BSA/NIA/PMLA/Arbitration precedents).

5. **Advocate Practice Tools & Universal Mobile Install (`Lawyer Tools & Phone Install`)**
   - **Statutory Limitation & Sec. 138 NI Act Calculator** (with Sec. 12 certified copy exclusion)
   - **Sec. 34 CPC / Arbitral Pre-Suit & Pendente Lite Interest Calculator**
   - **Ad-Valorem Suit Valuation & Court Fee Estimator**
   - **Private On-Device Storage + JSON Chamber Backup & Restore**

---

## Install on Android & iOS (No Tech Skills Required)

Open the live application link on your phone:
- **Android (Chrome):** Tap **"Install on Android / iOS"** in the top bar (or Chrome menu `⋮` → **"Install app"** / **"Add to Home screen"**).
- **iPhone / iPad (Safari):** Tap the **Share** button (`↑`) at the bottom of Safari → **"Add to Home Screen"** → **"Add"**.

Once added to your Home Screen, all **12,238 Bare Act sections**, **IPC/BNS/CrPC/BNSS/IEA/BSA converters**, and your **Client & Fee database** work **100% offline** inside courtrooms.

## Local Development & Native Capacitor Builds

```bash
npm install
npm run dev      # Start local dev server
npm run build    # Build offline PWA bundle into dist/

# Optional native Android / iOS project generation via Capacitor:
npx cap add android
npx cap add ios
npx cap sync
```

## Legal Data Attribution & Disclaimer
- Statutory corpus derived from Government of India Gazette / India Code publications and open structured legal datasets (`GSMS-B/indian-legal-knowledge-base-json`, `Agni98/constitution-for-exams`, CC BY 4.0).
- Intended as a chamber management and legal reference tool for advocates; always cross-verify statutory text with the official Gazette of India (`indiacode.nic.in`) for formal court filings.
