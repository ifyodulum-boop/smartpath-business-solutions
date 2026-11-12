/**
 * SmartPath Business Solutions — Lead Records Google Apps Script Backend
 * 
 * Business Name: SmartPath Business Solutions
 * Spreadsheet Name: SmartPath Business Solutions – Lead Records
 * Spreadsheet ID: 1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o
 * Business Owner Email: christianaodulum@gmail.com
 * WhatsApp: +234 905 632 0234 (https://wa.me/2349056320234)
 * Guide Download URL: https://drive.google.com/uc?export=download&id=1Gvz3shmI0J5hnXJ5RIpFMekfzY8sryCB
 * 
 * Column Headings (Row 1):
 * [Full Name, Email Address, WhatsApp Number, Date and Time of Submission]
 */

// ============================================================================
// 1. CONFIGURATION SETTINGS
// ============================================================================

// The exact Spreadsheet ID for "SmartPath Business Solutions – Lead Records"
var SPREADSHEET_ID = "1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o";

// TAB NAME CONFIGURATION:
// If your tab has a specific name (e.g. "Sheet1", "Leads", or "Responses"),
// you can write it here between quotes.
// IF LEFT EMPTY (""), THE SCRIPT AUTOMATICALLY USES THE FIRST ACTIVE TAB IN YOUR SHEET!
var SHEET_TAB_NAME = ""; 

// Business Owner Email for notifications
var OWNER_EMAIL = "christianaodulum@gmail.com";

// Sender Name displayed on outgoing emails
var SENDER_NAME = "Christiana Odulum | SmartPath Business Solutions";

// Official Guide Download Link
var GUIDE_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1Gvz3shmI0J5hnXJ5RIpFMekfzY8sryCB";

// WhatsApp Link
var WHATSAPP_CONTACT_URL = "https://wa.me/2349056320234";

