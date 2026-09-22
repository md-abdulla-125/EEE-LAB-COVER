import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Printer,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  Hash,
  Files,
} from 'lucide-react';
import { CoverPageData } from './types';
import { DEFAULT_COVER_DATA } from './data/defaultData';
import { EditorForm } from './components/EditorForm';
import { CoverPagePreview } from './components/CoverPagePreview';
import { UapLogo } from './components/UapLogo';
import { exportToDocx } from './utils/docxExport';
import { exportToPdf, printCoverPage, generateCoverPdfBlob } from './utils/pdfExport';
import { AddPageNumberPdf } from './components/AddPageNumberPdf';
import { MergePdf } from './components/MergePdf';

export default function App() {
  const [data, setData] = useState<CoverPageData>(() => {
    try {
      const saved = localStorage.getItem('uap_eee102_cover_data');
      if (saved) {
        return { ...DEFAULT_COVER_DATA, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_COVER_DATA;
  });

  const [activeSection, setActiveSection] = useState<'cover' | 'pagenum' | 'merge'>('cover');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [zoom, setZoom] = useState<number>(0.68);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleGetCoverPagePdfBlob = async (): Promise<Blob | null> => {
    if (!previewRef.current) return null;
    return await generateCoverPdfBlob(previewRef.current);
  };

  // Auto-save student persistent fields
  useEffect(() => {
    try {
      localStorage.setItem('uap_eee102_cover_data', JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(data);
      showToast('success', 'Microsoft Word (.docx) generated and downloaded successfully!');
    } catch (err) {
      console.error('Docx export failed:', err);
      showToast('error', 'Failed to generate Word document. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportPdf = async () => {
    const element = previewRef.current || document.getElementById('cover-page-a4');
    if (!element) {
      showToast('error', 'Preview element not found.');
      return;
    }
    try {
      setIsExportingPdf(true);
      await exportToPdf(element, data);
      showToast('success', 'PDF cover page generated and downloaded successfully!');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('error', 'Failed to generate PDF. You can also use the "Print / Save as PDF" button.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    printCoverPage();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300 transform translate-y-0 no-print">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#182353] text-white border-b border-[#253272] sticky top-0 z-30 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-0.5 rounded-lg shadow-xs shrink-0 overflow-hidden w-8 h-8 flex items-center justify-center">
              <img
                src="/psyduck-icon.jpg"
                alt="Website Icon"
                className="w-full h-full object-contain rounded-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="hidden sm:inline font-bold text-xs tracking-wide text-blue-200 uppercase">
              UAP EEE-102
            </span>
          </div>

          {/* 3 Section Navigation in Header: 1. Cover  2. Add Page Num  3. Merge PDF */}
          <nav
            id="header-tools-nav"
            className="flex items-center p-1 bg-[#0f173b] rounded-xl border border-white/10 shadow-inner"
          >
            <button
              type="button"
              id="section-nav-cover"
              onClick={() => setActiveSection('cover')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSection === 'cover'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Cover</span>
            </button>
            <button
              type="button"
              id="section-nav-pagenum"
              onClick={() => setActiveSection('pagenum')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSection === 'pagenum'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>2. Add Page Num</span>
            </button>
            <button
              type="button"
              id="section-nav-merge"
              onClick={() => setActiveSection('merge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeSection === 'merge'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Files className="w-3.5 h-3.5" />
              <span>3. Merge PDF</span>
            </button>
          </nav>

          {/* Header Action Buttons (Responsive on all screen sizes) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {activeSection === 'cover' ? (
              <>
                <button
                  type="button"
                  id="header-pdf-btn"
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition disabled:opacity-50"
                  title="Download PDF Document"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isExportingPdf ? 'Exporting...' : 'Download PDF'}</span>
                </button>
                <button
                  type="button"
                  id="header-print-btn"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                  title="Print Cover Page"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </>
            ) : (
              <span className="text-[11px] text-blue-200 hidden md:inline-block bg-blue-900/50 px-2.5 py-1 rounded-md border border-blue-400/20">
                100% Client-Side
              </span>
            )}
          </div>
        </div>

        {/* Mobile View Toggle only for Cover section */}
        {activeSection === 'cover' && (
          <div className="flex border-t border-[#253272] lg:hidden">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'editor'
                  ? 'bg-white/10 text-white border-b-2 border-blue-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'preview'
                  ? 'bg-white/10 text-white border-b-2 border-blue-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Live Preview
            </button>
          </div>
        )}
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* 1. Cover Page Section */}
        {activeSection === 'cover' && (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Left Column: Form Controls */}
            <div className={`lg:col-span-6 xl:col-span-5 no-print ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
              <EditorForm
                data={data}
                onChange={setData}
                onExportDocx={handleExportDocx}
                onExportPdf={handleExportPdf}
                onPrint={handlePrint}
                isExportingDocx={isExportingDocx}
                isExportingPdf={isExportingPdf}
              />
            </div>

            {/* Right Column: Live A4 Preview */}
            <div className={`lg:col-span-6 xl:col-span-7 ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
              {/* Preview Toolbar */}
              <div className="bg-white rounded-t-xl border border-slate-200 border-b-0 p-3 flex flex-wrap items-center justify-between gap-2 no-print shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-slate-800">
                    Live A4 Document Preview
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    (210mm × 297mm)
                  </span>
                </div>

                {/* Action buttons & Zoom Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.08).toFixed(2))))}
                      className="p-1 text-slate-600 hover:bg-white hover:shadow-xs rounded transition"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-medium text-slate-700 min-w-10 text-center font-mono">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoom((z) => Math.min(1.1, Number((z + 0.08).toFixed(2))))}
                      className="p-1 text-slate-600 hover:bg-white hover:shadow-xs rounded transition"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom(0.68)}
                      className="px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-white hover:shadow-xs rounded transition border border-transparent hover:border-slate-200"
                      title="Fit to Container"
                    >
                      Fit
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom(1)}
                      className="px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-white hover:shadow-xs rounded transition border border-transparent hover:border-slate-200"
                      title="100% Actual Size"
                    >
                      100%
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
                    <button
                      type="button"
                      onClick={handleExportPdf}
                      disabled={isExportingPdf}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md text-xs font-medium border border-rose-200 transition disabled:opacity-50"
                      title="Download PDF File"
                    >
                      <FileText className="w-3 h-3" />
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md text-xs font-medium transition"
                      title="Print Document"
                    >
                      <Printer className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* A4 Paper Canvas Viewport */}
              <div className="bg-slate-200/90 rounded-b-xl border border-slate-300/80 p-4 sm:p-8 overflow-auto flex justify-center shadow-inner min-h-[500px]">
                <div className="relative">
                  <CoverPagePreview ref={previewRef} data={data} zoom={zoom} />
                </div>
              </div>

              {/* Quick Export bar underneath preview */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 no-print">
                <div className="flex items-center gap-2">
                  <span>Format:</span>
                  <span className="font-semibold text-slate-700">A4 Portrait Standard</span>
                  <span>•</span>
                  <span>Font:</span>
                  <span className="font-semibold text-slate-700">Times New Roman</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    className="text-rose-700 hover:text-rose-800 font-semibold underline decoration-rose-300 underline-offset-2"
                  >
                    Download .pdf
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Add Page Number to PDF Section */}
        {activeSection === 'pagenum' && (
          <AddPageNumberPdf />
        )}

        {/* 3. Merge PDF Section */}
        {activeSection === 'merge' && (
          <MergePdf onGetCoverPagePdf={handleGetCoverPagePdfBlob} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            University of Asia Pacific (UAP) • EEE 102 Electrical Circuits Laboratory Cover Page Maker
          </p>
          <p className="text-slate-400">
            Compliant with official Department of CSE & EEE lab report format
          </p>
        </div>
      </footer>
    </div>
  );
}
