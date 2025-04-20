import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { GOOGLE_SHEET } from "../config/env";

interface SheetRow {
  [key: string]: any;
}

class GoogleSheetManager {
  private sheets: any;
  private auth: JWT;
  private static Instance: GoogleSheetManager;

  constructor() {
    this.auth = new google.auth.JWT({
      email: GOOGLE_SHEET.CLIENT_EMAIL,
      key: GOOGLE_SHEET.PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth: this.auth });
  }

  public static getInstance(): GoogleSheetManager {
    if (!this.Instance) {
      this.Instance = new GoogleSheetManager();
    }
    return this.Instance;
  }

  async addRow(spreadsheetId: string, sheetName: string, rowData: SheetRow) {
    const values = [Object.values(rowData)];
    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });
  }

  async deleteRow(spreadsheetId: string, sheetName: string, rowNumber: number) {
    const sheetId = await this.getSheetId(spreadsheetId, sheetName);
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNumber - 1,
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });
  }

  async updateRow(
    spreadsheetId: string,
    sheetName: string,
    rowNumber: number,
    newData: SheetRow
  ) {
    const values = [Object.values(newData)];
    const range = `${sheetName}!A${rowNumber}`;
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values },
    });
  }

  async createNewSheet(sheetTitle: string): Promise<string> {
    const response = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: sheetTitle,
        },
      },
    });
    return response.data.spreadsheetId!;
  }

  private async getSheetId(
    spreadsheetId: string,
    sheetName: string
  ): Promise<number> {
    const res = await this.sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheet = res.data.sheets?.find(
      (s: any) => s.properties.title === sheetName
    );

    if (!sheet) throw new Error("Sheet not found");

    return sheet.properties.sheetId;
  }
}

export const googleSheetInstance = GoogleSheetManager.getInstance();
