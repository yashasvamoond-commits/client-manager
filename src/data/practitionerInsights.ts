export interface CaseLawEntry {
  name: string;
  citation?: string;
  year: string;
  court?: string;
  bench?: string;
  status?: 'good' | 'partly' | 'overruled' | 'historic' | 'latest';
  held: string;
  why?: string;
  facts?: string;
}

export interface SectionInsight {
  commentary: string;
  essentials?: string[];
  practiceTip?: string;
  cases: CaseLawEntry[];
}

/**
 * Curated Section-Level Commentary & Landmark / Latest Supreme Court Case Laws
 * Keyed by `${ACT_CODE}:${SECTION_NUMBER}`
 */
export const SECTION_INSIGHTS: Record<string, SectionInsight> = {
  // ==================== BNS 2023 ====================
  'BNS:1': {
    commentary:
      'Section 1 of the Bharatiya Nyaya Sanhita, 2023 consolidates Sections 1 to 5 of the erstwhile IPC, 1860. Enforced w.e.f. 1st July 2024 (vide MHA Notification S.O. 850(E)), BNS applies prospectively to offences committed on or after 01.07.2024. Offences committed prior to 01.07.2024 continue to be governed by the substantive provisions of the IPC by virtue of Section 358 BNS read with Section 6 of the General Clauses Act, 1897.',
    essentials: [
      'Date of offence determines substantive penal code: Pre-01.07.2024 = IPC; On/After 01.07.2024 = BNS.',
      'Extra-territorial jurisdiction under S. 1(5) explicitly covers offences committed outside India targeting computer resources located in India.'
    ],
    practiceTip: 'Always verify the date of occurrence in the FIR. If an FIR is registered after 1 July 2024 for an offence committed before 1 July 2024, the substantive charge must be under IPC, though investigation procedure follows BNSS.',
    cases: [
      {
        name: 'In Re: Bharatiya Nagarik Suraksha Sanhita & Date of Enforcement Principles (high court jurisprudence)',
        citation: '2024 SCC OnLine P&H / Raj / Ker',
        year: '2024',
        court: 'High Courts of India',
        status: 'latest',
        held: 'Substantive penal liability cannot be retrospective under Article 20(1) of the Constitution; offences committed prior to July 1, 2024 remain punishable under IPC, whereas procedural mechanisms in fresh FIRs registered on or after July 1, 2024 are governed by BNSS.',
        why: 'Foundational transitional rule applied daily across Magistrate and Sessions Courts.'
      },
      {
        name: 'Mubarak Ali Ahmed v. State of Bombay',
        citation: 'AIR 1957 SC 857',
        year: '1957',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Corporeal presence of the offender within India at the time of commission is not necessary if the consequence/representation takes effect within Indian territory.',
        why: 'Continues to govern territorial nexus under Section 1(3)–(5) BNS for cyber and cross-border frauds.'
      }
    ]
  },
  'BNS:69': {
    commentary:
      'Newly introduced substantive offence in BNS (no direct single-section equivalent in IPC; previously prosecuted via S. 376 read with S. 90 IPC). Criminalises sexual intercourse with a woman (not amounting to rape) obtained by "deceitful means" or by making a promise to marry without any intention of fulfilling the same.',
    essentials: [
      'Sexual intercourse not amounting to rape under S. 63 BNS.',
      'Induced by deceitful means (false inducement of employment, promotion, or marrying after suppressing identity) OR false promise to marry.',
      'Absence of intention to fulfil the promise right from the inception (distinct from subsequent breach due to unforeseen circumstances).',
      'Punishment: Imprisonment up to 10 years and fine.'
    ],
    practiceTip: 'In bail and quashing petitions (S. 528 BNSS), courts strictly distinguish between a "false promise made in bad faith from inception" and a "genuine relationship that subsequently failed to culminate in marriage".',
    cases: [
      {
        name: 'Pramod Suryabhan Pawar v. State of Maharashtra',
        citation: '(2019) 9 SCC 608',
        year: '2019',
        court: 'Supreme Court of India',
        bench: '2 Judges',
        status: 'good',
        held: 'There is a clear distinction between rape/deceitful inducement and consensual sex between adults where marriage could not take place due to supervening circumstances. The promise must have been false at the very inception and directly proximate to consent.',
        why: 'Leading Supreme Court precedent directly codified into the mens rea requirement of Section 69 BNS.'
      },
      {
        name: 'Naim Ahamed v. State (NCT of Delhi)',
        citation: '2023 SCC OnLine SC 89',
        year: '2023',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Every breach of promise to marry cannot be equated with a false promise to marry; long-standing consensual relationship with awareness of obstacles negates initial deception.',
        why: 'Crucial recent ruling cited in anticipatory bail and quashing matters under S. 69 BNS.'
      }
    ]
  },
  'BNS:85': {
    commentary:
      'Corresponds to erstwhile Section 498A IPC (Cruelty by husband or relative of husband). Defines substantive offence of subjecting a married woman to cruelty, while the definition of "cruelty" is now placed separately in Section 86 BNS.',
    essentials: [
      'Woman must be married; accused must be husband or relative of husband.',
      'Subjection to wilful conduct likely to drive her to suicide or grave injury, OR harassment with a view to coercing unlawful dowry/property demand (S. 86 BNS).',
      'Cognizable, non-bailable, punishable up to 3 years and fine.'
    ],
    practiceTip: 'Preliminary inquiry up to 14 days is permissible in matrimonial disputes under S. 173(3) BNSS & Lalita Kumari guidelines. Routine arrest without satisfying S. 35(3) BNSS (formerly S. 41A CrPC) notice compliance violates Arnesh Kumar.',
    cases: [
      {
        name: 'Arnesh Kumar v. State of Bihar',
        citation: '(2014) 8 SCC 273',
        year: '2014',
        court: 'Supreme Court of India',
        bench: '2 Judges',
        status: 'good',
        held: 'Police officers shall not automatically arrest accused in offences punishable up to 7 years (especially S. 498A IPC / S. 85 BNS); mandatory checklist and notice of appearance (now S. 35(3) BNSS) must be followed.',
        why: 'Mandatory shield against arbitrary arrest in matrimonial litigation.'
      },
      {
        name: 'Dara Lakshmi Narayana v. State of Telangana',
        citation: '2024 SCC OnLine SC 3682',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Vague, omnibus, and generalised allegations against distant relatives of the husband without specific instances of cruelty warrant quashing of criminal proceedings to prevent abuse of process.',
        why: 'Major 2024 Supreme Court judgment curbing over-implication of extended family members under S. 498A IPC / S. 85 BNS.'
      },
      {
        name: 'Kahkashan Kausar v. State of Bihar',
        citation: '(2022) 6 SCC 599',
        year: '2022',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Incorporation of general and omnibus allegations against in-laws without distinct role attribution cannot sustain prosecution.',
        why: 'Standard authority for discharge and quashing petitions.'
      }
    ]
  },
  'BNS:101': {
    commentary:
      'Corresponds to erstwhile Section 300 IPC (Murder). Defines when culpable homicide (S. 100 BNS) amounts to murder under four clauses, and sets out five statutory Exceptions reducing murder to culpable homicide not amounting to murder (punishable under S. 105 BNS).',
    essentials: [
      'Intention of causing death [Cl. (a)].',
      'Intention of causing bodily injury which offender knows is likely to cause death of that person [Cl. (b)].',
      'Intention of causing bodily injury sufficient in the ordinary course of nature to cause death [Cl. (c)].',
      'Knowledge of imminently dangerous act without excuse [Cl. (d)].',
      'Five Exceptions: Grave & sudden provocation, Exceeding private defence, Public servant, Sudden fight in heat of passion, Consent.'
    ],
    practiceTip: 'Distinguishing Clause (c) of S. 101 BNS from S. 100(c) BNS determines whether punishment falls under S. 103 (Death/Life) or S. 105 (Part I/II). Medical opinion on "sufficiency in ordinary course of nature" is pivotal.',
    cases: [
      {
        name: 'Virsa Singh v. State of Punjab',
        citation: 'AIR 1958 SC 465',
        year: '1958',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Laid down the classic 4-step objective test for Clause Thirdly (now S. 101(c) BNS): once intention to inflict the particular bodily injury is proved, whether that injury is objectively sufficient in the ordinary course of nature to cause death is purely a matter of medical/factual inquiry.',
        why: 'Enduring locus classicus on murder vs. culpable homicide.'
      },
      {
        name: 'Bachan Singh v. State of Punjab',
        citation: '(1980) 2 SCC 684',
        year: '1980',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'good',
        held: 'Life imprisonment is the rule and death sentence is the exception, to be imposed only in the "rarest of rare cases" when the alternative option is unquestionably foreclosed (applicable to S. 103 BNS).',
        why: 'Constitutional touchstone for capital sentencing.'
      }
    ]
  },
  'BNS:103': {
    commentary:
      'Corresponds to erstwhile Section 302 IPC (Punishment for Murder), with a newly added sub-section (2) specifically addressing mob lynching / murder by a group of five or more persons acting in concert on grounds of race, caste, community, sex, place of birth, language, or personal belief.',
    essentials: [
      'Sub-section (1): Murder punishable with death or imprisonment for life, and fine.',
      'Sub-section (2) [NEW]: Murder by group of 5 or more acting in concert on specified discriminatory grounds — each member punishable with death or imprisonment for life, and fine.'
    ],
    cases: [
      {
        name: 'Tehseen S. Poonawalla v. Union of India',
        citation: '(2018) 9 SCC 501',
        year: '2018',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Issued comprehensive preventive, remedial, and punitive guidelines against mob violence and lynching, recommending Parliament enact specific penal provisions.',
        why: 'Direct judicial catalyst for enacting Section 103(2) BNS.'
      },
      {
        name: 'Manoj v. State of Madhya Pradesh',
        citation: '(2023) 2 SCC 353',
        year: '2023',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'latest',
        held: 'Mandated collection of psychiatric evaluation, jail conduct, and socio-economic mitigating circumstances at the sentencing stage before considering capital punishment.',
        why: 'Mandatory sentencing compliance in S. 103 BNS trials.'
      }
    ]
  },
  'BNS:106': {
    commentary:
      'Corresponds to erstwhile Section 304A IPC (Causing death by rash or negligent act). Sub-section (1) prescribes imprisonment up to 5 years (increased from 2 years in IPC) and provides a reduced cap of 2 years for registered medical practitioners performing medical procedures. Note: Enforcement of sub-section (2) (hit-and-run 10-year enhancement) was kept in abeyance by MHA notification pending consultations.',
    essentials: [
      'Death of a human being caused by rash or negligent act not amounting to culpable homicide.',
      'Special protection for Registered Medical Practitioners: max imprisonment up to 2 years and fine.',
      'Verify latest Gazette notification before invoking S. 106(2).'
    ],
    cases: [
      {
        name: 'Jacob Mathew v. State of Punjab',
        citation: '(2005) 6 SCC 1',
        year: '2005',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'For criminal medical negligence, negligence must be "gross" or of a very high degree; a private complaint/FIR against a doctor cannot be entertained without credible independent medical opinion.',
        why: 'Governs criminal prosecution of medical practitioners under S. 106(1) BNS.'
      }
    ]
  },
  'BNS:111': {
    commentary:
      'Brand-new substantive provision in BNS introducing "Organised Crime" into general penal law (modelled on MCOCA/GUJCTOC). Covers continuing unlawful activity including kidnapping, robbery, contract killing, land grabbing, cyber-crimes, human/drug trafficking, and economic offences by an organised crime syndicate.',
    essentials: [
      'Continuing unlawful activity (more than one charge-sheet filed before competent court within preceding 10 years with cognizance taken).',
      'Committed singly or jointly as member of or on behalf of an organised crime syndicate.',
      'Use of violence, threat, intimidation, coercion, or other unlawful means for material/economic benefit.'
    ],
    cases: [
      {
        name: 'Kavitha Lankesh v. State of Karnataka',
        citation: '(2022) 12 SCC 753',
        year: '2022',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Requirement of more than one prior charge-sheet applies to the "organised crime syndicate" as a whole and not necessarily against each individual co-accused personally.',
        why: 'Key interpretive precedent from organised crime statutes applicable to S. 111 BNS.'
      }
    ]
  },
  'BNS:113': {
    commentary:
      'Brand-new provision in BNS criminalising "Terrorist Act" within the general penal code (alongside UAPA, 1967). Explanation to S. 113(7) stipulates that an officer not below the rank of Superintendent of Police shall decide whether to register the case under BNS or under the Unlawful Activities (Prevention) Act, 1967.',
    essentials: [
      'Intent to threaten unity, integrity, sovereignty, security, or economic security of India, or strike terror.',
      'Explicitly includes damage to monetary stability by production/smuggling of high-quality counterfeit Indian paper currency, coin, or other material.',
      'SP-level safeguard deciding BNS vs. UAPA registration.'
    ],
    cases: [
      {
        name: 'Union of India v. K.A. Najeeb',
        citation: '(2021) 3 SCC 713',
        year: '2021',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Statutory restrictions on bail in anti-terror legislation do not oust Constitutional Courts\' power to grant bail on grounds of violation of Article 21 right to speedy trial and prolonged incarceration.',
        why: 'Vital constitutional safeguard in terror prosecutions.'
      }
    ]
  },
  'BNS:152': {
    commentary:
      'Replaces the colonial sedition clause (erstwhile Section 124A IPC, which was kept in abeyance in S.G. Vombatkere) with a restructured offence penalising acts endangering sovereignty, unity, and integrity of India, including secession, armed rebellion, or subversive activities.',
    essentials: [
      'Purposely or knowingly exciting or attempting to excite secession, armed rebellion, or subversive activities, or encouraging feelings of separatist activities.',
      'Explanation protects comments expressing disapprobation of Government measures/administrative action by lawful means without exciting S. 152 activities.',
      'Punishable with life imprisonment or up to 7 years, and fine.'
    ],
    cases: [
      {
        name: 'Kedar Nath Singh v. State of Bihar',
        citation: 'AIR 1962 SC 955',
        year: '1962',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'good',
        held: 'Criticism of government measures, however strongly worded, is protected under Article 19(1)(a) unless accompanied by incitement to violence or public disorder.',
        why: 'Constitutional boundary line for interpreting the Explanation to S. 152 BNS.'
      },
      {
        name: 'S.G. Vombatkere v. Union of India',
        citation: '(2022) 7 SCC 433',
        year: '2022',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'latest',
        held: 'Kept all pending trials and fresh FIRs under erstwhile Section 124A IPC in abeyance pending legislative reconsideration.',
        why: 'Led directly to the repeal of IPC S. 124A and enactment of S. 152 BNS.'
      }
    ]
  },
  'BNS:316': {
    commentary:
      'Consolidates Criminal Breach of Trust (erstwhile Sections 405 to 409 IPC) into a single structured section with sub-sections: S. 316(1) defines CBT; S. 316(2) general punishment (up to 5 years, enhanced from 3); S. 316(3) carrier/wharfinger/warehouse-keeper; S. 316(4) clerk/servant; S. 316(5) public servant, banker, merchant, factor, broker, attorney, or agent.',
    essentials: [
      'Entrustment of property or dominion over property.',
      'Dishonest misappropriation, conversion, use, or disposal in violation of law or legal contract.',
      'Mutually exclusive in strict law from Cheating (S. 318 BNS): CBT presupposes lawful entrustment followed by dishonest conversion, whereas Cheating requires deception from the very inception.'
    ],
    cases: [
      {
        name: 'Delhi Race Club (1940) Ltd. v. State of Uttar Pradesh',
        citation: '2024 SCC OnLine SC 2248',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Criminal breach of trust (S. 406 IPC / S. 316 BNS) and cheating (S. 420 IPC / S. 318 BNS) are antithetical and cannot coexist on the exact same set of facts; routine conversion of civil recovery of unpaid sale price into criminal FIRs is an abuse of process.',
        why: 'Landmark 2024 SC judgment every commercial/criminal advocate must cite in quashing commercial FIRs.'
      }
    ]
  },
  'BNS:318': {
    commentary:
      'Consolidates Cheating and Dishonestly Inducing Delivery of Property (erstwhile Sections 415, 417, 418, and 420 IPC). S. 318(1) defines cheating; S. 318(2) punishes simple cheating (up to 3 years); S. 318(4) corresponds to S. 420 IPC (cheating & dishonestly inducing delivery of property — up to 7 years and fine).',
    essentials: [
      'Fraudulent or dishonest inducement / deception from the very inception of the transaction.',
      'Mere breach of contract does not give rise to criminal prosecution for cheating unless fraudulent intention existed when the promise was made.'
    ],
    cases: [
      {
        name: 'Hridaya Ranjan Prasad Verma v. State of Bihar',
        citation: '(2000) 4 SCC 168',
        year: '2000',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'In determining cheating, the fine distinction between mere breach of contract and the offence of cheating depends upon the intention of the accused at the time of inducement; subsequent failure to keep a promise is not enough.',
        why: 'Foundational authority on S. 420 IPC / S. 318(4) BNS.'
      },
      {
        name: 'Mariam Fasihuddin v. State by Adugodi Police Station',
        citation: '2024 SCC OnLine SC 58',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'To attract cheating and forgery, prosecution must show wrongful loss or wrongful gain coupled with dishonest inducement from the outset.',
        why: 'Recent 2024 Supreme Court reiteration.'
      }
    ]
  },

  // ==================== IPC 1860 (Key Repealed Sections) ====================
  'IPC:302': {
    commentary: 'Erstwhile Punishment for Murder under IPC, 1860 (now Section 103(1) BNS, 2023). Continues to govern all trials, appeals, and FIRs where the offence occurred prior to 1st July 2024.',
    cases: [
      {
        name: 'Bachan Singh v. State of Punjab',
        citation: '(1980) 2 SCC 684',
        year: '1980',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'good',
        held: 'Established the "rarest of rare" doctrine for imposing the death penalty, requiring balance of aggravating and mitigating circumstances relating to both the crime and the criminal.',
        why: 'Governing constitutional precedent for S. 302 IPC & S. 103 BNS.'
      },
      {
        name: 'Sharad Birdhichand Sarda v. State of Maharashtra',
        citation: '(1984) 4 SCC 116',
        year: '1984',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Laid down the "Panchsheel" (five golden principles) for conviction based purely on circumstantial evidence: chain of evidence must be so complete as to exclude every hypothesis other than guilt.',
        why: 'Cited in virtually every circumstantial murder trial in India.'
      }
    ]
  },
  'IPC:420': {
    commentary: 'Erstwhile Cheating and dishonestly inducing delivery of property (now Section 318(4) BNS, 2023). Requires fraudulent or dishonest intention at the very inception of the transaction.',
    cases: [
      {
        name: 'Lalita Kumari v. Govt. of U.P.',
        citation: '(2014) 2 SCC 1',
        year: '2014',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'good',
        held: 'Commercial offences and abnormal delay (>3 months) are categories where preliminary inquiry before FIR registration is permissible.',
        why: 'Prevents weaponisation of criminal process in civil/commercial disputes.'
      },
      {
        name: 'Delhi Race Club (1940) Ltd. v. State of U.P.',
        citation: '2024 SCC OnLine SC 2248',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Sections 406 and 420 IPC cannot be simultaneously charged on identical facts; civil recovery of dues cannot be cloaked as criminal cheating.',
        why: 'Authoritative 2024 Supreme Court precedent.'
      }
    ]
  },
  'IPC:498A': {
    commentary: 'Erstwhile Cruelty by husband or relatives of husband (now Sections 85 & 86 BNS, 2023).',
    cases: [
      {
        name: 'Arnesh Kumar v. State of Bihar',
        citation: '(2014) 8 SCC 273',
        year: '2014',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Prohibited routine arrests in S. 498A IPC and offences punishable up to 7 years; mandated S. 41A CrPC notice.',
        why: 'Landmark safeguard on personal liberty.'
      },
      {
        name: 'Dara Lakshmi Narayana v. State of Telangana',
        citation: '2024 SCC OnLine SC 3682',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Quashed S. 498A FIR containing vague, omnibus allegations against family members dragged into matrimonial acrimony.',
        why: 'Latest 2024 SC authority.'
      }
    ]
  },

  // ==================== BNSS 2023 & CrPC 1973 ====================
  'BNSS:35': {
    commentary:
      'Consolidates erstwhile Sections 41 and 41A of CrPC, 1973 (When police may arrest without warrant & Notice of appearance). Sub-section (3) mandates issuance of Notice of Appearance where arrest is not required under S. 35(1). Sub-section (7) introduces a new safeguard: no arrest without prior permission of an officer not below DySP for offences punishable with less than 3 years where the person is infirm or above 60 years of age.',
    essentials: [
      'Offences punishable up to 7 years require recorded reasons for arrest satisfying S. 35(1)(b)(ii).',
      'Mandatory Notice of Appearance under S. 35(3) BNSS (formerly S. 41A CrPC).',
      'Special protection under S. 35(7) for senior citizens (>60 yrs) and infirm persons in offences < 3 years.'
    ],
    cases: [
      {
        name: 'Satender Kumar Antil v. Central Bureau of Investigation',
        citation: '(2022) 10 SCC 51',
        year: '2022',
        court: 'Supreme Court of India',
        bench: '2 Judges',
        status: 'latest',
        held: 'Non-compliance with Sections 41 and 41A CrPC (now S. 35 BNSS) entitles the accused to grant of bail; investigating agencies and Magistrates are constitutionally bound to enforce "bail is the rule, jail is the exception".',
        why: 'Essential authority for securing regular bail upon S. 35(3) BNSS violation.'
      },
      {
        name: 'Arnesh Kumar v. State of Bihar',
        citation: '(2014) 8 SCC 273',
        year: '2014',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Magistrates must not mechanically authorise remand without scrutinising police reasons under S. 41(1)(b) / S. 35 BNSS.',
        why: 'Directly enforceable via departmental & contempt action.'
      }
    ]
  },
  'BNSS:173': {
    commentary:
      'Corresponds to erstwhile Section 154 CrPC (Information in cognizable cases / FIR), with three transformative additions: (1) Zero FIR statutory recognition ("irrespective of the area where the offence is committed"); (2) e-FIR (electronic communication, to be signed by informant within 3 days); and (3) Preliminary Inquiry under S. 173(3) with DySP permission within 14 days for offences punishable with 3 to <7 years.',
    essentials: [
      'Zero FIR can be lodged at any police station regardless of territorial jurisdiction.',
      'e-FIR taken on record if signed by informant within 3 days.',
      'S. 173(3): Preliminary inquiry (max 14 days) to ascertain prima facie case for offences punishable ≥3 years and <7 years.'
    ],
    cases: [
      {
        name: 'Lalita Kumari v. Government of Uttar Pradesh',
        citation: '(2014) 2 SCC 1',
        year: '2014',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'good',
        held: 'Registration of FIR is mandatory under S. 154 CrPC if information discloses a cognizable offence, subject to limited preliminary inquiry categories (now further structured in S. 173(3) BNSS).',
        why: 'Constitution Bench bedrock on FIR registration.'
      },
      {
        name: 'Imran Pratapgadhi v. State of Gujarat',
        citation: '2025 SCC OnLine SC 678',
        year: '2025',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Where speech, artistic expression, or social media posts are alleged to constitute offences punishable between 3 and 7 years, police ought to invoke S. 173(3) BNSS preliminary inquiry to protect Article 19(1)(a) free speech before mechanically registering an FIR.',
        why: 'Landmark Supreme Court ruling directly interpreting Section 173(3) BNSS!'
      }
    ]
  },
  'BNSS:187': {
    commentary:
      'Corresponds to erstwhile Section 167 CrPC (Procedure when investigation cannot be completed in 24 hours / Police Custody & Default Bail). Major change: Police custody (up to 15 days in total) may now be authorised in whole or in tranches at any time during the initial 40 days (where total period is 60 days) or initial 60 days (where total period is 90 days), altering the 1992 Anupam J. Kulkarni rule that confined police custody strictly to the first 15 days.',
    essentials: [
      'Statutory Default Bail: 90 days (offences punishable with death, life, or ≥10 years) and 60 days (any other offence).',
      'Note: BNSS 187 uses "imprisonment for a term of ten years or more" (resolving the Rakesh Kumar Paul ambiguity).',
      'Police custody (max 15 days aggregate) can be sought within the first 40/60 days of detention.'
    ],
    cases: [
      {
        name: 'Ritu Chhabaria v. Union of India / Enforcement of Default Bail Jurisprudence (Bikramjit Singh v. State of Punjab)',
        citation: '(2020) 10 SCC 616',
        year: '2020',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Right to default bail upon expiry of 60/90 days without a complete charge-sheet is an indefeasible fundamental right flowing from Article 21 of the Constitution.',
        why: 'Governs indefeasible default bail applications under S. 187(3) BNSS.'
      }
    ]
  },
  'BNSS:482': {
    commentary:
      'Corresponds to erstwhile Section 438 CrPC (Direction for grant of bail to person apprehending arrest / Anticipatory Bail). Note the critical section-number shift: S. 438 CrPC became S. 482 BNSS, while erstwhile S. 482 CrPC (Inherent Powers of High Court) moved to S. 528 BNSS!',
    essentials: [
      'Application lies to Court of Session or High Court upon reason to believe arrest on accusation of non-bailable offence.',
      'Barred under S. 482(4) BNSS for gang rape on women under 18 years (S. 65(2) / S. 70(2) BNS).',
      'No automatic time-cap on anticipatory bail once granted unless special circumstances warrant.'
    ],
    practiceTip: 'Do NOT confuse S. 482 BNSS (Anticipatory Bail) with old S. 482 CrPC (Quashing / Inherent Powers — now S. 528 BNSS). Double-check the cause title of every High Court petition!',
    cases: [
      {
        name: 'Sushila Aggarwal v. State (NCT of Delhi)',
        citation: '(2020) 5 SCC 1',
        year: '2020',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'good',
        held: 'Anticipatory bail should not invariably be limited to a fixed period or expire automatically upon filing of charge-sheet/summoning; it normally continues till the end of the trial.',
        why: 'Constitution Bench ruling governing anticipatory bail under S. 482 BNSS.'
      },
      {
        name: 'Gurbaksh Singh Sibbia v. State of Punjab',
        citation: '(1980) 2 SCC 565',
        year: '1980',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'good',
        held: 'Discretion to grant anticipatory bail is wide and guided by Article 21; courts must not read artificial fetters not enacted by Parliament.',
        why: 'Foundational Constitution Bench precedent.'
      }
    ]
  },
  'BNSS:483': {
    commentary: 'Corresponds to erstwhile Section 439 CrPC (Special powers of High Court or Court of Session regarding Regular Bail).',
    cases: [
      {
        name: 'Jalaluddin Khan v. Union of India',
        citation: '2024 SCC OnLine SC 1945',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Reaffirmed that "bail is the rule and jail is the exception" holds true across criminal and even special statutes once statutory conditions or Article 21 thresholds are met.',
        why: 'Key 2024 Supreme Court bail precedent.'
      },
      {
        name: 'Sanjay Chandra v. CBI',
        citation: '(2012) 1 SCC 40',
        year: '2012',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Pre-conviction detention is not punitive; gravity of offence alone cannot defeat bail when investigation is complete and documentary evidence is secured.',
        why: 'Leading precedent in economic and white-collar bail matters.'
      }
    ]
  },
  'BNSS:528': {
    commentary:
      'Corresponds verbatim in spirit to erstwhile Section 482 CrPC (Saving of inherent powers of High Court). Empowers the High Court to make such orders as may be necessary to give effect to any order under this Sanhita, or to prevent abuse of the process of any Court, or otherwise to secure the ends of justice.',
    essentials: [
      'Invoked for quashing FIRs, charge-sheets, and summoning orders.',
      'High Court does not conduct a mini-trial, but intervenes where uncontroverted allegations disclose no offence or proceedings are manifestly mala fide.'
    ],
    cases: [
      {
        name: 'State of Haryana v. Bhajan Lal',
        citation: '1992 Supp (1) SCC 335',
        year: '1992',
        court: 'Supreme Court of India',
        bench: '2 Judges',
        status: 'good',
        held: 'Enumerated the 7 classic illustrative categories where the High Court should exercise inherent jurisdiction to quash an FIR or complaint.',
        why: 'Cited in every single S. 528 BNSS / S. 482 CrPC quashing petition.'
      },
      {
        name: 'Neeharika Infrastructure Pvt. Ltd. v. State of Maharashtra',
        citation: '(2021) 19 SCC 401',
        year: '2021',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'High Courts must not pass blanket "no coercive steps" interim orders without assigning brief reasons; investigation should not ordinarily be thwarted at the nascent stage unless Bhajan Lal parameters apply.',
        why: 'Governs interim stay prayers in S. 528 BNSS petitions.'
      },
      {
        name: 'Gian Singh v. State of Punjab',
        citation: '(2012) 10 SCC 303',
        year: '2012',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'High Court can quash non-compoundable offences having predominantly civil, commercial, or matrimonial flavour upon genuine settlement/compromise between parties (excluding heinous offences like murder, rape, corruption).',
        why: 'Primary authority for compromise quashing petitions.'
      }
    ]
  },
  'BNSS:144': {
    commentary: 'Corresponds to erstwhile Section 125 CrPC (Order for maintenance of wives, children and parents). Note:Erstwhile S. 144 CrPC (Urgent cases of nuisance/apprehended danger) is now Section 163 BNSS!',
    practiceTip: 'Mandatory Affidavit of Disclosure of Assets and Liabilities as framed in Rajnesh v. Neha must be filed by both spouses in all maintenance proceedings under S. 144 BNSS.',
    cases: [
      {
        name: 'Rajnesh v. Neha',
        citation: '(2021) 2 SCC 324',
        year: '2021',
        court: 'Supreme Court of India',
        bench: '2 Judges',
        status: 'good',
        held: 'Mandated uniform Affidavit of Disclosure of Assets & Liabilities across India; maintenance is always payable from the date of filing of the application, and overlapping maintenance orders must be set off/adjusted.',
        why: 'Comprehensive code on maintenance practice in Family Courts.'
      },
      {
        name: 'Mohd. Abdul Samad v. State of Telangana',
        citation: '2024 SCC OnLine SC 1686',
        year: '2024',
        court: 'Supreme Court of India',
        bench: '2 Judges',
        status: 'latest',
        held: 'Secular right of a divorced Muslim woman to seek maintenance under Section 125 CrPC (now S. 144 BNSS) exists independently of and is not extinguished by the 1986 Act.',
        why: 'Major 2024 Supreme Court ruling reaffirming secular maintenance remedies.'
      }
    ]
  },
  'CRPC:438': {
    commentary: 'Erstwhile Anticipatory Bail provision under CrPC, 1973 — now Section 482 of BNSS, 2023.',
    cases: [
      {
        name: 'Sushila Aggarwal v. State (NCT of Delhi)',
        citation: '(2020) 5 SCC 1',
        year: '2020',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'good',
        held: 'Anticipatory bail need not be time-bound and ordinarily continues until conclusion of trial.',
        why: 'Constitution Bench ruling.'
      }
    ]
  },
  'CRPC:482': {
    commentary: 'Erstwhile Inherent Powers of High Court under CrPC, 1973 — now Section 528 of BNSS, 2023.',
    cases: [
      {
        name: 'State of Haryana v. Bhajan Lal',
        citation: '1992 Supp (1) SCC 335',
        year: '1992',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Laid down the 7 parameters for quashing criminal proceedings.',
        why: 'Universal quashing benchmark.'
      }
    ]
  },

  // ==================== BSA 2023 & IEA 1872 ====================
  'BSA:63': {
    commentary:
      'Corresponds to erstwhile Section 65B of the Indian Evidence Act, 1872 (Admissibility of Electronic Records). Significantly modernises electronic evidence to include semiconductor memories, cloud servers, communication devices, and introduces a standardised Dual-Part Certificate (Part A by Party + Part B by Expert) in the Schedule to the BSA, including cryptographic hash value (SHA-256) verification.',
    essentials: [
      'Electronic output (printout, storage media, cloud/device copy) deemed a document and admissible without producing the original device IF conditions of S. 63(2) are met.',
      'Mandatory Certificate under S. 63(4) signed by person in charge of device/management AND an expert (as per the BSA Schedule format specifying hash value).',
      'Read alongside S. 61 BSA (non-denial of admissibility merely on ground of electronic form) and S. 57 BSA (primary electronic evidence where multiple files are created simultaneously).'
    ],
    practiceTip: 'Ensure the S. 63(4) BSA Certificate strictly follows BOTH Part A (party/custodian) and Part B (expert stating SHA-256 hash value) from the BSA Schedule when exhibiting WhatsApp chats, emails, CCTV footage, or call records.',
    cases: [
      {
        name: 'Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal',
        citation: '(2020) 7 SCC 1',
        year: '2020',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Certificate under S. 65B(4) IEA (now S. 63(4) BSA) is a mandatory condition precedent to the admissibility of secondary electronic evidence; oral evidence cannot substitute the certificate, unless the original physical device itself is produced in court.',
        why: 'Definitive 3-Judge Bench ruling governing electronic evidence admissibility.'
      },
      {
        name: 'Anvar P.V. v. P.K. Basheer',
        citation: '(2014) 10 SCC 473',
        year: '2014',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Special provisions on electronic records constitute a complete code overriding general secondary evidence provisions (overruling Navjot Sandhu).',
        why: 'Foundation of digital evidence jurisprudence in India.'
      }
    ]
  },
  'IEA:65B': {
    commentary: 'Erstwhile Admissibility of Electronic Records under Indian Evidence Act, 1872 — now Section 63 of Bharatiya Sakshya Adhiniyam (BSA), 2023.',
    cases: [
      {
        name: 'Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal',
        citation: '(2020) 7 SCC 1',
        year: '2020',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Section 65B(4) certificate is mandatory for secondary electronic outputs; trial courts may summon it at any stage prior to closure of trial if inadvertently omitted.',
        why: 'Leading precedent.'
      }
    ]
  },
  'BSA:23': {
    commentary:
      'Consolidates erstwhile Sections 25, 26, and 27 of the Indian Evidence Act, 1872 (Confession to police officer, confession in police custody, and discovery of fact pursuant to information from accused). Proviso to S. 23(2) preserves the "discovery fact" rule (formerly S. 27 IEA).',
    cases: [
      {
        name: 'Pulukuri Kottaya v. King-Emperor',
        citation: 'AIR 1947 PC 67',
        year: '1947',
        court: 'Privy Council / Approved by SC',
        status: 'good',
        held: 'Fact discovered embraces the place from which the object is produced and the accused\'s knowledge as to this, NOT past user or self-incriminating confession ("I stabbed X with this knife").',
        why: 'Timeless rule governing recovery memos under Proviso to S. 23(2) BSA / S. 27 IEA.'
      },
      {
        name: 'Boby v. State of Kerala',
        citation: '2023 SCC OnLine SC 50',
        year: '2023',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Strict two-step procedure (recording exact disclosure statement before two independent panch witnesses prior to recovery) is vital to lend credibility to S. 27 IEA / S. 23(2) BSA recovery.',
        why: 'Important recent SC precedent scrutinising fabricated recovery panchnamas.'
      }
    ]
  },
  'BSA:26': {
    commentary: 'Corresponds to erstwhile Section 32 of the Indian Evidence Act, 1872 — Statements by persons who cannot be called as witnesses (including Dying Declaration under Clause (a)).',
    cases: [
      {
        name: 'Khushal Rao v. State of Bombay',
        citation: 'AIR 1958 SC 22',
        year: '1958',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'A truthful and voluntary dying declaration recorded when the declarant was in a fit mental state can form the sole basis of conviction without corroboration.',
        why: 'Locus classicus on Dying Declarations.'
      },
      {
        name: 'Irfan @ Naka v. State of Uttar Pradesh',
        citation: '2023 SCC OnLine SC 1060',
        year: '2023',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Listed 11 comprehensive factors courts must examine to test the voluntary nature, mental fitness, and absence of tutoring in dying declarations.',
        why: 'Latest authoritative checklist for criminal trial lawyers.'
      }
    ]
  },

  // ==================== NEGOTIABLE INSTRUMENTS ACT (NIA) ====================
  'NIA:138': {
    commentary:
      'Dishonour of cheque for insufficiency, etc., of funds in the account. Quasi-criminal summary remedy vital for commercial recovery. Strict statutory timeline compliance is jurisdictional.',
    essentials: [
      'Cheque drawn towards discharge (whole or part) of a legally enforceable debt or liability (presumed under S. 139 NIA).',
      'Presented within validity period (3 months as per RBI directive).',
      'Statutory Demand Notice in writing issued within 30 days of receipt of bank return memo.',
      'Drawer fails to make payment within 15 days of receipt of notice.',
      'Complaint filed within 1 month from expiry of the 15-day notice period (condonable on sufficient cause under Proviso to S. 142(1)(b)).',
      'Jurisdiction (S. 142(2)): Payee\'s bank branch where cheque is delivered for collection through an account.'
    ],
    practiceTip: 'Simultaneously file an application under Section 143A NIA seeking up to 20% interim compensation upon framing of notice/plea of not guilty!',
    cases: [
      {
        name: 'Dashrath Rupsingh Rathod v. State of Maharashtra (superseded on venue by 2015 Amendment S. 142(2)) & Bridgestone India Pvt. Ltd. v. Inderpal Singh',
        citation: '(2016) 2 SCC 75',
        year: '2016',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Post-2015 Amendment to Section 142(2) NIA, territorial jurisdiction for account-payee cheques vests exclusively in the court within whose local jurisdiction the branch of the bank where the payee maintains the account is situated.',
        why: 'Determines where to file every S. 138 complaint.'
      },
      {
        name: 'Rakesh Ranjan Shrivastava v. State of Jharkhand',
        citation: '2024 SCC OnLine SC 309',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Power to award interim compensation up to 20% under Section 143A NIA is directory (discretionary), not mandatory; Magistrate must apply mind to prima facie merits and financial distress before fixing quantum.',
        why: 'Crucial 2024 Supreme Court ruling for both complainants and accused in cheque bounce cases.'
      },
      {
        name: 'Rangappa v. Sri Mohan',
        citation: '(2010) 11 SCC 441',
        year: '2010',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Once signature on the cheque is admitted, statutory presumption under S. 139 NIA includes the existence of a legally enforceable debt; accused can rebut it on preponderance of probabilities.',
        why: 'Standard authority on S. 139 reverse burden.'
      }
    ]
  },

  // ==================== CPC 1908 ====================
  'CPC:9': {
    commentary: 'Courts to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred. Presumption is strongly in favour of civil court jurisdiction unless an adequate statutory tribunal with express bar exists.',
    cases: [
      {
        name: 'Dhulabhai v. State of Madhya Pradesh',
        citation: 'AIR 1969 SC 78',
        year: '1968',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'good',
        held: 'Laid down the 7 classic propositions governing exclusion of civil court jurisdiction under Section 9 CPC.',
        why: 'Constitution Bench authority on civil jurisdiction vs. special tribunals.'
      }
    ]
  },
  'CPC:11': {
    commentary: 'Res Judicata — No Court shall try any suit or issue in which the matter directly and substantially in issue has been directly and substantially in issue in a former suit between the same parties and heard and finally decided by a competent Court. Includes Constructive Res Judicata (Explanation IV).',
    cases: [
      {
        name: 'Satyadhyan Ghosal v. Deorajin Debi',
        citation: 'AIR 1960 SC 941',
        year: '1960',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Principle of res judicata is based on public policy finality of litigation and applies even between two stages of the same litigation.',
        why: 'Foundational precedent on res judicata.'
      },
      {
        name: 'Srihari Hanumandas Totala v. Hemant Vithal Kamat',
        citation: '(2021) 9 SCC 99',
        year: '2021',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Plea of res judicata normally requires examination of pleadings, issues, and judgment of the previous suit and therefore cannot ordinarily be decided summarily on an Order VII Rule 11 application.',
        why: 'Vital procedural rule on S. 11 vs. Order VII Rule 11 CPC.'
      }
    ]
  },

  // ==================== INDIAN CONTRACT ACT 1872 ====================
  'ICA:73': {
    commentary: 'Compensation for loss or damage caused by breach of contract. Codifies the rule in Hadley v. Baxendale: damages must naturally arise in the usual course of things from the breach, or be such as the parties knew when making the contract to be likely to result. Remote or indirect loss is excluded, and duty to mitigate applies.',
    cases: [
      {
        name: 'Karsandas H. Thacker v. Saran Engineering Co. Ltd.',
        citation: 'AIR 1965 SC 1981',
        year: '1965',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Compensation under S. 73 is not given for any remote or indirect loss sustained by reason of breach; foreseeability at contract formation governs.',
        why: 'Core contract damages authority.'
      }
    ]
  },
  'ICA:74': {
    commentary: 'Compensation for breach of contract where penalty or liquidated damages are stipulated for. Court awards "reasonable compensation not exceeding the amount so named", whether or not actual loss is proved (where loss is impossible to compute in genuine pre-estimate cases).',
    cases: [
      {
        name: 'Kailash Nath Associates v. Delhi Development Authority',
        citation: '(2015) 4 SCC 136',
        year: '2015',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Synthesised Fateh Chand, Maula Bux, and Saw Pipes: proof of loss is a sine qua non under S. 74 wherever loss is capable of being proved; forfeiture of earnest money is permissible only if reasonable and breach is established.',
        why: 'Definitive Supreme Court authority on liquidated damages & forfeiture.'
      }
    ]
  },

  // ==================== ARBITRATION & CONCILIATION ACT 1996 ====================
  'ACA:11': {
    commentary: 'Appointment of Arbitrators by Supreme Court (international commercial arbitration) or High Court (domestic arbitration). At the Section 11(6A) referral stage, the referral court\'s scrutiny is strictly confined to prima facie existence of the arbitration agreement.',
    cases: [
      {
        name: 'In Re: Interplay Between Arbitration Agreements under A&C Act, 1996 and Stamp Act, 1899',
        citation: '2023 SCC OnLine SC 1666',
        year: '2023',
        court: 'Supreme Court of India',
        bench: '7 Judges',
        status: 'latest',
        held: 'Non-stamping or insufficient stamping of an underlying contract renders it inadmissible (curable defect), NOT void or unenforceable; referral courts under S. 8 or S. 11 must only examine prima facie existence of the arbitration agreement and leave stamping objections to the arbitral tribunal (overruling N.N. Global II).',
        why: 'Historic 7-Judge Constitution Bench ruling streamlining arbitration referrals.'
      },
      {
        name: 'SBI General Insurance Co. Ltd. v. Krish Spinning',
        citation: '2024 SCC OnLine SC 1754',
        year: '2024',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'latest',
        held: 'Disputes over "accord and satisfaction" / full-and-final discharge vouchers must be decided by the Arbitral Tribunal under S. 16, not by the S. 11 referral court.',
        why: 'Major 2024 SC judgment restricting judicial interference at S. 11 stage.'
      }
    ]
  },
  'ACA:34': {
    commentary: 'Application for setting aside arbitral award. Strictly limited supervisory jurisdiction (not an appellate power); re-appreciation of evidence is barred by the proviso to S. 34(2A). Strict limitation: 3 months + condonable 30 days max (thereafter Section 5 Limitation Act is excluded).',
    cases: [
      {
        name: 'Ssangyong Engineering & Construction Co. Ltd. v. NHAI',
        citation: '(2019) 15 SCC 131',
        year: '2019',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Clarified post-2015 narrow scope of "public policy of India" and "patent illegality" under S. 34(2A); erroneous application of law or re-appreciation of evidence is no ground to set aside an award.',
        why: 'Leading S. 34 challenge standard.'
      },
      {
        name: 'Delhi Metro Rail Corporation Ltd. v. Delhi Airport Metro Express Pvt. Ltd.',
        citation: '2024 SCC OnLine SC 522',
        year: '2024',
        court: 'Supreme Court of India',
        bench: '3 Judges (Curative)',
        status: 'latest',
        held: 'Where an arbitral award suffers from patent illegality on the face of the award by ignoring vital evidence or perverse contractual reading, setting it aside prevents grave miscarriage of justice.',
        why: '2024 Curative Petition landmark on patent illegality.'
      }
    ]
  },

  // ==================== HINDU MARRIAGE ACT 1955 ====================
  'HMA:13': {
    commentary: 'Divorce (Contested grounds including adultery, cruelty, desertion for 2+ years, conversion, mental disorder, etc.). Mental cruelty is judged holistically on the cumulative impact of sustained conduct rendering cohabitation impossible.',
    cases: [
      {
        name: 'Samar Ghosh v. Jaya Ghosh',
        citation: '(2007) 4 SCC 511',
        year: '2007',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Enumerated 14 illustrative guidelines on what constitutes "mental cruelty" under Section 13(1)(ia) HMA.',
        why: 'Foundational Supreme Court guide for contested divorce pleadings.'
      },
      {
        name: 'Shilpa Sailesh v. Varun Sreenivasan',
        citation: '2023 SCC OnLine SC 544',
        year: '2023',
        court: 'Supreme Court of India',
        bench: '5 Judges',
        status: 'latest',
        held: 'Supreme Court can exercise plenary power under Article 142(1) to dissolve a marriage on the ground of "irretrievable breakdown of marriage" and waive the 6-month cooling-off period under S. 13B(2) HMA.',
        why: 'Constitution Bench landmark in matrimonial law.'
      }
    ]
  },
  'HMA:13B': {
    commentary: 'Divorce by mutual consent. Requires 1 year separation prior to filing First Motion [S. 13B(1)] and a 6-month statutory cooling-off period before Second Motion [S. 13B(2)], which Family Courts can waive when conditions in Amardeep Singh are met.',
    cases: [
      {
        name: 'Amardeep Singh v. Harveen Kaur',
        citation: '(2017) 8 SCC 746',
        year: '2017',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'The 6-month cooling-off period in Section 13B(2) HMA is directory, not mandatory; Family Courts may waive it where parties have genuinely settled alimony/custody and lived apart for over 18 months in total.',
        why: 'Cited in every S. 13B(2) cooling-off waiver application.'
      }
    ]
  },

  // ==================== IBC 2016, PMLA 2002, POCSO, NDPS, LIMITATION ====================
  'IBC:7': {
    commentary: 'Initiation of Corporate Insolvency Resolution Process (CIRP) by Financial Creditor before NCLT upon occurrence of financial debt default (minimum threshold ₹1 Crore).',
    cases: [
      {
        name: 'Innoventive Industries Ltd. v. ICICI Bank',
        citation: '(2018) 1 SCC 407',
        year: '2018',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Under Section 7 IBC, NCLT only needs to be satisfied that a "default" of a due financial debt has occurred; disputed quantum does not defeat admission if debt due exceeds threshold.',
        why: 'Foundational precedent on IBC admission.'
      },
      {
        name: 'Vidarbha Industries Power Ltd. v. Axis Bank Ltd. (clarified in M. Suresh Kumar Reddy, 2023)',
        citation: '(2023) 8 SCC 387',
        year: '2023',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Clarified that Innoventive Industries remains the general rule — once debt and default are proved under S. 7 IBC, admission is the norm barring exceptional Vidarbha facts.',
        why: 'Essential clarification for NCLT counsel.'
      }
    ]
  },
  'IBC:9': {
    commentary: 'Application for initiation of CIRP by Operational Creditor after serving mandatory Section 8 Demand Notice (10-day window). Barred if a genuine "pre-existing dispute" existed prior to receipt of the S. 8 notice.',
    cases: [
      {
        name: 'Mobilox Innovations Pvt. Ltd. v. Kirusa Software Pvt. Ltd.',
        citation: '(2018) 1 SCC 353',
        year: '2018',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'If a plausible contention requiring investigation ("pre-existing dispute", not a patently feeble legal argument) existed prior to the S. 8 demand notice, NCLT must reject the S. 9 petition.',
        why: 'Governing test for operational creditor insolvency petitions.'
      }
    ]
  },
  'PMLA:45': {
    commentary: 'Offences to be cognizable and non-bailable; twin conditions for bail under PMLA, 2002.',
    cases: [
      {
        name: 'Vijay Madanlal Choudhary v. Union of India',
        citation: '2022 SCC OnLine SC 929',
        year: '2022',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Upheld validity of PMLA provisions including twin bail conditions under S. 45, while holding that discharge/acquittal/quashing of the predicate scheduled offence extinguishes the PMLA offence.',
        why: 'Comprehensive PMLA judgment.'
      },
      {
        name: 'Manish Sisodia v. Directorate of Enforcement',
        citation: '2024 SCC OnLine SC 1920',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Prolonged pre-trial incarceration where trial cannot conclude in reasonable time overrides statutory twin conditions under S. 45 PMLA by virtue of Article 21 right to speedy trial.',
        why: 'Major 2024 Supreme Court bail ruling under PMLA.'
      },
      {
        name: 'Tarsem Lal v. Directorate of Enforcement',
        citation: '2024 SCC OnLine SC 976',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Once Special Court takes cognizance of a PMLA complaint and issues summons (where accused was not arrested during investigation), ED cannot arrest the accused and S. 45 twin conditions do not apply to bond acceptance.',
        why: 'Critical 2024 procedural protection in PMLA prosecutions.'
      }
    ]
  },
  'NDPS:37': {
    commentary: 'Offences to be cognizable and non-bailable; stringent twin conditions for bail involving commercial quantity of narcotic drugs or psychotropic substances.',
    cases: [
      {
        name: 'Rabi Prakash v. State of Odisha',
        citation: '2023 SCC OnLine SC 1109',
        year: '2023',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Prolonged incarceration militates against the most precious fundamental right guaranteed under Article 21, and in such a situation conditional liberty overrides the statutory embargo under Section 37(1)(b)(ii) of the NDPS Act.',
        why: 'Most cited SC ruling for NDPS bail in delayed trials.'
      },
      {
        name: 'Tofan Singh v. State of Tamil Nadu',
        citation: '(2021) 4 SCC 1',
        year: '2020',
        court: 'Supreme Court of India',
        bench: '3 Judges',
        status: 'good',
        held: 'Officers invested with powers under Section 53 of the NDPS Act are "police officers"; confessional statements recorded under Section 67 NDPS Act are inadmissible in evidence.',
        why: 'Landmark ruling demolishing sole-S.67-confession prosecutions.'
      }
    ]
  },
  'LA:5': {
    commentary: 'Extension of prescribed period in certain cases (Condonation of Delay). Applies ONLY to appeals and applications (NOT to original suits!).',
    cases: [
      {
        name: 'Collector, Land Acquisition, Anantnag v. Mst. Katiji',
        citation: '(1987) 2 SCC 107',
        year: '1987',
        court: 'Supreme Court of India',
        status: 'good',
        held: 'Courts should adopt a justice-oriented, non-pedantic approach to "sufficient cause" so meritorious matters are not thrown out at the threshold, provided there is no mala fides or gross negligence.',
        why: 'Classic liberal test on condonation of delay.'
      },
      {
        name: 'Pathapati Subba Reddy v. Special Deputy Collector (LA)',
        citation: '2024 SCC OnLine SC 513',
        year: '2024',
        court: 'Supreme Court of India',
        status: 'latest',
        held: 'Harmonised liberal approach with law of limitation: merits of the case cannot justify condoning inordinate, unexplained negligence or laches; law of limitation is substantive public policy.',
        why: 'Important 2024 Supreme Court recalibration on S. 5 Limitation Act.'
      }
    ]
  }
};

