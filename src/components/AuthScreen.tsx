import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  HelpCircle, 
  AlertCircle,
  Sparkles,
  Users,
  Award,
  UserPlus
} from 'lucide-react';
import { AuthUser, Recipient } from '../types';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '../utils/security';
import { SelfRegistrationModal } from './SelfRegistrationModal';

interface AuthScreenProps {
  recipients: Recipient[];
  onLogin: (user: AuthUser) => void;
  onOpenPublicCheck: () => void;
  onRegisterRecipient?: (newRecipient: Recipient, autoLoginUser?: AuthUser) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  recipients,
  onLogin,
  onOpenPublicCheck,
  onRegisterRecipient,
}) => {
  const [activePortal, setActivePortal] = useState<'TEACHER' | 'ADMIN'>('TEACHER');
  const [showSelfRegisterModal, setShowSelfRegisterModal] = useState(false);

  // Teacher login state
  const [teacherNik, setTeacherNik] = useState('');
  const [teacherPin, setTeacherPin] = useState('123456');
  const [teacherError, setTeacherError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Admin login state
  const [adminRole, setAdminRole] = useState<'ADMIN_KESRA' | 'LURAH'>('ADMIN_KESRA');
  const [adminUsername, setAdminUsername] = useState('kesra.bandulan');
  const [adminPassword, setAdminPassword] = useState('********');
  const [adminError, setAdminError] = useState('');

  // Handle teacher login
  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherError('');

    // Check rate limit
    const limitStatus = checkRateLimit('teacher_login', 5, 60);
    if (!limitStatus.allowed) {
      setLockoutRemaining(limitStatus.lockoutRemainingSeconds);
      setTeacherError(`Terdeteksi proteksi anti-brute force: Batas percobaan terlampaui. Mohon tunggu ${limitStatus.lockoutRemainingSeconds} detik.`);
      return;
    }

    const cleanInput = teacherNik.trim().replace(/\D/g, '');
    const matched = recipients.find((r) => r.nik.includes(cleanInput) || r.nama.toLowerCase().includes(teacherNik.toLowerCase()));

    if (!matched) {
      const failStatus = recordFailedAttempt('teacher_login', 5, 60);
      if (failStatus.locked) {
        setLockoutRemaining(failStatus.lockoutRemainingSeconds);
        setTeacherError(`⚠️ Terlalu banyak percobaan gagal (5x). Sistem otomatis mengunci akses login selama 60 detik demi keamanan data.`);
      } else {
        const remaining = 5 - (failStatus as any).attempts || 3;
        setTeacherError(`NIK tidak terdaftar dalam database guru keagamaan Bandulan. Sisa percobaan aman sebelum proteksi lockout aktif.`);
      }
      return;
    }

    resetRateLimit('teacher_login');

    const authUser: AuthUser = {
      id: `USR-${matched.id}`,
      name: matched.nama,
      role: 'TEACHER',
      roleTitle: matched.kategoriLabel,
      avatarUrl: matched.avatarUrl,
      nipOrNik: matched.nik,
      teacherId: matched.id,
      rw: matched.rw,
      institution: matched.namaLembaga,
    };

    onLogin(authUser);
  };

  // Quick select teacher demo
  const handleQuickTeacherLogin = (teacher: Recipient) => {
    const authUser: AuthUser = {
      id: `USR-${teacher.id}`,
      name: teacher.nama,
      role: 'TEACHER',
      roleTitle: teacher.kategoriLabel,
      avatarUrl: teacher.avatarUrl,
      nipOrNik: teacher.nik,
      teacherId: teacher.id,
      rw: teacher.rw,
      institution: teacher.namaLembaga,
    };
    onLogin(authUser);
  };

  // Handle admin login
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (adminRole === 'ADMIN_KESRA') {
      const authUser: AuthUser = {
        id: 'ADMIN-01',
        name: 'Bambang Trianto, S.Sos',
        role: 'ADMIN_KESRA',
        roleTitle: 'Kasi Kesejahteraan Rakyat Kelurahan Bandulan',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        nipOrNik: '197805142005011004',
      };
      onLogin(authUser);
    } else {
      const authUser: AuthUser = {
        id: 'LURAH-01',
        name: 'Drs. Supriyanto, M.AP',
        role: 'LURAH',
        roleTitle: 'Lurah Bandulan Kota Malang',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        nipOrNik: '197103221996031002',
      };
      onLogin(authUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-teal-50/40 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0f766e] text-white flex items-center justify-center font-bold text-lg shadow-sm border border-teal-500/30">
            🏛️
          </div>
          <div>
            <h1 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
              PEMERINTAH KOTA MALANG • KECAMATAN SUKUN
            </h1>
            <p className="text-xs text-[#0f766e] font-semibold">
              Kelurahan Bandulan - Sistem Insentif Keagamaan (SIKB)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPublicCheck}
          className="text-xs font-bold text-[#0f766e] bg-white border border-teal-200 px-3.5 py-1.5 rounded-[10px] hover:bg-teal-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Cek NIK Tanpa Login</span>
        </button>
      </div>

      {/* Main Login Card Container */}
      <div className="max-w-xl w-full mx-auto my-auto">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden">
          {/* Header Card Brand */}
          <div className="bg-gradient-to-r from-teal-950 via-[#0f766e] to-teal-800 text-white p-6 sm:p-8 text-center space-y-2 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-[11px] font-semibold border border-white/15 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Autentikasi Akses Sistem Terpadu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Sistem Insentif Keagamaan Bandulan
            </h2>
            <p className="text-xs text-teal-100/90 max-w-md mx-auto leading-relaxed">
              Silakan pilih mode masuk sesuai dengan kewenangan Anda: sebagai Pengajar Keagamaan penerima insentif atau sebagai Aparatur Verifikator Kelurahan.
            </p>
          </div>

          {/* Mode Tabs Switcher */}
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
            <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setActivePortal('TEACHER')}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePortal === 'TEACHER'
                    ? 'bg-white text-[#0f766e] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Penerima Honor (5 Peran)</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePortal('ADMIN')}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePortal === 'ADMIN'
                    ? 'bg-white text-[#0f766e] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Aparatur Kelurahan</span>
              </button>
            </div>
          </div>

          {/* Body Portal 1: PENERIMA HONOR (5 PERAN) */}
          {activePortal === 'TEACHER' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0f766e]" />
                  Masuk ke Portal Penerima Honorarium
                </h3>
                <p className="text-xs text-slate-500">
                  Untuk 5 peran: Guru TPQ, Guru Sekolah Minggu, Penjaga Tempat Ibadah (Marbot), Perawat Jenazah, & Penjaga Makam.
                </p>
              </div>

              {teacherError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{teacherError}</span>
                </div>
              )}

              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Kependudukan (NIK KTP 16 Digit)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={teacherNik}
                      onChange={(e) => setTeacherNik(e.target.value)}
                      placeholder="Masukkan 16 digit NIK (contoh: 3573041205840002)"
                      className="w-full h-11 pl-3.5 pr-4 text-xs font-mono bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN / Kata Sandi Akses Masuk
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={teacherPin}
                      onChange={(e) => setTeacherPin(e.target.value)}
                      placeholder="Masukkan PIN (Default demo: 123456)"
                      className="w-full h-11 pl-3.5 pr-4 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] text-white text-xs sm:text-sm font-bold rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Masuk ke Dashboard Akun Saya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Fitur Daftar Mandiri Her-Registrasi 2027 */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/90 rounded-2xl p-4 text-center space-y-2 shadow-2xs">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-950">
                  <UserPlus className="w-4 h-4 text-[#0f766e]" />
                  <span>Belum Terdata Her-Registrasi 2027?</span>
                </div>
                <p className="text-[11px] text-teal-800/90 leading-relaxed max-w-sm mx-auto">
                  Daftarkan diri secara mandiri untuk Guru TPQ, Guru Sekolah Minggu, Penjaga Tempat Ibadah (Marbot), Perawat Jenazah, atau Penjaga Makam Kelurahan Bandulan.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSelfRegisterModal(true)}
                  className="w-full py-2.5 bg-white hover:bg-teal-50 text-[#0f766e] font-bold text-xs rounded-[10px] border border-teal-300 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Mandiri Her-Registrasi 2027 (5 Peran) →</span>
                </button>
              </div>

              {/* Demo Fast Login Chips across the 5 roles */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Coba Masuk Cepat per Peran (Demo 5 Role):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipients.slice(0, 6).map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleQuickTeacherLogin(r)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-teal-50 hover:border-teal-300 text-left transition-all flex items-center gap-2.5 cursor-pointer group"
                    >
                      <img
                        src={r.avatarUrl}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0f766e]">
                          {r.nama}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {r.kategoriLabel} • {r.rw}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Body Portal 2: ADMIN / APARATUR KELURAHAN */}
          {activePortal === 'ADMIN' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
                  Akses Konsol Verifikasi & Penyaluran Kelurahan
                </h3>
                <p className="text-xs text-slate-500">
                  Khusus Kasi Kesejahteraan Rakyat (Kesra) dan Lurah Bandulan Kota Malang.
                </p>
              </div>

              {adminError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Jabatan Aparatur *
                  </label>
                  <select
                    value={adminRole}
                    onChange={(e) => {
                      const r = e.target.value as any;
                      setAdminRole(r);
                      setAdminUsername(r === 'ADMIN_KESRA' ? 'kesra.bandulan' : 'lurah.bandulan');
                    }}
                    className="w-full h-11 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                  >
                    <option value="ADMIN_KESRA">
                      Bambang Trianto, S.Sos - Kasi Kesra (Verifikator Dokumen)
                    </option>
                    <option value="LURAH">
                      Drs. Supriyanto, M.AP - Lurah Bandulan (Otorisator SPJ / SP2D)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP / Nama Pengguna Aparatur Sipil Negara
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Dinas
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] text-white text-xs sm:text-sm font-bold rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Konsol Administrasi</span>
                </button>
              </form>

              {/* 1-Click Fast Admin Sign In Buttons */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Akses Cepat Pengujian:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onLogin({
                        id: 'ADMIN-01',
                        name: 'Bambang Trianto, S.Sos',
                        role: 'ADMIN_KESRA',
                        roleTitle: 'Kasi Kesra Kelurahan Bandulan',
                        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                        nipOrNik: '197805142005011004',
                      });
                    }}
                    className="p-2.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100 text-left transition-colors cursor-pointer"
                  >
                    <p className="text-xs font-bold text-teal-900">Masuk: Kasi Kesra</p>
                    <p className="text-[10px] text-teal-700">Verifikasi Dokumen</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLogin({
                        id: 'LURAH-01',
                        name: 'Drs. Supriyanto, M.AP',
                        role: 'LURAH',
                        roleTitle: 'Lurah Bandulan Kota Malang',
                        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
                        nipOrNik: '197103221996031002',
                      });
                    }}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-left transition-colors cursor-pointer"
                  >
                    <p className="text-xs font-bold text-amber-900">Masuk: Lurah Bandulan</p>
                    <p className="text-[10px] text-amber-700">Otorisasi & SP2D</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Card */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sistem Anti-Pungli & Transparan
            </span>
            <span>Kota Malang © 2026</span>
          </div>
        </div>
      </div>

      {/* Municipal Civic Footer */}
      <div className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400 pt-6">
        <p>Sistem Insentif Guru Keagamaan Kelurahan Bandulan, Kecamatan Sukun, Kota Malang, Jawa Timur</p>
      </div>

      {/* Modal Pendaftaran Mandiri Guru Keagamaan Baru */}
      <SelfRegistrationModal
        isOpen={showSelfRegisterModal}
        onClose={() => setShowSelfRegisterModal(false)}
        onSuccessRegister={(newRec, autoUser) => {
          if (onRegisterRecipient) {
            onRegisterRecipient(newRec, autoUser);
          }
          if (autoUser) {
            onLogin(autoUser);
          } else {
            setTeacherNik(newRec.nik);
            setShowSelfRegisterModal(false);
          }
        }}
      />
    </div>
  );
};
