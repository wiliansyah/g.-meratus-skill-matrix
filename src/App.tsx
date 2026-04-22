import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  Users,
  Target,
  ShieldCheck,
  LayoutDashboard,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  TableProperties,
  BarChart2,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  Square,
  FilterX,
  Edit,
  Trash2,
  Plus,
  Lock,
  Unlock,
  X,
  FolderEdit,
  GraduationCap,
  Save,
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// ==========================================
// 1. FIREBASE & CLOUD STORAGE SETUP (VITE / VERCEL READY)
// ==========================================
// Replace these with your actual Firebase Project keys in your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    'YOUR_MESSAGING_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn(
    'Firebase initialization failed. Ensure you have added your config.',
    error
  );
}

const appId = 'meratus-skill-matrix';

// ==========================================
// 2. ENTERPRISE ARCHITECTURE
// ==========================================
const SBUS = [
  'Asset Charter',
  'Drybulk',
  'Liner Commercial',
  'Liner International',
  'Liner Ops',
  'Liner Trade',
  'Logistics',
  'HMM',
  'Crewing',
  'MSM',
  'Workshop',
  'CLC',
  'MSA',
  'OJA',
  'Trucking',
];
const SFUS = [
  'BPM',
  'CorpCom',
  'Finance',
  'GA Asset Property',
  'HRD',
  'Internal Audit',
  'IT',
  'Legal',
  'Procurement',
  'Procurement MSM',
];
const ALL_UNITS = [...SBUS, ...SFUS];

const DEPT_INFO = [
  { full: 'Asset Charter', abbr: 'AC', type: 'SBU' },
  { full: 'Drybulk', abbr: 'DB', type: 'SBU' },
  { full: 'Liner Commercial', abbr: 'LC', type: 'SBU' },
  { full: 'Liner International', abbr: 'LI', type: 'SBU' },
  { full: 'Liner Ops', abbr: 'LO', type: 'SBU' },
  { full: 'Liner Trade', abbr: 'LT', type: 'SBU' },
  { full: 'Logistics', abbr: 'LOG', type: 'SBU' },
  { full: 'HMM', abbr: 'HMM', type: 'SBU' },
  { full: 'Crewing', abbr: 'CRW', type: 'SBU' },
  { full: 'MSM', abbr: 'MSM', type: 'SBU' },
  { full: 'Workshop', abbr: 'WS', type: 'SBU' },
  { full: 'CLC', abbr: 'CLC', type: 'SBU' },
  { full: 'MSA', abbr: 'MSA', type: 'SBU' },
  { full: 'OJA', abbr: 'OJA', type: 'SBU' },
  { full: 'Trucking', abbr: 'TRK', type: 'SBU' },
  { full: 'BPM', abbr: 'BPM', type: 'SFU' },
  { full: 'CorpCom', abbr: 'CC', type: 'SFU' },
  { full: 'Finance', abbr: 'FIN', type: 'SFU' },
  { full: 'GA Asset Property', abbr: 'GA', type: 'SFU' },
  { full: 'HRD', abbr: 'HRD', type: 'SFU' },
  { full: 'Internal Audit', abbr: 'IA', type: 'SFU' },
  { full: 'IT', abbr: 'IT', type: 'SFU' },
  { full: 'Legal', abbr: 'LEG', type: 'SFU' },
  { full: 'Procurement', abbr: 'PROC', type: 'SFU' },
  { full: 'Procurement MSM', abbr: 'PMSM', type: 'SFU' },
];

const INITIAL_CATEGORY_DESCRIPTIONS = {
  'Vessel Chartering & Asset Mgt':
    'Focuses on strategic chartering, asset lifecycle management, fleet commercial operations, and MoU negotiations.',
  'Marine Engineering & Maintenance':
    'Covers technical inspection, maintenance, troubleshooting, and overhaul of marine engines, vessel superstructures, and components.',
  'Marine QSHE, Safety & Compliance':
    'Encompasses maritime safety regulations (SOLAS, MARPOL), incident investigation, risk mapping, and safety management systems.',
  'Asset & Fleet Management':
    "Strategies and processes for managing the company's fixed assets, vehicle fleets, and vessel disposal/sale.",
  'Vessel Operations & Performance':
    'Focuses on daily vessel operations, fuel/bunker management, voyage optimization, stowage planning, and performance analytics.',
  'IT Engineering, Security & Architecture':
    'Covers software development, network infrastructure, cybersecurity, cloud architecture, and data engineering.',
  'Corporate Finance, Tax & Reporting':
    'Includes advanced financial modeling, budgeting, taxation, consolidated reporting, and cash flow management.',
  'Corporate Legal & Governance':
    'Covers corporate law, regulatory compliance, contract management, dispute resolution, and insurance claim handling.',
  'Chartering & Commercial Shipping':
    'Focuses on maritime trade terms, voyage estimation, tender management, and managing commercial shipping contracts.',
  'Ship Management & Technical Ops':
    'Involves dry-docking processes, new building projects, technical ship specifications, and shipyard coordination.',
  'Drybulk Operations & Commercial':
    'Specialized training for Drybulk and Tug & Barge operations, including transloading, bulk cargo handling, and specific MDM business processes.',
  'Liner Commercial & Account Mgt':
    'Focuses on liner sales, pricing management, customer relations, complaint handling, and CRM operations.',
  'Logistics & Forwarding Operations':
    'Covers end-to-end logistics, customs clearance, freight forwarding (Air/Sea), and related documentation (Bills of Lading).',
  'Liner Trade & Pricing Strategy':
    'Advanced topics on route profitability, vessel slot agreements (VSA), yield management, and TCE analysis.',
  'Liner Network & International Ops':
    'Focuses on international deployment, competitor analysis, international agency management, and network design.',
  'Container Depot & Repair Operations':
    'Operations related to container stripping/stuffing, yard management, IICL repair standards, and reefer PTI.',
  'Terminal & Port Operations':
    'Focuses on port restrictions, berth allocation, stevedoring processes, and terminal performance monitoring (BOR/YOR).',
  'Working Capital, AR/AP & Treasury':
    'Covers operational finance, invoice processing, days sales outstanding (DSO), and vendor payment procedures.',
  'Agency Operations (HMM)':
    'Specific processes for managing principal agency operations, documentation, and manifest handling for HMM.',
  'Crew Management & Development':
    'Focuses on MLC regulations, seafarer recruitment, payroll, emergency response for crew, and MariApps crewing systems.',
  'Workshop Fabrication & Heavy Maintenance':
    'Covers advanced welding, carpentry, heavy component overhauls, and production planning (PPIC) within workshops.',
  'Heavy Equipment & Maintenance':
    'Focuses on the safe operation and mechanical maintenance (SOMA) of heavy equipment like RTG, Reach Stackers, and Forklifts.',
  'Terminal, Stevedoring & HE Ops':
    'Integrated operations for terminal cargo handling, ship stability during loading, and heavy equipment orchestration.',
  'Trucking & Land Transport':
    'Covers order management, TMS applications, driver route planning, GPS abnormality tracking, and fleet dispatch.',
  'Human Resources & Talent Management':
    'Encompasses organizational design, talent acquisition, remuneration, industrial relations, and HR data analytics.',
  'Business Process Management (BPM)':
    'Focuses on process optimization (BPMN), agile methodologies, change management, and project tracking.',
  'Corporate Communications & GA':
    'Covers branding guidelines, internal/external communication, facility management, and general affairs.',
  'Internal Audit & Compliance':
    'Focuses on risk-based auditing, fraud detection, procedural compliance, and enterprise risk management.',
  'Procurement & Vendor Management':
    'Covers strategic sourcing, vendor performance reviews, P2P processes, and e-procurement systems (D365/MariApps).',
};

// ==========================================
// 3. COMPRESSED 1000+ TOPIC DATA ENGINE
// ==========================================
const TAG_MAPPING = {
  ALL: ALL_UNITS,
  MARINE: [
    'Asset Charter',
    'Drybulk',
    'Liner Ops',
    'MSM',
    'Crewing',
    'Liner Commercial',
    'Liner International',
    'Liner Trade',
    'Internal Audit',
  ],
  TERMINAL: [
    'Liner Ops',
    'CLC',
    'MSA',
    'OJA',
    'Logistics',
    'Internal Audit',
    'Finance',
    'IT',
  ],
  LOGISTICS: [
    'Logistics',
    'Trucking',
    'HMM',
    'CLC',
    'Finance',
    'IT',
    'Internal Audit',
  ],
  TECH: [
    'Workshop',
    'MSM',
    'CLC',
    'MSA',
    'OJA',
    'Trucking',
    'Procurement MSM',
    'Asset Charter',
  ],
  CORP: [
    'BPM',
    'CorpCom',
    'Finance',
    'GA Asset Property',
    'HRD',
    'Internal Audit',
    'IT',
    'Legal',
    'Procurement',
  ],
  COMMERCIAL: [
    'Liner Commercial',
    'Liner International',
    'Liner Trade',
    'Drybulk',
    'Asset Charter',
    'HMM',
    'Logistics',
  ],
};

function buildSeed(category, dataString, source) {
  const topics = dataString.split('|');
  const targets = new Set([source]);
  const tags = [];

  if (source === 'Asset Charter')
    tags.push('COMMERCIAL', 'TECH', 'MARINE', 'Legal', 'Finance');
  if (source === 'Drybulk')
    tags.push('COMMERCIAL', 'MARINE', 'Finance', 'TERMINAL');
  if (
    source === 'Liner Commercial' ||
    source === 'Liner Trade' ||
    source === 'Liner International'
  )
    tags.push('COMMERCIAL', 'Finance', 'MARINE', 'LOGISTICS', 'TERMINAL');
  if (source === 'Logistics' || source === 'Trucking')
    tags.push('LOGISTICS', 'COMMERCIAL', 'Finance');
  if (source === 'CLC' || source === 'MSA' || source === 'OJA')
    tags.push('TERMINAL', 'TECH', 'LOGISTICS');
  if (source === 'MSM' || source === 'Workshop') tags.push('TECH', 'MARINE');
  if (
    source === 'IT' ||
    source === 'Finance' ||
    source === 'HRD' ||
    source === 'Legal' ||
    source === 'BPM'
  )
    tags.push('CORP');

  tags.forEach((tag) => {
    if (TAG_MAPPING[tag]) TAG_MAPPING[tag].forEach((t) => targets.add(t));
    else targets.add(tag);
  });

  return topics.map((topic) => {
    let track = 'Intermediate';
    const t = topic.toLowerCase();
    const c = category.toLowerCase();
    const advanceKeywords = [
      'advance',
      'strategy',
      'budget',
      'analytic',
      'modeling',
      'governance',
      'architecture',
      'strategic',
      'leadership',
      'optimization',
      'due diligence',
      'corporate',
      'framework',
      'chartering',
      'management',
      'evaluat',
      'design',
    ];
    const basicKeywords = [
      'basic',
      'introduction',
      'induction',
      'overview',
      'awareness',
      'fundamental',
      'pengenalan',
      'dasar',
      'general',
      'concept',
      'guideline',
    ];

    if (advanceKeywords.some((k) => t.includes(k) || c.includes(k)))
      track = 'Advance';
    else if (basicKeywords.some((k) => t.includes(k) || c.includes(k)))
      track = 'Basic';

    return {
      id: crypto.randomUUID(),
      c: category,
      t: topic.trim(),
      lvl: track,
      s: source,
      tg: Array.from(targets),
    };
  });
}

