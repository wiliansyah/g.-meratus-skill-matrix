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
  Briefcase,
  SlidersHorizontal,
  CheckCircle,
  HelpCircle,
  Download
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// ==========================================
// 1. FIREBASE & CLOUD STORAGE SETUP
// ==========================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed. Ensure you have added your config.', error);
}

const appId = 'meratus-skill-matrix';

// ==========================================
// 2. EXISTING MODULES & DETAILED OBJECTIVES
// ==========================================
const RAW_EXISTING_MODULES = [
  "Action Tracker 2023", "AI Workshop - AI Implementation Use Cases", "AI Workshop - Understanding the AI Landscape 2024", "Asset & Charter", "Asset Charter - Basic Understanding Marine Insurance", "Asset Charter - Bridge Resource Management BRM", "Asset Charter - Chartering Operations", "Asset Charter - Digital Inspection and Documentation Software", "Asset Charter - Engine Component Inspection Alat Berat Alat Ringan", "Asset Charter - Hydraulic System Inspection", "Asset Charter - IMO Regulation - Marine Pollution MARPOL", "Asset Charter - IMO Regulation SOLAS", "Asset Charter - Inspeksi QSHE Alat Berat Depo", "Asset Charter - Inspeksi QSHE Alat Berat Terminal", "Asset Charter - Inspeksi QSHE Operational Trucking MJT", "Asset Charter - Inspeksi QSHE Repair Container", "Asset Charter - Inspeksi QSHE Warehouse", "Asset Charter - Inspeksi QSHE Workshop", "Asset Charter - Inspeksi Steering", "Asset Charter - Introduction to Asset Charter Business", "Asset Charter - Introduction to Chartering", "Asset Charter - ISO 9001 2015", "Asset Charter - Lifting Cargoes on Flat Rack Container", "Asset Charter - Non Vessel Asset Management Truck Trailer", "Asset Charter - Non Vessel Risk Classification Measurement", "Asset Charter - Pemahaman SMS melalui QSHE Barriers", "Asset Charter - Standar Pedoman Implementasi QSHE Non Vessel", "BA - Asset Charter Introduction to QSHE Meratus", "BA - CLC Container Repair Process", "BA - CLC MLO Depot Business Marketing Strategy", "BA - CLC Receiving Delivery and Stuffing Stripping Process at Depo", "BA - Liner Basic Container", "BA - Liner Basic Knowledge Terminal Operation", "BA - Liner Introduction to MFEC", "BA - Liner Product Knowledge Meratus Liner", "BA - Liner Service Excellence", "BA - Liner Term of Shipment", "BA - Logistics Basic Knowledge Reefer", "BA - Logistics Customs Clearance", "BA - Logistics Sea Freight Domestic", "BA - Logistics Warehouse Transport", "BA - MSM Introduction to Ship Management", "BA - MTM Heavy Equipment Maintenance", "Basic CLC - Terminal Basic Knowledge Business Process CLC Terminal", "Basic CLC Depo Management", "Basic CLC Heavy Equipment", "Basic CLC Pengetahuan Bongkar Muat", "Basic CLC Penyerahan dan Penerimaan Kontainer", "Basic CLC Repair Container", "Basic English - 16 Basic Tenses", "Basic English - Email Writing", "Basic English - Negotiation Skills", "Basic English - Preposition of Time", "Basic English - Presentation Skills", "Basic Excel Function", "Basic Logistic HS Code dan Kepabeanan", "Basic Logistic Reefer Container Handling", "Basic Logistics - Commercial Account Plan", "Basic Logistics - Commercial Basic Agency International Service", "Basic Logistics - Commercial Exim dan Incoterms", "Basic Logistics - Commercial Incoterms Logistics", "Basic Logistics - Commercial Sales Skills", "Basic Logistics - Operations Operation Monitoring System Support", "Basic Logistics - Operations SCM Profit", "Basic Logistics - P3W Sales", "Basic Logistics Account Receivable", "Basic Logistics Airfreight", "Basic Logistics Basic Knowledge Business Process Logistics", "Basic Logistics Basic LCL Less than Container Load", "Basic Logistics Basic Operation", "Basic Logistics Custom Clearence", "Basic Logistics Customer Service", "Basic Logistics Industrial Project", "Basic Logistics Pemahaman Klaim Asuransi", "Basic Logistics Quality Management System", "Basic Logistics Sea Freight", "Basic Logistics Vendor Management", "Basic Logistics Warehouse Transport", "Basic Operation 3 Port Info Ship Particular", "Basic Operation 4 Loading Unloading", "Basic Operation 5 Container Inventory Management", "Basic Operation 9 IMDG Code", "Basic Public Speaking Skills", "Basic Shipping Basic Knowledge Business Process Shipping Liner", "BPM", "BPM - Assessment for Digital Transformation", "BPM - Basic Shipping Induction Inbound and Outbound Process", "BPM - Business Process Management Framework", "BPM - Core Model Framework", "BPM - Customer Centricity in Shipping Business", "BPM - Induction to Melina System", "BPM - Management of P3W", "BPM - Project Management", "BPM - Work Load Analysis for Project", "Business Control Framework 2024", "Business Negotiation Skill Malik", "Business Presentation Skill Malik", "Business Process Modelling for Level 10 Above", "CCT Manager as A Profession Officer Level", "CLC", "CLC - Backlog Management", "CLC - Block Diagram pada System Electric", "CLC - Block Diagram pada System Engine", "CLC - Block Diagram pada System Hydraulic", "CLC - Brake System", "CLC - Cara Menggunakan Common Tool", "CLC - Daily Maintenance", "CLC - Differential Final Drive", "CLC - Electrical System", "CLC - Engine System", "CLC - Failure Analisis Report", "CLC - Hydraulic System", "CLC - Hydraulic Troubleshooting", "CLC - Karakteristik Komponen Elektrik", "CLC - Karakteristik Komponen Non Elektrik", "CLC - Maintenance Process", "CLC - Mekanik Troubleshooting", "CLC - Nama Fungsi Prinsip Kerja Komponen Engine", "CLC - Pembacaan Menu pada Monitoring System", "CLC - Penanganan Claim Container", "CLC - Pengenalan Fungsi dari Komponen Accesories", "CLC - Pengenalan Fungsi dari Komponen Electric", "CLC - Pengenalan Fungsi dari Komponen Hydraulic", "CLC - Pengenalan Fungsi dari Komponen Power Train", "CLC - Pengetahuan Forklift", "CLC - Pengetahuan Reach Stacker", "CLC - Perencanaan Kebutuhan Alat Mekanis", "CLC - Perencanaan Lay Out Depo", "CLC - Pricing Strategy", "CLC - Setting and Adjustment Major Component", "CLC - Stack Hampar Container", "CLC - Stuffing Stripping", "CLC - Teknik Dasar Pengelasan", "CLC - Teknik Lepas Pasang Komponen Electric", "CLC - Teknik Survey Quality Control", "CLC - Tyre Management", "CLC - Upload Download Program pada Unit", "CLC - Yard Management system", "CLC- Penanganan Cargo", "Code of Conduct", "Code of Conduct English Version", "Code of Conduct for Manager", "Company Profile Meratus Group", "Company Regulation 2025 - 2027 Indonesian Version", "Company Regulation 2025-2027 English Version", "Contract Management System for Level 10 Above", "Control and Monitoring Malik", "Corp Comm - Branding Development", "Corp Comm - Communication Campaign", "CorpCom", "Corporate Culture 2025", "Crewing", "Crewing - Awareness ISO 37001 2016", "Crewing - Pelatihan Audit Internal ISO 37001 2016", "Edukasi Pemilahan Sampah", "Effective Collaboration Malik", "Effective Planning Malik", "EXAMPLE Basic Container", "Fin Acc - Bills to Invoice", "Fin Acc - Vendor Invoice Acceptance", "Finance", "Finance Policy - Annual Budget", "Fraud Awareness", "GA - Vehicle Maintenance", "GA - Vehicle Selling", "GA - Vehicle Usage", "GA-Asset Property", "Good Corporate Governance 2024", "Group Policy - Authority Matrix", "Group Policy - CAPEX", "Group Policy - for Level 10 Above", "Group Policy - Management of Non-Confirmity and Improvement", "Health Talk - Hari Anak - Ready Set School 2024", "Health Talk - Pencernaan Kuat Hidup Nikmat", "Health Talk - Virus Monkeypox", "HMM", "HMM - Claim Procedure", "HMM - Stowage Cargo Overview", "How To Create Contract - TPS HMM", "HR - Aspek Normatif Hubungan Industrial", "HR - Manajemen Remunerasi", "HR - Manajemen Talenta", "HR - Melaksanakan Analisa Beban Kerja", "HR - Membangun Komunikasi Organisasi Yang Efektif", "HR - Menyusun dan Merancang Kebutuhan Pembelajaran", "HR - Menyusun Kebutuhan SDM", "HR - Menyusun Peraturan Perusahaan Perjanjian Kerja", "HR - Menyusun Uraian Jabatan", "HR - Merancang Struktur Organisasi", "HR - Merumuskan Indikator Kinerja Individu", "HR - Merumuskan Proses Bisnis dan SOP MSDM", "HR - Merumuskan Strategi Manajemen SDM", "HR - Perselisihan Hubungan Industrial", "HR - Strategic Interviewing", "HRD", "Internal Audit", "Internal Audit - Enterprise Risk Management", "Introduction to E-Pact Employee Self Service", "Introduction to HRIS Time Management Module PeopleStrong Employee Self Service", "Introduction to Manager as A Profession", "Introduction to Objectives Key Results 2024", "Introduction to PeopleStrong Learning Module", "IR Management for Level 10 Above - 2025", "IT", "IT - Agile Scrum Introduction", "IT - BitLocker Implementation Security Awareness", "IT - Cybersecurity Awareness 2023", "IT - Design System", "IT - Electronic Data Interchange Introduction", "IT - Implementation of Cast Software as Software Intelligence Automated 2023", "IT - Implementing RPA to Support The Business", "IT - Incident Response", "IT - Infrastructure and Application Modernization", "IT - Introduction to Microsoft Fabric", "IT - ISO 27001 2022", "IT - Meratus ACE Support Services", "IT - Network Operation Center Introduction", "IT - Penetration Testing", "IT - Personal Data Protection Law Things You Need to Know", "IT - Remote Monitoring System for Vessel IoT Solution", "IT - Secure Access Service Edge SASE", "IT - Security Event Analysis", "IT - Test Driven Development Introduction", "IT - Understanding Security in Development and Operations Key Insights and Considerations", "IT - UX Research", "IT- Clean Architecture Design Pattern", "Leaders Talk Artificial Intelligence", "Leaders Talk Create Value Through Integrity - 2024", "Leaders Talk Economic Outlook", "Leaders Talk Hari Anti Korupsi Sedunia", "Leaders Talk Intrapreneurship Result Oriented", "Leaders Talk Intrapreneurship Sense of Ownership", "Leaders Talk Kenali Demam Berdarah dan Pencegahannya", "Leaders Talk Lesson from Eiger - From Local to the World", "Leaders Talk Nutrition Day 2024", "Leaders Talk We Aim for Customer Excellence Collaboration", "Leaders Talk We Put People First Be A Buddy", "Legal", "Legal - Amendment to Indonesian Shipping Law 101", "Legal - Implementation of Shipping Law", "Legal - Indonesia Capital Market", "Legal - Overview of Indonesia Employment Law", "Legal - Personal Data Protection", "Legal - Teknik Merancang Kontrak", "Liner - Basic Operation Transshipment", "Liner Commercial", "Liner Commercial - Basic Shipping 07 Term of Shipment", "Liner Commercial - Basic Shipping 1 Service Excellence", "Liner Commercial - Basic Shipping 10 Liner Services", "Liner Commercial - Basic Shipping 11 Basic Container", "Liner Commercial - Basic Shipping 12 Dangerous Goods", "Liner Commercial - Basic Shipping 13 Reefer Handling", "Liner Commercial - Basic Shipping 14 Breakbulk Cargo Project", "Liner Commercial - Basic Shipping 15 Cost of Failure Branch", "Liner Commercial - Basic Shipping 16 Sales Activity Customer Profile", "Liner Commercial - Basic Shipping 2 Product Knowledge and Cargo Shipment", "Liner Commercial - Basic Shipping 3 FAQ for Customer", "Liner Commercial - Basic Shipping 4 Basic Cargo Knowledge", "Liner Commercial - Basic Shipping 6 Bill of Lading", "Liner Commercial - Basic Shipping 8 Terminal Productivity Operation Pattern", "Liner Commercial - Basic Shipping Booking Process", "Liner Commercial - Basic Shipping Incoterm 2020", "Liner Commercial - Basic Shipping Marine Insurance", "Liner Commercial - Basic Shipping Meratus Extra VAS", "Liner Commercial - Basic Shipping Pengetahuan Kepabeanan dan Exim untuk Pelayaran", "Liner Commercial - Body Language", "Liner Commercial - Business Development", "Liner Commercial - Calculate Rate Freight", "Liner Commercial - Customer Contract Key Account Management", "Liner Commercial - Decision Making Unit", "Liner Commercial - Halal Cargo Assurance", "Liner Commercial - Know Your Customer", "Liner Commercial - Marine Cargo Insurance", "Liner Commercial - SOC Business", "Liner Commercial Handling Complaint", "Liner Ops", "Liner Ops - Container Procurement Methods Overview", "Liner Ops - Eva Line Empty Evacuation Plan", "Liner Ops - IDLE Container", "Liner Ops - Imbalance Mechanism Understanding Management", "Liner Ops - MFEC Basic of Navigation Passage plan", "Liner Ops - MFEC Operational Ship Performance", "Liner Ops - MFEC Voyage Efficiency knowledge", "Liner Ops - MFEC Weather Chart and Meteorology Analysis", "Liner Ops - PI Logistic Dwelling Time and Container Cycle", "Liner Ops - Seals Container Specification Depot Operation", "Liner Ops - Ship Stability", "Liner Ops - Voyage Proforma Scheduling Introduction", "Liner Trade", "Liner Trade - 01 Route Profitability", "Liner Trade - Annual Budgeting", "Liner Trade - Contribution Margin Engine Time Charter Equivalent and VOE", "Liner Trade - Customer Segmentation", "Liner Trade - Joint Slot 2024", "Liner Trade - Slot Cost", "Liner Trade - Tier Pricing", "Logistics", "Logistics - Cargo Document Handling", "Logistics - Claim and Insurance", "Logistics - ISO License Audit Process", "Logistics - Penerapan SJPH dan Penyelia Halal", "Logistics - Petty Cash BS", "Logistics - Vendor Management Sea Freight Domestic", "Management by Objective Malik", "Managing Conflicts Malik", "Managing Conversation Malik", "Managing Meeting Malik", "Managing Superiors and Colleagues Malik", "Managing Yourself Malik", "MariApps - Plan Management System", "M-Cheetah Game 2 Socialization", "MELISA - Booking Module", "MELISA - Customer Master", "MELISA - Customer Tier Pricing DSS", "MELISA - Documentation Module", "MELISA - Invoice Data Reference", "MELISA - Invoicing Module v0", "MELISA - Node Master 2024", "MELISA - OnOff Hire Module 2024", "MELISA - Penalty Booking", "MELISA - Port Call Report 2024", "MELISA - Quick Manual Container Movement and Status", "MELISA - Rate Report", "MELISA - Rating Method", "MELISA - Service Contract", "MELISA - Surcharge 2025", "MELISA - Training for SPU", "MELISA - VAS Booking", "Meratus Academy", "Meratus s New Vision and Mission", "Module PS [Others]", "M-One Customer Journey", "M-One Induction M-One for Internal Stakeholders", "MQS P3W Awareness 2026", "MSA", "MSA - Management System Data Base PBM", "MSA - Pelatihan Dasar Pengoperasian Ruber TYRE GANTRY", "MSA - Pelatihan Dasar Pengoperasian Side Loader Single Handler", "MSA - Pelatihan Harbour Mobile Crane", "MSA - Penanganan Container", "MSA - Penanganan Reefer Container", "MSA - Penanganan Uncontainerized", "MSA - Penanggulangan Kebakaran dan Pengenalan APAR", "MSA - Pendapatan Biaya PBM", "MSA - Pengetahuan Bongkar Muat 2023", "MSA - Pengetahuan Claim PBM", "MSA - Pengetahuan Container", "MSA - Pengetahuan Stowage Plan", "MSA - Pengoperasian Dasar Ship to Shore", "MSA - Perencanaan Bongkar Muat", "MSA - Perencanaan Kebutuhan TKBM", "MSA - Perencanaan Layout CY", "MSA - Stacking Container di CY", "MSM", "MSM - Painting Maintenance", "MSM Machinery - 01 Aux Mach Fuel System - 2025", "MSM Machinery - 01 Engine Performance Normal Operation 2026", "MSM Machinery - 01 Engine Plan Fuel System", "MSM Machinery - 02 Aux Mach Charge Air System", "MSM Machinery - 02 Engine Performance Overload Engine Operation", "MSM Machinery - 02 Engine Plan Charge Scavenge Air System", "MSM Machinery - 03 Engine Performance - Function of Collecting Data", "MSM Machinery - 03 Engine Plan Compression System", "MSM Machinery - 03 Fresh Water Generator 2026", "MSM Machinery - 04 Aux Mach Refrigerator 2026", "MSM Machinery - 04 Engine Performance - Heat Balance Efficiency", "MSM Machinery - 04 Engine Plan Starting Air System 2026", "MSM Machinery - 05 Aux Mach Controllable Pitch Propeller", "MSM Machinery - 05 Engine Performance Monitoring of Engine Performance", "MSM Machinery - 05 Engine Plan Cooling System", "MSM Machinery - 06 Aux Mach Lubricating Oil System 2026", "MSM Machinery - 06 Engine Performance Low load - Slow Steaming", "MSM Machinery - 06 Engine Plan Lubricating System 2026", "MSM Machinery - 07 Aux Mach Cooling System", "MSM Machinery - 08 Aux Mach Starting System 2026", "MSM Machinery - 09 Aux Mach Purification System", "MSM Marine - 01 Safety Of Life At Sea 2026", "MSM Marine - 02 Marine Polution 2026", "MSM Marine - 03 STCW 2010 - 2026", "MSM Marine - 04 MLC 2006 - 2026", "MSM Marine - 05 ISM Code 2026", "MSM Marine - 06 ISPS Code 2026", "MSM Marine - 07 Ballast Water Management 2026", "MSM Marine - 08 Garbage Management 2026", "MSM Marine - 09 Bridge Resource Management 2026", "MSM Marine - 10 Safety Drill 2026", "MSM Marine - 12 Class Survey 13 Ship Certificates 2026", "MSM Marine - 14 Crewing Management Certificate 2026", "MSM Marine - 15 UU Pelayaran 2026", "MTM", "NOVA - User Manual Procedure", "OKR Certification Leadership and Goal Setting Module 1", "OKR Certification Leadership and Goal Setting Module 2", "OKR Certification Leadership and Goal Setting Module 3", "OKR Certification Leadership and Goal Setting Module 4", "P3W Asuransi dan Klaim V 01", "Personal Development - 15 Management Essential to Become Good Manager - 2024", "Personal Development Computer Posture", "Personal Development Etika Pergaulan", "Problem Solving Malik", "Procurement", "Procurement - Basic Knowledge", "Procurement - D365 Inventory Request dan Purchase Request", "Procurement - D365 Permintaan Pembelian Aktiva Tetap PPAT", "Procurement - D365 Request for Quotation Purchase Order", "Procurement - Distribution Management", "Procurement - Finance for Non Finance", "Procurement - Inventory Management", "Procurement - Negotiation in Procurement", "Procurement - Warehouse Management", "Procurement MSM", "Procurement MSM - Econnect Flow Functionalities", "Procurement MSM - Safety Equipment Service", "Quality Awareness", "Risk Management for Level 12 Above", "Root Cause Analysis for Level 10 Above", "Safety Leadership 2024", "Sistem Informasi Ketidaksesuaian dan Pengembangan SIKaP", "SM - Docking Contract", "SM - Docking D-12", "SM - MariApps COMPASS Change Management", "SM Docking Management - Module 1 Background and Introduction to Dry Docking", "SM Docking Management - Module 2 Project Management", "SM Docking Management - Module 3 Planning and Specification", "SM Docking Management - Module 4 Tendering for Dry Dock Work", "SM Docking Management - Module 5 Dry Dock Preparation Execution and Supervision", "SM Docking Management - Module 6 Docking Undocking and Completion of Project", "SM Workshop - Generator", "SM Workshop - Global Maritime Distress Safety System", "Sosialisasi Aktivasi Registrasi CORETAX", "Sosialisasi BPJS Kesehatan Segmen PPU", "Sosialisasi BPJS Ketenagakerjaan - Manfaat Layanan BPJS", "Stakeholder Management", "The Will to Perform Malik", "Trucking", "Trucking - Abnormality Monitoring", "Trucking - Account Payable and DC Admin", "Trucking - Account Receivable and DC Admin", "Trucking - Backlog Management", "Trucking - Basic Investigation Root Cause Analysis", "Trucking - Basic Monitoring by GPS", "Trucking - Basic Transport Analyst", "Trucking - Basic Trucking Knowledge", "Trucking - Business Offering RFQ Payment Trip Cost Fuel", "Trucking - Business Overview", "Trucking - Control Tower", "Trucking - Control Tower Reporting", "Trucking - Daily Inspection P2H", "Trucking - Database Driver Personnel Management", "Trucking - Document Control", "Trucking - Dokumen Legalitas", "Trucking - Driver Management", "Trucking - Driver Performance Evaluation", "Trucking - Driver Regulation Compliance", "Trucking - Inventory Management", "Trucking - Maintenance Planning Scheduling", "Trucking - MJT Operation Overview", "Trucking - QSHE Operational Trucking", "Trucking - Recruitment Screening Driver", "Trucking - Risk Assesment HIRADC", "Trucking - Road Hazard Mapping", "Trucking - Safety Analysis Proactive Risk Identification", "Trucking - Safety Observation Card", "Trucking - Warehouse Management", "Tutorial Pelaporan SPT Tahunan Karyawan dan Pemadanan NIK-NPWP", "Vendor Management VMT and Sales Guidance"
];
const EXISTING_CLEANED = RAW_EXISTING_MODULES.map(s => s.toLowerCase().replace(/[^a-z0-9]/g, ''));

