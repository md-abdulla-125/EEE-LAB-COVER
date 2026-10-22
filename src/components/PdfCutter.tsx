import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import {
  Upload,
  Scissors,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckSquare,
  Square,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface PdfMetadata {
  file: File;
  name: string;
  size: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
  pageDimensions: Array<{ width: number; height: number }>;
}

export const PdfCutter: React.FC = () => {
  const [pdfData, setPdfData] = useState<PdfMetadata | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState<string>('');
  const [cutMode, setCutMode] = useState<'extract' | 'delete' | 'split_all'>('extract');
  const [outputName, setOutputName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseRangeStringToSet = (str: string, maxPages: number): Set<number> => {
    const set = new Set<number>();
    const parts = str.split(',').map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(maxPages, Math.max(start, end));
          for (let p = min; p <= max; p++) {
            set.add(p);
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          set.add(num);
        }
      }
    }
    return set;
  };

  const setToStringRange = (set: Set<number>): string => {
    const sorted = Array.from(set).sort((a, b) => a - b);
    if (sorted.length === 0) return '';

    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sorted[i];
        end = sorted[i];
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    return ranges.join(', ');
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid PDF file.' });
      return;
    }

    setStatusMessage(null);
    try {
      const buffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const count = pdf.getPageCount();

      const dimensions: Array<{ width: number; height: number }> = [];
      for (let i = 0; i < count; i++) {
        const page = pdf.getPage(i);
        dimensions.push({
          width: Math.round(page.getWidth()),
          height: Math.round(page.getHeight()),
        });
      }

      setPdfData({
        file,
        name: file.name,
        size: file.size,
        pageCount: count,
        arrayBuffer: buffer,
        pageDimensions: dimensions,
      });

      // Default select all pages or range
      const baseName = file.name.replace(/\.pdf$/i, '');
      setOutputName(`${baseName}_cut.pdf`);

      // Default select page 1 or all
      const initialSet = new Set<number>();
      for (let p = 1; p <= count; p++) initialSet.add(p);
      setSelectedPages(initialSet);
      setRangeInput(setToStringRange(initialSet));
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to read PDF. It might be password-protected or damaged.',
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const togglePage = (pageNumber: number) => {
    if (!pdfData) return;
    const nextSet = new Set(selectedPages);
    if (nextSet.has(pageNumber)) {
      nextSet.delete(pageNumber);
    } else {
      nextSet.add(pageNumber);
    }
    setSelectedPages(nextSet);
    setRangeInput(setToStringRange(nextSet));
  };

  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    if (!pdfData) return;
    const parsed = parseRangeStringToSet(val, pdfData.pageCount);
    setSelectedPages(parsed);
  };

  const selectAll = () => {
    if (!pdfData) return;
    const all = new Set<number>();
    for (let i = 1; i <= pdfData.pageCount; i++) all.add(i);
    setSelectedPages(all);
    setRangeInput(setToStringRange(all));
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
    setRangeInput('');
  };

  const selectOdd = () => {
    if (!pdfData) return;
    const odd = new Set<number>();
    for (let i = 1; i <= pdfData.pageCount; i += 2) odd.add(i);
    setSelectedPages(odd);
    setRangeInput(setToStringRange(odd));
  };

  const selectEven = () => {
    if (!pdfData) return;
    const even = new Set<number>();
    for (let i = 2; i <= pdfData.pageCount; i += 2) even.add(i);
    setSelectedPages(even);
    setRangeInput(setToStringRange(even));
  };

  const invertSelection = () => {
    if (!pdfData) return;
    const inverted = new Set<number>();
    for (let i = 1; i <= pdfData.pageCount; i++) {
      if (!selectedPages.has(i)) inverted.add(i);
    }
    setSelectedPages(inverted);
    setRangeInput(setToStringRange(inverted));
  };

  const handleExecuteCut = async () => {
    if (!pdfData) return;

    if (cutMode === 'split_all') {
      await handleSplitAll();
      return;
    }

    let targetPages: number[] = [];
    if (cutMode === 'extract') {
      targetPages = Array.from(selectedPages).sort((a, b) => a - b);
      if (targetPages.length === 0) {
        setStatusMessage({ type: 'error', text: 'Please select at least one page to extract.' });
        return;
      }
    } else if (cutMode === 'delete') {
      // Keep pages that are NOT in selectedPages
      const remaining: number[] = [];
      for (let i = 1; i <= pdfData.pageCount; i++) {
        if (!selectedPages.has(i)) remaining.push(i);
      }
      if (remaining.length === 0) {
        setStatusMessage({
          type: 'error',
          text: 'Cannot delete all pages! At least one page must remain in the PDF.',
        });
        return;
      }
      targetPages = remaining;
    }

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const srcDoc = await PDFDocument.load(pdfData.arrayBuffer);
      const newDoc = await PDFDocument.create();

      // Convert 1-based page numbers to 0-based indices
      const pageIndices = targetPages.map((p) => p - 1);
      const copied = await newDoc.copyPages(srcDoc, pageIndices);
      copied.forEach((p) => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const filename = outputName.trim().endsWith('.pdf') ? outputName.trim() : `${outputName.trim()}.pdf`;

      saveAs(blob, filename);

      setStatusMessage({
        type: 'success',
        text: `Successfully created "${filename}" with ${targetPages.length} page${
          targetPages.length > 1 ? 's' : ''
        }.`,
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to cut / split PDF. Please check the file and try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Split each page into separate individual PDF
  const handleSplitAll = async () => {
    if (!pdfData) return;

    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const srcDoc = await PDFDocument.load(pdfData.arrayBuffer);
      const base = pdfData.name.replace(/\.pdf$/i, '');

      for (let i = 0; i < pdfData.pageCount; i++) {
        const singleDoc = await PDFDocument.create();
        const [copied] = await singleDoc.copyPages(srcDoc, [i]);
        singleDoc.addPage(copied);

        const bytes = await singleDoc.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const name = `${base}_page_${i + 1}.pdf`;
        saveAs(blob, name);
      }

      setStatusMessage({
        type: 'success',
        text: `Successfully split all ${pdfData.pageCount} pages into individual PDF downloads.`,
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to split all pages. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tool Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                PDF Cutter & Splitter
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cut specific pages, extract sections, delete unwanted sheets, or split your report into separate files.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200/60 rounded-full text-xs font-semibold text-purple-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Client-Side • Instant</span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      {!pdfData ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl p-10 text-center cursor-pointer transition group shadow-xs hover:bg-purple-50/20"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 group-hover:bg-purple-100/70 border border-purple-100 flex items-center justify-center text-purple-600 transition mb-3">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Click or Drag & Drop PDF Document Here
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Upload your lab report or assignment PDF to choose which pages to cut, extract, or remove.
          </p>
        </div>
      ) : (
        /* Loaded PDF Document Card */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-5">
          {/* File details bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-50/50 border border-purple-100 rounded-xl p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                PDF
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                  {pdfData.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {formatFileSize(pdfData.size)} • Total {pdfData.pageCount} Pages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPdfData(null);
                  setSelectedPages(new Set());
                  setRangeInput('');
                  setStatusMessage(null);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Change PDF</span>
              </button>
            </div>
          </div>

          {/* Operation Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Choose Cut Operation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setCutMode('extract')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  cutMode === 'extract'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-xs ring-1 ring-purple-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Scissors className="w-3.5 h-3.5 text-purple-600" />
                  <span>Extract Selected Pages</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Keep only chosen pages into a new clean document.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCutMode('delete')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  cutMode === 'delete'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-xs ring-1 ring-purple-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Cut / Delete Pages</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Remove selected pages and save the remaining document.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCutMode('split_all')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  cutMode === 'split_all'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-xs ring-1 ring-purple-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Split Every Page</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Export each page as an individual 1-page PDF file.
                </p>
              </button>
            </div>
          </div>

          {cutMode !== 'split_all' && (
            <>
              {/* Range Input & Quick Buttons */}
              <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span>Page Selection Range</span>
                    <span className="text-[11px] font-normal text-slate-400">
                      (e.g. 1-3, 5, 7)
                    </span>
                  </label>
                  <span className="text-xs font-semibold text-purple-700">
                    {cutMode === 'extract'
                      ? `${selectedPages.size} of ${pdfData.pageCount} pages selected to keep`
                      : `${selectedPages.size} of ${pdfData.pageCount} pages selected to delete`}
                  </span>
                </div>

                <input
                  type="text"
                  value={rangeInput}
                  onChange={(e) => handleRangeInputChange(e.target.value)}
                  placeholder="e.g. 1-2, 5, 8"
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Quick Select:</span>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-purple-300 text-slate-700 rounded-md transition"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={selectOdd}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-purple-300 text-slate-700 rounded-md transition"
                  >
                    Odd Pages
                  </button>
                  <button
                    type="button"
                    onClick={selectEven}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-purple-300 text-slate-700 rounded-md transition"
                  >
                    Even Pages
                  </button>
                  <button
                    type="button"
                    onClick={invertSelection}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-purple-300 text-slate-700 rounded-md transition"
                  >
                    Invert
                  </button>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-rose-300 text-rose-600 rounded-md transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Visual Page Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    Interactive Page Grid
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Click any page card to toggle selection
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-72 overflow-y-auto p-1.5 border border-slate-200/80 rounded-xl bg-slate-50/50">
                  {Array.from({ length: pdfData.pageCount }, (_, i) => i + 1).map((pageNum) => {
                    const isSelected = selectedPages.has(pageNum);
                    const dim = pdfData.pageDimensions[pageNum - 1];

                    return (
                      <div
                        key={pageNum}
                        onClick={() => togglePage(pageNum)}
                        className={`cursor-pointer rounded-xl border p-2.5 flex flex-col items-center justify-between transition relative select-none ${
                          isSelected
                            ? cutMode === 'delete'
                              ? 'border-rose-400 bg-rose-50/70 text-rose-900 shadow-xs'
                              : 'border-purple-500 bg-purple-50/80 text-purple-900 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        {/* Checkbox icon */}
                        <div className="w-full flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold">
                            #{pageNum}
                          </span>
                          {isSelected ? (
                            cutMode === 'delete' ? (
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            ) : (
                              <CheckSquare className="w-3.5 h-3.5 text-purple-600" />
                            )
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>

                        {/* Page preview representation */}
                        <div
                          className={`w-full aspect-[1/1.4] rounded-md border flex items-center justify-center mb-1 ${
                            isSelected
                              ? cutMode === 'delete'
                                ? 'bg-rose-100/60 border-rose-200'
                                : 'bg-purple-100/60 border-purple-200'
                              : 'bg-slate-100 border-slate-200'
                          }`}
                        >
                          <FileText
                            className={`w-5 h-5 ${
                              isSelected
                                ? cutMode === 'delete'
                                  ? 'text-rose-500'
                                  : 'text-purple-600'
                                : 'text-slate-400'
                            }`}
                          />
                        </div>

                        {/* Size label */}
                        <span className="text-[9px] text-slate-400 font-mono">
                          {dim ? `${dim.width}×${dim.height}` : 'A4'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Output Filename input (for single output modes) */}
          {cutMode !== 'split_all' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Output PDF Filename
              </label>
              <input
                type="text"
                value={outputName}
                onChange={(e) => setOutputName(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="report_cut.pdf"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleExecuteCut}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing PDF...</span>
                </>
              ) : cutMode === 'extract' ? (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>Extract & Download ({selectedPages.size} {selectedPages.size === 1 ? 'Page' : 'Pages'})</span>
                </>
              ) : cutMode === 'delete' ? (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>
                    Cut Selected & Download ({pdfData.pageCount - selectedPages.size} {pdfData.pageCount - selectedPages.size === 1 ? 'Page' : 'Pages'} remaining)
                  </span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Split All ({pdfData.pageCount} Individual PDFs)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 shadow-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
};
