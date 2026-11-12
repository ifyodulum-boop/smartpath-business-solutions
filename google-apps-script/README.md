# SmartPath Business Solutions — Google Sheets & Email Automation Setup

This guide provides complete, step-by-step instructions to connect your **SmartPath Business Solutions** lead generation website directly to your existing Google Sheet and activate automated email delivery.

---

## 1. Your Existing Google Sheet Details

- **Spreadsheet Name:** `SmartPath Business Solutions – Lead Records`
- **Spreadsheet ID:** `1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o`
- **Expected Column Headings (Row 1):**
  - **Column A:** `Full Name`
  - **Column B:** `Email Address`
  - **Column C:** `WhatsApp Number`
  - **Column D:** `Date and Time of Submission`

---

## 2. Step-by-Step Google Apps Script Setup

### Step 1: Open Google Apps Script
There are two ways to open Google Apps Script:
- **Recommended (Directly from your Sheet):**
  1. Open your Google Sheet: `SmartPath Business Solutions – Lead Records`.
  2. In the top Google Sheets menu bar, click **Extensions** &rarr; **Apps Script**.
  3. A new browser tab will open titled *Untitled project*.
- **Alternative (via script.google.com):**
  1. Navigate to [script.google.com](https://script.google.com).
  2. Click **New project** (top-left).

### Step 2: Name Your Project
Click on **Untitled project** in the top left and rename it to:
`SmartPath Business Solutions – Lead Webhook`

### Step 3: Insert the Complete Backend Code
1. In the Apps Script code editor, delete any default placeholder code (e.g., `function myFunction() {}`).
2. Open `google-apps-script/Code.gs` in this project repository.
3. Copy the entire file contents and paste them into the Apps Script editor.

### Step 4: Verify Spreadsheet ID and Tab Configuration
Notice lines 20–28 in `Code.gs`:
```javascript
// The exact Spreadsheet ID for "SmartPath Business Solutions – Lead Records"
var SPREADSHEET_ID = "1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o";

// TAB NAME CONFIGURATION:
// If your tab is named "Sheet1", "Leads", or something custom, you can put it here:
var SHEET_TAB_NAME = ""; 
```
> **Important Note on the Tab Name:**
> If you leave `SHEET_TAB_NAME = ""` empty, the script will automatically use the **first/active tab** in your spreadsheet. If your tab is specifically named `Sheet1` or `Leads`, you may optionally specify `var SHEET_TAB_NAME = "Sheet1";`.

### Step 5: Save the Project
Click the **Save** icon (disk icon) or press `Ctrl + S` (`Cmd + S` on Mac).

### Step 6: Authorize Permissions (Crucial for Email Delivery)
Before deploying, run a quick manual authorization test so Google grants permission to send emails and write to your sheet:
1. In the Apps Script toolbar above the code editor, find the function dropdown (it usually defaults to `doPost` or `doGet`).
2. Select **doGet** from the dropdown.
3. Click the **Run** button (play icon).
4. An **Authorization required** modal will pop up.
5. Click **Review permissions**.
6. Select your Google account (`christianaodulum@gmail.com` or your Google login).
7. You may see a screen saying *"Google hasn't verified this app"*:
   - Click **Advanced** (in small text at the bottom left).
   - Click **Go to SmartPath Business Solutions – Lead Webhook (unsafe)**.
8. Review the requested permissions:
   - *See, edit, create, and delete all your Google Sheets spreadsheets*
   - *Send email as you*
9. Click **Allow**.
10. The Execution log at the bottom will display `Execution completed`.

### Step 7: Deploy as a Web App
1. In the top right corner of the Apps Script window, click the blue **Deploy** button.
2. Select **New deployment**.
3. Next to *Select type*, click the gear icon and select **Web app**.
4. Configure the fields **EXACTLY** as follows:
   - **Description:** `SmartPath Lead Capture & Email Delivery v1`
   - **Execute as:** `Me (your email address)`
   - **Who has access:** `Anyone`  
     *(CRITICAL: You must choose "Anyone". If you select "Only myself", visitors will get a 403 Forbidden error and their form submissions will fail).*
5. Click **Deploy**.

### Step 8: Copy Your Deployed Web App URL
Google will present your **Web app URL**, which looks like:
```
https://script.google.com/macros/s/AKfycb.../exec
```
Click **Copy** to copy this URL.

### Step 9: Connect the URL to Your Website
You can connect your deployed URL in three simple ways:

1. **One-Time URL Parameter (Fastest):**
   Open your website in your browser and append `?apps_script_url=` followed by your deployed URL:
   ```
   https://YOUR_WEBSITE_URL/?apps_script_url=https://script.google.com/macros/s/AKfycb.../exec
   ```
   The site automatically detects the parameter and permanently saves it in your browser's local storage.

2. **Environment Variable in Netlify / Project:**
   In your hosting dashboard (Netlify/Vercel) or local `.env`:
   ```env
   VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"
   ```

3. **Browser Console:**
   Open the browser Developer Tools (F12) on your site and run:
   ```javascript
   localStorage.setItem('smartpath_apps_script_url', 'YOUR_COPIED_URL_HERE');
   ```

### Step 10: How to Redeploy When Making Changes
If you ever modify `Code.gs` in Google Apps Script, you MUST create a new deployment version:
1. Click **Deploy** &rarr; **Manage deployments**.
2. Click the pencil icon (Edit) on your active deployment.
3. Change **Version** from the current version to **New version**.
4. Click **Deploy**.
*(Note: If you do not select "New version", Google Apps Script will keep running the old code).*

---

## 3. Why Previous Email Delivery Failed & How It is Fixed

When you tested the form initially:
1. **No live Web App URL was configured on the site**, so the form was running in test/preview mode.
2. The thank-you page displayed *"Confirmation sent to: [email]"* unconditionally without checking whether an email was actually transmitted.

### The Solution Implemented:
- The backend `Code.gs` now explicitly executes `MailApp.sendEmail()` for both the owner notification and visitor confirmation, and returns a verified `visitorEmailSent: true` flag.
- The Thank-You page checks this status: it **only** confirms that an email has been delivered when the backend confirms `visitorEmailSent: true`.
- If emails fail (for instance, if Google authorization was skipped), the lead is safely saved in the spreadsheet, and the Thank-You page accurately informs the visitor that direct download is ready while email delivery awaits Google authorization.

---

## 4. Testing Checklist (3 Required Test Leads)

To verify the integration, submit three distinct test leads through the landing page form:

| Test Profile | Full Name | Email Address | WhatsApp Number | Expected Sheet Entry | Expected Emails |
|---|---|---|---|---|
| **Lead 1** | Aisha Bello | aisha.bello@example.com | `0803 123 4567` | Row 2: Aisha Bello, aisha.bello@example.com, 0803 123 4567, Date/Time | Owner notification + Visitor guide email |
| **Lead 2** | David Chukwuma | david.c@example.org | `+234 901 234 5678` | Row 3: David Chukwuma, david.c@example.org, +234 901 234 5678, Date/Time | Owner notification + Visitor guide email |
| **Lead 3** | Sarah Jenkins | sarah.jenkins@businessmail.com | `+1 415 555 2671` | Row 4: Sarah Jenkins, sarah.jenkins@businessmail.com, +1 415 555 2671, Date/Time | Owner notification + Visitor guide email |

### What to check after each test:
1. **Google Sheet:** Check `SmartPath Business Solutions – Lead Records` to verify that each lead is appended as a new row.
2. **Owner Inbox (`christianaodulum@gmail.com`):** Verify that the new lead notification email arrives with the lead's contact details and WhatsApp button.
3. **Visitor Inbox:** Verify that the confirmation email arrives with the subject *"Your Free Guide: The 10-Minute Inbox Reset | SmartPath Business Solutions"* and the working Google Drive download button.
4. **Thank-You Page:** Verify that the prominent *"Download My Free Guide"* button opens the guide and the WhatsApp button opens chat with `+234 905 632 0234`.
