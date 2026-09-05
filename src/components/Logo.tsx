import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  variant?: 'full' | 'badge-only' | 'horizontal';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = 'w-10 h-10', 
  showText = true,
  variant = 'badge-only'
}) => {
  if (variant === 'horizontal') {
    return (
      <div className="flex items-center gap-3 select-none">
        <div className="relative rounded-full overflow-hidden bg-white p-0.5 shadow-xs shrink-0 flex items-center justify-center border border-purple-200">
          <img 
            src="/brand_logo.png" 
            alt="Cox's Bazar Pet Shop & Care" 
            className={className} 
            width="48" 
            height="48"
            onError={(e) => {
              // fallback if needed
              (e.currentTarget as HTMLImageElement).src = '/original_logo.jpg';
            }}
          />
        </div>
        {showText && (
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                Cox's Bazar Pet Shop <span className="text-purple-700">& Care</span>
              </span>
            </div>
            <p className="text-[11px] font-semibold text-purple-900/80 tracking-wide uppercase">
              Your Pet, Our Passion • Cox's Bazar
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <img 
      src="/brand_logo.png" 
      alt="Cox's Bazar Pet Shop & Care" 
      className={`${className} object-contain`} 
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = '/original_logo.jpg';
      }}
    />
  );
};
