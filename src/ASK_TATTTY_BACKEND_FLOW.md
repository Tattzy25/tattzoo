# ASK TaTTTy BACKEND IF/ELSE FLOW
## Every Decision Point from Button Click to Database Log

---

## 🎯 FLOW 1: BUTTON CLICK → VALIDATE → CHOOSE ACTION

```typescript
// User clicks "Ask TaTTTy" button
function handleAskTaTTTyClick() {
  const currentText = getCurrentText();
  
  // ========================================================================
  // IF/ELSE 1: VALIDATE INPUT
  // ========================================================================
  if (!currentText || currentText.trim().length === 0) {
    // Show error: "Write Something First!"
    setError('Write Something First!');
    return; // STOP - don't show options
  }
  else if (currentText.trim().length < 10) {
    // Show error: "Add More Details!"
    setError('Add More Details!');
    return; // STOP - don't show options
  }
  else if (currentText.trim().split(/\s+/).length < 3) {
    // Show error: "Add More Details!"
    setError('Add More Details!');
    return; // STOP - don't show options
  }
  else {
    // Valid input - show options panel
    setIsOpen(true);
    setError(null);
  }
}
```

---

## 🎯 FLOW 2: USER SELECTS ACTION → DETERMINE ENDPOINT

```typescript
// User clicks "Enhance My Text" or "Give Me Ideas"
function handleActionSelect(actionType: 'enhance' | 'ideas') {
  // ========================================================================
  // IF/ELSE 2: DETERMINE ENDPOINT
  // ========================================================================
  let endpoint: string;
  
  if (actionType === 'enhance') {
    endpoint = '/api/ai/enhance';
  }
  else if (actionType === 'ideas') {
    endpoint = '/api/ai/ideas';
  }
  else {
    throw new Error('Invalid action type');
  }
  
  // Make API call
  callBackendAPI(actionType, endpoint);
}
```

---

## 🎯 FLOW 3: MAKE API CALL → CHECK RESPONSE STATUS

```typescript
async function callBackendAPI(actionType: string, endpoint: string) {
  const startTime = Date.now();
  
  try {
    // Make fetch request
    const response = await fetch(`http://localhost:8000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: actionType,
        contextType: 'tattty',
        targetText: getCurrentText(),
        hasSelection: false
      }),
      signal: AbortSignal.timeout(30000)
    });
    
    const responseTime = Date.now() - startTime;
    
    // ========================================================================
    // IF/ELSE 3: CHECK HTTP STATUS
    // ========================================================================
    if (response.ok) {
      // Success (200-299 status codes)
      processSuccessResponse(response, actionType, responseTime);
    }
    else {
      // Error (400-599 status codes)
      const errorData = await response.json();
      const errorMessage = errorData.error || `HTTP ${response.status}`;
      
      // Log failure to database
      logToDatabase({
        action: actionType,
        input: getCurrentText(),
        output: null,
        response_ms: responseTime,
        is_successful: false,
        err_msg: errorMessage
      });
      
      throw new Error(errorMessage);
    }
  }
  catch (error) {
    // Network error or timeout
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    
    // Log failure to database
    logToDatabase({
      action: actionType,
      input: getCurrentText(),
      output: null,
      response_ms: null,
      is_successful: false,
      err_msg: errorMessage
    });
    
    throw error;
  }
}
```

---

## 🎯 FLOW 4: SUCCESS RESPONSE → DETECT STREAMING VS JSON

```typescript
async function processSuccessResponse(
  response: Response, 
  actionType: string, 
  responseTime: number
) {
  // ========================================================================
  // IF/ELSE 4: CHECK CONTENT TYPE
  // ========================================================================
  const contentType = response.headers.get('content-type');
  
  if (!contentType) {
    throw new Error('No Content-Type header');
  }
  else if (contentType.includes('text/event-stream')) {
    // STREAMING RESPONSE (SSE)
    handleStreamingResponse(response, actionType, responseTime);
  }
  else if (contentType.includes('application/json')) {
    // SIMPLE JSON RESPONSE
    handleJsonResponse(response, actionType, responseTime);
  }
  else {
    throw new Error(`Unsupported Content-Type: ${contentType}`);
  }
}
```

---

## 🎯 FLOW 5A: STREAMING RESPONSE → PROCESS TOKENS

```typescript
async function handleStreamingResponse(
  response: Response, 
  actionType: string, 
  responseTime: number
) {
  // ========================================================================
  // IF/ELSE 5A: PROCESS SSE STREAM
  // ========================================================================
  if (!response.body) {
    throw new Error('No response body for streaming');
  }
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = '';
  let lastUpdateTime = Date.now();
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      break; // Stream ended
    }
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonData = JSON.parse(line.slice(6)); // Remove "data: " prefix
        
        // ====================================================================
        // IF/ELSE 5A-1: CHECK TOKEN
        // ====================================================================
        if (jsonData.token) {
          accumulatedText += jsonData.token;
          
          // Throttle UI updates (every 50ms)
          const now = Date.now();
          if (now - lastUpdateTime >= 50) {
            onTextUpdate(accumulatedText); // Update textarea
            lastUpdateTime = now;
          }
        }
        
        // ====================================================================
        // IF/ELSE 5A-2: CHECK DONE
        // ====================================================================
        if (jsonData.done) {
          // Final update
          onTextUpdate(accumulatedText);
          
          // Log success to database
          logToDatabase({
            action: actionType,
            input: getCurrentText(),
            output: accumulatedText,
            response_ms: responseTime,
            is_successful: true,
            err_msg: null
          });
          
          return accumulatedText;
        }
      }
    }
  }
  
  // ========================================================================
  // IF/ELSE 5A-3: STREAM ENDED WITHOUT DONE SIGNAL
  // ========================================================================
  if (accumulatedText.length === 0) {
    throw new Error('Stream ended with no data');
  }
  else {
    // Still return accumulated text
    return accumulatedText;
  }
}
```

---

## 🎯 FLOW 5B: JSON RESPONSE → VALIDATE RESULT

```typescript
async function handleJsonResponse(
  response: Response, 
  actionType: string, 
  responseTime: number
) {
  const data = await response.json();
  
  // ========================================================================
  // IF/ELSE 5B: VALIDATE RESULT FIELD
  // ========================================================================
  if (!data.result) {
    throw new Error('Response missing required "result" field');
  }
  else {
    // Valid result - update UI
    onTextUpdate(data.result);
    
    // Log success to database
    logToDatabase({
      action: actionType,
      input: getCurrentText(),
      output: data.result,
      response_ms: responseTime,
      is_successful: true,
      err_msg: null
    });
    
    return data.result;
  }
}
```

---

## 🎯 FLOW 6: BACKEND PYTHON → VALIDATE INPUT

```python
@app.post("/api/ai/enhance")
async def enhance_text(request: EnhanceRequest):
    start_time = time.time()
    
    # ========================================================================
    # IF/ELSE 6: VALIDATE INPUT (Backend validation)
    # ========================================================================
    if not request.targetText:
        raise HTTPException(status_code=400, detail={"error": "Text is required"})
    elif len(request.targetText.strip()) < 10:
        raise HTTPException(status_code=400, detail={"error": "Text too short - minimum 10 characters"})
    elif len(request.targetText.strip().split()) < 3:
        raise HTTPException(status_code=400, detail={"error": "Text too short - minimum 3 words"})
    else:
        # Valid input - proceed with AI processing
        pass