const seedRawData = [
  ...buildSeed(
    'Vessel Chartering & Asset Mgt',
    'Introduction to Asset & Charter Business|Sale & Disposal Process|MOA : Clauses, Negosiation|Supporting Process/ Delivery Process|SnP General/ Ship Particular|Introduction of Chartering|Commercial Chartering & Business Development|Market research & Data Analytics|Charter Party Agreement|Tender management|Customer relationship management|Feasibility Study & Business Plan|Budgeting|Negotiation|Voyage Estimation',
    'Asset Charter'
  ),
  ...buildSeed(
    'Marine Engineering & Maintenance',
    'Non Vessel Asset Management (Truck & Trailer)|Super structure Component Inspection|Engine Component Inspection|Clucth & Transmission Component Inspection|Differential & Final Drive Component Inspection|Brake System ( Pneumatic & Hydraulic ) Component Inspection|Under carriage & Tyre Component Inspection|Hydraulic Component Inspection|Electric Component Inspection|Steering Component Inspection|Attachment Component Inspection',
    'Asset Charter'
  ),
  ...buildSeed(
    'Marine QSHE, Safety & Compliance',
    'Risk Classification & Measurement|IMO Regulation - SOLAS|IMO Regulation - MARINE POLLUTION|IMO Regulation - COLREG|Crisis Management|BRM (Bridge Resource Management)|ERM (Engine Resource Management)|ISM Code|ISO 9001 - Quality Management|ISO 45001 - Safety & Health Management|ISO 14001 - Environment Management|ISO 28001 - Supply Chain|ISO 19011 - Audit Management Guidance|Internal Auditor ISM-ISPS-MLC|Incident Investigation|Emergency Preparedness|Corrective Action|Contractor Safety Management System|Pemahaman SMS melalui QSHE Barriers|Standards QSHE Non Vessel|Inspeksi QSHE Alat Berat Depo|Inspeksi QSHE Repair Container|Inspeksi QSHE Operational Depo|Inspeksi QSHE Terminal & CY|Inspeksi QSHE Alat Berat Terminal & CY|Inspeksi QSHE Operational Trucking MJT|Inspeksi QSHE Kantor & Gedung|Inspeksi QSHE Workshop|Inspeksi QSHE Warehouse',
    'Asset Charter'
  ),
  ...buildSeed(
    'Vessel Operations & Performance',
    'Use of Digital Inspection & Documentation Software|Engine Performance Knowledge|Regulatory Compliance|Analytical Tool Training|Vessel Reporting System|Overview Chartering Business|Overview Liner Business|Overview Bunkering Business Process|Overview Ship Management|Retrofit/ Optimization Project|Fraud Awareness|Overview Vessel Performance|Cargo Stowage & Stability|Cargo Lifting & Securing|Lifting Calculation & Rigging Arrangement Plan|Cargo Lashing & Seafastening Calculation|Lifting Cargoes on Flat Rack Container|DG Cargo Handling|Chartering Operations|Incoterm|Tanker Operations & Compliance|Performance and Cost Control|Fuel & Speed management & monitoring',
    'Asset Charter'
  ),
  ...buildSeed(
    'Corporate Legal & Governance',
    'Reflagging and Change of Ownership|Basic understanding of Marine Insurance|Placement process for H&M and P&I policy|Claim Handling for H&M & P&I Insurance|Basic understanding Fixed Asset Non Vessel Insurance|Placement process for Fixed Asset Non Vessel Policy|Claim Handling for Fixed Asset Non Vessel Policy|Basic understanding Marine Cargo Insurance|Claim Handling for Marine Cargo (Insurance & Non Insurance)|Basic understanding Liability Insurance in Meratus Group|Claim Handling for Liability Insurance in Meratus Group|General knowledge of maritime law|Compliance with insurance regulations|Identification of risks and preparation of risk assessment|Coordination with surveyors / adjusters|Claim Management - Claim & Legal Disputes',
    'Asset Charter'
  ),
  ...buildSeed(
    'Ship Management & Technical Ops',
    'New Building Management|New Building MOU / Contract|New Building - Design & Project Feasibility Study|New Building - Specification & Inspection',
    'Asset Charter'
  ),
  ...buildSeed(
    'Working Capital, AR/AP & Treasury',
    'AR & AP Management|Budgeting and Financial Controls',
    'Asset Charter'
  ),

  ...buildSeed(
    'Drybulk Operations & Commercial',
    'MDM Business process|Policy & Procedures Commercial Supramax|Policy & Procedures Commercial Tug & Barges|Policy & Procedures Finance & Accounting|Market research & data analytic|Charter Party Agreement|Tender management (negotiating contract)|Shipping Knowledge|Customer relationship management|Service Knowledge|Feasibility Study & Business Plan|Basic Operation Management|Intermediate Operation Management|Marine Insurance|Finance for Non Finance|Legal for Non Legal|MDM Business process Operation|Policy & Procedures Operation Supramax (Include OJT)|Policy & Procedures Operation Tug & Barges (Include OJT)|Dokumen Operasional|IMDG code|Pengetahuan Dasar Claim|Pengetahuan Bunker|Agency|Port Information|Coal Shipment|Shipping Terminology|Charter|Incoterm|Ship Particular|Shipping Regulation - ISM Regulation|Transloading Operation|Tnb Operation|Pengetahuan Barang (Bulk Cargo)|Pengetahuan Bongkar Muat (Bulk Cargo)|Pengetahuan reefer|Insurance|Fuel management|Cost Management|IMBSC Code|Agency & Stevedoring|Bulk and Breakbulk Shipment|Commercial, Chartering, Legal & Technical|Shipping Regulation|Bulk Carrier & Breakbulk Operation|Stowage Planning|Cargo Superintendent|Cost Management (DOE & VOE)|Bunker Operations|Fuel and Speed Monitoring|Vetting Inspection|Budget Management',
    'Drybulk'
  ),

  ...buildSeed(
    'Liner Commercial & Account Mgt',
    'Liner Services|Product Knowledge & Cargo Shipment (PPB)|Basic Cargo Knowledge|Basic Container|Term of Shipment|Product Knowledge Reefer & Reefer Handling|Product Knowledge - VAS|Breakbulk Cargo & Project|Time Charter Equivalent|FAQ for Customer|Pengetahuan Kepabeanan dan Exim untuk Pelayaran|Bill of Lading|Terminal Productivity and Operation Pattern|Incoterm Liner (2020)|Dangerous Goods|Cost of Failure|Booking Process|Marine Cargo Insurance|Marine Insurance|Halal Cargo Assurance|Service Excellence|Business Process Knowledge|Sales Activity & Customer Profile|Pricing Management|Customer Contract & Key Account Management|Calculate Overdimension Cargo|Calculate Rate & Freight|Account Receivable|Decision Making Unit|Body Languange|Handling Complaint|Business Development|Route Profitability|Finance for Non Finance|Advance - SOC Business',
    'Liner Commercial'
  ),

  ...buildSeed(
    'Liner Network & International Ops',
    "Shorterm Pricing & Long-Term Pricing Trade Off|Resource Reshuffle: Deployment & Capacity|VSA Cooperation|Agency & Husbunding Management|Customer Segmentation|Direction Setup|Pricing Principle|Deployment|TCE Analysis|PNL Analysis|Competitor's Analysis|Route Design|Meratus Network|Contingency Plan|Incoterms 2020|Capacity Management|Cost of Failure Operation|Reefer Management|Equipment Logistic Performance|IMDG CODE|Depo Management|Bill of Lading|Documentation : Custom & Export/Import|Budget Setup|Strategy Setup|Deployment Planning|Network Design|Project Management",
    'Liner International'
  ),

  ...buildSeed(
    'Terminal & Port Operations',
    'Type of Terminal|Terminal Container Operation|Terminal Performance Indicators|Terminal Crane Working Plan|Terminal Berthing Allocation|Terminal Procurement|Terminal Cost Saving|Disbursement Account|Different Type of Equipment|Lease/Lease Purchase/One Way/Free Use Agreement|PI Logistic : Dwelling Time and Container Cycle|Imbalance Mechanism|Eva Line - Empty evacuation Plan|Idle Container|Other : seals, container spec, depot|Cost of Failure|Depot and trucking management|Repair : EOR, Claim and Productivity|Dangerous Goods (DG DESK)|Voyage Proforma & Scheduling Introduction|Port Info & Port Restriction|Berth Allocation|Slot Capacity Vessel|Vessel Info and Characteristic|Planning Center Organization|Bunker Knowledge|Bunker Operation Representative|Bunker Quantity Survey|DNA E-LPBB|FOC|Monitor and control fuel consumption in real time|Route optimization and hull cleaning|Basic of Navigation & Passage plan|Weather Chart and Meteorology analysis|Voyage Efficiency knowledge|Operational Ship Performance',
    'Liner Ops'
  ),

  ...buildSeed(
    'Liner Trade & Pricing Strategy',
    'Liner Services|Product Knowledge & Cargo Shipment (PPB)|Basic Cargo Knowledge|Basic Container|Term of Shipment|Product Knowledge Reefer & Reefer Handling|Product Knowledge - VAS|Breakbulk Cargo & Project|Time Charter Equivalent|FAQ for Customer|Pengetahuan Kepabeanan dan Exim untuk Pelayaran|Bill of Lading|Terminal Productivity and Operation Pattern|Incoterm Liner (2020)|Dangerous Goods|Cost of Failure|Booking Process|Marine Cargo Insurance|Marine Insurance|Halal Cargo Assurance|Service Excellence|Business Process Knowledge|Depo Management|Heavy Equipment|Port Information/Management|Loading Unloading|Container Inventory Management|Teknik Survey & Quality Control|Repair Container|Body Language|Handling Complaint|DMU (Decision Making Unit)|Sales Activity|SOC|Ship Particular|Ship Stability (Introduction, Technical & Calculation)|Calculate Rate & Freight|How To Do Budgeting & Forecasting|Route Profitability, CM, Ebitda|Join Slot/Vessel Slot Agreement|Pricing Management (Segmentation, Tier Pricing)|Slot Cost|TCE (Time Charter Equivalent)|Dangerous Goods|Voyage Proforma & Scheduling Introduction|Basic of Navigation & Passage plan|Voyage Efficiency knowledge',
    'Liner Trade'
  ),

  ...buildSeed(
    'Logistics & Forwarding Operations',
    'Business Process Management Logistics|Quality Management System & Business Control Framework|ISO (QSHE), License, Halal & Audit Process|Product MGLog - Sea Freight Domestic|Product MGLog - Sea Freight International|Product MGLog - Sea Freight LCL|Product MGLog - Sea Freight Reefer|Product MGLog - Air Freight|Product MGLog - Customs Clearance|Product MGLog - Industrial Project|Product MGLog - Warehouse|Commercial|Product MGLog - Agency|Branch Management|Operations: Ops Monitoring & System Support|Operations: Job Control|Operations: SCM Profit|Vendor Management - Trucking|Vendor Management - Pricing/Sea Domestic|Account Receivable (AR)|Account Payable (AP)|P3W Sales|Cost Structure & Memo Tariff|Account Management & Development Strategy|Account Plan|CSOP|Tender Management & Strategy|Selling Skill|Customer Experience|Post-Bidding Analysis|Dispute Management (AP)|Dispute Management (AR)|VMT Guidance - Trucking & Pricing|P3W Operation|Pengetahuan Container|Cargo & Document Handling|DOM & Update Milestones|Petty Cash & BS|Cargo Inventory Management|Claim Management & Insurance|Penyelia Halal Berbasis SKKNI & Penerapan SJPH|Legalitas Kontrak|Risk Management',
    'Logistics'
  ),

  ...buildSeed(
    'Agency Operations (HMM)',
    'Product Knowledge HMM ( Compass & Bussiness Process )|Export and Import CS Business process|Export Import Documentation business process|Equipment & Logistic Control|Vessel/Operation|Manifest|Container idling management|Container Maintenance & Repair Overview|Claim Procedure & Problem Solving|Product Knowledge HMM|Export and Import Overview|Equipment Overview|Ship Particular Overview|Cargo & General Stowage Overview|Maintenance and Repair Overview|Container Dwelling Control (T/S Port)|Terminal & Stowage Planning Operation|Depo & Logistic Management|Contract|Operation Management|Cost Management|Sales Product Knowledge|Sales Plan|Customer Service Dept|Operation|Marketing Information|Key Customer Management|Trade Management|Business Development',
    'HMM'
  ),

  ...buildSeed(
    'Crew Management & Development',
    'Company regulation|MLC 2006|STCW 2010|Company P3W & Culture|Crewing system (MariApps)|Crewing Management & Certificate|Business Acument|Office management|Communication skill|Penangananan insiden/ darurat untuk awak kapal|Interview skill|Negotiation skill|Training Management|Payroll|Tax (PPH 21)',
    'Crewing'
  ),

  ...buildSeed(
    'Marine Engineering & Maintenance',
    '01 Aux Mach Fuel System|02 Aux Mach Charge Air System|03 Fresh Water Generator|04 Aux Mach Refrigerator|05 Aux Mach Controllable Pitch Propeller|06 Aux Mach Lubricating Oil System|07 Aux Mach Cooling System|08 Aux Mach Starting System|09 Aux mach Purification System|01 Engine Plan - Fuel System|02 Engine Plan - Charge Scavenge Air System|03 Engine Plan - Compression System|04 Engine Plan - Starting Air System|05 Engine Plan - Cooling System|06 Engine Plan - Lubricating System|01 Engine Performance - Normal Operation|02 Engine Performance - Overload Engine Operation|03 Engine Performance - Function of Collecting Data|04 Engine Performance - Heat Balance & Efficiency|05 Engine Performance - Monitoring of Engine Performance|06 Engine Performance - Low Load Slow Steaming|Safety of Life at Sea|Marine Polution|STCW 2011|MLC 2006|ISM Code|ISPS Code|Ballast Water Management|Garbage Management|Bridge Resource Management|Safety Drill|Class Survey & 13 Ship Ceritificates|Crewing Management & Certificate|15 UU Pelayaran|Internal Audit & Investigation|Introduction Insurance & Claim|Ships Construction|Background & Introduction to Dry Docking|Project Management Application in Docking|Planning & Specification|Tendering for Drydock work|Dry Dock preparation, execution & Supervision|Docking undocking & Completion of Project|Docking Contract|Docking Minus 12|Painting & Maintenance|Crew Management : Planning & Operational|MariApps - Change Management|MariApps - Plan Management System|MariApps - Accounts|MariApps - Certification|MariApps - Purchase|MariApps - LPSQ|MariApps - Quality Document Management System|MariApps - Quality Document Management System WIKI|MariApps - Drydock',
    'MSM'
  ),

  ...buildSeed(
    'Workshop Fabrication & Heavy Maintenance',
    'Welding Safety and Fundamentals|Welding Processes|Fabrication and Applications|Metallurgy and Materials|Additional Topics|Carpenter Safety and Fundamentals|Core Carpentery skills|Advanced Carpentry Skills|PPIC Safety and Fundamentals|Production Planning|Production control|Inventory control|Digital & Tools|Overhaul Safety and Fundamentals|Engine description and component|Engine system and overhaul|Gearbox and propulsion',
    'Workshop'
  ),

  ...buildSeed(
    'Container Depot & Repair Operations',
    'Pengetahuan Depo|Pengetahuan Stuffing / Stripping|Pengetahuan Penyerahan / Penerimaan Container|Pengetahuan Stack Hampar Container|Perencanaan Kebutuhan Alat Mekanis|Perencanaan Lay Out Depo|Yard management system|Pengetahuan Claim Container|Basic Sales & Selling|Pricing Strategy|Pengetahuan Repair Container|Standard Cargo Worthy|IICL|Teknik Survey & Quality Control|Teknik Repair Container|Estimate of Repair & Productivity Repair|Safety Repair Container|Pengetahuan Reefer Container|Teknis PTI|Safety Operation and Mechanical Awareness (SOMA) ERTG|SOMA Reach Stacker & Side Loader|SOMA Forklift & Forklift Loader|Maintenance Management|Tyre Management|Planning, Scheduling, dan Backlog Management|Performance Measurement & Equipment Management|Preventive Maintenance|Maintenance Budget & Cost Control|Engine System|Power Train System|Hydraulic System|Electrical System|Brake System|Steering System|Differential & Final Drive|Pengenalan Fungsi dari Komponen Engine|Pengenalan Fungsi dari Komponen Electric|Pengenalan Fungsi dari Komponen Power Train|Pengenalan Fungsi dari Komponen Accessories|Pengenalan Fungsi dari Komponen Hydraulic|Prinsip kerja berdasarkan Block Diagram pada System Engine|Prinsip kerja berdasarkan Block Diagram pada System Electric|Prinsip kerja berdasarkan Block Diagram pada System Hydraulic|Simbol & nama Komponen Electric|Simbol & nama Komponen Hydraulik|Teknik lepas & pasang komponen Electric|Teknik lepas & pasang komponen Non Electric|Prosedur Daily Maintenance|Prosedur Periodic service|Cara menggunakan common tools dengan benar|Karakteristik komponen electric|Karakteristik komponen Non electric|Teknik dasar pengelasan|Engine Troubleshooting|Hydraulik troubleshooting|Mekanik troubleshooting|Setting & Adjustment (Minor Komponen)|Prinsip kerja hydraulic system|Cara menggunakan special tools dengan benar (WI)|Wiring Diagram Hydraulic & aplikasinya di lapangan|Analisa kerusakan komponen berdasarkan hasil oil lab, cutting filter,kerusakan fisik|Diagnosis, set up, pembacaan pada system monitoring|Cara menggunakan special service tools dengan benar (unfinished)|Prosedur kalibrasi timbangan|Warehouse Management|Parts & Inventory Management|Asset Management D365',
    'CLC'
  ),

  ...buildSeed(
    'Terminal, Stevedoring & HE Ops',
    'Pengetahuan Bongkar Muat|Pengetahuan Container|Ship Particular|Stabilitas Kapal|Stowage Plan|Operational Procedure & Process|Perencanaan Receiving (Layout &  Stacking Container)|Perencanaan Bongkar Muat|Penanganan Cargo (include Container,Uncontainerized, DG, Reefer)|Pengetahuan Claim Container|Pendapatan dan Biaya Terminal|SOMA & Pengoperasian Alat Rubber Tyre Gantry|SOMA & Pengoperasian Alat Container Crane|SOMA& Pengoperasian Alat Harbour Mobile Crane|SOMA & Pengoperasian Alat Side Loader (SL)|SOMA & Pengoperasian Alat Head Truck (HT)|ISO 9001&ISO 45001 Awareness|QSHE Terminal Management|Document & Validation|Control & Monitoring|Performance Maintenance Management|Maintenance Procedure & Process|Planning & Scheduling|Budgeting & Cost control|Safety Management HE|Workshop & Tools Management|Tire Management (ALL HE)|HT Engine|HT Pneumatic|HT Starting and Charging (Electrical System)|HT Power Train (Main Clutch, Transmisi, Diffrential, Axle Shaft, Final Drive)|RTG Head Block & Spreader|RTG Hybrid System|RTG Cable Reel & AGSS System|RTG Cable Chain|RTG Control System|RTG Gantry System|RTG Hoist System|RTG Trolly System|RTG Antisway System|RTG Drive System|RTG PLC&CMS Function|STS Cable Reel|STS Spreader & Head Block|STS PLC&CMS Function|STS TLS System|STS Gantry System|STS Trolly & Fesston System|STS Hoist & Boom System|STS Drive System|STS HV Switchgear|STS Elevator System|HMC Engine|HMC Spreader|HMC Travelling System|HMC Slewing System|HMC Hoist System|HMC CMS View System|HMC PLC, Control, & Drive System|SL Engine|SL Hydraulic System|SL Starting and Charging (Electrical System)|SL Power Train|General Arrangement HT|General Arrangement RTG / ERTG|General Arrangement STS|General Arrangement SL|General Arrangement HMC|Pembacaan data SOS|Pembacaan data Program|Management Overhaul yang efektif|PPM (Program Pengecekan Mesin)|Warehouse Management (Inventory, Part)|Asset D365',
    'MSA'
  ),

  ...buildSeed(
    'Heavy Equipment & Maintenance',
    'Pengetahuan Bongkar Muat|Pengetahuan Container|Terminal Operation System|Yard Planning|Ship Particular|Ship Stability|HSE Terminal Management|Basic Operation CC|Basic Operation RMGC|Basic Operation RS|Basic Operation HT|Pre Operational Check Up|Perencanaan B/M|Penanganan Container|Equipment Documentation|Pengenalan Tools dan Penggunaannya|Pengenalan Maintenance System|Electrical Maintenance CC01-CC03|Electrical Maintenance CC04-CC07|Electrical Maintenance RMGC01-RMGC05|Electrical Maintenance RS|Electrical Maintenance HT|Mechanical Maintenance CC01-CC03|Mechanical Maintenance CC04-CC07|Mechanical Maintenance RMGC01-RMGC05|Mechanical Maintenance RS|Mechanical Maintenance HT|Warehouse Database System|Part Knowledge',
    'OJA'
  ),

  ...buildSeed(
    'Trucking & Land Transport',
    'Order Management|Order Planning and Allocation|TMS Application Knowledge (Freighthub & Davis)|Claim Handling|Land Transport Knowledge and Regulation|Cargo Handling|Accident Handling|Recruitment & screening|Driver performance & evaluation|Regulation & compliance|Data base driver and Personnel Management|RFQ handling|Handling Customer Complaint|Customer Mapping|Profitability Analysis (Route Classification)|Transport Analysis|Invoice creation|Uninvoiced|CN/DN Creation|3rd Party Reimburseable Cost|Policy AR|Replenishment & Reimbursement|Petty Cash and Cash Opname|Policy AP|Payment (Trip Cost, Fuel)|Basic Monitoring by GPS|Abnormality Monitoring|CT Reporting|Basic Maintenance Management|Product Knowledge Unit|Maintenance Planning & Schedule|Daily Inspection/P2H|Tyre Management|Asset Management di D365|Backlog Management|Proper Measurement|Maintenance cost control|Inventory Management di D365|Replenishment Min/Max Stock|Goods request/Goods Issue|Warehousing Management|Scrap Spare Parts/tyres Handling Management|Inventory Analysis|Stock Opname Circle|Risk Assessment & HIRADC|Basic Investigation & Root cause Analysis|Safety Analysis|Road Hazard Map|Safety Observation Card Knowledge|Contract Management & Legalitas|Inventory Request di D365|Legalitas Document Unit Handling|P3W Knowledge (End to End Process)|Power Querry|Trucking Knowledge|Operation Overview|Business Overview|Document Control - AP|Driver Management - Trucking|QSHE Operational Trucking',
    'Trucking'
  ),

  ...buildSeed(
    'Business Process Management (BPM)',
    'Business Process Management Framework|Basic Shipping Induction – Inbound and Outbound Process|Customer Centric in Shipping Business|Induction to Liner Business Process|Induction to Depot & Terminal Business Process|Meratus Quality System|Logistics Business Knowledge (MGLOG & MJT Business Process)|Induction to Meratus Online and M-One for Internal Stakeholder|Customer Journey with Meratus All in One (M-One)|SIKAP – How to Identify and Report in SIKAP|Change Management & Impact Assesment|Induction to MELISA Liner System|Business Process Assesment for Digital Transformation|Management of P3W|Project Management|Work Load Analysis for Project|Business Process Modeling & Notation|Core Model Framework',
    'BPM'
  ),

  ...buildSeed(
    'Corporate Communications & GA',
    'Branding Guideline|Digital Marketing|Social Media Marketing|Communication Campaign|Writing Publication|Crisis Communication|Photographic Technique|Videography Editing|Graphic Design & Tools|Event Management|Sustainability Management',
    'CorpCom'
  ),

  ...buildSeed(
    'Corporate Finance, Tax & Reporting',
    'Cash & Bank - Module|AP - Module|AR - Module|GL - Module|Fixed Asset - Module|Inventory Management - Module|Organization Administration - Module|Data Management - Module|Financial Dimension|D365 Introduction for New Joiner - Accounting & Reporting|Accounting Principle Application in Business|Basic Financial Auditing|Tax Accounting|Advance Accounting - Consolidation|Intercompany Transaction and Reconciliation (Trade Non-Trade)|Financial Proforma Analysis|Financial Audit|Basic Account Payable|Invoice processing|Data Entry and Management|Reconciliation Skills|Payment Processing|Vendor Management|Problem-Solving and communication|DPO (Days Purchase Outstanding)|Basic Collection Management|Intermediate Collection Management|Introduction to Credit Management|Credit Risk Assessment & Risk Mitigation|Receiving Payment & Fundamentals of Payment Allocation|Basics of Refund & Disbursement Processes|Review & Approval of Refunds|DSO (Days Sales Outstanding)|Account Receivable Induction|Cash & Bank Account Management|Payment Procesing System|cash management System di D365|Petty Cash module|Peran dan tanggungjawab kasir|Uang muka vendor karyawan untuk operasional|Bank Mandate ( Cash Management) di Meratus grup|Flow process ebanking Corporate Card|Selection of the bank used|Template draft of the bank guarantee used|Underlying tender/contract documents|Submission of the bank guarantee to the bank|Achieve optimum Cash capability (liquidity and solvency)|DIO (Days Inventory Outstanding)|Cash Conversion Cycle (CCC)|Proforma Financial Performance Overview|Quality of Earnings on EBITDA basis|Working Capital Analysis|Engagement to external consultant|Construct financial modelling|Cost Accounting and Variant Analysis|Revenue and Cost Driver Matching|General Finance Process & Implementation in Business Unit|General Business Financial Key Performance Indicators|General Other Business or Operational Process|Understanding Business Model and Value Chain|Operations and Finance Integration|Driving Value through Financial Insight|TCE (Timer Charter Equivalent)|Liner Cost and revenue|Logistics Business Process|Logistics System Understanding|Authority Matrix in each BU - FU|OPEX Reporting|CAPEX Reporting|Group Reporting|Budgeting & Forecasting|Cost Saving & Revenue Enhancement|Management Report|PMO Finance Scope|Tax Implications in Logistics|Ketentuan Umum Perpajakan|Omnibus Law|CFC Rules|International Tax on Shipping|Harmonisasi Peraturan Perpajakan Law|Pajak Penghasilan : Subyek Pajak dan Obyek Pajak|Personal Income Tax|Corporate Income Tax Return|Income Tax Art 21/26|Income Tax Art 23/26|Income Tax Art 4(2), 15|VAT|Offshore Transaction Tax - VAT & Art 26 (Tax Treaty)|Tax Audit|Tax Objection|Tax Appeal|Bea Materai, PBB, BPHTB|Tax on Yayasan, CSR & Donation|Cost Leadership',
    'Finance'
  ),

  ...buildSeed(
    'Facility Mgt & General Affairs',
    'Regulatory Permits & Compliance|Asset Property Management|Contract & Vendor Management|P2P & e-Procurement Process|Facility Operations|Asset & Inventory Management|Vehicle Management|Security & Emergency Response|Waste Management|Budgeting & Cost Control|Data & Reporting|Project & Change Management|Stakeholder Management',
    'GA Asset Property'
  ),

  ...buildSeed(
    'Human Resources & Talent Management',
    'Merumuskan Strategi dan Kebijakan Manajemen Sumber Daya Manusia|Merumuskan Proses Bisnis serta Tugas dan Fungsi dalam Organisasi|HR Budgeting|Business Acumen - Liner|Business Acumen - Asset & Charter, Drybulk|Business Acumen - Ship Management|Business Acumen - Logistics & Trucking|Business Acumen - Terminal|Business Acumen - Agency HMM|Business Acumen - SFU|Menyusun Design Organisasi|Menyusun Uraian Jabatan|Melaksanakan Analisis Beban Kerja|Menyusun Standar Operasional Prosedur (SOP)|Menyusun Kebutuhan SDM|Instrumen Seleksi (BEI)|Menyusun Kebutuhan Pembelajaran dan Pengembangan|Merancang Program Pembelajaran dan Pengembangan|Program Evaluasi Pembelajaran|Mengelola Program Suksesi|Competency Model|Talent Development (Intervention & Retention)|Mengelola Proses Perumusan Indikator Kinerja Individu|Menyusun Grading Jabatan|Menyusun Sistem Remunerasi|Menentukan Upah Pekerja|Menyusun Peraturan Perusahaan dan/atau Perjanjian Kerja Bersama|Menangani Keluhan Pekerja & Perilaku Disiplin|Membangun Hubungan Industri Yang Harmonis|Memfasilitasi PHK & Penyelesaian PHI|Mengelola Alih Daya|Membangun Komunikasi Organisasi yang Efektif|HR Data Analytics|Melakukan Administrasi Jaminan Sosial|Menangani Administrasi Pekerja Antar Negara|Corporate Travel|Tax / Pph 21',
    'HRD'
  ),

  ...buildSeed(
    'Internal Audit & Compliance',
    'Liner & Charter Biz Knowledge|Ship Management Biz Knowledge|Drybulk Biz Knowledge|Logistics Biz Knowledge|Trucking Biz Knowledge|Terminal Biz Knowledge|Depo CLC Biz Knowledge|Workshop Biz Knowledge|Agency Biz Knowledge|Order to Cash Cycle (All Line Business)|Bunker Management|Port & Terminal Operation|Asset Management|Expenditure Cycle (Stevedoring, P2P, etc)|Docking Management|Finance & Accounting Core Comp|Internal Control & Risk|Fraud|Risk Management|Auditing|Managing of IA Function|Code of Ethics|Strategic Planning|Corporate Governance|Liner as Principal & Agency|Logistics (MIF, MLT, & MJT)|Container Logistics Center|Fixed Assets & Inventory Control|Expenditure Cycle - Procedure to Pay|Vessel Inspection',
    'Internal Audit'
  ),

  ...buildSeed(
    'IT Engineering, Security & Architecture',
    'Agile - Scrum Introduction|Project Management Skill|IT Audit Review (CISA)|IT Risk & Governance (COBIT Foundation)|DevSecOps Generalist|CyberSecurity Awareness|IT Policies & Procedures|Great Communication Skills with Customer, Business User & other colleagues|JIRA Software (How to usage)|Programming Languages : Python|Programming Languages : Ruby|Programming Languages : Java|Programming Languages : ASP .Net C#|Programming Languages : PHP|Programming Languages : Flutter|Microsoft Dynamics 365 applications|Understanding Gitlab Repository|Understanding Clean Architecture Design|Application and Architecture Design|Application Security and OWASP|Developing and delivering using Agile methodologies|DevSecOps Advance|Familiar with RPA tools|Familiar managed RPA environment|Knowledge of Electronic Data Interchange (EDI)|Knowledge Data Modeling|Knowledge Data Transformation and ETL|Knowledge AI and Machine Learning|Structured Query Language (SQL)|Relational databases|Non-relational databases|Create Mockup Application|Research skills|IT Architecture|Documentation skills|Software Testing Skill|Creating documentation (Skenario Test)|Preparing software tests|Understanding the testing process|Composing defect reports|Analytical and logical reasoning|Automating software tests|UI/UX Design (Mobile app/web)|Design Concept|Design Styles|Design System|Layouting Design|Consistency|Design Illustration|Design Animation|Design Thinking|Graphic Design|UX Strategy and Planning|UX research|Qualitative Research|Quantitive research|Information and Architecture|UX Writing|Communication and Presenting|Design Tools UI/UX (Figma/Xd)|Design Tools Illustration Graphical|Design Tools Animation|Design Audit|Penetration Testing|NIST CYBER SECURITY Framework|ISO27001:2022|Security Events Analysis|Incident Response|IT Service Management (ITSM)|ITIL 4.0 Foundation|Microsoft 365 Support|Multi Factor Authentication (MFA) Support|Security Application Support|IP PBX Support|Knowledge of PowerShell Scripting|Knowledge Google Workspace|Networking Fundamental Support|Hardware Technical Support|Network Monitoring System|Network Incident Response|Network Troubleshooting Tools|Understanding Google and Azure Cloud Security and Operations|Architecting with Google Kubernetes Engine|Identity and Access Management|Scalability and Reliability Resources Concept|Implement and manage storage in Azure, GCP & On premise|Configure and manage virtual networks|Monitor and back up Azure & GCP resources|Virtualization VMWare|Knowledge OS Linux and Windows Server|Well Architech Framework|Knowledge Active Directory|Administration Endpoint & Email Security|Maritime Business Knowledge|Logistics Business Knowledge|Terminal and Depot Business Knowledge|Back Office Business Knowledge|Fleet Management Business Knowledge',
    'IT'
  ),

  ...buildSeed(
    'Corporate Legal & Governance',
    'Corporate Law & Company Secretarial|Corporate Governance & Board Support|Capital Markets & Disclosure|Regulatory & Licensing|Employment & Labor Law|Privacy & Data Protection|Anti-Corruption, AML & Sanctions, PPT SPM|Competition/Antitrust|Compliance Program Design & Monitoring|Ethics & Code of Conduct|Dispute Resolution & Litigation Management|Legal Research & Analysis|Legal Opinions & Memo Writing|Liner & Charter Biz Knowledge|Ship Management Biz Knowledge|Drybulk Biz Knowledge|Logistics Biz Knowledge|Trucking Biz Knowledge|Terminal Biz Knowledge|Depo CLC Biz Knowledge|Workshop Biz Knowledge|Agency Biz Knowledge',
    'Legal'
  ),

  ...buildSeed(
    'Procurement & Vendor Management',
    'Negotiation in Procurement|Vendor Management|Cost Analysis & Budgeting|Strategic Sourcing|Finance for Procurement|Stakeholder Management|Product and Product release|Buyer Group Concept|Inventory Request & Purchase Request|Request for Quotation & Purchase Order|Purchase Received|Financial dimension|Warehouse|Negotiation in Procurement MSM|Vendor Management MSM|Cost Analysis & Budgeting MSM|Strategic Sourcing MSM|Finance for Procurement MSM|Stakeholder Management MSM|Requestion process|Purchase Order Process including vessel allocation|Receiving Process|E-Connect|Product and product release MSM',
    'Procurement'
  ),
];

