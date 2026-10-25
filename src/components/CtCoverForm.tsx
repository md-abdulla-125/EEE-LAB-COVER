import React from 'react';
import {
  FileText,
  RotateCcw,
  Calendar,
  ChevronDown,
  Building,
  User,
  GraduationCap,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';
import { CtCoverData } from '../types';
import { DEFAULT_CT_DATA } from '../data/ctData';
import { UAP_ALL_DEPARTMENTS } from '../data/assignmentData';

interface CtCoverFormProps {
  data: CtCoverData;
  onChange: (data: CtCoverData) => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isExportingDocx: boolean;
  isExportingPdf: boolean;
}

export const CtCoverForm: React.FC<CtCoverFormProps> = ({
  data,
  onChange,
  onExportDocx,
  onExportPdf,
  onPrint,
  isExportingDocx,
  isExportingPdf,
}) => {
  const updateField = <K extends keyof CtCoverData>(
    field: K,
    value: CtCoverData[K]
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleDepartmentChange = (deptCode: string) => {
    const dept = UAP_ALL_DEPARTMENTS.find(
      (d) => d.id === deptCode || d.shortCode === deptCode || d.name === deptCode
    );
    const shortCode = dept ? dept.shortCode : deptCode;
    const fullDeptName = dept ? dept.fullDeptName.toUpperCase() : `DEPARTMENT OF ${deptCode.toUpperCase()}`;
    const instructorDept = `Department of ${shortCode}`;

    onChange({
      ...data,
      department: fullDeptName,
      instructorDepartment: instructorDept,
    });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_CT_DATA });
  };

  const setTodayDate = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    updateField('date', formatted);
  };

  // Find matching department ID or code
  const currentDeptMatch = UAP_ALL_DEPARTMENTS.find(
    (d) =>
      d.fullDeptName.toLowerCase() === (data.department || '').toLowerCase() ||
      d.shortCode.toLowerCase() === (data.department || '').toLowerCase() ||
      d.id.toLowerCase() === (data.department || '').toLowerCase()
  );
  const selectedDeptValue = currentDeptMatch ? currentDeptMatch.shortCode : 'CSE';

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-[#FFE4B5] shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DF301C] animate-pulse"></span>
          <span className="text-sm font-bold text-slate-800">7. CT Cover (Class Test)</span>
          <span className="text-xs text-slate-500 font-medium">• Standard Format</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center gap-1.5"
            title="Reset to default fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Primary Download Buttons */}
        <div className="w-full pt-2 border-t border-[#FFE4B5]/40 flex justify-center">
          <button
            type="button"
            id="download-ct-pdf-btn"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="w-full py-2.5 px-3 bg-[#DF301C] hover:bg-[#C72412] active:bg-[#B01F0E] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50 min-h-[42px]"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Form Fields Container */}
      <div className="bg-white rounded-2xl border border-[#FFE4B5] shadow-xs p-5 space-y-5">
        {/* Section 1: Institution & Department */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100">
            <Building className="w-4 h-4 text-[#DF301C]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Institution & Department
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* University Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University Name
              </label>
              <input
                type="text"
                value={data.universityName}
                onChange={(e) => updateField('universityName', e.target.value)}
                placeholder="UNIVERSITY OF ASIA PACIFIC"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-serif font-bold text-slate-900 uppercase"
              />
            </div>

            {/* Department Quick Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department Quick Select
              </label>
              <div className="relative">
                <select
                  value={selectedDeptValue}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-medium text-slate-800 pr-8"
                >
                  {UAP_ALL_DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.shortCode}>
                      {dept.shortCode} - {dept.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Full Department Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department Name (Full)
              </label>
              <input
                type="text"
                value={data.department}
                onChange={(e) => updateField('department', e.target.value)}
                placeholder="DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-serif uppercase font-bold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Course & Class Test Info */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100">
            <FileText className="w-4 h-4 text-[#DF301C]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Course & Class Test Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* CT Number / Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CT Title / Number
              </label>
              <input
                type="text"
                value={data.ctNumber}
                onChange={(e) => updateField('ctNumber', e.target.value)}
                placeholder="Class Test - 01"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-semibold text-slate-900"
              />
            </div>

            {/* Course Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={data.courseCode}
                onChange={(e) => updateField('courseCode', e.target.value)}
                placeholder="CSE 201"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-mono font-bold text-slate-900 uppercase"
              />
            </div>

            {/* Course Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Title
              </label>
              <input
                type="text"
                value={data.courseTitle}
                onChange={(e) => updateField('courseTitle', e.target.value)}
                placeholder="Data Structures and Algorithms"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-semibold text-slate-900"
              />
            </div>

            {/* Semester / Academic Session */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester / Session
              </label>
              <input
                type="text"
                value={data.semester}
                onChange={(e) => updateField('semester', e.target.value)}
                placeholder="Spring 2026"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] text-slate-800"
              />
            </div>

            {/* Date of CT */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Date of Class Test
                </label>
                <button
                  type="button"
                  onClick={setTodayDate}
                  className="text-[10px] font-bold text-[#DF301C] hover:underline flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Today</span>
                </button>
              </div>
              <input
                type="text"
                value={data.date}
                onChange={(e) => updateField('date', e.target.value)}
                placeholder="25 October 2026"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Student Details */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100">
            <User className="w-4 h-4 text-[#DF301C]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Student Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={data.studentName}
                onChange={(e) => updateField('studentName', e.target.value)}
                placeholder="Md. Abdullah Sarkar Shihab"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-semibold text-slate-900"
              />
            </div>

            {/* Registration Number / Student ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration Number / Student ID
              </label>
              <input
                type="text"
                value={data.studentId}
                onChange={(e) => updateField('studentId', e.target.value)}
                placeholder="24108116"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-mono font-bold text-slate-900"
              />
            </div>

            {/* Section */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section
              </label>
              <input
                type="text"
                value={data.section}
                onChange={(e) => updateField('section', e.target.value)}
                placeholder="A / B / C"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Instructor Details */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-[#DF301C]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              4. Course Teacher Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lecturer / Instructor Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teacher Name
              </label>
              <input
                type="text"
                value={data.instructorName}
                onChange={(e) => updateField('instructorName', e.target.value)}
                placeholder="Lecturer Name"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-semibold text-slate-900"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={data.instructorDesignation}
                onChange={(e) => updateField('instructorDesignation', e.target.value)}
                placeholder="Lecturer / Assistant Professor"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] text-slate-800"
              />
            </div>

            {/* Teacher Department */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teacher Department
              </label>
              <input
                type="text"
                value={data.instructorDepartment}
                onChange={(e) => updateField('instructorDepartment', e.target.value)}
                placeholder="Department of CSE"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Border Style */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Page Border Style
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { id: 'double', label: 'Double' },
                { id: 'single', label: 'Single' },
                { id: 'bold', label: 'Thick' },
                { id: 'none', label: 'None' },
              ] as const
            ).map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => updateField('borderStyle', style.id)}
                className={`py-2 px-2 text-xs rounded-xl font-bold transition text-center border ${
                  data.borderStyle === style.id
                    ? 'bg-[#FFF1D1] text-[#DF301C] border-[#FFD88A] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