// ============================================================================
// 2. MAIN POST REQUEST HANDLER (Receives Form Submissions)
// ============================================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  
  // Wait up to 30 seconds for concurrent requests to prevent race conditions
  try {
    lock.waitLock(30000);
  } catch (lockError) {
    return createJsonResponse({
      status: "error",
      sheetSaved: false,
      ownerEmailSent: false,
      visitorEmailSent: false,
      message: "Server is busy processing submissions. Please try again in a few moments."
    }, 429);
  }

  try {
    // 1. Parse submitted data (supports JSON text/plain payload or URL-encoded form)
    var data = parseRequestData(e);
    
    var fullName = (data.fullName || data.name || "").toString().trim();
    var email = (data.email || "").toString().trim().toLowerCase();
    var whatsappNumber = (data.whatsappNumber || data.phone || data.whatsapp || "").toString().trim();

    // 2. Validate input fields
    var validationError = validateLeadData(fullName, email, whatsappNumber);
    if (validationError) {
      return createJsonResponse({
        status: "error",
        sheetSaved: false,
        ownerEmailSent: false,
        visitorEmailSent: false,
        message: validationError
      }, 400);
    }

    // 3. Connect to the Google Spreadsheet using the exact ID
    var sheet = getTargetSheet();
    if (!sheet) {
      throw new Error("Unable to locate spreadsheet or tab. Verify Spreadsheet ID: " + SPREADSHEET_ID);
    }

    // 4. Ensure column headings exist in Row 1 without altering existing data
    ensureColumnHeaders(sheet);

    // 5. Generate formatted date and time of submission
    var now = new Date();
    var formattedDateTime = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT+1", "yyyy-MM-dd HH:mm:ss");

    // 6. Save new row preserving all existing rows
    // Columns: [Full Name, Email Address, WhatsApp Number, Date and Time of Submission]
    sheet.appendRow([
      fullName,
      email,
      whatsappNumber,
      formattedDateTime
    ]);

    var sheetSaved = true;
    var ownerEmailSent = false;
    var visitorEmailSent = false;
    var emailError = null;

    // 7. Send notification email to Business Owner (Christiana Odulum)
    try {
      sendOwnerNotificationEmail(fullName, email, whatsappNumber, formattedDateTime);
      ownerEmailSent = true;
    } catch (ownerErr) {
      Logger.log("Owner notification email failed: " + ownerErr.toString());
      emailError = "Owner email error: " + ownerErr.toString();
    }

    // 8. Send confirmation email containing guide download link to visitor
    try {
      sendVisitorConfirmationEmail(fullName, email);
      visitorEmailSent = true;
    } catch (visitorErr) {
      Logger.log("Visitor confirmation email failed: " + visitorErr.toString());
      if (emailError) {
        emailError += " | Visitor email error: " + visitorErr.toString();
      } else {
        emailError = "Visitor email error: " + visitorErr.toString();
      }
    }

    // 9. Return accurate status response
    return createJsonResponse({
      status: "success",
      sheetSaved: sheetSaved,
      ownerEmailSent: ownerEmailSent,
      visitorEmailSent: visitorEmailSent,
      emailError: emailError,
      message: sheetSaved && visitorEmailSent
        ? "Lead successfully saved and confirmation email sent."
        : "Lead successfully saved in Google Sheet (email notification status reported).",
      data: {
        fullName: fullName,
        email: email,
        whatsappNumber: whatsappNumber,
        submittedAt: formattedDateTime
      }
    }, 200);

  } catch (error) {
    Logger.log("Fatal error in doPost: " + error.toString());
    return createJsonResponse({
      status: "error",
      sheetSaved: false,
      ownerEmailSent: false,
      visitorEmailSent: false,
      message: "Submission failed: " + error.toString()
    }, 500);
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// 3. GET REQUEST HANDLER (Health Check & Diagnostics)
// ============================================================================

function doGet(e) {
  var diag = {
    status: "active",
    service: "SmartPath Business Solutions Lead Capture API",
    spreadsheetId: SPREADSHEET_ID,
    ownerEmail: OWNER_EMAIL,
    guideTitle: "The 10-Minute Inbox Reset",
    timestamp: new Date().toISOString()
  };

  try {
    var sheet = getTargetSheet();
    diag.spreadsheetConnected = true;
    diag.activeTabName = sheet.getName();
    diag.totalRows = sheet.getLastRow();
  } catch (err) {
    diag.spreadsheetConnected = false;
    diag.spreadsheetError = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(diag, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 4. PARSING & VALIDATION
// ============================================================================

function parseRequestData(e) {
  if (!e) return {};
  
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      if (e.parameter && Object.keys(e.parameter).length > 0) {
        return e.parameter;
      }
    }
  }
  
  if (e.parameter) {
    return e.parameter;
  }
  
  return {};
}

function validateLeadData(name, email, phone) {
  if (!name || name.length < 2) {
    return "Please provide your full name (minimum 2 characters).";
  }
  
  if (!email) {
    return "Please provide a valid email address.";
  }
  
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "The email address provided is not in a valid format.";
  }
  
  var digitsOnly = phone ? phone.replace(/\D/g, "") : "";
  if (!phone || digitsOnly.length < 8) {
    return "Please provide a valid WhatsApp number (at least 8 digits).";
  }
  
  return null;
}

// ============================================================================
// 5. SPREADSHEET CONNECTION & HEADER INITIALIZATION
// ============================================================================

function getTargetSheet() {
  var spreadsheet;
  
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  } else {
    spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  }

  if (!spreadsheet) {
    throw new Error("Could not open spreadsheet with ID: " + SPREADSHEET_ID);
  }

  // If a specific tab name is configured, look for it
  if (SHEET_TAB_NAME && SHEET_TAB_NAME.trim() !== "") {
    var specificSheet = spreadsheet.getSheetByName(SHEET_TAB_NAME.trim());
    if (specificSheet) {
      return specificSheet;
    }
  }

  // Otherwise, automatically use the first/active sheet in the spreadsheet
  var defaultSheet = spreadsheet.getActiveSheet();
  if (!defaultSheet) {
    defaultSheet = spreadsheet.getSheets()[0];
  }
  
  return defaultSheet;
}

function ensureColumnHeaders(sheet) {
  // Only write headings if the sheet is completely empty
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Full Name",
      "Email Address",
      "WhatsApp Number",
      "Date and Time of Submission"
    ];
    sheet.appendRow(headers);
    
    // Style headings for clean presentation
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#0B192C");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
    
    sheet.setColumnWidth(1, 220); // Full Name
    sheet.setColumnWidth(2, 260); // Email Address
    sheet.setColumnWidth(3, 190); // WhatsApp Number
    sheet.setColumnWidth(4, 210); // Date and Time
  }
}

// ============================================================================
// 6. EMAIL DELIVERY
// ============================================================================

