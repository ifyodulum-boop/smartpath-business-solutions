import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ThankYouPage } from './components/ThankYouPage';
import { LeadFormData, SubmissionResponse } from './types';
import { STORAGE_KEYS } from './config/constants';
import { getLastSubmissionResult } from './services/leadService';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path === '/thank-you' ? '/thank-you' : '/';
    }
    return '/';
  });

  const [lastSubmittedLead, setLastSubmittedLead] = useState<LeadFormData | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LAST_LEAD);
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [lastSubmissionResult, setLastSubmissionResult] = useState<SubmissionResponse | null>(() => {
    return getLastSubmissionResult();
  });

  // Sync route changes with browser history (back/forward button support)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path === '/thank-you' ? '/thank-you' : '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeadSuccess = (lead: LeadFormData, submissionResult?: SubmissionResponse) => {
    setLastSubmittedLead(lead);
    if (submissionResult) {
      setLastSubmissionResult(submissionResult);
    }
    navigateTo('/thank-you');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5EB] text-slate-900 font-sans selection:bg-[#D4AF37] selection:text-[#02231A]">
      {/* Top Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigateTo}
      />

      {/* Main Routed View */}
      <main className="flex-1">
        {currentPath === '/thank-you' ? (
          <ThankYouPage
            lead={lastSubmittedLead}
            submissionResult={lastSubmissionResult}
            onNavigateHome={() => navigateTo('/')}
          />
        ) : (
          <LandingPage
            onLeadSuccess={handleLeadSuccess}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
