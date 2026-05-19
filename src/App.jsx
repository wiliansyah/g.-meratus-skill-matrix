import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search, Filter, BookOpen, Users, Target, ShieldCheck, LayoutDashboard,
  Check, ChevronLeft, ChevronRight, Info, TableProperties, BarChart2,
  ChevronUp, ChevronDown, CheckSquare, Square, FilterX, Edit, Trash2,
  Plus, Lock, Unlock, X, Save, Briefcase, SlidersHorizontal, CheckCircle,
  HelpCircle, Download, Network, Award, GraduationCap
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

let firebaseConfig;
try {
  if (typeof __firebase_config !== 'undefined') {
    firebaseConfig = JSON.parse(__firebase_config);
  } else {
    firebaseConfig = {
      apiKey: "AIzaSyAgZUtc5aZguYz_MW5zISkuLvDgPmDixfg",
      authDomain: "meratus-frd-lms-10276.firebaseapp.com",
      projectId: "meratus-frd-lms-10276",
      storageBucket: "meratus-frd-lms-10276.firebasestorage.app",
      messagingSenderId: "845694770386",
      appId: "1:845694770386:web:f103c31b21d082c8fd610b"
    };
  }
} catch (e) {
  console.warn("Config parse error, falling back to static config.", e);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'meratus-liner-system';

const LINER_SUBUNITS = ['Liner Trade', 'Liner Ops', 'Liner Intl', 'Liner Commercial'];
const ALL_LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'];
const CATALOG_LEVELS = ['Basic', 'Intermediate', 'Advance'];

const LINER_CATEGORIES = [
  { id: 'C1', name: 'Regulatory & Compliance' },
  { id: 'C2', name: 'Technology & Analytics' },
  { id: 'C3', name: 'Liner Commercial & Account Mgt' },
  { id: 'C4', name: 'Liner Trade & Pricing Strategy' },
  { id: 'C5', name: 'Marine & Fleet Operations' },
  { id: 'C6', name: 'Terminal & Port Operations' },
  { id: 'C7', name: 'Financial & Business Acumen' }
];

const LINER_DOMAINS = [
  { id: 'D1', cat: 'Regulatory & Compliance', name: 'Maritime Law & Intl Conventions' },
  { id: 'D2', cat: 'Regulatory & Compliance', name: 'Commercial & Trade Regulation' },
  { id: 'D3', cat: 'Regulatory & Compliance', name: 'Company Policies & Procedures' },
  { id: 'D4', cat: 'Regulatory & Compliance', name: 'QSHE & Cargo Safety' },
  { id: 'D5', cat: 'Technology & Analytics', name: 'Liner Digital Systems' },
  { id: 'D6', cat: 'Liner Commercial & Account Mgt', name: 'Customer Relationship Management' },
  { id: 'D7', cat: 'Liner Commercial & Account Mgt', name: 'Sales Execution' },
  { id: 'D8', cat: 'Liner Commercial & Account Mgt', name: 'Commercial Documentation' },
  { id: 'D9', cat: 'Liner Commercial & Account Mgt', name: 'Product & Service Knowledge' },
  { id: 'D10', cat: 'Liner Commercial & Account Mgt', name: 'Business Development' },
  { id: 'D11', cat: 'Liner Trade & Pricing Strategy', name: 'Pricing Management & Strategy' },
  { id: 'D12', cat: 'Liner Trade & Pricing Strategy', name: 'Market Intelligence & Analysis' },
  { id: 'D13', cat: 'Liner Trade & Pricing Strategy', name: 'Network & Trade Strategy' },
  { id: 'D14', cat: 'Marine & Fleet Operations', name: 'Vessel & Voyage Management' },
  { id: 'D15', cat: 'Marine & Fleet Operations', name: 'Bunker Management' },
  { id: 'D16', cat: 'Terminal & Port Operations', name: 'Terminal & Port Operations' },
  { id: 'D17', cat: 'Terminal & Port Operations', name: 'Container & Equipment Management' },
  { id: 'D18', cat: 'Financial & Business Acumen', name: 'Financial Performance Analysis' },
  { id: 'D19', cat: 'Financial & Business Acumen', name: 'Budgeting & Cost Control' },
];

const LEVEL_COLORS = {
  'L1': 'bg-slate-100 text-slate-600 border-slate-200',
  'L2': 'bg-sky-100 text-sky-700 border-sky-200',
  'L3': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'L4': 'bg-amber-100 text-amber-700 border-amber-200',
  'L5': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  '': 'bg-gray-50 text-gray-300 border-dashed border-gray-200' 
};

const RAW_ROLE_DATA = [
  // LINER TRADE
  ['Liner Trade', 'Tier A', 'Chief Trade Officer', 'L4','L5','L5','L3','L3','L4','L3','L3','L4','L4','L5','L5','L5','L3','L2','L3','L3','L5','L5'],
  ['Liner Trade', 'Tier A', 'Dep. Chief Trade Officer', 'L4','L4','L4','L3','L3','L4','L3','L3','L4','L4','L5','L5','L5','L3','L2','L3','L3','L5','L5'],
  ['Liner Trade', 'Tier B', 'Product Dev. Manager', 'L3','L4','L3','L3','L3','L3','L2','L3','L5','L4','L4','L4','L4','L3','L2','L3','L3','L4','L3'],
  ['Liner Trade', 'Tier B', 'Pricing Manager', 'L2','L4','L4','L2','L4','L3','L2','L3','L4','L2','L5','L4','L3','L3','L2','L2','L2','L5','L4'],
  ['Liner Trade', 'Tier B', 'Line Manager (×5 regions)', 'L3','L4','L4','L3','L3','L4','L3','L3','L4','L3','L3','L4','L4','L3','L2','L3','L3','L4','L4'],
  ['Liner Trade', 'Tier B', 'Business Dev. Manager', 'L2','L3','L3','L2','L2','L4','L3','L3','L4','L5','L3','L4','L3','L2','L1','L2','L2','L4','L3'],
  ['Liner Trade', 'Tier C', 'Trade PMO', 'L2','L3','L4','L2','L4','L2','L1','L3','L3','L2','L2','L3','L3','L2','L1','L2','L2','L4','L4'],
  ['Liner Trade', 'Tier C', 'Cargo Flow Coordinator', 'L2','L3','L3','L3','L3','L3','L2','L3','L3','L2','L3','L3','L3','L3','L2','L3','L4','L4','L3'],
  ['Liner Trade', 'Tier D', 'Line Assistant', 'L2','L3','L3','L2','L3','L3','L3','L3','L3','L2','L2','L2','L2','L2','L1','L2','L2','L2','L2'],
  ['Liner Trade', 'Tier D', 'Pricing Staff', 'L1','L2','L2','L2','L3','L2','L1','L3','L3','L1','L4','L3','L2','L2','L1','L2','L2','L3','L3'],
  ['Liner Trade', 'Tier D', 'Specialist (Reefer/SOC/Isotank)', 'L2','L3','L2','L4','L3','L3','L3','L3','L4','L2','L3','L2','L2','L2','L1','L3','L3','L2','L2'],
  ['Liner Trade', 'Tier D', 'Business Dev. Staff', 'L1','L2','L2','L2','L2','L3','L3','L2','L3','L4','L2','L3','L2','L1','L1','L1','L1','L3','L2'],
  ['Liner Trade', 'Tier D', 'Cargo Flow Staff', 'L2','L2','L2','L3','L3','L2','L1','L3','L3','L1','L2','L3','L2','L2','L1','L3','L3','L3','L2'],
  ['Liner Trade', 'Tier D', 'OOG / Project Specialist', 'L2','L2','L2','L4','L2','L3','L3','L3','L4','L2','L2','L2','L2','L2','L1','L3','L3','L2','L2'],

  // LINER OPERATIONS
  ['Liner Ops', 'Tier A', 'GM Liner Operation', 'L4','L3','L5','L4','L3','L3','L2','L3','L3','L2','L2','L4','L4','L4','L4','L4','L4','L4','L4'],
  ['Liner Ops', 'Tier B', 'Liner Operation Manager', 'L4','L3','L4','L3','L3','L3','L1','L3','L3','L1','L2','L3','L3','L4','L3','L4','L3','L3','L4'],
  ['Liner Ops', 'Tier B', 'Bunkering & Fleet Eff. Mgr', 'L4','L2','L4','L3','L4','L2','L1','L3','L3','L2','L2','L3','L3','L4','L5','L3','L3','L4','L4'],
  ['Liner Ops', 'Tier B', 'MFEC Manager', 'L3','L3','L4','L3','L4','L2','L1','L3','L3','L1','L3','L3','L4','L5','L4','L4','L3','L4','L4'],
  ['Liner Ops', 'Tier B', 'Terminal Performance Mgr', 'L3','L3','L4','L3','L3','L3','L1','L3','L3','L1','L2','L3','L3','L3','L2','L5','L4','L4','L4'],
  ['Liner Ops', 'Tier B', 'Equipment & Logistic Mgr', 'L2','L2','L3','L3','L3','L2','L1','L2','L2','L1','L1','L2','L2','L3','L2','L3','L5','L3','L4'],
  ['Liner Ops', 'Tier C', 'Risk Management & HSE', 'L4','L2','L3','L5','L2','L1','L1','L2','L2','L1','L1','L2','L2','L3','L2','L3','L2','L2','L2'],
  ['Liner Ops', 'Tier C', 'PMO Liner Operation', 'L2','L2','L4','L2','L4','L2','L1','L2','L2','L1','L1','L3','L3','L3','L2','L3','L3','L4','L4'],
  ['Liner Ops', 'Tier D', 'Ship Planner', 'L3','L2','L3','L4','L4','L2','L1','L3','L3','L1','L2','L2','L3','L5','L3','L4','L3','L2','L2'],
  ['Liner Ops', 'Tier D', 'Bunker Operation', 'L3','L2','L3','L3','L3','L2','L1','L3','L2','L1','L2','L2','L2','L3','L5','L3','L2','L3','L3'],
  ['Liner Ops', 'Tier D', 'Bunker Analyst', 'L3','L2','L2','L2','L4','L1','L1','L2','L2','L1','L2','L3','L2','L3','L5','L2','L2','L3','L3'],
  ['Liner Ops', 'Tier D', 'Voyage Performance', 'L3','L2','L3','L3','L4','L2','L1','L3','L3','L1','L3','L3','L3','L5','L4','L3','L3','L4','L3'],
  ['Liner Ops', 'Tier D', 'Operation Control', 'L3','L2','L3','L3','L4','L3','L1','L3','L3','L1','L2','L2','L2','L3','L2','L5','L4','L3','L3'],
  ['Liner Ops', 'Tier D', 'Disbursement Account', 'L2','L3','L3','L2','L3','L3','L1','L4','L2','L1','L2','L2','L1','L2','L2','L4','L3','L4','L4'],
  ['Liner Ops', 'Tier D', 'Equipment & Logistic Staff', 'L2','L1','L3','L3','L3','L2','L1','L2','L2','L1','L1','L1','L2','L3','L2','L3','L5','L3','L3'],
  ['Liner Ops', 'Tier D', 'Maintenance & Repair', 'L2','L1','L3','L3','L2','L1','L1','L2','L1','L1','L1','L1','L1','L2','L2','L2','L3','L2','L2'],

  // LINER INTERNATIONAL
  ['Liner Intl', 'Tier A', 'Chief International Trade Officer', 'L5','L5','L5','L3','L3','L4','L3','L4','L4','L5','L5','L5','L5','L3','L2','L3','L3','L5','L5'],
  ['Liner Intl', 'Tier B', 'GM International Trade', 'L5','L5','L4','L3','L3','L4','L3','L4','L4','L4','L5','L5','L5','L3','L2','L3','L3','L5','L5'],
  ['Liner Intl', 'Tier B', 'GM Commercial Intl Liner', 'L4','L4','L4','L3','L3','L5','L4','L4','L5','L4','L4','L4','L4','L3','L2','L3','L3','L5','L4'],
  ['Liner Intl', 'Tier B', 'Customer Service Mgr Intl', 'L3','L4','L4','L3','L4','L5','L2','L4','L4','L2','L2','L2','L2','L2','L1','L2','L2','L2','L3'],
  ['Liner Intl', 'Tier B', 'Country Head Indonesia', 'L3','L4','L3','L2','L3','L4','L3','L3','L4','L3','L3','L4','L3','L2','L1','L3','L3','L4','L4'],
  ['Liner Intl', 'Tier B', 'Country Head China', 'L4','L4','L3','L2','L3','L4','L3','L3','L4','L4','L3','L4','L3','L2','L1','L2','L3','L4','L4'],
  ['Liner Intl', 'Tier C', 'PMO International Trade', 'L3','L3','L4','L2','L4','L2','L1','L3','L3','L2','L2','L4','L3','L2','L1','L2','L2','L4','L4'],
  ['Liner Intl', 'Tier C', 'Pricing Manager', 'L3','L4','L3','L3','L4','L3','L2','L3','L4','L2','L5','L4','L3','L3','L2','L2','L2','L4','L4'],
  ['Liner Intl', 'Tier C', 'Line Manager', 'L4','L4','L3','L3','L3','L4','L3','L4','L4','L3','L4','L4','L4','L3','L2','L3','L3','L4','L4'],
  ['Liner Intl', 'Tier C', 'Partnership Manager', 'L3','L3','L3','L2','L3','L4','L3','L2','L3','L5','L3','L4','L4','L2','L1','L2','L2','L3','L3'],
  ['Liner Intl', 'Tier C', 'Network Dev. Manager', 'L4','L3','L3','L2','L3','L3','L3','L2','L3','L5','L3','L5','L5','L3','L1','L3','L2','L3','L3'],
  ['Liner Intl', 'Tier C', 'Agency Manager', 'L4','L4','L3','L3','L3','L4','L2','L4','L3','L4','L2','L3','L3','L3','L1','L3','L3','L2','L3'],
  ['Liner Intl', 'Tier C', 'Country Manager Timor Leste', 'L4','L4','L3','L3','L3','L4','L3','L3','L3','L3','L3','L3','L3','L2','L1','L3','L2','L3','L4'],
  ['Liner Intl', 'Tier C', 'Country Manager PNG', 'L4','L4','L3','L3','L2','L4','L3','L3','L3','L3','L2','L3','L3','L2','L1','L3','L2','L3','L4'],
  ['Liner Intl', 'Tier D', 'Agency Coordinator', 'L3','L4','L2','L3','L3','L3','L1','L4','L2','L2','L2','L2','L2','L2','L1','L2','L3','L2','L2'],
  ['Liner Intl', 'Tier D', 'CS Staff (Dom. & Int\'l)', 'L2','L3','L3','L3','L4','L4','L2','L4','L3','L1','L2','L1','L1','L2','L1','L2','L2','L1','L1'],
  ['Liner Intl', 'Tier D', 'Sales Staff Country Office', 'L2','L2','L2','L2','L3','L3','L4','L2','L3','L3','L2','L3','L2','L1','L1','L2','L2','L2','L2'],
  ['Liner Intl', 'Tier D', 'Operations & Support Staff', 'L3','L3','L2','L2','L3','L2','L1','L3','L2','L1','L1','L1','L1','L2','L1','L3','L2','L2','L2'],

  // LINER COMMERCIAL
  ['Liner Commercial', 'Tier A', 'Head of Liner Commercial', 'L3','L4','L5','L3','L3','L5','L4','L3','L5','L5','L4','L4','L3','L2','L1','L2','L2','L5','L5'],
  ['Liner Commercial', 'Tier B', 'GM CX Liner Commercial', 'L2','L3','L4','L2','L4','L5','L3','L4','L4','L3','L2','L3','L2','L2','L1','L2','L2','L4','L4'],
  ['Liner Commercial', 'Tier B', 'GM Operation Liner Commercial', 'L2','L3','L4','L3','L3','L4','L2','L4','L4','L2','L2','L3','L3','L2','L1','L3','L3','L4','L4'],
  ['Liner Commercial', 'Tier B', 'GM MLT & VAS Liner Commercial', 'L2','L3','L4','L3','L3','L4','L3','L3','L5','L4','L3','L4','L3','L2','L1','L3','L3','L4','L4'],
  ['Liner Commercial', 'Tier B', 'GM Sales Liner Commercial', 'L3','L4','L4','L3','L3','L5','L5','L3','L5','L5','L4','L4','L3','L2','L2','L2','L2','L4','L4'],
  ['Liner Commercial', 'Tier C', 'PMO Liner Commercial', 'L2','L3','L4','L2','L4','L3','L1','L3','L3','L2','L2','L3','L2','L2','L1','L2','L2','L4','L4'],
  ['Liner Commercial', 'Tier C', 'CX Manager', 'L2','L3','L4','L2','L4','L5','L2','L4','L4','L3','L2','L3','L2','L2','L1','L2','L2','L3','L3'],
  ['Liner Commercial', 'Tier C', 'Regional Manager Operation (×3)', 'L2','L3','L4','L3','L3','L4','L3','L3','L4','L3','L3','L3','L2','L2','L1','L3','L3','L4','L4'],
  ['Liner Commercial', 'Tier C', 'Sales Manager MLT & VAS', 'L2','L3','L3','L3','L3','L4','L4','L2','L5','L4','L3','L4','L3','L2','L1','L2','L2','L3','L3'],
  ['Liner Commercial', 'Tier C', 'Operation Manager MLT & VAS', 'L2','L3','L4','L3','L3','L3','L1','L3','L4','L2','L2','L2','L2','L2','L1','L3','L3','L3','L3'],
  ['Liner Commercial', 'Tier C', 'Sales Manager (Reefer/BCO/SOC)', 'L2','L3','L3','L3','L3','L4','L4','L2','L4','L4','L3','L3','L2','L2','L2','L2','L2','L3','L3'],
  ['Liner Commercial', 'Tier D', 'Pool Data Analyst & Admin', 'L1','L2','L3','L1','L4','L2','L1','L2','L2','L1','L2','L3','L1','L1','L1','L1','L1','L4','L3'],
  ['Liner Commercial', 'Tier D', 'Centralized Doc. & Invoicing', 'L2','L3','L3','L2','L4','L3','L1','L5','L2','L1','L1','L1','L1','L1','L1','L2','L2','L2','L2'],
  ['Liner Commercial', 'Tier D', 'Branch Manager / Coordinator', 'L2','L3','L3','L2','L3','L4','L3','L3','L4','L3','L3','L3','L2','L2','L1','L2','L2','L3','L3'],
  ['Liner Commercial', 'Tier D', 'Sales Staff (Regional)', 'L1','L2','L3','L2','L3','L4','L4','L2','L4','L3','L2','L2','L1','L1','L1','L1','L1','L2','L2'],
  ['Liner Commercial', 'Tier D', 'Operation Staff (Regional)', 'L2','L2','L3','L3','L3','L3','L1','L3','L3','L1','L1','L1','L1','L2','L1','L3','L3','L2','L2'],
  ['Liner Commercial', 'Tier D', 'Customer Service Staff', 'L2','L2','L3','L2','L4','L4','L2','L3','L3','L1','L1','L1','L1','L2','L1','L2','L2','L1','L1'],
  ['Liner Commercial', 'Tier D', 'Sales Spec. (Reefer/BCO/SOC)', 'L1','L2','L2','L3','L2','L4','L4','L2','L4','L3','L2','L2','L1','L1','L1','L1','L1','L2','L2']
];

const BEHAVIORAL_INDICATORS = {
  'D1': { L1: 'Aware of major IMO conventions (SOLAS, MARPOL, COLREG, ISM, ISPS). Can name key regulatory bodies. Understands why they matter to Liner operations.', L2: 'Reads regulatory summaries and applies them to daily tasks. Identifies relevant regulations for common shipping scenarios. Follows compliance checklists.', L3: 'Applies maritime law knowledge independently in commercial or operational decisions. Reviews documents for regulatory compliance. Advises peers.', L4: 'Interprets complex and evolving regulatory requirements. Identifies compliance risks proactively. Manages regulatory risk across a trade or fleet.', L5: 'Drives organisational maritime regulatory strategy. Acts as subject matter expert. Represents Meratus in regulatory and industry forums.' },
  'D2': { L1: 'Aware that commercial transactions are governed by contracts. Knows B/L, Charter Party and Incoterms conceptually.', L2: 'Understands standard commercial terms. Reads basic trade documents. Applies Incoterms correctly in customer-facing interactions.', L3: 'Reviews and interprets CPs, B/Ls and trade contracts independently. Identifies legal and commercial risks. Advises internal stakeholders.', L4: 'Negotiates commercial terms with full understanding of legal implications. Manages contract disputes end to end.', L5: 'Establishes Meratus standards for commercial contracts. Leads complex dispute resolution. Drives commercial policy development.' },
  'D3': { L1: 'Aware of P3W and major company policies. Knows where to find procedures. Follows policies when directed.', L2: 'Follows established procedures in daily work. Applies P3W guidance correctly. Raises process gaps when found.', L3: 'Works independently within the policy framework. Trains peers on correct procedures. Identifies and proposes fixes for process gaps.', L4: 'Interprets policy for complex scenarios. Contributes to policy development. Reviews adherence across team or region.', L5: 'Drives policy development and organisational alignment. Sponsors governance changes. Sets the tone for process-disciplined culture.' },
  'D4': { L1: 'Aware of QSHE requirements and major ISO standards. Knows DG cargo classes and special cargo requires specific handling.', L2: 'Follows QSHE procedures. Reports near-misses using SIKAP. Identifies cargo types and applies basic handling requirements.', L3: 'Applies QSHE principles independently. Coaches peers. Manages cargo safety documentation for standard and special cargo.', L4: 'Reviews QSHE performance. Leads compliance audits. Expert in specialty cargo (DG, reefer, OOG). Drives corrective actions.', L5: 'Drives QSHE culture and standards across the Liner function. Leads ISO certification processes. Ultimate cargo safety authority.' },
  'D5': { L1: 'Knows the main Liner digital systems and their purpose. Can navigate to main screens with guidance.', L2: 'Uses Liner systems for standard daily commercial and operational tasks. Produces standard reports. Flags system anomalies.', L3: 'Uses all relevant systems proficiently for standard and non-routine tasks. Troubleshoots discrepancies. Trains new users.', L4: 'Advanced user of all Liner systems and analytics tools. Designs automated dashboards. Contributes to system improvement.', L5: 'System subject matter expert. Leads system implementation or migration. Governs data standards and drives digital adoption.' },
  'D6': { L1: 'Understands the importance of CRM. Provides courteous service in all customer interactions. Knows the escalation path.', L2: 'Manages routine customer interactions professionally. Escalates issues promptly. Updates customer records.', L3: 'Independently manages a portfolio of accounts. Resolves complaints without escalation. Develops account plans.', L4: 'Develops strategic account plans. Builds senior-level customer relationships. Manages high-value and complex accounts.', L5: 'Defines CRM strategy for the Liner function. Manages critical executive relationships. Drives customer-centric culture.' },
  'D7': { L1: 'Aware of Meratus products and sales process. Can describe value proposition basically. Shadows senior staff.', L2: 'Conducts basic sales activities with guidance. Prepares standard quotations. Maintains contact list and call record.', L3: 'Manages own pipeline independently. Prepares tailored proposals. Meets targets. Handles routine objections.', L4: 'Closes complex, multi-service or high-value deals. Coaches junior staff. Manages large strategic accounts.', L5: 'Designs the sales methodology for Liner Commercial. Drives overall sales performance culture. Sets regional targets.' },
  'D8': { L1: 'Recognises key shipping and commercial documents. Explains their basic function in the supply chain.', L2: 'Prepares standard documents with guidance. Checks for basic errors. Follows the document release workflow.', L3: 'Independently prepares and reviews full documentation set. Resolves discrepancies. Manages document timelines.', L4: 'Manages complex documentation scenarios (multi-modal, VAS, SOC, reefer). Designs workflows. Trains teams.', L5: 'Sets documentation standards for the Liner function. Authors policy. Manages regulatory compliance for documents.' },
  'D9': { L1: 'Knows Meratus main service offerings, primary routes and basic container types.', L2: 'Explains standard products accurately. Identifies the right product for a given customer need.', L3: 'Expert in assigned product area. Advises customers on complex requirements. Positions Meratus against competitors.', L4: 'Deep expertise across full product range. Provides input to product development. Develops configurations for complex customers.', L5: 'Defines Meratus Liner product strategy and portfolio. Develops new commercial service offerings. Ultimate product authority.' },
  'D10': { L1: 'Aware of BD approach and sales pipeline. Describes what business development means in the Liner context.', L2: 'Supports BD activities (market research, prospect database) under guidance. Prepares tender support data.', L3: 'Independently manages BD pipeline for territory. Prepares tailored proposals. Leads mid-size tenders.', L4: 'Leads complex and high-value tender processes. Develops market entry strategies. Manages strategic partnerships.', L5: 'Sets BD strategy. Drives new market entry. Leads the most strategically important commercial partnerships and agency networks.' },
  'D11': { L1: 'Understands freight rate components. Aware pricing decisions directly affect route profitability.', L2: 'Calculates standard freight rates using tariffs. Applies surcharges accurately. Prepares standard freight estimates.', L3: 'Manages pricing for a defined market within approved parameters. Applies segmentation and tier pricing logic.', L4: 'Designs pricing structures. Manages complex multi-route pricing. Conducts route profitability analysis. Drives yield improvement.', L5: 'Defines pricing policy for Liner function. Drives yield management strategy. Owns route and function profitability targets.' },
  'D12': { L1: 'Reads standard market reports. Aware of key shipping market indicators (freight indices, utilisation, fuel).', L2: 'Collects market data from multiple sources. Creates basic market summaries and competitor comparisons.', L3: 'Conducts structured market research independently. Produces competitor analysis. Identifies market trends and risks.', L4: 'Designs market intelligence frameworks. Synthesises complex data into strategic insights. Advises leadership.', L5: 'Defines market strategy based on intelligence. Leads market entry/exit decisions. Represents Meratus in industry forums.' },
  'D13': { L1: 'Aware of network structure. Identifies key domestic trade lanes. Understands routes optimise cargo flow.', L2: 'Understands route design principles. Reads network diagrams. Identifies basic efficiency issues from data.', L3: 'Analyses route performance. Uses TCE in route evaluation. Contributes inputs to trade decisions.', L4: 'Designs new routes and configurations. Structures VSA proposals. Models network-wide impact of changes.', L5: 'Sets the Meratus Liner network strategy. Makes strategic fleet-wide deployment decisions. Drives VSA alliances.' },
  'D14': { L1: 'Aware of basic vessel types and voyage concepts. Can read a simple proforma schedule.', L2: 'Reads voyage data and proforma schedules. Understands capacity, speed and consumption relationships.', L3: 'Uses voyage performance data in decisions. Interprets ship particulars. Monitors schedule reliability.', L4: 'Manages fleet performance across routes. Designs voyage optimisation strategies (weather routing, speed).', L5: 'Defines vessel operations standards and voyage planning frameworks. Owns fleet efficiency targets.' },
  'D15': { L1: 'Aware bunker is a major voyage cost. Knows main fuel types. Understands BAF surcharges.', L2: 'Understands bunkering process basics. Reads vessel fuel reports. Applies BAF correctly in quotations.', L3: 'Manages bunker ops for assigned vessels. Monitors consumption vs targets. Coordinates bunker surveys.', L4: 'Manages bunker strategy for fleet. Oversees QC and fraud prevention. Ensures environmental compliance (CII, EEXI).', L5: 'Defines bunker strategy and policy. Leads decarbonisation programmes. Manages major fuel supplier relationships.' },
  'D16': { L1: 'Aware of role of ports and terminals. Names main terminal types and their basic function.', L2: 'Understands terminal ops basics. Reads performance reports. Identifies obvious inefficiencies. Aware of KPIs.', L3: 'Uses port knowledge in decisions. Manages port-related coordination. Advises on port restrictions.', L4: 'Manages terminal ops for complex multi-port situations. Drives performance improvement. Negotiates with operators.', L5: 'Defines port operational standards. Leads port performance improvement programmes. Manages critical port relationships.' },
  'D17': { L1: 'Knows container types. Aware equipment positioning and idle containers represent significant cost.', L2: 'Monitors container inventory. Follows repositioning procedures. Reports idle containers.', L3: 'Manages equipment flow independently. Reduces idle containers. Tracks reefer container performance.', L4: 'Designs equipment positioning strategy. Manages container leasing decisions. Optimises equipment costs.', L5: 'Sets container fleet management policy. Drives fleet composition and investment strategy. Governs equipment costs.' },
  'D18': { L1: 'Aware of key financial metrics (TCE, EBITDA, CM, Route P&L). Reads basic financial reports.', L2: 'Reads financial reports and identifies variances. Understands volume/rate/revenue relationship. Basic calculations.', L3: 'Analyses route P&L independently. Prepares financial performance reports. Identifies cost optimisations.', L4: 'Designs financial analysis frameworks. Leads performance improvement based on data. Prepares management reports.', L5: 'Owns financial performance of Liner function. Presents to C-level. Drives profitability strategy.' },
  'D19': { L1: 'Aware of budgeting concept. Understands costs must be planned and managed within limits.', L2: 'Tracks actual costs vs budget for own activities. Reports variances. Follows expense approval process.', L3: 'Prepares budget for own area. Monitors and explains variances. Identifies and implements cost savings.', L4: 'Manages full budget cycle for function/region. Drives cost discipline. Prepares rolling forecasts. Leads cost initiatives.', L5: 'Sets budgeting methodology for Liner function. Owns total budget. Drives cost discipline culture.' }
};

const RAW_EXISTING_MODULES = [
  "Action Tracker 2023", "AI Workshop - AI Implementation Use Cases", "AI Workshop - Understanding the AI Landscape 2024", "Asset & Charter", "Asset Charter - Basic Understanding Marine Insurance", "Asset Charter - Bridge Resource Management BRM", "Asset Charter - Chartering Operations", "Asset Charter - Digital Inspection and Documentation Software", "Asset Charter - Engine Component Inspection Alat Berat Alat Ringan", "Asset Charter - Hydraulic System Inspection", "Asset Charter - IMO Regulation - Marine Pollution MARPOL", "Asset Charter - IMO Regulation SOLAS", "Asset Charter - Inspeksi QSHE Alat Berat Depo", "Asset Charter - Inspeksi QSHE Alat Berat Terminal", "Asset Charter - Inspeksi QSHE Operational Trucking MJT", "Asset Charter - Inspeksi QSHE Repair Container", "Asset Charter - Inspeksi QSHE Warehouse", "Asset Charter - Inspeksi QSHE Workshop", "Asset Charter - Inspeksi Steering", "Asset Charter - Introduction to Asset Charter Business", "Asset Charter - Introduction to Chartering", "Asset Charter - ISO 9001 2015", "Asset Charter - Lifting Cargoes on Flat Rack Container", "Asset Charter - Non Vessel Asset Management Truck Trailer", "Asset Charter - Non Vessel Risk Classification Measurement", "Asset Charter - Pemahaman SMS melalui QSHE Barriers", "Asset Charter - Standar Pedoman Implementasi QSHE Non Vessel", "BA - Asset Charter Introduction to QSHE Meratus", "BA - CLC Container Repair Process", "BA - CLC MLO Depot Business Marketing Strategy", "BA - CLC Receiving Delivery and Stuffing Stripping Process at Depo", "BA - Liner Basic Container", "BA - Liner Basic Knowledge Terminal Operation", "BA - Liner Introduction to MFEC", "BA - Liner Product Knowledge Meratus Liner", "BA - Liner Service Excellence", "BA - Liner Term of Shipment", "BA - Logistics Basic Knowledge Reefer", "BA - Logistics Customs Clearance", "BA - Logistics Sea Freight Domestic", "BA - Logistics Warehouse Transport", "BA - MSM Introduction to Ship Management", "BA - MTM Heavy Equipment Maintenance", "Basic CLC - Terminal Basic Knowledge Business Process CLC Terminal", "Basic CLC Depo Management", "Basic CLC Heavy Equipment", "Basic CLC Pengetahuan Bongkar Muat", "Basic CLC Penyerahan dan Penerimaan Kontainer", "Basic CLC Repair Container", "Basic English - 16 Basic Tenses", "Basic English - Email Writing", "Basic English - Negotiation Skills", "Basic English - Preposition of Time", "Basic English - Presentation Skills", "Basic Excel Function", "Basic Logistic HS Code dan Kepabeanan", "Basic Logistic Reefer Container Handling", "Basic Logistics - Commercial Account Plan", "Basic Logistics - Commercial Basic Agency International Service", "Basic Logistics - Commercial Exim dan Incoterms", "Basic Logistics - Commercial Incoterms Logistics", "Basic Logistics - Commercial Sales Skills", "Basic Logistics - Operations Operation Monitoring System Support", "Basic Logistics - Operations SCM Profit", "Basic Logistics - P3W Sales", "Basic Logistics Account Receivable", "Basic Logistics Airfreight", "Basic Logistics Basic Knowledge Business Process Logistics", "Basic Logistics Basic LCL Less than Container Load", "Basic Logistics Basic Operation", "Basic Logistics Custom Clearence", "Basic Logistics Customer Service", "Basic Logistics Industrial Project", "Basic Logistics Pemahaman Klaim Asuransi", "Basic Logistics Quality Management System", "Basic Logistics Sea Freight", "Basic Logistics Vendor Management", "Basic Logistics Warehouse Transport", "Basic Operation 3 Port Info Ship Particular", "Basic Operation 4 Loading Unloading", "Basic Operation 5 Container Inventory Management", "Basic Operation 9 IMDG Code", "Basic Public Speaking Skills", "Basic Shipping Basic Knowledge Business Process Shipping Liner", "BPM", "BPM - Assessment for Digital Transformation", "BPM - Basic Shipping Induction Inbound and Outbound Process", "BPM - Business Process Management Framework", "BPM - Core Model Framework", "BPM - Customer Centricity in Shipping Business", "BPM - Induction to Melina System", "BPM - Management of P3W", "BPM - Project Management", "BPM - Work Load Analysis for Project", "Business Control Framework 2024", "Business Negotiation Skill Malik", "Business Presentation Skill Malik", "Business Process Modelling for Level 10 Above", "CCT Manager as A Profession Officer Level", "CLC", "CLC - Backlog Management", "CLC - Block Diagram pada System Electric", "CLC - Block Diagram pada System Engine", "CLC - Block Diagram pada System Hydraulic", "CLC - Brake System", "CLC - Cara Menggunakan Common Tool", "CLC - Daily Maintenance", "CLC - Differential Final Drive", "CLC - Electrical System", "CLC - Engine System", "CLC - Failure Analisis Report", "CLC - Hydraulic System", "CLC - Hydraulic Troubleshooting", "CLC - Karakteristik Komponen Elektrik", "CLC - Karakteristik Komponen Non Elektrik", "CLC - Maintenance Process", "CLC - Mekanik Troubleshooting", "CLC - Nama Fungsi Prinsip Kerja Komponen Engine", "CLC - Pembacaan Menu pada Monitoring System", "CLC - Penanganan Claim Container", "CLC - Pengenalan Fungsi dari Komponen Accesories", "CLC - Pengenalan Fungsi dari Komponen Electric", "CLC - Pengenalan Fungsi dari Komponen Hydraulic", "CLC - Pengenalan Fungsi dari Komponen Power Train", "CLC - Pengetahuan Forklift", "CLC - Pengetahuan Reach Stacker", "CLC - Perencanaan Kebutuhan Alat Mekanis", "CLC - Perencanaan Lay Out Depo", "CLC - Pricing Strategy", "CLC - Setting and Adjustment Major Component", "CLC - Stack Hampar Container", "CLC - Stuffing Stripping", "CLC - Teknik Dasar Pengelasan", "CLC - Teknik Lepas Pasang Komponen Electric", "CLC - Teknik Survey Quality Control", "CLC - Tyre Management", "CLC - Upload Download Program pada Unit", "CLC - Yard Management system", "CLC- Penanganan Cargo", "Code of Conduct", "Code of Conduct English Version", "Code of Conduct for Manager", "Company Profile Meratus Group", "Company Regulation 2025 - 2027 Indonesian Version", "Company Regulation 2025-2027 English Version", "Contract Management System for Level 10 Above", "Control and Monitoring Malik", "Corp Comm - Branding Development", "Corp Comm - Communication Campaign", "CorpCom", "Corporate Culture 2025", "Crewing", "Crewing - Awareness ISO 37001 2016", "Crewing - Pelatihan Audit Internal ISO 37001 2016", "Edukasi Pemilahan Sampah", "Effective Collaboration Malik", "Effective Planning Malik", "EXAMPLE Basic Container", "Fin Acc - Bills to Invoice", "Fin Acc - Vendor Invoice Acceptance", "Finance", "Finance Policy - Annual Budget", "Fraud Awareness", "GA - Vehicle Maintenance", "GA - Vehicle Selling", "GA - Vehicle Usage", "GA-Asset Property", "Good Corporate Governance 2024", "Group Policy - Authority Matrix", "Group Policy - CAPEX", "Group Policy - for Level 10 Above", "Group Policy - Management of Non-Confirmity and Improvement", "Health Talk - Hari Anak - Ready Set School 2024", "Health Talk - Pencernaan Kuat Hidup Nikmat", "Health Talk - Virus Monkeypox", "HMM", "HMM - Claim Procedure", "HMM - Stowage Cargo Overview", "How To Create Contract - TPS HMM", "HR - Aspek Normatif Hubungan Industrial", "HR - Manajemen Remunerasi", "HR - Manajemen Talenta", "HR - Melaksanakan Analisa Beban Kerja", "HR - Membangun Komunikasi Organisasi Yang Efektif", "HR - Menyusun dan Merancang Kebutuhan Pembelajaran", "HR - Menyusun Kebutuhan SDM", "HR - Menyusun Peraturan Perusahaan Perjanjian Kerja", "HR - Menyusun Uraian Jabatan", "HR - Merancang Struktur Organisasi", "HR - Merumuskan Indikator Kinerja Individu", "HR - Merumuskan Proses Bisnis dan SOP MSDM", "HR - Merumuskan Strategi Manajemen SDM", "HR - Perselisihan Hubungan Industrial", "HR - Strategic Interviewing", "HRD", "Internal Audit", "Internal Audit - Enterprise Risk Management", "Introduction to E-Pact Employee Self Service", "Introduction to HRIS Time Management Module PeopleStrong Employee Self Service", "Introduction to Manager as A Profession", "Introduction to Objectives Key Results 2024", "Introduction to PeopleStrong Learning Module", "IR Management for Level 10 Above - 2025", "IT", "IT - Agile Scrum Introduction", "IT - BitLocker Implementation Security Awareness", "IT - Cybersecurity Awareness 2023", "IT - Design System", "IT - Electronic Data Interchange Introduction", "IT - Implementation of Cast Software as Software Intelligence Automated 2023", "IT - Implementing RPA to Support The Business", "IT - Incident Response", "IT - Infrastructure and Application Modernization", "IT - Introduction to Microsoft Fabric", "IT - ISO 27001 2022", "IT - Meratus ACE Support Services", "IT - Network Operation Center Introduction", "IT - Penetration Testing", "IT - Personal Data Protection Law Things You Need to Know", "IT - Remote Monitoring System for Vessel IoT Solution", "IT - Secure Access Service Edge SASE", "IT - Security Event Analysis", "IT - Test Driven Development Introduction", "IT - Understanding Security in Development and Operations Key Insights and Considerations", "IT - UX Research", "IT- Clean Architecture Design Pattern", "Leaders Talk Artificial Intelligence", "Leaders Talk Create Value Through Integrity - 2024", "Leaders Talk Economic Outlook", "Leaders Talk Hari Anti Korupsi Sedunia", "Leaders Talk Intrapreneurship Result Oriented", "Leaders Talk Intrapreneurship Sense of Ownership", "Leaders Talk Kenali Demam Berdarah dan Pencegahannya", "Leaders Talk Lesson from Eiger - From Local to the World", "Leaders Talk Nutrition Day 2024", "Leaders Talk We Aim for Customer Excellence Collaboration", "Leaders Talk We Put People First Be A Buddy", "Legal", "Legal - Amendment to Indonesian Shipping Law 101", "Legal - Implementation of Shipping Law", "Legal - Indonesia Capital Market", "Legal - Overview of Indonesia Employment Law", "Legal - Personal Data Protection", "Legal - Teknik Merancang Kontrak", "Liner - Basic Operation Transshipment", "Liner Commercial", "Liner Commercial - Basic Shipping 07 Term of Shipment", "Liner Commercial - Basic Shipping 1 Service Excellence", "Liner Commercial - Basic Shipping 10 Liner Services", "Liner Commercial - Basic Shipping 11 Basic Container", "Liner Commercial - Basic Shipping 12 Dangerous Goods", "Liner Commercial - Basic Shipping 13 Reefer Handling", "Liner Commercial - Basic Shipping 14 Breakbulk Cargo Project", "Liner Commercial - Basic Shipping 15 Cost of Failure Branch", "Liner Commercial - Basic Shipping 16 Sales Activity Customer Profile", "Liner Commercial - Basic Shipping 2 Product Knowledge and Cargo Shipment", "Liner Commercial - Basic Shipping 3 FAQ for Customer", "Liner Commercial - Basic Shipping 4 Basic Cargo Knowledge", "Liner Commercial - Basic Shipping 6 Bill of Lading", "Liner Commercial - Basic Shipping 8 Terminal Productivity Operation Pattern", "Liner Commercial - Basic Shipping Booking Process", "Liner Commercial - Basic Shipping Incoterm 2020", "Liner Commercial - Basic Shipping Marine Insurance", "Liner Commercial - Basic Shipping Meratus Extra VAS", "Liner Commercial - Basic Shipping Pengetahuan Kepabeanan dan Exim untuk Pelayaran", "Liner Commercial - Body Language", "Liner Commercial - Business Development", "Liner Commercial - Calculate Rate Freight", "Liner Commercial - Customer Contract Key Account Management", "Liner Commercial - Decision Making Unit", "Liner Commercial - Halal Cargo Assurance", "Liner Commercial - Know Your Customer", "Liner Commercial - Marine Cargo Insurance", "Liner Commercial - SOC Business", "Liner Commercial Handling Complaint", "Liner Ops", "Liner Ops - Container Procurement Methods Overview", "Liner Ops - Eva Line Empty Evacuation Plan", "Liner Ops - IDLE Container", "Liner Ops - Imbalance Mechanism Understanding Management", "Liner Ops - MFEC Basic of Navigation Passage plan", "Liner Ops - MFEC Operational Ship Performance", "Liner Ops - MFEC Voyage Efficiency knowledge", "Liner Ops - MFEC Weather Chart and Meteorology Analysis", "Liner Ops - PI Logistic Dwelling Time and Container Cycle", "Liner Ops - Seals Container Specification Depot Operation", "Liner Ops - Ship Stability", "Liner Ops - Voyage Proforma Scheduling Introduction", "Liner Trade", "Liner Trade - 01 Route Profitability", "Liner Trade - Annual Budgeting", "Liner Trade - Contribution Margin Engine Time Charter Equivalent and VOE", "Liner Trade - Customer Segmentation", "Liner Trade - Joint Slot 2024", "Liner Trade - Slot Cost", "Liner Trade - Tier Pricing", "Logistics", "Logistics - Cargo Document Handling", "Logistics - Claim and Insurance", "Logistics - ISO License Audit Process", "Logistics - Penerapan SJPH dan Penyelia Halal", "Logistics - Petty Cash BS", "Logistics - Vendor Management Sea Freight Domestic", "Management by Objective Malik", "Managing Conflicts Malik", "Managing Conversation Malik", "Managing Meeting Malik", "Managing Superiors and Colleagues Malik", "Managing Yourself Malik", "MariApps - Plan Management System", "M-Cheetah Game 2 Socialization", "MELISA - Booking Module", "MELISA - Customer Master", "MELISA - Customer Tier Pricing DSS", "MELISA - Documentation Module", "MELISA - Invoice Data Reference", "MELISA - Invoicing Module v0", "MELISA - Node Master 2024", "MELISA - OnOff Hire Module 2024", "MELISA - Penalty Booking", "MELISA - Port Call Report 2024", "MELISA - Quick Manual Container Movement and Status", "MELISA - Rate Report", "MELISA - Rating Method", "MELISA - Service Contract", "MELISA - Surcharge 2025", "MELISA - Training for SPU", "MELISA - VAS Booking", "Meratus Academy", "Meratus s New Vision and Mission", "Module PS [Others]", "M-One Customer Journey", "M-One Induction M-One for Internal Stakeholders", "MQS P3W Awareness 2026", "MSA", "MSA - Management System Data Base PBM", "MSA - Pelatihan Dasar Pengoperasian Ruber TYRE GANTRY", "MSA - Pelatihan Dasar Pengoperasian Side Loader Single Handler", "MSA - Pelatihan Harbour Mobile Crane", "MSA - Penanganan Container", "MSA - Penanganan Reefer Container", "MSA - Penanganan Uncontainerized", "MSA - Penanggulangan Kebakaran dan Pengenalan APAR", "MSA - Pendapatan Biaya PBM", "MSA - Pengetahuan Bongkar Muat 2023", "MSA - Pengetahuan Claim PBM", "MSA - Pengetahuan Container", "MSA - Pengetahuan Stowage Plan", "MSA - Pengoperasian Dasar Ship to Shore", "MSA - Perencanaan Bongkar Muat", "MSA - Perencanaan Kebutuhan TKBM", "MSA - Perencanaan Layout CY", "MSA - Stacking Container di CY", "MSM", "MSM - Painting Maintenance", "MSM Machinery - 01 Aux Mach Fuel System - 2025", "MSM Machinery - 01 Engine Performance Normal Operation 2026", "MSM Machinery - 01 Engine Plan Fuel System", "MSM Machinery - 02 Aux Mach Charge Air System", "MSM Machinery - 02 Engine Performance Overload Engine Operation", "MSM Machinery - 02 Engine Plan Charge Scavenge Air System", "MSM Machinery - 03 Engine Performance - Function of Collecting Data", "MSM Machinery - 03 Engine Plan Compression System", "MSM Machinery - 03 Fresh Water Generator 2026", "MSM Machinery - 04 Aux Mach Refrigerator 2026", "MSM Machinery - 04 Engine Performance - Heat Balance Efficiency", "MSM Machinery - 04 Engine Plan Starting Air System 2026", "MSM Machinery - 05 Aux Mach Controllable Pitch Propeller", "MSM Machinery - 05 Engine Performance Monitoring of Engine Performance", "MSM Machinery - 05 Engine Plan Cooling System", "MSM Machinery - 06 Aux Mach Lubricating Oil System 2026", "MSM Machinery - 06 Engine Performance Low load - Slow Steaming", "MSM Machinery - 06 Engine Plan Lubricating System 2026", "MSM Machinery - 07 Aux Mach Cooling System", "MSM Machinery - 08 Aux Mach Starting System 2026", "MSM Machinery - 09 Aux Mach Purification System", "MSM Marine - 01 Safety Of Life At Sea 2026", "MSM Marine - 02 Marine Polution 2026", "MSM Marine - 03 STCW 2010 - 2026", "MSM Marine - 04 MLC 2006 - 2026", "MSM Marine - 05 ISM Code 2026", "MSM Marine - 06 ISPS Code 2026", "MSM Marine - 07 Ballast Water Management 2026", "MSM Marine - 08 Garbage Management 2026", "MSM Marine - 09 Bridge Resource Management 2026", "MSM Marine - 10 Safety Drill 2026", "MSM Marine - 12 Class Survey 13 Ship Certificates 2026", "MSM Marine - 14 Crewing Management Certificate 2026", "MSM Marine - 15 UU Pelayaran 2026", "MTM", "NOVA - User Manual Procedure", "OKR Certification Leadership and Goal Setting Module 1", "OKR Certification Leadership and Goal Setting Module 2", "OKR Certification Leadership and Goal Setting Module 3", "OKR Certification Leadership and Goal Setting Module 4", "P3W Asuransi dan Klaim V 01", "Personal Development - 15 Management Essential to Become Good Manager - 2024", "Personal Development Computer Posture", "Personal Development Etika Pergaulan", "Problem Solving Malik", "Procurement", "Procurement - Basic Knowledge", "Procurement - D365 Inventory Request dan Purchase Request", "Procurement - D365 Permintaan Pembelian Aktiva Tetap PPAT", "Procurement - D365 Request for Quotation Purchase Order", "Procurement - Distribution Management", "Procurement - Finance for Non Finance", "Procurement - Inventory Management", "Procurement - Negotiation in Procurement", "Procurement - Warehouse Management", "Procurement MSM", "Procurement MSM - Econnect Flow Functionalities", "Procurement MSM - Safety Equipment Service", "Quality Awareness", "Risk Management for Level 12 Above", "Root Cause Analysis for Level 10 Above", "Safety Leadership 2024", "Sistem Informasi Ketidaksesuaian dan Pengembangan SIKaP", "SM - Docking Contract", "SM - Docking D-12", "SM - MariApps COMPASS Change Management", "SM Docking Management - Module 1 Background and Introduction to Dry Docking", "SM Docking Management - Module 2 Project Management", "SM Docking Management - Module 3 Planning and Specification", "SM Docking Management - Module 4 Tendering for Dry Dock Work", "SM Docking Management - Module 5 Dry Dock Preparation Execution and Supervision", "SM Docking Management - Module 6 Docking Undocking and Completion of Project", "SM Workshop - Generator", "SM Workshop - Global Maritime Distress Safety System", "Sosialisasi Aktivasi Registrasi CORETAX", "Sosialisasi BPJS Kesehatan Segmen PPU", "Sosialisasi BPJS Ketenagakerjaan - Manfaat Layanan BPJS", "Stakeholder Management", "The Will to Perform Malik", "Trucking", "Trucking - Abnormality Monitoring", "Trucking - Account Payable and DC Admin", "Trucking - Account Receivable and DC Admin", "Trucking - Backlog Management", "Trucking - Basic Investigation Root Cause Analysis", "Trucking - Basic Monitoring by GPS", "Trucking - Basic Transport Analyst", "Trucking - Basic Trucking Knowledge", "Trucking - Business Offering RFQ Payment Trip Cost Fuel", "Trucking - Business Overview", "Trucking - Control Tower", "Trucking - Control Tower Reporting", "Trucking - Daily Inspection P2H", "Trucking - Database Driver Personnel Management", "Trucking - Document Control", "Trucking - Dokumen Legalitas", "Trucking - Driver Management", "Trucking - Driver Performance Evaluation", "Trucking - Driver Regulation Compliance", "Trucking - Inventory Management", "Trucking - Maintenance Planning Scheduling", "Trucking - MJT Operation Overview", "Trucking - QSHE Operational Trucking", "Trucking - Recruitment Screening Driver", "Trucking - Risk Assesment HIRADC", "Trucking - Road Hazard Mapping", "Trucking - Safety Analysis Proactive Risk Identification", "Trucking - Safety Observation Card", "Trucking - Warehouse Management", "Tutorial Pelaporan SPT Tahunan Karyawan dan Pemadanan NIK-NPWP", "Vendor Management VMT and Sales Guidance"
];
const EXISTING_CLEANED = RAW_EXISTING_MODULES.map(s => s.toLowerCase().replace(/[^a-z0-9]/g, ''));

const getDomainFallback = (category, source) => {
  if (source === 'HRD' || source === 'Finance' || source === 'IT' || source === 'BPM' || source === 'CorpCom' || source === 'Legal' || source === 'Procurement') return 'Corporate Support';
  if (source === 'Logistics' || source === 'Trucking') return 'Logistics & Supply Chain';
  if (source === 'MSM' || source === 'Workshop' || source === 'Crewing') return 'Ship Management & Technical';
  if (source === 'CLC' || source === 'MSA' || source === 'OJA') return 'Terminal & Depot Operations';
  if (source === 'Drybulk' || source === 'Asset Charter') return 'Bulk & Asset Chartering';
  return 'Enterprise General';
};

const buildSeed = (category, dataString, source) => {
  const topics = dataString.split('|');
  const targets = new Set([source]);

  // Expanded Targeting Logic
  if (source === 'Asset Charter') ['Finance', 'Legal'].forEach(t => targets.add(t));
  if (source === 'Drybulk') ['Finance', 'MSA'].forEach(t => targets.add(t));
  if (source === 'Liner Commercial' || source === 'Liner Trade' || source === 'Liner International') {
    ['Liner Ops', 'Finance', 'Logistics', 'CLC'].forEach(t => targets.add(t));
  }
  if (source === 'Logistics' || source === 'Trucking') ['Finance', 'IT'].forEach(t => targets.add(t));
  
  return topics.map((topic) => {
    let track = 'Intermediate'; 
    const t = topic.toLowerCase();
    
    if (t.includes('advance') || t.includes('strategic') || t.includes('modeling') || t.includes('management system')) track = 'Advance';
    else if (t.includes('basic') || t.includes('introduction') || t.includes('awareness') || t.includes('overview') || t.includes('pengenalan')) track = 'Basic';

    const cleanT = t.replace(/[^a-z0-9]/g, '');
    const isExt = (cleanT.length > 3 && EXISTING_CLEANED.some(m => m.includes(cleanT) || cleanT.includes(m))) ? 'Yes' : 'No';
    
    // Domain Mapping Logic
    let domainStr = getDomainFallback(category, source);
    if (source.includes('Liner')) {
      const linerMatch = LINER_DOMAINS.find(d => d.name.toLowerCase().includes(t.split(' ')[0]) || t.includes(d.name.toLowerCase().split(' ')[0]));
      if (linerMatch) domainStr = linerMatch.id; 
      else domainStr = 'Liner Specialized'; // Fallback for unmapped Liner specific topics
    }

    return {
      id: crypto.randomUUID(),
      c: category,
      d: domainStr,
      t: topic.trim(),
      desc: `Comprehensive enterprise learning module covering standard practices and guidelines for ${topic.trim()} within the ${category} scope.`,
      lvl: track,
      tg: Array.from(targets),
      isExt: isExt
    };
  });
};

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

// Combine standard explicit Liner Modules with the dynamically generated massive Enterprise list
const DEDUPLICATED_CATALOG = Array.from(new Map(seedRawData.map(item => [item.t.trim().toLowerCase(), item])).values());

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
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{title}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition-all bg-white shadow-sm ${
          isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-gray-300 hover:border-indigo-300'
        }`}
      >
        <div className="flex items-center truncate">
          {Icon && <Icon className="h-4 w-4 text-indigo-400 mr-2 flex-shrink-0" />}
          <span className="truncate text-gray-700 font-semibold text-xs">
            {selectedOptions.length === 0 ? `All Options` : `${selectedOptions.length} Selected`}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl top-full left-0">
          <div className="p-2 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <span className="text-[10px] font-bold text-gray-500 uppercase">{options.length} Options</span>
            {selectedOptions.length > 0 && (
              <button onClick={() => setSelectedOptions([])} className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center">
                <FilterX className="h-3 w-3 mr-1" /> Clear
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {options.map((opt) => (
              <div key={opt.id || opt} onClick={() => handleToggle(opt.id || opt)} className="flex items-center px-2 py-1.5 hover:bg-indigo-50 rounded cursor-pointer group">
                {selectedOptions.includes(opt.id || opt) ? (
                  <CheckSquare className="h-4 w-4 text-indigo-600 mr-2 flex-shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-gray-300 group-hover:text-indigo-300 mr-2 flex-shrink-0" />
                )}
                <span className="text-xs font-medium text-gray-700 truncate">{opt.name || opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function LinerCompetencySystem() {
  const [activeTab, setActiveTab] = useState('matrix'); // matrix, behavior, catalog
  const [toast, setToast] = useState(null);

  // Auth State
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Catalog State
  const [topics, setTopics] = useState([]);
  const [editingTopic, setEditingTopic] = useState(null);
  
  // Matrix Filters
  const [selectedMatrixSubUnit, setSelectedMatrixSubUnit] = useState('ALL');
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedColDomain, setSelectedColDomain] = useState(null);

  // Catalog Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedTargets, setSelectedTargets] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
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
    
    // Gunakan collection v2 untuk reseeding data yang baru & enterprise-wide
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'liner_competency_v2', 'catalog');
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          setTopics(snap.data().topics || []);
        } else {
          setDoc(docRef, { topics: DEDUPLICATED_CATALOG }).catch(console.error);
          setTopics(DEDUPLICATED_CATALOG);
        }
      },
      (error) => console.error('Firestore Error:', error)
    );
    return () => unsubscribe();
  }, [user]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'MeratusAcademy') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      showToast('Admin Mode Unlocked');
    } else {
      showToast('Incorrect Password', 'error');
    }
  };

  const saveTopic = async (topic) => {
    let newTopics;
    if (topic.id) newTopics = topics.map((t) => (t.id === topic.id ? topic : t));
    else newTopics = [{ ...topic, id: crypto.randomUUID() }, ...topics];

    setTopics(newTopics);
    setEditingTopic(null);
    
    if (db) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'liner_competency_v2', 'catalog'), { topics: newTopics });
        showToast('Topic saved successfully');
      } catch (err) {
        showToast('Failed to save to cloud', 'error');
      }
    }
  };

  const deleteTopic = async (id) => {
    const newTopics = topics.filter((t) => t.id !== id);
    setTopics(newTopics);
    
    if (db) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'liner_competency_v2', 'catalog'), { topics: newTopics });
        showToast('Topic deleted');
      } catch (err) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  // Matrix Logic
  const filteredRoles = useMemo(() => {
    if (selectedMatrixSubUnit === 'ALL') return RAW_ROLE_DATA;
    return RAW_ROLE_DATA.filter(r => r[0] === selectedMatrixSubUnit);
  }, [selectedMatrixSubUnit]);

  // Dynamic Catalog Dropdowns
  const DYNAMIC_CATEGORIES = useMemo(() => Array.from(new Set(topics.map(t => t.c))).sort(), [topics]);
  const DYNAMIC_DOMAINS = useMemo(() => {
    const rawDomains = Array.from(new Set(topics.map(t => t.d))).sort();
    return rawDomains.map(d => {
      const match = LINER_DOMAINS.find(ld => ld.id === d);
      return match ? { id: match.id, name: `${match.id} - ${match.name}` } : { id: d, name: d };
    });
  }, [topics]);
  const DYNAMIC_TARGETS = useMemo(() => Array.from(new Set(topics.flatMap(t => t.tg))).sort(), [topics]);

  // Catalog Filter Logic
  const filteredCatalog = useMemo(() => {
    return topics.filter((item) => {
      const matchSearch = item.t.toLowerCase().includes(searchTerm.toLowerCase()) || (item.desc && item.desc.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.c);
      const matchDomain = selectedDomains.length === 0 || selectedDomains.includes(item.d);
      const matchLevel = selectedLevels.length === 0 || selectedLevels.includes(item.lvl);
      const matchTarget = selectedTargets.length === 0 || item.tg.some((t) => selectedTargets.includes(t));
      
      return matchSearch && matchCategory && matchDomain && matchLevel && matchTarget;
    });
  }, [topics, searchTerm, selectedCategories, selectedDomains, selectedLevels, selectedTargets]);

  const renderHeatmap = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0 flex flex-col h-[calc(100vh-220px)] min-h-[600px]">
      <div className="bg-slate-50 border-b border-gray-200 px-5 py-3 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-800">Role Competency Matrix</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={selectedMatrixSubUnit} 
            onChange={(e) => setSelectedMatrixSubUnit(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-1.5 pl-3 pr-8 bg-white font-medium text-gray-700"
          >
            <option value="ALL">All Liner Sub-units</option>
            {LINER_SUBUNITS.map(su => <option key={su} value={su}>{su}</option>)}
          </select>
          
          <div className="flex space-x-1.5 bg-white p-1 rounded-md border border-gray-200 shadow-sm">
            {ALL_LEVELS.map(lvl => (
              <div key={lvl} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${LEVEL_COLORS[lvl]} flex items-center`}>
                {lvl}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-auto custom-scrollbar flex-1 relative">
        <table className="w-full border-collapse min-w-max text-left">
          <thead className="bg-white sticky top-0 z-40 shadow-sm">
            <tr>
              <th colSpan="3" className="sticky left-0 bg-white z-50 border-b-2 border-r-2 border-gray-300 p-2 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Position Information</div>
              </th>
              {LINER_CATEGORIES.map(cat => {
                const domainCount = LINER_DOMAINS.filter(d => d.cat === cat.name).length;
                return (
                  <th key={cat.id} colSpan={domainCount} className="p-2 border-b-2 border-r border-gray-300 text-center bg-slate-100">
                    <div className="text-xs font-black text-slate-700 tracking-wide">{cat.name}</div>
                  </th>
                );
              })}
            </tr>
            <tr>
              <th className="sticky left-0 bg-white z-50 border-b-2 border-r border-gray-200 p-2 text-xs font-bold text-gray-600 w-28">Sub-Unit</th>
              <th className="sticky left-[112px] bg-white z-50 border-b-2 border-r border-gray-200 p-2 text-xs font-bold text-gray-600 w-16 text-center">Tier</th>
              <th className="sticky left-[176px] bg-white z-50 border-b-2 border-r-2 border-gray-300 p-2 text-xs font-bold text-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-64">Position Title</th>
              
              {LINER_DOMAINS.map(domain => (
                <th 
                  key={domain.id} 
                  className={`p-2 border-b-2 border-r border-gray-200 cursor-pointer hover:bg-indigo-50 transition-colors ${selectedColDomain === domain.id ? 'bg-indigo-100' : 'bg-white'}`}
                  title={domain.name}
                  onClick={() => setSelectedColDomain(selectedColDomain === domain.id ? null : domain.id)}
                >
                  <div className="flex flex-col items-center justify-end h-32 w-10">
                    <span className="text-[10px] font-bold text-indigo-900 mb-2">{domain.id}</span>
                    <span className="text-[10px] font-semibold text-gray-600 writing-vertical transform rotate-180 text-left whitespace-nowrap overflow-hidden max-h-24">
                      {domain.name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredRoles.map((roleRow, idx) => {
              const [su, tier, title, ...domainVals] = roleRow;
              return (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                  <td className="sticky left-0 bg-white group-hover:bg-slate-50 z-20 p-2 border-r border-gray-200 text-xs font-semibold text-gray-600 truncate">{su}</td>
                  <td className="sticky left-[112px] bg-white group-hover:bg-slate-50 z-20 p-2 border-r border-gray-200 text-[10px] text-center font-bold text-slate-500 bg-slate-50/50">{tier}</td>
                  <td className="sticky left-[176px] bg-white group-hover:bg-slate-50 z-20 p-2 border-r-2 border-gray-300 text-xs font-bold text-gray-900 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] truncate">{title}</td>
                  
                  {LINER_DOMAINS.map((d, dIdx) => {
                    const level = domainVals[dIdx] || '';
                    const colorClass = LEVEL_COLORS[level] || LEVEL_COLORS[''];
                    const isHovered = hoveredCell === `${idx}-${d.id}`;
                    const isColSelected = selectedColDomain === d.id;
                    
                    return (
                      <td 
                        key={d.id} 
                        className={`p-1.5 border-r border-gray-100 text-center relative ${isColSelected ? 'bg-indigo-50/50' : ''}`}
                        onMouseEnter={() => setHoveredCell(`${idx}-${d.id}`)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {level && (
                          <div className={`w-full h-7 rounded border flex items-center justify-center text-[10px] font-black cursor-help transition-transform ${colorClass} ${isHovered ? 'scale-110 shadow-md ring-1 ring-black/10 z-10' : ''}`}>
                            {level}
                          </div>
                        )}
                        
                        {isHovered && level && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 w-64 bg-slate-800 text-white text-xs rounded-lg shadow-xl p-3 pointer-events-none">
                            <div className="font-bold text-indigo-300 mb-1">{title}</div>
                            <div className="font-semibold text-gray-300 border-b border-slate-600 pb-1 mb-1">{d.name} ({level})</div>
                            <div className="text-[10px] leading-relaxed text-gray-200">
                              {BEHAVIORAL_INDICATORS[d.id]?.[level] || 'No indicator data.'}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-100 p-3 text-xs text-gray-500 border-t border-gray-200 flex justify-between items-center flex-shrink-0 font-medium">
        <span>Showing {filteredRoles.length} positions. Hover over matrix cells for behavioral indicators. Click a column header to highlight.</span>
      </div>
    </div>
  );

  const renderBehavior = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
        <Award className="w-8 h-8 text-indigo-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Competency Level Descriptors</h2>
          <p className="text-sm text-gray-500">Universal behavioral indicators for the 19 Domains across all Liner Sub-units.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {LINER_DOMAINS.map(domain => (
          <div key={domain.id} className="bg-slate-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition">
            <div className="bg-indigo-50/50 px-4 py-3 border-b border-gray-200">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">{domain.id} · {domain.cat}</span>
              <h3 className="text-sm font-bold text-gray-900 leading-tight mt-1">{domain.name}</h3>
            </div>
            <div className="p-4 flex-1 space-y-4">
              {ALL_LEVELS.map(lvl => (
                <div key={lvl} className="flex items-start">
                  <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold border mr-3 flex-shrink-0 ${LEVEL_COLORS[lvl]}`}>
                    {lvl}
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed font-medium">
                    {BEHAVIORAL_INDICATORS[domain.id]?.[lvl] || 'Pending descriptor.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative z-30">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between mb-4 border-b border-gray-100 pb-4 gap-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <div>
            <h2 className="text-lg font-bold text-gray-800">Enterprise Training Catalog</h2>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Including Liner Specific & Non-Liner General Enterprise Domains</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {(selectedTargets.length > 0 || selectedCategories.length > 0 || selectedDomains.length > 0 || selectedLevels.length > 0 || searchTerm) && (
            <button
              onClick={() => {
                setSearchTerm(''); setSelectedTargets([]); setSelectedCategories([]); setSelectedDomains([]); setSelectedLevels([]);
              }}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-lg transition"
            >
              <FilterX className="w-3.5 h-3.5 mr-1" /> Reset Filters
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setEditingTopic({ t: '', c: LINER_CATEGORIES[0].name, d: 'Unmapped', desc: '', lvl: 'Intermediate', tg: [], isExt: 'No' })}
              className="flex items-center text-xs font-bold text-white bg-indigo-600 py-1.5 px-3 rounded-lg hover:bg-indigo-700 transition shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Topic
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="relative">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <MultiSelectDropdown title="Category" options={DYNAMIC_CATEGORIES} selectedOptions={selectedCategories} setSelectedOptions={setSelectedCategories} icon={LayoutDashboard} />
        <MultiSelectDropdown title="Mapped Domain" options={DYNAMIC_DOMAINS} selectedOptions={selectedDomains} setSelectedOptions={setSelectedDomains} icon={Target} />
        <MultiSelectDropdown title="Applicable To (SBU)" options={DYNAMIC_TARGETS} selectedOptions={selectedTargets} setSelectedOptions={setSelectedTargets} icon={Users} />
        <MultiSelectDropdown title="Difficulty" options={CATALOG_LEVELS} selectedOptions={selectedLevels} setSelectedOptions={setSelectedLevels} icon={GraduationCap} />
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[600px] custom-scrollbar">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
            <tr>
              {isAdmin && <th className="px-4 py-3 font-bold text-gray-600 w-16">Action</th>}
              <th className="px-4 py-3 font-bold text-gray-600 w-32">Mapped Domain</th>
              <th className="px-4 py-3 font-bold text-gray-600 max-w-[150px]">Category</th>
              <th className="px-4 py-3 font-bold text-gray-600 w-1/3">Training Topic</th>
              <th className="px-4 py-3 font-bold text-gray-600 text-center">Level</th>
              <th className="px-4 py-3 font-bold text-gray-600">Target SBU / Entity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredCatalog.length > 0 ? filteredCatalog.map(row => {
              const isLinerDomain = row.d.startsWith('D') && row.d.length <= 3;
              return (
                <tr key={row.id} className="hover:bg-indigo-50 transition">
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button onClick={() => setEditingTopic(row)} className="text-gray-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { if(confirm('Delete topic?')) deleteTopic(row.id); }} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    {isLinerDomain ? (
                      <span className="px-2 py-1 rounded text-[10px] font-black border bg-indigo-100 text-indigo-800 border-indigo-200 uppercase tracking-wider">{row.d}</span>
                    ) : (
                      <span className="px-2 py-1 rounded text-[10px] font-bold border bg-gray-100 text-gray-600 border-gray-200 truncate block max-w-[150px]" title={row.d}>{row.d}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[11px] font-semibold text-gray-600 truncate max-w-[180px]" title={row.c}>{row.c}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-gray-800 whitespace-normal">{row.t}</div>
                    <div className="text-[10px] text-gray-500 line-clamp-2 mt-0.5 whitespace-normal">{row.desc}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${row.lvl === 'Advance' ? 'bg-amber-50 text-amber-700 border-amber-200' : row.lvl === 'Intermediate' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {row.lvl}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {row.tg.map((su, idx) => (
                        <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded">{su}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500 font-medium">No topics found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-gray-500 font-medium">Showing {filteredCatalog.length} of {topics.length} global topics.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[200] animate-fade-in-down">
          <div className={`flex items-center px-4 py-3 rounded-lg shadow-lg border ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
            {toast.type === 'error' ? <X className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
            <span className="font-bold text-sm">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="bg-[#0f172a] text-white shadow-md sticky top-0 z-[60]">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-inner border border-indigo-500/50">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white leading-none">Liner Competency System</h1>
                <p className="text-indigo-200 text-[10px] md:text-xs font-bold mt-1 tracking-wider uppercase">Integrated Scope Map · Role Based</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex bg-[#1e293b] p-1 rounded-lg border border-slate-700">
                <button onClick={() => setActiveTab('matrix')} className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'matrix' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                  <Network className="w-4 h-4 mr-2" /> Matrix
                </button>
                <button onClick={() => setActiveTab('behavior')} className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'behavior' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                  <Award className="w-4 h-4 mr-2" /> Behaviors
                </button>
                <button onClick={() => setActiveTab('catalog')} className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                  <BookOpen className="w-4 h-4 mr-2" /> Catalog
                </button>
              </div>

              {isAdmin ? (
                <button onClick={() => {setIsAdmin(false); showToast('Admin Mode Locked');}} className="flex items-center px-3 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition">
                  <Unlock className="w-4 h-4 mr-1.5" /> Admin On
                </button>
              ) : (
                <button onClick={() => setShowAdminLogin(true)} className="flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-xs font-bold rounded-lg transition">
                  <Lock className="w-4 h-4 mr-1.5" /> Edit Mode
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Users className="w-6 h-6"/></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mapped Roles</p>
              <p className="text-2xl font-black text-gray-900">67</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Target className="w-6 h-6"/></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Liner Domains</p>
              <p className="text-2xl font-black text-gray-900">19</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><BookOpen className="w-6 h-6"/></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Enterprise Modules</p>
              <p className="text-2xl font-black text-gray-900">{topics.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><LayoutDashboard className="w-6 h-6"/></div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Training Categories</p>
              <p className="text-2xl font-black text-gray-900">{DYNAMIC_CATEGORIES.length}</p>
            </div>
          </div>
        </div>

        {activeTab === 'matrix' && renderHeatmap()}
        {activeTab === 'behavior' && renderBehavior()}
        {activeTab === 'catalog' && renderCatalog()}
      </main>

      {/* Admin Modals */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center border border-gray-100">
            <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4"><Lock className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Unlock</h3>
            <p className="text-xs text-gray-500 mb-6 font-medium">Enter password to manage Training Catalog.</p>
            <input
              type="password"
              placeholder="Password..."
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="w-full text-center text-sm px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4 font-bold"
            />
            <div className="flex space-x-3">
              <button onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-bold transition">Cancel</button>
              <button onClick={handleAdminLogin} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition shadow-sm">Unlock</button>
            </div>
          </div>
        </div>
      )}

      {editingTopic && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="bg-indigo-900 px-5 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center"><Edit className="w-5 h-5 mr-2" /> {editingTopic.id ? 'Edit Topic' : 'New Topic'}</h3>
              <button onClick={() => setEditingTopic(null)} className="text-indigo-200 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto bg-slate-50 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Topic Name</label>
                <input type="text" value={editingTopic.t} onChange={e => setEditingTopic({...editingTopic, t: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea rows="2" value={editingTopic.desc} onChange={e => setEditingTopic({...editingTopic, desc: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category</label>
                  <input list="cat-list" value={editingTopic.c} onChange={e => setEditingTopic({...editingTopic, c: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium" />
                  <datalist id="cat-list">{DYNAMIC_CATEGORIES.map(c => <option key={c} value={c} />)}</datalist>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Domain Mapping (Liner D1-D19 or Text)</label>
                  <input list="dom-list" value={editingTopic.d} onChange={e => setEditingTopic({...editingTopic, d: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium" />
                  <datalist id="dom-list">
                    {LINER_DOMAINS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    <option value="Corporate Support" />
                    <option value="Logistics & Supply Chain" />
                    <option value="Ship Management & Tech" />
                  </datalist>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Difficulty Level</label>
                  <select value={editingTopic.lvl} onChange={e => setEditingTopic({...editingTopic, lvl: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium">
                    {CATALOG_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Entities / SBUs (Comma separated)</label>
                  <input type="text" value={editingTopic.tg.join(', ')} onChange={e => setEditingTopic({...editingTopic, tg: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white font-medium" placeholder="e.g. Asset Charter, Logistics" />
                </div>
              </div>
            </div>
            <div className="bg-white px-5 py-4 border-t flex justify-end space-x-3">
              <button onClick={() => setEditingTopic(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-bold">Cancel</button>
              <button onClick={() => saveTopic(editingTopic)} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold flex items-center"><Save className="w-4 h-4 mr-2"/> Save Topic</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .writing-vertical { writing-mode: vertical-rl; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out; }
      `}} />
    </div>
  );
}