import React, { useState } from 'react';
import { getAppsScriptUrl, setAppsScriptUrl, getStoredLeads } from '../services/leadService';
import { BRAND } from '../config/constants';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Database, 
  Send, 
  GitBranch, 
  Globe, 
  CheckSquare, 
  RefreshCw,
  Terminal,
  HelpCircle,
  FileCode
} from 'lucide-react';

interface SetupAndDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLeadForTest?: (lead: { fullName: string; email: string; whatsappNumber: string }) => void;
}

export const SetupAndDeploymentModal: React.FC<SetupAndDeploymentModalProps> = ({
  isOpen,
  onClose,
  onSelectLeadForTest,
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'config' | 'leads' | 'netlify' | 'checklist'>('config');
  const [scriptUrlInput, setScriptUrlInput] = useState<string>(() => getAppsScriptUrl());
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [leads, setLeads] = useState(() => getStoredLeads());

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setAppsScriptUrl(scriptUrlInput);
    setSaveFeedback('Web App URL saved successfully! Live submissions are now active.');
    setTimeout(() => setSaveFeedback(null), 4000);
  };

  const handleRefreshLeads = () => {
    setLeads(getStoredLeads());
  };

  const appsScriptCode = `/**
 * SmartPath Business Solutions - Lead Capture Google Apps Script Backend
 * Business Owner: Christiana Odulum (christianaodulum@gmail.com)
 */

var SPREADSHEET_ID = ""; // Leave empty if opened via Extensions > Apps Script in Google Sheets
var OWNER_EMAIL = "christianaodulum@gmail.com";
var GUIDE_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1Gvz3shmI0J5hnXJ5RIpFMekfzY8sryCB";
var WHATSAPP_CONTACT_URL = "https://wa.me/2349056320234";

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return createJsonResponse({ status: "error", message: "Server busy." }, 429);
  }

  try {
    var data = parseRequestData(e);
    var fullName = (data.fullName || data.name || "").toString().trim();
    var email = (data.email || "").toString().trim().toLowerCase();
    var whatsappNumber = (data.whatsappNumber || data.phone || "").toString().trim();

    if (!fullName || fullName.length < 2) {
      return createJsonResponse({ status: "error", message: "Please provide your full name." }, 400);
    }
    if (!email || !email.includes("@")) {
      return createJsonResponse({ status: "error", message: "Please provide a valid email address." }, 400);
    }
    if (!whatsappNumber || whatsappNumber.replace(/\\D/g, "").length < 8) {
      return createJsonResponse({ status: "error", message: "Please provide a valid WhatsApp number." }, 400);
    }

    var sheet = getOrInitializeSheet();
    var now = new Date();
    var formattedDateTime = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT+1", "yyyy-MM-dd HH:mm:ss");

    sheet.appendRow([fullName, email, whatsappNumber, formattedDateTime, "Confirmed"]);

    try { sendOwnerNotificationEmail(fullName, email, whatsappNumber, formattedDateTime); } catch (e) {}
    try { sendVisitorConfirmationEmail(fullName, email); } catch (e) {}

    return createJsonResponse({
      status: "success",
      message: "Lead recorded successfully.",
      data: { fullName: fullName, email: email, whatsappNumber: whatsappNumber, submittedAt: formattedDateTime }
    }, 200);
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "SmartPath Business Solutions Lead Capture API",
    owner: OWNER_EMAIL
  })).setMimeType(ContentService.MimeType.JSON);
}

function parseRequestData(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) {}
  }
  return e.parameter || {};
}

function getOrInitializeSheet() {
  var spreadsheet = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Leads") || spreadsheet.getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Full Name", "Email Address", "WhatsApp Number", "Date & Time of Submission", "Status"]);
    var range = sheet.getRange(1, 1, 1, 5);
    range.setFontWeight("bold").setBackground("#0B192C").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendOwnerNotificationEmail(name, email, phone, timestamp) {
  var subject = "New Lead: " + name + " requested The 10-Minute Inbox Reset";
  var html = "<div style='font-family: Arial; padding: 20px;'>" +
    "<h3>New Lead from SmartPath Website</h3>" +
    "<p><strong>Full Name:</strong> " + name + "</p>" +
    "<p><strong>Email:</strong> " + email + "</p>" +
    "<p><strong>WhatsApp:</strong> " + phone + "</p>" +
    "<p><strong>Time:</strong> " + timestamp + "</p>" +
    "<p><a href='https://wa.me/" + phone.replace(/\\D/g, "") + "'>Message Lead on WhatsApp</a></p>" +
    "</div>";
  MailApp.sendEmail({ to: OWNER_EMAIL, subject: subject, htmlBody: html });
}

function sendVisitorConfirmationEmail(name, email) {
  var subject = "Your Free Guide: The 10-Minute Inbox Reset | SmartPath Business Solutions";
  var html = "<div style='font-family: Arial; padding: 20px;'>" +
    "<h2>SmartPath Business Solutions</h2>" +
    "<p>Hello " + name.split(" ")[0] + ",</p>" +
    "<p>Thank you for requesting <strong>The 10-Minute Inbox Reset</strong>. Your free guide is ready to download:</p>" +
    "<p><a href='" + GUIDE_DOWNLOAD_URL + "' style='background:#0d9488;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block;'>Download My Free Guide</a></p>" +
    "<p>Need virtual assistant support? <a href='" + WHATSAPP_CONTACT_URL + "'>Chat with Christiana on WhatsApp</a></p>" +
    "</div>";
  MailApp.sendEmail({ to: email, subject: subject, htmlBody: html });
}

function createJsonResponse(data, code) {
  var out = ContentService.createTextOutput(JSON.stringify(data));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0B192C] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-400" />
              <span>Backend Setup, Deployment & Testing Hub</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              SmartPath Business Solutions — Google Sheets & Web App Integration
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex flex-wrap gap-2 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-white text-teal-700 border-t-2 border-teal-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>1. Connect Web App URL</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'script'
                ? 'bg-white text-teal-700 border-t-2 border-teal-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>2. Apps Script Code</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('leads');
              handleRefreshLeads();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'leads'
                ? 'bg-white text-teal-700 border-t-2 border-teal-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>3. Stored Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('netlify')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'netlify'
                ? 'bg-white text-teal-700 border-t-2 border-teal-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>4. GitHub & Netlify Deployment</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-white text-teal-700 border-t-2 border-teal-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>5. Completion Checklist</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {/* TAB 1: Connect Web App URL */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <h3 className="font-bold text-teal-900 text-base flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-600" />
                  Connect Landing Page Form to Google Sheets
                </h3>
                <p className="mt-1 text-xs text-teal-800 leading-relaxed">
                  Once you deploy your Google Apps Script as a Web App (instructions in tab 2), paste your <strong>Web app URL</strong> below. Every form submission from the landing page will immediately write a new row to your Google Sheet and send the emails!
                </p>
              </div>

              <form onSubmit={handleSaveUrl} className="space-y-4">
                <div>
                  <label htmlFor="scriptUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Google Apps Script Web App URL
                  </label>
                  <input
                    type="url"
                    id="scriptUrl"
                    value={scriptUrlInput}
                    onChange={(e) => setScriptUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full px-4 py-2.5 text-sm font-mono rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-100 focus:border-teal-600"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    Format: <code>https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec</code>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Webhook URL</span>
                  </button>

                  {scriptUrlInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setScriptUrlInput('');
                        setAppsScriptUrl('');
                        setSaveFeedback('Webhook URL reset to local test mode.');
                        setTimeout(() => setSaveFeedback(null), 3000);
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors"
                    >
                      Clear / Use Local Test Mode
                    </button>
                  )}
                </div>

                {saveFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{saveFeedback}</span>
                  </div>
                )}
              </form>

              {/* Status Summary Box */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2 text-xs">
                <p className="font-bold text-slate-800">Current Backend Integration Status:</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${scriptUrlInput ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="font-medium">
                    {scriptUrlInput ? 'Connected to live Google Apps Script' : 'Running in Local Simulated Mode (Fully Functional for Testing)'}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  When in local mode, form submissions validate inputs, simulate network transit, save to the local leads audit log, and redirect to the Thank-You page so you can test the entire visitor journey before publishing your Google Apps Script.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Apps Script Code & 7-Step Setup */}
          {activeTab === 'script' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Google Apps Script Source Code (`Code.gs`)</h3>
                  <p className="text-xs text-slate-500">Copy this code into your Google Sheets Apps Script editor.</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-[#0B192C] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Entire Code'}</span>
                </button>
              </div>

              {/* 7-Step Walkthrough */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900 text-sm">Step-by-Step Setup in 3 Minutes:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong>Create Sheet:</strong> Open <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-teal-600 underline">sheets.new</a>, name it <code>SmartPath Business Solutions - Leads</code>.</li>
                  <li><strong>Open Apps Script:</strong> In the top menu, click <code>Extensions</code> &rarr; <code>Apps Script</code>.</li>
                  <li><strong>Paste Code:</strong> Delete any default code in <code>Code.gs</code>, click the button above to copy this script, and paste it into the editor.</li>
                  <li><strong>Save:</strong> Click the disk icon (or press <code>Ctrl+S</code> / <code>Cmd+S</code>).</li>
                  <li><strong>Deploy:</strong> Click the blue <code>Deploy</code> button &rarr; <code>New deployment</code> &rarr; Select type: <strong>Web app</strong>.</li>
                  <li><strong>Permissions:</strong> Execute as: <strong>Me (your account)</strong>, Who has access: <strong>Anyone</strong>. Click <code>Deploy</code>.</li>
                  <li><strong>Authorize:</strong> Click <em>Authorize access</em> &rarr; <em>Advanced</em> &rarr; <em>Go to SmartPath (unsafe)</em> &rarr; <em>Allow</em>. Copy the Web app URL and paste it into Tab 1!</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="bg-slate-950 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">
                  {appsScriptCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Stored Leads Inspector */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Recorded Test & Live Leads</h3>
                  <p className="text-xs text-slate-500">Every lead submitted through the landing page form appears here.</p>
                </div>
                <button
                  onClick={handleRefreshLeads}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                  <Database className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No leads recorded yet</p>
                  <p className="text-xs text-slate-500 mt-1">Submit the form on the landing page or click one of the quick test profiles.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0B192C] text-white">
                        <th className="py-2.5 px-3 font-semibold">Full Name</th>
                        <th className="py-2.5 px-3 font-semibold">Email</th>
                        <th className="py-2.5 px-3 font-semibold">WhatsApp Number</th>
                        <th className="py-2.5 px-3 font-semibold">Submitted At</th>
                        <th className="py-2.5 px-3 font-semibold">Backend Channel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {leads.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-medium text-slate-900">{item.fullName}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{item.email}</td>
                          <td className="py-2.5 px-3 text-slate-600">{item.whatsappNumber}</td>
                          <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{item.formattedDate}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.status === 'success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}>
                              {item.backendResponse || item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GitHub & Netlify Deployment Guide */}
          {activeTab === 'netlify' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">GitHub & Netlify Deployment Guide</h3>
                <p className="text-xs text-slate-500">Step-by-step instructions to publish SmartPath to a free, live custom URL.</p>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-teal-600" />
                    Step 1: Push Source Code to GitHub
                  </h4>
                  <p className="text-xs text-slate-600">
                    Initialize a repository and push your project files to your GitHub account:
                  </p>
                  <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`git init
git add .
git commit -m "Initial commit: SmartPath Lead Generation Funnel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartpath-funnel.git
git push -u origin main`}
                  </pre>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-teal-600" />
                    Step 2: Connect Repository to Netlify
                  </h4>
                  <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-1.5">
                    <li>Sign up or log in to <a href="https://netlify.com" target="_blank" rel="noreferrer" className="text-teal-600 underline">Netlify.com</a>.</li>
                    <li>Click <strong>Add new site</strong> &rarr; <strong>Import an existing project</strong>.</li>
                    <li>Choose <strong>GitHub</strong> and authorize access to your repository.</li>
                    <li>Select the <code>smartpath-funnel</code> repository.</li>
                  </ol>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-teal-600" />
                    Step 3: Configure Build Settings
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li><strong>Build command:</strong> <code>npm run build</code></li>
                    <li><strong>Publish directory:</strong> <code>dist</code></li>
                    <li><strong>Environment variables:</strong> (Optional) Add <code>VITE_APPS_SCRIPT_URL</code> with your deployed Google Apps Script URL.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-600" />
                    Step 4: Deploy and Test
                  </h4>
                  <p className="text-xs text-slate-600">
                    Click <strong>Deploy site</strong>. Netlify builds the app in under 1 minute and assigns a live HTTPS URL (e.g., <code>https://smartpath-solutions.netlify.app</code>). Test both the landing page and thank-you page on desktop and mobile!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Completion & Testing Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Project Requirements & Status Breakdown</h3>
                <p className="text-xs text-slate-500">Every deliverable categorized by implementation status.</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded inline-block">
                  Completed in Generated Code
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Landing Page with Hero, Benefits (4 items), Guide Intro, and Lead Form</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Complete Thank-You Page with Guide Download and WhatsApp CTA</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Lead capture form with Full Name, Email, and WhatsApp number fields</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Field validation (required fields, email format, Nigerian & int'l phones)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Loading state and duplicate submission prevention</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Seamless routing to Thank-You page on confirmed submission</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Complete Google Apps Script backend code (Code.gs)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> In-app backend configuration & lead audit table</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Truthful privacy statement & exact brand details for Christiana Odulum</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Responsive desktop and mobile layouts with zero overflow</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded inline-block">
                  Requires Manual Configuration (By User)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-amber-600" /> Creating the Google Sheet at sheets.new</li>
                  <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-amber-600" /> Deploying the Apps Script as a Web App (Execute as: Me, Access: Anyone)</li>
                  <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-amber-600" /> Authorizing Google permissions on Christiana's Google account</li>
                  <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-amber-600" /> Pasting the deployed Web App URL into the configuration field</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded inline-block">
                  Requires Live Testing (Checklist)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-teal-600" /> Submit Test Lead 1: Aisha Bello (0803 123 4567)</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-teal-600" /> Submit Test Lead 2: David Chukwuma (+234 901 234 5678)</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-teal-600" /> Submit Test Lead 3: Sarah Jenkins (+1 415 555 2671)</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-teal-600" /> Verify new rows in Google Sheet with date/time stamps</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-teal-600" /> Verify notification email arrived in christianaodulum@gmail.com</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-teal-600" /> Verify confirmation email with guide link arrived in visitor inbox</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-teal-600" /> Verify download link opens The 10-Minute Inbox Reset</li>
                  <li className="flex items-center gap-2"><CheckSquare className="w-4 h-4 text-teal-600" /> Verify WhatsApp button opens chat with +234 905 632 0234</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            SmartPath Business Solutions Funnel
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
