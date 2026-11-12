/**
 * SmartPath Business Solutions — Lead Records Google Apps Script Backend
 * 
 * Business Name: SmartPath Business Solutions
 * Spreadsheet Name: SmartPath Business Solutions – Lead Records
 * Spreadsheet ID: 1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o
 * Business Owner Email: christianaodulum@gmail.com
 * WhatsApp Support: +234 905 632 0234 (https://wa.me/2349056320234)
 * Guide Download URL: https://drive.google.com/uc?export=download&id=1Gvz3shmI0J5hnXJ5RIpFMekfzY8sryCB
 * 
 * Column Headings (Row 1):
 * Column A: Full Name
 * Column B: Email Address
 * Column C: Date and Time of Submission
 */

// ============================================================================
// 1. CONFIGURATION SETTINGS
// ============================================================================

var SPREADSHEET_ID = "1RTtKcxMXptBk0goGAxRtqIhAcfKeVs6MYzm8sNpBx8o";
var SHEET_TAB_NAME = ""; // Empty string automatically uses the first active tab
var OWNER_EMAIL = "christianaodulum@gmail.com";
var SENDER_NAME = "Christiana Odulum | SmartPath Business Solutions";
var GUIDE_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1Gvz3shmI0J5hnXJ5RIpFMekfzY8sryCB";
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
    // 1. Parse submitted data
    var data = parseRequestData(e);
    
    var fullName = (data.fullName || data.name || "").toString().trim();
    var email = (data.email || "").toString().trim().toLowerCase();

    // 2. Validate input fields (Full Name and Email Address ONLY)
    var validationError = validateLeadData(fullName, email);
    if (validationError) {
      return createJsonResponse({
        status: "error",
        sheetSaved: false,
        ownerEmailSent: false,
        visitorEmailSent: false,
        message: validationError
      }, 400);
    }

    // 3. Connect to the Google Spreadsheet
    var sheet = getTargetSheet();
    if (!sheet) {
      throw new Error("Unable to locate spreadsheet or tab. Verify Spreadsheet ID: " + SPREADSHEET_ID);
    }

    // 4. Ensure WhatsApp column is completely removed and 3 clean columns exist
    cleanAndAlignSheetColumns(sheet);

    // 5. Generate formatted submission timestamp
    var now = new Date();
    var formattedDateTime = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT+1", "yyyy-MM-dd HH:mm:ss");

    // 6. Append new lead strictly into 3 columns:
    // Column A: Full Name, Column B: Email Address, Column C: Date and Time of Submission
    sheet.appendRow([
      fullName,
      email,
      formattedDateTime
    ]);

    var sheetSaved = true;
    var ownerEmailSent = false;
    var visitorEmailSent = false;
    var emailError = null;

    // 7. Send notification email to Business Owner (Christiana Odulum)
    // Contains ONLY Full Name, Email Address, and Date & Time of Submission
    try {
      sendOwnerNotificationEmail(fullName, email, formattedDateTime);
      ownerEmailSent = true;
    } catch (ownerErr) {
      Logger.log("Owner notification email failed: " + ownerErr.toString());
      emailError = "Owner email error: " + ownerErr.toString();
    }

    // 8. Send confirmation email containing guide download link to visitor
    // Preserved exactly with business WhatsApp contact details & guide download link
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

    // 9. Return clean success response
    return createJsonResponse({
      status: "success",
      sheetSaved: sheetSaved,
      ownerEmailSent: ownerEmailSent,
      visitorEmailSent: visitorEmailSent,
      emailError: emailError,
      message: sheetSaved && visitorEmailSent
        ? "Lead successfully saved and confirmation email sent."
        : "Lead successfully saved in Google Sheet.",
      data: {
        fullName: fullName,
        email: email,
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
// 3. GET REQUEST HANDLER (Health Check, Diagnostics & Sheet Maintenance)
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
    cleanAndAlignSheetColumns(sheet); // Automatically cleans columns when accessed
    diag.spreadsheetConnected = true;
    diag.activeTabName = sheet.getName();
    diag.totalRows = sheet.getLastRow();
    diag.columns = ["Full Name", "Email Address", "Date and Time of Submission"];
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

function validateLeadData(name, email) {
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
  
  return null;
}

// ============================================================================
// 5. SPREADSHEET CONNECTION & CLEAN 3-COLUMN ALIGNMENT
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

  if (SHEET_TAB_NAME && SHEET_TAB_NAME.trim() !== "") {
    var specificSheet = spreadsheet.getSheetByName(SHEET_TAB_NAME.trim());
    if (specificSheet) {
      return specificSheet;
    }
  }

  var defaultSheet = spreadsheet.getActiveSheet();
  if (!defaultSheet) {
    defaultSheet = spreadsheet.getSheets()[0];
  }
  
  return defaultSheet;
}

/**
 * Removes the WhatsApp column completely and enforces the clean 3-column structure:
 * Column A: Full Name
 * Column B: Email Address
 * Column C: Date and Time of Submission
 * Preserves all existing lead rows and their historical name, email, and timestamp data.
 */
function cleanAndAlignSheetColumns(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Full Name", "Email Address", "Date and Time of Submission"]);
    formatHeaders(sheet);
    return;
  }

  var lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    // Traverse backwards so deleting a column doesn't shift upcoming indices
    for (var c = headers.length - 1; c >= 0; c--) {
      var headerText = (headers[c] || "").toString().toLowerCase();
      if (headerText.indexOf("whatsapp") !== -1 || headerText.indexOf("phone") !== -1) {
        sheet.deleteColumn(c + 1);
      }
    }
  }

  // Ensure Row 1 has the exact 3 column headings
  sheet.getRange(1, 1).setValue("Full Name");
  sheet.getRange(1, 2).setValue("Email Address");
  sheet.getRange(1, 3).setValue("Date and Time of Submission");
  formatHeaders(sheet);
}

