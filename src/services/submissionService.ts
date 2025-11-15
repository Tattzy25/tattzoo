/**
 * Session Data Store - Temporary holding area for all generator inputs
 * Data accumulates here and only sends to backend when "TAP TO CREATE" is clicked
 */

export interface QuestionAnswer {
  prompt: string; // The question text shown to user
  answer: string; // The user's response
}

export interface SessionData {
  // Source Card (Q1 & Q2) - TaTTTy AI generator
  sourceCard?: {
    question1?: QuestionAnswer;
    question2?: QuestionAnswer;
    images?: File[]; // Actual File objects, NOT base64
  };
  
  // Shared options across all generators
  options?: {
    mood?: string;
    style?: string;
    placement?: string;
    size?: string;
    color?: string;
    aspectRatio?: string; // e.g., '1:1', '16:9', '9:16'
    model?: 'sd3.5-large' | 'sd3-turbo'; // Stability AI model
  };
  
  // Metadata
  userId?: string;
  sessionId: string;
  timestamp: number;
}

class SessionDataStore {
  private currentSession: SessionData | null = null;

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize or get current session
   */
  private getSession(userId?: string): SessionData {
    if (!this.currentSession) {
      this.currentSession = {
        sessionId: this.generateSessionId(),
        timestamp: Date.now(),
        userId,
      };
    }
    return this.currentSession;
  }

  /**
   * Store Source Card data (Q1 & Q2 + optional images)
   * Now includes both question prompts AND user answers for better AI context
   */
  setSourceCardData(data: { 
    question1?: QuestionAnswer; 
    question2?: QuestionAnswer; 
    images?: File[] 
  }, userId?: string): void {
    const session = this.getSession(userId);
    session.sourceCard = { ...session.sourceCard, ...data };
    console.log('📝 Source card data stored in session:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (data.question1) {
      console.log('Question 1 Prompt:', data.question1.prompt);
      console.log('Question 1 Answer:', data.question1.answer);
    } else {
      console.log('Question 1: Not provided');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (data.question2) {
      console.log('Question 2 Prompt:', data.question2.prompt);
      console.log('Question 2 Answer:', data.question2.answer);
    } else {
      console.log('Question 2: Not provided');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Images uploaded:', data.images?.length || 0);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }



  /**
   * Store shared options (mood, style, placement, size, color)
   */
  setOptions(options: Partial<SessionData['options']>, userId?: string): void {
    const session = this.getSession(userId);
    session.options = { ...session.options, ...options };
    console.log('⚙️ Options stored in session', options);
  }

  /**
   * Get current session data (for preview/debugging)
   */
  getCurrentSession(): SessionData | null {
    return this.currentSession;
  }

  /**
   * Get source card data
   */
  getSourceCardData(): SessionData['sourceCard'] | undefined {
    return this.currentSession?.sourceCard;
  }



  /**
   * Get session data for generation (NO BACKEND CALLS)
   * Returns current session data for local processing only
   */
  async submitToBackend(): Promise<SessionData> {
    if (!this.currentSession) {
      throw new Error('No session data to submit');
    }

    console.log('📦 COMPLETE SESSION DATA:', {
      sourceCard: this.currentSession.sourceCard,
      options: this.currentSession.options,
      metadata: {
        sessionId: this.currentSession.sessionId,
        timestamp: this.currentSession.timestamp,
        userId: this.currentSession.userId
      }
    });
    
    // Store in localStorage as backup
    this.storeInLocalBackup();
    
    // Return session data for local mock generation
    return this.currentSession;
  }

  /**
   * Backup storage if backend fails
   */
  private storeInLocalBackup(): void {
    if (!this.currentSession) return;
    
    try {
      const backupKey = `tattty_backup_${this.currentSession.sessionId}`;
      localStorage.setItem(backupKey, JSON.stringify(this.currentSession));
      console.log('📦 Session data stored in local backup');
    } catch (error) {
      console.error('Failed to store backup:', error);
    }
  }

  /**
   * Clear current session (called after successful generation or session end)
   */
  clearSession(): void {
    this.currentSession = null;
    console.log('🧹 Session cleared');
  }

  /**
   * Check if session has data
   */
  hasData(): boolean {
    return this.currentSession !== null;
  }
}

// Export singleton instance
export const sessionDataStore = new SessionDataStore();
