# SmartPath Business Solutions — Lead Generation Funnel

A complete, production-ready, responsive lead-generation funnel built for **SmartPath Business Solutions**, offering the free business guide **"The 10-Minute Inbox Reset"** by virtual assistant **Christiana Odulum**, integrated with Google Sheets and Google Apps Script.

---

## 1. Funnel Architecture & User Journey

```
Visitor ──> Landing Page (/) ──> Lead Capture Form ──> Apps Script Backend ──> Google Sheet Row & MailApp ──> Thank-You Page (/thank-you) ──> Free Guide Download & WhatsApp Contact
```

### Brand Information & Credentials
- **Business Name:** SmartPath Business Solutions
- **Tagline:** Practical Business Support. Better Organization.
- **Business Owner:** Christiana Odulum
- **Professional Title:** Virtual Assistant | Business Support & AI Automation
- **Email:** christianaodulum@gmail.com
- **WhatsApp:** +234 905 632 0234 ([wa.me/2349056320234](https://wa.me/2349056320234))
- **Guide Title:** *The 10-Minute Inbox Reset*
- **Guide Download Link:** [https://drive.google.com/uc?export=download&id=1Gvz3shmI0J5hnXJ5RIpFMekfzY8sryCB](https://drive.google.com/uc?export=download&id=1Gvz3shmI0J5hnXJ5RIpFMekfzY8sryCB)

### Connected Google Sheet Details
- **Spreadsheet Name:** `SmartPath Business Solutions – Lead Records`
- **Spreadsheet ID:** `1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o`
- **Column Headings:** `Full Name` | `Email Address` | `WhatsApp Number` | `Date and Time of Submission`

---

## 2. Frontend Structure & Verified Content

### Landing Page (`/`)
1. **Hero Section:**
   - Headline: *"Your Inbox Needs a System, Not Just Folders."*
   - Supporting text: *"Get your free copy of The 10-Minute Inbox Reset and discover five practical ways to manage emails, stay on top of customer conversations, and never lose track of important follow-ups."*
   - CTA button: *"Get My Free Guide"* (smoothly scrolls to the lead capture form).
2. **Benefits Section (Reflecting the 5-Step System):**
   - 1. Set up a simple four-folder inbox system (**Action**, **Waiting**, **Read Later**, **Done**).
   - 2. Use three ready-to-adapt email reply templates.
   - 3. Keep track of important customer follow-ups.
   - 4. Build an email routine that works for your business.
3. **Guide Introduction:**
   - Features *The 10-Minute Inbox Reset* with a high-resolution mockup.
   - Accurately details the **5 Practical Steps**:
     - **Step 1:** Set Up the Four Core Folders (**Action**, **Waiting**, **Read Later**, **Done**).
     - **Step 2:** Do a Fast Daily Triage.
     - **Step 3:** Use Ready Reply Templates.
     - **Step 4:** Keep Track of Customer Follow-Ups.
     - **Step 5:** Establish a 10-Minute Daily Routine.
4. **Lead Capture Form (`#lead-form`):**
   - Visible fields for **Full Name**, **Email Address**, and **WhatsApp Number**.
   - Validates Nigerian formats (`080...`, `090...`, `+234...`) and international formats.
   - Submission loading state with animated spinner and duplicate prevention.
   - Truthful privacy notice.

### Thank-You Page (`/thank-you`)
- Headline: *"Thank You! Your Guide Is Ready."*
- Supporting message: *"Thank you for requesting The 10-Minute Inbox Reset. Your guide is ready to download. Check your email for a confirmation message as well."*
- **Truthful Email Confirmation Status:** Only displays email confirmation if the backend verifies email transmission; otherwise informs that direct download is active and email delivery awaits Google authorization.
- Prominent button: *"Download My Free Guide"* linking directly to the Google Drive file.
- Service invitation: *"Would you rather spend your time running your business than managing emails? I can help you organize your inbox, manage customer communication, and keep track of important follow-ups."*
- WhatsApp contact button: *"Chat With Me on WhatsApp"* ([wa.me/2349056320234](https://wa.me/2349056320234)).
- Christiana Odulum's contact details and working *"Back to Home"* button.

---

## 3. Google Apps Script Backend (`google-apps-script/Code.gs`)

### Functions:
1. `doPost(e)`:
   - Receives form submissions from the website.
   - Validates Full Name, Email, and WhatsApp number.
   - Connects to Google Sheet `1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o`.
   - Appends a new row: `[Full Name, Email Address, WhatsApp Number, Date and Time of Submission]`.
   - Sends notification email to `christianaodulum@gmail.com` via `MailApp.sendEmail()`.
   - Sends confirmation email with guide link to visitor via `MailApp.sendEmail()`.
   - Returns JSON status: `{ status: "success", sheetSaved: true, ownerEmailSent: boolean, visitorEmailSent: boolean }`.
2. `doGet(e)`:
   - Diagnostic health check endpoint returning spreadsheet connection status and tab details.

---

## 4. Manual Configuration Instructions

1. Open your Google Sheet `SmartPath Business Solutions – Lead Records` ([Spreadsheet ID: 1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o](https://docs.google.com/spreadsheets/d/1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o/edit)).
2. Click **Extensions** &rarr; **Apps Script**.
3. Replace existing code with the complete code from `google-apps-script/Code.gs`.
4. In the Apps Script toolbar, select `doGet` and click **Run** to authorize the required Sheets and Gmail (`MailApp`) permissions.
5. Click **Deploy** &rarr; **New deployment** &rarr; Select type: **Web app**.
   - Execute as: `Me (your email)`
   - Who has access: `Anyone`
6. Click **Deploy** and copy your **Web app URL**.
7. In your website or Netlify environment, set:
   ```env
   VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
   ```
   *(Or append `?apps_script_url=YOUR_DEPLOYMENT_URL` to your site URL once to permanently store it in browser).*

---

## 5. Testing Checklist (3 Required Test Leads)

| Test Profile | Full Name | Email Address | WhatsApp Number | Expected Behavior |
|---|---|---|---|---|
| **Test Lead 1** | Aisha Bello | aisha.bello@example.com | `0803 123 4567` | Appended to Sheet; Notification to owner; Confirmation email to visitor |
| **Test Lead 2** | David Chukwuma | david.c@example.org | `+234 901 234 5678` | Appended to Sheet; Notification to owner; Confirmation email to visitor |
| **Test Lead 3** | Sarah Jenkins | sarah.jenkins@businessmail.com | `+1 415 555 2671` | Appended to Sheet; Notification to owner; Confirmation email to visitor |

---

## 6. Deliverables Completion Checklist

| Requirement | Implementation Status | Notes |
|---|---|---|
| Four-folder system (**Action**, **Waiting**, **Read Later**, **Done**) | **Completed in code** | "Archive" and "Reference" removed completely |
| Accurately describes the 5 practical steps | **Completed in code** | All 5 steps detailed in Guide Introduction |
| Removed unsupported claims (e.g. "50+ incoming emails") | **Completed in code** | Exact copy aligned with actual guide |
| Clean public navigation & improved footer | **Completed in code** | Internal links and developer controls removed |
| Connected to Spreadsheet ID `1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o` | **Completed in code** | Set in `Code.gs` and `constants.ts` |
| Email notifications for owner and visitor | **Completed in code** | Implemented via `MailApp.sendEmail()` in `Code.gs` |
| Truthful email status tracking | **Completed in code** | Only confirms email if backend verifies delivery |
| Google Account manual authorization & Web App deployment | **Requires manual config** | Follow the 7-step guide in `google-apps-script/README.md` |
| 3-lead live testing in Google Sheets & inbox | **Requires live testing** | Ready for submission once Web App URL is connected |