function formatHeaders(sheet) {
  var headerRange = sheet.getRange(1, 1, 1, 3);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#085C52");
  headerRange.setFontColor("#FFFFFF");
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 240); // Full Name
  sheet.setColumnWidth(2, 280); // Email Address
  sheet.setColumnWidth(3, 220); // Date and Time
}

/**
 * Standalone runner function: Execute directly in the Apps Script editor
 * to immediately clean the spreadsheet columns without needing a form submission.
 */
function cleanSpreadsheetNow() {
  var sheet = getTargetSheet();
  cleanAndAlignSheetColumns(sheet);
  Logger.log("Spreadsheet cleaned successfully! Current columns: Full Name, Email Address, Date and Time of Submission.");
}

// ============================================================================
// 6. EMAIL DELIVERY
// ============================================================================

/**
 * Sends notification email to Business Owner (Christiana Odulum).
 * Contains ONLY:
 * 1. Full Name
 * 2. Email Address
 * 3. Submission Date & Time
 * (All WhatsApp rows, numbers, links, and buttons have been completely removed)
 */
function sendOwnerNotificationEmail(fullName, email, timestamp) {
  var subject = "New Lead: " + fullName + " requested The 10-Minute Inbox Reset";

  var htmlBody = "" +
    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b;'>" +
      "<div style='background-color: #085C52; color: #ffffff; padding: 18px 24px; border-radius: 6px; margin-bottom: 20px;'>" +
        "<h2 style='margin: 0; font-size: 20px;'>SmartPath Business Solutions</h2>" +
        "<p style='margin: 4px 0 0 0; font-size: 13px; color: #E5C583;'>New Lead Notification</p>" +
      "</div>" +
      "<p style='font-size: 15px; line-height: 1.5;'>Hello <strong>Christiana</strong>,</p>" +
      "<p style='font-size: 14px; line-height: 1.5;'>A new visitor has submitted their details to receive <strong>The 10-Minute Inbox Reset</strong>:</p>" +
      "<table style='width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;'>" +
        "<tr style='background-color: #f8fafc;'><td style='padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0; width: 35%;'>Full Name:</td><td style='padding: 10px; border-bottom: 1px solid #e2e8f0;'>" + fullName + "</td></tr>" +
        "<tr><td style='padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;'>Email Address:</td><td style='padding: 10px; border-bottom: 1px solid #e2e8f0;'><a href='mailto:" + email + "' style='color: #085C52; text-decoration: none; font-weight: bold;'>" + email + "</a></td></tr>" +
        "<tr style='background-color: #f8fafc;'><td style='padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;'>Submission Date & Time:</td><td style='padding: 10px; border-bottom: 1px solid #e2e8f0;'>" + timestamp + "</td></tr>" +
      "</table>" +
      "<p style='margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 14px;'>Lead stored in Google Sheet: SmartPath Business Solutions – Lead Records</p>" +
    "</div>";

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
}

/**
 * Sends confirmation email to visitor.
 * PRESERVED EXACTLY: Includes direct guide download link and Christiana's WhatsApp contact details.
 */
function sendVisitorConfirmationEmail(fullName, email) {
  var firstName = fullName.split(" ")[0] || fullName;
  var subject = "Your Free Guide: The 10-Minute Inbox Reset | SmartPath Business Solutions";
  
  var htmlBody = "" +
    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b;'>" +
      "<div style='background-color: #085C52; color: #ffffff; padding: 20px 24px; border-radius: 6px; margin-bottom: 24px;'>" +
        "<h2 style='margin: 0; font-size: 22px;'>SmartPath Business Solutions</h2>" +
        "<p style='margin: 4px 0 0 0; font-size: 13px; color: #E5C583;'>Practical Business Support. Better Organization.</p>" +
      "</div>" +
      "<h3 style='color: #0F172A; font-size: 18px; margin-top: 0;'>Hello " + firstName + ",</h3>" +
      "<p style='font-size: 15px; line-height: 1.6;'>Thank you for requesting <strong>The 10-Minute Inbox Reset</strong>. Your free copy is ready to download right now.</p>" +
      "<div style='text-align: center; margin: 30px 0;'>" +
        "<a href='" + GUIDE_DOWNLOAD_URL + "' style='background-color: #085C52; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;'>Download The 10-Minute Inbox Reset</a>" +
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
