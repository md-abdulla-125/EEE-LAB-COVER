import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { CoverPageData } from '../types';

export async function exportToPdf(
  element: HTMLElement,
  data: CoverPageData
): Promise<void> {
  // Create an off-screen fixed container to guarantee rendering regardless of
  // current screen size, zoom scale, or hidden mobile tabs.
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '-12000px';
  container.style.width = '794px';
  container.style.height = '1123px';
  container.style.zIndex = '-99999';
  container.style.overflow = 'hidden';
  container.style.opacity = '1';
  container.style.pointerEvents = 'none';

  // Deep clone the cover page element
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'cover-page-a4-pdf-clone';
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.width = '794px';
  clone.style.height = '1123px';
  clone.style.display = 'flex';
  clone.style.flexDirection = 'column';
  clone.style.justifyContent = 'space-between';
  clone.style.boxShadow = 'none';

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // Wait a brief tick for fonts & layouts to be computed in DOM
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Capture using html2canvas-pro (native oklch & modern CSS color support)
    const canvas = await html2canvas(clone, {
      scale: 2.5, // Crisp 250+ DPI equivalent, prevents memory spikes
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
    
    const sanitizedExp = (data.expNo || 'Lab').replace(/[^a-zA-Z0-9_-]/g, '_');
    const sanitizedId = (data.studentId || 'Report').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `UAP_${(data.courseCode || 'EEE102').replace(/\s+/g, '_')}_CoverPage_Exp${sanitizedExp}_${sanitizedId}.pdf`;
    pdf.save(fileName);
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}

export async function generateCoverPdfBlob(element: HTMLElement): Promise<Blob> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '-12000px';
  container.style.width = '794px';
  container.style.height = '1123px';
  container.style.zIndex = '-99999';
  container.style.overflow = 'hidden';
  container.style.opacity = '1';
  container.style.pointerEvents = 'none';

  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'cover-page-a4-blob-clone';
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.width = '794px';
  clone.style.height = '1123px';
  clone.style.display = 'flex';
  clone.style.flexDirection = 'column';
  clone.style.justifyContent = 'space-between';
  clone.style.boxShadow = 'none';

  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
    return pdf.output('blob');
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}

export function printCoverPage(): void {
  try {
    window.print();
  } catch (e) {
    console.warn('Direct window.print() failed:', e);
  }
}
