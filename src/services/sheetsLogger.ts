/**
 * Simple service to send data to Google Sheets
 * Only SENDS data, doesn't READ from sheets
 */

interface LogData {
  event_type: string;
  user_id?: string;
  session_id?: string;
  data: Record<string, any>;
  timestamp?: string;
}

class SheetsLogger {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * Send data to Google Sheets when you RECEIVE user actions
   */
  async log(eventType: string, data: Record<string, any>, userId?: string): Promise<boolean> {
    try {
      const logData: LogData = {
        event_type: eventType,
        user_id: userId || 'anonymous',
        session_id: this.getSessionId(),
        data: data,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Successfully logged to sheets:', result);
      return true;

    } catch (error) {
      console.error('Failed to log to sheets:', error);
      return false;
    }
  }

  /**
   * Log tattoo generation when you RECEIVE generation request
   */
  async logTattooGeneration(data: {
    prompt: string;
    style: string;
    placement: string;
    mood: string;
    size: string;
    success: boolean;
    generation_time?: number;
    error?: string;
  }, userId?: string): Promise<boolean> {
    return this.log('tattoo_generation', data, userId);
  }

  /**
   * Log user feedback when you RECEIVE feedback form
   */
  async logUserFeedback(data: {
    rating: number;
    message: string;
    page: string;
    feature: string;
  }, userId?: string): Promise<boolean> {
    return this.log('user_feedback', data, userId);
  }

  /**
   * Log user interactions when you RECEIVE button clicks, etc.
   */
  async logUserAction(action: string, details: Record<string, any>, userId?: string): Promise<boolean> {
    return this.log('user_action', { action, ...details }, userId);
  }

  /**
   * Log errors when you RECEIVE error reports
   */
  async logError(error: {
    message: string;
    stack?: string;
    page: string;
    user_agent: string;
  }, userId?: string): Promise<boolean> {
    return this.log('error', error, userId);
  }

  private getSessionId(): string {
    // Simple session ID generation
    return sessionStorage.getItem('session_id') || 
           (() => {
             const id = Math.random().toString(36).substr(2, 9);
             sessionStorage.setItem('session_id', id);
             return id;
           })();
  }
}

// Export singleton instance
export const sheetsLogger = new SheetsLogger(
  process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL || 
  'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
);

// Usage examples:
/*
// When you RECEIVE a tattoo generation request:
sheetsLogger.logTattooGeneration({
  prompt: "Dragon tattoo on shoulder",
  style: "Traditional",
  placement: "Shoulder", 
  mood: "Bold",
  size: "Medium",
  success: true,
  generation_time: 3500
});

// When you RECEIVE user feedback:
sheetsLogger.logUserFeedback({
  rating: 5,
  message: "Love the designs!",
  page: "generator",
  feature: "ai_generation"
});

// When you RECEIVE button clicks:
sheetsLogger.logUserAction('button_click', {
  button: 'generate_tattoo',
  page: 'generator'
});

// When you RECEIVE errors:
sheetsLogger.logError({
  message: "API timeout",
  page: "generator",
  user_agent: navigator.userAgent
});
*/