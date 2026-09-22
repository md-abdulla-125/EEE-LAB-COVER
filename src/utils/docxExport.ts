import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
  PageBorderOffsetFrom,
} from 'docx';
import fileSaver from 'file-saver';
import { CoverPageData } from '../types';
import { getUapLogoPngBytes } from '../components/UapLogo';

function downloadDocxBlob(blob: Blob, fileName: string): void {
  try {
    if (typeof (fileSaver as unknown as { saveAs?: (b: Blob, n: string) => void })?.saveAs === 'function') {
      (fileSaver as unknown as { saveAs: (b: Blob, n: string) => void }).saveAs(blob, fileName);
      return;
    }
    if (typeof fileSaver === 'function') {
      (fileSaver as unknown as (b: Blob, n: string) => void)(blob, fileName);
      return;
    }
  } catch (e) {
    console.warn('fileSaver.saveAs invocation failed, using direct anchor fallback:', e);
  }

  // Universal browser download fallback
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }, 1000);
}

export async function exportToDocx(data: CoverPageData): Promise<void> {
  // 1. Get rasterized logo bytes
  let logoBytes: Uint8Array | null = null;
  try {
    logoBytes = await getUapLogoPngBytes();
  } catch (e) {
    console.warn('Could not generate logo for docx, proceeding without image:', e);
  }

  // Border style determination
  const borderSize = data.borderStyle === 'bold' ? 24 : data.borderStyle === 'double' ? 18 : 12;
  const borderType =
    data.borderStyle === 'double'
      ? BorderStyle.DOUBLE
      : data.borderStyle === 'bold'
      ? BorderStyle.THICK
      : data.borderStyle === 'none'
      ? BorderStyle.NONE
      : BorderStyle.SINGLE;

  // Reusable borderless cell borders
  const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const tableBorders = {
    top: noBorder,
    bottom: noBorder,
    left: noBorder,
    right: noBorder,
    insideHorizontal: noBorder,
    insideVertical: noBorder,
  };
  const cellBorders = {
    top: noBorder,
    bottom: noBorder,
    left: noBorder,
    right: noBorder,
  };

  // Helper for key-value rows in middle section (Guarantees 100% straight vertical colon alignment)
  const createMiddleRow = (label: string, value: string, isBoldValue = false) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 32, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              spacing: { before: 45, after: 45 },
              children: [
                new TextRun({
                  text: label,
                  bold: true,
                  size: 23, // 11.5pt
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 4, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 45, after: 45 },
              children: [
                new TextRun({
                  text: ':',
                  bold: true,
                  size: 23,
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 64, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              spacing: { before: 45, after: 45 },
              children: [
                new TextRun({
                  text: value,
                  bold: isBoldValue,
                  size: 23,
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  // Helper for student info rows under SUBMITTED BY
  const createStudentRow = (label: string, value: string, isBold = false) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 36, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: label,
                  bold: true,
                  size: 21, // 10.5pt
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: ':',
                  bold: true,
                  size: 21,
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 58, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: value,
                  bold: isBold,
                  size: 21,
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  const studentSubTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      createStudentRow('NAME', data.studentName || 'STUDENT NAME', true),
      createStudentRow('STUDENT ID', data.studentId || '25201125'),
      createStudentRow('SEMESTER', data.semester || '1st Year 2nd Semester'),
      createStudentRow('SECTION', data.section || 'A'),
      createStudentRow('GROUP', data.group || 'A1'),
    ],
  });

  const submissionTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      new TableRow({
        children: [
          // Left Column: SUBMITTED BY
          new TableCell({
            width: { size: 54, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                spacing: { before: 0, after: 70 },
                children: [
                  new TextRun({
                    text: 'SUBMITTED BY:',
                    bold: true,
                    size: 23, // 11.5pt
                    font: 'Times New Roman',
                  }),
                ],
              }),
              studentSubTable,
            ],
          }),

          // Right Column: SUBMITTED TO
          new TableCell({
            width: { size: 46, type: WidthType.PERCENTAGE },
            borders: cellBorders,
            children: [
              new Paragraph({
                spacing: { before: 0, after: 70 },
                children: [
                  new TextRun({
                    text: 'SUBMITTED TO:',
                    bold: true,
                    size: 23,
                    font: 'Times New Roman',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children: [
                  new TextRun({
                    text: data.instructorName || 'M. ABDULLAH AL-AMIN',
                    bold: true,
                    size: 22,
                    font: 'Times New Roman',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 15, after: 15 },
                children: [
                  new TextRun({
                    text: data.instructorDesignation || 'ASSISTANT PROFESSOR',
                    size: 21,
                    font: 'Times New Roman',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 15, after: 15 },
                children: [
                  new TextRun({
                    text: data.instructorDepartment || 'DEPARTMENT OF EEE, UAP',
                    size: 21,
                    font: 'Times New Roman',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 15, after: 15 },
                children: [
                  new TextRun({
                    text: 'UNIVERSITY OF ASIA PACIFIC',
                    size: 20,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const middleTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      createMiddleRow('COURSE CODE', data.courseCode || 'EEE 102', true),
      createMiddleRow('COURSE TITLE', data.courseTitle || 'Electrical Circuits Lab', true),
      createMiddleRow('EXPERIMENT NO.', data.expNo || '01'),
      createMiddleRow(
        'EXPERIMENT NAME',
        data.expName || 'Verification of Ohm\'s Law and Kirchhoff\'s Voltage and Current Laws'
      ),
      createMiddleRow('DATE OF PERFORMANCE', data.performanceDate || '15 February, 2026'),
      createMiddleRow('DATE OF SUBMISSION', data.submissionDate || '22 February, 2026'),
    ],
  });

  const doc = new Document({
    creator: 'UAP Student',
    title: `${data.courseCode || 'Cover Page'} - ${data.studentId || 'Report'}`,
    description: `Cover page for ${data.courseCode || ''} ${data.courseTitle || ''}`,
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            color: '000000',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width (210mm in twips)
              height: 16838, // A4 height (297mm in twips)
            },
            margin: {
              top: 850,
              bottom: 850,
              left: 950,
              right: 950,
            },
            borders:
              data.borderStyle === 'none'
                ? undefined
                : {
                    pageBorders: {
                      offsetFrom: PageBorderOffsetFrom.PAGE,
                    },
                    pageBorderTop: { style: borderType, size: borderSize, color: '000000', space: 24 },
                    pageBorderRight: { style: borderType, size: borderSize, color: '000000', space: 24 },
                    pageBorderBottom: { style: borderType, size: borderSize, color: '000000', space: 24 },
                    pageBorderLeft: { style: borderType, size: borderSize, color: '000000', space: 24 },
                  },
          },
        },
        children: [
          // Logo Paragraph
          ...(logoBytes
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 100 },
                  children: [
                    new ImageRun({
                      data: logoBytes,
                      transformation: {
                        width: 95,
                        height: 95,
                      },
                      type: 'png',
                    }),
                  ],
                }),
              ]
            : [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 100, after: 100 },
                  children: [
                    new TextRun({
                      text: '[ UAP EMBLEM ]',
                      bold: true,
                      size: 24,
                    }),
                  ],
                }),
              ]),

          // University Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 50 },
            children: [
              new TextRun({
                text: data.universityName || 'UNIVERSITY OF ASIA PACIFIC',
                bold: true,
                size: 36, // 18pt
                font: 'Times New Roman',
              }),
            ],
          }),

          // Department Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: data.department || 'DEPARTMENT OF CSE',
                bold: true,
                size: 28, // 14pt
                font: 'Times New Roman',
              }),
            ],
          }),

          // Subtitle / Report Type
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 280 },
            children: [
              new TextRun({
                text: (data.reportType || 'Lab Report – Spring 2026').toUpperCase(),
                bold: true,
                size: 26, // 13pt
                font: 'Times New Roman',
              }),
            ],
          }),

          // Middle Section Table (Laser-aligned colons and wrapped descriptions)
          middleTable,

          // Spacing before submission block
          new Paragraph({
            spacing: { before: 220, after: 80 },
            children: [],
          }),

          // Two-column table for SUBMITTED BY and SUBMITTED TO
          submissionTable,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanCode = (data.courseCode || 'CoverPage').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanExp = (data.expNo || '01').replace(/[^a-zA-Z0-9_-]/g, '');
  const cleanId = (data.studentId || 'Report').replace(/[^a-zA-Z0-9_-]/g, '');
  const fileName = `UAP_CoverPage_${cleanCode}_Exp${cleanExp}_${cleanId}.docx`;

  downloadDocxBlob(blob, fileName);
}