```

---

## 🎯 FLOW 7: BACKEND PYTHON → PROCESS WITH AI

```python
    # ========================================================================
    # IF/ELSE 7: DETERMINE ACTION TYPE
    # ========================================================================
    if request.type == 'enhance':
        # Use AI to enhance existing text
        prompt = f"Enhance this tattoo description with vivid details: {request.targetText}"
    elif request.type == 'ideas':
        # Generate new tattoo ideas
        prompt = f"Generate 3 creative tattoo ideas based on: {request.targetText}"
    else:
        raise HTTPException(status_code=400, detail={"error": "Invalid type"})
    
    # ========================================================================
    # IF/ELSE 8: CALL AI API (OpenAI, Anthropic, etc.)
    # ========================================================================
    try:
        # Example: OpenAI
        ai_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        enhanced_result = ai_response.choices[0].message.content
        
    except Exception as ai_error:
        # AI API failed
        response_time_ms = int((time.time() - start_time) * 1000)
        
        # Log failure to database
        log_to_database(
            session_id=None,
            action=request.type,
            input_text=request.targetText,
            output_text=None,
            response_ms=response_time_ms,
            is_successful=False,
            err_msg=str(ai_error)
        )
        
        raise HTTPException(status_code=500, detail={"error": "AI processing failed"})
```

---

## 🎯 FLOW 8: BACKEND PYTHON → CHOOSE RESPONSE FORMAT

```python
    # ========================================================================
    # IF/ELSE 9: STREAMING VS NON-STREAMING
    # ========================================================================
    response_time_ms = int((time.time() - start_time) * 1000)
    
    if USE_STREAMING:
        # Return Server-Sent Events (SSE)
        async def event_stream():
            tokens = enhanced_result.split()
            
            for token in tokens:
                yield f"data: {json.dumps({'token': token + ' ', 'done': False})}\n\n"
                await asyncio.sleep(0.05)
            
            yield f"data: {json.dumps({'token': '', 'done': True})}\n\n"
        
        # Log success to database
        log_to_database(
            session_id=None,
            action=request.type,
            input_text=request.targetText,
            output_text=enhanced_result,
            response_ms=response_time_ms,
            is_successful=True,
            err_msg=None
        )
        
        return StreamingResponse(
            event_stream(),
            media_type="text/event-stream"
        )
    
    else:
        # Return simple JSON
        # Log success to database
        log_to_database(
            session_id=None,
            action=request.type,
            input_text=request.targetText,
            output_text=enhanced_result,
            response_ms=response_time_ms,
            is_successful=True,
            err_msg=None
        )
        
        return {"result": enhanced_result}