const deduplicateSeedData = (data) => {
  const map = new Map();
  data.forEach((item) => {
    const key = item.t.trim().toLowerCase();
    if (map.has(key)) {
      const existing = map.get(key);
      const sourceSet = new Set(existing.s.split(', '));
      sourceSet.add(item.s);
      existing.s = Array.from(sourceSet).join(', ');
      item.tg.forEach((t) => existing.tg.add(t));
    } else {
      map.set(key, { ...item, tg: new Set(item.tg) });
    }
  });
  return Array.from(map.values()).map((item) => ({
    ...item,
    tg: Array.from(item.tg),
  }));
};

const DEFAULT_TOPICS = deduplicateSeedData(seedRawData);

// ==========================================
// 4. UI COMPONENTS
// ==========================================
const MultiSelectDropdown = ({
  title,
  options,
  selectedOptions,
  setSelectedOptions,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (option) => {
    if (selectedOptions.includes(option))
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    else setSelectedOptions([...selectedOptions, option]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        {title}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition-all bg-white ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex items-center truncate">
          {Icon && (
            <Icon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
          )}
          <span className="truncate text-gray-700">
            {selectedOptions.length === 0
              ? `All Options`
              : `${selectedOptions.length} Selected`}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl top-full left-0">
          <div className="p-2 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <span className="text-xs font-semibold text-gray-500">
              {options.length} Options
            </span>
            {selectedOptions.length > 0 && (
              <button
                onClick={() => setSelectedOptions([])}
                className="text-xs text-red-600 hover:text-red-700 flex items-center"
              >
                <FilterX className="h-3 w-3 mr-1" /> Clear
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => handleToggle(opt)}
                className="flex items-center px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer group"
              >
                {selectedOptions.includes(opt) ? (
                  <CheckSquare className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-gray-300 group-hover:text-blue-300 mr-2 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-700 truncate">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. MAIN DASHBOARD COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]); // NEW STATE FOR ORIGINATED BY

  const [matrixSort, setMatrixSort] = useState({ key: 'c', dir: 'asc' });
  const [summarySort, setSummarySort] = useState({
    key: 'category',
    dir: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Firebase & Admin State
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Modals State
  const [editingTopic, setEditingTopic] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);

  // Category Manager State
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [catManagerTab, setCatManagerTab] = useState('details'); // 'details', 'add', 'assign'
  const [categoryToManage, setCategoryToManage] = useState('');
  const [catNameInput, setCatNameInput] = useState('');
  const [catDescInput, setCatDescInput] = useState('');
  const [topicsToAssign, setTopicsToAssign] = useState([]); // Array of topic IDs
  const [assignSearch, setAssignSearch] = useState('');

  // Setup Firebase Auth
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error('Auth Error:', err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Fetch Data
  useEffect(() => {
    if (!user || !db) return;

    const docRef = doc(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'matrixData',
      'mainDoc'
    );
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          setTopics(snap.data().topics || []);
          setCategoryDetails(
            snap.data().categoryDetails || INITIAL_CATEGORY_DESCRIPTIONS
          );
        } else {
          setDoc(docRef, {
            topics: DEFAULT_TOPICS,
            categoryDetails: INITIAL_CATEGORY_DESCRIPTIONS,
          }).catch(console.error);
          setTopics(DEFAULT_TOPICS);
          setCategoryDetails(INITIAL_CATEGORY_DESCRIPTIONS);
        }
      },
      (error) => console.error('Firestore Error:', error)
    );

    return () => unsubscribe();
  }, [user]);

  // Sync Category Inputs when selection changes
  useEffect(() => {
    if (categoryToManage && catManagerTab === 'details') {
      setCatNameInput(categoryToManage);
      setCatDescInput(categoryDetails[categoryToManage] || '');
    } else if (catManagerTab === 'add') {
      setCatNameInput('');
      setCatDescInput('');
      setCategoryToManage('');
    } else if (catManagerTab === 'assign' && categoryToManage) {
      setTopicsToAssign(
        topics.filter((t) => t.c === categoryToManage).map((t) => t.id)
      );
    }
  }, [categoryToManage, catManagerTab, categoryDetails, topics]);

  // Derived Lists
  const ALL_CATEGORIES = useMemo(() => {
    const cats = new Set(topics.map((d) => d.c));
    Object.keys(categoryDetails).forEach((c) => cats.add(c));
    return [...cats].sort();
  }, [topics, categoryDetails]);

  const ALL_LEVELS = ['Basic', 'Intermediate', 'Advance'];
  const levelWeight = { Basic: 1, Intermediate: 2, Advance: 3 };

  // NEW: Dynamic Extractor for Originated By sources
  const ALL_SOURCES = useMemo(() => {
    const sources = new Set();
    topics.forEach((t) => {
      if (t.s) t.s.split(', ').forEach((s) => sources.add(s.trim()));
    });
    return [...sources].sort();
  }, [topics]);

  // Dynamic Description Fetcher
  const getDynamicCategoryDesc = (catName) => {
    return (
      categoryDetails[catName] ||
      'Custom or newly added category containing specialized operational or strategic training topics.'
    );
  };

  // Admin Login
  const handleAdminLogin = () => {
    if (adminPassword === 'MeratusAcademy') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else alert('Incorrect Password');
  };

  // Cloud Sync Helper
  const syncToCloud = async (newTopics, newCatDetails) => {
    if (!db) return;
    try {
      await setDoc(
        doc(db, 'artifacts', appId, 'public', 'data', 'matrixData', 'mainDoc'),
        {
          topics: newTopics,
          categoryDetails: newCatDetails,
        }
      );
    } catch (err) {
      console.error('Save error', err);
    }
  };

  // CRUD Operations - Topics
  const saveTopic = (topic) => {
    let newTopics;
    if (topic.id)
      newTopics = topics.map((t) => (t.id === topic.id ? topic : t));
    else newTopics = [{ ...topic, id: crypto.randomUUID() }, ...topics];

    let newDetails = { ...categoryDetails };
    if (!newDetails[topic.c]) {
      newDetails[topic.c] = 'New custom category added via topic creation.';
    }

    setTopics(newTopics);
    setCategoryDetails(newDetails);
    setEditingTopic(null);
    syncToCloud(newTopics, newDetails);
  };

  const deleteTopic = (id) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;
    const newTopics = topics.filter((t) => t.id !== id);
    setTopics(newTopics);
    syncToCloud(newTopics, categoryDetails);
  };

  // CRUD Operations - Category Manager
  const handleSaveCategory = () => {
    const newName = catNameInput.trim();
    if (!newName) return alert('Category name cannot be empty.');

    let newDetails = { ...categoryDetails };
    let newTopics = [...topics];

    if (catManagerTab === 'add') {
      if (newDetails[newName]) return alert('Category already exists.');
      newDetails[newName] = catDescInput.trim();
      alert(`Category "${newName}" added successfully.`);
      setCatNameInput('');
      setCatDescInput('');
    } else if (catManagerTab === 'details') {
      const oldName = categoryToManage;
      if (!oldName) return;

      if (oldName !== newName) {
        delete newDetails[oldName];
        newTopics = newTopics.map((t) =>
          t.c === oldName ? { ...t, c: newName } : t
        );
      }
      newDetails[newName] = catDescInput.trim();
      setCategoryToManage(newName);
      alert('Category details updated successfully.');
    }

    setCategoryDetails(newDetails);
    setTopics(newTopics);
    syncToCloud(newTopics, newDetails);
  };

  const handleDeleteCategory = () => {
    if (!categoryToManage) return;
    if (
      !confirm(
        `Delete "${categoryToManage}"? Its topics will be moved to "Uncategorized".`
      )
    )
      return;

    let newDetails = { ...categoryDetails };
    delete newDetails[categoryToManage];
    if (!newDetails['Uncategorized'])
      newDetails['Uncategorized'] =
        'Topics that have lost their category mapping.';

    let newTopics = topics.map((t) =>
      t.c === categoryToManage ? { ...t, c: 'Uncategorized' } : t
    );

    setCategoryDetails(newDetails);
    setTopics(newTopics);
    setCategoryToManage('');
    syncToCloud(newTopics, newDetails);
  };

  const handleSaveAssignments = () => {
    if (!categoryToManage) return;

    let newDetails = { ...categoryDetails };
    if (!newDetails['Uncategorized'])
      newDetails['Uncategorized'] =
        'Topics that have lost their category mapping.';

    let newTopics = topics.map((t) => {
      if (topicsToAssign.includes(t.id)) {
        return { ...t, c: categoryToManage };
      } else if (t.c === categoryToManage) {
        return { ...t, c: 'Uncategorized' };
      }
      return t;
    });

    setTopics(newTopics);
    setCategoryDetails(newDetails);
    alert('Topic assignments updated.');
    syncToCloud(newTopics, newDetails);
  };

  // ----------------------------------------
  // Filtering & Sorting Logic
  // ----------------------------------------
  const filteredData = useMemo(() => {
    setCurrentPage(1);
    return topics.filter((item) => {
      const matchSearch =
        item.t.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.s.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.c.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategories.length === 0 || selectedCategories.includes(item.c);
      const matchLevel =
        selectedLevels.length === 0 || selectedLevels.includes(item.lvl);
      const matchTarget =
        selectedTargets.length === 0 ||
        item.tg.some((t) => selectedTargets.includes(t));
      const matchSource =
        selectedSources.length === 0 ||
        item.s.split(', ').some((s) => selectedSources.includes(s.trim()));

      return (
        matchSearch && matchCategory && matchLevel && matchTarget && matchSource
      );
    });
  }, [
    topics,
    searchTerm,
    selectedCategories,
    selectedLevels,
    selectedTargets,
    selectedSources,
  ]);

  const sortedFilteredData = useMemo(() => {
    let sortableItems = [...filteredData];
    sortableItems.sort((a, b) => {
      let aVal = a[matrixSort.key];
      let bVal = b[matrixSort.key];

      if (matrixSort.key === 'c') {
        const catCompare = a.c.localeCompare(b.c);
        if (catCompare !== 0)
          return matrixSort.dir === 'asc' ? catCompare : -catCompare;
        return (levelWeight[a.lvl] || 2) - (levelWeight[b.lvl] || 2);
      }
      if (matrixSort.key === 'lvl') {
        return matrixSort.dir === 'asc'
          ? (levelWeight[a.lvl] || 2) - (levelWeight[b.lvl] || 2)
          : (levelWeight[b.lvl] || 2) - (levelWeight[a.lvl] || 2);
      }

      if (aVal < bVal) return matrixSort.dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return matrixSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [filteredData, matrixSort]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(sortedFilteredData.length / itemsPerPage) || 1;
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedFilteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortedFilteredData]);

  const handleMatrixSort = (key) => {
    setMatrixSort({
      key,
      dir: matrixSort.key === key && matrixSort.dir === 'asc' ? 'desc' : 'asc',
    });
  };

  const getSortIcon = (currentSort, columnKey) => {
    if (currentSort.key !== columnKey) return null;
    return currentSort.dir === 'asc' ? (
      <ChevronUp className="inline w-3 h-3 ml-1" />
    ) : (
      <ChevronDown className="inline w-3 h-3 ml-1" />
    );
  };

  // ----------------------------------------
  // Summary Logic
  // ----------------------------------------
  const handleSummarySort = (key) => {
    setSummarySort({
      key,
      dir:
        summarySort.key === key && summarySort.dir === 'asc' ? 'desc' : 'asc',
    });
  };

  const summaryData = useMemo(() => {
    const counts = {};
    ALL_CATEGORIES.forEach((c) => {
      counts[c] = { category: c, total: 0, depts: {} };
      ALL_UNITS.forEach((u) => (counts[c].depts[u] = 0));
    });

    topics.forEach((row) => {
      if (!counts[row.c]) return;
      counts[row.c].total += 1;
      row.tg.forEach((dept) => {
        if (counts[row.c].depts[dept] !== undefined)
          counts[row.c].depts[dept] += 1;
      });
    });

    let summaryRows = Object.values(counts);
    summaryRows.sort((a, b) => {
      const key = summarySort.key;
      let aVal, bVal;
      if (key === 'category') {
        aVal = a.category;
        bVal = b.category;
      } else if (key === 'total') {
        aVal = a.total;
        bVal = b.total;
      } else {
        aVal = a.depts[key];
        bVal = b.depts[key];
      }

      if (typeof aVal === 'string')
        return summarySort.dir === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      return summarySort.dir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return summaryRows;
  }, [topics, summarySort, ALL_CATEGORIES]);

  let enterpriseTotal = topics.length;
  let deptGrandTotals = {};
  ALL_UNITS.forEach((u) => (deptGrandTotals[u] = 0));
  topics.forEach((row) => {
    row.tg.forEach((dept) => {
      if (deptGrandTotals[dept] !== undefined) deptGrandTotals[dept]++;
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* HEADER */}
      <header className="bg-blue-900 text-white shadow-md sticky top-0 z-[60]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <LayoutDashboard className="h-6 w-6 text-blue-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Meratus Enterprise Skill Matrix
                </h1>
                <p className="text-blue-200 text-sm">
                  Comprehensive L&D Dashboard - Cloud Synced
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex p-1 bg-blue-950 rounded-lg shadow-inner">
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'matrix'
                      ? 'bg-white text-blue-900 shadow'
                      : 'text-blue-100 hover:text-white hover:bg-blue-800'
                  }`}
                >
                  <TableProperties className="w-4 h-4 mr-2" /> Matrix
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'summary'
                      ? 'bg-white text-blue-900 shadow'
                      : 'text-blue-100 hover:text-white hover:bg-blue-800'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 mr-2" /> Summary
                </button>
              </div>

              {isAdmin ? (
                <button
                  onClick={() => setIsAdmin(false)}
                  className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
                >
                  <Unlock className="w-4 h-4 mr-2" /> Admin Active
                </button>
              ) : (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center px-3 py-2 bg-blue-800 hover:bg-blue-700 text-blue-100 text-sm font-medium rounded-lg shadow-sm transition-all border border-blue-700"
                >
                  <Lock className="w-4 h-4 mr-2" /> Edit Mode
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* DASHBOARD METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 transition hover:shadow-md">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Topics</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.length}{' '}
                <span className="text-xs font-normal text-gray-400">
                  / {topics.length}
                </span>
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 transition hover:shadow-md">
            <div className="bg-green-100 p-3 rounded-full">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {ALL_CATEGORIES.length}
              </p>
            </div>
          </div>
          {isAdmin ? (
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() =>
                  setEditingTopic({
                    t: '',
                    c: ALL_CATEGORIES[0] || 'New Category',
                    lvl: 'Intermediate',
                    s: 'Admin',
                    tg: [],
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-xl shadow-sm p-3 flex flex-col items-center justify-center transition hover:shadow-md group"
              >
                <Plus className="h-6 w-6 text-white mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white text-center">
                  Add Topic
                </p>
              </div>
              <div
                onClick={() => setShowCategoryManager(true)}
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer rounded-xl shadow-sm p-3 flex flex-col items-center justify-center transition hover:shadow-md group"
              >
                <FolderEdit className="h-6 w-6 text-white mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white text-center">
                  Categories
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 transition hover:shadow-md">
              <div className="bg-purple-100 p-3 rounded-full">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Difficulty Tracks
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {ALL_LEVELS.length}
                </p>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 transition hover:shadow-md">
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Target Departments
              </p>
              <p className="text-2xl font-bold text-gray-900">25</p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: MATRIX VIEW */}
        {/* ========================================================= */}
        {activeTab === 'matrix' && (
          <>
            {/* CONTROLS / FILTERS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 relative z-30">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-700">
                    Refine Matrix
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  {(selectedTargets.length > 0 ||
                    selectedCategories.length > 0 ||
                    selectedLevels.length > 0 ||
                    selectedSources.length > 0 ||
                    searchTerm) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedTargets([]);
                        setSelectedCategories([]);
                        setSelectedLevels([]);
                        setSelectedSources([]);
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center"
                    >
                      <FilterX className="w-3 h-3 mr-1" /> Reset Filters
                    </button>
                  )}
                  <div className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 py-1.5 px-3 rounded-full border border-blue-100">
                    <Info className="h-4 w-4 mr-1.5" /> Scroll table right to
                    view all 25 SBU/SFU columns
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Search Keywords
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <MultiSelectDropdown
                  title="Applicable To"
                  options={ALL_UNITS}
                  selectedOptions={selectedTargets}
                  setSelectedOptions={setSelectedTargets}
                  icon={Target}
                />
                <MultiSelectDropdown
                  title="Skill Category"
                  options={ALL_CATEGORIES}
                  selectedOptions={selectedCategories}
                  setSelectedOptions={setSelectedCategories}
                  icon={LayoutDashboard}
                />
                <MultiSelectDropdown
                  title="Difficulty"
                  options={ALL_LEVELS}
                  selectedOptions={selectedLevels}
                  setSelectedOptions={setSelectedLevels}
                  icon={GraduationCap}
                />
                <MultiSelectDropdown
                  title="Originated By"
                  options={ALL_SOURCES}
                  selectedOptions={selectedSources}
                  setSelectedOptions={setSelectedSources}
                  icon={BookOpen}
                />
              </div>
            </div>

            {/* 25-COLUMN DATA TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
              <div className="overflow-x-auto custom-scrollbar max-h-[800px] overflow-y-auto relative">
                <table className="min-w-max w-full divide-y divide-gray-200">
                  <thead className="bg-slate-100">
                    <tr>
                      {isAdmin && (
                        <th className="sticky top-0 left-0 bg-slate-100 z-[45] px-3 w-16 border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb]"></th>
                      )}
                      <th
                        onClick={() => handleMatrixSort('c')}
                        className={`sticky top-0 ${
                          isAdmin ? 'left-[64px]' : 'left-0'
                        } bg-slate-100 z-40 px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb] cursor-pointer hover:bg-slate-200 transition-colors`}
                        style={{ width: '280px', minWidth: '280px' }}
                      >
                        Category {getSortIcon(matrixSort, 'c')}
                      </th>

                      <th
                        onClick={() => handleMatrixSort('t')}
                        className="sticky top-0 bg-slate-100 z-40 px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-slate-200 transition-colors"
                        style={{
                          left: isAdmin ? '344px' : '280px',
                          width: '400px',
                          minWidth: '400px',
                        }}
                      >
                        Training Topic {getSortIcon(matrixSort, 't')}
                      </th>

                      <th
                        onClick={() => handleMatrixSort('lvl')}
                        className="sticky top-0 bg-slate-100 z-30 px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-36 cursor-pointer hover:bg-slate-200 transition-colors"
                      >
                        Difficulty {getSortIcon(matrixSort, 'lvl')}
                      </th>

                      <th
                        onClick={() => handleMatrixSort('s')}
                        className="sticky top-0 bg-slate-100 z-30 px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 w-56 cursor-pointer hover:bg-slate-200 transition-colors"
                      >
                        Originated By {getSortIcon(matrixSort, 's')}
                      </th>

                      {DEPT_INFO.map((dept) => (
                        <th
                          key={dept.abbr}
                          title={dept.full}
                          className="sticky top-0 bg-slate-100 z-30 px-2 py-3 text-center border-r border-gray-200 w-16"
                        >
                          <div className="flex flex-col items-center justify-center space-y-1.5">
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                                dept.type === 'SBU'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {dept.type}
                            </span>
                            <span
                              className="text-[11px] font-extrabold text-gray-800"
                              style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                                height: '60px',
                              }}
                            >
                              {dept.abbr}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.length > 0 ? (
                      currentData.map((row, idx) => (
                        <tr
                          key={row.id}
                          className="hover:bg-blue-50 transition-colors group"
                        >
                          {isAdmin && (
                            <td className="sticky left-0 bg-white group-hover:bg-blue-50 z-20 px-2 py-4 align-top border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb] w-16 text-center">
                              <div className="flex justify-center space-x-1">
                                <button
                                  onClick={() => setEditingTopic(row)}
                                  className="text-gray-400 hover:text-blue-600 transition p-1 rounded hover:bg-blue-100"
                                  title="Edit Topic"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteTopic(row.id)}
                                  className="text-gray-400 hover:text-red-600 transition p-1 rounded hover:bg-red-100"
                                  title="Delete Topic"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}

                          <td
                            className={`sticky ${
                              isAdmin ? 'left-[64px]' : 'left-0'
                            } bg-white group-hover:bg-blue-50 z-20 px-5 py-4 align-top border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb] cursor-pointer hover:bg-blue-100 transition`}
                            style={{ width: '280px', minWidth: '280px' }}
                            onClick={() => setViewingCategory(row.c)}
                          >
                            <div className="flex flex-col items-start gap-1">
                              <span className="text-[13px] font-bold text-blue-900 leading-snug hover:underline decoration-blue-300 underline-offset-2">
                                {row.c}
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium flex items-center">
                                <Info className="w-3 h-3 mr-1" /> View Details
                              </span>
                            </div>
                          </td>

                          <td
                            className="sticky bg-white group-hover:bg-blue-50 z-20 px-5 py-4 align-top border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                            style={{
                              left: isAdmin ? '344px' : '280px',
                              width: '400px',
                              minWidth: '400px',
                            }}
                          >
                            <span className="text-[13px] font-semibold text-gray-800 leading-snug">
                              {row.t}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs text-gray-700 align-top border-r border-gray-200">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                                row.lvl === 'Advance'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : row.lvl === 'Intermediate'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`}
                            >
                              {row.lvl}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-[11px] text-gray-500 align-top border-r border-gray-300 font-medium leading-relaxed">
                            {row.s.split(', ').map((source, i) => (
                              <span
                                key={i}
                                className="inline-block bg-gray-100 px-1.5 py-0.5 rounded mr-1 mb-1 border border-gray-200 text-gray-600"
                              >
                                {source}
                              </span>
                            ))}
                          </td>

                          {DEPT_INFO.map((dept) => {
                            const isApplicable = row.tg.includes(dept.full);
                            return (
                              <td
                                key={dept.abbr}
                                className={`px-2 py-4 text-center align-middle border-r border-gray-100 transition-colors ${
                                  isApplicable
                                    ? 'bg-green-50/40 group-hover:bg-green-100/50'
                                    : ''
                                }`}
                              >
                                {isApplicable ? (
                                  <div className="flex justify-center">
                                    <div className="h-5 w-5 bg-green-500 rounded flex items-center justify-center shadow-sm">
                                      <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-200"></div>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={29}
                          className="px-6 py-16 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Search className="h-10 w-10 text-gray-300 mb-3" />
                            <p className="text-lg font-medium">
                              No training topics found matching your criteria.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6 relative z-30">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * itemsPerPage,
                            filteredData.length
                          )}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">
                          {filteredData.length}
                        </span>{' '}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LEGEND */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500 bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative z-0">
              <div className="w-full font-bold text-gray-700 mb-1 border-b pb-2 uppercase tracking-wider text-[10px]">
                Department Abbreviations Legend
              </div>
              {DEPT_INFO.map((dept) => (
                <div
                  key={dept.abbr}
                  className="flex items-center space-x-1.5 w-40"
                >
                  <span
                    className={`px-1 rounded text-[9px] font-bold ${
                      dept.type === 'SBU'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {dept.type}
                  </span>
                  <span className="font-bold">{dept.abbr}:</span>
                  <span className="truncate" title={dept.full}>
                    {dept.full}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: DEPARTMENT SUMMARY DASHBOARD */}
        {/* ========================================================= */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
            <div className="bg-slate-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <BarChart2 className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Category Distribution by Department
                  </h2>
                  <p className="text-xs text-gray-500">
                    Volume of unique training topics mapped across the
                    enterprise. Click headers to sort.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar max-h-[750px] overflow-y-auto relative">
              <table className="min-w-max w-full divide-y divide-gray-200">
                <thead className="bg-white sticky top-0 z-30 shadow-sm">
                  <tr>
                    <th
                      onClick={() => handleSummarySort('category')}
                      className="sticky left-0 bg-white z-40 px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb] cursor-pointer hover:bg-slate-50 transition-colors"
                      style={{ width: '320px', minWidth: '320px' }}
                    >
                      Granular Category {getSortIcon(summarySort, 'category')}
                    </th>
                    <th
                      onClick={() => handleSummarySort('total')}
                      className="sticky bg-slate-100 z-40 px-4 py-4 text-center text-xs font-extrabold text-blue-900 uppercase tracking-wider border-r border-gray-300 w-28 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)] cursor-pointer hover:bg-slate-200 transition-colors"
                      style={{ left: '320px' }}
                    >
                      Total {getSortIcon(summarySort, 'total')}
                    </th>

                    {DEPT_INFO.map((dept) => (
                      <th
                        key={dept.abbr}
                        title={`Sort by ${dept.full}`}
                        onClick={() => handleSummarySort(dept.full)}
                        className="px-2 py-4 text-center border-r border-gray-200 w-16 align-bottom cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex flex-col items-center space-y-2 h-24 justify-end">
                          {getSortIcon(summarySort, dept.full)}
                          <span className="text-[11px] font-extrabold text-gray-800 writing-vertical transform -rotate-180 mb-2 mt-1">
                            {dept.abbr}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                              dept.type === 'SBU'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {dept.type}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {summaryData.map((row, idx) => (
                    <tr
                      key={row.category}
                      className={`hover:bg-blue-50 transition-colors ${
                        idx % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                      }`}
                    >
                      <td
                        className="sticky left-0 bg-inherit z-20 px-6 py-3 border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb]"
                        style={{ width: '320px', minWidth: '320px' }}
                      >
                        <span
                          className="text-sm font-bold text-gray-800 cursor-pointer hover:text-blue-600 hover:underline"
                          onClick={() => setViewingCategory(row.category)}
                        >
                          {row.category}
                        </span>
                      </td>
                      <td
                        className="sticky bg-blue-50 z-20 px-4 py-3 text-center font-extrabold text-blue-900 border-r border-blue-200 text-base shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                        style={{ left: '320px' }}
                      >
                        {row.total}
                      </td>
                      {DEPT_INFO.map((dept) => {
                        const count = row.depts[dept.full];
                        return (
                          <td
                            key={dept.full}
                            className={`px-2 py-3 text-center border-r border-gray-100 text-sm font-medium ${
                              count > 0
                                ? 'text-gray-900 bg-green-50/30'
                                : 'text-gray-300'
                            }`}
                          >
                            {count > 0 ? count : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 sticky bottom-0 z-30 shadow-[0_-2px_5px_-2px_rgba(0,0,0,0.1)]">
                  <tr>
                    <td
                      className="sticky left-0 bg-slate-100 z-40 px-6 py-4 border-r border-gray-300 shadow-[1px_0_0_0_#cbd5e1]"
                      style={{ width: '320px', minWidth: '320px' }}
                    >
                      <span className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">
                        Enterprise Total
                      </span>
                    </td>
                    <td
                      className="sticky bg-blue-100 z-40 px-4 py-4 text-center font-extrabold text-blue-900 border-r border-blue-300 text-lg shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]"
                      style={{ left: '320px' }}
                    >
                      {enterpriseTotal}
                    </td>
                    {DEPT_INFO.map((dept) => (
                      <td
                        key={dept.full}
                        className="px-2 py-4 text-center border-r border-gray-300 text-sm font-extrabold text-gray-900"
                      >
                        {deptGrandTotals[dept.full]}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* Category Info Modal */}
      {viewingCategory && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
            <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Info className="w-5 h-5 mr-2" /> Category Details
              </h3>
              <button
                onClick={() => setViewingCategory(null)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {viewingCategory}
              </h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                {getDynamicCategoryDesc(viewingCategory)}
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Total Topics in Category
                  </p>
                  <p className="text-2xl font-black text-blue-700">
                    {topics.filter((t) => t.c === viewingCategory).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setViewingCategory(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100">
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Admin Unlock
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Enter the master password to unlock permanent cloud-editing
                features for the Enterprise Skill Matrix.
              </p>

              <input
                type="password"
                placeholder="Password..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full text-center text-lg px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden transform transition-all border border-gray-100">
            <div className="bg-purple-900 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center">
                <FolderEdit className="w-5 h-5 mr-2" /> Manage Categories
              </h3>
              <button
                onClick={() => {
                  setShowCategoryManager(false);
                  setCategoryToManage('');
                }}
                className="text-purple-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setCatManagerTab('details')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition ${
                  catManagerTab === 'details'
                    ? 'border-purple-600 text-purple-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Edit / Delete
              </button>
              <button
                onClick={() => setCatManagerTab('add')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition ${
                  catManagerTab === 'add'
                    ? 'border-purple-600 text-purple-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Add New
              </button>
              <button
                onClick={() => setCatManagerTab('assign')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition ${
                  catManagerTab === 'assign'
                    ? 'border-purple-600 text-purple-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Assign Topics
              </button>
            </div>

            <div className="p-6 bg-gray-50 flex-1 overflow-y-auto custom-scrollbar">
              {/* TAB 1: Edit Details */}
              {catManagerTab === 'details' && (
                <div className="max-w-lg mx-auto">
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                      Select Category to Manage
                    </label>
                    <select
                      value={categoryToManage}
                      onChange={(e) => setCategoryToManage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm mb-4 bg-white"
                    >
                      <option value="">-- Select a Category --</option>
                      {ALL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    {categoryToManage && (
                      <div className="border-t border-gray-100 pt-4 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Category Name
                          </label>
                          <input
                            type="text"
                            value={catNameInput}
                            onChange={(e) => setCatNameInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                            Description / Details
                          </label>
                          <textarea
                            rows="3"
                            value={catDescInput}
                            onChange={(e) => setCatDescInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <button
                          onClick={handleSaveCategory}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  {categoryToManage && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-red-800">
                          Danger Zone
                        </p>
                        <p className="text-xs text-red-600">
                          Delete this category. Its topics will safely move to
                          "Uncategorized".
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteCategory}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition shadow-sm whitespace-nowrap"
                      >
                        Delete Category
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Add New */}
              {catManagerTab === 'add' && (
                <div className="max-w-lg mx-auto bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        New Category Name
                      </label>
                      <input
                        type="text"
                        value={catNameInput}
                        onChange={(e) => setCatNameInput(e.target.value)}
                        placeholder="e.g., Advanced Strategic Finance"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Description / Details
                      </label>
                      <textarea
                        rows="3"
                        value={catDescInput}
                        onChange={(e) => setCatDescInput(e.target.value)}
                        placeholder="What kind of topics belong here?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <button
                      onClick={handleSaveCategory}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-sm flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Create Category
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: Assign Topics */}
              {catManagerTab === 'assign' && (
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 flex-shrink-0">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Target Category
                      </label>
                      <select
                        value={categoryToManage}
                        onChange={(e) => setCategoryToManage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                      >
                        <option value="">-- Select Category --</option>
                        {ALL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Filter Topics
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search to filter..."
                          value={assignSearch}
                          onChange={(e) => setAssignSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {categoryToManage ? (
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col min-h-[300px]">
                      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                        <span className="text-xs font-bold text-gray-600 uppercase">
                          Check topics to assign them to:{' '}
                          <span className="text-purple-700">
                            {categoryToManage}
                          </span>
                        </span>
                        <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {topicsToAssign.length} Selected
                        </span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        {topics
                          .filter(
                            (t) =>
                              t.t
                                .toLowerCase()
                                .includes(assignSearch.toLowerCase()) ||
                              t.c
                                .toLowerCase()
                                .includes(assignSearch.toLowerCase())
                          )
                          .sort((a, b) => a.t.localeCompare(b.t))
                          .map((t) => {
                            const isChecked = topicsToAssign.includes(t.id);
                            return (
                              <div
                                key={t.id}
                                onClick={() =>
                                  setTopicsToAssign(
                                    isChecked
                                      ? topicsToAssign.filter(
                                          (id) => id !== t.id
                                        )
                                      : [...topicsToAssign, t.id]
                                  )
                                }
                                className={`flex items-start p-2 rounded cursor-pointer border-b border-transparent hover:border-gray-100 ${
                                  isChecked
                                    ? 'bg-purple-50/50'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <p
                                    className={`text-sm font-semibold ${
                                      isChecked
                                        ? 'text-purple-900'
                                        : 'text-gray-700'
                                    }`}
                                  >
                                    {t.t}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    Currently in:{' '}
                                    <span
                                      className={
                                        t.c === categoryToManage
                                          ? 'text-purple-600 font-bold'
                                          : 'text-gray-500'
                                      }
                                    >
                                      {t.c}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <button
                          onClick={handleSaveAssignments}
                          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-sm flex justify-center items-center"
                        >
                          <Save className="w-4 h-4 mr-2" /> Save Bulk
                          Assignments
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 bg-white min-h-[300px]">
                      <FolderEdit className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">
                        Select a target category to start assigning topics.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editing Modal (CRUD) */}
      {editingTopic && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all border border-gray-100">
            <div className="bg-blue-900 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Edit className="w-5 h-5 mr-2" />{' '}
                {editingTopic.id
                  ? 'Edit Training Topic'
                  : 'Add New Training Topic'}
              </h3>
              <button
                onClick={() => setEditingTopic(null)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider border-b pb-2">
                  Topic Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Training Topic Name
                    </label>
                    <textarea
                      rows="2"
                      value={editingTopic.t}
                      onChange={(e) =>
                        setEditingTopic({ ...editingTopic, t: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="e.g., Engine Maintenance Overview"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Category (Create or Select)
                    </label>
                    <input
                      type="text"
                      list="category-list"
                      value={editingTopic.c}
                      onChange={(e) =>
                        setEditingTopic({ ...editingTopic, c: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <datalist id="category-list">
                      {ALL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={editingTopic.lvl}
                      onChange={(e) =>
                        setEditingTopic({
                          ...editingTopic,
                          lvl: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advance">Advance</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Originated By (Source Data)
                    </label>
                    <input
                      type="text"
                      value={editingTopic.s}
                      onChange={(e) =>
                        setEditingTopic({ ...editingTopic, s: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="e.g., Asset Charter, Logistics"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Applicable Departments ({editingTopic.tg.length})
                  </h4>
                  <button
                    onClick={() =>
                      setEditingTopic({
                        ...editingTopic,
                        tg:
                          editingTopic.tg.length === ALL_UNITS.length
                            ? []
                            : [...ALL_UNITS],
                      })
                    }
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    {editingTopic.tg.length === ALL_UNITS.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {DEPT_INFO.map((dept) => {
                    const isChecked = editingTopic.tg.includes(dept.full);
                    return (
                      <div
                        key={dept.full}
                        onClick={() => {
                          const newTg = isChecked
                            ? editingTopic.tg.filter((d) => d !== dept.full)
                            : [...editingTopic.tg, dept.full];
                          setEditingTopic({ ...editingTopic, tg: newTg });
                        }}
                        className={`flex items-center p-2 rounded-md cursor-pointer border transition-colors ${
                          isChecked
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-300 mr-2 flex-shrink-0" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-500 leading-tight">
                            {dept.abbr}
                          </span>
                          <span
                            className="text-xs font-semibold text-gray-800 truncate"
                            title={dept.full}
                          >
                            {dept.full}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-4 border-t flex justify-between items-center flex-shrink-0">
              {editingTopic.id ? (
                <button
                  onClick={() => deleteTopic(editingTopic.id)}
                  className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Topic
                </button>
              ) : (
                <div></div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setEditingTopic(null)}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveTopic(editingTopic)}
                  className="flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" /> Save to Cloud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .writing-vertical { writing-mode: vertical-rl; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `,
        }}
      />
    </div>
  );
}
