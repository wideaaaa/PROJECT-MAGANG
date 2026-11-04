import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  LogOut, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { AuthUser } from '../types';

interface LockScreenModalProps {
  currentUser: AuthUser | null;
  onUnlock: () => void;
  onLogout: () => void;
}

export const LockScreenModal: React.FC<LockScreenModalProps> = ({
  currentUser,
  onUnlock,
  onLogout,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!currentUser) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // In demo environment, allow any password or 123456
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#0f766e] flex items-center justify-center mx-auto border border-teal-200">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Sesi Dikunci Otomatis
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-2">
            Layar Terkunci
          </h3>
          <p className="text-xs text-slate-500">
            Sistem mengamankan tampilan data NIK warga Kelurahan Bandulan saat tidak ada aktivitas.
          </p>
        </div>

        {/* User Card */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center gap-3 text-left">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{currentUser.roleTitle}</p>
          </div>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <div className="relative">
            <input
              type="password"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Masukkan PIN / Kata Sandi..."
              className="w-full h-11 px-3 text-xs text-center bg-slate-50 border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#0f766e]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0f766e] hover:bg-[#0d9488] text-white text-xs font-bold rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Buka Kunci Layar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
          <button
            type="button"
            onClick={onLogout}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Akun Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