const TOPIC_OBJECTIVES = {
  // Asset Charter
  "introduction to asset & charter business": "Understand about Asset & Charter business in summary, providing a high-level view of operations and strategic goals.",
  "non vessel asset management (truck & trailer)": "Truck Chassis & Head Specifications: Understand technical specs and compatibility for operation base. Trailer Types (Skeleton type, Flatbed, Wingbox): Understand technical specs and different function of trailer.",
  "super structure component inspection": "Understand the general step of inspection of super structure component to ensure equipment reliability and safety.",
  "engine component inspection": "Understand the general step of inspection of engine component to prevent failure and extend asset lifecycle.",
  "sale & disposal process": "Asset Disposal Criteria & Decision Making: Understand which assets qualify for disposal and the decision process. Sale Option vs Scrap vs Reuse. Documentation & Accountable compliance.",
  "imo regulation - solas": "Have strong baseline of maritime regulations regarding the Safety of Life at Sea to ensure full compliance.",
  "imo regulation - marine pollution": "Have strong baseline of maritime regulations (MARPOL) to prevent environmental hazards and comply with international laws.",
  "imo regulation - colreg": "Have strong baseline of maritime regulations regarding Collision Regulations to maintain navigational safety.",
  "brm (bridge resource management)": "Have knowledge to execute inspection and utilize Bridge Resource Management principles effectively.",
  "erm (engine resource management)": "Have knowledge to execute inspection and utilize Engine Resource Management to optimize engine room operations.",
  "use of digital inspection & documentation software": "Menggunakan aplikasi digital untuk inspeksi dan laporan (misalnya software Class, Safety Management Systems) & mampu menyusun laporan secara standar.",
  "engine performance knowledge": "Ability to analyze if vessel is underperforming or running inefficiently through comprehensive data tracking.",
  "regulatory compliance": "Understanding Regulatory requirement related to environment such as EEXI, CII, EU ETS, EU/UK MRV, SEEMP.",
  "vessel reporting system": "Understanding data flow from Meratus reporting system such as DNA, M-vision, and ensuring proper data base for consumption & emission.",
  "overview chartering business": "Understanding overview of Chartering business related to vessel speed, consumption, reporting, and performance related to TCD.",
  "retrofit/ optimization project": "Ability to assess & analyze suitability of Retrofitting/Optimization potential for fleet modernization.",
  "fraud awareness": "Understanding gap and potential for fuel theft/fraud and implementing proactive monitoring strategies.",
  "lesson learned": "Identify critical incidents, decisions, and turning points during project execution; Evaluate past project outcomes to distinguish between root causes of success and failure.",
  "budgeting, cost control & market analysis": "Identify potential all cost in SnP in order to select most efficient way for delivery and implement cost control to monitor expenditures.",
  "reflagging and change of ownership": "Ensuring the effectiveness of process of reflagging and change of ownership by managing every step and compliance to all regulation.",
  "moa : clauses, negosiation": "Evaluate and negotiate the terms and conditions of the Memorandum of Agreement (MoA) to ensure alignment with company policies.",
  "ism code": "Pemahaman komprehensif terkait ISM Code untuk memastikan keselamatan maritim dan pencegahan polusi.",
  "iso 9001 - quality management": "Pemahaman QMS (Quality Management System) untuk standarisasi mutu layanan dan proses bisnis perusahaan.",
  "iso 45001 - safety & health management": "Pemahaman OHSMS (Occupational Health and Safety Management Systems) guna menjamin lingkungan kerja yang aman.",
  "iso 14001 - environment management": "Pemahaman EMS (Environmental Management Systems) untuk meminimalisir dampak lingkungan dari operasional.",
  "iso 28001 - supply chain": "Pemahaman Supply Chain Security Management Systems untuk melindungi rantai pasok maritim.",
  "contractor safety management system": "Pemahaman persyaratan CSMS untuk memastikan kontraktor bekerja sesuai standar keselamatan Meratus.",
  "new building management": "Understand how to establish and maintain a highly efficient, secure, and sustainable building management system.",
  "basic understanding of marine insurance": "Understanding the role of H&M and P&I Insurance and how operational actions might affect insurance claims or liabilities.",
  "commercial chartering & business development": "Market research & Data Analytics: Conducting effective market research and applying data analytics techniques to support strategic decision-making.",
  "charter party agreement": "Understand party agreement in term of their structure, key clauses, legal implications, and operational impact.",
  "tender management": "Essential knowledge and practical skills to manage the tendering process effectively, from preparation to contract award.",
  "voyage estimation": "Able to perform accurate voyage estimations, including cost analysis, fuel consumption, port charges, and time calculations.",
  "cargo stowage & stability": "Get solid understanding of ship stability principles, including factors affecting stability, methods of calculation, and regulatory requirements.",
  "cargo lifting & securing": "Lifting Calculation & Rigging Arrangement Plan: Understand how to perform accurate lifting calculations and develop safe rigging arrangement plans.",
  "dg cargo handling": "Understanding of DG classification, packaging, labeling, documentation, and emergency response procedures (IMDG Code).",
  "chartering operations": "Basic Operation Management : Understand basic activities of operations i.e loading/unloading, shipping document, bunker process, agency, reefer.",

  // Liner / Trade / Commercial
  "liner services": "Understand Liner Services, Routes, and network coverage capabilities within the Meratus ecosystem.",
  "basic container": "Understand definition, types, function, and cost implications of standard and specialized Containers.",
  "product knowledge reefer & reefer handling": "Understand technical specifications, temperature controls, and proper handling procedures for Reefer cargo.",
  "time charter equivalent": "Understand definition and Concept of Time Charter Equivalent (TCE) for evaluating vessel profitability.",
  "bill of lading": "Understand Inbound, Outbound Manifest, Clearance Document, and legal standing of the Bill of Lading.",
  "incoterm liner (2020)": "Understand International Commercial Terms in Shipping Industry and their risk/cost transfer points.",
  "service excellence": "Understand the importance of Service Mindset - Service Orientation and implement Service Excellence to Customers.",
  "pricing management": "Understand definition, business process, and pricing management, segmentation, tier pricing (freight, surcharge).",
  "route profitability": "Understand component and how to calculate Route Profitability to ensure sustainable and high-margin operations.",
  "shorterm pricing & long-term pricing trade off": "Understand and able to define pricing strategy both short and long term to optimize yield and market share.",
  "vsa cooperation": "Understand how to design a Vessel Sharing Agreement (VSA) based on competition, market, and legal agreements with partners.",
  "competitor's analysis": "Understand the scope of competition level in every service & route in term of capacity, market share, rate, volume.",

  // Logistics / Terminal / CLC / Trucking
  "business process management logistics": "Understanding MGLog business process from end-to-end to ensure smooth service delivery.",
  "product mglog - sea freight domestic": "Understanding basic knowledge, routing, and commercial models about Sea Freight Domestic product.",
  "p3w sales": "Understanding Policy, Process, Procedure & Working Instruction governing Sales operations and compliance.",
  "tender management & strategy": "Understanding strategic approaches and competitive positioning to successfully win and execute tenders.",
  "type of terminal": "Understanding of type terminal, classification, and function: Container, Multipurpose, Conventional / Traditional.",
  "terminal crane working plan": "Understanding of Crane Working Plan (CWP) process: Stowage Instruction, Crane Intensity, Deployment, and maximizing efficiency.",
  "terminal berthing allocation": "Understanding of Berthing Allocation: Service schedule vessel classification, proforma planning, and QA assignments.",
  "idle container": "Understanding Importance of FIFO concept to reduce container idle across all areas and analyzing associated costs.",
  "depot and trucking management": "Understanding how to manage Vendor Depot and Trucking, relocation process, and measuring vendor SLA/SLG.",
  "port info & port restriction": "Understand Port Info to support safe, efficient, and well-planned vessel operations based on each port's unique characteristics.",
  "bunker quantity survey": "Carry out bunker tank measurement using proper methods (sounding, MFM) to verify actual quantity and minimize disputes.",
  "pengetahuan depo": "Memberikan pemahaman dasar tentang fungsi, struktur, dan proses kerja harian di depo kontainer.",
  "pengetahuan stuffing / stripping": "Memahami proses pemuatan (stuffing) dan pembongkaran (stripping) kontainer sesuai standar operasional yang aman.",
  "yard management system": "Memahami sistem manajemen lapangan kontainer (YMS) untuk meningkatkan produktivitas dan ketertelusuran unit.",
  "pengetahuan repair container": "Memberikan pemahaman dasar tentang jenis-jenis kerusakan kontainer dan prosedur perbaikannya sesuai standar industri.",
  "iicl": "Memahami standar perbaikan kontainer berstandar internasional berdasarkan pedoman Institute of Container Lessors (IICL).",
  "safety operation and mechanical awareness (soma) ertg": "Meningkatkan pemahaman keselamatan dan prinsip dasar mekanikal pada pengoperasian alat berat ERTG.",
  "maintenance management": "Meningkatkan kemampuan mengelola kegiatan pemeliharaan alat berat secara sistematis, terencana, dan cost-efficient.",
  "order management": "Memahami proses order management (TMS) mulai dari penerimaan sampai dengan penyelesaian order dan validasi.",
  "claim handling": "Memahami proses penanganan claim muatan mulai dari kejadian, investigasi, pengumpulan data hingga penyelesaian.",
  "driver performance & evaluation": "Memahami standard operasional untuk dapat memberikan penilaian kinerja dan evaluasi komprehensif bagi driver.",
  "profitability analysis (route classification)": "Memahami cara menganalisa profitabilitas per rute secara presisi untuk optimalisasi marjin operasi Trucking.",
  "tyre management": "Memahami pengelolaan ban truk/alat berat mulai dari pengadaan, penyimpanan, perawatan, hingga proses disposal.",

  // Corporate (Finance, HRD, IT, BPM, Legal)
  "business process management framework": "Understanding the BPM lifecycle and its strategic role in driving operational improvements and standardization.",
  "customer centric in shipping business": "Aligning shipping services and processes with customer needs to enhance satisfaction and loyalty in a competitive market.",
  "project management": "Knowledge of project lifecycle stages and techniques for managing time, scope, resources, and risk effectively.",
  "branding guideline": "Equip participants with a comprehensive understanding of the organization’s brand identity, values, and visual standards.",
  "crisis communication": "Prepare participants to effectively manage and communicate during organizational crises to protect reputation and trust.",
  "d365 introduction for new joiner - accounting & reporting": "To give understanding the GL module of Microsoft Dynamics 365 and related Accounting & Reporting functions.",
  "advance accounting - consolidation": "Obtaining an understanding of principle in consolidation reporting and able to create consolidated financial statements.",
  "financial proforma analysis": "Ability to understand and grasp Proforma results to identify and prepare strategies that affect better financial outcomes.",
  "invoice processing": "Understanding of accounts payable concepts (3-way/4-way matching) and resolving invoice discrepancies efficiently.",
  "credit risk assessment & risk mitigation": "Evaluate customer creditworthiness, enforce credit controls, and optimize policies to balance risk and business growth.",
  "quality of earnings on ebitda basis": "Project specific strategic growth analysis: Potential Merger/Acquisition and Business Collaboration via financial modeling.",
  "merumuskan strategi dan kebijakan manajemen sumber daya manusia": "Memahami proses perumusan strategi dan kebijakan SDM yang selaras dan mampu mendorong pencapaian tujuan bisnis perusahaan.",
  "hr budgeting": "Mampu menyusun dan memantau anggaran SDM yang efektif dan efisien berdasarkan data dan proyeksi kebutuhan organisasi.",
  "menyusun uraian jabatan": "Mampu menyusun job description secara sistematis dan sesuai standar untuk mendukung tata kelola manajemen SDM.",
  "menyusun standar operasional prosedur (sop)": "Dapat menyusun SOP operasional rekrutmen/HR yang efektif dan efisien sebagai pedoman dan standar kerja baku.",
  "mengelola program suksesi": "Mampu menyusun dan mengelola program suksesi (Succession Planning) untuk memastikan keberlanjutan kepemimpinan organisasi.",
  "agile - scrum introduction": "Apply Scrum principles, roles, events, and artifacts to participate effectively in agile ceremonies and sprint deliveries.",
  "it audit review (cisa)": "Analyze IT controls against CISA domains, identify potential control deficiencies, and gather audit evidence for compliance.",
  "programming languages : python": "Develop, test, and debug moderately complex Python applications/scripts, applying OOP principles and API integrations.",
  "penetration testing": "Understanding penetration testing methodology and standards. Creating proactive penetration testing procedures and responses.",
  "corporate law & company secretarial": "Understanding BoD/BoC mechanisms, corporate actions, and statutory filings required by corporate law.",
  "privacy & data protection": "GDPR/PDP fundamentals; DPIA, cross-border data transfer, vendor clauses, incident response, and breach protocols.",
  "strategic sourcing": "Developing advanced strategies to source goods/services efficiently from the best suppliers while optimizing costs.",
  "request for quotation & purchase order": "Mastering the RFQ functionality to request competitive bids and effectively generating POs within the procurement system."
};