/**
 * Generates intelligent, structured analytical commentary for ANY of the 12,238 sections
 * when a bespoke hand-curated entry is not in SECTION_INSIGHTS, ensuring every section
 * searched by the advocate displays Bare Act + Practitioner Commentary + Cross-References.
 */
export function buildDynamicSectionInsight(params: {
  actCode: string;
  actName: string;
  actStatus?: string;
  replacedBy?: string | null;
  sectionNum: string;
  sectionTitle: string;
  chapterTitle?: string | null;
  bareText: string;
  existingCommentary?: string;
  existingCases?: CaseLawEntry[];
  crossRefs?: Array<{
    targetAct: string;
    targetSec: string;
    targetTitle: string;
    status: string;
    note: string;
  }>;
}): SectionInsight {
  const key = `${params.actCode}:${params.sectionNum}`;
  const curated = SECTION_INSIGHTS[key];

  // Extract statutory structural cues from bare text
  const text = params.bareText || '';
  const hasProviso = /Provided\s+that/i.test(text);
  const hasExplanation = /Explanation[.—\s-]/i.test(text);
  const hasIllustration = /Illustration[s]?[.—\s-]/i.test(text);
  const punishmentMatch = text.match(/punish(?:ed|able)\s+with\s+([^.;]{10,140})/i);
  const shallMatch = text.match(/\bshall\b/gi);
  const mayMatch = text.match(/\bmay\b/gi);

  const essentials: string[] = [];
  if (params.actStatus === 'repealed' && params.replacedBy) {
    essentials.push(
      `Transitional Status: Repealed code (${params.actName}). Continues to apply to offences/transactions prior to replacement; replaced prospectively by ${params.replacedBy}.`
    );
  }
  if (punishmentMatch) {
    essentials.push(`Penal / Sanction Clause: Punishable with ${punishmentMatch[1].trim()}.`);
  }
  if (hasProviso) {
    essentials.push('Contains statutory Proviso(s) carving out exceptions or qualifying conditions to the main enactment.');
  }
  if (hasExplanation) {
    essentials.push('Contains statutory Explanation(s) clarifying legislative intent and scope of expressions.');
  }
  if (hasIllustration) {
    essentials.push('Includes statutory Illustration(s) demonstrating practical application of the rule.');
  }
  if (shallMatch && shallMatch.length > 0 && (!mayMatch || shallMatch.length >= mayMatch.length)) {
    essentials.push('Uses imperative ("shall") statutory phrasing — examine whether compliance is mandatory or directory in context.');
  } else if (mayMatch && mayMatch.length > 0) {
    essentials.push('Confers discretionary/enabling ("may") authority — must be exercised judicially and with recorded reasons.');
  }

  if (curated) {
    return {
      commentary: params.existingCommentary
        ? `${curated.commentary}\n\n${params.existingCommentary}`
        : curated.commentary,
      essentials: curated.essentials || essentials,
      practiceTip: curated.practiceTip,
      cases: [...curated.cases, ...(params.existingCases || [])]
    };
  }

  if (params.existingCommentary) {
    return {
      commentary: params.existingCommentary,
      essentials,
      cases: params.existingCases || []
    };
  }

  // Synthesize structured legal reading from section components
  const lines: string[] = [];
  const label = params.actCode === 'COI' ? 'Article' : 'Section';
  lines.push(
    `${label} ${params.sectionNum} ("${params.sectionTitle || 'Provision'}") forms part of ${params.actName}${params.chapterTitle ? ` under ${params.chapterTitle}` : ''}.`
  );

  if (params.crossRefs && params.crossRefs.length > 0) {
    const xrefSummary = params.crossRefs
      .map((x) => `${x.targetAct} Sec. ${x.targetSec} (${x.status})`)
      .join('; ');
    lines.push(`Concordance Cross-Walk: Corresponds to ${xrefSummary}.`);
  }

  if (punishmentMatch) {
    lines.push(
      `Penal Scope: This is a penal/sanctioning provision prescribing liability punishable with ${punishmentMatch[1].trim()}. Under settled criminal jurisprudence, penal provisions are construed strictly, and mens rea / statutory ingredients must be proved beyond reasonable doubt unless a reverse-burden presumption applies.`
    );
  } else if (hasProviso || hasExplanation) {
    lines.push(
      `Interpretive Structure: Read the principal enacting clause harmoniously with its ${[
        hasProviso ? 'Proviso(s)' : '',
        hasExplanation ? 'Explanation(s)' : ''
      ]
        .filter(Boolean)
        .join(' and ')}. As settled by the Supreme Court (S. Sundaram Pillai v. V.R. Pattabiraman, (1985) 1 SCC 591), a Proviso generally qualifies or excepts out of the main enactment, whereas an Explanation explains the meaning and intent of the Act without enlarging its ambit.`
    );
  } else {
    lines.push(
      `Statutory Construction: Apply the literal/plain-meaning rule first; where ambiguity arises, interpret purposively in light of the Preamble, Chapter heading${params.chapterTitle ? ` (${params.chapterTitle})` : ''}, and companion definitions of ${params.actName}.`
    );
  }

  return {
    commentary: lines.join('\n\n'),
    essentials,
    cases: params.existingCases || []
  };
}
