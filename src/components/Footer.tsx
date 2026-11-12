import React from 'react';
import { BRAND } from '../config/constants';
import { Mail, MessageCircle, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#021C15] via-[#021812] to-[#01130D] text-[#E2DDD5] border-t border-[#D4AF37]/30 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Subtle background ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#D4AF37]/10 via-[#064E3B]/10 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12 border-b border-[#D4AF37]/20">
          {/* Business Description & Brand */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#065F46] via-[#04392B] to-[#02231A] text-[#F9F1DC] flex items-center justify-center font-extrabold text-sm tracking-wider shadow-md ring-1 ring-[#D4AF37]/60">
                SP
              </span>
              <span className="text-xl font-extrabold text-[#FBF7EE] tracking-tight">{BRAND.name}</span>
            </div>
            <p className="text-sm text-[#DFBE75] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{BRAND.tagline}</span>
            </p>
            <p className="text-sm text-[#C8C2B7] leading-relaxed">
              Helping busy founders, entrepreneurs, and business owners organize their inboxes, streamline daily client communications, and maintain reliable customer follow-ups without the overwhelm.
            </p>
          </div>

          {/* Business Support & Contact Information */}
          <div className="space-y-3 md:justify-self-end max-w-md">
            <h4 className="text-xs font-bold text-[#DFBE75] uppercase tracking-wider">
              Business Support & Inquiries
            </h4>
            <div className="space-y-1.5 text-sm bg-[#03261C]/80 p-5 rounded-2xl border border-[#D4AF37]/25 backdrop-blur-sm shadow-xl shadow-black/40">
              <p className="text-[#FBF7EE] font-bold text-base">{BRAND.owner}</p>
              <p className="text-[#DFBE75] text-xs font-semibold">{BRAND.title}</p>
              <p className="text-[#A8A29E] text-xs">{BRAND.name}</p>

              <div className="pt-3 mt-2 border-t border-[#D4AF37]/20 space-y-2.5 text-sm">
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center gap-2.5 text-[#E2DDD5] hover:text-[#F3E5AB] transition-colors font-medium group"
                >
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{BRAND.email}</span>
                </a>
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-[#E2DDD5] hover:text-[#F3E5AB] transition-colors font-medium group"
                >
                  <MessageCircle className="w-4 h-4 text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{BRAND.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Truthful Privacy Statement & Copyright Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A8A29E]">
          <p className="max-w-2xl text-center md:text-left leading-relaxed">
            {BRAND.privacyText}
          </p>
          <p className="whitespace-nowrap shrink-0 font-medium text-[#DFBE75]">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
