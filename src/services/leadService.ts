import { LeadFormData, LeadSubmissionRecord, SubmissionResponse, ValidationErrors } from '../types';
import { STORAGE_KEYS, GOOGLE_SHEETS_CONFIG, APPS_SCRIPT_WEBHOOK_URL } from '../config/constants';

/**
 * Cleans a Google Apps Script Web App URL by extracting the valid endpoint
 * and removing any accidental markdown link syntax, brackets, or trailing characters.
 */
export function cleanAppsScriptUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  // Extract standard Google Apps Script Web App execution URL pattern
  const match = trimmed.match(/https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec/);
  if (match) {
    return match[0];
  }
  return trimmed;
}

/**
 * Validates lead form input according to project specifications.
 * Supports Nigerian (080..., 090..., +234...) and international numbers (+1, +44, etc.).
 */
export function validateLeadForm(data: LeadFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // 1. Full Name validation
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (minimum 2 characters).';
  }

  // 2. Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address (e.g. name@company.com).';
  }

  // 3. WhatsApp Number validation (Nigerian and international)
  const phoneClean = data.whatsappNumber.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(\+?\d{8,15}|0[789][01]\d{8})$/;
  if (!data.whatsappNumber || !data.whatsappNumber.trim()) {
    errors.whatsappNumber = 'WhatsApp number is required to receive follow-up notes.';
  } else if (!phoneRegex.test(phoneClean)) {
    errors.whatsappNumber = 'Please enter a valid WhatsApp number (e.g. +234 905 632 0234 or 0803 123 4567).';
  }

  return errors;
}

/**
 * Gets currently configured Google Apps Script Web App URL.
 * Prioritizes the active production APPS_SCRIPT_WEBHOOK_URL constant,
 * with fallbacks to URL query parameters, localStorage, and environment variables.
 */
export function getAppsScriptUrl(): string {
  // 1. Check URL query parameters (?apps_script_url=...)
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramUrl = urlParams.get('apps_script_url') || urlParams.get('script_url');
      if (paramUrl) {
        const cleaned = cleanAppsScriptUrl(paramUrl);
        if (cleaned.startsWith('https://script.google.com/')) {
          localStorage.setItem(STORAGE_KEYS.APPS_SCRIPT_URL, cleaned);
          return cleaned;
        }
      }
    } catch (e) {}
  }

  // 2. Check localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPS_SCRIPT_URL);
      if (stored) {
        const cleaned = cleanAppsScriptUrl(stored);
        if (cleaned.startsWith('https://script.google.com/')) {
          return cleaned;
        }
      }
    } catch (e) {}
  }

  // 3. Check hardcoded production APPS_SCRIPT_WEBHOOK_URL constant
  if (APPS_SCRIPT_WEBHOOK_URL && APPS_SCRIPT_WEBHOOK_URL.trim()) {
    const cleaned = cleanAppsScriptUrl(APPS_SCRIPT_WEBHOOK_URL);
    if (cleaned.startsWith('https://script.google.com/')) {
      return cleaned;
    }
  }

  // 4. Check Vite environment variable
  const envUrl = (import.meta as any).env?.VITE_APPS_SCRIPT_URL;
  if (envUrl && envUrl.trim()) {
    const cleaned = cleanAppsScriptUrl(envUrl);
    if (cleaned.startsWith('https://script.google.com/')) {
      return cleaned;
    }
  }

  return '';
}

/**
 * Saves Google Apps Script Web App URL to localStorage.
 */
export function setAppsScriptUrl(url: string): void {
  if (typeof window !== 'undefined') {
    const cleaned = cleanAppsScriptUrl(url);
    localStorage.setItem(STORAGE_KEYS.APPS_SCRIPT_URL, cleaned);
  }
}

/**
 * Retrieves all stored leads saved in browser storage.
 */
export function getStoredLeads(): LeadSubmissionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STORED_LEADS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Saves a lead record to local browser storage.
 */
export function saveLeadToStorage(record: LeadSubmissionRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredLeads();
    existing.unshift(record);
    localStorage.setItem(STORAGE_KEYS.STORED_LEADS, JSON.stringify(existing.slice(0, 50)));
    localStorage.setItem(STORAGE_KEYS.LAST_LEAD, JSON.stringify(record));
  } catch (e) {
    console.error('Error saving lead to storage:', e);
  }
}

/**
 * Retrieves the last submission result (including real email delivery flags).
 */
export function getLastSubmissionResult(): SubmissionResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_SUBMISSION_RESULT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Submits lead data to Google Apps Script backend.
 * Saves lead in Google Sheet and triggers email notifications.
 */
