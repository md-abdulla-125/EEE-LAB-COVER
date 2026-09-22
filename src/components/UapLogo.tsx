import React from 'react';

interface UapLogoProps {
  className?: string;
  size?: number;
}

export const UapOfficialSvg: React.FC<{ size?: number; className?: string }> = ({
  size = 110,
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={`select-none ${className}`}
      aria-label="University of Asia Pacific Official Logo"
    >
      <defs>
        {/* Banner curved path for text: UNIVERSITY OF ASIA PACIFIC */}
        <path id="uapOfficialBannerArc" d="M 66 340 C 130 500, 370 500, 434 340" fill="none" />
      </defs>

      {/* 1. RIBBON TAILS (Left & Right with fishtail / swallowtail cutouts) */}
      {/* Left Ribbon Tail */}
      <polygon
        points="4,222 62,216 62,492 33,456 4,492"
        fill="#1b3294"
        stroke="#5cd5f8"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Right Ribbon Tail */}
      <polygon
        points="438,216 496,222 496,492 467,456 438,492"
        fill="#1b3294"
        stroke="#5cd5f8"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 2. THE MAGENTA "U" CREST */}
      <path
        d="M 80 4 
           L 142 4 
           L 142 222 
           C 142 305, 205 352, 250 352 
           C 295 352, 358 305, 358 222 
           L 358 4 
           L 420 4 
           L 420 226 
           C 420 348, 335 412, 250 412 
           C 165 412, 80 348, 80 226 
           Z"
        fill="#b31878"
        stroke="#5cd5f8"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 3. INNER CREST TOP: CYAN RECTANGLE WITH "UAP" AND OPEN BOOK */}
      <rect
        x="144"
        y="28"
        width="212"
        height="194"
        fill="#80cbe7"
        stroke="#5cd5f8"
        strokeWidth="2.5"
      />

      {/* "UAP" Letters Header */}
      <text
        x="250"
        y="75"
        fontFamily="'Arial Black', 'Trebuchet MS', 'Impact', sans-serif"
        fontSize="46"
        fontWeight="900"
        fill="#1b3294"
        letterSpacing="3"
        textAnchor="middle"
      >
        UAP
      </text>

      {/* Open Book */}
      <g id="official-open-book">
        {/* Left Page (White with dark navy outline) */}
        <path
          d="M 158 96 
             C 185 88, 222 91, 246 102 
             L 246 210 
             C 222 198, 185 195, 158 204 
             Z"
          fill="#ffffff"
          stroke="#1b3294"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Right Page */}
        <path
          d="M 254 102 
             C 278 91, 315 88, 342 96 
             L 342 204 
             C 315 195, 278 198, 254 210 
             Z"
          fill="#ffffff"
          stroke="#1b3294"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Text on Left Page: Knowledge is Power */}
        <text
          x="202"
          y="126"
          fontFamily="'Arial', 'Helvetica Neue', sans-serif"
          fontSize="13"
          fontWeight="bold"
          fill="#1b3294"
          textAnchor="middle"
        >
          Knowledge
        </text>
        <text
          x="202"
          y="149"
          fontFamily="'Arial', 'Helvetica Neue', sans-serif"
          fontSize="13"
          fontWeight="bold"
          fill="#1b3294"
          textAnchor="middle"
        >
          is
        </text>
        <text
          x="202"
          y="173"
          fontFamily="'Arial', 'Helvetica Neue', sans-serif"
          fontSize="13"
          fontWeight="bold"
          fill="#1b3294"
          textAnchor="middle"
        >
          Power
        </text>

        {/* Text on Right Page: Committed to Excellence */}
        <text
          x="298"
          y="126"
          fontFamily="'Arial', 'Helvetica Neue', sans-serif"
          fontSize="12.5"
          fontWeight="bold"
          fill="#1b3294"
          textAnchor="middle"
        >
          Committed
        </text>
        <text
          x="298"
          y="149"
          fontFamily="'Arial', 'Helvetica Neue', sans-serif"
          fontSize="12.5"
          fontWeight="bold"
          fill="#1b3294"
          textAnchor="middle"
        >
          to
        </text>
        <text
          x="298"
          y="173"
          fontFamily="'Arial', 'Helvetica Neue', sans-serif"
          fontSize="12.5"
          fontWeight="bold"
          fill="#1b3294"
          textAnchor="middle"
        >
          Excellence
        </text>
      </g>

      {/* 4. INNER CREST BOTTOM: DEEP BLUE CAVITY WITH 19, ATOM, 96 */}
      <path
        d="M 142 222 
           L 358 222 
           L 358 224 
           C 358 305, 295 352, 250 352 
           C 205 352, 142 305, 142 224 
           Z"
        fill="#1b3294"
        stroke="#5cd5f8"
        strokeWidth="2.5"
      />

      {/* "19" in bold white */}
      <text
        x="180"
        y="291"
        fontFamily="'Arial Black', 'Trebuchet MS', Arial, sans-serif"
        fontSize="25"
        fontWeight="900"
        fill="#ffffff"
        textAnchor="middle"
      >
        19
      </text>

      {/* ATOM SYMBOL */}
      <g id="official-atom" transform="translate(250, 280)">
        {/* Orbits */}
        <ellipse
          cx="0"
          cy="0"
          rx="10"
          ry="38"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          transform="rotate(0)"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="10"
          ry="38"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          transform="rotate(60)"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="10"
          ry="38"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          transform="rotate(-60)"
        />

        {/* Electron nodes at the 6 orbit apices */}
        <circle cx="0" cy="-38" r="3.5" fill="#ffffff" />
        <circle cx="0" cy="38" r="3.5" fill="#ffffff" />
        <circle cx="33" cy="-19" r="3.5" fill="#ffffff" />
        <circle cx="-33" cy="19" r="3.5" fill="#ffffff" />
        <circle cx="33" cy="19" r="3.5" fill="#ffffff" />
        <circle cx="-33" cy="-19" r="3.5" fill="#ffffff" />

        {/* Nucleus */}
        <circle cx="0" cy="0" r="7" fill="#1b3294" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="3" fill="#ffffff" />
      </g>

      {/* "96" in bold white */}
      <text
        x="320"
        y="291"
        fontFamily="'Arial Black', 'Trebuchet MS', Arial, sans-serif"
        fontSize="25"
        fontWeight="900"
        fill="#ffffff"
        textAnchor="middle"
      >
        96
      </text>

      {/* 5. WHITE BUFFER GAP BEHIND BANNER */}
      <path
        d="M 54 220 
           C 60 376, 172 438, 250 438 
           C 328 438, 440 376, 446 220 
           L 490 220 
           C 475 420, 340 488, 250 488 
           C 160 488, 25 420, 10 220 
           Z"
        fill="#ffffff"
      />

      {/* 6. MAIN DEEP BLUE ARCHED BANNER */}
      <path
        d="M 58 220 
           C 66 364, 168 432, 250 432 
           C 332 432, 434 364, 442 220 
           L 486 220 
           C 472 404, 335 482, 250 482 
           C 165 482, 28 404, 14 220 
           Z"
        fill="#1b3294"
        stroke="#5cd5f8"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* 7. ARCHED TEXT: "UNIVERSITY OF ASIA PACIFIC" */}
      <text
        fontFamily="'Arial Black', 'Trebuchet MS', 'Impact', sans-serif"
        fontSize="26"
        fontWeight="900"
        fill="#ffffff"
        letterSpacing="2.2"
      >
        <textPath href="#uapOfficialBannerArc" startOffset="50%" textAnchor="middle">
          UNIVERSITY OF ASIA PACIFIC
        </textPath>
      </text>
    </svg>
  );
};

