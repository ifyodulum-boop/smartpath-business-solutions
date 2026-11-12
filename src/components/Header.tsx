import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const handleScrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPath !== '/') {
      onNavigate('/');
      setTimeout(() => {
        const formElem = document.getElementById('lead-form');
        formElem?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const formElem = document.getElementById('lead-form');
      formElem?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (currentPath !== '/') {
      onNavigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#085C52]/95 backdrop-blur-md border-b border-[#D4AF37]/25 text-[#FBF7EE] transition-all shadow-[0_4px_30px_rgba(8,92,82,0.4)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (SmartPath) */}
        <button
          onClick={() => onNavigate('/')}
          className="text-left font-bold text-xl sm:text-2xl tracking-tight text-[#FBF7EE] hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 cursor-pointer group"
          aria-label="SmartPath Business Solutions Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#085C52] via-[#064840] to-[#043630] text-[#F9F1DC] flex items-center justify-center font-extrabold text-sm tracking-wider shadow-md ring-1 ring-[#D4AF37]/50 group-hover:ring-[#D4AF37] group-hover:scale-105 transition-all">
            SP
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-[#FBF7EE] group-hover:text-[#F3E5AB] transition-colors text-lg sm:text-xl leading-none">
              SmartPath
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#DFBE75] mt-1 flex items-center gap-1">
              <span>Business Solutions</span>
              <span className="w-1 h-1 rounded-full bg-[#C87D55]" />
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Overview, What You'll Learn, The Guide) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#E2DDD5]">
          <a
            href="#overview"
            onClick={(e) => handleNavClick(e, 'overview')}
            className="hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4AF37] after:transition-all"
          >
            Overview
          </a>
          <a
            href="#benefits"
            onClick={(e) => handleNavClick(e, 'benefits')}
            className="hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4AF37] after:transition-all"
          >
            What You'll Learn
          </a>
          <a
            href="#the-guide"
            onClick={(e) => handleNavClick(e, 'the-guide')}
            className="hover:text-[#F3E5AB] transition-colors whitespace-nowrap shrink-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-[#D4AF37] after:transition-all"
          >
            The Guide
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action (Get My Free Guide) */}
        <div className="flex items-center shrink-0">
          <a
            href="#lead-form"
            onClick={handleScrollToForm}
            className="relative group px-4 py-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-extrabold text-[#02231A] bg-gradient-to-r from-[#D4AF37] via-[#E5C583] to-[#C5A059] hover:from-[#E5C583] hover:to-[#D4AF37] rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/35 border border-[#FFF3D1] whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform pointer-events-none" />
            <BookOpen className="w-4 h-4 hidden sm:inline text-[#02231A]" />
            <span className="tracking-wide">Get My Free Guide</span>
            <Sparkles className="w-3.5 h-3.5 text-[#02231A] hidden md:inline" />
          </a>
        </div>
      </div>
    </header>
  );
};
