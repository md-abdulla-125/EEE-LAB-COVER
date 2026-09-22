import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import {
  Upload,
  FileText,
  Hash,
  Download,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Trash2,
  FileCheck,
} from 'lucide-react';

export const AddPageNumberPdf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center'>('bottom-center');
  const [format, setFormat] = useState<'number' | 'page-n' | 'n-of-total' | 'page-n-of-total' | 'dash'>('n-of-total');
  const [skipCover, setSkipCover] = useState<boolean>(true);
  const [startNumber, setStartNumber] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(11);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid PDF file.' });
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      setFile(selectedFile);
      setPageCount(pdf.getPageCount());
      setStatusMessage(null);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to read the PDF. It may be password-protected or corrupted.' });
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (droppedFile.type !== 'application/pdf' && !droppedFile.name.endsWith('.pdf')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid PDF file.' });
      return;
    }

    try {
      const buffer = await droppedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      setFile(droppedFile);
      setPageCount(pdf.getPageCount());
      setStatusMessage(null);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to read the PDF. It may be password-protected or corrupted.' });
    }
  };

  const handleProcessPdf = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setStatusMessage(null);

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const total = pages.length;

      const effectiveTotal = skipCover ? Math.max(1, total - 1) : total;

      for (let i = 0; i < total; i++) {
        if (skipCover && i === 0) {
          continue; // Leave cover page clean
        }

        const page = pages[i];
        const { width, height } = page.getSize();
        const currentNum = startNumber + (skipCover ? i - 1 : i);

        let label = `${currentNum}`;
        if (format === 'page-n') {
          label = `Page ${currentNum}`;
        } else if (format === 'n-of-total') {
          label = `${currentNum} of ${effectiveTotal}`;
        } else if (format === 'page-n-of-total') {
          label = `Page ${currentNum} of ${effectiveTotal}`;
        } else if (format === 'dash') {
          label = `- ${currentNum} -`;
        }

        const textWidth = font.widthOfTextAtSize(label, fontSize);
        const textHeight = font.heightAtSize(fontSize);
        const margin = 30; // standard margin in points (~10.5mm)

        let x = width / 2 - textWidth / 2;
        let y = margin;

        if (position === 'bottom-center') {
          x = width / 2 - textWidth / 2;
          y = margin;
        } else if (position === 'bottom-right') {
          x = width - margin - textWidth;
          y = margin;
        } else if (position === 'bottom-left') {
          x = margin;
          y = margin;
        } else if (position === 'top-right') {
          x = width - margin - textWidth;
          y = height - margin - textHeight;
        } else if (position === 'top-center') {
          x = width / 2 - textWidth / 2;
          y = height - margin - textHeight;
        }

        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.25),
        });
      }

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const originalName = file.name.replace(/\.pdf$/i, '');
      saveAs(blob, `${originalName}_numbered.pdf`);

      setStatusMessage({
        type: 'success',
        text: `Successfully added page numbers to ${total} pages! Download started.`,
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error processing PDF. Please check if file is valid.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPreviewText = () => {
    const num = startNumber;
    const total = pageCount ? (skipCover ? Math.max(1, pageCount - 1) : pageCount) : 10;
    if (format === 'page-n') return `Page ${num}`;
    if (format === 'n-of-total') return `${num} of ${total}`;
    if (format === 'page-n-of-total') return `Page ${num} of ${total}`;
    if (format === 'dash') return `- ${num} -`;
    return `${num}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Page Numbers to Lab Report PDF</h2>
            <p className="text-xs text-slate-500">
              Easily stamp clean page numbering onto your lab report sheets before final submission.
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Upload Zone */}
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="bg-white rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-400 p-8 sm:p-12 text-center transition cursor-pointer flex flex-col items-center justify-center group"
          onClick={() => document.getElementById('pdf-upload-input')?.click()}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Click to upload or drag & drop your PDF
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Select your lab report document. Page numbers will be applied directly without changing your existing layout.
          </p>
          <span className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-xs group-hover:bg-blue-700 transition">
            Browse Files (.pdf)
          </span>
          <input
            id="pdf-upload-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                {file.name}
              </h4>
              <p className="text-xs text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {pageCount} pages detected
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPageCount(null);
            }}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium inline-flex items-center gap-1 p-2 rounded-lg hover:bg-rose-50 transition"
            title="Remove and select another file"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Change File</span>
          </button>
        </div>
      )}

      {/* Settings Grid */}
      {file && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Options Panel */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Settings2 className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-sm text-slate-900">Page Number Options</h3>
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Number Position
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bottom-center', label: 'Bottom Center' },
                  { id: 'bottom-right', label: 'Bottom Right' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'top-center', label: 'Top Center' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id as typeof position)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition ${
                      position === pos.id
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Numbering Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'n-of-total', label: '1 of 5 (Recommended)' },
                  { id: 'page-n-of-total', label: 'Page 1 of 5' },
                  { id: 'number', label: '1, 2, 3...' },
                  { id: 'page-n', label: 'Page 1, Page 2' },
                  { id: 'dash', label: '- 1 -, - 2 -' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormat(fmt.id as typeof format)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-left transition ${
                      format === fmt.id
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skip First Page Checkbox */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipCover}
                  onChange={(e) => setSkipCover(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs text-slate-800 font-medium">
                  Skip first page (Do not number Cover Page)
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Start numbering at:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={startNumber}
                    onChange={(e) => setStartNumber(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Font Size:
                  </label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={9}>Small (9pt)</option>
                    <option value={11}>Standard (11pt)</option>
                    <option value={13}>Large (13pt)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Card & Action */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-slate-900 pb-2 border-b border-slate-100 mb-3">
                Visual Placement Preview
              </h3>

              {/* Mock PDF Sheet */}
              <div className="relative aspect-[1/1.3] max-w-[240px] mx-auto bg-slate-50 border-2 border-slate-300 rounded-lg shadow-sm flex flex-col justify-between p-3 overflow-hidden">
                {/* Top header mockup */}
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <div className="w-12 h-1.5 bg-slate-200 rounded"></div>
                  {position === 'top-center' && (
                    <span className="font-bold text-blue-600 font-mono text-[10px] animate-pulse">
                      {getPreviewText()}
                    </span>
                  )}
                  {position === 'top-right' && (
                    <span className="font-bold text-blue-600 font-mono text-[10px] animate-pulse">
                      {getPreviewText()}
                    </span>
                  )}
                </div>

                {/* Mock Content Lines */}
                <div className="space-y-1.5 py-4">
                  <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded"></div>
                  <div className="w-5/6 h-1.5 bg-slate-200 rounded"></div>
                  <div className="w-2/3 h-1.5 bg-slate-200 rounded"></div>
                  <div className="w-4/5 h-1.5 bg-slate-200 rounded"></div>
                </div>

                {/* Bottom footer mockup */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                  {position === 'bottom-left' ? (
                    <span className="font-bold text-blue-600 font-mono text-[10px] animate-pulse">
                      {getPreviewText()}
                    </span>
                  ) : (
                    <div className="w-10 h-1 bg-slate-200 rounded"></div>
                  )}

                  {position === 'bottom-center' && (
                    <span className="font-bold text-blue-600 font-mono text-[10px] animate-pulse">
                      {getPreviewText()}
                    </span>
                  )}

                  {position === 'bottom-right' ? (
                    <span className="font-bold text-blue-600 font-mono text-[10px] animate-pulse">
                      {getPreviewText()}
                    </span>
                  ) : (
                    <div className="w-10 h-1 bg-slate-200 rounded"></div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  Sample: {getPreviewText()} ({position.replace('-', ' ')})
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleProcessPdf}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isProcessing ? 'Processing PDF...' : 'Add Page Numbers & Download'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
