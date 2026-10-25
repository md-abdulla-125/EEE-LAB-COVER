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
  Image as ImageIcon,
  Scissors,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';
import { CoverPageData, AssignmentCoverData, CtCoverData } from './types';
import { DEFAULT_COVER_DATA } from './data/defaultData';
import { DEFAULT_ASSIGNMENT_DATA } from './data/assignmentData';
import { DEFAULT_CT_DATA } from './data/ctData';
import { EditorForm } from './components/EditorForm';
import { CoverPagePreview } from './components/CoverPagePreview';
import { AssignmentCoverForm } from './components/AssignmentCoverForm';
import { AssignmentCoverPreview } from './components/AssignmentCoverPreview';
import { CtCoverForm } from './components/CtCoverForm';
import { CtCoverPreview } from './components/CtCoverPreview';
import { exportToDocx, exportAssignmentToDocx, exportCtToDocx } from './utils/docxExport';
import { exportToPdf, exportAssignmentToPdf, exportCtToPdf, printCoverPage, generateCoverPdfBlob } from './utils/pdfExport';
import { AddPageNumberPdf } from './components/AddPageNumberPdf';
import { MergePdf } from './components/MergePdf';
import { ImageToPdf } from './components/ImageToPdf';
import { PdfCutter } from './components/PdfCutter';

