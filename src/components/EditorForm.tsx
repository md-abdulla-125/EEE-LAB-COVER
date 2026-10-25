import React from 'react';
import {
  User,
  GraduationCap,
  FlaskConical,
  Calendar,
  FileText,
  RotateCcw,
  Building,
  CheckCircle2,
  FileEdit,
} from 'lucide-react';
import { CoverPageData } from '../types';
import {
  DEFAULT_COVER_DATA,
  PRESET_EXPERIMENTS,
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
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#FFE4B5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-[#DF301C]" />
              5. EEE Lab Cover -102
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in fields or choose one of the 10 experiments below.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#DF301C] bg-[#FFF1D1]/60 hover:bg-[#FFF1D1] active:bg-[#FFE8B8] border border-[#FFD88A] rounded-xl transition self-start sm:self-auto"
            title="Reset form to default UAP EEE-102 template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>

        {/* Action Buttons for Lab Report */}
        <div className="w-full pt-3 mt-3 border-t border-[#FFE4B5]/40">
          <button
            type="button"
            id="download-pdf-btn"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#DF301C] hover:bg-[#C72412] active:bg-[#B01F0E] text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50 min-h-[44px]"
          >
            <FileText className="w-4 h-4" />
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Section 1: Student Information */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#FFE4B5]/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#FFE4B5]/50">
          <User className="w-4 h-4 text-[#DF301C]" />
          <h3 className="font-bold text-sm text-slate-900">Student Information (Submitted By)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Student Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="student-name-input"
              value={data.studentName}
              onChange={(e) => updateField('studentName', e.target.value)}
              placeholder="e.g. MD. TARIQUL ISLAM"
              className="w-full px-3.5 py-2.5 text-[16px] sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px] text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Student ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="student-id-input"
              value={data.studentId}
              onChange={(e) => updateField('studentId', e.target.value)}
              placeholder="e.g. 25201125"
              className="w-full px-3.5 py-2.5 text-[16px] sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px] text-slate-800 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Semester</label>
            <input
              type="text"
              id="semester-input"
              value={data.semester}
              onChange={(e) => updateField('semester', e.target.value)}
              placeholder="e.g. 1st Year 2nd Semester"
              className="w-full px-3.5 py-2.5 text-[16px] sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px] text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Section</label>
              <input
                type="text"
                id="section-input"
                value={data.section}
                onChange={(e) => updateField('section', e.target.value)}
                placeholder="e.g. A"
                className="w-full px-3.5 py-2.5 text-[16px] sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px] text-slate-800 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Group</label>
              <input
                type="text"
                id="group-input"
                value={data.group}
                onChange={(e) => updateField('group', e.target.value)}
                placeholder="e.g. A1"
                className="w-full px-3.5 py-2.5 text-[16px] sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px] text-slate-800 uppercase"
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
            <input
              type="text"
              value={data.department}
              onChange={(e) => updateField('department', e.target.value)}
              placeholder="e.g. DEPARTMENT OF CSE"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Report Subtitle / Term</label>
            <input
              type="text"
              value={data.reportType}
              onChange={(e) => updateField('reportType', e.target.value)}
              placeholder="e.g. Lab Report – Spring 2026"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Page Border Style</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                  className={`py-2 px-2 text-xs rounded-xl border transition text-center font-semibold ${
                    data.borderStyle === style.id
                      ? 'border-[#00B7CD] bg-[#FFF1D1] text-[#DF301C] shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-[#FFF1D1]/40'
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
