import React, { forwardRef } from 'react';
import { CtCoverData } from '../types';
import { UapLogo } from './UapLogo';

interface CtCoverPreviewProps {
  data: CtCoverData;
  zoom?: number;
}

export const CtCoverPreview = forwardRef<HTMLDivElement, CtCoverPreviewProps>(
  ({ data, zoom = 1 }, ref) => {
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

    const courseCode = data.courseCode || 'CSE 201';
    const courseTitle = data.courseTitle || 'Data Structures and Algorithms';
    const ctNumber = data.ctNumber || 'Class Test - 01';
    const studentName = data.studentName || 'Your Name';
    const studentId = data.studentId || '24108116';
    const section = data.section || 'A';
    const semester = data.semester || 'Spring 2026';
    const displayDate = data.date || '25 October 2026';

    return (
      <div
        className="relative select-text transition-all duration-200 mx-auto my-auto shrink-0"
        style={{
          width: `${Math.round(794 * zoom)}px`,
          height: `${Math.round(1123 * zoom)}px`,
        }}
      >
        {/* Standard A4 representation (794px x 1123px at 96dpi) */}
        <div
          id="ct-cover-page-a4"
          ref={ref}
          className="w-[794px] h-[1123px] bg-white shadow-2xl absolute top-0 left-0 p-[36px] box-border text-black font-serif flex flex-col justify-between print:static print:p-[32px] print:w-full print:h-screen origin-top-left shrink-0"
          style={{
            fontFamily: "'Times New Roman', 'Tinos', 'Georgia', serif",
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Outer Border Box inset */}
          <div
            className={`w-full h-full p-8 sm:p-9 flex flex-col justify-between box-border relative ${getBorderClass()}`}
          >
            {/* Top Section: Logo & University / Department Header */}
            <div className="text-center pt-1">
              <div className="flex justify-center mb-2.5">
                <UapLogo size={98} />
              </div>

              <h1 className="text-[23px] font-bold tracking-[0.03em] uppercase text-black leading-tight mb-1.5">
                {data.universityName || 'UNIVERSITY OF ASIA PACIFIC'}
              </h1>

              <h2 className="text-[17px] font-bold tracking-[0.02em] uppercase text-black leading-tight mb-2">
                {data.department || 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING'}
              </h2>

              <div className="w-32 h-[1.5px] bg-black mx-auto mb-2 opacity-80" />

              <h3 className="text-[18px] font-bold uppercase tracking-wider text-black leading-normal">
                {ctNumber.toUpperCase()} – {semester.toUpperCase()}
              </h3>
            </div>

            {/* Middle Section: Course & CT Details Table */}
            <div className="my-auto px-6 py-2">
              <div className="space-y-4 text-[15px]">
                {/* Course Title */}
                <div className="flex items-baseline">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    COURSE TITLE
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-semibold text-[15.5px] flex-1">
                    {courseTitle}
                  </span>
                </div>

                {/* Course Code */}
                <div className="flex items-baseline">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    COURSE CODE
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-semibold text-[15.5px] tracking-wide">
                    {courseCode}
                  </span>
                </div>

                {/* CT Title / Number */}
                <div className="flex items-baseline">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    CLASS TEST NO.
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-semibold text-[15.5px] leading-snug flex-1">
                    {ctNumber}
                  </span>
                </div>

                {/* Section */}
                <div className="flex items-baseline">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    SECTION
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-semibold text-[15.5px]">
                    {section}
                  </span>
                </div>

                {/* Date of CT */}
                <div className="flex items-baseline pt-1">
                  <span className="w-[215px] font-bold uppercase tracking-wide inline-block shrink-0">
                    DATE OF CT
                  </span>
                  <span className="w-6 font-bold text-center shrink-0">:</span>
                  <span className="font-normal text-[15px]">
                    {displayDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Section: SUBMITTED BY & SUBMITTED TO */}
            <div className="pt-2 pb-1 px-6">
              <div className="grid grid-cols-12 gap-8 items-start border-t border-black/30 pt-4">
                {/* Left Column: SUBMITTED BY */}
                <div className="col-span-7 space-y-1.5 text-[14.5px]">
                  <p className="font-bold text-[15px] uppercase tracking-wider mb-2 pb-0.5 border-b border-black/40 inline-block">
                    SUBMITTED BY:
                  </p>

                  <div className="flex items-baseline">
                    <span className="w-28 font-bold uppercase inline-block shrink-0">NAME</span>
                    <span className="w-5 font-bold text-center shrink-0">:</span>
                    <span className="font-semibold flex-1 break-words leading-tight">
                      {studentName}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-28 font-bold uppercase inline-block shrink-0">REG. NO.</span>
                    <span className="w-5 font-bold text-center shrink-0">:</span>
                    <span className="font-medium font-mono tracking-wide">
                      {studentId}
                    </span>
                  </div>

                  <div className="flex items-baseline">
                    <span className="w-28 font-bold uppercase inline-block shrink-0">SECTION</span>
                    <span className="w-5 font-bold text-center shrink-0">:</span>
                    <span className="font-medium">{section}</span>
                  </div>
                </div>

                {/* Right Column: SUBMITTED TO */}
                <div className="col-span-5 space-y-1 text-[14.5px]">
                  <p className="font-bold text-[15px] uppercase tracking-wider mb-2 pb-0.5 border-b border-black/40 inline-block">
                    SUBMITTED TO:
                  </p>

                  <p className="font-bold text-[15px] text-black leading-tight">
                    {data.instructorName || 'Lecturer Name'}
                  </p>
                  <p className="font-normal text-[14px] text-slate-900 leading-tight">
                    {data.instructorDesignation || 'Lecturer'}
                  </p>
                  <p className="font-normal text-[14px] text-slate-900 leading-tight">
                    {data.instructorDepartment || 'Department of CSE'}
                  </p>
                  <p className="font-normal text-[13.5px] text-slate-800 leading-tight pt-0.5">
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

CtCoverPreview.displayName = 'CtCoverPreview';