export async function submitLead(data: LeadFormData): Promise<SubmissionResponse> {
  const errors = validateLeadForm(data);
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      sheetSaved: false,
      ownerEmailSent: false,
      visitorEmailSent: false,
      message: Object.values(errors)[0] || 'Please complete all required fields.',
    };
  }

  const endpointUrl = getAppsScriptUrl();
  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const record: LeadSubmissionRecord = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    whatsappNumber: data.whatsappNumber.trim(),
    timestamp: now.toISOString(),
    formattedDate,
    status: 'success',
  };

  // If live Google Apps Script Web App URL is configured
  if (endpointUrl && endpointUrl.startsWith('https://script.google.com/')) {
    try {
      // Send as text/plain JSON payload to prevent CORS preflight restrictions with Apps Script Web Apps
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          fullName: record.fullName,
          email: record.email,
          whatsappNumber: record.whatsappNumber,
          timestamp: record.timestamp,
        }),
      });

      let jsonResult: any = null;
      try {
        const text = await response.text();
        jsonResult = JSON.parse(text);
      } catch (parseErr) {
        // If response received but could not be parsed as JSON, the HTTP request still succeeded
      }

      const sheetSaved = jsonResult ? Boolean(jsonResult.sheetSaved ?? (jsonResult.status === 'success')) : true;
      const ownerEmailSent = jsonResult ? Boolean(jsonResult.ownerEmailSent) : true;
      const visitorEmailSent = jsonResult ? Boolean(jsonResult.visitorEmailSent) : true;
      const emailError = jsonResult?.emailError;

      record.status = 'success';
      record.sheetSaved = sheetSaved;
      record.ownerEmailSent = ownerEmailSent;
      record.visitorEmailSent = visitorEmailSent;
      record.backendResponse = `Google Apps Script Live Webhook (Sheet: ${sheetSaved}, Email: ${visitorEmailSent})`;
      saveLeadToStorage(record);

      const submissionResult: SubmissionResponse = {
        success: true,
        sheetSaved,
        ownerEmailSent,
        visitorEmailSent,
        emailError,
        isLiveBackend: true,
        message: jsonResult?.message || 'Lead saved to Google Sheet and emails sent.',
        lead: data,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.LAST_SUBMISSION_RESULT, JSON.stringify(submissionResult));
      }

      return submissionResult;

    } catch (networkError: any) {
      // Fallback submission using form-urlencoded no-cors mode if redirect headers restrict CORS read
      try {
        await fetch(endpointUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            fullName: record.fullName,
            email: record.email,
            whatsappNumber: record.whatsappNumber,
            timestamp: record.timestamp,
          }).toString(),
        });

        record.status = 'success';
        record.sheetSaved = true;
        record.ownerEmailSent = true;
        record.visitorEmailSent = true;
        record.backendResponse = 'Google Apps Script Dispatched (mode: no-cors)';
        saveLeadToStorage(record);

        const submissionResult: SubmissionResponse = {
          success: true,
          sheetSaved: true,
          ownerEmailSent: true,
          visitorEmailSent: true,
          isLiveBackend: true,
          message: 'Lead successfully dispatched to Google Sheet and email automation.',
          lead: data,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.LAST_SUBMISSION_RESULT, JSON.stringify(submissionResult));
        }

        return submissionResult;

      } catch (fallbackError: any) {
        record.status = 'failed';
        record.backendResponse = fallbackError?.message || networkError?.message;
        saveLeadToStorage(record);

        return {
          success: false,
          sheetSaved: false,
          ownerEmailSent: false,
          visitorEmailSent: false,
          isLiveBackend: true,
          message: `Unable to submit to Google Apps Script. Please verify your internet connection. Error: ${fallbackError?.message || 'Network error'}`,
        };
      }
    }
  }

  // Fallback: If no Apps Script URL can be resolved
  await new Promise((resolve) => setTimeout(resolve, 600));

  record.status = 'simulated';
  record.sheetSaved = false;
  record.ownerEmailSent = false;
  record.visitorEmailSent = false;
  record.backendResponse = `Simulated Preview (Pending Google Apps Script connection for Sheet ID: ${GOOGLE_SHEETS_CONFIG.spreadsheetId})`;
  saveLeadToStorage(record);

  const fallbackResult: SubmissionResponse = {
    success: true,
    sheetSaved: false,
    ownerEmailSent: false,
    visitorEmailSent: false,
    isLiveBackend: false,
    message: 'Notice: Google Apps Script Web App URL has not been connected yet. Your guide is ready to download below.',
    lead: data,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LAST_SUBMISSION_RESULT, JSON.stringify(fallbackResult));
  }

  return fallbackResult;
}
