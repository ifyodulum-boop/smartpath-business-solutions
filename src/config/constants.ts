/**
 * Brand Constants and Configuration for SmartPath Business Solutions
 * All copy and contact details align with the official project specification.
 */

export const BRAND = {
  name: 'SmartPath Business Solutions',
  shortName: 'SmartPath',
  tagline: 'Practical Business Support. Better Organization.',
  owner: 'Christiana Odulum',
  title: 'Virtual Assistant | Business Support & AI Automation',
  email: 'christianaodulum@gmail.com',
  phoneDisplay: '+234 905 632 0234',
  phoneRaw: '2349056320234',
  whatsappUrl: 'https://wa.me/2349056320234',
  guideTitle: 'The 10-Minute Inbox Reset',
  guideDownloadUrl: 'https://drive.google.com/uc?export=download&id=1Gvz3shmI0J5hnXJ5RIpFMekfzY8sryCB',
  privacyText: 'Your information will be used to deliver the requested guide and communicate relevant services. We respect your privacy and will not share or sell your contact information.'
};

export const GOOGLE_SHEETS_CONFIG = {
  spreadsheetName: 'SmartPath Business Solutions – Lead Records',
  spreadsheetId: '1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o',
  columnHeadings: [
    'Full Name',
    'Email Address',
    'Date and Time of Submission'
  ]
};

/**
 * Live Google Apps Script Web App Endpoint.
 * Connected to spreadsheet: SmartPath Business Solutions – Lead Records (1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o)
 */
export const APPS_SCRIPT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwislB1H4SrzKeiQqTU8s6jPo7azO5RIqDKsdmgZ38HztJrOmfpXN4YNFJA_rSzvM9l/exec';

export const COLOR_PALETTE = {
  emeraldPrimary: '#085C52',
  emeraldDark: '#064840',
  emeraldDeep: '#053B34',
  champagneLight: '#F3E5AB',
  champagneGold: '#E5C583',
  metallicGold: '#D4AF37',
  antiqueGold: '#B8860B',
  warmIvory: '#FAF5EB',
  softCream: '#F5ECE0',
  pearlWhite: '#FFFDF9',
  copperWarm: '#C87D55',
  copperDeep: '#9E5330',
  slateText: '#1E293B',
  slateMuted: '#64748B',
};

// Storage keys for browser localStorage
export const STORAGE_KEYS = {
  APPS_SCRIPT_URL: 'smartpath_apps_script_url',
  STORED_LEADS: 'smartpath_submitted_leads',
  LAST_LEAD: 'smartpath_last_submitted_lead',
  LAST_SUBMISSION_RESULT: 'smartpath_last_submission_result'
};
