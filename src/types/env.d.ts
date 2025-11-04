/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZAPIER_WEBHOOK_URL: string;
  readonly VITE_LOG_WEBHOOK_URL_HEALTH: string;
  // Add more env variables here as needed
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_REPLICATE_API_KEY?: string;
  readonly VITE_DATABASE_URL?: string;
  // Google OAuth
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GOOGLE_REDIRECT_URI?: string;
  // Backend API URL
  readonly VITE_API_URL?: string;
  readonly VITE_BACKEND_API_URL?: string;
  // Stack Auth
  readonly VITE_STACK_PROJECT_ID: string;
  readonly VITE_STACK_PUBLISHABLE_CLIENT_KEY: string;
}

/**
 * Server-side environment variables (Node.js)
 * Used in backend/server-side code
 * 
 * IMPORTANT: Never hardcode these values!
 * Always load from .env file using process.env (server-side only)
 * For client-side (browser), use import.meta.env with VITE_ prefix
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      DATABASE_URL: string;
      
      // Application
      APP_URL?: string;
      PORT?: string;
      
      // AI Provider Selection
      AI_PROVIDER?: 'groq' | 'openai' | 'anthropic' | 'gemini';
      
      // Groq API (NO HARDCODING - all from .env)
      GROQ_API_KEY?: string;
      GROQ_MODEL?: string; // Legacy /api/ai/stream
      GROQ_CHAT_MODEL?: string; // /api/groq/chat
      GROQ_TEMPERATURE?: string;
      GROQ_MAX_TOKENS?: string;
      GROQ_TOP_P?: string;
      
      // OpenAI API
      OPENAI_API_KEY?: string;
      
      // Anthropic API
      ANTHROPIC_API_KEY?: string;
      
      // Stack Auth (Backend ONLY - never expose to frontend)
      STACK_PROJECT_ID?: string;
      STACK_SECRET_SERVER_KEY?: string; // NEVER hardcode this!
      
      // Google OAuth
      GOOGLE_CLIENT_ID?: string;
      GOOGLE_CLIENT_SECRET?: string;
      
      // Email Service
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASS?: string;
      EMAIL_FROM?: string;
      
      // Security
      SESSION_SECRET?: string;
    }
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