// ==========================================
// 3. ENTERPRISE ARCHITECTURE
// ==========================================
const SBUS = [
  'Asset Charter', 'Drybulk', 'Liner Commercial', 'Liner International',
  'Liner Ops', 'Liner Trade', 'Logistics', 'HMM', 'Crewing', 'MSM',
  'Workshop', 'CLC', 'MSA', 'OJA', 'Trucking',
];
const SFUS = [
  'BPM', 'CorpCom', 'Finance', 'GA Asset Property', 'HRD',
  'Internal Audit', 'IT', 'Legal', 'Procurement', 'Procurement MSM',
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
  'Vessel Chartering & Asset Mgt': 'Focuses on strategic chartering, asset lifecycle management, fleet commercial operations, and MoU negotiations.',
  'Marine Engineering & Maintenance': 'Covers technical inspection, maintenance, troubleshooting, and overhaul of marine engines, vessel superstructures, and components.',
  'Marine QSHE, Safety & Compliance': 'Encompasses maritime safety regulations (SOLAS, MARPOL), incident investigation, risk mapping, and safety management systems.',
  'Asset & Fleet Management': "Strategies and processes for managing the company's fixed assets, vehicle fleets, and vessel disposal/sale.",
  'Vessel Operations & Performance': 'Focuses on daily vessel operations, fuel/bunker management, voyage optimization, stowage planning, and performance analytics.',
  'IT Engineering, Security & Architecture': 'Covers software development, network infrastructure, cybersecurity, cloud architecture, and data engineering.',
  'Corporate Finance, Tax & Reporting': 'Includes advanced financial modeling, budgeting, taxation, consolidated reporting, and cash flow management.',
  'Corporate Legal & Governance': 'Covers corporate law, regulatory compliance, contract management, dispute resolution, and insurance claim handling.',
  'Chartering & Commercial Shipping': 'Focuses on maritime trade terms, voyage estimation, tender management, and managing commercial shipping contracts.',
  'Ship Management & Technical Ops': 'Involves dry-docking processes, new building projects, technical ship specifications, and shipyard coordination.',
  'Drybulk Operations & Commercial': 'Specialized training for Drybulk and Tug & Barge operations, including transloading, bulk cargo handling, and specific MDM business processes.',
  'Liner Commercial & Account Mgt': 'Focuses on liner sales, pricing management, customer relations, complaint handling, and CRM operations.',
  'Logistics & Forwarding Operations': 'Covers end-to-end logistics, customs clearance, freight forwarding (Air/Sea), and related documentation (Bills of Lading).',
  'Liner Trade & Pricing Strategy': 'Advanced topics on route profitability, vessel slot agreements (VSA), yield management, and TCE analysis.',
  'Liner Network & International Ops': 'Focuses on international deployment, competitor analysis, international agency management, and network design.',
  'Container Depot & Repair Operations': 'Operations related to container stripping/stuffing, yard management, IICL repair standards, and reefer PTI.',
  'Terminal & Port Operations': 'Focuses on port restrictions, berth allocation, stevedoring processes, and terminal performance monitoring (BOR/YOR).',
  'Working Capital, AR/AP & Treasury': 'Covers operational finance, invoice processing, days sales outstanding (DSO), and vendor payment procedures.',
  'Agency Operations (HMM)': 'Specific processes for managing principal agency operations, documentation, and manifest handling for HMM.',
  'Crew Management & Development': 'Focuses on MLC regulations, seafarer recruitment, payroll, emergency response for crew, and MariApps crewing systems.',
  'Workshop Fabrication & Heavy Maintenance': 'Covers advanced welding, carpentry, heavy component overhauls, and production planning (PPIC) within workshops.',
  'Heavy Equipment & Maintenance': 'Focuses on the safe operation and mechanical maintenance (SOMA) of heavy equipment like RTG, Reach Stackers, and Forklifts.',
  'Terminal, Stevedoring & HE Ops': 'Integrated operations for terminal cargo handling, ship stability during loading, and heavy equipment orchestration.',
  'Trucking & Land Transport': 'Covers order management, TMS applications, driver route planning, GPS abnormality tracking, and fleet dispatch.',
  'Human Resources & Talent Management': 'Encompasses organizational design, talent acquisition, remuneration, industrial relations, and HR data analytics.',
  'Business Process Management (BPM)': 'Focuses on process optimization (BPMN), agile methodologies, change management, and project tracking.',
  'Corporate Communications & GA': 'Covers branding guidelines, internal/external communication, facility management, and general affairs.',
  'Internal Audit & Compliance': 'Focuses on risk-based auditing, fraud detection, procedural compliance, and enterprise risk management.',
  'Procurement & Vendor Management': 'Covers strategic sourcing, vendor performance reviews, P2P processes, and e-procurement systems (D365/MariApps).',
};

// ==========================================
// 4. INTELLIGENT COMPRESSED DATA ENGINE
// ==========================================
const TAG_MAPPING = {
  ALL: ALL_UNITS,
  MARINE: ['Asset Charter', 'Drybulk', 'Liner Ops', 'MSM', 'Crewing', 'Liner Commercial', 'Liner International', 'Liner Trade', 'Internal Audit'],
  TERMINAL: ['Liner Ops', 'CLC', 'MSA', 'OJA', 'Logistics', 'Internal Audit', 'Finance', 'IT'],
  LOGISTICS: ['Logistics', 'Trucking', 'HMM', 'CLC', 'Finance', 'IT', 'Internal Audit'],
  TECH: ['Workshop', 'MSM', 'CLC', 'MSA', 'OJA', 'Trucking', 'Procurement MSM', 'Asset Charter'],
  CORP: ['BPM', 'CorpCom', 'Finance', 'GA Asset Property', 'HRD', 'Internal Audit', 'IT', 'Legal', 'Procurement'],
  COMMERCIAL: ['Liner Commercial', 'Liner International', 'Liner Trade', 'Drybulk', 'Asset Charter', 'HMM', 'Logistics'],
};

