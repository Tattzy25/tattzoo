import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * LICENSE CONTEXT
 * Manages license key verification and usage tracking
 * 
 * Storage Strategy:
 * - localStorage: Persists license data across sessions
 * - Users must re-verify key when they return (can be changed if needed)
 */

interface LicenseData {
  key: string;
  email: string;
  verified: boolean;
  usageCount: number;
  windowStart: string | null;
  totalGenerated: number;
}

interface LicenseContextValue {
  license: LicenseData | null;
  isVerified: boolean;
  verifyLicense: (key: string, email: string) => Promise<boolean>;
  clearLicense: () => void;
  canGenerate: () => boolean;
  getRemainingGenerations: () => number;
  trackGeneration: () => void;
  trackArView: () => void;
  getResetTime: () => Date | null;
}

const LicenseContext = createContext<LicenseContextValue | undefined>(undefined);

const STORAGE_KEY = 'tatty_license';
const MAX_GENERATIONS_PER_HOUR = 3;
const BACKEND_API_URL = (import.meta as any)?.env?.VITE_BACKEND_API_URL || 'http://localhost:8000';

export function LicenseProvider({ children }: { children: ReactNode }) {
  const [license, setLicense] = useState<LicenseData | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored) as LicenseData;
        setLicense(data);
      } catch (e) {
        console.error('Failed to parse license data:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever license changes
  useEffect(() => {
    if (license) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [license]);

  const verifyLicense = async (key: string, email: string): Promise<boolean> => {
    // Basic input format validation before network call
    const keyPattern = /^TATY-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!keyPattern.test(key) || !emailPattern.test(email)) {
      return false;
    }

    // Call backend to validate license status
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/key/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, email }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        console.error('License validation failed:', response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      // Accept a variety of possible response shapes
      const isValid = data?.valid ?? data?.ok ?? data?.status === 'valid';
      const isActive = data?.active ?? true; // default true if not provided

      if (!isValid || isActive === false) {
        return false;
      }

      const newLicense: LicenseData = {
        key,
        email,
        verified: true,
        usageCount: 0,
        windowStart: null,
        totalGenerated: 0,
      };

      setLicense(newLicense);
      return true;
    } catch (err) {
      console.error('Network error during license validation:', err);
      return false;
    }
  };

  const clearLicense = () => {
    setLicense(null);
  };

  const canGenerate = (): boolean => {
    if (!license || !license.verified) return false;

    const now = new Date();
    const windowStart = license.windowStart ? new Date(license.windowStart) : null;

    // If no window started yet, they can generate
    if (!windowStart) return true;

    // Check if window has expired (1 hour)
    const hoursSinceStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceStart >= 1) {
      // Window expired, reset it
      return true;
    }

    // Within the window, check if under limit
    return license.usageCount < MAX_GENERATIONS_PER_HOUR;
  };

  const getRemainingGenerations = (): number => {
    if (!license || !license.verified) return 0;

    const now = new Date();
    const windowStart = license.windowStart ? new Date(license.windowStart) : null;

    // If no window or window expired, full limit available
    if (!windowStart) return MAX_GENERATIONS_PER_HOUR;

    const hoursSinceStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);
    if (hoursSinceStart >= 1) return MAX_GENERATIONS_PER_HOUR;

    return Math.max(0, MAX_GENERATIONS_PER_HOUR - license.usageCount);
  };

  const recordUsage = (action: 'image' | 'ar') => {
    if (!license) return;
    // Fire-and-forget backend usage call; UI relies on local counter for immediate feedback
    try {
      void fetch(`${BACKEND_API_URL}/api/key/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: license.key, email: license.email, action }),
        signal: AbortSignal.timeout(8000),
      }).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.warn('Usage tracking failed:', res.status, text);
        }
      }).catch((err) => {
        console.warn('Usage tracking network error:', err);
      });
    } catch (err) {
      console.warn('Usage tracking error:', err);
    }

    // Update local hourly window counters (UX rate-limit indicator)
    const now = new Date();
    const windowStart = license.windowStart ? new Date(license.windowStart) : null;
    if (!windowStart || (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60) >= 1) {
      setLicense({
        ...license,
        usageCount: 1,
        windowStart: now.toISOString(),
        totalGenerated: license.totalGenerated + 1,
      });
    } else {
      setLicense({
        ...license,
        usageCount: license.usageCount + 1,
        totalGenerated: license.totalGenerated + 1,
      });
    }
  };

  const trackGeneration = () => recordUsage('image');
  const trackArView = () => recordUsage('ar');

  const getResetTime = (): Date | null => {
    if (!license || !license.windowStart) return null;

    const windowStart = new Date(license.windowStart);
    const resetTime = new Date(windowStart.getTime() + 60 * 60 * 1000); // +1 hour

    return resetTime;
  };

  const value: LicenseContextValue = {
    license,
    isVerified: license?.verified || false,
    verifyLicense,
    clearLicense,
    canGenerate,
    getRemainingGenerations,
    trackGeneration,
    trackArView,
    getResetTime,
  };

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense() {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicense must be used within LicenseProvider');
  }
  return context;
}
