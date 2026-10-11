import React from 'react';

interface GoldArtDecoCornersProps {
  className?: string;
  borderColor?: string;
  showDividers?: boolean;
}

export const GoldArtDecoCorners: React.FC<GoldArtDecoCornersProps> = ({
  className = '',
  borderColor = '#d4af37',
  showDividers = false,
}) => {
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 p-3 sm:p-5 ${className}`}>
      {/* Outer subtle gold border */}
      <div 
        className="w-full h-full relative"
        style={{
          border: `1px solid ${borderColor}22`,
        }}
      >
        {/* Top-Left Corner */}
        <div className="absolute -top-[1px] -left-[1px] w-12 h-12 sm:w-16 sm:h-16">
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <path
              d="M2 58 V12 C2 6.5 6.5 2 12 2 H58"
              stroke={borderColor}
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <path
              d="M7 58 V17 C7 11.5 11.5 7 17 7 H58"
              stroke={borderColor}
              strokeWidth="0.75"
              strokeOpacity="0.45"
            />
            <circle cx="12" cy="12" r="2" fill={borderColor} fillOpacity="0.8" />
            <path d="M2 2 L6 6" stroke={borderColor} strokeWidth="1" strokeOpacity="0.6" />
          </svg>
        </div>

        {/* Top-Right Corner */}
        <div className="absolute -top-[1px] -right-[1px] w-12 h-12 sm:w-16 sm:h-16">
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full scale-x-[-1]">
            <path
              d="M2 58 V12 C2 6.5 6.5 2 12 2 H58"
              stroke={borderColor}
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <path
              d="M7 58 V17 C7 11.5 11.5 7 17 7 H58"
              stroke={borderColor}
              strokeWidth="0.75"
              strokeOpacity="0.45"
            />
            <circle cx="12" cy="12" r="2" fill={borderColor} fillOpacity="0.8" />
            <path d="M2 2 L6 6" stroke={borderColor} strokeWidth="1" strokeOpacity="0.6" />
          </svg>
        </div>

        {/* Bottom-Left Corner */}
        <div className="absolute -bottom-[1px] -left-[1px] w-12 h-12 sm:w-16 sm:h-16">
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full scale-y-[-1]">
            <path
              d="M2 58 V12 C2 6.5 6.5 2 12 2 H58"
              stroke={borderColor}
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <path
              d="M7 58 V17 C7 11.5 11.5 7 17 7 H58"
              stroke={borderColor}
              strokeWidth="0.75"
              strokeOpacity="0.45"
            />
            <circle cx="12" cy="12" r="2" fill={borderColor} fillOpacity="0.8" />
            <path d="M2 2 L6 6" stroke={borderColor} strokeWidth="1" strokeOpacity="0.6" />
          </svg>
        </div>

        {/* Bottom-Right Corner */}
        <div className="absolute -bottom-[1px] -right-[1px] w-12 h-12 sm:w-16 sm:h-16">
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full scale-[-1]">
            <path
              d="M2 58 V12 C2 6.5 6.5 2 12 2 H58"
              stroke={borderColor}
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            <path
              d="M7 58 V17 C7 11.5 11.5 7 17 7 H58"
              stroke={borderColor}
              strokeWidth="0.75"
              strokeOpacity="0.45"
            />
            <circle cx="12" cy="12" r="2" fill={borderColor} fillOpacity="0.8" />
            <path d="M2 2 L6 6" stroke={borderColor} strokeWidth="1" strokeOpacity="0.6" />
          </svg>
        </div>

        {showDividers && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-[#07241c]">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};
