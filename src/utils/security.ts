/**
 * Security & Anti-Cracking Utilities
 * Sistem Insentif Keagamaan Bandulan (SIKB)
 * Enforcing UU Perlindungan Data Pribadi (UU PDP No. 27/2022) & ISO 27001 Standards
 */

import { SecurityIncident } from '../types';

/**
 * Mask sensitive 16-digit NIK
 * Default view: 357304******0002
 */
export function maskNik(nik: string, isElevated: boolean = false): string {
  if (!nik) return '';
  if (isElevated) return nik; // Only when authorized unmasking is granted
  const clean = nik.replace(/\s+/g, '');
  if (clean.length < 10) return clean;
  return `${clean.slice(0, 6)}******${clean.slice(-4)}`;
}

/**
 * Mask bank account number
 * e.g., 0042-8819-21 -> 0042-****-21
 */
export function maskBankAccount(account: string, isElevated: boolean = false): string {
  if (!account) return '';
  if (isElevated) return account;
  const parts = account.split('-');
  if (parts.length >= 3) {
    return `${parts[0]}-****-${parts[parts.length - 1]}`;
  }
  if (account.length > 8) {
    return `${account.slice(0, 4)}****${account.slice(-3)}`;
  }
  return account;
}

/**
 * Generate cryptographic SHA-256 simulated checksum
 */
export function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `SHA256:${hex}b9f8a2e1d0c5a3b98471182cf891a2e`;
}

/**
 * Generate 6-digit OTP for Multi-Factor Authorization
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Rate Limiter for Login Attempts
 */
interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number | null;
}

const rateLimitStore: Record<string, RateLimitRecord> = {};

export function checkRateLimit(key: string, maxAttempts = 5, lockoutSeconds = 60): {
  allowed: boolean;
  remainingAttempts: number;
  lockoutRemainingSeconds: number;
} {
  const now = Date.now();
  const record = rateLimitStore[key] || { attempts: 0, lockoutUntil: null };

  if (record.lockoutUntil && record.lockoutUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockoutRemainingSeconds: Math.ceil((record.lockoutUntil - now) / 1000),
    };
  }

  // If lockout expired, reset
  if (record.lockoutUntil && record.lockoutUntil <= now) {
    record.attempts = 0;
    record.lockoutUntil = null;
  }

  const remaining = Math.max(0, maxAttempts - record.attempts);
  return {
    allowed: record.attempts < maxAttempts,
    remainingAttempts: remaining,
    lockoutRemainingSeconds: 0,
  };
}

export function recordFailedAttempt(key: string, maxAttempts = 5, lockoutSeconds = 60): {
  locked: boolean;
  lockoutRemainingSeconds: number;
} {
  const now = Date.now();
  const record = rateLimitStore[key] || { attempts: 0, lockoutUntil: null };
  record.attempts += 1;

  if (record.attempts >= maxAttempts) {
    record.lockoutUntil = now + lockoutSeconds * 1000;
    rateLimitStore[key] = record;
    return { locked: true, lockoutRemainingSeconds: lockoutSeconds };
  }

  rateLimitStore[key] = record;
  return { locked: false, lockoutRemainingSeconds: 0 };
}

export function resetRateLimit(key: string): void {
  delete rateLimitStore[key];
}

/**
 * Initial Mock Security Incidents & Threat Logs
 */
export const INITIAL_SECURITY_INCIDENTS: SecurityIncident[] = [
  {
    id: 'SEC-LOG-901',
    timestamp: '2026-11-02 21:14 WIB',
    type: 'RATE_LIMIT_BLOCKED',
    severity: 'MEDIUM',
    actor: 'Anonymous Crawler (182.253.110.14)',
    ipAddress: '182.253.110.14 (ISP Malang Raya)',
    userAgent: 'Mozilla/5.0 (Automated Script Tool/v2)',
    details: 'Terdeteksi 6x percobaan login gagal berturut-turut pada endpoint NIK. IP otomatis diblokir selama 60 detik.',
    status: 'AUTOMATICALLY_BLOCKED',
  },
  {
    id: 'SEC-LOG-902',
    timestamp: '2026-11-02 11:42 WIB',
    type: 'BATCH_MFA_CHALLENGE',
    severity: 'LOW',
    actor: 'Bambang Trianto, S.Sos (Kasi Kesra)',
    ipAddress: '10.32.4.15 (Intranet Kantor Kelurahan)',
    userAgent: 'Chrome 130 / Windows 11 Enterprise (Dinas)',
    details: 'Verifikasi 2FA OTP berhasil divalidasi sebelum menyetujui draf Berita Acara Penyaluran Insentif Tahap IV.',
    status: 'RESOLVED',
  },
  {
    id: 'SEC-LOG-903',
    timestamp: '2026-11-01 14:18 WIB',
    type: 'TAMPER_CHECK_PASSED',
    severity: 'LOW',
    actor: 'Sistem Enkripsi SIKB',
    ipAddress: '127.0.0.1 (Internal Service Daemon)',
    userAgent: 'SIKB Cryptographic Integrity Monitor v2.4',
    details: 'Audit integritas data 142 berkas pengajar keagamaan selesai. Seluruh checksum SHA-256 valid 100% tanpa modifikasi ilegal.',
    status: 'RESOLVED',
  },
  {
    id: 'SEC-LOG-904',
    timestamp: '2026-10-31 03:22 WIB',
    type: 'FAILED_LOGIN',
    severity: 'HIGH',
    actor: 'Unknown Scraper (45.142.122.88)',
    ipAddress: '45.142.122.88 (Tor Exit Node Proxy)',
    userAgent: 'Python-requests/2.31.0',
    details: 'Percobaan injeksi SQL / payload probing pada parameter pencarian NIK publik. Dicegat oleh WAF & sanitasi regex.',
    status: 'AUTOMATICALLY_BLOCKED',
  },
];