function buildSeed(category, dataString, source) {
  const topics = dataString.split('|');
  const targets = new Set([source]);
  const tags = [];

  if (source === 'Asset Charter') tags.push('COMMERCIAL', 'TECH', 'MARINE', 'Legal', 'Finance');
  if (source === 'Drybulk') tags.push('COMMERCIAL', 'MARINE', 'Finance', 'TERMINAL');
  if (source === 'Liner Commercial' || source === 'Liner Trade' || source === 'Liner International')
    tags.push('COMMERCIAL', 'Finance', 'MARINE', 'LOGISTICS', 'TERMINAL');
  if (source === 'Logistics' || source === 'Trucking') tags.push('LOGISTICS', 'COMMERCIAL', 'Finance');
  if (source === 'CLC' || source === 'MSA' || source === 'OJA') tags.push('TERMINAL', 'TECH', 'LOGISTICS');
  if (source === 'MSM' || source === 'Workshop') tags.push('TECH', 'MARINE');
  if (source === 'IT' || source === 'Finance' || source === 'HRD' || source === 'Legal' || source === 'BPM')
    tags.push('CORP');

  tags.forEach((tag) => {
    if (TAG_MAPPING[tag]) TAG_MAPPING[tag].forEach((t) => targets.add(t));
    else targets.add(tag);
  });

  return topics.map((topic) => {
    let track = 'Intermediate'; 
    let funcType = 'Operations'; 

    const t = topic.toLowerCase();
    const c = category.toLowerCase();
    const s_lower = source.toLowerCase();
    const combined = `${c} ${t} ${s_lower}`;
    
    // LEVEL CLASSIFICATION
    const advanceKeywords = ['advance', 'strategic', 'modeling', 'governance', 'due diligence', 'route profitability', 'leadership', 'masterclass', 'expert', 'forecasting', 'optimization'];
    const basicKeywords = ['basic', 'introduction', 'induction', 'overview', 'awareness', 'fundamental', 'pengenalan', 'dasar', 'general', 'concept', 'guideline', 'understanding', 'memahami', 'mengenal', 'knowledge'];

    if (advanceKeywords.some((k) => combined.includes(k))) track = 'Advance';
    else if (basicKeywords.some((k) => combined.includes(k))) track = 'Basic';

    // FUNCTION CLASSIFICATION
    const devKeywords = [
      'strategy', 'strategi', 'development', 'pengembangan', 'design', 'desain', 'architecture', 'arsitektur',
      'planning', 'perencanaan', 'analytic', 'analisa', 'analysis', 'research', 'riset',
      'optimization', 'optimalisasi', 'project', 'proyek', 'merumuskan', 'menyusun', 'merancang',
      'leadership', 'talent', 'suksesi', 'competency', 'kompetensi', 'evaluation', 'evaluasi',
      'route profitability', 'pricing management', 'network design', 'budgeting & forecasting',
      'feasibility', 'business plan', 'ui/ux', 'programming', 'developer', 'software testing',
      'agile', 'scrum', 'data modeling', 'machine learning', 'artificial intelligence', 'tce analysis',
      'pnl analysis', 'competitor', 'cost control', 'cost analysis'
    ];

    const adminKeywords = [
      'admin', 'administrasi', 'finance', 'financial', 'tax', 'pajak', 'pph', 'reporting', 'laporan',
      'legal', 'hukum', 'governance', 'compliance', 'kepatuhan', 'audit', 'iso', 'qshe', 'hse',
      'document', 'dokumen', 'manifest', 'billing', 'invoice', 'tagihan', 'receivable', 'payable',
      'ar & ap', 'ap/ar', 'treasury', 'claim', 'klaim', 'insurance', 'asuransi', 'payroll', 'penggajian',
      'bpjs', 'jaminan sosial', 'procurement', 'purchasing', 'vendor management', 'contract', 'kontrak',
      'inventory', 'warehouse', 'stock', 'customs', 'kepabeanan', 'license', 'lisensi', 'halal',
      'petty cash', 'reconciliation', 'rekonsiliasi', 'dso', 'dpo', 'legalitas', 'secretary', 'regulation', 'regulasi'
    ];

    if (devKeywords.some(k => combined.includes(k))) funcType = 'Development';
    else if (adminKeywords.some(k => combined.includes(k))) funcType = 'Administration';

    if (source === 'HRD') {
      if (t.includes('merumuskan') || t.includes('menyusun') || t.includes('merancang') || t.includes('talent') || t.includes('suksesi') || t.includes('competency') || t.includes('evaluasi') || t.includes('design')) funcType = 'Development';
      else if (t.includes('administrasi') || t.includes('payroll') || t.includes('tax') || t.includes('bpjs') || t.includes('jaminan sosial') || t.includes('data') || t.includes('perjalanan')) funcType = 'Administration';
      else funcType = 'Operations';
    }
    if (source === 'IT') {
      if (c.includes('support') || t.includes('support') || t.includes('troubleshoot') || t.includes('monitoring') || t.includes('incident')) funcType = 'Operations';
      else if (t.includes('audit') || t.includes('policy') || t.includes('governance') || t.includes('management system') || t.includes('cisa')) funcType = 'Administration';
      else funcType = 'Development';
    }
    if (['Finance', 'Legal', 'Internal Audit', 'Procurement', 'Procurement MSM'].includes(source)) {
      if (t.includes('analysis') || t.includes('strategy') || t.includes('budgeting') || t.includes('forecasting') || t.includes('business acumen') || t.includes('feasibility') || t.includes('sourcing')) funcType = 'Development';
      else funcType = 'Administration';
    }
    if (source === 'CorpCom') {
      if (t.includes('event') || t.includes('photographic') || t.includes('videography')) funcType = 'Operations';
      else funcType = 'Development';
    }
    if (source === 'BPM') {
      if (t.includes('sikap') || t.includes('report')) funcType = 'Administration';
      else funcType = 'Development';
    }

    const strictOps = ['handling', 'inspection', 'inspeksi', 'bongkar muat', 'maintenance', 'repair', 'stevedoring', 'soma', 'equipment', 'driver', 'trucking knowledge', 'sales activity', 'vessel operation', 'port info'];
    if (strictOps.some(k => t.includes(k))) {
      if (!['IT', 'Finance', 'Legal', 'HRD'].includes(source)) funcType = 'Operations';
    }

    // CHECK IF EXISTING IN DB
    const cleanT = t.replace(/[^a-z0-9]/g, '');
    const isExt = (cleanT.length > 3 && EXISTING_CLEANED.some(m => m.includes(cleanT) || cleanT.includes(m))) ? 'Yes' : 'No';
    
    // FETCH DESCRIPTION DICTIONARY
    const defaultDesc = `Comprehensive learning module covering standard practices, operational guidelines, and strategic applications for ${topic.toUpperCase()} within the ${category} domain.`;
    const descObj = TOPIC_OBJECTIVES[t] || defaultDesc;

    return {
      id: crypto.randomUUID(),
      c: category,
      t: topic.trim(),
      desc: descObj,
      lvl: track,
      s: source,
      tg: Array.from(targets),
      func: funcType, 
      isExt: isExt,
    };
  });
}

