import { google } from 'googleapis';

export class CalendarManager {
  private calendar;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async createEventFromNote(noteId: string) {
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    // 노트에서 일정 정보 추출
    const eventDetails = extractEventDetails(note.content);

    // 구글 캘린더에 이벤트 생성
    await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: eventDetails.title,
        description: eventDetails.description,
        start: { dateTime: eventDetails.startTime },
        end: { dateTime: eventDetails.endTime },
      },
    });
  }
}
