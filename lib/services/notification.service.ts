interface TicketNotificationData {
  name: string;
  email: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_place: string;
  reminder_type: 'rsvp' | 'reminder';
}

interface EventData {
  title: string;
  startDateTime: Date;
  location: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export class NotificationService {
  private static readonly AI_WEBHOOK_URL = 'https://karanja-kariuki.app.n8n.cloud/webhook/90d9afd1-e9e1-4f79-ae14-aa3cde1d1247';
  private static readonly ACCESS_PASS = process.env.KK_ACCESS_PASS;

  /**
   * Send ticket notification to AI service
   */
  static async sendTicketNotification(
    userData: UserData,
    eventData: EventData,
    reminderType: 'rsvp' | 'reminder'
  ): Promise<boolean> {
    try {
      const notificationData: TicketNotificationData = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        event_title: eventData.title,
        event_date: this.formatDate(eventData.startDateTime),
        event_time: this.formatTime(eventData.startDateTime),
        event_place: eventData.location,
        reminder_type: reminderType
      };

      console.log('Sending ticket notification:', notificationData);

      const response = await fetch(this.AI_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'KK_ACCESS_PASS': this.ACCESS_PASS || ''
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        throw new Error(`AI webhook failed: ${response.status} ${response.statusText}`);
      }

      console.log('Ticket notification sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send ticket notification:', error);
      return false;
    }
  }

  /**
   * Send RSVP notification immediately after ticket claim
   */
  static async sendRSVPNotification(
    userData: UserData,
    eventData: EventData
  ): Promise<boolean> {
    return this.sendTicketNotification(userData, eventData, 'rsvp');
  }

  /**
   * Send reminder notification day before event
   */
  static async sendReminderNotification(
    userData: UserData,
    eventData: EventData
  ): Promise<boolean> {
    return this.sendTicketNotification(userData, eventData, 'reminder');
  }

  /**
   * Format date as YYYY-MM-DD
   */
  private static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Format time as HH:MM AM/PM
   */
  private static formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Check if an event is tomorrow (for reminder notifications)
   */
  static isEventTomorrow(eventDate: Date): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const eventDateOnly = new Date(eventDate);
    eventDateOnly.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    
    return eventDateOnly.getTime() === tomorrow.getTime();
  }
}
