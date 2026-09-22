import { CoverPageData, PresetExperiment } from '../types';

export const DEFAULT_COVER_DATA: CoverPageData = {
  universityName: 'UNIVERSITY OF ASIA PACIFIC',
  department: 'DEPARTMENT OF CSE',
  reportType: 'Lab Report – Spring 2026',
  courseCode: 'EEE 102',
  courseTitle: 'Electrical Circuits Lab',
  expNo: '02',
  expName: 'Verification of Ohm’s Law.',
  performanceDate: '15 February, 2026',
  submissionDate: '22 February, 2026',
  studentName: 'MD. TANVIR AHMED',
  studentId: '25201125',
  semester: '1st Year 2nd Semester',
  section: 'A',
  group: 'A1',
  instructorName: 'M. ABDULLAH AL-AMIN',
  instructorDesignation: 'ASSISTANT PROFESSOR',
  instructorDepartment: 'DEPARTMENT OF EEE, UAP',
  borderStyle: 'single',
};

export const PRESET_EXPERIMENTS: PresetExperiment[] = [
  {
    no: '01',
    name: 'Familiarization with Resistors, Breadboard, DC Power Supply and Multimeter',
  },
  {
    no: '02',
    name: 'Verification of Ohm’s Law.',
  },
  {
    no: '03',
    name: 'Verification of Kirchhoff’s Voltage Law (KVL)',
  },
  {
    no: '04',
    name: "Verification of Kirchhoff's Current Law (KCL)",
  },
  {
    no: '05',
    name: 'Verification of Superposition Theorem.',
  },
  {
    no: '06',
    name: "Verification of Thevenin's Theorem.",
  },
  {
    no: '07',
    name: 'Verification of Maximum Power Transfer Theorem.',
  },
  {
    no: '08',
    name: 'Study of different types of switches.',
  },
  {
    no: '09',
    name: 'Study of I-V Characteristics of General-purpose Diode and Zener Diode.',
  },
  {
    no: '10',
    name: 'Study of Application of Diodes: Rectification – Half Wave (HW) and Full Wave (FW) Rectification.',
  },
];

export const PRESET_DEPARTMENTS = [
  'DEPARTMENT OF CSE',
  'DEPARTMENT OF EEE',
  'DEPARTMENT OF CE',
  'DEPARTMENT OF PHARMACY',
  'DEPARTMENT OF ARCHITECTURE',
  'DEPARTMENT OF BUSINESS ADMINISTRATION',
];

export const PRESET_SEMESTERS = [
  'Lab Report – Spring 2026',
  'Lab Report – Fall 2026',
  'Lab Report – Summer 2026',
  'Assignment – Spring 2026',
  'Project Report – Spring 2026',
];

export const PRESET_INSTRUCTORS = [
  {
    name: 'M. ABDULLAH AL-AMIN',
    designation: 'ASSISTANT PROFESSOR',
    department: 'EEE, UAP',
  },
  {
    name: 'DR. G. R. AHMED JAMAL',
    designation: 'PROFESSOR',
    department: 'EEE, UAP',
  },
  {
    name: 'TASNUVA TASNEEM',
    designation: 'ASSOCIATE PROFESSOR',
    department: 'EEE, UAP',
  },
  {
    name: 'MD. MASUM RANA',
    designation: 'LECTURER',
    department: 'EEE, UAP',
  },
];
