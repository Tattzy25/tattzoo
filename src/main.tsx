
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { inject } from "@vercel/analytics";

  // Initialize Vercel Analytics for non-Next.js frameworks (Vite + React)
  inject();

  createRoot(document.getElementById("root")!).render(<App />);
  