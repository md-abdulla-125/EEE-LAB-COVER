import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  Info,
  Check,
  Copy,
  Printer,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';

export interface CourseRow {
  id: string;
  code: string;
  title: string;
  credit: number;
  grade: string;
  marks?: number | '';
}

export interface SemesterEntry {
  id: string;
  name: string;
  credits: number;
  gpa: number;
}

// UGC Bangladesh Standard Grading Scale
export const UGC_GRADE_SCALE = [
  { minMarks: 80, maxMarks: 100, letter: 'A+', points: 4.00, remark: 'Outstanding' },
  { minMarks: 75, maxMarks: 79, letter: 'A', points: 3.75, remark: 'Excellent' },
  { minMarks: 70, maxMarks: 74, letter: 'A-', points: 3.50, remark: 'Very Good' },
  { minMarks: 65, maxMarks: 69, letter: 'B+', points: 3.25, remark: 'Good' },
  { minMarks: 60, maxMarks: 64, letter: 'B', points: 3.00, remark: 'Satisfactory' },
  { minMarks: 55, maxMarks: 59, letter: 'B-', points: 2.75, remark: 'Above Average' },
  { minMarks: 50, maxMarks: 54, letter: 'C+', points: 2.50, remark: 'Average' },
  { minMarks: 45, maxMarks: 49, letter: 'C', points: 2.25, remark: 'Below Average' },
  { minMarks: 40, maxMarks: 44, letter: 'D', points: 2.00, remark: 'Pass' },
  { minMarks: 0, maxMarks: 39, letter: 'F', points: 0.00, remark: 'Fail' },
];

export const GRADE_POINTS_MAP: Record<string, number> = {
  'A+': 4.00,
  'A': 3.75,
  'A-': 3.50,
  'B+': 3.25,
  'B': 3.00,
  'B-': 2.75,
  'C+': 2.50,
  'C': 2.25,
  'D': 2.00,
  'F': 0.00,
  'I': 0.00,
  'W': 0.00,
};

// Convert marks into UGC Grade
export const getGradeFromMarks = (marks: number): { letter: string; points: number } => {
  if (marks >= 80) return { letter: 'A+', points: 4.00 };
  if (marks >= 75) return { letter: 'A', points: 3.75 };
  if (marks >= 70) return { letter: 'A-', points: 3.50 };
  if (marks >= 65) return { letter: 'B+', points: 3.25 };
  if (marks >= 60) return { letter: 'B', points: 3.00 };
  if (marks >= 55) return { letter: 'B-', points: 2.75 };
  if (marks >= 50) return { letter: 'C+', points: 2.50 };
  if (marks >= 45) return { letter: 'C', points: 2.25 };
  if (marks >= 40) return { letter: 'D', points: 2.00 };
  return { letter: 'F', points: 0.00 };
};

