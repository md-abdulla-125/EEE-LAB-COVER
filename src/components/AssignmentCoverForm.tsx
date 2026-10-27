import React from 'react';
import {
  FileText,
  RotateCcw,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { AssignmentCoverData } from '../types';
import {
  DEFAULT_ASSIGNMENT_DATA,
  UAP_ALL_DEPARTMENTS,
} from '../data/assignmentData';

interface AssignmentCoverFormProps {
  data: AssignmentCoverData;
  onChange: (data: AssignmentCoverData) => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isExportingDocx: boolean;
  isExportingPdf: boolean;
}

export const AssignmentCoverForm: React.FC<AssignmentCoverFormProps> = ({
  data,
  onChange,
  onExportDocx,
  onExportPdf,
  onPrint,
  isExportingDocx,
  isExportingPdf,
}) => {
  const updateField = <K extends keyof AssignmentCoverData>(
    field: K,
    value: AssignmentCoverData[K]
  ) => {
    const updated = {
      ...data,
      [field]: value,
      // Keep aliases in sync
      courseTitle: field === 'courseName' ? (value as string) : data.courseTitle || data.courseName,
      assignmentTopic: field === 'assignmentName' ? (value as string) : data.assignmentTopic || data.assignmentName,
    };
    onChange(updated);
  };

  const handleDepartmentChange = (deptCode: string) => {
    const dept = UAP_ALL_DEPARTMENTS.find((d) => d.id === deptCode || d.shortCode === deptCode || d.name === deptCode);
    const shortCode = dept ? dept.shortCode : deptCode;
    const instructorDept = `Department of ${shortCode}`;

    onChange({
      ...data,
      department: shortCode,
      instructorDepartment: data.instructorDepartment ? data.instructorDepartment : instructorDept,
    });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_ASSIGNMENT_DATA });
  };

  // Find matching department ID or code
  const currentDeptMatch = UAP_ALL_DEPARTMENTS.find(
    (d) =>
      d.shortCode.toLowerCase() === (data.department || '').toLowerCase() ||
      d.id.toLowerCase() === (data.department || '').toLowerCase() ||
      d.name.toLowerCase() === (data.department || '').toLowerCase()
  );
  const selectedDeptValue = currentDeptMatch ? currentDeptMatch.shortCode : data.department || 'EEE';

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-[#FFE4B5] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DF301C] animate-pulse"></span>
          <span className="text-sm font-bold text-slate-800">Assignment Cover</span>
          <span className="text-xs text-slate-500 font-medium">• UAP Standard</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#DF301C] bg-[#FFF1D1]/60 hover:bg-[#FFF1D1] active:bg-[#FFE8B8] border border-[#FFD88A] rounded-xl transition"
            title="Reset form to default values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full pt-2 border-t border-[#FFE4B5]/40">
          <button
            type="button"
            id="download-assignment-pdf-btn"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#DF301C] hover:bg-[#C72412] active:bg-[#B01F0E] text-white rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50 min-h-[44px]"
          >
            <FileText className="w-4 h-4" />
            <span>{isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-[#FFE4B5]/80 shadow-xs p-4 sm:p-6 space-y-6">
        {/* Section 1: Course */}
        <div>
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="w-6 h-6 rounded-full bg-[#DF301C] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Course Information</h3>
          </div>

          <div className="space-y-3.5">
            {/* Department Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Department
              </label>
              <div className="relative">
                <select
                  value={selectedDeptValue}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 pr-10 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition cursor-pointer min-h-[44px]"
                >
                  {UAP_ALL_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.shortCode}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Course Name & Course Code (2 cols on sm, 1 col on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Course Name
                </label>
                <input
                  type="text"
                  value={data.courseName || data.courseTitle || ''}
                  onChange={(e) => updateField('courseName', e.target.value)}
                  placeholder="e.g. Electrical Circuit"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Course Code
                </label>
                <input
                  type="text"
                  value={data.courseCode || ''}
                  onChange={(e) => updateField('courseCode', e.target.value)}
                  placeholder="e.g. EEE 101"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px]"
                />
              </div>
            </div>

            {/* Assignment Name (full width) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assignment Name
              </label>
              <input
                type="text"
                value={data.assignmentName || data.assignmentTopic || ''}
                onChange={(e) => updateField('assignmentName', e.target.value)}
                placeholder="Assignment Name"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px]"
              />
            </div>

            {/* Date of Submission & Academic Session (2 cols on sm, 1 col on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date of Submission
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={data.submissionDate || ''}
                    onChange={(e) => updateField('submissionDate', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition cursor-pointer min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Academic Session
                </label>
                <input
                  type="text"
                  value={data.academicSession || ''}
                  onChange={(e) => updateField('academicSession', e.target.value)}
                  placeholder="e.g. Spring 2026"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px]"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#FFE4B5]/50" />

        {/* Section 2: Submitted by */}
        <div>
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="w-6 h-6 rounded-full bg-[#DF301C] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Submitted by (Student)</h3>
          </div>

          <div className="space-y-3.5">
            {/* Name (full width) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={data.studentName || ''}
                onChange={(e) => updateField('studentName', e.target.value)}
                placeholder="e.g. Md. Abdullah Sarkar Shihab"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px]"
              />
            </div>

            {/* Registration ID & Section (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Reg. No. (Registration Number)
                </label>
                <input
                  type="text"
                  value={data.studentId || ''}
                  onChange={(e) => updateField('studentId', e.target.value)}
                  placeholder="e.g. 24108116"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Section
                </label>
                <input
                  type="text"
                  value={data.section || ''}
                  onChange={(e) => updateField('section', e.target.value)}
                  placeholder="e.g. C"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px]"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#FFE4B5]/50" />

        {/* Section 3: Submitted to */}
        <div>
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="w-6 h-6 rounded-full bg-[#DF301C] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Submitted to (Lecturer)</h3>
          </div>

          <div className="space-y-3.5">
            {/* Lecturer Name (full width) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Lecturer Name
              </label>
              <input
                type="text"
                value={data.instructorName || ''}
                onChange={(e) => updateField('instructorName', e.target.value)}
                placeholder="e.g. Dr. Muhammad Mominur Rahman"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px]"
              />
            </div>

            {/* Designation & Department (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Designation
                </label>
                <input
                  type="text"
                  value={data.instructorDesignation || ''}
                  onChange={(e) => updateField('instructorDesignation', e.target.value)}
                  placeholder="e.g. Associate Professor"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px] mb-1.5"
                />
                <div className="flex flex-wrap gap-1">
                  {['Lecturer', 'Asst. Professor', 'Assoc. Professor', 'Professor'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => updateField('instructorDesignation', d)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-[#FFF1D1] hover:text-[#DF301C] text-slate-600 font-medium transition"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={data.instructorDepartment || ''}
                  onChange={(e) => updateField('instructorDepartment', e.target.value)}
                  placeholder="e.g. Department of EEE"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[16px] sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B7CD]/20 focus:border-[#00B7CD] transition min-h-[44px]"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#FFE4B5]/50" />

        {/* Page Border Option */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Page Border Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'single', label: 'Single Border' },
              { id: 'double', label: 'Double Border' },
              { id: 'bold', label: 'Bold Border' },
              { id: 'none', label: 'No Border' },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => updateField('borderStyle', style.id as AssignmentCoverData['borderStyle'])}
                className={`min-h-[42px] py-2 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                  data.borderStyle === style.id
                    ? 'border-[#00B7CD] bg-[#FFF1D1] text-[#DF301C] shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-[#FFF1D1]/40 text-slate-700 active:bg-slate-100'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