export default function App() {
  // 1. Assignment Cover State
  const [assignmentData, setAssignmentData] = useState<AssignmentCoverData>(() => {
    try {
      const saved = localStorage.getItem('uap_assignment_cover_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.assignmentName === 'Final Project Report') {
          parsed.assignmentName = 'Assignment Name';
        }
        if (parsed.assignmentTopic === 'Final Project Report') {
          parsed.assignmentTopic = 'Assignment Name';
        }
        return { ...DEFAULT_ASSIGNMENT_DATA, ...parsed };
      }
    } catch {
      // ignore
    }
    return DEFAULT_ASSIGNMENT_DATA;
  });

  // 5. EEE Lab Cover State
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

  // 7. CT Cover State
  const [ctData, setCtData] = useState<CtCoverData>(() => {
    try {
      const saved = localStorage.getItem('uap_ct_cover_data');
      if (saved) {
        return { ...DEFAULT_CT_DATA, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CT_DATA;
  });

  const [activeSection, setActiveSection] = useState<'assignment' | 'pagenum' | 'merge' | 'imagetopdf' | 'cover' | 'cutter' | 'ctcover'>('assignment');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 0.44;
    }
    return 0.68;
  });
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const assignmentPreviewRef = useRef<HTMLDivElement>(null);
  const ctPreviewRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFitZoom = () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        const calculated = Number(((window.innerWidth - 32) / 794).toFixed(2));
        setZoom(Math.min(0.68, Math.max(0.35, calculated)));
      } else {
        setZoom(0.68);
      }
    } else {
      setZoom(0.68);
    }
  };

  const handleGetCoverPagePdfBlob = async (): Promise<Blob | null> => {
    const targetRef =
      activeSection === 'cover'
        ? previewRef.current
        : activeSection === 'ctcover'
        ? ctPreviewRef.current
        : (assignmentPreviewRef.current || previewRef.current);
    if (!targetRef) return null;
    return await generateCoverPdfBlob(targetRef);
  };

  // Auto-save student persistent fields for Assignment, Lab, and CT Cover
  useEffect(() => {
    try {
      localStorage.setItem('uap_assignment_cover_data', JSON.stringify(assignmentData));
    } catch {
      // ignore
    }
  }, [assignmentData]);

  useEffect(() => {
    try {
      localStorage.setItem('uap_eee102_cover_data', JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem('uap_ct_cover_data', JSON.stringify(ctData));
    } catch {
      // ignore
    }
  }, [ctData]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // Lab Report exports
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

  // Assignment Cover exports
  const handleExportAssignmentDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportAssignmentToDocx(assignmentData);
      showToast('success', 'Assignment Word (.docx) downloaded successfully!');
    } catch (err) {
      console.error('Docx export failed:', err);
      showToast('error', 'Failed to generate Word document. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportAssignmentPdf = async () => {
    const element = assignmentPreviewRef.current || document.getElementById('assignment-cover-page-a4');
    if (!element) {
      showToast('error', 'Preview element not found.');
      return;
    }
    try {
      setIsExportingPdf(true);
      await exportAssignmentToPdf(element, assignmentData);
      showToast('success', 'Assignment PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('error', 'Failed to generate PDF. You can also use the "Print / Save as PDF" button.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // CT Cover exports
  const handleExportCtDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportCtToDocx(ctData);
      showToast('success', 'Class Test (CT) Word (.docx) downloaded successfully!');
    } catch (err) {
      console.error('Docx export failed:', err);
      showToast('error', 'Failed to generate CT Word document. Please try again.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportCtPdf = async () => {
    const element = ctPreviewRef.current || document.getElementById('ct-cover-page-a4');
    if (!element) {
      showToast('error', 'Preview element not found.');
      return;
    }
    try {
      setIsExportingPdf(true);
      await exportCtToPdf(element, ctData);
      showToast('success', 'Class Test (CT) PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('error', 'Failed to generate CT PDF. You can also use the "Print / Save as PDF" button.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    printCoverPage();
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] flex flex-col font-sans text-slate-800">
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

      {/* Mobile Side Panel (Drawer Backdrop) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Side Panel (Drawer Menu) */}
      <aside
        id="mobile-side-panel"
        className={`fixed inset-y-0 left-0 w-[290px] max-w-[85vw] bg-white text-slate-800 z-50 lg:hidden shadow-2xl flex flex-col transform transition-transform duration-300 ease-out no-print ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Drawer"
      >
        {/* Drawer Header */}
        <div className="bg-[#DF301C] p-4 text-white flex items-center justify-between border-b border-[#C72412] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-xs shrink-0 overflow-hidden w-9 h-9 flex items-center justify-center">
              <img
                src="/psyduck-icon.jpg"
                alt="UAP Icon"
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wide text-white block">
                UAP-25201125
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 -mr-1 text-white hover:bg-white/20 active:bg-white/30 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close navigation panel"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Drawer Body - Navigation List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-[#DF301C] uppercase tracking-wider">
            Select Tool
          </div>

          {/* 1. Assignment Cover */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('assignment');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left min-h-[48px] ${
              activeSection === 'assignment'
                ? 'bg-[#FFF1D1] text-[#DF301C] shadow-xs border-l-4 border-[#00B7CD]'
                : 'text-slate-700 hover:bg-[#FAF7EE] hover:text-[#DF301C] border-l-4 border-transparent'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeSection === 'assignment' ? 'bg-[#DF301C] text-white' : 'bg-slate-100 text-slate-600'}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs">1. Assignment Cover</div>
            </div>
          </button>

          {/* 2. Add Page Num */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('pagenum');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left min-h-[48px] ${
              activeSection === 'pagenum'
                ? 'bg-[#FFF1D1] text-[#DF301C] shadow-xs border-l-4 border-[#00B7CD]'
                : 'text-slate-700 hover:bg-[#FAF7EE] hover:text-[#DF301C] border-l-4 border-transparent'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeSection === 'pagenum' ? 'bg-[#DF301C] text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Hash className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs">2. Add Page Num</div>
            </div>
          </button>

          {/* 3. Merge PDF */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('merge');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left min-h-[48px] ${
              activeSection === 'merge'
                ? 'bg-[#FFF1D1] text-[#DF301C] shadow-xs border-l-4 border-[#00B7CD]'
                : 'text-slate-700 hover:bg-[#FAF7EE] hover:text-[#DF301C] border-l-4 border-transparent'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeSection === 'merge' ? 'bg-[#DF301C] text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Files className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs">3. Merge PDF</div>
            </div>
          </button>

          {/* 4. Image to PDF */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('imagetopdf');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left min-h-[48px] ${
              activeSection === 'imagetopdf'
                ? 'bg-[#FFF1D1] text-[#DF301C] shadow-xs border-l-4 border-[#00B7CD]'
                : 'text-slate-700 hover:bg-[#FAF7EE] hover:text-[#DF301C] border-l-4 border-transparent'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeSection === 'imagetopdf' ? 'bg-[#DF301C] text-white' : 'bg-slate-100 text-slate-600'}`}>
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs">4. Image to PDF</div>
            </div>
          </button>

          {/* 5. EEE Lab Cover -102 */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('cover');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left min-h-[48px] ${
              activeSection === 'cover'
                ? 'bg-[#FFF1D1] text-[#DF301C] shadow-xs border-l-4 border-[#00B7CD]'
                : 'text-slate-700 hover:bg-[#FAF7EE] hover:text-[#DF301C] border-l-4 border-transparent'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeSection === 'cover' ? 'bg-[#DF301C] text-white' : 'bg-slate-100 text-slate-600'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs">5. EEE Lab Cover -102</div>
            </div>
          </button>

          {/* 6. PDF Cutter */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('cutter');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left min-h-[48px] ${
              activeSection === 'cutter'
                ? 'bg-[#FFF1D1] text-[#DF301C] shadow-xs border-l-4 border-[#00B7CD]'
                : 'text-slate-700 hover:bg-[#FAF7EE] hover:text-[#DF301C] border-l-4 border-transparent'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeSection === 'cutter' ? 'bg-[#DF301C] text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Scissors className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs">6. PDF Cutter</div>
            </div>
          </button>

          {/* 7. CT Cover */}
          <button
            type="button"
            onClick={() => {
              setActiveSection('ctcover');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left min-h-[48px] ${
              activeSection === 'ctcover'
                ? 'bg-[#FFF1D1] text-[#DF301C] shadow-xs border-l-4 border-[#00B7CD]'
                : 'text-slate-700 hover:bg-[#FAF7EE] hover:text-[#DF301C] border-l-4 border-transparent'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeSection === 'ctcover' ? 'bg-[#DF301C] text-white' : 'bg-slate-100 text-slate-600'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xs">7. CT Cover</div>
            </div>
          </button>

        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 bg-[#FFF1D1]/30 border-t border-[#FFE4B5]/60 text-center">
          <p className="text-[11px] font-bold text-slate-700">
            University of Asia Pacific
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            100% Client-Side Privacy • No files uploaded
          </p>
        </div>
      </aside>

      {/* Header */}
      <header className="bg-[#DF301C] text-white shadow-md sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Brand Container */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:bg-white/20 active:bg-white/30 rounded-xl transition min-w-[40px] min-h-[40px] flex items-center justify-center -ml-1"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            <div className="bg-white p-1 rounded-xl shadow-xs shrink-0 overflow-hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
              <img
                src="/psyduck-icon.jpg"
                alt="UAP Icon"
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <span className="font-black text-sm sm:text-base md:text-lg tracking-wide text-white block leading-tight">
                UAP-25201125
              </span>
            </div>
          </div>

          {/* Desktop/Tablet Main Tools Navigation */}
          <nav
            id="header-tools-nav"
            aria-label="Academic Tools Navigation"
            className="hidden lg:flex items-center gap-1 bg-black/15 p-1 rounded-xl border border-white/10"
          >
            <button
              type="button"
              id="section-nav-assignment"
              onClick={() => setActiveSection('assignment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeSection === 'assignment'
                  ? 'bg-[#00B7CD] text-white shadow-xs'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Assignment Cover</span>
            </button>

            <button
              type="button"
              id="section-nav-pagenum"
              onClick={() => setActiveSection('pagenum')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeSection === 'pagenum'
                  ? 'bg-[#00B7CD] text-white shadow-xs'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>2. Add Page Num</span>
            </button>

            <button
              type="button"
              id="section-nav-merge"
              onClick={() => setActiveSection('merge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeSection === 'merge'
                  ? 'bg-[#00B7CD] text-white shadow-xs'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Files className="w-3.5 h-3.5" />
              <span>3. Merge PDF</span>
            </button>

            <button
              type="button"
              id="section-nav-imagetopdf"
              onClick={() => setActiveSection('imagetopdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeSection === 'imagetopdf'
                  ? 'bg-[#00B7CD] text-white shadow-xs'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>4. Image to PDF</span>
            </button>

            <button
              type="button"
              id="section-nav-cover"
              onClick={() => setActiveSection('cover')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeSection === 'cover'
                  ? 'bg-[#00B7CD] text-white shadow-xs'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>5. EEE Lab Cover -102</span>
            </button>

            <button
              type="button"
              id="section-nav-cutter"
              onClick={() => setActiveSection('cutter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeSection === 'cutter'
                  ? 'bg-[#00B7CD] text-white shadow-xs'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>6. PDF Cutter</span>
            </button>

            <button
              type="button"
              id="section-nav-ctcover"
              onClick={() => setActiveSection('ctcover')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition min-h-[36px] ${
                activeSection === 'ctcover'
                  ? 'bg-[#00B7CD] text-white shadow-xs'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>7. CT Cover</span>
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2">
            {/* Mobile/Tablet Preview/Editor Toggle */}
            {(activeSection === 'assignment' || activeSection === 'cover' || activeSection === 'ctcover') && (
              <div className="lg:hidden flex items-center bg-black/20 p-0.5 rounded-xl border border-white/20">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    activeTab === 'editor'
                      ? 'bg-[#FFF1D1] text-[#DF301C] shadow-xs'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    activeTab === 'preview'
                      ? 'bg-[#FFF1D1] text-[#DF301C] shadow-xs'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
              </div>
            )}

            {/* Side Panel Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/20 hover:bg-black/30 active:bg-black/40 rounded-xl text-white font-bold text-xs transition border border-white/20"
              title="Browse all academic tools"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">All Tools</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* 1. Assignment Cover Section */}
        {activeSection === 'assignment' && (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Left Column: Form Controls */}
            <div className={`lg:col-span-6 xl:col-span-5 no-print ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
              <AssignmentCoverForm
                data={assignmentData}
                onChange={setAssignmentData}
                onExportDocx={handleExportAssignmentDocx}
                onExportPdf={handleExportAssignmentPdf}
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
                    Live A4 Assignment Document Preview
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    (210mm × 297mm)
                  </span>
                </div>

                {/* Zoom Controls */}
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
                </div>
              </div>

              {/* A4 Paper Canvas Viewport */}
              <div className="bg-slate-200/90 rounded-b-xl border border-slate-300/80 p-4 sm:p-8 overflow-auto flex items-center justify-center shadow-inner min-h-[500px]">
                <div className="relative flex items-center justify-center my-auto mx-auto">
                  <AssignmentCoverPreview ref={assignmentPreviewRef} data={assignmentData} zoom={zoom} />
                </div>
              </div>

              {/* Quick Info bar */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 no-print">
                <div className="flex items-center gap-2">
                  <span>Format:</span>
                  <span className="font-semibold text-slate-700">A4 Portrait Standard</span>
                  <span>•</span>
                  <span>Font:</span>
                  <span className="font-semibold text-slate-700">Times New Roman</span>
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

        {/* 4. Image to PDF Section */}
        {activeSection === 'imagetopdf' && (
          <ImageToPdf />
        )}

        {/* 5. EEE Lab Cover -102 Section */}
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
                    Live A4 Lab Report Preview
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
                </div>
              </div>

              {/* A4 Paper Canvas Viewport */}
              <div className="bg-slate-200/90 rounded-b-xl border border-slate-300/80 p-4 sm:p-8 overflow-auto flex items-center justify-center shadow-inner min-h-[500px]">
                <div className="relative flex items-center justify-center my-auto mx-auto">
                  <CoverPagePreview ref={previewRef} data={data} zoom={zoom} />
                </div>
              </div>

              {/* Quick Info bar underneath preview */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 no-print">
                <div className="flex items-center gap-2">
                  <span>Format:</span>
                  <span className="font-semibold text-slate-700">A4 Portrait Standard</span>
                  <span>•</span>
                  <span>Font:</span>
                  <span className="font-semibold text-slate-700">Times New Roman</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. PDF Cutter Section */}
        {activeSection === 'cutter' && (
          <PdfCutter />
        )}

        {/* 7. CT Cover Section */}
        {activeSection === 'ctcover' && (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            {/* Left Column: Form Controls */}
            <div className={`lg:col-span-6 xl:col-span-5 no-print ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
              <CtCoverForm
                data={ctData}
                onChange={setCtData}
                onExportDocx={handleExportCtDocx}
                onExportPdf={handleExportCtPdf}
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
                    Live A4 Class Test (CT) Preview
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
                </div>
              </div>

              {/* A4 Paper Canvas Viewport */}
              <div className="bg-slate-200/90 rounded-b-xl border border-slate-300/80 p-4 sm:p-8 overflow-auto flex items-center justify-center shadow-inner min-h-[500px]">
                <div className="relative flex items-center justify-center my-auto mx-auto">
                  <CtCoverPreview ref={ctPreviewRef} data={ctData} zoom={zoom} />
                </div>
              </div>

              {/* Quick Info bar underneath preview */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 no-print">
                <div className="flex items-center gap-2">
                  <span>Format:</span>
                  <span className="font-semibold text-slate-700">A4 Portrait Standard</span>
                  <span>•</span>
                  <span>Font:</span>
                  <span className="font-semibold text-slate-700">Times New Roman</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            University of Asia Pacific (UAP) • Academic Tools & Cover Page Maker
          </p>
          <p className="text-slate-400">
            Compliant with official Department of CSE & EEE academic standards
          </p>
        </div>
      </footer>
    </div>
  );
}
