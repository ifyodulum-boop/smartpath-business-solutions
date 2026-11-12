export interface LeadFormData {
  fullName: string;
  email: string;
  whatsappNumber: string;
}

export interface LeadSubmissionRecord extends LeadFormData {
  id: string;
  timestamp: string;
  formattedDate: string;
  backendResponse?: string;
  status: 'success' | 'failed' | 'simulated';
  sheetSaved?: boolean;
  ownerEmailSent?: boolean;
  visitorEmailSent?: boolean;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  sheetSaved?: boolean;
  ownerEmailSent?: boolean;
  visitorEmailSent?: boolean;
  isLiveBackend?: boolean;
  emailError?: string;
  lead?: LeadFormData;
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  whatsappNumber?: string;
}
