import React from 'react';
import { LeadFormData, SubmissionResponse } from '../types';
import { LeadCaptureForm } from './LeadCaptureForm';
import { BRAND } from '../config/constants';
import { 
  FolderCheck, 
  FileText, 
  BellRing, 
  Clock, 
  ArrowDown, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Shield,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onLeadSuccess: (lead: LeadFormData, submissionResult?: SubmissionResponse) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLeadSuccess }) => {
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById('lead-form');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#FAF5EB] text-slate-800">
      {/* =========================================================================
          SECTION A: HERO SECTION (Emerald Green #085C52 with Metallic Gold & Copper)
          Headline: "Your Inbox Needs a System, Not Just Folders."
          Supporting Text: "Get your free copy of The 10-Minute Inbox Reset and discover five practical ways to manage emails, stay on top of customer conversations, and never lose track of important follow-ups."
          Buttons: "Get My Free Guide" & "See What's Inside"
      ========================================================================= */}
      <section id="overview" className="relative pt-14 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-[#085C52] bg-gradient-to-b from-[#085C52] via-[#075047] to-[#085C52] text-[#FBF7EE]">
        {/* Deep atmospheric glowing highlights */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-[#0A7367]/40 rounded-full blur-[100px] pointer-events-none animate-soft-glow" />
        <div className="absolute bottom-10 left-5 w-[450px] h-[450px] bg-[#D4AF37]/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-[#C87D55]/15 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.08] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Copy & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Refined Metallic Gold & Copper Kicker */}
              <div className="inline-flex items-center gap-2.5 text-xs font-bold text-[#E5C583] tracking-wider uppercase border border-[#D4AF37]/30 bg-[#064840]/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C87D55] ring-2 ring-[#D4AF37]/50" />
                <span>SmartPath Executive Resource</span>
                <span aria-hidden="true" className="text-[#C87D55]">·</span>
                <span className="text-[#F3E5AB]">Immediate PDF Access</span>
              </div>

              {/* Main Headline (Preserved Exactly) */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-[#FBF7EE] leading-[1.16] text-balance">
                Your Inbox{' '}
                <span className="gold-gradient-text">
                  Needs a System
                </span>
                , Not Just Folders.
              </h1>

              {/* Supporting Text (Preserved Exactly) */}
              <p className="text-base sm:text-lg text-[#E2DDD5] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Get your free copy of <strong className="text-[#F3E5AB] font-bold border-b border-[#D4AF37]/40 pb-0.5">The 10-Minute Inbox Reset</strong> and discover five practical ways to manage emails, stay on top of customer conversations, and never lose track of important follow-ups.
              </p>

              {/* Action Buttons (Preserved Exactly) */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#lead-form"
                  onClick={scrollToForm}
                  className="group relative w-full sm:w-auto px-8 py-4 text-base font-extrabold text-[#02231A] bg-gradient-to-r from-[#D4AF37] via-[#E5C583] to-[#C5A059] hover:from-[#E5C583] hover:to-[#D4AF37] active:scale-[0.98] rounded-xl transition-all shadow-xl shadow-[#D4AF37]/25 hover:shadow-2xl hover:shadow-[#D4AF37]/40 border border-[#FFF3D1] flex items-center justify-center gap-2.5 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform pointer-events-none" />
                  <span className="tracking-wide">Get My Free Guide</span>
                  <ArrowDown className="w-4 h-4 text-[#02231A] group-hover:translate-y-0.5 transition-transform" />
                </a>

                <a
                  href="#the-guide"
                  className="w-full sm:w-auto px-7 py-4 text-sm font-bold text-[#FBF7EE] hover:text-[#F3E5AB] bg-[#064840]/50 hover:bg-[#064840]/80 border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-xl transition-all text-center backdrop-blur-sm shadow-sm cursor-pointer"
                >
                  See What's Inside &rarr;
                </a>
              </div>

              {/* Trust Credentials Strip */}
              <div className="pt-6 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-xs font-semibold text-[#DFBE75]">
                <span className="flex items-center gap-2 bg-[#064840]/60 border border-[#D4AF37]/25 px-3.5 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Practical & Actionable</span>
                </span>
                <span className="flex items-center gap-2 bg-[#064840]/60 border border-[#D4AF37]/25 px-3.5 py-1.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-[#E5C583] fill-[#E5C583]" />
                  <span>Instant Free PDF Access</span>
                </span>
                <span className="flex items-center gap-2 bg-[#064840]/60 border border-[#D4AF37]/25 px-3.5 py-1.5 rounded-lg">
                  <Shield className="w-3.5 h-3.5 text-[#C87D55]" />
                  <span>By {BRAND.owner}</span>
                </span>
              </div>
            </div>

            {/* Right Column: Professional Working on Laptop with Visible Inbox & Branded Guide */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-lg w-full group animate-float-gentle">
                {/* Luminous Glow Halo */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#D4AF37]/30 via-[#0A7367]/40 to-[#C87D55]/25 rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* Image Showcase Container with Metallic Border */}
                <div className="relative bg-gradient-to-b from-[#0A7367]/60 via-[#064840]/90 to-[#043630] rounded-3xl p-3 sm:p-4 shadow-2xl shadow-black/60 border border-[#D4AF37]/40 transition-all duration-300">
                  <div className="relative rounded-2xl overflow-hidden ring-1 ring-[#D4AF37]/50 shadow-2xl">
                    <img
                      src="/src/assets/images/hero_flat_guide_1794500328666.jpg"
                      alt="Professional virtual assistant working on laptop with organized email inbox, with The 10-Minute Inbox Reset guide by SmartPath Business Solutions lying flat on the desk"
                      className="w-full h-auto object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Elegant Glossy Lower Strip */}
                  <div className="p-3.5 mt-3 rounded-2xl bg-gradient-to-r from-[#064840] via-[#085C52] to-[#064840] border border-[#D4AF37]/30 text-center flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs font-extrabold text-[#FBF7EE]">
                        {BRAND.guideTitle}
                      </p>
                      <p className="text-[11px] font-semibold text-[#DFBE75]">
                        By {BRAND.name}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#02231A] bg-gradient-to-r from-[#D4AF37] via-[#E5C583] to-[#C5A059] px-2.5 py-1 rounded-md shadow-xs border border-[#FFF3D1]">
                      Official Edition
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: BENEFITS SECTION (Warm Ivory & Cream Contrast)
          Heading: "What You'll Learn From This Free Guide"
          Simplified: Each card contains ONLY its heading and the one sentence.
      ========================================================================= */}
      <section id="benefits" className="py-20 md:py-28 bg-gradient-to-b from-[#FAF5EB] via-[#F4ECE0] to-[#FAF5EB] border-y border-[#E2D6C0] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#B8860B] bg-[#FFFDF9] border border-[#D4AF37]/40 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C87D55]" />
              <span>Core Takeaways</span>
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-4xl font-extrabold text-[#022C22] tracking-tight">
              What You'll Learn From This Free Guide
            </h2>
            <p className="mt-3.5 text-base text-[#475569] leading-relaxed">
              Clear, practical frameworks designed specifically for busy entrepreneurs and business owners who want clarity instead of email chaos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {/* Benefit 1 */}
            <div className="bg-[#FFFDF9] hover:bg-white transition-all duration-300 rounded-2xl p-7 border border-[#E8DFC8] hover:border-[#D4AF37] shadow-[0_10px_30px_-5px_rgba(2,44,34,0.06)] hover:shadow-2xl hover:shadow-[#D4AF37]/15 hover:-translate-y-1.5 flex flex-col justify-start group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C87D55] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-[#085C52] via-[#064840] to-[#043630] text-[#F3E5AB] flex items-center justify-center mb-5 shadow-md shadow-[#085C52]/20 ring-1 ring-[#D4AF37]/50 group-hover:scale-105 transition-transform">
                  <FolderCheck className="w-6 h-6 text-[#E5C583]" />
                </div>
                <span className="text-[11px] font-extrabold text-[#A17C26] tracking-wider uppercase block mb-1">01. INBOX STRUCTURE</span>
                <h3 className="text-base sm:text-lg font-bold text-[#022C22] leading-snug group-hover:text-[#085C52] transition-colors mt-2">
                  Set up a simple four-folder inbox system.
                </h3>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="bg-[#FFFDF9] hover:bg-white transition-all duration-300 rounded-2xl p-7 border border-[#E8DFC8] hover:border-[#D4AF37] shadow-[0_10px_30px_-5px_rgba(2,44,34,0.06)] hover:shadow-2xl hover:shadow-[#D4AF37]/15 hover:-translate-y-1.5 flex flex-col justify-start group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C87D55] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-[#085C52] via-[#064840] to-[#043630] text-[#F3E5AB] flex items-center justify-center mb-5 shadow-md shadow-[#085C52]/20 ring-1 ring-[#D4AF37]/50 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6 text-[#E5C583]" />
                </div>
                <span className="text-[11px] font-extrabold text-[#A17C26] tracking-wider uppercase block mb-1">02. TEMPLATES</span>
                <h3 className="text-base sm:text-lg font-bold text-[#022C22] leading-snug group-hover:text-[#085C52] transition-colors mt-2">
                  Use three ready-to-adapt email reply templates.
                </h3>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="bg-[#FFFDF9] hover:bg-white transition-all duration-300 rounded-2xl p-7 border border-[#E8DFC8] hover:border-[#D4AF37] shadow-[0_10px_30px_-5px_rgba(2,44,34,0.06)] hover:shadow-2xl hover:shadow-[#D4AF37]/15 hover:-translate-y-1.5 flex flex-col justify-start group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C87D55] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-[#085C52] via-[#064840] to-[#043630] text-[#F3E5AB] flex items-center justify-center mb-5 shadow-md shadow-[#085C52]/20 ring-1 ring-[#D4AF37]/50 group-hover:scale-105 transition-transform">
                  <BellRing className="w-6 h-6 text-[#E5C583]" />
                </div>
                <span className="text-[11px] font-extrabold text-[#A17C26] tracking-wider uppercase block mb-1">03. CLIENT RETENTION</span>
                <h3 className="text-base sm:text-lg font-bold text-[#022C22] leading-snug group-hover:text-[#085C52] transition-colors mt-2">
                  Keep track of important customer follow-ups.
                </h3>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="bg-[#FFFDF9] hover:bg-white transition-all duration-300 rounded-2xl p-7 border border-[#E8DFC8] hover:border-[#D4AF37] shadow-[0_10px_30px_-5px_rgba(2,44,34,0.06)] hover:shadow-2xl hover:shadow-[#D4AF37]/15 hover:-translate-y-1.5 flex flex-col justify-start group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#C87D55] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-[#085C52] via-[#064840] to-[#043630] text-[#F3E5AB] flex items-center justify-center mb-5 shadow-md shadow-[#085C52]/20 ring-1 ring-[#D4AF37]/50 group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6 text-[#E5C583]" />
                </div>
                <span className="text-[11px] font-extrabold text-[#A17C26] tracking-wider uppercase block mb-1">04. SUSTAINABILITY</span>
                <h3 className="text-base sm:text-lg font-bold text-[#022C22] leading-snug group-hover:text-[#085C52] transition-colors mt-2">
                  Build an email routine that works for your business.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: GUIDE SECTION (#085C52 Emerald Showcase)
          Title: "The 10-Minute Inbox Reset"
          Replaced 5 detailed steps with: "Is This Guide for You?" curiosity introduction
      ========================================================================= */}
      <section id="the-guide" className="py-20 md:py-28 bg-[#085C52] bg-gradient-to-b from-[#085C52] via-[#064840] to-[#085C52] text-[#FBF7EE] border-y border-[#D4AF37]/25 relative overflow-hidden">
        {/* Ambient gold glow */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#0A7367]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#05413A]/95 rounded-3xl border border-[#D4AF37]/35 shadow-2xl shadow-black/50 overflow-hidden p-8 sm:p-12 relative backdrop-blur-md">
            {/* Elegant Top Decorative Border with Metallic Gold & Copper */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#C87D55] to-[#D4AF37]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: 3D Guide Mockup Display */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-[#043630] group">
                  <img
                    src="/src/assets/images/guide_white_book_1794503301645.jpg"
                    alt="The 10-Minute Inbox Reset by SmartPath Business Solutions - White printed guide lying flat on wooden desk"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-4 bg-gradient-to-r from-[#043630] via-[#064840] to-[#043630] text-[#FBF7EE] flex items-center justify-between text-xs border-t border-[#D4AF37]/30">
                    <span className="font-semibold text-[#DFBE75]">Format: Free PDF Digital Guide</span>
                    <span className="text-[#E5C583] font-bold">Read Time: ~10 Minutes</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Guide Title & Audience Introduction */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E5C583] bg-[#064840] border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-md inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Featured Business Resource</span>
                  </span>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-[#FBF7EE] tracking-tight">
                    The 10-Minute Inbox Reset
                  </h2>
                </div>

                <div className="space-y-4 pt-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#F3E5AB] tracking-tight">
                    Is This Guide for You?
                  </h3>

                  <p className="text-base sm:text-lg text-[#E2DDD5] leading-relaxed font-normal">
                    The 10-Minute Inbox Reset is for business owners, professionals, freelancers, entrepreneurs, and anyone who wants to manage their emails better, stay organized, and keep important conversations from getting lost.
                  </p>

                  <p className="text-base text-[#C8C2B7] leading-relaxed">
                    If you use email to communicate with customers, clients, or colleagues, this guide is a great place to start.
                  </p>
                </div>

                <div className="pt-4">
                  <a
                    href="#lead-form"
                    onClick={scrollToForm}
                    className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-[#E5C583] to-[#C5A059] hover:from-[#E5C583] hover:to-[#D4AF37] text-[#02231A] text-sm font-extrabold rounded-xl transition-all shadow-xl shadow-[#D4AF37]/25 hover:shadow-2xl cursor-pointer hover:scale-[1.02] border border-[#FFF3D1] overflow-hidden"
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform pointer-events-none" />
                    <span className="tracking-wide">Download Your Free Copy Now</span>
                    <ArrowRight className="w-4 h-4 text-[#02231A] group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: LEAD CAPTURE FORM SECTION (Warm Ivory & Cream Contrast with Glossy Card)
          Full Name, Email Address, WhatsApp Number
      ========================================================================= */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#FAF5EB] via-[#F4ECE0] to-[#FAF5EB] relative overflow-hidden">
        {/* Ambient warm champagne glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#D4AF37]/15 via-[#C87D55]/10 to-[#064E3B]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#B8860B] bg-[#FFFDF9] border border-[#D4AF37]/40 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C87D55]" />
              <span>Start Your Reset</span>
            </span>
            <h2 className="mt-3.5 text-3xl sm:text-4xl font-extrabold text-[#022C22] tracking-tight">
              Get Instant Access to The 10-Minute Inbox Reset
            </h2>
            <p className="mt-3 text-base text-[#475569] max-w-xl mx-auto leading-relaxed">
              Enter your details below. You will receive an immediate download link on the next page and a copy directly in your email inbox.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <LeadCaptureForm onSuccess={onLeadSuccess} />
          </div>
        </div>
      </section>
    </div>
  );
};
