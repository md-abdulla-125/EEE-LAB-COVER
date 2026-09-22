import React from 'react';
import {
  User,
  GraduationCap,
  FlaskConical,
  Calendar,
  Sparkles,
  FileText,
  RotateCcw,
  Building,
  CheckCircle2,
  FileDown,
  Printer,
  FileEdit,
} from 'lucide-react';
import { CoverPageData } from '../types';
import {
  DEFAULT_COVER_DATA,
  PRESET_EXPERIMENTS,
  PRESET_DEPARTMENTS,
  PRESET_SEMESTERS,
  PRESET_INSTRUCTORS,
} from '../data/defaultData';

interface EditorFormProps {
  data: CoverPageData;
  onChange: (data: CoverPageData) => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isExportingDocx: boolean;
  isExportingPdf: boolean;
}

export const EditorForm: React.FC<EditorFormProps> = ({
  data,
  onChange,
  onExportDocx,
  onExportPdf,
  onPrint,
  isExportingDocx,
  isExportingPdf,
}) => {
  const updateField = <K extends keyof CoverPageData>(field: K, value: CoverPageData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const handleExperimentSelect = (expNo: string) => {
    const exp = PRESET_EXPERIMENTS.find((e) => e.no === expNo);
    if (exp) {
      onChange({
        ...data,
        expNo: exp.no,
        expName: exp.name,
      });
    }
  };

  const handleInstructorSelect = (index: number) => {
    const inst = PRESET_INSTRUCTORS[index];
    if (inst) {
      onChange({
        ...data,
        instructorName: inst.name,
        instructorDesignation: inst.designation,
        instructorDepartment: inst.department,
      });
    }
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_COVER_DATA });
  };

  const setTodayForSubmission = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    updateField('submissionDate', formatted);
  };

  const setTodayForPerformance = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    updateField('performanceDate', formatted);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-blue-600" />
              Cover Page Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the fields or use presets. Live preview updates immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-auto"
            title="Reset form to default UAP EEE-102 template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* Big Export Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            id="download-pdf-btn"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg font-medium text-sm shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            {isExportingPdf ? 'Generating PDF...' : 'Download PDF (.pdf)'}
          </button>

          <button
            type="button"
            id="print-pdf-btn"
            onClick={onPrint}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium text-sm shadow-sm hover:shadow transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Quick Select: EEE-102 Presets (All 10 Lab Experiments) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Quick Experiment Presets (EEE 102 – 10 Experiments)
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Click to apply</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {PRESET_EXPERIMENTS.map((exp) => (
            <button
              key={exp.no}
              type="button"
              onClick={() => handleExperimentSelect(exp.no)}
              className={`p-2 text-left rounded-lg text-xs transition-all border ${
                data.expNo === exp.no
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300'
                  : 'bg-white hover:bg-blue-100/70 text-slate-800 border-blue-200/80 hover:border-blue-300'
              }`}
            >
              <div className="font-bold flex items-center justify-between text-[11.5px]">
                <span>Exp #{exp.no}</span>
                {data.expNo === exp.no && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
              </div>
              <div className="line-clamp-2 text-[10.5px] opacity-90 mt-0.5 leading-tight">
                {exp.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Student Information */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-900">Student Information (Submitted By)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Student Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="student-name-input"
              value={data.studentName}
              onChange={(e) => updateField('studentName', e.target.value)}
              placeholder="e.g. MD. TARIQUL ISLAM"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Student ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="student-id-input"
              value={data.studentId}
              onChange={(e) => updateField('studentId', e.target.value)}
              placeholder="e.g. 25201125"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Semester</label>
            <input
              type="text"
              id="semester-input"
              value={data.semester}
              onChange={(e) => updateField('semester', e.target.value)}
              placeholder="e.g. 1st Year 2nd Semester"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Section</label>
              <input
                type="text"
                id="section-input"
                value={data.section}
                onChange={(e) => updateField('section', e.target.value)}
                placeholder="e.g. A"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Group</label>
              <input
                type="text"
                id="group-input"
                value={data.group}
                onChange={(e) => updateField('group', e.target.value)}
                placeholder="e.g. A1"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Experiment & Course Details */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FlaskConical className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-slate-900">Course & Experiment Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Course Code</label>
            <input
              type="text"
              id="course-code-input"
              value={data.courseCode}
              onChange={(e) => updateField('courseCode', e.target.value)}
              placeholder="e.g. EEE 102"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Course Title</label>
            <input
              type="text"
              id="course-title-input"
              value={data.courseTitle}
              onChange={(e) => updateField('courseTitle', e.target.value)}
              placeholder="e.g. Electrical Circuits Lab"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  Select Experiment from Syllabus
                </label>
                <span className="text-[11px] text-blue-600 font-medium">10 EEE 102 Experiments</span>
              </div>
              <select
                id="exp-select-dropdown"
                value={PRESET_EXPERIMENTS.some((p) => p.no === data.expNo) ? data.expNo : ''}
                onChange={(e) => {
                  if (e.target.value) handleExperimentSelect(e.target.value);
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-blue-200 bg-blue-50/60 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">-- Choose an Experiment (Exp 01 – Exp 10) --</option>
                {PRESET_EXPERIMENTS.map((exp) => (
                  <option key={exp.no} value={exp.no}>
                    Exp #{exp.no}: {exp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">Exp. No.</label>
                <input
                  type="text"
                  id="exp-no-input"
                  value={data.expNo}
                  onChange={(e) => updateField('expNo', e.target.value)}
                  placeholder="e.g. 02"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-semibold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Exp Name / Title</label>
                <input
                  type="text"
                  id="exp-name-input"
                  value={data.expName}
                  onChange={(e) => updateField('expName', e.target.value)}
                  placeholder="e.g. Verification of Ohm’s Law."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Date of Performance
              </label>
              <button
                type="button"
                onClick={setTodayForPerformance}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              >
                Set Today
              </button>
            </div>
            <input
              type="text"
              id="performance-date-input"
              value={data.performanceDate}
              onChange={(e) => updateField('performanceDate', e.target.value)}
              placeholder="e.g. 15 February, 2026"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Date of Submission
              </label>
              <button
                type="button"
                onClick={setTodayForSubmission}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              >
                Set Today
              </button>
            </div>
            <input
              type="text"
              id="submission-date-input"
              value={data.submissionDate}
              onChange={(e) => updateField('submissionDate', e.target.value)}
              placeholder="e.g. 22 February, 2026"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Instructor Information */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm text-slate-900">Instructor Information (Submitted To)</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 hidden sm:inline">Preset:</span>
            {PRESET_INSTRUCTORS.slice(0, 1).map((inst, idx) => (
              <button
                key={inst.name}
                type="button"
                onClick={() => handleInstructorSelect(idx)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
              >
                {inst.name.split(' ')[0]} {inst.name.split(' ')[1] || ''}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Instructor Name</label>
            <input
              type="text"
              id="instructor-name-input"
              value={data.instructorName}
              onChange={(e) => updateField('instructorName', e.target.value)}
              placeholder="e.g. M. ABDULLAH AL-AMIN"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Designation</label>
            <input
              type="text"
              id="instructor-designation-input"
              value={data.instructorDesignation}
              onChange={(e) => updateField('instructorDesignation', e.target.value)}
              placeholder="e.g. ASSISTANT PROFESSOR"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase text-xs"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-medium text-slate-700 mb-1">Department & Org</label>
            <input
              type="text"
              id="instructor-dept-input"
              value={data.instructorDepartment}
              onChange={(e) => updateField('instructorDepartment', e.target.value)}
              placeholder="e.g. EEE, UAP"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase text-xs"
            />
          </div>
        </div>
      </div>

      {/* Section 4: University & Page Layout Customization */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-sm text-slate-900">Department & Header Settings</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Official UAP Logo Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Department Header</label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={data.department}
                onChange={(e) => updateField('department', e.target.value)}
                placeholder="e.g. DEPARTMENT OF CSE"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
              />
              <div className="flex flex-wrap gap-1">
                {PRESET_DEPARTMENTS.slice(0, 3).map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => updateField('department', dept)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    {dept.replace('DEPARTMENT OF ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Report Subtitle / Term</label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={data.reportType}
                onChange={(e) => updateField('reportType', e.target.value)}
                placeholder="e.g. Lab Report – Spring 2026"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <div className="flex flex-wrap gap-1">
                {PRESET_SEMESTERS.slice(0, 3).map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => updateField('reportType', sem)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Page Border Style</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'single', label: 'Single Line (Official)' },
                { id: 'double', label: 'Double Line' },
                { id: 'bold', label: 'Thick Border' },
                { id: 'none', label: 'No Border' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => updateField('borderStyle', style.id as CoverPageData['borderStyle'])}
                  className={`py-2 px-2 text-xs rounded-lg border transition text-center font-medium ${
                    data.borderStyle === style.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
