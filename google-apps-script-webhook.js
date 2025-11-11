/**
 * Google Apps Script Web App for receiving TaTTTy data
 * 
 * 1. Create a new Google Apps Script project
 * 2. Paste this code
 * 3. Deploy as a web app
 * 4. Use the deployment URL as your endpoint
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get or create the spreadsheet
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your spreadsheet ID
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Prepare the row data based on what TaTTTy sends
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,
      data.user_id || '',
      data.session_id || '',
      data.prompt || '',
      data.style || '',
      data.placement || '',
      data.mood || '',
      data.size || '',
      data.generation_time || '',
      data.success || false,
      data.error_message || '',
      data.ip_address || '',
      data.user_agent || ''
    ];
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data logged successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'online',
      message: 'TaTTTy logging endpoint is active'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}