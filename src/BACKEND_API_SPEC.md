# ASK TaTTTy BACKEND API SPECIFICATION
## Real Request/Response Format - NO DOCUMENTATION BULLSHIT

---

## 🎯 FRONTEND SENDS THIS TO YOUR BACKEND:

### **ENDPOINT 1: ENHANCE TEXT**
```
POST http://localhost:8000/api/ai/enhance
Content-Type: application/json

{
  "type": "enhance",
  "contextType": "tattty",
  "targetText": "dragon tattoo",
  "hasSelection": false
}
```

### **ENDPOINT 2: GENERATE IDEAS**
```
POST http://localhost:8000/api/ai/ideas
Content-Type: application/json

{
  "type": "ideas",
  "contextType": "tattty",
  "targetText": "",
  "hasSelection": false
}
```

---

## 🚀 YOUR BACKEND MUST RETURN THIS:

### **OPTION A: STREAMING RESPONSE (SSE - Server-Sent Events)**

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"token": "A", "done": false}

data: {"token": " fierce", "done": false}

data: {"token": " dragon", "done": false}

data: {"token": " with", "done": false}

data: {"token": " emerald", "done": false}

data: {"token": " scales", "done": false}

data: {"token": "...", "done": false}

data: {"token": "", "done": true}

```

**FORMAT:**
- Each line starts with `data: `
- Each data payload is JSON: `{"token": "word", "done": false}`
- Last message has `"done": true`
- Frontend accumulates tokens to build full text

---

### **OPTION B: NON-STREAMING RESPONSE (Simple JSON)**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "result": "A fierce dragon with emerald scales soaring through storm clouds, breathing ethereal flames with intricate details"
}
```

**FORMAT:**
- Single JSON object
- Must have `result` field (REQUIRED - will throw error if missing)

---

## ❌ ERROR RESPONSE FORMAT:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Text is too short - minimum 10 characters required"
}
```

**OR:**

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "error": "OpenAI API rate limit exceeded"
}
```

---

## 🐍 PYTHON BACKEND EXAMPLE:

### **NON-STREAMING (Simple JSON)**

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
import time

app = FastAPI()

class EnhanceRequest(BaseModel):
    type: str
    contextType: str
    targetText: str
    hasSelection: bool

@app.post("/api/ai/enhance")
async def enhance_text(request: EnhanceRequest):
    start_time = time.time()
    
    # Validate input
    if not request.targetText or len(request.targetText.strip()) < 10:
        raise HTTPException(status_code=400, error="Text too short")
    
    # YOUR AI LOGIC HERE
    # Example: OpenAI, Anthropic, local model, etc.
    enhanced_result = f"A fierce dragon with emerald scales soaring through storm clouds, breathing ethereal flames"
    
    # Calculate response time
    response_time_ms = int((time.time() - start_time) * 1000)
    
    # Log to database
    log_to_database(
        session_id=None,  # Optional: get from request headers
        action='enhance',
        input_text=request.targetText,
        output_text=enhanced_result,
        response_ms=response_time_ms,
        is_successful=True,
        err_msg=None
    )
    
    return {"result": enhanced_result}

@app.post("/api/ai/ideas")
async def generate_ideas(request: EnhanceRequest):
    start_time = time.time()
    
    # YOUR AI LOGIC HERE
    ideas_result = "1. A phoenix rising from flames with colorful feathers\n2. A geometric wolf with sacred geometry patterns\n3. A minimalist mountain landscape with stars"
    
    # Calculate response time
    response_time_ms = int((time.time() - start_time) * 1000)
    
    # Log to database
    log_to_database(
        session_id=None,
        action='ideas',
        input_text=request.targetText,
        output_text=ideas_result,
        response_ms=response_time_ms,
        is_successful=True,
        err_msg=None
    )
    
    return {"result": ideas_result}

def log_to_database(session_id, action, input_text, output_text, response_ms, is_successful, err_msg):
    """Log request to ask_tattty_requests table"""
    conn = psycopg2.connect("postgresql://user:pass@host:5432/db")
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT log_ask_tattty_request(%s, %s, %s, %s, %s, %s, %s)",
        (
            session_id,
            action,
            input_text,
            output_text,
            response_ms,
            is_successful,
            err_msg
        )
    )
    
    conn.commit()
    cursor.close()
    conn.close()
```

---

### **STREAMING (SSE - Server-Sent Events)**

```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import json

app = FastAPI()

class EnhanceRequest(BaseModel):
    type: str
    contextType: str
    targetText: str
    hasSelection: bool

