import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { name, phone, transcript } = await req.json();

    const toSheets = process.env.LEAD_TO_SHEETS === 'true';
    if (toSheets) {
      const sa = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      const sheetId = process.env.GOOGLE_SHEET_ID;
      if (!sa || !sheetId) {
        return NextResponse.json({ ok: false, error: 'SHEETS_MISSING_ENV' }, { status: 500 });
      }
      const creds = JSON.parse(sa);

      const auth = new google.auth.JWT(
        creds.client_email,
        undefined,
        creds.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
      );
      const sheets = google.sheets({ version: 'v4', auth });
      const now = new Date().toISOString();
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Leads!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[now, name || '', phone || '', transcript || '']],
        },
      });
      return NextResponse.json({ ok: true });
    }

    // Fallback: send mailto instruction if email is set (no server email send in demo)
    const email = process.env.CONTACT_EMAIL;
    if (email) {
      console.log('Lead recibido. Enviar a:', email);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'UNKNOWN' }, { status: 500 });
  }
}
