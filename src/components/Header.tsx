import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  Calendar, 
  UserCheck, 
  Bell, 
  Sparkles,
  ChevronDown,
  Layers,
  LogOut,
  User,
  Lock
} from 'lucide-react';
import { AuthUser } from '../types';

interface HeaderProps {
  currentUser: AuthUser | null;
  onLogout: () => void;
  onLockSession?: () => void;
  onOpenSecurityCenter?: () => void;
  sessionRemainingSeconds?: number;
  currentRole: 'ADMIN_KESRA' | 'LURAH' | 'GURU_MANDIRI';
  onRoleChange: (role: 'ADMIN_KESRA' | 'LURAH' | 'GURU_MANDIRI') => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewRegistration: () => void;
  onOpenBatchDisbursement: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onLockSession,
  onOpenSecurityCenter,
  sessionRemainingSeconds = 900,
  currentRole,
  onRoleChange,
  selectedPeriod,
  onPeriodChange,
  searchQuery,
  onSearchChange,
  onOpenNewRegistration,
  onOpenBatchDisbursement,
  pendingCount,
}) => {
  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Municipal Identity Bar */}
      <div className="bg-[#0f766e] text-white px-4 py-1.5 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px]">
              🏛️
            </span>
            <span className="font-semibold">PEMERINTAH KOTA MALANG</span>
            <span className="text-teal-200">/</span>
            <span>Kecamatan Sukun</span>
            <span className="text-teal-200">/</span>
            <span className="font-semibold text-teal-100">Kelurahan Bandulan</span>
          </div>
          <div className="flex items-center gap-4 text-teal-100 text-[11px]">
            <span className="hidden sm:inline">SK Walikota Malang No. 188.45/420/2026</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-800/60 px-2 py-0.5 rounded text-[11px] text-teal-200 border border-teal-600/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sinkronisasi Dukcapil Terhubung
            </span>
          </div>
        </div>
      </div>

      {/* Main App Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f766e] to-[#0d9488] flex items-center justify-center text-white shadow-md shadow-teal-900/10 shrink-0 border border-teal-500/30">
              <Building2 className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  SIKB Bandulan
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-[#0f766e] border border-teal-200/80">
                  Resmi
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Sistem Honorarium & Insentif 5 Peran Kelurahan Bandulan
              </p>
            </div>
          </div>

          {/* Center search & period selection */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-xl md:mx-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, NIK, TPQ, gereja, masjid, makam, RW..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-3 focus:ring-teal-700/15 focus:border-[#0f766e] transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300/80 rounded-[10px] px-3 py-1.5 text-xs text-slate-700 font-medium shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#0f766e]" />
              <select
                value={selectedPeriod}
                onChange={(e) => onPeriodChange(e.target.value)}
                aria-label="Pilih Periode Pencairan"
                className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                <option value="November 2026">November 2026 (Tahap IV)</option>
                <option value="Oktober 2026">Oktober 2026 (Tahap III)</option>
                <option value="September 2026">September 2026 (Tahap II)</option>
                <option value="Agustus 2026">Agustus 2026 (Tahap I)</option>
              </select>
            </div>
          </div>

          {/* Right Action & Logged in Profile */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* User Info Capsule */}
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {currentUser.name}
                      </p>
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full border ${
                        currentUser.role === 'TEACHER'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-teal-50 text-[#0f766e] border-teal-200'
                      }`}>
                        {currentUser.role === 'TEACHER' ? 'Guru' : currentUser.role === 'LURAH' ? 'Lurah' : 'Kasi Kesra'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {currentUser.role === 'TEACHER'
                        ? `${currentUser.institution || 'Pengajar'} • ${currentUser.rw || 'Bandulan'}`
                        : currentUser.roleTitle}
                    </p>
                  </div>
                </div>

                {/* Session Security Indicator */}
                <div 
                  onClick={onOpenSecurityCenter}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-[10px] text-[11px] font-mono text-slate-700 transition-colors cursor-pointer"
                  title="Klik untuk membuka Pusat Keamanan & Kepatuhan UU PDP"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-slate-800">{formatTimer(sessionRemainingSeconds)}</span>
                </div>

                {/* Quick Lock Button */}
                {onLockSession && (
                  <button
                    onClick={onLockSession}
                    className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-[10px] transition-colors cursor-pointer"
                    title="Kunci Layar (Quick Screen Lock)"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-[10px] transition-colors cursor-pointer"
                  title="Keluar / Ganti Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : null}

            {/* Register CTA button (Only visible in admin mode) */}
            {currentUser?.role !== 'TEACHER' && (
              <button
                onClick={onOpenNewRegistration}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0f766e] bg-teal-50 border border-teal-600/30 rounded-[10px] hover:bg-teal-100 transition-colors cursor-pointer"
              >
                <span>+ Daftarkan Guru</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
