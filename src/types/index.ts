/**
 * Types for Sistem Insentif & Honorarium Kelurahan Bandulan (SIKB)
 * Kelurahan Bandulan, Kecamatan Sukun, Kota Malang
 * Tahun Anggaran 2027
 */

export type HonorRole = 
  | 'GURU_TPQ'
  | 'GURU_SEKOLAH_MINGGU'
  | 'PENJAGA_TEMPAT_IBADAH'
  | 'PERAWAT_JENAZAH'
  | 'PENJAGA_MAKAM';

// Alias for backwards compatibility
export type ReligiousCategory = HonorRole;

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
  teacherId?: string; // Links to recipient ID when role is TEACHER / HONOR_RECIPIENT
  rw?: string;
  institution?: string;
  honorRole?: HonorRole;
  phone?: string;
  email?: string;
}

export interface AttendanceRecord {
  month: string;
  sessionsHeld: number; // e.g. 16 out of 16 sessions or shift/piket duty
  targetSessions: number;
  santriOrStudentsCount?: number; // For TPQ & Sekolah Minggu
  activityDescription?: string;   // For Marbot, Perawat Jenazah, Penjaga Makam
  reportSubmittedDate: string;
  isVerifiedByRW: boolean;
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: 'KTP' | 'SK_MENGAJAR' | 'BUKU_REKENING' | 'PRESENSI_BULANAN' | 'SURAT_PENGANTAR_RW' | 'SURAT_TUGAS';
  fileUrl?: string;
  uploadDate: string;
  status: 'VALID' | 'PENDING' | 'REJECTED';
  notes?: string;
}

export interface Recipient {
  id: string;
  // A. DATA DIRI (Her Registrasi 2027)
  nik: string;                    // 3. NIK (16 digit)
  maskedNik: string;              // 357304******0002
  nama: string;                   // 1. Nama Lengkap
  gelar?: string;
  tempatTanggalLahir: string;     // 2. Tempat Tanggal Lahir (e.g. "Malang, 14 Mei 1982")
  jenisKelamin: 'Laki-laki' | 'Perempuan'; // 4. Jenis Kelamin
  alamatRumah: string;            // 5. Alamat Rumah
  rtRumah: string;                // RT
  rwRumah: string;                // RW
  telepon: string;                // 6. Nomor HP
  pendidikanTerakhir: string;     // 7. Pendidikan Terakhir (SMA/SMK, S1, dll.)
  bankPenyalur: 'Bank Jatim' | 'Bank BRI' | 'Bank Mandiri' | 'Bank BSI';
  nomorRekening: string;          // 8. Nomor Rekening (Bank Jatim)
  namaPemilikRekening: string;
  lamaBertugas: string;           // 9. Lama Mengajar / Lama Marbot / Lama Perawat Jenazah / Lama Penjaga Makam (e.g. "5 Tahun")
  masaKerjaTahun: number;

  // B. DATA TEMPAT TUGAS / WILAYAH KERJA
  kategori: HonorRole;
  kategoriLabel: string;          // e.g. "Guru TPQ", "Penjaga Tempat Ibadah (Marbot)"
  namaLembaga: string;            // Nama TPQ / Sekolah Minggu / Masjid / Wilayah Kerja / Nama Makam
  alamatLembaga: string;          // Alamat lokasi tugas
  rw: string;                     // e.g. "RW 03"
  rt: string;                     // e.g. "RT 02"
  nspqOrNsm?: string;             // NSPQ (*bagi TPQ) atau NSM (*bagi Masjid jika ada)
  pimpinanNama: string;           // Nama Kepala TPQ / Kepala Sekolah / Takmir Masjid / Ketua RW
  pimpinanJabatan: string;        // 'Kepala TPQ' | 'Kepala Sekolah Minggu' | 'Takmir Masjid' | 'Ketua RW'
  suratTugasNomor?: string;
  tahunAnggaran: string;          // "2027"

  // System & Financial
  avatarUrl: string;
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

