# Tattty Backend Setup Guide

## Prerequisites

1. **Python 3.8+** installed on your system
2. **OpenAI API Key** from https://platform.openai.com/api-keys

## Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - Windows:
     ```bash
     venv\\Scripts\\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env file and add your OpenAI API key
   # OPENAI_API_KEY=your_actual_api_key_here
   ```

## Running the Backend

### Option 1: Using the startup script (Recommended)
```bash
python start_server.py
```

### Option 2: Directly with uvicorn
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Text Enhancement
- **POST** `/api/ai/enhance`
- **Body**: `{"text": "your tattoo description", "selection_info": "optional context"}`

### Idea Generation  
- **POST** `/api/ai/ideas`
- **Body**: `{"text": "your concept", "selection_info": "optional context"}`

### Health Check
- **GET** `/health`

## Testing the API

Once the backend is running, you can test it with curl:

```bash
# Test enhancement
curl -X POST http://localhost:8000/api/ai/enhance \
  -H "Content-Type: application/json" \
  -d '{"text": "dragon tattoo on arm"}'

# Test ideas generation  
curl -X POST http://localhost:8000/api/ai/ideas \
  -H "Content-Type: application/json" \
  -d '{"text": "mountain landscape"}'
```

## Frontend Integration

The frontend is already configured to connect to `http://localhost:8000`. Once the backend is running:

1. Start the frontend: `npm run dev`
2. Open http://localhost:3001
3. The "Ask Tattty" button should now work with real AI responses

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY not found"**: Make sure your `.env` file exists and contains the API key
2. **CORS errors**: Backend is configured for localhost:3001 and :3000
3. **Connection refused**: Ensure backend is running on port 8000

### Debug Mode

To see detailed logs, set environment variable:
```bash
export PYTHONPATH=.
python main.py
```

## Deployment

For production deployment, consider:

1. **Environment**: Set `OPENAI_API_KEY` in your production environment
2. **CORS**: Update `allow_origins` in `main.py` for your production domain
3. **SSL**: Use HTTPS in production
4. **Process Manager**: Use gunicorn with uvicorn workers for production

## Model Configuration

Currently using: **GPT-5-nano-2025-08-07**

To change the model, update the `model` parameter in the `call_openai_api` function in `main.py`.