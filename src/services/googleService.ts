/**
 * Service for interacting with Google APIs (Gmail, Calendar, Drive)
 * using the access token obtained during login.
 */

export class GoogleService {
  private static getAccessToken(): string | null {
    return localStorage.getItem('beatrice_google_access_token');
  }

  private static async fetchGoogle(url: string, options: RequestInit = {}) {
    const token = this.getAccessToken();
    if (!token) throw new Error("No Google access token found. Please sign in with Google.");

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      // Token likely expired
      localStorage.removeItem('beatrice_google_access_token');
      throw new Error("Authentication expired. Please sign in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error?.message || response.statusText;
      
      if (message.includes("is disabled") || message.includes("not been used")) {
        if (url.includes("gmail.googleapis.com")) throw new Error("GMAIL_API_DISABLED");
        if (url.includes("calendar-json.googleapis.com") || url.includes("calendar.googleapis.com")) throw new Error("CALENDAR_API_DISABLED");
        if (url.includes("drive.googleapis.com")) throw new Error("DRIVE_API_DISABLED");
        throw new Error("GOOGLE_API_DISABLED");
      }
      
      throw new Error(`Google API Error: ${response.status} ${message}`);
    }

    return response.json();
  }

  static async listEmails(maxResults: number = 5, query: string = '') {
    const qParam = query ? `&q=${encodeURIComponent(query)}` : '';
    const data = await this.fetchGoogle(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}${qParam}`);
    if (!data.messages) return [];

    const details = await Promise.all(
      data.messages.map((m: any) => 
        this.fetchGoogle(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=full`)
      )
    );

    return details.map((m: any) => {
      const headers = m.payload.headers;
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
      const snippet = m.snippet;
      
      // Attempt to extract body
      let body = '';
      if (m.payload.parts) {
        const textPart = m.payload.parts.find((p: any) => p.mimeType === 'text/plain');
        if (textPart && textPart.body.data) {
          body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (m.payload.parts[0]?.body?.data) {
          body = atob(m.payload.parts[0].body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }
      } else if (m.payload.body.data) {
        body = atob(m.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }

      return { id: m.id, subject, from, snippet, body: body || snippet };
    });
  }

  static async listEvents(maxResults: number = 5) {
    const now = new Date().toISOString();
    const data = await this.fetchGoogle(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=${maxResults}&orderBy=startTime&singleEvents=true`);
    return data.items || [];
  }

  static async listFiles(maxResults: number = 5) {
    const data = await this.fetchGoogle(`https://www.googleapis.com/drive/v3/files?pageSize=${maxResults}&fields=files(id, name, mimeType, webViewLink)`);
    return data.files || [];
  }

  static async getDocument(fileId: string) {
    // Attempt to get text content if it's a google doc
    return this.fetchGoogle(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`);
  }
}