export const UapLogo: React.FC<UapLogoProps> = ({ className = '', size = 110 }) => {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <UapOfficialSvg size={size} />
    </div>
  );
};

// Returns exact SVG string for export
export function getUapOfficialSvgString(): string {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" width="500" height="500">
    <defs>
      <path id="uapOfficialBannerArc" d="M 66 340 C 130 500, 370 500, 434 340" fill="none" />
    </defs>
    <polygon points="4,222 62,216 62,492 33,456 4,492" fill="#1b3294" stroke="#5cd5f8" stroke-width="3.5" stroke-linejoin="round" />
    <polygon points="438,216 496,222 496,492 467,456 438,492" fill="#1b3294" stroke="#5cd5f8" stroke-width="3.5" stroke-linejoin="round" />
    <path d="M 80 4 L 142 4 L 142 222 C 142 305, 205 352, 250 352 C 295 352, 358 305, 358 222 L 358 4 L 420 4 L 420 226 C 420 348, 335 412, 250 412 C 165 412, 80 348, 80 226 Z" fill="#b31878" stroke="#5cd5f8" stroke-width="3.5" stroke-linejoin="round" />
    <rect x="144" y="28" width="212" height="194" fill="#80cbe7" stroke="#5cd5f8" stroke-width="2.5" />
    <text x="250" y="75" font-family="'Arial Black', 'Trebuchet MS', 'Impact', sans-serif" font-size="46" font-weight="900" fill="#1b3294" letter-spacing="3" text-anchor="middle">UAP</text>
    <path d="M 158 96 C 185 88, 222 91, 246 102 L 246 210 C 222 198, 185 195, 158 204 Z" fill="#ffffff" stroke="#1b3294" stroke-width="3.5" stroke-linejoin="round" />
    <path d="M 254 102 C 278 91, 315 88, 342 96 L 342 204 C 315 195, 278 198, 254 210 Z" fill="#ffffff" stroke="#1b3294" stroke-width="3.5" stroke-linejoin="round" />
    <text x="202" y="126" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="13" font-weight="bold" fill="#1b3294" text-anchor="middle">Knowledge</text>
    <text x="202" y="149" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="13" font-weight="bold" fill="#1b3294" text-anchor="middle">is</text>
    <text x="202" y="173" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="13" font-weight="bold" fill="#1b3294" text-anchor="middle">Power</text>
    <text x="298" y="126" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="12.5" font-weight="bold" fill="#1b3294" text-anchor="middle">Committed</text>
    <text x="298" y="149" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="12.5" font-weight="bold" fill="#1b3294" text-anchor="middle">to</text>
    <text x="298" y="173" font-family="'Arial', 'Helvetica Neue', sans-serif" font-size="12.5" font-weight="bold" fill="#1b3294" text-anchor="middle">Excellence</text>
    <path d="M 142 222 L 358 222 L 358 224 C 358 305, 295 352, 250 352 C 205 352, 142 305, 142 224 Z" fill="#1b3294" stroke="#5cd5f8" stroke-width="2.5" />
    <text x="180" y="291" font-family="'Arial Black', 'Trebuchet MS', Arial, sans-serif" font-size="25" font-weight="900" fill="#ffffff" text-anchor="middle">19</text>
    <g transform="translate(250, 280)">
      <ellipse cx="0" cy="0" rx="10" ry="38" fill="none" stroke="#ffffff" stroke-width="2.5" />
      <ellipse cx="0" cy="0" rx="10" ry="38" fill="none" stroke="#ffffff" stroke-width="2.5" transform="rotate(60)" />
      <ellipse cx="0" cy="0" rx="10" ry="38" fill="none" stroke="#ffffff" stroke-width="2.5" transform="rotate(-60)" />
      <circle cx="0" cy="-38" r="3.5" fill="#ffffff" />
      <circle cx="0" cy="38" r="3.5" fill="#ffffff" />
      <circle cx="33" cy="-19" r="3.5" fill="#ffffff" />
      <circle cx="-33" cy="19" r="3.5" fill="#ffffff" />
      <circle cx="33" cy="19" r="3.5" fill="#ffffff" />
      <circle cx="-33" cy="-19" r="3.5" fill="#ffffff" />
      <circle cx="0" cy="0" r="7" fill="#1b3294" stroke="#ffffff" stroke-width="2.5" />
      <circle cx="0" cy="0" r="3" fill="#ffffff" />
    </g>
    <text x="320" y="291" font-family="'Arial Black', 'Trebuchet MS', Arial, sans-serif" font-size="25" font-weight="900" fill="#ffffff" text-anchor="middle">96</text>
    <path d="M 54 220 C 60 376, 172 438, 250 438 C 328 438, 440 376, 446 220 L 490 220 C 475 420, 340 488, 250 488 C 160 488, 25 420, 10 220 Z" fill="#ffffff" />
    <path d="M 58 220 C 66 364, 168 432, 250 432 C 332 432, 434 364, 442 220 L 486 220 C 472 404, 335 482, 250 482 C 165 482, 28 404, 14 220 Z" fill="#1b3294" stroke="#5cd5f8" stroke-width="3.2" stroke-linejoin="round" />
    <text font-family="'Arial Black', 'Trebuchet MS', 'Impact', sans-serif" font-size="26" font-weight="900" fill="#ffffff" letter-spacing="2.2">
      <textPath href="#uapOfficialBannerArc" xlink:href="#uapOfficialBannerArc" startOffset="50%" textAnchor="middle">
        UNIVERSITY OF ASIA PACIFIC
      </textPath>
    </text>
  </svg>
  `;
}

// Generates high-res PNG bytes of the logo for Microsoft Word docx embedding
export async function getUapLogoPngBytes(): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    try {
      const svgString = getUapOfficialSvgString();
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      const img = new Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(url);
        reject(new Error('UAP Logo rasterization timed out'));
      }, 2500);

      img.onload = () => {
        clearTimeout(timeoutId);
        ctx.clearRect(0, 0, 500, 500);
        ctx.drawImage(img, 0, 0, 500, 500);
        URL.revokeObjectURL(url);
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) {
            reject(new Error('Failed to create PNG blob'));
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            const buffer = reader.result as ArrayBuffer;
            resolve(new Uint8Array(buffer));
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(pngBlob);
        }, 'image/png');
      };
      img.onerror = (e) => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(url);
        reject(e);
      };
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}
