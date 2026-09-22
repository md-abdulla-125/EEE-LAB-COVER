import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import {
  Upload,
  Files,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface PdfItem {
  id: string;
  name: string;
  size: number;
  pages: number;
  file?: File;
  blob?: Blob;
  isCoverPage?: boolean;
}

interface MergePdfProps {
  onGetCoverPagePdf?: () => Promise<Blob | null>;
}

export const MergePdf: React.FC<MergePdfProps> = ({ onGetCoverPagePdf }) => {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [outputName, setOutputName] = useState('UAP_EEE102_Lab_Report_Complete.pdf');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setStatusMessage(null);
    const newItems: PdfItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        newItems.push({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          pages: pdf.getPageCount(),
          file,
        });
      } catch {
        setStatusMessage({
          type: 'error',
          text: `Could not load "${file.name}". File might be corrupted.`,
        });
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const handleAddCurrentCover = async () => {
    if (!onGetCoverPagePdf) return;
    try {
      setStatusMessage(null);
      const coverBlob = await onGetCoverPagePdf();
      if (!coverBlob) {
        setStatusMessage({
          type: 'error',
          text: 'Unable to render current cover page. Please try again.',
        });
        return;
      }

      const buffer = await coverBlob.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);

      const coverItem: PdfItem = {
        id: `cover-${Date.now()}`,
        name: 'UAP_Cover_Page_Generated.pdf',
        size: coverBlob.size,
        pages: pdf.getPageCount(),
        blob: coverBlob,
        isCoverPage: true,
      };

      // Add to beginning of items list as page 1
      setItems((prev) => [coverItem, ...prev]);
      setStatusMessage({
        type: 'success',
        text: 'Generated UAP Cover Page added as the first document!',
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to capture the current cover page.',
      });
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setItems(updated);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMergePdfs = async () => {
    if (items.length < 2) {
      setStatusMessage({
        type: 'error',
        text: 'Please add at least 2 PDF files to merge.',
      });
      return;
    }

    try {
      setIsMerging(true);
      setStatusMessage(null);

      const mergedPdf = await PDFDocument.create();

      for (const item of items) {
        let buffer: ArrayBuffer;
        if (item.file) {
          buffer = await item.file.arrayBuffer();
        } else if (item.blob) {
          buffer = await item.blob.arrayBuffer();
        } else {
          continue;
        }

        const pdf = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const filename = outputName.trim().endsWith('.pdf') ? outputName.trim() : `${outputName.trim()}.pdf`;

      saveAs(blob, filename);

      setStatusMessage({
        type: 'success',
        text: `Successfully merged ${items.length} documents (${mergedPdf.getPageCount()} total pages)!`,
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to merge documents. Ensure all PDF files are valid and unrestricted.',
      });
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = items.reduce((sum, item) => sum + item.pages, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
            <Files className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Merge PDF Files into One Report</h2>
            <p className="text-xs text-slate-500">
              Combine your generated cover page with your experiment report sheets into a single ready-to-submit PDF.
            </p>
          </div>
        </div>

        {onGetCoverPagePdf && (
          <button
            type="button"
            onClick={handleAddCurrentCover}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            + Add Current Cover Page
          </button>
        )}
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

      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="bg-white rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 p-6 sm:p-8 text-center transition cursor-pointer flex flex-col items-center justify-center group"
        onClick={() => document.getElementById('merge-files-input')?.click()}
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">
          Click or drop PDF files here to merge
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-3">
          Select multiple files (Cover Page, Experiment Theory, Graph Calculations, Observations).
        </p>
        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-xs group-hover:bg-indigo-700 transition">
          Browse PDFs
        </span>
        <input
          id="merge-files-input"
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Items List */}
      {items.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Document Order</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {items.length} files • {totalPages} total pages
              </span>
            </div>
            <button
              type="button"
              onClick={() => setItems([])}
              className="text-xs text-slate-400 hover:text-rose-600 transition"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition ${
                  item.isCoverPage
                    ? 'bg-blue-50/60 border-blue-200'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {index + 1}
                  </div>
                  <div className="p-2 rounded bg-white shadow-xs text-slate-600 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </p>
                      {item.isCoverPage && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 shrink-0">
                          Cover
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {item.pages} {item.pages === 1 ? 'page' : 'pages'} •{' '}
                      {(item.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-white transition"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-white transition"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-white transition"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Settings & Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Merged File Name
              </label>
              <input
                type="text"
                value={outputName}
                onChange={(e) => setOutputName(e.target.value)}
                className="w-full sm:max-w-xs px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <button
              type="button"
              onClick={handleMergePdfs}
              disabled={isMerging || items.length < 2}
              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isMerging ? 'Merging PDFs...' : `Merge & Download (${items.length} Files)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
