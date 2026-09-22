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

export interface PresetExperiment {
  no: string;
  name: string;
}
