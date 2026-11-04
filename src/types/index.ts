/**
 * Types for Sistem Insentif Keagamaan Bandulan (SIKB)
 * Kelurahan Bandulan, Kecamatan Sukun, Kota Malang
 */

export type ReligiousCategory = 'GURU_NGAJI' | 'GURU_SEKOLAH_MINGGU' | 'GURU_PASRAMAN' | 'GURU_VIHARA';

export type DisbursementStatus = 
  | 'TERSALURKAN'          // Disbursed / Selesai Transfer
  | 'MENUNGGU_VERIFIKASI'  // Pending Verification by Kesra
  | 'SIAP_SALUR'           // Approved, in bank queue
  | 'PERLU_REVISI';        // Needs document correction

export interface AuthUser {
  id: string;
  name: string;
  role: 'ADMIN_KESRA' | 'LURAH' | 'TEACHER';
  roleTitle: string;
  avatarUrl: string;
  nipOrNik: string;
  teacherId?: string; // Links to recipient ID when role is TEACHER
  rw?: string;
  institution?: string;
}

export interface AttendanceRecord {
  month: string;
  sessionsHeld: number; // e.g. 16 out of 16 sessions
  targetSessions: number;
  santriOrStudentsCount: number;
  reportSubmittedDate: string;
  isVerifiedByRW: boolean;
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: 'KTP' | 'SK_MENGAJAR' | 'BUKU_REKENING' | 'PRESENSI_BULANAN' | 'SURAT_PENGANTAR_RW';
  fileUrl?: string;
  uploadDate: string;
  status: 'VALID' | 'PENDING' | 'REJECTED';
  notes?: string;
}

export interface Recipient {
  id: string;
  nik: string;                    // e.g. 3573041205840002
  maskedNik: string;              // e.g. 357304******0002
  nama: string;
  gelar?: string;
  avatarUrl: string;
  telepon: string;
  email?: string;
  kategori: ReligiousCategory;
  kategoriLabel: string;          // e.g. "Guru Ngaji (TPQ/Madrasah)", "Guru Sekolah Minggu"
  namaLembaga: string;            // e.g. "TPQ Al-Ikhlas", "Sekolah Minggu GKJW Bandulan"
  alamatLembaga: string;
  rw: string;                     // e.g. "RW 03"
  rt: string;                     // e.g. "RT 05"
  masaKerjaTahun: number;
  bankPenyalur: 'Bank Jatim' | 'Bank BRI' | 'Bank Mandiri' | 'Bank BSI';
  nomorRekening: string;
  namaPemilikRekening: string;
  nominalPerBulan: number;        // e.g. 500000
  status: DisbursementStatus;
  statusUpdateDate: string;
  dukcapilVerified: boolean;
  documents: VerificationDocument[];
  attendance: AttendanceRecord;
  verifierName?: string;
  verifierRole?: string;
  verificationHash?: string;
  lastPayoutDate?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  recipientId: string;
  recipientName: string;
  previousStatus?: DisbursementStatus;
  newStatus?: DisbursementStatus;
  hash: string;
  notes?: string;
}

export interface DisbursementBatch {
  id: string;
  batchNumber: string; // e.g. "BA-INS/2026/XI/RW-03"
  createdDate: string;
  period: string; // e.g. "November 2026"
  totalRecipients: number;
  totalNominal: number;
  bankPenyalur: string;
  recipientIds: string[];
  status: 'DRAFT' | 'PROSES_BANK' | 'SELESAI';
  lurahSigned: boolean;
  kasiKesraSigned: boolean;
  signedDate?: string;
}

export type SecurityEventType = 
  | 'FAILED_LOGIN'
  | 'RATE_LIMIT_BLOCKED'
  | 'NIK_UNMASKED'
  | 'BATCH_MFA_CHALLENGE'
  | 'SESSION_TIMEOUT'
  | 'TAMPER_CHECK_PASSED'
  | 'CONFIG_CHANGE';

export interface SecurityIncident {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actor: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  status: 'RESOLVED' | 'INVESTIGATING' | 'AUTOMATICALLY_BLOCKED';
}

export interface SecurityStatus {
  shieldActive: boolean;
  encryptionStandard: string; // e.g. "AES-256-GCM + SHA-256 Hashing"
  pdpCompliance: boolean;     // UU Perlindungan Data Pribadi No. 27/2022
  autoTimeoutMinutes: number;
  unmaskLogCount: number;
  failedAttemptsBlocked: number;
  mfaEnforced: boolean;
}

