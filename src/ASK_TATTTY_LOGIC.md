# ASK TaTTTy IF/ELSE LOGIC
## State Management Flow

```typescript
// ============================================================================
// STATE DEFINITIONS
// ============================================================================

type AskTaTTTyState = 
  | 'idle'           // Initial state - "Ask TaTTTy" button visible
  | 'choosing'       // User clicked "Ask TaTTTy", showing Enhance/Ideas options
  | 'loading'        // API processing (Enhance or Ideas)
  | 'enhanced'       // Success - AI result displayed with Revert/Redo options
  | 'error';         // API failed - showing error message

type ActionType = 'enhance' | 'ideas';

interface AskTaTTTyData {
  state: AskTaTTTyState;
  actionType: ActionType | null;
  originalText: string;
  enhancedText: string;
  error: string | null;
  isProcessing: boolean;
}

// ============================================================================
// MAIN IF/ELSE LOGIC
// ============================================================================

function renderAskTaTTTy(data: AskTaTTTyData, inputValue: string) {
  
  // ========================================================================
  // STATE 1: IDLE - Show "Ask TaTTTy" button
  // ========================================================================
  if (data.state === 'idle') {
    return (
      <button onClick={handleAskTaTTTyClick}>
        Ask TaTTTy
      </button>
    );
  }
  
  // ========================================================================
  // STATE 2: CHOOSING - Show Enhance/Ideas options
  // ========================================================================
  else if (data.state === 'choosing') {
    return (
      <div className="options-panel">
        <button onClick={() => handleActionSelect('enhance')}>
          Enhance My Text
        </button>
        <button onClick={() => handleActionSelect('ideas')}>
          Give Me Ideas
        </button>
        <button onClick={handleCancel}>
          Cancel
        </button>
      </div>
    );
  }
  
  // ========================================================================
  // STATE 3: LOADING - Show loading spinner
  // ========================================================================
  else if (data.state === 'loading') {
    return (
      <div className="loading-state">
        <Spinner />
        <p>Thinking...</p>
      </div>
    );
  }
  
  // ========================================================================
  // STATE 4: ENHANCED - Show Revert/Redo options
  // ========================================================================
  else if (data.state === 'enhanced') {
    return (
      <div className="enhanced-controls">
        <button onClick={handleRevert} title="Revert to original text">
          Back
        </button>
        <button onClick={handleReEnhance} title="Re-enhance with new result">
          Redo
        </button>
      </div>
    );
  }
  
  // ========================================================================
  // STATE 5: ERROR - Show error message
  // ========================================================================
  else if (data.state === 'error') {
    return (
      <div className="error-state">
        <p className="error-message">{data.error}</p>
        <button onClick={handleRetry}>
          Try Again
        </button>
        <button onClick={handleCancel}>
          Cancel
        </button>
      </div>
    );
  }
  
  // ========================================================================
  // DEFAULT: Fallback (should never reach here)
  // ========================================================================
  else {
    return null;
  }
}

// ============================================================================
// VALIDATION IF/ELSE LOGIC
// ============================================================================

function validateInput(text: string): { valid: boolean; error: string | null } {
  
  // Check if empty
  if (!text || text.trim().length === 0) {
    return {
      valid: false,
      error: 'Write Something First!'
    };
  }
  
  // Check minimum characters (from ask_tattty_config)
  else if (text.trim().length < 10) {
    return {
      valid: false,
      error: 'Add More Details!'
    };
  }
  
  // Check minimum words (from ask_tattty_config)
  else if (text.trim().split(/\s+/).length < 3) {
    return {
      valid: false,
      error: 'Add More Details!'
    };
  }
  
  // Valid input
  else {
    return {
      valid: true,
      error: null
    };
  }
}

// ============================================================================
// API CALL IF/ELSE LOGIC
// ============================================================================

async function callAskTaTTTyAPI(
  actionType: ActionType,
  inputText: string,
  sessionId: string
): Promise<{ success: boolean; result?: string; error?: string }> {
  
  try {
    // Get config from database (or use environment variable)
    const config = await getAskTaTTTyConfig();
    
    // Determine endpoint
    let endpoint: string;
    if (actionType === 'enhance') {
      endpoint = `${config.api_base_url}${config.enhance_endpoint}`;
    } else if (actionType === 'ideas') {
      endpoint = `${config.api_base_url}${config.ideas_endpoint}`;
    } else {
      return {
        success: false,
        error: 'Invalid action type'
      };
    }
    
    // Make API call
    const startTime = Date.now();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        type: actionType,
        contextType: 'tattty',
        targetText: inputText,
        hasSelection: false
      }),
      signal: AbortSignal.timeout(config.request_timeout_ms)
    });
    
    const responseTime = Date.now() - startTime;
    
    // Handle response
    if (response.ok) {
      const data = await response.json();
      
      // Log success to database
      await logAskTaTTTyRequest({
        session_id: sessionId,
        action: actionType,
        input: inputText,
        output: data.result,
        response_ms: responseTime,
        is_successful: true,
        err_msg: null
      });
      
      return {
        success: true,
        result: data.result
      };
    }
    
    // API returned error status
    else {
      const errorText = await response.text();
      
      // Log failure to database
      await logAskTaTTTyRequest({
        session_id: sessionId,
        action: actionType,
        input: inputText,
        output: null,
        response_ms: responseTime,
        is_successful: false,
        err_msg: `HTTP ${response.status}: ${errorText}`
      });
      
      return {
        success: false,
        error: `API Error: ${response.status}`
      };
    }
  }
  
  // Network error or timeout
  catch (error) {
    // Log failure to database
    await logAskTaTTTyRequest({
      session_id: sessionId,
      action: actionType,
      input: inputText,
      output: null,
      response_ms: null,
      is_successful: false,
      err_msg: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

// ============================================================================
// EVENT HANDLERS WITH IF/ELSE
// ============================================================================

async function handleAskTaTTTyClick() {
  const inputText = getCurrentInputValue();
  
  // Validate input
  const validation = validateInput(inputText);
  
  if (!validation.valid) {
    // Show error toast
    toast.error(validation.error);
    return;
  }
  
  // Show options panel
  setState({ state: 'choosing' });
}

async function handleActionSelect(actionType: ActionType) {
  const inputText = getCurrentInputValue();
  
  // Set loading state
  setState({ 
    state: 'loading',
    actionType,
    originalText: inputText 
  });
  
  // Generate session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Call API
  const result = await callAskTaTTTyAPI(actionType, inputText, sessionId);
  
  if (result.success) {
    // Update textarea with enhanced text
    updateInputValue(result.result!);
    
    // Show enhanced controls
    setState({
      state: 'enhanced',
      actionType,
      originalText: inputText,
      enhancedText: result.result!
    });
  } else {
    // Show error state
    setState({
      state: 'error',
      error: result.error || 'Something went wrong'
    });
  }
}

function handleRevert() {
  // Restore original text
  updateInputValue(data.originalText);
  
  // Return to idle state
  setState({ state: 'idle' });
}

async function handleReEnhance() {
  // Use the same action type but with current (enhanced) text
  const currentText = getCurrentInputValue();
  
  // Set loading state
  setState({ 
    state: 'loading',
    actionType: data.actionType,
    originalText: currentText 
  });
  
  // Generate new session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Call API again
  const result = await callAskTaTTTyAPI(data.actionType!, currentText, sessionId);
  
  if (result.success) {
    // Update textarea with new enhanced text
    updateInputValue(result.result!);
    
    // Show enhanced controls
    setState({
      state: 'enhanced',
      actionType: data.actionType,
      originalText: currentText,
      enhancedText: result.result!
    });
  } else {
    // Show error state
    setState({
      state: 'error',
      error: result.error || 'Something went wrong'
    });
  }
}

function handleCancel() {
  // Return to idle state without changing text
  setState({ state: 'idle' });
}

function handleRetry() {
  // Try again with the same action
  handleActionSelect(data.actionType!);
}

// ============================================================================
// BACKEND DATABASE LOGGING
// ============================================================================

async function logAskTaTTTyRequest(params: {
  session_id: string;
  action: ActionType;
  input: string;
  output: string | null;
  response_ms: number | null;
  is_successful: boolean;
  err_msg: string | null;
}) {
  // This should be called by your Python backend AFTER processing
  // Example Python code:
  
  /*
  import psycopg2
  
  cursor.execute(
    "SELECT log_ask_tattty_request(%s, %s, %s, %s, %s, %s, %s)",
    (
      params['session_id'],
      params['action'],
      params['input'],
      params['output'],
      params['response_ms'],
      params['is_successful'],
      params['err_msg']
    )
  )
  conn.commit()
  */
}

// ============================================================================
// SUMMARY OF STATES
// ============================================================================

/*

STATE FLOW:

┌─────────────────────────────────────────────────────────────┐
│ IDLE                                                        │
│ • "Ask TaTTTy" button visible                              │
│ • User types in textarea                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ User clicks "Ask TaTTTy"
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ CHOOSING                                                    │
│ • "Enhance My Text" button                                 │
│ • "Give Me Ideas" button                                   │
│ • "Cancel" button                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ User selects action
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ LOADING                                                     │
│ • Spinner visible                                           │
│ • "Thinking..." text                                        │
│ • API call in progress                                      │
└─────────────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
           SUCCESS               FAILURE
                │                   │
                ▼                   ▼
┌─────────────────────────┐  ┌──────────────────────┐
│ ENHANCED                │  │ ERROR                │
│ • "Back" button         │  │ • Error message      │
│ • "Redo" button         │  │ • "Try Again" button │
│ • Enhanced text shown   │  │ • "Cancel" button    │
└─────────────────────────┘  └──────────────────────┘

USER ACTIONS FROM ANY STATE:
• Click "Back" → IDLE (restore original)
• Click "Redo" → LOADING (re-enhance)
• Click "Cancel" → IDLE (keep current text)
• Click "Try Again" → LOADING (retry failed request)
• Click "SUBMIT" → Save to session storage (not DB)

*/
```
