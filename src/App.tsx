import { useEffect } from 'react';
import { GeneratorPage } from './components/GeneratorPage';
import { ScreenshotProtection } from './components/shared/ScreenshotProtection';
import { GeneratorProvider } from './contexts/GeneratorContext';
import { LicenseProvider } from './contexts/LicenseContext';
import { ThemeProvider } from './components/theme-provider';

function AppContent() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = (page: string) => {
    console.log('Navigate to:', page);
    // For single-page landing, navigation is handled via scrolling
    // You can add scroll-to-section logic here later
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="h-full">
        <GeneratorPage onNavigate={handleNavigate} />
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
        </GeneratorProvider>
      </LicenseProvider>
    </ThemeProvider>
  );
}
