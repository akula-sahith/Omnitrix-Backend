import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_CREDS,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function appendToSheet(team) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A:H",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          team.teamId,
          team.teamLeaderName,
          team.teamName,
          team.phoneNumber,
          team.email,
          team.college,
          team.teamSize,
          team.yearOfStudy
        ]],
      },
    });
    console.log("✅ Data appended to Google Sheet");
  } catch (err) {
    console.error("❌ Error appending to sheet:", err);
  }
}
