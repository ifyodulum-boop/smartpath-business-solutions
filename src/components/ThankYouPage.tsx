import React, { useEffect } from 'react';
import { BRAND } from '../config/constants';
import { LeadFormData, SubmissionResponse } from '../types';
import { getLastSubmissionResult } from '../services/leadService';
import { 
  CheckCircle2, 
  Download, 
  MessageCircle, 
  ArrowLeft, 
  Mail, 
  Briefcase, 
  Phone, 
  FileCheck,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ThankYouPageProps {
  lead?: LeadFormData | null;
  submissionResult?: SubmissionResponse | null;
  onNavigateHome: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ 
  lead, 
  submissionResult: propResult, 
  onNavigateHome 
}) => {
  // Read submission result from props or fallback to storage
  const submissionResult = propResult || getLastSubmissionResult();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full py-12 md:py-20 bg-[#FAF5EB] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-8">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#064E3B] hover:text-[#022C22] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Main Confirmation Card */}
        <div className="bg-[#FFFDF9] rounded-3xl shadow-2xl shadow-[rgba(2,44,34,0.18)] border border-[#E8DFC8] overflow-hidden">
          {/* Top Banner (Deep Emerald Green Luxury with Metallic Gold Highlights) */}
          <div className="bg-gradient-to-b from-[#02231A] via-[#043326] to-[#021F17] text-[#FBF7EE] p-8 sm:p-14 text-center relative overflow-hidden border-b border-[#D4AF37]/35">
            {/* Subtle atmospheric gold & emerald ambient glow */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#064E3B]/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* Success Check Icon Badge with Gold Ring */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#065F46] via-[#04392B] to-[#02231A] text-[#F9F1DC] flex items-center justify-center shadow-2xl shadow-black/50 ring-2 ring-[#D4AF37]/60">
                <CheckCircle2 className="w-10 h-10 text-[#E5C583]" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C583] to-[#C5A059] border-2 border-[#02231A] flex items-center justify-center shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#02231A]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FBF7EE]">
              Thank You! Your Guide Is Ready.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#E2DDD5] max-w-2xl mx-auto leading-relaxed">
              Thank you for requesting <strong className="text-[#F3E5AB] font-semibold">{BRAND.guideTitle}</strong>. Your guide is ready to download. Check your email for a confirmation message as well.
            </p>

            {/* Truthful Email Status Indicator (Only confirms if backend actually sent the email) */}
            {lead && (
              <div className="mt-6 flex justify-center">
                {submissionResult?.visitorEmailSent ? (
                  <div className="inline-flex items-center gap-2 text-xs bg-[#032B20] border border-[#D4AF37]/50 text-[#F3E5AB] px-4 py-2 rounded-full font-medium shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>Confirmation email delivered to: <strong>{lead.email}</strong></span>
                  </div>
                ) : submissionResult?.sheetSaved ? (
                  <div className="inline-flex items-center gap-2 text-xs bg-[#032B20] border border-[#C87D55]/60 text-[#FDE8DE] px-4 py-2 rounded-full font-medium shadow-xs">
                    <AlertCircle className="w-4 h-4 text-[#C87D55] shrink-0" />
                    <span>Lead recorded in Google Sheet. (Email delivery pending Google authorization).</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 text-xs bg-[#032B20] border border-[#D4AF37]/30 text-[#E2DDD5] px-4 py-2 rounded-full font-medium shadow-xs">
                    <span>Direct access ready for: <strong>{lead.email}</strong></span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Download Action Area (Warm Ivory & Cream Surface) */}
          <div className="p-8 sm:p-12 border-b border-[#E2D6C0] bg-gradient-to-b from-[#FAF5EB] to-[#FFFDF9]">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A17C26] bg-[#FFFDF9] border border-[#D4AF37]/40 px-4 py-1.5 rounded-full shadow-xs">
                <FileCheck className="w-4 h-4 text-[#064E3B]" />
                <span>Instant PDF Download &bull; Free Access</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#022C22]">
                  Click Below to Download Immediately
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#475569] max-w-lg mx-auto">
                  Your PDF copy of <em>{BRAND.guideTitle}</em> is hosted securely on Google Drive for immediate access.
                </p>
              </div>

              <div>
                <a
                  href={BRAND.guideDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="The-10-Minute-Inbox-Reset.pdf"
                  className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4.5 rounded-xl text-base font-extrabold text-[#02231A] bg-gradient-to-r from-[#D4AF37] via-[#E5C583] to-[#C5A059] hover:from-[#E5C583] hover:to-[#D4AF37] border border-[#FFF3D1] active:scale-[0.98] transition-all shadow-xl shadow-[#D4AF37]/25 hover:shadow-2xl hover:shadow-[#D4AF37]/40 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform pointer-events-none" />
                  <Download className="w-5 h-5 text-[#02231A] group-hover:translate-y-0.5 transition-transform" />
                  <span className="tracking-wide">Download My Free Guide</span>
                </a>
              </div>

              <div className="flex items-center justify-center flex-wrap gap-6 text-xs text-[#64748B] pt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#064E3B]" />
                  Takes 10 seconds to download
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  No password required
                </span>
              </div>
            </div>
          </div>

          {/* Service Invitation & WhatsApp Section */}
          <div className="p-8 sm:p-12 bg-[#FFFDF9]">
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Short Service Invitation */}
              <div className="space-y-4 text-center sm:text-left bg-[#FAF5EB] p-7 rounded-2xl border border-[#E8DFC8]">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#064E3B] bg-[#E8F3EE] border border-[#C2DEC8] px-3 py-1 rounded-md">
                  <Briefcase className="w-3.5 h-3.5 text-[#064E3B]" />
                  <span>Next Step: Business Support</span>
                </div>

                <p className="text-lg sm:text-xl font-medium text-[#022C22] leading-relaxed italic font-serif">
                  &ldquo;Would you rather spend your time running your business than managing emails? I can help you organize your inbox, manage customer communication, and keep track of important follow-ups.&rdquo;
                </p>
              </div>

              {/* WhatsApp Contact CTA */}
              <div className="bg-gradient-to-br from-[#FAF5EB] to-[#E8F3EE]/50 rounded-2xl p-6 sm:p-8 border border-[#C2DEC8] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div>
                  <h3 className="text-base font-bold text-[#022C22]">
                    Connect With Me Directly
                  </h3>
                  <p className="mt-1 text-sm text-[#475569]">
                    Have questions about setting up an email system or hiring virtual assistant support? Let's chat.
                  </p>
                </div>

                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] transition-all shadow-md hover:shadow-lg shadow-emerald-600/20 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Chat With Me on WhatsApp</span>
                </a>
              </div>

              {/* Owner Display Details */}
              <div className="pt-6 border-t border-[#EFE7D8]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#A17C26] mb-4 text-center sm:text-left">
                  Business Owner & Contact Information
                </h4>
                
                <div className="bg-[#FAF5EB] rounded-2xl p-6 border border-[#E8DFC8] space-y-4">
                  <div className="border-b border-[#E8DFC8] pb-3">
                    <p className="text-lg font-bold text-[#022C22]">{BRAND.owner}</p>
                    <p className="text-sm text-[#064E3B] font-semibold">{BRAND.title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{BRAND.name}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <a
                      href={BRAND.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-[#334155] hover:text-[#064E3B] transition-colors p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-[#E8DFC8]"
                    >
                      <Phone className="w-4 h-4 text-[#064E3B] shrink-0" />
                      <span><strong>WhatsApp:</strong> {BRAND.phoneDisplay}</span>
                    </a>

                    <a
                      href={`mailto:${BRAND.email}`}
                      className="flex items-center gap-2.5 text-[#334155] hover:text-[#064E3B] transition-colors p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-[#E8DFC8]"
                    >
                      <Mail className="w-4 h-4 text-[#064E3B] shrink-0" />
                      <span className="truncate"><strong>Email:</strong> {BRAND.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Back to Home Button */}
              <div className="pt-4 text-center">
                <button
                  onClick={onNavigateHome}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#334155] hover:text-[#022C22] bg-[#FAF5EB] hover:bg-[#EFE7D8] border border-[#E0D5C1] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#064E3B]" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