```

---

## 🎯 FLOW 9: DATABASE LOGGING FUNCTION

```python
def log_to_database(
    session_id,
    action,
    input_text,
    output_text,
    response_ms,
    is_successful,
    err_msg
):
    """Log request to ask_tattty_requests table"""
    
    # ========================================================================
    # IF/ELSE 10: CHECK DATABASE CONNECTION
    # ========================================================================
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT log_ask_tattty_request(%s, %s, %s, %s, %s, %s, %s)",
            (
                session_id,      # Optional session ID
                action,          # 'enhance' or 'ideas'
                input_text,      # Original text
                output_text,     # AI result (or None if failed)
                response_ms,     # Response time in milliseconds
                is_successful,   # True/False
                err_msg          # Error message (or None if success)
            )
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        
    except Exception as db_error:
        # Database logging failed - don't crash the request
        print(f"WARNING: Failed to log to database: {db_error}")
        # Continue - don't throw error to user
```

---

## 📊 COMPLETE DECISION TREE

```
User clicks "Ask TaTTTy"
    │
    ├─► IF text is empty
    │   └─► Show error: "Write Something First!"
    │
    ├─► ELSE IF text < 10 chars
    │   └─► Show error: "Add More Details!"
    │
    └─► ELSE (valid text)
        └─► Show options panel
            │
            ├─► User clicks "Enhance My Text"
            │   │
            │   └─► POST /api/ai/enhance
            │       │
            │       ├─► IF response.ok (200-299)
            │       │   │
            │       │   ├─► IF Content-Type: text/event-stream
            │       │   │   │
            │       │   │   └─► Read SSE stream
            │       │   │       │
            │       │   │       ├─► IF data.token
            │       │   │       │   └─► Accumulate text
            │       │   │       │
            │       │   │       └─► IF data.done
            │       │   │           └─► Log success → Update UI
            │       │   │
            │       │   └─► ELSE IF Content-Type: application/json
            │       │       │
            │       │       ├─► IF data.result exists
            │       │       │   └─► Log success → Update UI
            │       │       │
            │       │       └─► ELSE
            │       │           └─► Throw error: "Missing result field"
            │       │
            │       └─► ELSE (error status)
            │           └─► Log failure → Show error
            │
            └─► User clicks "Give Me Ideas"
                │
                └─► POST /api/ai/ideas
                    └─► (Same flow as Enhance)
```

---

## 🔥 BACKEND DECISION TREE

```
Backend receives request
    │
    ├─► IF text is empty
    │   └─► Return 400: {"error": "Text required"}
    │
    ├─► ELSE IF text < 10 chars
    │   └─► Return 400: {"error": "Text too short"}
    │
    └─► ELSE (valid input)
        │
        ├─► IF type === 'enhance'
        │   └─► prompt = "Enhance this tattoo description..."
        │
        └─► ELSE IF type === 'ideas'
            └─► prompt = "Generate tattoo ideas..."
            │
            └─► Call AI API (OpenAI/Anthropic)
                │
                ├─► IF AI success
                │   │
                │   ├─► IF USE_STREAMING
                │   │   └─► Log to DB → Return SSE stream
                │   │
                │   └─► ELSE
                │       └─► Log to DB → Return {"result": "..."}
                │
                └─► ELSE (AI failed)
                    └─► Log to DB → Return 500: {"error": "AI failed"}
```

---

## 🎯 KEY LOCATIONS IN YOUR CODEBASE

### **Frontend Logic:**
- `/components/shared/AskTaTTTy.tsx` (Lines 95-352)
  - Line 95-110: `validateInput()` - IF/ELSE 1
  - Line 113-228: `streamAIResponse()` - IF/ELSE 3, 4, 5A, 5B
  - Line 230-276: `handleEnhance()` - Triggers validation
  - Line 331-352: `handleIdeas()` - Skips validation

### **Frontend Config:**
- `/data/ask-tattty.ts` (Lines 45-62)
  - Line 49: `baseURL` - Backend URL
  - Line 53: `enhanceEndpoint` - Endpoint path
  - Line 57: `ideasEndpoint` - Endpoint path

### **Database Schema:**
- `/ask_tattty_schema.sql` (Lines 176-253)
  - Function: `log_ask_tattty_request()` - IF/ELSE 10

---

## ✅ SUMMARY

### **5 MAIN IF/ELSE DECISION POINTS:**

1. **Validation:** Empty? Too short? → Show error
2. **Endpoint:** Enhance or Ideas? → Choose URL
3. **Response Status:** 200-299 or error? → Success or fail
4. **Content Type:** Streaming or JSON? → Parse differently
5. **Database Log:** Success or failure? → Log with different params

**Every decision point has a clear IF/ELSE path!** 🎯
