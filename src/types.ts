export interface CoverPageData {
  universityName: string;
  department: string;
  reportType: string;
  courseCode: string;
  courseTitle: string;
  expNo: string;
  expName: string;
  performanceDate: string;
  submissionDate: string;
  studentName: string;
  studentId: string;
  semester: string;
  section: string;
  group: string;
  instructorName: string;
  instructorDesignation: string;
  instructorDepartment: string;
  borderStyle: 'single' | 'double' | 'bold' | 'none';
}

export interface AssignmentCoverData {
  universityName: string;
  department: string;
  courseName: string;
  courseCode: string;
  assignmentName: string;
  submissionDate: string;
  academicSession: string;
  studentName: string;
  studentId: string;
  section: string;
  instructorName: string;
  instructorDesignation: string;
  instructorDepartment: string;
  borderStyle: 'single' | 'double' | 'bold' | 'none';
  // Backwards-compatible aliases
  courseTitle?: string;
  assignmentTopic?: string;
  assignmentNo?: string;
  semester?: string;
  reportType?: string;
}

export interface CtCoverData {
  universityName: string;
  department: string;
  ctNumber: string;
  courseCode: string;
  courseTitle: string;
  studentName: string;
  studentId: string;
  section: string;
  semester: string;
  date: string;
  instructorName: string;
  instructorDesignation: string;
  instructorDepartment: string;
  borderStyle: 'single' | 'double' | 'bold' | 'none';
}

export interface PresetExperiment {
  no: string;
  name: string;
}

export interface PresetCourse {
  code: string;
  title: string;
  department: string;
}
