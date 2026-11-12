import React, { useState } from 'react';
import { LeadFormData, SubmissionResponse, ValidationErrors } from '../types';
import { validateLeadForm, submitLead } from '../services/leadService';
import { BRAND } from '../config/constants';
import { Mail, User, Phone, CheckCircle, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface LeadCaptureFormProps {
  onSuccess: (lead: LeadFormData, submissionResult?: SubmissionResponse) => void;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    whatsappNumber: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate form inputs
    const formErrors = validateLeadForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await submitLead(formData);

      if (response.success) {
        // Only redirect to thank-you page when backend confirms successful submission
        onSuccess(formData, response);
      } else {
        setApiError(response.message || 'Submission failed. Please check your network connection and try again.');
      }
    } catch (err: any) {
      setApiError(err?.message || 'A network error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="lead-form" className="scroll-mt-24 w-full">
      {/* Decorative Outer Shell with Metallic Gold, Copper & Emerald Gradient Rim */}
      <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-[#D4AF37] via-[#C87D55] to-[#064E3B] shadow-[0_25px_60px_-15px_rgba(2,44,34,0.22)]">
        <div className="bg-[#FFFDF9]/98 backdrop-blur-md rounded-[22px] p-6 sm:p-9 md:p-11 border border-white/80">
          {/* Subtle Top Metallic Accent Bar */}
          <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-[#064E3B] via-[#D4AF37] to-[#C87D55] mx-auto mb-6" />

          {/* Form Heading & Subhead */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#A17C26] bg-[#FAF5EB] border border-[#D4AF37]/40 px-4 py-1.5 rounded-full mb-3.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="tracking-wide">Instant Digital Access &bull; 100% Free</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#022C22] tracking-tight">
              Get Your Free Guide
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[#475569] max-w-md mx-auto leading-relaxed">
              Fill in your details below to download <span className="font-bold text-[#064E3B]">{BRAND.guideTitle}</span> immediately.
            </p>
          </div>

          {/* Error Alert */}
          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-900 flex items-start gap-3 text-sm shadow-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Submission encountered an error</p>
                <p className="mt-0.5 text-xs sm:text-sm">{apiError}</p>
              </div>
            </div>
          )}

          {/* Lead Capture Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Field 1: Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-[#022C22] mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-[#064E3B]/70" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. Christiana Odulum"
                  autoComplete="name"
                  className={`w-full pl-10 pr-4 py-3.5 text-sm rounded-xl border bg-[#FAF5EB] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all shadow-xs ${
                    errors.fullName
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                      : 'border-[#E0D5C1] focus:ring-[#D4AF37]/25 focus:border-[#064E3B]'
                  } disabled:bg-slate-100 disabled:cursor-not-allowed`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Field 2: Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#022C22] mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#064E3B]/70" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. name@company.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3.5 text-sm rounded-xl border bg-[#FAF5EB] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all shadow-xs ${
                    errors.email
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                      : 'border-[#E0D5C1] focus:ring-[#D4AF37]/25 focus:border-[#064E3B]'
                  } disabled:bg-slate-100 disabled:cursor-not-allowed`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Field 3: WhatsApp Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="whatsappNumber" className="block text-sm font-semibold text-[#022C22]">
                  WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-semibold text-[#064E3B] bg-[#E8F3EE] px-2 py-0.5 rounded border border-[#C2DEC8]">
                  Nigerian & Intl
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-[#064E3B]/70" />
                </div>
                <input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. +234 905 632 0234 or 0803 123 4567"
                  autoComplete="tel"
                  className={`w-full pl-10 pr-4 py-3.5 text-sm rounded-xl border bg-[#FAF5EB] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 transition-all shadow-xs ${
                    errors.whatsappNumber
                      ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                      : 'border-[#E0D5C1] focus:ring-[#D4AF37]/25 focus:border-[#064E3B]'
                  } disabled:bg-slate-100 disabled:cursor-not-allowed`}
                />
              </div>
              {errors.whatsappNumber ? (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.whatsappNumber}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-[#64748B]">
                  Accepts Nigerian (080..., 090..., +234...) and international numbers.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`relative group w-full py-4 px-6 rounded-xl text-[#02231A] font-extrabold text-base shadow-xl shadow-[#D4AF37]/25 hover:shadow-2xl hover:shadow-[#D4AF37]/40 transition-all flex items-center justify-center gap-2.5 overflow-hidden ${
                  isSubmitting
                    ? 'bg-[#E5C583]/90 cursor-wait'
                    : 'bg-gradient-to-r from-[#D4AF37] via-[#E5C583] to-[#C5A059] hover:from-[#E5C583] hover:to-[#D4AF37] active:scale-[0.99] border border-[#FFF3D1] cursor-pointer'
                }`}
              >
                {/* Subtle Button Shimmer Glow */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform pointer-events-none" />

                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#02231A]" />
                    <span>Processing Your Free Guide...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-wide">Get My Free Guide</span>
                    <CheckCircle className="w-5 h-5 text-[#02231A] group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Truthful Privacy Statement (Required by Project Spec) */}
            <div className="pt-3 border-t border-[#EFE7D8] text-center">
              <p className="text-xs text-[#64748B] leading-relaxed flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#064E3B] shrink-0 inline" />
                <span>
                  Your information will be used to deliver the requested guide and communicate relevant services.
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
