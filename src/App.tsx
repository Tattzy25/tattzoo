import { useEffect, useState } from 'react';
import { GeneratorPage } from './components/GeneratorPage';
import { LandingPage } from './components/LandingPage';
import { ScreenshotProtection } from './components/shared/ScreenshotProtection';
import { GeneratorProvider } from './contexts/GeneratorContext';
import { LicenseProvider } from './contexts/LicenseContext';
import { ThemeProvider } from './components/theme-provider';
import { Analytics } from '@vercel/analytics/react';

function AppContent() {
  const [page, setPage] = useState<'home' | 'generator'>('home')
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = (target: string) => {
    if (target === 'home') {
      setPage('home')
      return
    }
    if (target === 'generator') {
      setPage('generator')
      return
    }
    const el = document.getElementById(target)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="h-full">
        {page === 'home' ? (
          <LandingPage onGoToGenerator={() => setPage('generator')} />
        ) : (
          <GeneratorPage onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LicenseProvider>
        <GeneratorProvider>
          <ScreenshotProtection />
          <AppContent />
          <Analytics />
        </GeneratorProvider>
      </LicenseProvider>
    </ThemeProvider>
  );
}
