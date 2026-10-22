import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import {
  Upload,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Settings2,
} from 'lucide-react';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  rotation: number; // 0, 90, 180, 270
  width: number;
  height: number;
}

export const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'standard'>('small');
  const [outputName, setOutputName] = useState('UAP_Lab_Images_Document.pdf');
  const [isConverting, setIsConverting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to load image metadata (natural dimensions)
  const loadImageDetails = (file: File): Promise<{ width: number; height: number; previewUrl: string }> => {
    return new Promise((resolve) => {
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth || 800,
          height: img.naturalHeight || 600,
          previewUrl,
        });
      };
      img.onerror = () => {
        resolve({
          width: 800,
          height: 600,
          previewUrl,
        });
      };
      img.src = previewUrl;
    });
  };

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setStatusMessage(null);

    const newItems: ImageItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith('image/')) {
        continue;
      }
      try {
        const { width, height, previewUrl } = await loadImageDetails(file);
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl,
          name: file.name,
          size: file.size,
          rotation: 0,
          width,
          height,
        });
      } catch (err) {
        console.error('Failed to load image', err);
      }
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
    } else {
      setStatusMessage({
        type: 'error',
        text: 'No valid image files found. Please upload PNG, JPG, WEBP, or SVG files.',
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const rotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setStatusMessage(null);
  };

  // Convert an image file + rotation to a clean PNG ArrayBuffer via Canvas
  const processImageToBytes = async (item: ImageItem): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        const rads = (item.rotation * Math.PI) / 180;
        const isRotated90or270 = item.rotation === 90 || item.rotation === 270;
        const drawWidth = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
        const drawHeight = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

        canvas.width = drawWidth;
        canvas.height = drawHeight;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rads);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob from canvas'));
              return;
            }
            const buf = await blob.arrayBuffer();
            resolve(new Uint8Array(buf));
          },
          'image/jpeg',
          0.92
        );
      };
      img.onerror = () => reject(new Error('Image failed to load on canvas'));
      img.src = item.previewUrl;
    });
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    setStatusMessage(null);

    try {
      const pdfDoc = await PDFDocument.create();

      // Standard sizes in points (72 points per inch)
      // A4: 595.28 x 841.89
      // Letter: 612 x 792
      const MARGIN_POINTS = margin === 'none' ? 0 : margin === 'small' ? 20 : 36;

      for (const item of images) {
        const imageBytes = await processImageToBytes(item);
        const embeddedImage = await pdfDoc.embedJpg(imageBytes);

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = 595.28;
        let pageHeight = 841.89;

        if (pageSize === 'letter') {
          pageWidth = 612;
          pageHeight = 792;
        } else if (pageSize === 'fit') {
          // Fit page exactly to image with optional margins
          pageWidth = imgWidth + MARGIN_POINTS * 2;
          pageHeight = imgHeight + MARGIN_POINTS * 2;
        }

        // Handle orientation
        if (pageSize !== 'fit') {
          if (orientation === 'landscape') {
            if (pageWidth < pageHeight) {
              const temp = pageWidth;
              pageWidth = pageHeight;
              pageHeight = temp;
            }
          } else if (orientation === 'auto') {
            const isImageLandscape = imgWidth > imgHeight;
            if (isImageLandscape && pageWidth < pageHeight) {
              const temp = pageWidth;
              pageWidth = pageHeight;
              pageHeight = temp;
            } else if (!isImageLandscape && pageWidth > pageHeight) {
              const temp = pageWidth;
              pageWidth = pageHeight;
              pageHeight = temp;
            }
          } else {
            // portrait
            if (pageWidth > pageHeight) {
              const temp = pageWidth;
              pageWidth = pageHeight;
              pageHeight = temp;
            }
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate fitted dimensions within margins
        const maxContentWidth = pageWidth - MARGIN_POINTS * 2;
        const maxContentHeight = pageHeight - MARGIN_POINTS * 2;

        const scale = Math.min(
          maxContentWidth / imgWidth,
          maxContentHeight / imgHeight,
          pageSize === 'fit' ? 1 : 1
        );

        const finalWidth = imgWidth * scale;
        const finalHeight = imgHeight * scale;

        // Centered inside page
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: finalWidth,
          height: finalHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const finalBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const finalFileName = outputName.trim().endsWith('.pdf')
        ? outputName.trim()
        : `${outputName.trim()}.pdf`;

      saveAs(finalBlob, finalFileName);

      setStatusMessage({
        type: 'success',
        text: `Successfully converted ${images.length} image${
          images.length > 1 ? 's' : ''
        } to "${finalFileName}".`,
      });
    } catch (err: unknown) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Error generating PDF from images. Please check the files and try again.',
      });
    } finally {
      setIsConverting(false);
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
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Image to PDF Converter
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Convert circuit diagrams, lab photos, waveform screenshots, and figures into a single lab PDF document.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-xs font-semibold text-blue-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Client-Side • Instant</span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="bg-white border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-8 text-center cursor-pointer transition group shadow-xs hover:bg-blue-50/20"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/bmp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 group-hover:bg-blue-100/70 border border-blue-100 flex items-center justify-center text-blue-600 transition mb-3">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Click or Drag & Drop Images Here
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Supports PNG, JPG, WEBP, SVG & BMP. Upload multiple lab experiment photos, circuit schematics, or simulation outputs at once.
        </p>
      </div>

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

      {/* Image List & Reordering */}
      {images.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                Selected Images ({images.length})
              </span>
              <span className="text-xs text-slate-400">
                • Arrange in the order you want pages to appear
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More</span>
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Image Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="relative bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between group hover:border-blue-300 transition"
              >
                {/* Page Number Badge */}
                <div className="absolute top-2 left-2 z-10 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                  Page {index + 1}
                </div>

                {/* Thumbnail */}
                <div className="w-full h-36 bg-white rounded-lg border border-slate-200/80 overflow-hidden flex items-center justify-center relative mb-2.5">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    style={{ transform: `rotate(${item.rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-200"
                  />
                  {item.rotation !== 0 && (
                    <span className="absolute bottom-1 right-1 text-[9px] bg-blue-600 text-white font-mono px-1 py-0.5 rounded">
                      {item.rotation}°
                    </span>
                  )}
                </div>

                {/* Title & Info */}
                <div className="text-left mb-2">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatFileSize(item.size)} • {item.width}×{item.height}px
                  </p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveUp(index)}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 disabled:opacity-30 rounded transition"
                      title="Move Left / Earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => moveDown(index)}
                      className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 disabled:opacity-30 rounded transition"
                      title="Move Right / Later"
                    >
                      <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rotateImage(item.id)}
                      className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition ml-1"
                      title="Rotate 90° Clockwise"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PDF Page Settings */}
          <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 space-y-4 mt-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Settings2 className="w-4 h-4 text-blue-600" />
              <span>PDF Page & Layout Options</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Page Size */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Page Format
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter' | 'fit')}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="a4">A4 (Standard 210 × 297mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit to Image Dimensions</option>
                </select>
              </div>

              {/* Orientation */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Orientation
                </label>
                <select
                  value={orientation}
                  disabled={pageSize === 'fit'}
                  onChange={(e) => setOrientation(e.target.value as 'portrait' | 'landscape' | 'auto')}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="portrait">Portrait (Vertical)</option>
                  <option value="landscape">Landscape (Horizontal)</option>
                  <option value="auto">Auto (Match each image)</option>
                </select>
              </div>

              {/* Margin */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Margin
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value as 'none' | 'small' | 'standard')}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small Margin (Clean Lab Style)</option>
                  <option value="none">No Margin (Full Bleed)</option>
                  <option value="standard">Standard Margin (Wide)</option>
                </select>
              </div>
            </div>

            {/* Output file name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Output PDF Filename
              </label>
              <input
                type="text"
                value={outputName}
                onChange={(e) => setOutputName(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="UAP_Lab_Images_Document.pdf"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleConvertToPdf}
              disabled={isConverting || images.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting Images to PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Convert & Download PDF ({images.length} {images.length === 1 ? 'Page' : 'Pages'})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