@app.post("/api/ai/enhance")
async def enhance_text_streaming(request: EnhanceRequest):
    async def event_stream():
        # YOUR AI STREAMING LOGIC HERE
        # Example: OpenAI streaming, token by token
        
        tokens = [
            "A", " fierce", " dragon", " with", " emerald", " scales",
            " soaring", " through", " storm", " clouds"
        ]
        
        for token in tokens:
            # Send token to frontend
            yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"
            await asyncio.sleep(0.05)  # Simulate streaming delay
        
        # Send done signal
        yield f"data: {json.dumps({'token': '', 'done': True})}\n\n"
    
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )
```

---

## 🔥 WHAT THE FRONTEND DOES:

### **FROM: `/components/shared/AskTaTTTy.tsx` LINE 113-228**

```typescript
// Line 137: Makes fetch request
const response = await fetch(`${askTaTTTyAPI.baseURL}${endpoint}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type,                    // 'enhance' or 'ideas'
    contextType,             // 'tattty'
    targetText,              // User's input text
    hasSelection: false,     // Always false for now
  }),
  signal: AbortSignal.timeout(30000),  // 30 second timeout
});

// Line 161: Check Content-Type to determine streaming vs non-streaming
const contentType = response.headers.get('content-type');

if (contentType.includes('text/event-stream')) {
  // STREAMING: Read SSE tokens
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = '';
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));  // Remove 'data: ' prefix
        
        if (data.token) {
          accumulatedText += data.token;
          onTextUpdate(accumulatedText);  // Update UI
        }
        
        if (data.done) {
          return accumulatedText;
        }
      }
    }
  }
} else {
  // NON-STREAMING: Simple JSON
  const data = await response.json();
  
  if (!data.result) {
    throw new Error('Backend error: Response missing required "result" field');
  }
  
  onTextUpdate(data.result);
  return data.result;
}
```

---

## 📊 DATABASE LOGGING (AFTER BACKEND PROCESSES):

### **FROM: `/ask_tattty_schema.sql` LINE 176-253**

```sql
-- Your Python backend calls this function AFTER processing:
SELECT log_ask_tattty_request(
  'session_1730745600_abc123',  -- session_id (optional, can be NULL)
  'enhance',                     -- action ('enhance' or 'ideas')
  'dragon tattoo',               -- input (what user typed)
  'A fierce dragon with emerald scales...', -- output (AI result)
  1250,                          -- response_time_ms
  true,                          -- was_successful
  NULL                           -- error_message (NULL if success)
);
```

---

## 🎯 SUMMARY:

### **YOUR BACKEND MUST:**

1. **Listen on these endpoints:**
   - `POST /api/ai/enhance`
   - `POST /api/ai/ideas`

2. **Accept this JSON:**
   ```json
   {
     "type": "enhance" | "ideas",
     "contextType": "tattty",
     "targetText": "user input",
     "hasSelection": false
   }
   ```

3. **Return ONE of these:**
   - **Streaming SSE:** `data: {"token": "word", "done": false}\n\n`
   - **Simple JSON:** `{"result": "enhanced text here"}`

4. **On error:**
   ```json
   {"error": "error message"}
   ```

5. **Log to database:**
   ```python
   log_ask_tattty_request(
     session_id,
     action,
     input_text,
     output_text,
     response_ms,
     is_successful,
     err_msg
   )
   ```

---

## 🔧 CONFIGURATION:

### **FROM: `/data/ask-tattty.ts` LINE 45-62**

```typescript
export const askTaTTTyAPI = {
  baseURL: 'http://localhost:8000',        // YOUR BACKEND URL
  enhanceEndpoint: '/api/ai/enhance',      // Endpoint 1
  ideasEndpoint: '/api/ai/ideas',          // Endpoint 2
  requestTimeout: 30000,                   // 30 seconds
};
```

**Change `baseURL` to your actual backend URL!**

---

## ✅ VALIDATION RULES (Frontend validates BEFORE sending):

### **FROM: `/data/ask-tattty.ts` LINE 123-126**

```typescript
export const askTaTTTyValidation = {
  minCharacters: 10,  // User must type at least 10 characters
  minWords: 3,        // User must type at least 3 words
};
```

**Frontend validates BEFORE making API call. Backend should validate again.**

---

## 🚀 THAT'S IT!

**Build your Python backend with:**
- FastAPI or Flask
- OpenAI/Anthropic/Local LLM for AI
- PostgreSQL with the schema from `/ask_tattty_schema.sql`
- Return either streaming SSE or simple JSON

**Frontend is READY. Just point it to your backend URL!**