const seedRawData = [
  ...buildSeed('Vessel Chartering & Asset Mgt', 'Introduction to Asset & Charter Business|Sale & Disposal Process|MOA : Clauses, Negosiation|Supporting Process/ Delivery Process|SnP General/ Ship Particular|Introduction of Chartering|Commercial Chartering & Business Development|Market research & Data Analytics|Charter Party Agreement|Tender management|Customer relationship management|Feasibility Study & Business Plan|Budgeting|Negotiation|Voyage Estimation', 'Asset Charter'),
  ...buildSeed('Marine Engineering & Maintenance', 'Non Vessel Asset Management (Truck & Trailer)|Super structure Component Inspection|Engine Component Inspection|Clucth & Transmission Component Inspection|Differential & Final Drive Component Inspection|Brake System ( Pneumatic & Hydraulic ) Component Inspection|Under carriage & Tyre Component Inspection|Hydraulic Component Inspection|Electric Component Inspection|Steering Component Inspection|Attachment Component Inspection', 'Asset Charter'),
  ...buildSeed('Marine QSHE, Safety & Compliance', 'Risk Classification & Measurement|IMO Regulation - SOLAS|IMO Regulation - MARINE POLLUTION|IMO Regulation - COLREG|Crisis Management|BRM (Bridge Resource Management)|ERM (Engine Resource Management)|ISM Code|ISO 9001 - Quality Management|ISO 45001 - Safety & Health Management|ISO 14001 - Environment Management|ISO 28001 - Supply Chain|ISO 19011 - Audit Management Guidance|Internal Auditor ISM-ISPS-MLC|Incident Investigation|Emergency Preparedness|Corrective Action|Contractor Safety Management System|Pemahaman SMS melalui QSHE Barriers|Standards QSHE Non Vessel|Inspeksi QSHE Alat Berat Depo|Inspeksi QSHE Repair Container|Inspeksi QSHE Operational Depo|Inspeksi QSHE Terminal & CY|Inspeksi QSHE Alat Berat Terminal & CY|Inspeksi QSHE Operational Trucking MJT|Inspeksi QSHE Kantor & Gedung|Inspeksi QSHE Workshop|Inspeksi QSHE Warehouse', 'Asset Charter'),
  ...buildSeed('Vessel Operations & Performance', 'Use of Digital Inspection & Documentation Software|Engine Performance Knowledge|Regulatory Compliance|Analytical Tool Training|Vessel Reporting System|Overview Chartering Business|Overview Liner Business|Overview Bunkering Business Process|Overview Ship Management|Retrofit/ Optimization Project|Fraud Awareness|Overview Vessel Performance|Cargo Stowage & Stability|Cargo Lifting & Securing|Lifting Calculation & Rigging Arrangement Plan|Cargo Lashing & Seafastening Calculation|Lifting Cargoes on Flat Rack Container|DG Cargo Handling|Chartering Operations|Incoterm|Tanker Operations & Compliance|Performance and Cost Control|Fuel & Speed management & monitoring', 'Asset Charter'),
  ...buildSeed('Corporate Legal & Governance', 'Reflagging and Change of Ownership|Basic understanding of Marine Insurance|Placement process for H&M and P&I policy|Claim Handling for H&M & P&I Insurance|Basic understanding Fixed Asset Non Vessel Insurance|Placement process for Fixed Asset Non Vessel Policy|Claim Handling for Fixed Asset Non Vessel Policy|Basic understanding Marine Cargo Insurance|Claim Handling for Marine Cargo (Insurance & Non Insurance)|Basic understanding Liability Insurance in Meratus Group|Claim Handling for Liability Insurance in Meratus Group|General knowledge of maritime law|Compliance with insurance regulations|Identification of risks and preparation of risk assessment|Coordination with surveyors / adjusters|Claim Management - Claim & Legal Disputes', 'Asset Charter'),
  ...buildSeed('Ship Management & Technical Ops', 'New Building Management|New Building MOU / Contract|New Building - Design & Project Feasibility Study|New Building - Specification & Inspection', 'Asset Charter'),
  ...buildSeed('Working Capital, AR/AP & Treasury', 'AR & AP Management|Budgeting and Financial Controls', 'Asset Charter'),
  ...buildSeed('Drybulk Operations & Commercial', 'MDM Business process|Policy & Procedures Commercial Supramax|Policy & Procedures Commercial Tug & Barges|Policy & Procedures Finance & Accounting|Market research & data analytic|Charter Party Agreement|Tender management (negotiating contract)|Shipping Knowledge|Customer relationship management|Service Knowledge|Feasibility Study & Business Plan|Basic Operation Management|Intermediate Operation Management|Marine Insurance|Finance for Non Finance|Legal for Non Legal|MDM Business process Operation|Policy & Procedures Operation Supramax (Include OJT)|Policy & Procedures Operation Tug & Barges (Include OJT)|Dokumen Operasional|IMDG code|Pengetahuan Dasar Claim|Pengetahuan Bunker|Agency|Port Information|Coal Shipment|Shipping Terminology|Charter|Incoterm|Ship Particular|Shipping Regulation - ISM Regulation|Transloading Operation|Tnb Operation|Pengetahuan Barang (Bulk Cargo)|Pengetahuan Bongkar Muat (Bulk Cargo)|Pengetahuan reefer|Insurance|Fuel management|Cost Management|IMBSC Code|Agency & Stevedoring|Bulk and Breakbulk Shipment|Commercial, Chartering, Legal & Technical|Shipping Regulation|Bulk Carrier & Breakbulk Operation|Stowage Planning|Cargo Superintendent|Cost Management (DOE & VOE)|Bunker Operations|Fuel and Speed Monitoring|Vetting Inspection|Budget Management', 'Drybulk'),
  ...buildSeed('Liner Commercial & Account Mgt', 'Liner Services|Product Knowledge & Cargo Shipment (PPB)|Basic Cargo Knowledge|Basic Container|Term of Shipment|Product Knowledge Reefer & Reefer Handling|Product Knowledge - VAS|Breakbulk Cargo & Project|Time Charter Equivalent|FAQ for Customer|Pengetahuan Kepabeanan dan Exim untuk Pelayaran|Bill of Lading|Terminal Productivity and Operation Pattern|Incoterm Liner (2020)|Dangerous Goods|Cost of Failure|Booking Process|Marine Cargo Insurance|Marine Insurance|Halal Cargo Assurance|Service Excellence|Business Process Knowledge|Sales Activity & Customer Profile|Pricing Management|Customer Contract & Key Account Management|Calculate Overdimension Cargo|Calculate Rate & Freight|Account Receivable|Decision Making Unit|Body Languange|Handling Complaint|Business Development|Route Profitability|Finance for Non Finance|Advance - SOC Business', 'Liner Commercial'),
  ...buildSeed('Liner Network & International Ops', "Shorterm Pricing & Long-Term Pricing Trade Off|Resource Reshuffle: Deployment & Capacity|VSA Cooperation|Agency & Husbunding Management|Customer Segmentation|Direction Setup|Pricing Principle|Deployment|TCE Analysis|PNL Analysis|Competitor's Analysis|Route Design|Meratus Network|Contingency Plan|Incoterms 2020|Capacity Management|Cost of Failure Operation|Reefer Management|Equipment Logistic Performance|IMDG CODE|Depo Management|Bill of Lading|Documentation : Custom & Export/Import|Budget Setup|Strategy Setup|Deployment Planning|Network Design|Project Management", 'Liner International'),
  ...buildSeed('Terminal & Port Operations', 'Type of Terminal|Terminal Container Operation|Terminal Performance Indicators|Terminal Crane Working Plan|Terminal Berthing Allocation|Terminal Procurement|Terminal Cost Saving|Disbursement Account|Different Type of Equipment|Lease/Lease Purchase/One Way/Free Use Agreement|PI Logistic : Dwelling Time and Container Cycle|Imbalance Mechanism|Eva Line - Empty evacuation Plan|Idle Container|Other : seals, container spec, depot|Cost of Failure|Depot and trucking management|Repair : EOR, Claim and Productivity|Dangerous Goods (DG DESK)|Voyage Proforma & Scheduling Introduction|Port Info & Port Restriction|Berth Allocation|Slot Capacity Vessel|Vessel Info and Characteristic|Planning Center Organization|Bunker Knowledge|Bunker Operation Representative|Bunker Quantity Survey|DNA E-LPBB|FOC|Monitor and control fuel consumption in real time|Route optimization and hull cleaning|Basic of Navigation & Passage plan|Weather Chart and Meteorology analysis|Voyage Efficiency knowledge|Operational Ship Performance', 'Liner Ops'),
  ...buildSeed('Liner Trade & Pricing Strategy', 'Liner Services|Product Knowledge & Cargo Shipment (PPB)|Basic Cargo Knowledge|Basic Container|Term of Shipment|Product Knowledge Reefer & Reefer Handling|Product Knowledge - VAS|Breakbulk Cargo & Project|Time Charter Equivalent|FAQ for Customer|Pengetahuan Kepabeanan dan Exim untuk Pelayaran|Bill of Lading|Terminal Productivity and Operation Pattern|Incoterm Liner (2020)|Dangerous Goods|Cost of Failure|Booking Process|Marine Cargo Insurance|Marine Insurance|Halal Cargo Assurance|Service Excellence|Business Process Knowledge|Depo Management|Heavy Equipment|Port Information/Management|Loading Unloading|Container Inventory Management|Teknik Survey & Quality Control|Repair Container|Body Language|Handling Complaint|DMU (Decision Making Unit)|Sales Activity|SOC|Ship Particular|Ship Stability (Introduction, Technical & Calculation)|Calculate Rate & Freight|How To Do Budgeting & Forecasting|Route Profitability, CM, Ebitda|Join Slot/Vessel Slot Agreement|Pricing Management (Segmentation, Tier Pricing)|Slot Cost|TCE (Time Charter Equivalent)|Dangerous Goods|Voyage Proforma & Scheduling Introduction|Basic of Navigation & Passage plan|Voyage Efficiency knowledge', 'Liner Trade'),
  ...buildSeed('Logistics & Forwarding Operations', 'Business Process Management Logistics|Quality Management System & Business Control Framework|ISO (QSHE), License, Halal & Audit Process|Product MGLog - Sea Freight Domestic|Product MGLog - Sea Freight International|Product MGLog - Sea Freight LCL|Product MGLog - Sea Freight Reefer|Product MGLog - Air Freight|Product MGLog - Customs Clearance|Product MGLog - Industrial Project|Product MGLog - Warehouse|Commercial|Product MGLog - Agency|Branch Management|Operations: Ops Monitoring & System Support|Operations: Job Control|Operations: SCM Profit|Vendor Management - Trucking|Vendor Management - Pricing/Sea Domestic|Account Receivable (AR)|Account Payable (AP)|P3W Sales|Cost Structure & Memo Tariff|Account Management & Development Strategy|Account Plan|CSOP|Tender Management & Strategy|Selling Skill|Customer Experience|Post-Bidding Analysis|Dispute Management (AP)|Dispute Management (AR)|VMT Guidance - Trucking & Pricing|P3W Operation|Pengetahuan Container|Cargo & Document Handling|DOM & Update Milestones|Petty Cash & BS|Cargo Inventory Management|Claim Management & Insurance|Penyelia Halal Berbasis SKKNI & Penerapan SJPH|Legalitas Kontrak|Risk Management', 'Logistics'),
  ...buildSeed('Agency Operations (HMM)', 'Product Knowledge HMM ( Compass & Bussiness Process )|Export and Import CS Business process|Export Import Documentation business process|Equipment & Logistic Control|Vessel/Operation|Manifest|Container idling management|Container Maintenance & Repair Overview|Claim Procedure & Problem Solving|Product Knowledge HMM|Export and Import Overview|Equipment Overview|Ship Particular Overview|Cargo & General Stowage Overview|Maintenance and Repair Overview|Container Dwelling Control (T/S Port)|Terminal & Stowage Planning Operation|Depo & Logistic Management|Contract|Operation Management|Cost Management|Sales Product Knowledge|Sales Plan|Customer Service Dept|Operation|Marketing Information|Key Customer Management|Trade Management|Business Development', 'HMM'),
  ...buildSeed('Crew Management & Development', 'Company regulation|MLC 2006|STCW 2010|Company P3W & Culture|Crewing system (MariApps)|Crewing Management & Certificate|Business Acument|Office management|Communication skill|Penangananan insiden/ darurat untuk awak kapal|Interview skill|Negotiation skill|Training Management|Payroll|Tax (PPH 21)', 'Crewing'),
  ...buildSeed('Marine Engineering & Maintenance', '01 Aux Mach Fuel System|02 Aux Mach Charge Air System|03 Fresh Water Generator|04 Aux Mach Refrigerator|05 Aux Mach Controllable Pitch Propeller|06 Aux Mach Lubricating Oil System|07 Aux Mach Cooling System|08 Aux Mach Starting System|09 Aux mach Purification System|01 Engine Plan - Fuel System|02 Engine Plan - Charge Scavenge Air System|03 Engine Plan - Compression System|04 Engine Plan - Starting Air System|05 Engine Plan - Cooling System|06 Engine Plan - Lubricating System|01 Engine Performance - Normal Operation|02 Engine Performance - Overload Engine Operation|03 Engine Performance - Function of Collecting Data|04 Engine Performance - Heat Balance & Efficiency|05 Engine Performance - Monitoring of Engine Performance|06 Engine Performance - Low Load Slow Steaming|Safety of Life at Sea|Marine Polution|STCW 2011|MLC 2006|ISM Code|ISPS Code|Ballast Water Management|Garbage Management|Bridge Resource Management|Safety Drill|Class Survey & 13 Ship Ceritificates|Crewing Management & Certificate|15 UU Pelayaran|Internal Audit & Investigation|Introduction Insurance & Claim|Ships Construction|Background & Introduction to Dry Docking|Project Management Application in Docking|Planning & Specification|Tendering for Drydock work|Dry Dock preparation, execution & Supervision|Docking undocking & Completion of Project|Docking Contract|Docking Minus 12|Painting & Maintenance|Crew Management : Planning & Operational|MariApps - Change Management|MariApps - Plan Management System|MariApps - Accounts|MariApps - Certification|MariApps - Purchase|MariApps - LPSQ|MariApps - Quality Document Management System|MariApps - Quality Document Management System WIKI|MariApps - Drydock', 'MSM'),
  ...buildSeed('Workshop Fabrication & Heavy Maintenance', 'Welding Safety and Fundamentals|Welding Processes|Fabrication and Applications|Metallurgy and Materials|Additional Topics|Carpenter Safety and Fundamentals|Core Carpentery skills|Advanced Carpentry Skills|PPIC Safety and Fundamentals|Production Planning|Production control|Inventory control|Digital & Tools|Overhaul Safety and Fundamentals|Engine description and component|Engine system and overhaul|Gearbox and propulsion', 'Workshop'),
  ...buildSeed('Container Depot & Repair Operations', 'Pengetahuan Depo|Pengetahuan Stuffing / Stripping|Pengetahuan Penyerahan / Penerimaan Container|Pengetahuan Stack Hampar Container|Perencanaan Kebutuhan Alat Mekanis|Perencanaan Lay Out Depo|Yard management system|Pengetahuan Claim Container|Basic Sales & Selling|Pricing Strategy|Pengetahuan Repair Container|Standard Cargo Worthy|IICL|Teknik Survey & Quality Control|Teknik Repair Container|Estimate of Repair & Productivity Repair|Safety Repair Container|Pengetahuan Reefer Container|Teknis PTI|Safety Operation and Mechanical Awareness (SOMA) ERTG|SOMA Reach Stacker & Side Loader|SOMA Forklift & Forklift Loader|Maintenance Management|Tyre Management|Planning, Scheduling, dan Backlog Management|Performance Measurement & Equipment Management|Preventive Maintenance|Maintenance Budget & Cost Control|Engine System|Power Train System|Hydraulic System|Electrical System|Brake System|Steering System|Differential & Final Drive|Pengenalan Fungsi dari Komponen Engine|Pengenalan Fungsi dari Komponen Electric|Pengenalan Fungsi dari Komponen Power Train|Pengenalan Fungsi dari Komponen Accessories|Pengenalan Fungsi dari Komponen Hydraulic|Prinsip kerja berdasarkan Block Diagram pada System Engine|Prinsip kerja berdasarkan Block Diagram pada System Electric|Prinsip kerja berdasarkan Block Diagram pada System Hydraulic|Simbol & nama Komponen Electric|Simbol & nama Komponen Hydraulik|Teknik lepas & pasang komponen Electric|Teknik lepas & pasang komponen Non Electric|Prosedur Daily Maintenance|Prosedur Periodic service|Cara menggunakan common tools dengan benar|Karakteristik komponen electric|Karakteristik komponen Non electric|Teknik dasar pengelasan|Engine Troubleshooting|Hydraulik troubleshooting|Mekanik troubleshooting|Setting & Adjustment (Minor Komponen)|Prinsip kerja hydraulic system|Cara menggunakan special tools dengan benar (WI)|Wiring Diagram Hydraulic & aplikasinya di lapangan|Analisa kerusakan komponen berdasarkan hasil oil lab, cutting filter,kerusakan fisik|Diagnosis, set up, pembacaan pada system monitoring|Cara menggunakan special service tools dengan benar (unfinished)|Prosedur kalibrasi timbangan|Warehouse Management|Parts & Inventory Management|Asset Management D365', 'CLC'),
  ...buildSeed('Terminal, Stevedoring & HE Ops', 'Pengetahuan Bongkar Muat|Pengetahuan Container|Ship Particular|Stabilitas Kapal|Stowage Plan|Operational Procedure & Process|Perencanaan Receiving (Layout &  Stacking Container)|Perencanaan Bongkar Muat|Penanganan Cargo (include Container,Uncontainerized, DG, Reefer)|Pengetahuan Claim Container|Pendapatan dan Biaya Terminal|SOMA & Pengoperasian Alat Rubber Tyre Gantry|SOMA & Pengoperasian Alat Container Crane|SOMA& Pengoperasian Alat Harbour Mobile Crane|SOMA & Pengoperasian Alat Side Loader (SL)|SOMA & Pengoperasian Alat Head Truck (HT)|ISO 9001&ISO 45001 Awareness|QSHE Terminal Management|Document & Validation|Control & Monitoring|Performance Maintenance Management|Maintenance Procedure & Process|Planning & Scheduling|Budgeting & Cost control|Safety Management HE|Workshop & Tools Management|Tire Management (ALL HE)|HT Engine|HT Pneumatic|HT Starting and Charging (Electrical System)|HT Power Train (Main Clutch, Transmisi, Diffrential, Axle Shaft, Final Drive)|RTG Head Block & Spreader|RTG Hybrid System|RTG Cable Reel & AGSS System|RTG Cable Chain|RTG Control System|RTG Gantry System|RTG Hoist System|RTG Trolly System|RTG Antisway System|RTG Drive System|RTG PLC&CMS Function|STS Cable Reel|STS Spreader & Head Block|STS PLC&CMS Function|STS TLS System|STS Gantry System|STS Trolly & Fesston System|STS Hoist & Boom System|STS Drive System|STS HV Switchgear|STS Elevator System|HMC Engine|HMC Spreader|HMC Travelling System|HMC Slewing System|HMC Hoist System|HMC CMS View System|HMC PLC, Control, & Drive System|SL Engine|SL Hydraulic System|SL Starting and Charging (Electrical System)|SL Power Train|General Arrangement HT|General Arrangement RTG / ERTG|General Arrangement STS|General Arrangement SL|General Arrangement HMC|Pembacaan data SOS|Pembacaan data Program|Management Overhaul yang efektif|PPM (Program Pengecekan Mesin)|Warehouse Management (Inventory, Part)|Asset D365', 'MSA'),
  ...buildSeed('Heavy Equipment & Maintenance', 'Pengetahuan Bongkar Muat|Pengetahuan Container|Terminal Operation System|Yard Planning|Ship Particular|Ship Stability|HSE Terminal Management|Basic Operation CC|Basic Operation RMGC|Basic Operation RS|Basic Operation HT|Pre Operational Check Up|Perencanaan B/M|Penanganan Container|Equipment Documentation|Pengenalan Tools dan Penggunaannya|Pengenalan Maintenance System|Electrical Maintenance CC01-CC03|Electrical Maintenance CC04-CC07|Electrical Maintenance RMGC01-RMGC05|Electrical Maintenance RS|Electrical Maintenance HT|Mechanical Maintenance CC01-CC03|Mechanical Maintenance CC04-CC07|Mechanical Maintenance RMGC01-RMGC05|Mechanical Maintenance RS|Mechanical Maintenance HT|Warehouse Database System|Part Knowledge', 'OJA'),
  ...buildSeed('Trucking & Land Transport', 'Order Management|Order Planning and Allocation|TMS Application Knowledge (Freighthub & Davis)|Claim Handling|Land Transport Knowledge and Regulation|Cargo Handling|Accident Handling|Recruitment & screening|Driver performance & evaluation|Regulation & compliance|Data base driver and Personnel Management|RFQ handling|Handling Customer Complaint|Customer Mapping|Profitability Analysis (Route Classification)|Transport Analysis|Invoice creation|Uninvoiced|CN/DN Creation|3rd Party Reimburseable Cost|Policy AR|Replenishment & Reimbursement|Petty Cash and Cash Opname|Policy AP|Payment (Trip Cost, Fuel)|Basic Monitoring by GPS|Abnormality Monitoring|CT Reporting|Basic Maintenance Management|Product Knowledge Unit|Maintenance Planning & Schedule|Daily Inspection/P2H|Tyre Management|Asset Management di D365|Backlog Management|Proper Measurement|Maintenance cost control|Inventory Management di D365|Replenishment Min/Max Stock|Goods request/Goods Issue|Warehousing Management|Scrap Spare Parts/tyres Handling Management|Inventory Analysis|Stock Opname Circle|Risk Assessment & HIRADC|Basic Investigation & Root cause Analysis|Safety Analysis|Road Hazard Map|Safety Observation Card Knowledge|Contract Management & Legalitas|Inventory Request di D365|Legalitas Document Unit Handling|P3W Knowledge (End to End Process)|Power Querry|Trucking Knowledge|Operation Overview|Business Overview|Document Control - AP|Driver Management - Trucking|QSHE Operational Trucking', 'Trucking'),
  ...buildSeed('Business Process Management (BPM)', 'Business Process Management Framework|Basic Shipping Induction – Inbound and Outbound Process|Customer Centric in Shipping Business|Induction to Liner Business Process|Induction to Depot & Terminal Business Process|Meratus Quality System|Logistics Business Knowledge (MGLOG & MJT Business Process)|Induction to Meratus Online and M-One for Internal Stakeholder|Customer Journey with Meratus All in One (M-One)|SIKAP – How to Identify and Report in SIKAP|Change Management & Impact Assesment|Induction to MELISA Liner System|Business Process Assesment for Digital Transformation|Management of P3W|Project Management|Work Load Analysis for Project|Business Process Modeling & Notation|Core Model Framework', 'BPM'),
  ...buildSeed('Corporate Communications & GA', 'Branding Guideline|Digital Marketing|Social Media Marketing|Communication Campaign|Writing Publication|Crisis Communication|Photographic Technique|Videography Editing|Graphic Design & Tools|Event Management|Sustainability Management', 'CorpCom'),
  ...buildSeed('Corporate Finance, Tax & Reporting', 'Cash & Bank - Module|AP - Module|AR - Module|GL - Module|Fixed Asset - Module|Inventory Management - Module|Organization Administration - Module|Data Management - Module|Financial Dimension|D365 Introduction for New Joiner - Accounting & Reporting|Accounting Principle Application in Business|Basic Financial Auditing|Tax Accounting|Advance Accounting - Consolidation|Intercompany Transaction and Reconciliation (Trade Non-Trade)|Financial Proforma Analysis|Financial Audit|Basic Account Payable|Invoice processing|Data Entry and Management|Reconciliation Skills|Payment Processing|Vendor Management|Problem-Solving and communication|DPO (Days Purchase Outstanding)|Basic Collection Management|Intermediate Collection Management|Introduction to Credit Management|Credit Risk Assessment & Risk Mitigation|Receiving Payment & Fundamentals of Payment Allocation|Basics of Refund & Disbursement Processes|Review & Approval of Refunds|DSO (Days Sales Outstanding)|Account Receivable Induction|Cash & Bank Account Management|Payment Procesing System|cash management System di D365|Petty Cash module|Peran dan tanggungjawab kasir|Uang muka vendor karyawan untuk operasional|Bank Mandate ( Cash Management) di Meratus grup|Flow process ebanking Corporate Card|Selection of the bank used|Template draft of the bank guarantee used|Underlying tender/contract documents|Submission of the bank guarantee to the bank|Achieve optimum Cash capability (liquidity and solvency)|DIO (Days Inventory Outstanding)|Cash Conversion Cycle (CCC)|Proforma Financial Performance Overview|Quality of Earnings on EBITDA basis|Working Capital Analysis|Engagement to external consultant|Construct financial modelling|Cost Accounting and Variant Analysis|Revenue and Cost Driver Matching|General Finance Process & Implementation in Business Unit|General Business Financial Key Performance Indicators|General Other Business or Operational Process|Understanding Business Model and Value Chain|Operations and Finance Integration|Driving Value through Financial Insight|TCE (Timer Charter Equivalent)|Liner Cost and revenue|Logistics Business Process|Logistics System Understanding|Authority Matrix in each BU - FU|OPEX Reporting|CAPEX Reporting|Group Reporting|Budgeting & Forecasting|Cost Saving & Revenue Enhancement|Management Report|PMO Finance Scope|Tax Implications in Logistics|Ketentuan Umum Perpajakan|Omnibus Law|CFC Rules|International Tax on Shipping|Harmonisasi Peraturan Perpajakan Law|Pajak Penghasilan : Subyek Pajak dan Obyek Pajak|Personal Income Tax|Corporate Income Tax Return|Income Tax Art 21/26|Income Tax Art 23/26|Income Tax Art 4(2), 15|VAT|Offshore Transaction Tax - VAT & Art 26 (Tax Treaty)|Tax Audit|Tax Objection|Tax Appeal|Bea Materai, PBB, BPHTB|Tax on Yayasan, CSR & Donation|Cost Leadership', 'Finance'),
  ...buildSeed('Facility Mgt & General Affairs', 'Regulatory Permits & Compliance|Asset Property Management|Contract & Vendor Management|P2P & e-Procurement Process|Facility Operations|Asset & Inventory Management|Vehicle Management|Security & Emergency Response|Waste Management|Budgeting & Cost Control|Data & Reporting|Project & Change Management|Stakeholder Management', 'GA Asset Property'),
  ...buildSeed('Human Resources & Talent Management', 'Merumuskan Strategi dan Kebijakan Manajemen Sumber Daya Manusia|Merumuskan Proses Bisnis serta Tugas dan Fungsi dalam Organisasi|HR Budgeting|Business Acumen - Liner|Business Acumen - Asset & Charter, Drybulk|Business Acumen - Ship Management|Business Acumen - Logistics & Trucking|Business Acumen - Terminal|Business Acumen - Agency HMM|Business Acumen - SFU|Menyusun Design Organisasi|Menyusun Uraian Jabatan|Melaksanakan Analisis Beban Kerja|Menyusun Standar Operasional Prosedur (SOP)|Menyusun Kebutuhan SDM|Instrumen Seleksi (BEI)|Menyusun Kebutuhan Pembelajaran dan Pengembangan|Merancang Program Pembelajaran dan Pengembangan|Program Evaluasi Pembelajaran|Mengelola Program Suksesi|Competency Model|Talent Development (Intervention & Retention)|Mengelola Proses Perumusan Indikator Kinerja Individu|Menyusun Grading Jabatan|Menyusun Sistem Remunerasi|Menentukan Upah Pekerja|Menyusun Peraturan Perusahaan dan/atau Perjanjian Kerja Bersama|Menangani Keluhan Pekerja & Perilaku Disiplin|Membangun Hubungan Industri Yang Harmonis|Memfasilitasi PHK & Penyelesaian PHI|Mengelola Alih Daya|Membangun Komunikasi Organisasi yang Efektif|HR Data Analytics|Melakukan Administrasi Jaminan Sosial|Menangani Administrasi Pekerja Antar Negara|Corporate Travel|Tax / Pph 21', 'HRD'),
  ...buildSeed('Internal Audit & Compliance', 'Liner & Charter Biz Knowledge|Ship Management Biz Knowledge|Drybulk Biz Knowledge|Logistics Biz Knowledge|Trucking Biz Knowledge|Terminal Biz Knowledge|Depo CLC Biz Knowledge|Workshop Biz Knowledge|Agency Biz Knowledge|Order to Cash Cycle (All Line Business)|Bunker Management|Port & Terminal Operation|Asset Management|Expenditure Cycle (Stevedoring, P2P, etc)|Docking Management|Finance & Accounting Core Comp|Internal Control & Risk|Fraud|Risk Management|Auditing|Managing of IA Function|Code of Ethics|Strategic Planning|Corporate Governance|Liner as Principal & Agency|Logistics (MIF, MLT, & MJT)|Container Logistics Center|Fixed Assets & Inventory Control|Expenditure Cycle - Procedure to Pay|Vessel Inspection', 'Internal Audit'),
  ...buildSeed('IT Engineering, Security & Architecture', 'Agile - Scrum Introduction|Project Management Skill|IT Audit Review (CISA)|IT Risk & Governance (COBIT Foundation)|DevSecOps Generalist|CyberSecurity Awareness|IT Policies & Procedures|Great Communication Skills with Customer, Business User & other colleagues|JIRA Software (How to usage)|Programming Languages : Python|Programming Languages : Ruby|Programming Languages : Java|Programming Languages : ASP .Net C#|Programming Languages : PHP|Programming Languages : Flutter|Microsoft Dynamics 365 applications|Understanding Gitlab Repository|Understanding Clean Architecture Design|Application and Architecture Design|Application Security and OWASP|Developing and delivering using Agile methodologies|DevSecOps Advance|Familiar with RPA tools|Familiar managed RPA environment|Knowledge of Electronic Data Interchange (EDI)|Knowledge Data Modeling|Knowledge Data Transformation and ETL|Knowledge AI and Machine Learning|Structured Query Language (SQL)|Relational databases|Non-relational databases|Create Mockup Application|Research skills|IT Architecture|Documentation skills|Software Testing Skill|Creating documentation (Skenario Test)|Preparing software tests|Understanding the testing process|Composing defect reports|Analytical and logical reasoning|Automating software tests|UI/UX Design (Mobile app/web)|Design Concept|Design Styles|Design System|Layouting Design|Consistency|Design Illustration|Design Animation|Design Thinking|Graphic Design|UX Strategy and Planning|UX research|Qualitative Research|Quantitive research|Information and Architecture|UX Writing|Communication and Presenting|Design Tools UI/UX (Figma/Xd)|Design Tools Illustration Graphical|Design Tools Animation|Design Audit|Penetration Testing|NIST CYBER SECURITY Framework|ISO27001:2022|Security Events Analysis|Incident Response|IT Service Management (ITSM)|ITIL 4.0 Foundation|Microsoft 365 Support|Multi Factor Authentication (MFA) Support|Security Application Support|IP PBX Support|Knowledge of PowerShell Scripting|Knowledge Google Workspace|Networking Fundamental Support|Hardware Technical Support|Network Monitoring System|Network Incident Response|Network Troubleshooting Tools|Understanding Google and Azure Cloud Security and Operations|Architecting with Google Kubernetes Engine|Identity and Access Management|Scalability and Reliability Resources Concept|Implement and manage storage in Azure, GCP & On premise|Configure and manage virtual networks|Monitor and back up Azure & GCP resources|Virtualization VMWare|Knowledge OS Linux and Windows Server|Well Architech Framework|Knowledge Active Directory|Administration Endpoint & Email Security|Maritime Business Knowledge|Logistics Business Knowledge|Terminal and Depot Business Knowledge|Back Office Business Knowledge|Fleet Management Business Knowledge', 'IT'),
  ...buildSeed('Corporate Legal & Governance', 'Corporate Law & Company Secretarial|Corporate Governance & Board Support|Capital Markets & Disclosure|Regulatory & Licensing|Employment & Labor Law|Privacy & Data Protection|Anti-Corruption, AML & Sanctions, PPT SPM|Competition/Antitrust|Compliance Program Design & Monitoring|Ethics & Code of Conduct|Dispute Resolution & Litigation Management|Legal Research & Analysis|Legal Opinions & Memo Writing|Liner & Charter Biz Knowledge|Ship Management Biz Knowledge|Drybulk Biz Knowledge|Logistics Biz Knowledge|Trucking Biz Knowledge|Terminal Biz Knowledge|Depo CLC Biz Knowledge|Workshop Biz Knowledge|Agency Biz Knowledge', 'Legal'),
  ...buildSeed('Procurement & Vendor Management', 'Negotiation in Procurement|Vendor Management|Cost Analysis & Budgeting|Strategic Sourcing|Finance for Procurement|Stakeholder Management|Product and Product release|Buyer Group Concept|Inventory Request & Purchase Request|Request for Quotation & Purchase Order|Purchase Received|Financial dimension|Warehouse|Negotiation in Procurement MSM|Vendor Management MSM|Cost Analysis & Budgeting MSM|Strategic Sourcing MSM|Finance for Procurement MSM|Stakeholder Management MSM|Requestion process|Purchase Order Process including vessel allocation|Receiving Process|E-Connect|Product and product release MSM', 'Procurement'),
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
// 5. UI COMPONENTS
// ==========================================
const MultiSelectDropdown = ({ title, options, selectedOptions, setSelectedOptions, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (option) => {
    if (selectedOptions.includes(option)) setSelectedOptions(selectedOptions.filter((o) => o !== option));
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
          isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="flex items-center truncate">
          {Icon && <Icon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />}
          <span className="truncate text-gray-700">
            {selectedOptions.length === 0 ? `All Options` : `${selectedOptions.length} Selected`}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl top-full left-0">
          <div className="p-2 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <span className="text-xs font-semibold text-gray-500">{options.length} Options</span>
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
// 6. MAIN DASHBOARD COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedFunctions, setSelectedFunctions] = useState([]); 
  const [selectedExisting, setSelectedExisting] = useState([]); 

  // Column Visibility State
  const [hiddenCols, setHiddenCols] = useState([]);
  const [showColMenu, setShowColMenu] = useState(false);
  const colMenuRef = useRef(null);

  const MAIN_COLS = [
    { key: 'c', label: 'Category' },
    { key: 't', label: 'Training Topic' },
    { key: 'lvl', label: 'Difficulty' },
    { key: 'func', label: 'Function' },
    { key: 'isExt', label: 'Existing?' },
    { key: 's', label: 'Originated By' },
  ];

  const [matrixSort, setMatrixSort] = useState({ key: 'c', dir: 'asc' });
  const [summarySort, setSummarySort] = useState({ key: 'category', dir: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const [editingTopic, setEditingTopic] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);

  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [catManagerTab, setCatManagerTab] = useState('details'); 
  const [categoryToManage, setCategoryToManage] = useState('');
  const [catNameInput, setCatNameInput] = useState('');
  const [catDescInput, setCatDescInput] = useState('');
  const [topicsToAssign, setTopicsToAssign] = useState([]); 
  const [assignSearch, setAssignSearch] = useState('');

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

  useEffect(() => {
    if (!user || !db) return;

    // V7 forces re-seed with NEW Detailed Descriptions and Corrected Logic
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'matrixData', 'mainDoc_v7');
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          setTopics(snap.data().topics || []);
          setCategoryDetails(snap.data().categoryDetails || INITIAL_CATEGORY_DESCRIPTIONS);
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

  useEffect(() => {
    if (categoryToManage && catManagerTab === 'details') {
      setCatNameInput(categoryToManage);
      setCatDescInput(categoryDetails[categoryToManage] || '');
    } else if (catManagerTab === 'add') {
      setCatNameInput('');
      setCatDescInput('');
      setCategoryToManage('');
    } else if (catManagerTab === 'assign' && categoryToManage) {
      setTopicsToAssign(topics.filter((t) => t.c === categoryToManage).map((t) => t.id));
    }
  }, [categoryToManage, catManagerTab, categoryDetails, topics]);

  // Click outside for column menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target)) setShowColMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ALL_CATEGORIES = useMemo(() => {
    const cats = new Set(topics.map((d) => d.c));
    Object.keys(categoryDetails).forEach((c) => cats.add(c));
    return [...cats].sort();
  }, [topics, categoryDetails]);

  const ALL_LEVELS = ['Basic', 'Intermediate', 'Advance'];
  const ALL_FUNCTIONS = ['Operations', 'Development', 'Administration'];
  const ALL_EXISTING_OPTS = ['Yes', 'No'];
  const levelWeight = { Basic: 1, Intermediate: 2, Advance: 3 };

  const ALL_SOURCES = useMemo(() => {
    const sources = new Set();
    topics.forEach((t) => {
      if (t.s) t.s.split(', ').forEach((s) => sources.add(s.trim()));
    });
    return [...sources].sort();
  }, [topics]);

  const getDynamicCategoryDesc = (catName) => {
    return categoryDetails[catName] || 'Custom or newly added category containing specialized operational or strategic training topics.';
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'MeratusAcademy') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else alert('Incorrect Password');
  };

  const syncToCloud = async (newTopics, newCatDetails) => {
    if (!db) return;
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'matrixData', 'mainDoc_v7'), {
        topics: newTopics,
        categoryDetails: newCatDetails,
      });
    } catch (err) {
      console.error('Save error', err);
    }
  };

  const saveTopic = (topic) => {
    let newTopics;
    if (topic.id) newTopics = topics.map((t) => (t.id === topic.id ? topic : t));
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
        newTopics = newTopics.map((t) => (t.c === oldName ? { ...t, c: newName } : t));
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
    if (!confirm(`Delete "${categoryToManage}"? Its topics will be moved to "Uncategorized".`)) return;

    let newDetails = { ...categoryDetails };
    delete newDetails[categoryToManage];
    if (!newDetails['Uncategorized']) newDetails['Uncategorized'] = 'Topics that have lost their category mapping.';

    let newTopics = topics.map((t) => (t.c === categoryToManage ? { ...t, c: 'Uncategorized' } : t));

    setCategoryDetails(newDetails);
    setTopics(newTopics);
    setCategoryToManage('');
    syncToCloud(newTopics, newDetails);
  };

  const handleSaveAssignments = () => {
    if (!categoryToManage) return;

    let newDetails = { ...categoryDetails };
    if (!newDetails['Uncategorized']) newDetails['Uncategorized'] = 'Topics that have lost their category mapping.';

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

  const toggleHiddenCol = (colKey) => {
    setHiddenCols(prev => prev.includes(colKey) ? prev.filter(c => c !== colKey) : [...prev, colKey]);
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

      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.c);
      const matchLevel = selectedLevels.length === 0 || selectedLevels.includes(item.lvl);
      const matchTarget = selectedTargets.length === 0 || item.tg.some((t) => selectedTargets.includes(t));
      const matchSource = selectedSources.length === 0 || item.s.split(', ').some((s) => selectedSources.includes(s.trim()));
      const matchFunction = selectedFunctions.length === 0 || selectedFunctions.includes(item.func);
      const matchExisting = selectedExisting.length === 0 || selectedExisting.includes(item.isExt);

      return matchSearch && matchCategory && matchLevel && matchTarget && matchSource && matchFunction && matchExisting;
    });
  }, [topics, searchTerm, selectedCategories, selectedLevels, selectedTargets, selectedSources, selectedFunctions, selectedExisting]);

  const sortedFilteredData = useMemo(() => {
    let sortableItems = [...filteredData];
    sortableItems.sort((a, b) => {
      if (matrixSort.key === 'c') {
        const catCompare = a.c.localeCompare(b.c);
        if (catCompare !== 0) return matrixSort.dir === 'asc' ? catCompare : -catCompare;
        return (levelWeight[a.lvl] || 2) - (levelWeight[b.lvl] || 2);
      }
      if (matrixSort.key === 'lvl') {
        return matrixSort.dir === 'asc'
          ? (levelWeight[a.lvl] || 2) - (levelWeight[b.lvl] || 2)
          : (levelWeight[b.lvl] || 2) - (levelWeight[a.lvl] || 2);
      }

      let aVal = a[matrixSort.key] || '';
      let bVal = b[matrixSort.key] || '';
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return matrixSort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (aVal < bVal) return matrixSort.dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return matrixSort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [filteredData, matrixSort]);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  const totalPages = Math.ceil(sortedFilteredData.length / itemsPerPage) || 1;
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedFilteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortedFilteredData]);

  const handleMatrixSort = (key) => {
    setMatrixSort({ key, dir: matrixSort.key === key && matrixSort.dir === 'asc' ? 'desc' : 'asc' });
  };

  const getSortIcon = (currentSort, columnKey) => {
    if (currentSort.key !== columnKey) return null;
    return currentSort.dir === 'asc' ? <ChevronUp className="inline w-3 h-3 ml-1" /> : <ChevronDown className="inline w-3 h-3 ml-1" />;
  };

  // ----------------------------------------
  // Summary Logic
  // ----------------------------------------
  const handleSummarySort = (key) => {
    setSummarySort({ key, dir: summarySort.key === key && summarySort.dir === 'asc' ? 'desc' : 'asc' });
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
        if (counts[row.c].depts[dept] !== undefined) counts[row.c].depts[dept] += 1;
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

      if (typeof aVal === 'string') return summarySort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
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

  const visibleColCount = (isAdmin ? 1 : 0) + MAIN_COLS.filter(c => !hiddenCols.includes(c.key)).length + DEPT_INFO.filter(d => !hiddenCols.includes(d.abbr)).length;

  // ----------------------------------------
  // EXCEL EXPORT LOGIC
  // ----------------------------------------
  const handleExportExcel = () => {
    let tableHtml = `
      <html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; font-family: Arial, sans-serif; }
            th { background-color: #1e3a8a; color: white; padding: 12px; border: 1px solid #cbd5e1; text-align: left; font-size: 14px; }
            td { padding: 10px; border: 1px solid #cbd5e1; vertical-align: top; font-size: 13px; }
            .y-cell { background-color: #dcfce7; color: #166534; text-align: center; font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Training Topic</th>
                <th>Description / Objective</th>
                <th>Difficulty</th>
                <th>Function</th>
                <th>Existing Module?</th>
                <th>Originated By</th>`;

    DEPT_INFO.forEach(dept => {
      tableHtml += `<th>${dept.abbr} (${dept.type})</th>`;
    });

    tableHtml += `</tr></thead><tbody>`;

    sortedFilteredData.forEach(row => {
      const escapeHtml = (unsafe) => {
        if (!unsafe) return '';
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      };

      tableHtml += `<tr>
        <td>${escapeHtml(row.c)}</td>
        <td><b>${escapeHtml(row.t)}</b></td>
        <td>${escapeHtml(row.desc)}</td>
        <td>${escapeHtml(row.lvl)}</td>
        <td>${escapeHtml(row.func)}</td>
        <td>${escapeHtml(row.isExt)}</td>
        <td>${escapeHtml(row.s)}</td>`;

      DEPT_INFO.forEach(dept => {
        const isApp = row.tg.includes(dept.full);
        tableHtml += `<td class="${isApp ? 'y-cell' : ''}">${isApp ? 'Y' : ''}</td>`;
      });

      tableHtml += `</tr>`;
    });

    tableHtml += `</tbody></table></body></html>`;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Meratus_Skill_Matrix_Export.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


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
                <h1 className="text-2xl font-bold tracking-tight">Meratus Skill Matrix Categorization</h1>
                <p className="text-blue-200 text-sm">Comprehensive L&D Dashboard - Cloud Synced</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex p-1 bg-blue-950 rounded-lg shadow-inner">
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'matrix' ? 'bg-white text-blue-900 shadow' : 'text-blue-100 hover:text-white hover:bg-blue-800'
                  }`}
                >
                  <TableProperties className="w-4 h-4 mr-2" /> Matrix
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'summary' ? 'bg-white text-blue-900 shadow' : 'text-blue-100 hover:text-white hover:bg-blue-800'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 relative z-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 transition hover:shadow-md">
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Topics</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.length} <span className="text-xs font-normal text-gray-400">/ {topics.length}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 transition hover:shadow-md">
            <div className="bg-teal-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Module Coverage</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter(t => t.isExt === 'Yes').length} <span className="text-xs font-normal text-gray-400">/ {filteredData.length}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 transition hover:shadow-md">
            <div className="bg-green-100 p-3 rounded-full">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{ALL_CATEGORIES.length}</p>
            </div>
          </div>

          {isAdmin ? (
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() =>
                  setEditingTopic({
                    t: '', c: ALL_CATEGORIES[0] || 'New Category', desc: '', lvl: 'Intermediate', s: 'Admin', tg: [], func: 'Operations', isExt: 'No'
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-xl shadow-sm p-3 flex flex-col items-center justify-center transition hover:shadow-md group"
              >
                <Plus className="h-6 w-6 text-white mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white text-center">Add Topic</p>
              </div>
              <div
                onClick={() => setShowCategoryManager(true)}
                className="bg-purple-600 hover:bg-purple-700 cursor-pointer rounded-xl shadow-sm p-3 flex flex-col items-center justify-center transition hover:shadow-md group"
              >
                <FolderEdit className="h-6 w-6 text-white mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white text-center">Categories</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 transition hover:shadow-md">
              <div className="bg-purple-100 p-3 rounded-full">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Difficulty Tracks</p>
                <p className="text-2xl font-bold text-gray-900">{ALL_LEVELS.length}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 transition hover:shadow-md">
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Target Depts</p>
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
              {/* HEADER ACTION BAR - FIXED LAYOUT */}
              <div className="flex flex-wrap items-center justify-between mb-4 border-b border-gray-100 pb-3 gap-3">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-700">Refine Matrix</h2>
                </div>
                
                {/* BUTTONS (RESET, EXCEL, & COLUMN MANAGER) */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {(selectedTargets.length > 0 || selectedCategories.length > 0 || selectedLevels.length > 0 || selectedSources.length > 0 || selectedFunctions.length > 0 || selectedExisting.length > 0 || searchTerm) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedTargets([]);
                        setSelectedCategories([]);
                        setSelectedLevels([]);
                        setSelectedSources([]);
                        setSelectedFunctions([]);
                        setSelectedExisting([]);
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-md transition whitespace-nowrap"
                    >
                      <FilterX className="w-3.5 h-3.5 mr-1" /> Reset
                    </button>
                  )}

                  <button
                    onClick={handleExportExcel}
                    className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-md border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition shadow-sm whitespace-nowrap"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5 text-emerald-600" /> Export Excel
                  </button>
                  
                  {/* COLUMN MANAGER UI */}
                  <div className="relative" ref={colMenuRef}>
                    <button
                      onClick={() => setShowColMenu(!showColMenu)}
                      className="flex items-center text-xs font-bold text-gray-700 bg-white py-1.5 px-3 rounded-md border border-gray-300 hover:bg-gray-50 transition shadow-sm whitespace-nowrap"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-gray-500" /> Columns
                    </button>
                    {showColMenu && (
                      <div className="absolute right-0 top-full mt-2 w-[420px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] p-5 max-h-[85vh] flex flex-col">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4 flex-shrink-0">
                          <span className="font-bold text-sm text-gray-800 flex items-center">
                            <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-500" />
                            Customize Columns
                          </span>
                          <div className="space-x-2">
                             <button onClick={() => setHiddenCols([...MAIN_COLS.map(c=>c.key), ...DEPT_INFO.map(d=>d.abbr)])} className="text-[10px] text-red-600 hover:bg-red-50 hover:text-red-700 font-bold px-2.5 py-1.5 rounded-md transition-colors">
                                Hide All
                             </button>
                             <button onClick={() => setHiddenCols([])} className="text-[10px] text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-md transition-colors">
                                Show All
                             </button>
                          </div>
                        </div>
                        
                        <div className="overflow-y-auto custom-scrollbar pr-2">
                            <div className="font-bold text-[10px] mb-3 text-gray-400 uppercase tracking-wider">Main Information</div>
                            {/* FIXED: Changed from Grid-cols-2 to flex-col single list to prevent overlapping text */}
                            <div className="flex flex-col gap-2 mb-5">
                              {MAIN_COLS.map(col => (
                                <label key={col.key} className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded-lg border border-transparent hover:border-gray-100 transition-colors w-full">
                                  <input type="checkbox" checked={!hiddenCols.includes(col.key)} onChange={() => toggleHiddenCol(col.key)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 flex-shrink-0" />
                                  <span className="font-medium whitespace-normal leading-tight">{col.label}</span>
                                </label>
                              ))}
                            </div>

                            <div className="font-bold text-[10px] mb-3 text-gray-400 uppercase tracking-wider border-t border-gray-100 pt-4">Departments (SBU/SFU)</div>
                            <div className="grid grid-cols-4 gap-2">
                              {DEPT_INFO.map(dept => (
                                <label key={dept.abbr} className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                                  <input type="checkbox" checked={!hiddenCols.includes(dept.abbr)} onChange={() => toggleHiddenCol(dept.abbr)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate font-medium" title={dept.full}>{dept.abbr}</span>
                                </label>
                              ))}
                            </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                <div className="relative xl:col-span-1 lg:col-span-2 sm:col-span-2">
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

                <MultiSelectDropdown title="Job Function" options={ALL_FUNCTIONS} selectedOptions={selectedFunctions} setSelectedOptions={setSelectedFunctions} icon={Briefcase} />
                <MultiSelectDropdown title="Existing Module" options={ALL_EXISTING_OPTS} selectedOptions={selectedExisting} setSelectedOptions={setSelectedExisting} icon={HelpCircle} />
                <MultiSelectDropdown title="Applicable To" options={ALL_UNITS} selectedOptions={selectedTargets} setSelectedOptions={setSelectedTargets} icon={Target} />
                <MultiSelectDropdown title="Skill Category" options={ALL_CATEGORIES} selectedOptions={selectedCategories} setSelectedOptions={setSelectedCategories} icon={LayoutDashboard} />
                <MultiSelectDropdown title="Difficulty" options={ALL_LEVELS} selectedOptions={selectedLevels} setSelectedOptions={setSelectedLevels} icon={GraduationCap} />
                <MultiSelectDropdown title="Originated By" options={ALL_SOURCES} selectedOptions={selectedSources} setSelectedOptions={setSelectedSources} icon={BookOpen} />
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
              <div className="overflow-x-auto custom-scrollbar max-h-[800px] overflow-y-auto relative">
                <table className="min-w-max w-full divide-y divide-gray-200">
                  <thead className="bg-slate-100">
                    <tr>
                      {isAdmin && (
                        <th className="sticky top-0 left-0 bg-slate-100 z-[45] px-3 w-16 border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb]"></th>
                      )}
                      
                      {!hiddenCols.includes('c') && (
                        <th
                          onClick={() => handleMatrixSort('c')}
                          className={`sticky top-0 ${isAdmin ? 'left-[64px]' : 'left-0'} bg-slate-100 z-40 px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb] cursor-pointer hover:bg-slate-200 transition-colors`}
                          style={{ width: '280px', minWidth: '280px' }}
                        >
                          Category {getSortIcon(matrixSort, 'c')}
                        </th>
                      )}

                      {!hiddenCols.includes('t') && (
                        <th
                          onClick={() => handleMatrixSort('t')}
                          className={`sticky top-0 bg-slate-100 z-40 px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 ${!hiddenCols.includes('c') ? 'shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]' : ''} cursor-pointer hover:bg-slate-200 transition-colors`}
                          style={{ left: !hiddenCols.includes('c') ? (isAdmin ? '344px' : '280px') : (isAdmin ? '64px' : '0px'), width: '380px', minWidth: '380px' }}
                        >
                          Training Topic {getSortIcon(matrixSort, 't')}
                        </th>
                      )}

                      {!hiddenCols.includes('lvl') && (
                        <th onClick={() => handleMatrixSort('lvl')} className="sticky top-0 bg-slate-100 z-30 px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-32 cursor-pointer hover:bg-slate-200 transition-colors">
                          Difficulty {getSortIcon(matrixSort, 'lvl')}
                        </th>
                      )}

                      {!hiddenCols.includes('func') && (
                        <th onClick={() => handleMatrixSort('func')} className="sticky top-0 bg-slate-100 z-30 px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-36 cursor-pointer hover:bg-slate-200 transition-colors">
                          Function {getSortIcon(matrixSort, 'func')}
                        </th>
                      )}

                      {!hiddenCols.includes('isExt') && (
                        <th onClick={() => handleMatrixSort('isExt')} className="sticky top-0 bg-slate-100 z-30 px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-24 cursor-pointer hover:bg-slate-200 transition-colors">
                          Existing? {getSortIcon(matrixSort, 'isExt')}
                        </th>
                      )}

                      {!hiddenCols.includes('s') && (
                        <th onClick={() => handleMatrixSort('s')} className="sticky top-0 bg-slate-100 z-30 px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300 w-44 cursor-pointer hover:bg-slate-200 transition-colors">
                          Originated By {getSortIcon(matrixSort, 's')}
                        </th>
                      )}

                      {DEPT_INFO.map((dept) => (
                        !hiddenCols.includes(dept.abbr) && (
                          <th key={dept.abbr} title={dept.full} className="sticky top-0 bg-slate-100 z-30 px-2 py-3 text-center border-r border-gray-200 w-16">
                            <div className="flex flex-col items-center justify-center space-y-1.5">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${dept.type === 'SBU' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                {dept.type}
                              </span>
                              <span className="text-[11px] font-extrabold text-gray-800" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '60px' }}>
                                {dept.abbr}
                              </span>
                            </div>
                          </th>
                        )
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.length > 0 ? (
                      currentData.map((row) => (
                        <tr key={row.id} className="hover:bg-blue-50 transition-colors group">
                          {isAdmin && (
                            <td className="sticky left-0 bg-white group-hover:bg-blue-50 z-20 px-2 py-4 align-top border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb] w-16 text-center">
                              <div className="flex justify-center space-x-1">
                                <button onClick={() => setEditingTopic(row)} className="text-gray-400 hover:text-blue-600 transition p-1 rounded hover:bg-blue-100" title="Edit Topic">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteTopic(row.id)} className="text-gray-400 hover:text-red-600 transition p-1 rounded hover:bg-red-100" title="Delete Topic">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}

                          {!hiddenCols.includes('c') && (
                            <td
                              className={`sticky ${isAdmin ? 'left-[64px]' : 'left-0'} bg-white group-hover:bg-blue-50 z-20 px-5 py-4 align-top border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb] cursor-pointer hover:bg-blue-100 transition`}
                              style={{ width: '280px', minWidth: '280px' }}
                              onClick={() => setViewingCategory(row.c)}
                            >
                              <div className="flex flex-col items-start gap-1">
                                <span className="text-[13px] font-bold text-blue-900 leading-snug hover:underline decoration-blue-300 underline-offset-2">{row.c}</span>
                                <span className="text-[10px] text-gray-500 font-medium flex items-center"><Info className="w-3 h-3 mr-1" /> View Details</span>
                              </div>
                            </td>
                          )}

                          {!hiddenCols.includes('t') && (
                            <td
                              className={`sticky bg-white group-hover:bg-blue-50 z-20 px-5 py-4 align-top border-r border-gray-200 ${!hiddenCols.includes('c') ? 'shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : 'shadow-[1px_0_0_0_#e5e7eb]'}`}
                              style={{ left: !hiddenCols.includes('c') ? (isAdmin ? '344px' : '280px') : (isAdmin ? '64px' : '0px'), width: '380px', minWidth: '380px' }}
                            >
                              <span className="text-[13px] font-semibold text-gray-800 leading-snug block">{row.t}</span>
                              <span className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed" title={row.desc}>{row.desc}</span>
                            </td>
                          )}

                          {!hiddenCols.includes('lvl') && (
                            <td className="px-5 py-4 text-xs text-gray-700 align-top border-r border-gray-200">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${row.lvl === 'Advance' ? 'bg-red-50 text-red-700 border-red-200' : row.lvl === 'Intermediate' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                {row.lvl}
                              </span>
                            </td>
                          )}

                          {!hiddenCols.includes('func') && (
                            <td className="px-4 py-4 text-xs text-gray-700 align-top border-r border-gray-200">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${row.func === 'Development' ? 'bg-purple-50 text-purple-700 border-purple-200' : row.func === 'Administration' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                <Briefcase className="w-3 h-3 mr-1.5" />{row.func}
                              </span>
                            </td>
                          )}

                          {/* EXISTING COL */}
                          {!hiddenCols.includes('isExt') && (
                            <td className="px-4 py-4 text-center align-top border-r border-gray-200">
                              {row.isExt === 'Yes' ? (
                                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-300">
                                  <Check className="w-3 h-3 mr-1" /> YES
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                                  NO
                                </span>
                              )}
                            </td>
                          )}

                          {!hiddenCols.includes('s') && (
                            <td className="px-4 py-4 text-[10px] text-gray-500 align-top border-r border-gray-300 font-medium">
                              {row.s.split(', ').map((source, i) => (
                                <span key={i} className="inline-block bg-gray-100 px-1.5 py-0.5 rounded mr-1 mb-1 border border-gray-200 text-gray-600">{source}</span>
                              ))}
                            </td>
                          )}

                          {DEPT_INFO.map((dept) => {
                            if (hiddenCols.includes(dept.abbr)) return null;
                            const isApplicable = row.tg.includes(dept.full);
                            return (
                              <td key={dept.abbr} className={`px-2 py-4 text-center align-middle border-r border-gray-100 transition-colors ${isApplicable ? 'bg-green-50/40 group-hover:bg-green-100/50' : ''}`}>
                                {isApplicable ? (
                                  <div className="flex justify-center"><div className="h-5 w-5 bg-green-500 rounded flex items-center justify-center shadow-sm"><Check className="h-3.5 w-3.5 text-white stroke-[3]" /></div></div>
                                ) : (
                                  <div className="flex justify-center"><div className="h-1.5 w-1.5 rounded-full bg-gray-200"></div></div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={visibleColCount} className="px-6 py-16 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <Search className="h-10 w-10 text-gray-300 mb-3" />
                            <p className="text-lg font-medium">No training topics found matching your criteria.</p>
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
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
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
                <div key={dept.abbr} className="flex items-center space-x-1.5 w-40">
                  <span className={`px-1 rounded text-[9px] font-bold ${dept.type === 'SBU' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {dept.type}
                  </span>
                  <span className="font-bold">{dept.abbr}:</span>
                  <span className="truncate" title={dept.full}>{dept.full}</span>
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
                  <h2 className="text-lg font-bold text-gray-800">Category Distribution by Department</h2>
                  <p className="text-xs text-gray-500">Volume of unique training topics mapped across the enterprise. Click headers to sort.</p>
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
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${dept.type === 'SBU' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {dept.type}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {summaryData.map((row, idx) => (
                    <tr key={row.category} className={`hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                      <td className="sticky left-0 bg-inherit z-20 px-6 py-3 border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb]" style={{ width: '320px', minWidth: '320px' }}>
                        <span className="text-sm font-bold text-gray-800 cursor-pointer hover:text-blue-600 hover:underline" onClick={() => setViewingCategory(row.category)}>
                          {row.category}
                        </span>
                      </td>
                      <td className="sticky bg-blue-50 z-20 px-4 py-3 text-center font-extrabold text-blue-900 border-r border-blue-200 text-base shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" style={{ left: '320px' }}>
                        {row.total}
                      </td>
                      {DEPT_INFO.map((dept) => {
                        const count = row.depts[dept.full];
                        return (
                          <td key={dept.full} className={`px-2 py-3 text-center border-r border-gray-100 text-sm font-medium ${count > 0 ? 'text-gray-900 bg-green-50/30' : 'text-gray-300'}`}>
                            {count > 0 ? count : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 sticky bottom-0 z-30 shadow-[0_-2px_5px_-2px_rgba(0,0,0,0.1)]">
                  <tr>
                    <td className="sticky left-0 bg-slate-100 z-40 px-6 py-4 border-r border-gray-300 shadow-[1px_0_0_0_#cbd5e1]" style={{ width: '320px', minWidth: '320px' }}>
                      <span className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">Enterprise Total</span>
                    </td>
                    <td className="sticky bg-blue-100 z-40 px-4 py-4 text-center font-extrabold text-blue-900 border-r border-blue-300 text-lg shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]" style={{ left: '320px' }}>
                      {enterpriseTotal}
                    </td>
                    {DEPT_INFO.map((dept) => (
                      <td key={dept.full} className="px-2 py-4 text-center border-r border-gray-300 text-sm font-extrabold text-gray-900">
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
              <h3 className="text-lg font-bold text-white flex items-center"><Info className="w-5 h-5 mr-2" /> Category Details</h3>
              <button onClick={() => setViewingCategory(null)} className="text-blue-200 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{viewingCategory}</h4>
              <p className="text-gray-600 leading-relaxed mb-6">{getDynamicCategoryDesc(viewingCategory)}</p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Total Topics in Category</p>
                  <p className="text-2xl font-black text-blue-700">{topics.filter((t) => t.c === viewingCategory).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button onClick={() => setViewingCategory(null)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium">Close</button>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Unlock</h3>
              <p className="text-sm text-gray-500 mb-6">Enter the master password to unlock permanent cloud-editing features for the Enterprise Skill Matrix.</p>

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
                  onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button onClick={handleAdminLogin} className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors">
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
              <h3 className="text-lg font-bold text-white flex items-center"><FolderEdit className="w-5 h-5 mr-2" /> Manage Categories</h3>
              <button
                onClick={() => { setShowCategoryManager(false); setCategoryToManage(''); }}
                className="text-purple-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setCatManagerTab('details')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition ${catManagerTab === 'details' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                Edit / Delete
              </button>
              <button
                onClick={() => setCatManagerTab('add')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition ${catManagerTab === 'add' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                Add New
              </button>
              <button
                onClick={() => setCatManagerTab('assign')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition ${catManagerTab === 'assign' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              >
                Assign Topics
              </button>
            </div>

            <div className="p-6 bg-gray-50 flex-1 overflow-y-auto custom-scrollbar">
              {catManagerTab === 'details' && (
                <div className="max-w-lg mx-auto">
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Select Category to Manage</label>
                    <select
                      value={categoryToManage}
                      onChange={(e) => setCategoryToManage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm mb-4 bg-white"
                    >
                      <option value="">-- Select a Category --</option>
                      {ALL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {categoryToManage && (
                      <div className="border-t border-gray-100 pt-4 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category Name</label>
                          <input
                            type="text"
                            value={catNameInput}
                            onChange={(e) => setCatNameInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description / Details</label>
                          <textarea
                            rows="3"
                            value={catDescInput}
                            onChange={(e) => setCatDescInput(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                          />
                        </div>
                        <button onClick={handleSaveCategory} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-sm">
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  {categoryToManage && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-red-800">Danger Zone</p>
                        <p className="text-xs text-red-600">Delete this category. Its topics will safely move to "Uncategorized".</p>
                      </div>
                      <button onClick={handleDeleteCategory} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition shadow-sm whitespace-nowrap">
                        Delete Category
                      </button>
                    </div>
                  )}
                </div>
              )}

              {catManagerTab === 'add' && (
                <div className="max-w-lg mx-auto bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">New Category Name</label>
                      <input
                        type="text"
                        value={catNameInput}
                        onChange={(e) => setCatNameInput(e.target.value)}
                        placeholder="e.g., Advanced Strategic Finance"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description / Details</label>
                      <textarea
                        rows="3"
                        value={catDescInput}
                        onChange={(e) => setCatDescInput(e.target.value)}
                        placeholder="What kind of topics belong here?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <button onClick={handleSaveCategory} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-sm flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-2" /> Create Category
                    </button>
                  </div>
                </div>
              )}

              {catManagerTab === 'assign' && (
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 flex-shrink-0">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Target Category</label>
                      <select
                        value={categoryToManage}
                        onChange={(e) => setCategoryToManage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm bg-white"
                      >
                        <option value="">-- Select Category --</option>
                        {ALL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Filter Topics</label>
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
                        <span className="text-xs font-bold text-gray-600 uppercase">Check topics to assign them to: <span className="text-purple-700">{categoryToManage}</span></span>
                        <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{topicsToAssign.length} Selected</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                        {topics
                          .filter((t) => t.t.toLowerCase().includes(assignSearch.toLowerCase()) || t.c.toLowerCase().includes(assignSearch.toLowerCase()))
                          .sort((a, b) => a.t.localeCompare(b.t))
                          .map((t) => {
                            const isChecked = topicsToAssign.includes(t.id);
                            return (
                              <div
                                key={t.id}
                                onClick={() => setTopicsToAssign(isChecked ? topicsToAssign.filter((id) => id !== t.id) : [...topicsToAssign, t.id])}
                                className={`flex items-start p-2 rounded cursor-pointer border-b border-transparent hover:border-gray-100 ${isChecked ? 'bg-purple-50/50' : 'hover:bg-gray-50'}`}
                              >
                                {isChecked ? <CheckSquare className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" /> : <Square className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />}
                                <div>
                                  <p className={`text-sm font-semibold ${isChecked ? 'text-purple-900' : 'text-gray-700'}`}>{t.t}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">Currently in: <span className={t.c === categoryToManage ? 'text-purple-600 font-bold' : 'text-gray-500'}>{t.c}</span></p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <button onClick={handleSaveAssignments} className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-sm flex justify-center items-center">
                          <Save className="w-4 h-4 mr-2" /> Save Bulk Assignments
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 bg-white min-h-[300px]">
                      <FolderEdit className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">Select a target category to start assigning topics.</p>
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
                <Edit className="w-5 h-5 mr-2" /> {editingTopic.id ? 'Edit Training Topic' : 'Add New Training Topic'}
              </h3>
              <button onClick={() => setEditingTopic(null)} className="text-blue-200 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider border-b pb-2">Topic Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Training Topic Name</label>
                    <textarea
                      rows="2"
                      value={editingTopic.t}
                      onChange={(e) => setEditingTopic({ ...editingTopic, t: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold"
                      placeholder="e.g., Engine Maintenance Overview"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Topic Description / Objective</label>
                    <textarea
                      rows="3"
                      value={editingTopic.desc || ''}
                      onChange={(e) => setEditingTopic({ ...editingTopic, desc: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter a brief description or learning objective for this topic..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category (Create or Select)</label>
                    <input
                      type="text"
                      list="category-list"
                      value={editingTopic.c}
                      onChange={(e) => setEditingTopic({ ...editingTopic, c: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <datalist id="category-list">
                      {ALL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Difficulty Level</label>
                    <select
                      value={editingTopic.lvl}
                      onChange={(e) => setEditingTopic({ ...editingTopic, lvl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advance">Advance</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Job Function</label>
                    <select
                      value={editingTopic.func || 'Operations'}
                      onChange={(e) => setEditingTopic({ ...editingTopic, func: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Development">Development</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Originated By (Source Data)</label>
                    <input
                      type="text"
                      value={editingTopic.s}
                      onChange={(e) => setEditingTopic({ ...editingTopic, s: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="e.g., Asset Charter, Logistics"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Already Exist?</label>
                    <select
                      value={editingTopic.isExt || 'No'}
                      onChange={(e) => setEditingTopic({ ...editingTopic, isExt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Applicable Departments ({editingTopic.tg.length})</h4>
                  <button
                    onClick={() => setEditingTopic({ ...editingTopic, tg: editingTopic.tg.length === ALL_UNITS.length ? [] : [...ALL_UNITS] })}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    {editingTopic.tg.length === ALL_UNITS.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {DEPT_INFO.map((dept) => {
                    const isChecked = editingTopic.tg.includes(dept.full);
                    return (
                      <div
                        key={dept.full}
                        onClick={() => {
                          const newTg = isChecked ? editingTopic.tg.filter((d) => d !== dept.full) : [...editingTopic.tg, dept.full];
                          setEditingTopic({ ...editingTopic, tg: newTg });
                        }}
                        className={`flex items-center p-2 rounded-md cursor-pointer border transition-colors ${isChecked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                      >
                        {isChecked ? <CheckSquare className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" /> : <Square className="h-4 w-4 text-gray-300 mr-2 flex-shrink-0" />}
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-500 leading-tight">{dept.abbr}</span>
                          <span className="text-xs font-semibold text-gray-800 truncate" title={dept.full}>{dept.full}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-4 border-t flex justify-between items-center flex-shrink-0">
              {editingTopic.id ? (
                <button onClick={() => deleteTopic(editingTopic.id)} className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Topic
                </button>
              ) : <div></div>}

              <div className="flex space-x-3">
                <button onClick={() => setEditingTopic(null)} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition-colors">
                  Cancel
                </button>
                <button onClick={() => saveTopic(editingTopic)} className="flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
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