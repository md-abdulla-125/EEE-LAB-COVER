import React, { useState, useEffect } from 'react';
import { X, Cookie, ShieldCheck, Check } from 'lucide-react';

interface CookieConsentProps {
  onConsentChange?: (consent: 'accepted' | 'rejected') => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or rejected
    const checkConsent = () => {
      const localConsent = localStorage.getItem('uap_cookie_consent');
      const cookieConsent = document.cookie
        .split('; ')
        .find((row) => row.startsWith('uap_cookie_consent='));

      if (!localConsent && !cookieConsent) {
        // Show banner smoothly after a brief delay on initial visit
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    };

    checkConsent();

    // Listen to custom event to re-open cookie settings from footer
    const handleOpenSettings = () => {
      setIsOpen(true);
      setShowDetails(false);
    };
    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const handleAccept = () => {
    // Set 1-year persistent cookie and localStorage
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `uap_cookie_consent=accepted; max-age=${oneYear}; path=/; SameSite=Lax`;
    localStorage.setItem('uap_cookie_consent', 'accepted');
    localStorage.setItem('uap_cookie_consent_time', new Date().toISOString());
    setIsOpen(false);
    if (onConsentChange) onConsentChange('accepted');
  };

  const handleReject = () => {
    // Set cookie and localStorage to rejected
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `uap_cookie_consent=rejected; max-age=${oneYear}; path=/; SameSite=Lax`;
    localStorage.setItem('uap_cookie_consent', 'rejected');
    localStorage.setItem('uap_cookie_consent_time', new Date().toISOString());
    setIsOpen(false);
    if (onConsentChange) onConsentChange('rejected');
  };

  const handleDismiss = () => {
    // Temporary dismissal for the session
    sessionStorage.setItem('uap_cookie_dismissed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[9999] max-w-[330px] sm:max-w-[350px] w-[calc(100vw-1.5rem)] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.18)] border border-slate-200 p-3 sm:p-3.5 overflow-hidden">
        {/* Close "X" button in top-right corner */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          aria-label="Close cookie banner"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-2.5 sm:gap-3">
          {/* Bitten Cookie Graphic - Decreased size */}
          <div className="shrink-0 mt-0.5">
            <svg
              viewBox="0 0 100 100"
              className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-sm select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cookie definition with bite cutout */}
              <mask id="cookie-bite-mask">
                {/* Full White background */}
                <rect width="100" height="100" fill="white" />
                {/* Bite cutouts */}
                <circle cx="78" cy="24" r="13" fill="black" />
                <circle cx="68" cy="12" r="10" fill="black" />
                <circle cx="86" cy="38" r="11" fill="black" />
              </mask>

              {/* Cookie Base Circle */}
              <circle
                cx="48"
                cy="54"
                r="42"
                fill="#E8963D"
                mask="url(#cookie-bite-mask)"
              />

              {/* Inner Cookie Dough shading */}
              <circle
                cx="46"
                cy="56"
                r="38"
                fill="#EDA34E"
                mask="url(#cookie-bite-mask)"
                opacity="0.5"
              />

              {/* Bite inner edge texture highlight */}
              <path
                d="M 59 13 Q 66 18 64 24 Q 68 31 77 31 Q 83 37 87 45"
                stroke="#D67B25"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Chocolate Chips */}
              <circle cx="30" cy="38" r="5.5" fill="#422006" />
              <circle cx="31.5" cy="36.5" r="1.5" fill="#713F12" />

              <circle cx="48" cy="34" r="4.5" fill="#422006" />
              <circle cx="49" cy="33" r="1.2" fill="#713F12" />

              <circle cx="24" cy="58" r="6" fill="#422006" />
              <circle cx="25.5" cy="56.5" r="1.8" fill="#713F12" />

              <circle cx="42" cy="54" r="4" fill="#422006" />
              <circle cx="43" cy="53" r="1.2" fill="#713F12" />

              <circle cx="60" cy="53" r="5" fill="#422006" />
              <circle cx="61.5" cy="51.5" r="1.5" fill="#713F12" />

              <circle cx="36" cy="74" r="5" fill="#422006" />
              <circle cx="37.5" cy="72.5" r="1.5" fill="#713F12" />

              <circle cx="56" cy="73" r="6" fill="#422006" />
              <circle cx="57.5" cy="71.5" r="1.8" fill="#713F12" />

              <circle cx="73" cy="69" r="4.2" fill="#422006" />
              <circle cx="74" cy="68" r="1.2" fill="#713F12" />

              {/* Floating Crumbs */}
              <ellipse cx="76" cy="10" rx="2.5" ry="3.5" fill="#E8963D" />
              <ellipse cx="88" cy="20" rx="3" ry="2.2" fill="#E8963D" />
              <circle cx="91" cy="33" r="2.2" fill="#D67B25" />
              <circle cx="63" cy="6" r="1.8" fill="#E8963D" />
            </svg>
          </div>

          {/* Text and Actions */}
          <div className="flex-1 pr-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              We use Cookies
            </h2>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-600 leading-snug font-normal">
              We use cookies and local storage to remember your academic information for effortless cover generation.
            </p>

            {/* Toggle Details Link */}
            <div className="mt-1">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[10px] text-slate-500 hover:text-slate-800 underline underline-offset-2 transition font-medium"
              >
                {showDetails ? 'Hide details' : 'What data is stored?'}
              </button>
            </div>

            {/* Expandable details */}
            {showDetails && (
              <div className="mt-2 p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-[10px] text-slate-600 space-y-1">
                <div className="flex items-start gap-1 font-semibold text-slate-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                  <span>100% Privacy Friendly & Local</span>
                </div>
                <p>
                  Stores student & course info locally in your browser so you do not have to retype them. No ads or tracking.
                </p>
              </div>
            )}

            {/* Action Buttons: Reject & Accept */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 active:bg-slate-200 text-xs font-semibold transition text-center"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 px-3.5 py-1.5 rounded-full bg-[#C7680D] hover:bg-[#B35A08] active:bg-[#9B4C05] text-white text-xs font-bold shadow-sm transition text-center"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
