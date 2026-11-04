import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Check, 
  AlertCircle, 
  Smartphone,
  RotateCcw
} from 'lucide-react';

interface SecurityModalMfaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reason: string) => void;
  title: string;
  description: string;
  actionLabel?: string;
  targetNominal?: number;
}

export const SecurityModalMfa: React.FC<SecurityModalMfaProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  description,
  actionLabel = 'Konfirmasi Otorisasi',
  targetNominal,
}) => {
  if (!isOpen) return null;

  const [otpCode, setOtpCode] = useState('');
  const [justification, setJustification] = useState('Otorisasi resmi pelaksanaan pencairan dana hibah insentif keagamaan.');
  const [errorMessage, setErrorMessage] = useState('');
  const [sampleOtp, setSampleOtp] = useState('782910');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 6) {
      setErrorMessage('Kode OTP verifikasi harus terdiri dari 6 digit angka.');
      return;
    }

    if (otpCode.trim() !== sampleOtp && otpCode.trim() !== '123456') {
      setErrorMessage(`Kode OTP tidak sesuai. Gunakan kode keamanan aktif (${sampleOtp} atau 123456).`);
      return;
    }

    onSuccess(justification.trim() || 'Otorisasi resmi verifikasi 2FA.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-[0_20px_50px_rgba(15,23,42,0.15)] border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 to-[#0f766e] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/20 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950">
                Verifikasi Keamanan Ganda (2FA)
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          <div className="space-y-1">
            <p className="text-slate-600 leading-relaxed">
              {description}
            </p>
            {targetNominal && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-teal-900 mt-2">
                <span className="block text-[10px] text-teal-700 font-bold uppercase">Total Nilai Transaksi:</span>
                <span className="text-lg font-extrabold text-[#0f766e] tabular-nums">
                  Rp {targetNominal.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              Masukkan 6-Digit Kode Token / OTP Aman:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setErrorMessage('');
                }}
                placeholder="Contoh: 782910"
                className="w-full h-12 text-center font-mono text-xl tracking-[0.3em] font-bold bg-slate-50 border-2 border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e] focus:bg-white"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-teal-700 font-medium">
                <Smartphone className="w-3.5 h-3.5" />
                Token Simulasi: <strong className="font-mono">{sampleOtp}</strong>
              </span>
              <button
                type="button"
                onClick={() => setOtpCode(sampleOtp)}
                className="text-[#0f766e] font-bold hover:underline cursor-pointer"
              >
                Gunakan Kode Ini
              </button>
            </div>
          </div>

          {/* Reason / Justification */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Alasan Otorisasi (Dicatat dalam Audit Trail Kepatuhan UU PDP) *
            </label>
            <textarea
              required
              rows={2}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] rounded-[10px] shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{actionLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
