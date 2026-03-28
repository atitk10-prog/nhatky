/**
 * =============================================================
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Tạo Google Sheet mới trên Google Drive
 * 2. Mở Extensions → Apps Script
 * 3. Xóa hết code mặc định, paste toàn bộ code này vào
 * 4. Click "Deploy" → "New deployment"
 * 5. Chọn Type = "Web app"
 * 6. Execute as = "Me", Who has access = "Anyone"
 * 7. Click Deploy → Copy URL
 * 8. Paste URL vào file .env.local: VITE_GOOGLE_SCRIPT_URL=<URL>
 * =============================================================
 */

// Tên sheet lưu dữ liệu
const SHEET_NAME = "DuLieu";

// Các cột header
const HEADERS = [
  "Timestamp",
  "Họ và tên",
  "Lớp",
  "Năm học",
  "Tuần",
  "Cảm xúc",
  "Điều vui",
  "Điều suy nghĩ",
  "Điều muốn nói",
  "Mục tiêu cải thiện",
  "Hành động",
  "Làm tốt",
  "Cần cố gắng",
  "Khoảnh khắc đáng nhớ",
  "Lời nhắn cho bản thân"
];

/**
 * Xử lý GET request - Trả dữ liệu cho Dashboard
 */
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createJsonResponse({ success: true, data: [], headers: HEADERS });
    }
    
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return createJsonResponse({ success: true, data: rows, headers: headers });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.message });
  }
}

/**
 * Xử lý POST request - Nhận dữ liệu từ form học sinh
 */
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = JSON.parse(e.postData.contents);
    
    const row = [
      data.timestamp || new Date().toISOString(),
      data.fullName || "",
      data.className || "",
      data.schoolYear || "",
      data.week || "",
      data.emotion || "",
      data.happyThing || "",
      data.thinkingThing || "",
      data.neverSaidBefore || "",
      data.goalImprove || "",
      data.goalAction || "",
      data.didWell || "",
      data.needTry || "",
      data.memorableMoment || "",
      data.messageToSelf || ""
    ];
    
    sheet.appendRow(row);
    
    return createJsonResponse({ success: true, message: "Đã lưu thành công!" });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.message });
  }
}

/**
 * Lấy hoặc tạo sheet "DuLieu" với headers
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#2D5A27");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  
  return sheet;
}

/**
 * Tạo JSON response với CORS headers
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
