import React from 'react';
import {
  RotateCcw,
  Calendar,
  User,
  Download,
  BookOpen,
  Building2,
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
  onExportPdf,
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

  const handleDepartmentPreset = (deptFullName: string, shortCode: string) => {
    onChange({
      ...data,
      department: deptFullName.toUpperCase(),
      instructorDepartment: `Department of ${shortCode}`,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#FFE4B5] shadow-xs p-5 space-y-5">
      {/* Header and Download Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#FFE4B5]/60">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DF301C] animate-pulse"></span>
          <span className="text-sm font-bold text-slate-800">7. CT Cover</span>
          <span className="text-xs text-slate-500 font-medium">• Class Test</span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition flex items-center gap-1.5"
          title="Reset to default fields"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Primary Download Button */}
        <div className="w-full pt-1">
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

      {/* University & Department Info */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-[#DF301C]" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Department & University
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              value={data.department}
              onChange={(e) => updateField('department', e.target.value)}
              placeholder="DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-semibold text-slate-900 uppercase"
            />
          </div>

          {/* Quick Department Presets */}
          <div className="flex flex-wrap gap-1.5">
            {UAP_ALL_DEPARTMENTS.slice(0, 5).map((dept) => (
              <button
                key={dept.id}
                type="button"
                onClick={() => handleDepartmentPreset(dept.name, dept.shortCode)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-[#FFF1D1] hover:text-[#DF301C] text-slate-700 font-medium transition"
              >
                {dept.shortCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Student Information */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100">
          <User className="w-4 h-4 text-[#DF301C]" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            1. Student Information
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
              Registration Number
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
              placeholder="A"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00B7CD] font-semibold text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* 2. Course Information */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-[#DF301C]" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Course Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* CT Title / Number */}
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

      {/* 3. Page Border Style */}
      <div className="pt-1">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          3. Page Border Style
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
              onClick={() => updateField('borderStyle', style.id as CtCoverData['borderStyle'])}
              className={`min-h-[38px] py-1.5 px-2.5 rounded-xl border text-xs font-semibold text-center transition ${
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
  );
};
