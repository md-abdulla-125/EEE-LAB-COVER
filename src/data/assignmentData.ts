import { AssignmentCoverData, PresetCourse } from '../types';

export interface UapDepartmentItem {
  id: string;
  name: string;
  shortCode: string;
  fullDeptName: string;
}

export const UAP_ALL_DEPARTMENTS: UapDepartmentItem[] = [
  {
    id: 'CSE',
    name: 'Computer Science and Engineering (CSE)',
    shortCode: 'CSE',
    fullDeptName: 'Department of Computer Science and Engineering',
  },
  {
    id: 'EEE',
    name: 'Electrical and Electronic Engineering (EEE)',
    shortCode: 'EEE',
    fullDeptName: 'Department of Electrical and Electronic Engineering',
  },
  {
    id: 'CE',
    name: 'Civil Engineering (CE)',
    shortCode: 'CE',
    fullDeptName: 'Department of Civil Engineering',
  },
  {
    id: 'BBA',
    name: 'Business Administration (BBA)',
    shortCode: 'BBA',
    fullDeptName: 'Department of Business Administration',
  },
  {
    id: 'ARCH',
    name: 'Architecture (ARCH)',
    shortCode: 'ARCH',
    fullDeptName: 'Department of Architecture',
  },
  {
    id: 'ENG',
    name: 'English',
    shortCode: 'English',
    fullDeptName: 'Department of English',
  },
  {
    id: 'LHR',
    name: 'Law and Human Rights (LHR)',
    shortCode: 'LHR',
    fullDeptName: 'Department of Law and Human Rights',
  },
  {
    id: 'PHARM',
    name: 'Pharmacy',
    shortCode: 'Pharmacy',
    fullDeptName: 'Department of Pharmacy',
  },
  {
    id: 'MATH',
    name: 'Mathematics',
    shortCode: 'Mathematics',
    fullDeptName: 'Department of Mathematics',
  },
  {
    id: 'BSH',
    name: 'Basic Sciences and Humanities (BS&H)',
    shortCode: 'BS&H',
    fullDeptName: 'Department of Basic Sciences and Humanities',
  },
];

export const DEFAULT_ASSIGNMENT_DATA: AssignmentCoverData = {
  universityName: 'UNIVERSITY OF ASIA PACIFIC',
  department: 'EEE',
  courseName: 'Electrical Circuit',
  courseCode: 'EEE 101',
  assignmentName: 'Assignment Name',
  submissionDate: '2026-10-24',
  academicSession: 'Spring 2026',
  studentName: 'Md. Abdullah Sarkar Shihab',
  studentId: '24108116',
  section: 'C',
  instructorName: '',
  instructorDesignation: 'Associate Professor',
  instructorDepartment: 'Department of EEE',
  borderStyle: 'single',
  // Backward compatibility
  courseTitle: 'Electrical Circuit',
  assignmentTopic: 'Assignment Name',
  assignmentNo: '01',
  semester: 'Spring 2026',
  reportType: 'Assignment – Spring 2026',
};

export const PRESET_ASSIGNMENT_COURSES: PresetCourse[] = [
  {
    code: 'EEE 101',
    title: 'Electrical Circuit',
    department: 'EEE',
  },
  {
    code: 'EEE 103',
    title: 'Electronics I',
    department: 'EEE',
  },
  {
    code: 'CSE 101',
    title: 'Discrete Mathematics',
    department: 'CSE',
  },
  {
    code: 'CSE 103',
    title: 'Structured Programming Language',
    department: 'CSE',
  },
  {
    code: 'CE 101',
    title: 'Engineering Mechanics',
    department: 'CE',
  },
  {
    code: 'BBA 101',
    title: 'Principles of Management',
    department: 'BBA',
  },
  {
    code: 'ARC 101',
    title: 'Design Studio I',
    department: 'ARCH',
  },
  {
    code: 'ENG 101',
    title: 'English Language Skills',
    department: 'ENG',
  },
  {
    code: 'LAW 101',
    title: 'Jurisprudence & Legal Theory',
    department: 'LHR',
  },
  {
    code: 'PHR 101',
    title: 'Inorganic Pharmacy',
    department: 'PHARM',
  },
  {
    code: 'MTH 101',
    title: 'Differential and Integral Calculus',
    department: 'MATH',
  },
];