function sendOwnerNotificationEmail(fullName, email, whatsapp, timestamp) {
  var cleanPhone = whatsapp.replace(/\D/g, "");
  var waDirectLink = "https://wa.me/" + cleanPhone;
  var subject = "New Lead: " + fullName + " requested The 10-Minute Inbox Reset";
  
  var htmlBody = "" +
    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b;'>" +
      "<div style='background-color: #0B192C; color: #ffffff; padding: 18px 24px; border-radius: 6px; margin-bottom: 20px;'>" +
        "<h2 style='margin: 0; font-size: 20px;'>SmartPath Business Solutions</h2>" +
        "<p style='margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;'>New Lead Notification</p>" +
      "</div>" +
      "<p style='font-size: 15px; line-height: 1.5;'>Hello <strong>Christiana</strong>,</p>" +
      "<p style='font-size: 14px; line-height: 1.5;'>A new visitor has submitted their details on the SmartPath website:</p>" +
      "<table style='width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;'>" +
        "<tr style='background-color: #f8fafc;'><td style='padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0; width: 35%;'>Full Name:</td><td style='padding: 10px; border-bottom: 1px solid #e2e8f0;'>" + fullName + "</td></tr>" +
        "<tr><td style='padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;'>Email Address:</td><td style='padding: 10px; border-bottom: 1px solid #e2e8f0;'><a href='mailto:" + email + "' style='color: #0d9488; text-decoration: none;'>" + email + "</a></td></tr>" +
        "<tr style='background-color: #f8fafc;'><td style='padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;'>WhatsApp Number:</td><td style='padding: 10px; border-bottom: 1px solid #e2e8f0;'>" + whatsapp + "</td></tr>" +
        "<tr><td style='padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;'>Submission Date & Time:</td><td style='padding: 10px; border-bottom: 1px solid #e2e8f0;'>" + timestamp + "</td></tr>" +
      "</table>" +
      "<div style='margin-top: 24px; text-align: center;'>" +
        "<a href='" + waDirectLink + "' style='background-color: #25D366; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 14px;'>Open Lead in WhatsApp</a>" +
      "</div>" +
      "<p style='margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 14px;'>Lead stored in Google Sheet: SmartPath Business Solutions – Lead Records</p>" +
    "</div>";

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}

function sendVisitorConfirmationEmail(fullName, email) {
  var firstName = fullName.split(" ")[0] || fullName;
  var subject = "Your Free Guide: The 10-Minute Inbox Reset | SmartPath Business Solutions";
  
  var htmlBody = "" +
    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b;'>" +
      "<div style='background-color: #0B192C; color: #ffffff; padding: 20px 24px; border-radius: 6px; margin-bottom: 24px;'>" +
        "<h2 style='margin: 0; font-size: 22px;'>SmartPath Business Solutions</h2>" +
        "<p style='margin: 4px 0 0 0; font-size: 13px; color: #5eead4;'>Practical Business Support. Better Organization.</p>" +
      "</div>" +
      "<h3 style='color: #0F172A; font-size: 18px; margin-top: 0;'>Hello " + firstName + ",</h3>" +
      "<p style='font-size: 15px; line-height: 1.6;'>Thank you for requesting <strong>The 10-Minute Inbox Reset</strong>. Your free copy is ready to download right now.</p>" +
      "<div style='text-align: center; margin: 30px 0;'>" +
        "<a href='" + GUIDE_DOWNLOAD_URL + "' style='background-color: #0D9488; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;'>Download The 10-Minute Inbox Reset</a>" +
      "</div>" +
      "<div style='background-color: #f8fafc; border-left: 4px solid #0D9488; padding: 16px; margin: 24px 0; border-radius: 4px;'>" +
        "<h4 style='margin: 0 0 8px 0; font-size: 14px; color: #0f172a;'>Need Hands-On Support For Your Business?</h4>" +
        "<p style='margin: 0; font-size: 13.5px; line-height: 1.5; color: #475569;'>Would you rather spend your time running your business than managing emails? I can help you organize your inbox, manage customer communication, and keep track of important follow-ups.</p>" +
        "<div style='margin-top: 14px;'>" +
          "<a href='" + WHATSAPP_CONTACT_URL + "' style='color: #0d9488; font-weight: bold; text-decoration: none; font-size: 13.5px;'>Chat With Me on WhatsApp &rarr;</a>" +
        "</div>" +
      "</div>" +
      "<p style='font-size: 14px; line-height: 1.5; margin-bottom: 4px;'>Warm regards,</p>" +
      "<p style='font-size: 15px; font-weight: bold; margin: 0; color: #0B192C;'>Christiana Odulum</p>" +
      "<p style='font-size: 13px; color: #64748b; margin: 2px 0 0 0;'>Virtual Assistant | Business Support & AI Automation<br>SmartPath Business Solutions</p>" +
      "<div style='margin-top: 24px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;'>" +
        "WhatsApp: +234 905 632 0234 · Email: christianaodulum@gmail.com" +
      "</div>" +
    "</div>";

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody
  });
}

// ============================================================================
// 7. JSON OUTPUT HELPER
// ============================================================================

function createJsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
