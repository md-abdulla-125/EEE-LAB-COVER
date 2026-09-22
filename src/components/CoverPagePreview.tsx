import React, { forwardRef } from 'react';
import { CoverPageData } from '../types';
import { UapLogo } from './UapLogo';

interface CoverPagePreviewProps {
  data: CoverPageData;
  zoom?: number;
}

export const CoverPagePreview = forwardRef<HTMLDivElement, CoverPagePreviewProps>(
  ({ data, zoom = 1 }, ref) => {
    // Determine border styling for academic look
    const getBorderClass = () => {
      switch (data.borderStyle) {
        case 'double':
          return 'border-[5px] border-double border-black';
        case 'bold':
          return 'border-[3.5px] border-black';
        case 'none':
          return 'border-transparent';
        case 'single':
        default:
          return 'border-[2px] border-black';
      }
    };

    return (
      <div
        className="flex justify-center items-center select-text transition-transform duration-200 origin-top"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        {/* A4 Sheet Container (Standard 210mm x 297mm, ratio 1:1.414) */}
        {/* Standard screen representation: 794px x 1123px at 96dpi */}
        <div
          id="cover-page-a4"
          ref={ref}
          className="w-[794px] h-[1123px] bg-white shadow-2xl relative p-[36px] box-border text-black font-serif flex flex-col justify-between print:shadow-none print:m-0 print:p-[32px] print:w-full print:h-screen"
          style={{ fontFamily: "'Times New Roman', 'Tinos', 'Georgia', serif" }}
        >
          {/* Outer Border Box inset */}
          <div
            className={`w-full h-full p-8 sm:p-9 flex flex-col justify-between box-border relative ${getBorderClass()}`}
          >
            {/* Top Section: Logo & University / Department / Report Type */}
            <div className="text-center pt-1">
              {/* UAP Emblem Logo */}
              <div className="flex justify-center mb-2.5">
                <UapLogo size={98} />
              </div>

              {/* University Title */}
              <h1 className="text-[23px] font-bold tracking-[0.03em] uppercase text-black leading-tight mb-1.5">
                {data.universityName || 'UNIVERSITY OF ASIA PACIFIC'}
              </h1>

              {/* Department Title */}
              <h2 className="text-[18px] font-bold tracking-[0.02em] uppercase text-black leading-tight mb-2">
                {data.department || 'DEPARTMENT OF CSE'}
              </h2>

              {/* Academic subtle divider rule */}
              <div className="w-32 h-[1.5px] bg-black mx-auto mb-2 opacity-80" />

              {/* Lab Report Semester / Type */}
              <h3 className="text-[16px] font-bold uppercase tracking-wider text-black leading-normal">
                {data.reportType || 'Lab Report – Spring 2026'}
              </h3>
            </div>

            {/* Middle Section: Course Code, Title, Exp No, Exp Name, Dates */}
            {/* Unified 215px label width ensures 100% straight vertical colon alignment */}
            <div className="my-auto px-6 py-2">
              <div className="space-y-3.5 text-[15px]">
                {/* Course Code */}
                <div className="flex items-baseline">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    COURSE CODE
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-semibold text-[15.5px] tracking-wide">
                    {data.courseCode || 'EEE 102'}
                  </span>
                </div>

                {/* Course Title */}
                <div className="flex items-baseline">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    COURSE TITLE
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-semibold text-[15.5px] flex-1">
                    {data.courseTitle || 'Electrical Circuits Lab'}
                  </span>
                </div>

                {/* Experiment No. */}
                <div className="flex items-baseline">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    EXPERIMENT NO.
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-normal text-[15px]">{data.expNo || '01'}</span>
                </div>

                {/* Experiment Name */}
                <div className="flex items-baseline">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    EXPERIMENT NAME
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-normal text-[15px] leading-snug flex-1">
                    {data.expName || 'Verification of Ohm\'s Law and Kirchhoff\'s Voltage and Current Laws'}
                  </span>
                </div>

                {/* Date of Performance */}
                <div className="flex items-baseline pt-1">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    DATE OF PERFORMANCE
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-normal text-[15px]">
                    {data.performanceDate || '15 February, 2026'}
                  </span>
                </div>

                {/* Date of Submission */}
                <div className="flex items-baseline">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    DATE OF SUBMISSION
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-normal text-[15px]">
                    {data.submissionDate || '22 February, 2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Section: 2 Columns - SUBMITTED BY & SUBMITTED TO */}
            <div className="pt-2 pb-1 px-6">
              <div className="grid grid-cols-12 gap-8 items-start border-t border-black/30 pt-4">
                {/* Left Column: SUBMITTED BY */}
                <div className="col-span-7 space-y-1.5 text-[14.5px]">
                  <p className="font-bold text-[15px] uppercase tracking-wider mb-2 pb-0.5 border-b border-black/40 inline-block">
                    SUBMITTED BY:
                  </p>

                  <div className="flex items-baseline">
                    <span className="w-24 font-bold uppercase inline-block shrink-0">NAME</span>
                    <span className="w-5 font-bold text-center shrink-0">:</span>
                    <span className="font-semibold uppercase flex-1 break-words leading-tight">
                      {data.studentName || 'STUDENT NAME'}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-24 font-bold uppercase inline-block shrink-0">STUDENT ID</span>
                    <span className="w-5 font-bold text-center shrink-0">:</span>
                    <span className="font-normal font-mono text-[14px] flex-1">{data.studentId || '25201125'}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-24 font-bold uppercase inline-block shrink-0">SEMESTER</span>
                    <span className="w-5 font-bold text-center shrink-0">:</span>
                    <span className="font-normal flex-1">{data.semester || '1st Year 2nd Semester'}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-24 font-bold uppercase inline-block shrink-0">SECTION</span>
                    <span className="w-5 font-bold text-center shrink-0">:</span>
                    <span className="font-normal flex-1">{data.section || 'A'}</span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-24 font-bold uppercase inline-block shrink-0">GROUP</span>
                    <span className="w-5 font-bold text-center shrink-0">:</span>
                    <span className="font-normal flex-1">{data.group || 'A1'}</span>
                  </div>
                </div>

                {/* Right Column: SUBMITTED TO */}
                <div className="col-span-5 space-y-1 text-[14.5px] pl-2">
                  <p className="font-bold text-[15px] uppercase tracking-wider mb-2 pb-0.5 border-b border-black/40 inline-block">
                    SUBMITTED TO:
                  </p>
                  <p className="font-bold uppercase tracking-wide leading-tight text-[15px]">
                    {data.instructorName || 'M. ABDULLAH AL-AMIN'}
                  </p>
                  <p className="font-normal uppercase text-[13.5px] leading-tight text-slate-900">
                    {data.instructorDesignation || 'ASSISTANT PROFESSOR'}
                  </p>
                  <p className="font-normal uppercase text-[13.5px] leading-tight text-slate-900">
                    {data.instructorDepartment || 'DEPARTMENT OF EEE, UAP'}
                  </p>
                  <p className="font-normal uppercase text-[12.5px] leading-tight text-slate-800">
                    UNIVERSITY OF ASIA PACIFIC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CoverPagePreview.displayName = 'CoverPagePreview';