// UGC Degree Standing
export const getUgcDegreeStanding = (gpa: number) => {
  if (gpa >= 3.75) return { label: 'First Class with Distinction', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', badge: 'bg-emerald-600' };
  if (gpa >= 3.00) return { label: 'First Class', color: 'text-blue-700 bg-blue-50 border-blue-200', badge: 'bg-blue-600' };
  if (gpa >= 2.25) return { label: 'Second Class', color: 'text-amber-700 bg-amber-50 border-amber-200', badge: 'bg-amber-600' };
  if (gpa >= 2.00) return { label: 'Third Class (Pass)', color: 'text-orange-700 bg-orange-50 border-orange-200', badge: 'bg-orange-600' };
  return { label: 'Fail / Academic Probation', color: 'text-rose-700 bg-rose-50 border-rose-200', badge: 'bg-rose-600' };
};

const DEFAULT_COURSES: CourseRow[] = [
  { id: '1', code: 'CSE 101', title: 'Structured Programming', credit: 3.0, grade: 'A+' },
  { id: '2', code: 'CSE 102', title: 'Structured Programming Sessional', credit: 1.5, grade: 'A+' },
  { id: '3', code: 'MTH 101', title: 'Differential and Integral Calculus', credit: 3.0, grade: 'A' },
  { id: '4', code: 'PHY 101', title: 'Physics', credit: 3.0, grade: 'A-' },
  { id: '5', code: 'PHY 102', title: 'Physics Sessional', credit: 1.5, grade: 'A+' },
  { id: '6', code: 'ENG 101', title: 'English Language Skills', credit: 3.0, grade: 'B+' },
];

const DEFAULT_SEMESTERS: SemesterEntry[] = [
  { id: 's1', name: '1st Year 1st Semester', credits: 18.0, gpa: 3.82 },
  { id: 's2', name: '1st Year 2nd Semester', credits: 19.5, gpa: 3.75 },
  { id: 's3', name: '2nd Year 1st Semester', credits: 18.5, gpa: 3.68 },
  { id: 's4', name: '2nd Year 2nd Semester', credits: 19.0, gpa: 3.85 },
];

export const CgpaCalculator: React.FC = () => {
  const [calculatorTab, setCalculatorTab] = useState<'sgpa' | 'cgpa' | 'target' | 'scale'>('sgpa');

  // SGPA state
  const [courses, setCourses] = useState<CourseRow[]>(() => {
    try {
      const saved = localStorage.getItem('uap_ugc_sgpa_courses');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_COURSES;
  });

  const [inputMode, setInputMode] = useState<'grade' | 'marks'>('grade');

  // CGPA Multi-semester state
  const [semesters, setSemesters] = useState<SemesterEntry[]>(() => {
    try {
      const saved = localStorage.getItem('uap_ugc_semesters_list');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SEMESTERS;
  });

  // Quick 2-Field CGPA state
  const [quickPrevCredits, setQuickPrevCredits] = useState<number | ''>(55.5);
  const [quickPrevCgpa, setQuickPrevCgpa] = useState<number | ''>(3.78);
  const [quickCurrCredits, setQuickCurrCredits] = useState<number | ''>(18.0);
  const [quickCurrGpa, setQuickCurrGpa] = useState<number | ''>(3.85);

  // Target Forecast state
  const [targetDegreeCredits, setTargetDegreeCredits] = useState<number | ''>(144.0);
  const [targetCurrentCredits, setTargetCurrentCredits] = useState<number | ''>(74.0);
  const [targetCurrentCgpa, setTargetCurrentCgpa] = useState<number | ''>(3.62);
  const [targetGoalCgpa, setTargetGoalCgpa] = useState<number | ''>(3.75);

  const [copiedNotification, setCopiedNotification] = useState(false);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('uap_ugc_sgpa_courses', JSON.stringify(courses));
    } catch {
      // ignore
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem('uap_ugc_semesters_list', JSON.stringify(semesters));
    } catch {
      // ignore
    }
  }, [semesters]);

  // SGPA Calculations
  const sgpaStats = useMemo(() => {
    let totalRegisteredCredits = 0;
    let totalEarnedCredits = 0; // Excludes F
    let totalQualityPoints = 0;
    const gradeBreakdown: Record<string, number> = {};

    courses.forEach((c) => {
      const credit = Number(c.credit) || 0;
      const pts = GRADE_POINTS_MAP[c.grade] ?? 0;
      totalRegisteredCredits += credit;
      if (c.grade !== 'F' && c.grade !== 'I' && c.grade !== 'W') {
        totalEarnedCredits += credit;
      }
      totalQualityPoints += credit * pts;
      gradeBreakdown[c.grade] = (gradeBreakdown[c.grade] || 0) + 1;
    });

    const calculatedSgpa = totalRegisteredCredits > 0 ? totalQualityPoints / totalRegisteredCredits : 0;
    return {
      totalRegisteredCredits: Number(totalRegisteredCredits.toFixed(2)),
      totalEarnedCredits: Number(totalEarnedCredits.toFixed(2)),
      totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
      sgpa: Number(calculatedSgpa.toFixed(2)),
      rawSgpa: calculatedSgpa,
      gradeBreakdown,
    };
  }, [courses]);

  // Multi-semester Cumulative CGPA Calculations
  const multiSemesterStats = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    semesters.forEach((s) => {
      const c = Number(s.credits) || 0;
      const g = Number(s.gpa) || 0;
      totalCredits += c;
      totalPoints += c * g;
    });
    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return {
      totalCredits: Number(totalCredits.toFixed(2)),
      totalPoints: Number(totalPoints.toFixed(2)),
      cgpa: Number(cgpa.toFixed(2)),
      rawCgpa: cgpa,
    };
  }, [semesters]);

  // Quick Cumulative CGPA
  const quickCgpaResult = useMemo(() => {
    const prevC = Number(quickPrevCredits) || 0;
    const prevG = Number(quickPrevCgpa) || 0;
    const currC = Number(quickCurrCredits) || 0;
    const currG = Number(quickCurrGpa) || 0;

    const totalC = prevC + currC;
    const totalP = prevC * prevG + currC * currG;
    const newCgpa = totalC > 0 ? totalP / totalC : 0;

    return {
      totalCredits: totalC,
      newCgpa: Number(newCgpa.toFixed(2)),
      pointsDifference: Number((newCgpa - prevG).toFixed(2)),
    };
  }, [quickPrevCredits, quickPrevCgpa, quickCurrCredits, quickCurrGpa]);

  // Target Forecast Calculations
  const targetForecast = useMemo(() => {
    const totalReq = Number(targetDegreeCredits) || 0;
    const completed = Number(targetCurrentCredits) || 0;
    const currentCgpa = Number(targetCurrentCgpa) || 0;
    const targetCgpa = Number(targetGoalCgpa) || 0;

    const remainingCredits = Math.max(0, totalReq - completed);
    if (remainingCredits <= 0 || totalReq <= 0) {
      return {
        remainingCredits: 0,
        requiredGpa: 0,
        status: 'completed',
        message: 'You have completed all degree credits!',
      };
    }

    const currentPoints = completed * currentCgpa;
    const targetPoints = totalReq * targetCgpa;
    const requiredPoints = targetPoints - currentPoints;
    const requiredGpa = requiredPoints / remainingCredits;

    let status: 'achieved' | 'easy' | 'moderate' | 'challenging' | 'impossible';
    let message = '';

    if (requiredGpa <= 0) {
      status = 'achieved';
      message = 'Your current CGPA is already well above your target!';
    } else if (requiredGpa <= 3.25) {
      status = 'easy';
      message = 'Very achievable! Maintain steady grades across remaining courses.';
    } else if (requiredGpa <= 3.75) {
      status = 'moderate';
      message = 'Achievable with focused preparation in your major courses.';
    } else if (requiredGpa <= 4.00) {
      status = 'challenging';
      message = 'Requires consistent top grades (A / A+) in all remaining courses.';
    } else {
      status = 'impossible';
      message = `Math limit exceeded: requires ${requiredGpa.toFixed(2)} GPA (maximum possible is 4.00). Try adjusting target or enrolling in extra credits.`;
    }

    return {
      remainingCredits: Number(remainingCredits.toFixed(1)),
      requiredGpa: Number(requiredGpa.toFixed(2)),
      status,
      message,
    };
  }, [targetDegreeCredits, targetCurrentCredits, targetCurrentCgpa, targetGoalCgpa]);

  // Course management helpers
  const handleAddCourse = () => {
    const newCourse: CourseRow = {
      id: Date.now().toString(),
      code: `Course ${courses.length + 1}`,
      title: '',
      credit: 3.0,
      grade: 'A',
      marks: '',
    };
    setCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (id: string, updates: Partial<CourseRow>) => {
    setCourses(
      courses.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates };
        if (updates.marks !== undefined && updates.marks !== '') {
          const auto = getGradeFromMarks(Number(updates.marks));
          updated.grade = auto.letter;
        }
        return updated;
      })
    );
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const handleResetCourses = () => {
    if (window.confirm('Reset all courses to sample semester courses?')) {
      setCourses(DEFAULT_COURSES);
    }
  };

  const handleClearAllCourses = () => {
    setCourses([
      { id: '1', code: '', title: '', credit: 3.0, grade: 'A' },
      { id: '2', code: '', title: '', credit: 3.0, grade: 'A' },
      { id: '3', code: '', title: '', credit: 1.5, grade: 'A' },
    ]);
  };

  // Multi-Semester helpers
  const handleAddSemester = () => {
    const count = semesters.length + 1;
    const year = Math.ceil(count / 2);
    const sem = count % 2 === 1 ? 1 : 2;
    setSemesters([
      ...semesters,
      {
        id: Date.now().toString(),
        name: `${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year ${sem}${sem === 1 ? 'st' : 'nd'} Semester`,
        credits: 18.0,
        gpa: 3.75,
      },
    ]);
  };

  const handleUpdateSemester = (id: string, updates: Partial<SemesterEntry>) => {
    setSemesters(semesters.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleDeleteSemester = (id: string) => {
    setSemesters(semesters.filter((s) => s.id !== id));
  };

  // Quick fill from SGPA
  const handlePushSgpaToMulti = () => {
    if (sgpaStats.totalRegisteredCredits <= 0) return;
    const name = `Semester ${semesters.length + 1}`;
    setSemesters([
      ...semesters,
      {
        id: Date.now().toString(),
        name,
        credits: sgpaStats.totalRegisteredCredits,
        gpa: sgpaStats.sgpa,
      },
    ]);
    setCalculatorTab('cgpa');
  };

  // Copy Summary text
  const handleCopySummary = () => {
    const standing = getUgcDegreeStanding(calculatorTab === 'sgpa' ? sgpaStats.sgpa : multiSemesterStats.cgpa);
    let text = `=== UAP / UGC Standard GPA Summary ===\n`;
    if (calculatorTab === 'sgpa') {
      text += `Tool: Semester SGPA Calculator (UGC Scale)\n`;
      text += `Total Credits Registered: ${sgpaStats.totalRegisteredCredits}\n`;
      text += `Total Credits Earned: ${sgpaStats.totalEarnedCredits}\n`;
      text += `Total Quality Points: ${sgpaStats.totalQualityPoints}\n`;
      text += `SGPA: ${sgpaStats.sgpa.toFixed(2)} / 4.00\n`;
      text += `Degree Classification: ${standing.label}\n\n`;
      text += `Course Details:\n`;
      courses.forEach((c, idx) => {
        text += `${idx + 1}. ${c.code || 'Course'} (${c.credit} credits) -> Grade: ${c.grade} (${(GRADE_POINTS_MAP[c.grade] ?? 0).toFixed(2)} pts)\n`;
      });
    } else {
      text += `Tool: Cumulative CGPA Calculator (UGC Scale)\n`;
      text += `Total Cumulative Credits: ${multiSemesterStats.totalCredits}\n`;
      text += `Total Quality Points: ${multiSemesterStats.totalPoints}\n`;
      text += `Cumulative CGPA: ${multiSemesterStats.cgpa.toFixed(2)} / 4.00\n`;
      text += `Degree Classification: ${getUgcDegreeStanding(multiSemesterStats.cgpa).label}\n\n`;
      text += `Semester Breakdown:\n`;
      semesters.forEach((s) => {
        text += `- ${s.name}: ${s.credits} Credits | GPA: ${s.gpa.toFixed(2)}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const currentStanding = getUgcDegreeStanding(calculatorTab === 'sgpa' ? sgpaStats.sgpa : multiSemesterStats.cgpa);

  return (
    <div className="space-y-6">
      {/* Banner / Title Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#DF301C] to-[#b72210] text-white rounded-xl shadow-sm shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  UGC Standard CGPA & SGPA Calculator
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF1D1] text-[#DF301C] border border-[#FFE4B5]">
                  <Award className="w-3 h-3 text-[#DF301C]" />
                  UGC 4.00 Uniform Scale
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Calculate Semester GPA (SGPA), Cumulative CGPA, and Target Graduation Forecast according to official University Grants Commission of Bangladesh standards.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              title="Copy Summary to Clipboard"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePrintSummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              title="Print Calculation Summary"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <button
            type="button"
            onClick={() => setCalculatorTab('sgpa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              calculatorTab === 'sgpa'
                ? 'bg-[#00B7CD] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Semester SGPA Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setCalculatorTab('cgpa')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              calculatorTab === 'cgpa'
                ? 'bg-[#00B7CD] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>2. Cumulative CGPA Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setCalculatorTab('target')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              calculatorTab === 'target'
                ? 'bg-[#00B7CD] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>3. Target CGPA Forecaster</span>
          </button>

          <button
            type="button"
            onClick={() => setCalculatorTab('scale')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              calculatorTab === 'scale'
                ? 'bg-[#DF301C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>UGC Bangladesh Scale</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: SEMESTER SGPA CALCULATOR
         ========================================================================= */}
      {calculatorTab === 'sgpa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Course Inputs */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
                  <span>Semester Courses & Credit Hours</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {courses.length} courses
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter credit hours and choose letter grade or toggle marks entry.
                </p>
              </div>

              {/* Mode Toggle: Grade vs Marks */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setInputMode('grade')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    inputMode === 'grade'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  By Grade (Letter)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('marks')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    inputMode === 'marks'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  By Marks (0-100%)
                </button>
              </div>
            </div>

            {/* Courses Table / Cards */}
            <div className="space-y-2.5">
              <div className="hidden sm:grid sm:grid-cols-12 gap-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Course Code / Name</div>
                <div className="col-span-2">Credit Hours</div>
                <div className={inputMode === 'marks' ? 'col-span-2' : 'col-span-3'}>
                  {inputMode === 'marks' ? 'Marks (%)' : 'Letter Grade'}
                </div>
                {inputMode === 'marks' && <div className="col-span-2">UGC Grade</div>}
                <div className="col-span-2">Grade Point</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {courses.map((course, index) => {
                const points = GRADE_POINTS_MAP[course.grade] ?? 0;
                return (
                  <div
                    key={course.id}
                    className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl transition flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-2 items-center"
                  >
                    {/* Index */}
                    <div className="w-full sm:w-auto sm:col-span-1 flex items-center justify-between sm:justify-start">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shadow-2xs">
                        {index + 1}
                      </span>
                      <span className="sm:hidden text-xs font-semibold text-slate-500">
                        Course #{index + 1}
                      </span>
                    </div>

                    {/* Course Code & Title */}
                    <div className="w-full sm:col-span-3 space-y-1">
                      <input
                        type="text"
                        value={course.code}
                        onChange={(e) => handleUpdateCourse(course.id, { code: e.target.value })}
                        placeholder="e.g. CSE 101"
                        className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                      />
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => handleUpdateCourse(course.id, { title: e.target.value })}
                        placeholder="Course title (optional)"
                        className="w-full px-2 py-1 text-[11px] text-slate-500 bg-white/70 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00B7CD]"
                      />
                    </div>

                    {/* Credit Hours */}
                    <div className="w-full sm:col-span-2">
                      <label className="sm:hidden text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Credit Hours:
                      </label>
                      <select
                        value={course.credit}
                        onChange={(e) => handleUpdateCourse(course.id, { credit: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                      >
                        <option value={4.0}>4.00 Credits</option>
                        <option value={3.0}>3.00 Credits</option>
                        <option value={2.0}>2.00 Credits</option>
                        <option value={1.5}>1.50 Credits (Lab)</option>
                        <option value={1.0}>1.00 Credit (Sessional)</option>
                        <option value={0.75}>0.75 Credit</option>
                      </select>
                    </div>

                    {/* Grade or Marks Input */}
                    {inputMode === 'grade' ? (
                      <div className="w-full sm:col-span-3">
                        <label className="sm:hidden text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Grade:
                        </label>
                        <select
                          value={course.grade}
                          onChange={(e) => handleUpdateCourse(course.id, { grade: e.target.value })}
                          className={`w-full px-2.5 py-1.5 text-xs font-extrabold bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7CD] ${
                            course.grade === 'A+' || course.grade === 'A'
                              ? 'text-emerald-700 border-emerald-300'
                              : course.grade === 'F'
                              ? 'text-rose-700 border-rose-300'
                              : 'text-slate-800 border-slate-300'
                          }`}
                        >
                          {UGC_GRADE_SCALE.map((g) => (
                            <option key={g.letter} value={g.letter}>
                              {g.letter} ({g.points.toFixed(2)} pts) — {g.remark}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <>
                        <div className="w-full sm:col-span-2">
                          <label className="sm:hidden text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Marks (0-100):
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={course.marks ?? ''}
                            onChange={(e) => handleUpdateCourse(course.id, { marks: e.target.value === '' ? '' : Number(e.target.value) })}
                            placeholder="e.g. 82"
                            className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                          />
                        </div>
                        <div className="w-full sm:col-span-2 flex items-center">
                          <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-[#DF301C] w-full text-center">
                            {course.grade}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Grade Point & Quality Points */}
                    <div className="w-full sm:col-span-2 flex sm:flex-col justify-between items-center sm:items-start text-xs font-bold">
                      <span className="sm:hidden text-[10px] text-slate-500 uppercase">Grade Point:</span>
                      <div className="text-slate-800">
                        <span className="font-mono text-slate-900">{points.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 font-normal ml-1">
                          pts
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        = {(course.credit * points).toFixed(2)} QP
                      </span>
                    </div>

                    {/* Delete Action */}
                    <div className="w-full sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={courses.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Course Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleAddCourse}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#00B7CD] hover:bg-[#009fb3] text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Course</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearAllCourses}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={handleResetCourses}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Sample</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live SGPA Card & Statistics */}
          <div className="lg:col-span-4 space-y-5">
            {/* Primary Scorecard */}
            <div className="bg-gradient-to-br from-[#DF301C] to-[#bd1e0d] text-white rounded-2xl shadow-md p-5 sm:p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase mb-2">
                Semester Grade Point Average
              </div>

              <div className="my-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight font-mono">
                  {sgpaStats.sgpa.toFixed(2)}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-white/80 ml-1">/ 4.00</span>
              </div>

              {/* UGC Degree Classification */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-black shadow-xs">
                <Award className="w-3.5 h-3.5 text-[#DF301C]" />
                <span>{currentStanding.label}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/20 text-left">
                <div className="bg-black/15 p-2.5 rounded-xl">
                  <span className="text-[10px] text-white/80 uppercase font-bold block">
                    Credits Registered
                  </span>
                  <span className="text-lg font-black font-mono">
                    {sgpaStats.totalRegisteredCredits}
                  </span>
                </div>
                <div className="bg-black/15 p-2.5 rounded-xl">
                  <span className="text-[10px] text-white/80 uppercase font-bold block">
                    Credits Earned
                  </span>
                  <span className="text-lg font-black font-mono">
                    {sgpaStats.totalEarnedCredits}
                  </span>
                </div>
                <div className="bg-black/15 p-2.5 rounded-xl">
                  <span className="text-[10px] text-white/80 uppercase font-bold block">
                    Quality Points
                  </span>
                  <span className="text-lg font-black font-mono">
                    {sgpaStats.totalQualityPoints}
                  </span>
                </div>
                <div className="bg-black/15 p-2.5 rounded-xl">
                  <span className="text-[10px] text-white/80 uppercase font-bold block">
                    Passed Courses
                  </span>
                  <span className="text-lg font-black font-mono">
                    {courses.filter((c) => c.grade !== 'F' && c.grade !== 'I' && c.grade !== 'W').length} / {courses.length}
                  </span>
                </div>
              </div>

              {/* Transfer to CGPA button */}
              <button
                type="button"
                onClick={handlePushSgpaToMulti}
                className="mt-4 w-full py-2.5 px-3 bg-[#FFF1D1] hover:bg-white text-[#DF301C] rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Save to Cumulative CGPA List</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* UGC Scale Quick Guide Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#00B7CD]" />
                <span>UGC Bangladesh Formula</span>
              </h3>
              <div className="text-xs text-slate-700 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="font-bold text-[#DF301C]">SGPA</span> = &Sigma; (Credit &times; Grade Point) / &Sigma; Credit
              </div>
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex justify-between">
                  <span>80% or higher</span>
                  <span className="font-bold text-emerald-700">A+ (4.00)</span>
                </div>
                <div className="flex justify-between">
                  <span>75% to 79%</span>
                  <span className="font-bold text-slate-700">A (3.75)</span>
                </div>
                <div className="flex justify-between">
                  <span>70% to 74%</span>
                  <span className="font-bold text-slate-700">A- (3.50)</span>
                </div>
                <div className="flex justify-between">
                  <span>Below 40%</span>
                  <span className="font-bold text-rose-700">F (0.00)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CUMULATIVE CGPA CALCULATOR
         ========================================================================= */}
      {calculatorTab === 'cgpa' && (
        <div className="space-y-6">
          {/* Quick 2-Field Calculator Card */}
          <div className="bg-gradient-to-r from-cyan-900 to-[#004e57] text-white rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#FFF1D1]" />
              <h2 className="text-base sm:text-lg font-bold">
                Quick Cumulative CGPA (Previous + Current Semester)
              </h2>
            </div>
            <p className="text-xs text-cyan-100 max-w-2xl mb-4">
              If you already know your completed credits and previous CGPA from your student portal (e.g. UAP UCam), quickly calculate your updated overall CGPA below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className="text-[11px] font-bold text-cyan-200 uppercase block mb-1">
                  1. Previous Completed Credits
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={quickPrevCredits}
                  onChange={(e) => setQuickPrevCredits(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g. 55.5"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-cyan-200 uppercase block mb-1">
                  2. Previous Cumulative CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="4.00"
                  value={quickPrevCgpa}
                  onChange={(e) => setQuickPrevCgpa(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g. 3.78"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-cyan-200 uppercase block mb-1">
                  3. This Semester Credits
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={quickCurrCredits}
                  onChange={(e) => setQuickCurrCredits(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g. 18.0"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-cyan-200 uppercase block mb-1">
                  4. This Semester GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="4.00"
                  value={quickCurrGpa}
                  onChange={(e) => setQuickCurrGpa(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g. 3.85"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                />
              </div>

              <div className="bg-white/15 p-2.5 rounded-xl border border-white/20 text-center">
                <span className="text-[10px] text-cyan-200 uppercase font-bold block">
                  New Combined CGPA
                </span>
                <span className="text-2xl font-black font-mono text-[#FFF1D1]">
                  {quickCgpaResult.newCgpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-cyan-200 block">
                  ({quickCgpaResult.totalCredits} Total Credits)
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Semester Breakdown Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">
                    Semester-by-Semester Progression
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add all semesters to see your cumulative GPA growth throughout your bachelor degree.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSemester}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00B7CD] hover:bg-[#009fb3] text-white text-xs font-bold rounded-xl transition shadow-xs self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Semester</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="hidden sm:grid sm:grid-cols-12 gap-2 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-5">Semester Name</div>
                  <div className="col-span-3">Credits Completed</div>
                  <div className="col-span-3">Semester GPA (SGPA)</div>
                  <div className="col-span-1 text-right">Delete</div>
                </div>

                {semesters.map((sem, idx) => (
                  <div
                    key={sem.id}
                    className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-2 items-center"
                  >
                    <div className="w-full sm:col-span-5 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-white text-slate-600 text-[10px] font-bold flex items-center justify-center border border-slate-200">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={sem.name}
                        onChange={(e) => handleUpdateSemester(sem.id, { name: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                      />
                    </div>

                    <div className="w-full sm:col-span-3">
                      <label className="sm:hidden text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Credits:
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={sem.credits}
                        onChange={(e) => handleUpdateSemester(sem.id, { credits: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 text-xs font-bold font-mono text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                      />
                    </div>

                    <div className="w-full sm:col-span-3">
                      <label className="sm:hidden text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        SGPA:
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.00"
                        value={sem.gpa}
                        onChange={(e) => handleUpdateSemester(sem.id, { gpa: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 text-xs font-bold font-mono text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                      />
                    </div>

                    <div className="w-full sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteSemester(sem.id)}
                        disabled={semesters.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-30"
                        title="Delete Semester"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Multi-Semester Total Result */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-md p-5 sm:p-6 text-center">
                <span className="text-[11px] font-bold tracking-wider text-cyan-300 uppercase block mb-1">
                  Cumulative Grade Point Average (CGPA)
                </span>

                <div className="my-2">
                  <span className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-white">
                    {multiSemesterStats.cgpa.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-slate-400 ml-1">/ 4.00</span>
                </div>

                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 text-xs font-bold">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{getUgcDegreeStanding(multiSemesterStats.cgpa).label}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-700 text-left">
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Total Credits
                    </span>
                    <span className="text-lg font-black font-mono text-white">
                      {multiSemesterStats.totalCredits}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Quality Points
                    </span>
                    <span className="text-lg font-black font-mono text-white">
                      {multiSemesterStats.totalPoints}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: TARGET CGPA FORECASTER
         ========================================================================= */}
      {calculatorTab === 'target' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-5">
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#00B7CD]" />
                <span>Target CGPA Planning & Forecasting</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Calculate what GPA you need in your remaining semesters to graduate with your desired CGPA (e.g. 3.75 for First Class Distinction).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Total Degree Credits Required:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={targetDegreeCredits}
                    onChange={(e) => setTargetDegreeCredits(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="e.g. 144"
                    className="w-full px-3 py-2 text-sm font-bold font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">
                    credits
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  (Standard UAP CSE ~144-150 credits, EEE ~148 credits)
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Completed Credits So Far:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={targetCurrentCredits}
                    onChange={(e) => setTargetCurrentCredits(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    placeholder="e.g. 74"
                    className="w-full px-3 py-2 text-sm font-bold font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">
                    credits
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Current Cumulative CGPA:
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="4.00"
                  value={targetCurrentCgpa}
                  onChange={(e) => setTargetCurrentCgpa(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g. 3.62"
                  className="w-full px-3 py-2 text-sm font-bold font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B7CD]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#DF301C] block mb-1">
                  Desired Target Graduation CGPA:
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="4.00"
                  value={targetGoalCgpa}
                  onChange={(e) => setTargetGoalCgpa(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g. 3.75"
                  className="w-full px-3 py-2 text-sm font-extrabold font-mono text-[#DF301C] bg-red-50/50 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DF301C]"
                />
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {[3.50, 3.75, 3.80, 3.90].map((quickTarget) => (
                    <button
                      key={quickTarget}
                      type="button"
                      onClick={() => setTargetGoalCgpa(quickTarget)}
                      className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {quickTarget.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Calculation is strictly weighted by credit hours remaining until completion.
              </span>
            </div>
          </div>

          {/* Right Column: Forecast Result Card */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`rounded-2xl border shadow-sm p-6 text-center ${
                targetForecast.status === 'achieved'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : targetForecast.status === 'impossible'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 block mb-1">
                Required Average GPA in Remaining Semesters
              </span>

              <div className="my-2">
                <span
                  className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${
                    targetForecast.status === 'impossible'
                      ? 'text-rose-600'
                      : targetForecast.status === 'achieved'
                      ? 'text-emerald-600'
                      : 'text-[#00B7CD]'
                  }`}
                >
                  {targetForecast.requiredGpa > 0 ? targetForecast.requiredGpa.toFixed(2) : '0.00'}
                </span>
                <span className="text-xl font-bold text-slate-400 ml-1">/ 4.00</span>
              </div>

              <div className="mt-3 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100/80 border border-slate-200/80">
                {targetForecast.message}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200/60 text-left">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Remaining Credits
                  </span>
                  <span className="text-base font-black font-mono text-slate-800">
                    {targetForecast.remainingCredits} credits
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Degree Target
                  </span>
                  <span className="text-base font-black font-mono text-[#DF301C]">
                    {Number(targetGoalCgpa || 0).toFixed(2)} CGPA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: OFFICIAL UGC BANGLADESH GRADING SCALE REFERENCE
         ========================================================================= */}
      {calculatorTab === 'scale' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#DF301C]" />
                <span>UGC Bangladesh Uniform Grading Scale (4.00 Scale)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mandatory grading structure approved by the University Grants Commission of Bangladesh for all public and private universities.
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-[#FAF7EE] text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Numerical Marks Range</th>
                  <th className="py-3 px-4">Letter Grade</th>
                  <th className="py-3 px-4">Grade Point (GP)</th>
                  <th className="py-3 px-4">Remarks / Performance Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {UGC_GRADE_SCALE.map((row) => (
                  <tr
                    key={row.letter}
                    className={`hover:bg-slate-50/80 transition ${
                      row.letter === 'A+' ? 'bg-emerald-50/40' : row.letter === 'F' ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {row.minMarks}% to {row.maxMarks === 100 ? '100%' : `${row.maxMarks}%`}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md font-black text-xs ${
                          row.letter === 'A+' || row.letter === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : row.letter === 'F'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {row.letter}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {row.points.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{row.remark}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 text-slate-500 italic">Incomplete</td>
                  <td className="py-2.5 px-4 font-bold text-slate-600">I</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">0.00</td>
                  <td className="py-2.5 px-4 text-slate-500">Not calculated in SGPA until finished</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 text-slate-500 italic">Withdrawn</td>
                  <td className="py-2.5 px-4 font-bold text-slate-600">W</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">0.00</td>
                  <td className="py-2.5 px-4 text-slate-500">Course officially withdrawn with permission</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Classification of Degree Card */}
          <div className="bg-[#FAF7EE] border border-[#FFE4B5] rounded-xl p-4">
            <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-2">
              UGC Bangladesh CGPA Degree Classification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-emerald-700 block text-sm">
                  3.75 - 4.00
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  First Class with Distinction
                </span>
                <span className="text-[11px] text-slate-500">Highest Academic Honors</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-blue-700 block text-sm">
                  3.00 - 3.74
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  First Class
                </span>
                <span className="text-[11px] text-slate-500">Good Standing</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-amber-700 block text-sm">
                  2.25 - 2.99
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  Second Class
                </span>
                <span className="text-[11px] text-slate-500">Satisfactory</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-mono font-bold text-orange-700 block text-sm">
                  2.00 - 2.24
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  Third Class (Pass)
                </span>
                <span className="text-[11px] text-slate-500">Minimum passing criteria</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
