import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  Check, 
  Building2, 
  CreditCard, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  KeyRound, 
  ArrowRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Recipient, ReligiousCategory, AuthUser } from '../types';
import { RW_LIST } from '../data/mockRecipients';

interface SelfRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegister: (newRecipient: Recipient, autoLoginUser?: AuthUser) => void;
}

export const SelfRegistrationModal: React.FC<SelfRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccessRegister,
}) => {
  if (!isOpen) return null;

  // Form states
  const [nama, setNama] = useState('');
  const [gelar, setGelar] = useState('');
  const [nik, setNik] = useState('');
  const [telepon, setTelepon] = useState('');
  const [pin, setPin] = useState('123456');
  const [kategori, setKategori] = useState<ReligiousCategory>('GURU_NGAJI');
  const [namaLembaga, setNamaLembaga] = useState('');
  const [alamatLembaga, setAlamatLembaga] = useState('');
  const [rw, setRw] = useState('RW 03');
  const [rt, setRt] = useState('RT 02');
  const [masaKerjaTahun, setMasaKerjaTahun] = useState('3');
  const [santriCount, setSantriCount] = useState('30');
  const [bankPenyalur, setBankPenyalur] = useState<'Bank Jatim' | 'Bank BRI' | 'Bank Mandiri' | 'Bank BSI'>('Bank Jatim');
  const [nomorRekening, setNomorRekening] = useState('');
  const [namaPemilikRekening, setNamaPemilikRekening] = useState('');
  const [integrityAgreed, setIntegrityAgreed] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredRecipient, setRegisteredRecipient] = useState<Recipient | null>(null);

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setNik(val);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nama.trim() || !nik.trim() || !telepon.trim() || !namaLembaga.trim() || !nomorRekening.trim()) {
      setErrorMessage('Mohon lengkapi seluruh kolom wajib bertanda bintang (*).');
      return;
    }

    if (nik.length < 16) {
      setErrorMessage('Nomor Induk Kependudukan (NIK) harus berjumlah 16 digit angka sesuai KTP Anda.');
      return;
    }

    if (!integrityAgreed) {
      setErrorMessage('Anda wajib mencentang surat pernyataan kebenaran data sebelum melanjutkan.');
      return;
    }

    const maskedNik = `${nik.slice(0, 6)}******${nik.slice(12)}`;

    let kategoriLabel = 'Guru Ngaji (TPQ/Madrasah)';
    if (kategori === 'GURU_SEKOLAH_MINGGU') kategoriLabel = 'Guru Sekolah Minggu';
    if (kategori === 'GURU_PASRAMAN') kategoriLabel = 'Guru Pasraman Hindu';
    if (kategori === 'GURU_VIHARA') kategoriLabel = 'Guru Sekolah Buddhis / Vihara';

    const newId = `REC-BDL-${Math.floor(100 + Math.random() * 900)}`;

    const newRecipient: Recipient = {
      id: newId,
      nik,
      maskedNik,
      nama: nama.trim(),
      gelar: gelar.trim() || undefined,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      telepon: telepon.trim(),
      kategori,
      kategoriLabel,
      namaLembaga: namaLembaga.trim(),
      alamatLembaga: alamatLembaga.trim() || `Jl. Raya Bandulan, ${rw}`,
      rw,
      rt,
      masaKerjaTahun: parseInt(masaKerjaTahun, 10) || 1,
      bankPenyalur,
      nomorRekening: nomorRekening.trim(),
      namaPemilikRekening: namaPemilikRekening.trim() || nama.trim(),
      nominalPerBulan: 500000,
      status: 'MENUNGGU_VERIFIKASI',
      statusUpdateDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      dukcapilVerified: true,
      documents: [
        { id: `DOC-${Date.now()}-1`, name: 'KTP Elektronik Terverifikasi Dukcapil Kota Malang', type: 'KTP', uploadDate: new Date().toISOString().slice(0, 10), status: 'VALID' },
        { id: `DOC-${Date.now()}-2`, name: `SK Pengangkatan Pengajar ${namaLembaga}`, type: 'SK_MENGAJAR', uploadDate: new Date().toISOString().slice(0, 10), status: 'VALID' },
        { id: `DOC-${Date.now()}-3`, name: `Buku Tabungan ${bankPenyalur}`, type: 'BUKU_REKENING', uploadDate: new Date().toISOString().slice(0, 10), status: 'VALID' },
        { id: `DOC-${Date.now()}-4`, name: 'Laporan Presensi Kehadiran Awal', type: 'PRESENSI_BULANAN', uploadDate: new Date().toISOString().slice(0, 10), status: 'PENDING' },
      ],
      attendance: {
        month: 'November 2026',
        sessionsHeld: 16,
        targetSessions: 16,
        santriOrStudentsCount: parseInt(santriCount, 10) || 25,
        reportSubmittedDate: new Date().toISOString().slice(0, 10),
        isVerifiedByRW: false,
      },
      notes: 'Pendaftaran mandiri oleh pengajar melalui portal pendaftaran SIKB Bandulan.',
    };

    setRegisteredRecipient(newRecipient);
    setIsSuccess(true);
  };

  const handleProceedLogin = () => {
    if (!registeredRecipient) return;

    const authUser: AuthUser = {
      id: `USR-${registeredRecipient.id}`,
      name: registeredRecipient.nama,
      role: 'TEACHER',
      roleTitle: registeredRecipient.kategoriLabel,
      avatarUrl: registeredRecipient.avatarUrl,
      nipOrNik: registeredRecipient.nik,
      teacherId: registeredRecipient.id,
      rw: registeredRecipient.rw,
      institution: registeredRecipient.namaLembaga,
    };

    onSuccessRegister(registeredRecipient, authUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-[0_20px_50px_rgba(15,23,42,0.15)] border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-[#0f766e] to-teal-800 text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/20 shrink-0">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950">
                  Pendaftaran Mandiri
                </span>
                <span className="text-xs text-teal-200 font-mono">
                  SIKB Bandulan 2026
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Formulir Pendaftaran Pengajar Keagamaan
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {isSuccess && registeredRecipient ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-slate-900">
                  Pendaftaran Mandiri Berhasil Diajukan!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Data Anda atas nama <strong>{registeredRecipient.nama}</strong> telah berhasil didaftarkan ke sistem SIKB Kelurahan Bandulan dengan nomor ID <strong>{registeredRecipient.id}</strong>.
                </p>
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-1 text-teal-900 mt-3">
                  <p className="text-xs font-bold">Ringkasan Akun Pengajar Anda:</p>
                  <p className="font-mono text-xs">NIK KTP: <strong>{registeredRecipient.nik}</strong></p>
                  <p className="text-xs">Lembaga: <strong>{registeredRecipient.namaLembaga}</strong> ({registeredRecipient.rw})</p>
                  <p className="text-xs">Bank Penyalur: <strong>{registeredRecipient.bankPenyalur} • {registeredRecipient.nomorRekening}</strong></p>
                  <p className="text-xs">Besaran Insentif: <strong className="text-emerald-700">Rp 500.000 / bulan</strong></p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleProceedLogin}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] text-white font-bold text-xs rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Langsung Masuk ke Portal Guru Saya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-3 bg-white text-slate-700 border border-slate-300 rounded-[10px] hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Kembali ke Halaman Login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Identitas Pribadi */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
                  1. Identitas Pribadi & Validasi NIK Kota Malang
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nomor Induk Kependudukan (NIK 16 Digit) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={nik}
                        onChange={handleNikChange}
                        placeholder="Contoh: 3573041205840002"
                        className="h-[44px] w-full px-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                      />
                      {nik.length === 16 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5" /> 16 Digit Sah
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Lengkap (Sesuai KTP) *
                    </label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Ahmad Muzakki"
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Gelar / Panggilan Keagamaan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={gelar}
                      onChange={(e) => setGelar(e.target.value)}
                      placeholder="Contoh: S.Pd.I / Ustadz / Bu Guru"
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp / HP Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="Contoh: 0812-3456-7890"
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Kategori & Tempat Mengajar */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0f766e]" />
                  2. Kategori Pengajar & Wilayah Penugasan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Kategori Keagamaan *
                    </label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value as any)}
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    >
                      <option value="GURU_NGAJI">Guru Ngaji (TPQ/Madrasah)</option>
                      <option value="GURU_SEKOLAH_MINGGU">Guru Sekolah Minggu</option>
                      <option value="GURU_PASRAMAN">Pasraman Hindu</option>
                      <option value="GURU_VIHARA">Vihara Buddhis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Wilayah Rukun Warga (RW) *
                    </label>
                    <select
                      value={rw}
                      onChange={(e) => setRw(e.target.value)}
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    >
                      {RW_LIST.map((r) => (
                        <option key={r} value={r}>
                          {r} Kelurahan Bandulan
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Rukun Tetangga (RT) *
                    </label>
                    <input
                      type="text"
                      required
                      value={rt}
                      onChange={(e) => setRt(e.target.value)}
                      placeholder="Contoh: RT 02"
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Tempat Ibadah / Lembaga Mengajar *
                    </label>
                    <input
                      type="text"
                      required
                      value={namaLembaga}
                      onChange={(e) => setNamaLembaga(e.target.value)}
                      placeholder="Contoh: TPQ Al-Ikhlas / Sekolah Minggu GKJW Bandulan"
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Masa Mengajar (Tahun)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={masaKerjaTahun}
                      onChange={(e) => setMasaKerjaTahun(e.target.value)}
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Rekening Bank Penyalur */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0f766e]" />
                  3. Rekening Bank Penyalur (Nontunai Bebas Potongan)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Bank Penyalur *
                    </label>
                    <select
                      value={bankPenyalur}
                      onChange={(e) => setBankPenyalur(e.target.value as any)}
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    >
                      <option value="Bank Jatim">Bank Jatim (Rekomendasi Pemkot)</option>
                      <option value="Bank BRI">Bank BRI</option>
                      <option value="Bank Mandiri">Bank Mandiri</option>
                      <option value="Bank BSI">Bank BSI</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nomor Rekening *
                    </label>
                    <input
                      type="text"
                      required
                      value={nomorRekening}
                      onChange={(e) => setNomorRekening(e.target.value)}
                      placeholder="Contoh: 0042-8819-21"
                      className="h-[44px] w-full px-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Pemilik Rekening *
                    </label>
                    <input
                      type="text"
                      required
                      value={namaPemilikRekening}
                      onChange={(e) => setNamaPemilikRekening(e.target.value)}
                      placeholder="Wajib sama dengan nama di KTP"
                      className="h-[44px] w-full px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Pernyataan Integritas */}
              <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integrityAgreed}
                    onChange={(e) => setIntegrityAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-[#0f766e] focus:ring-[#0f766e]"
                  />
                  <span className="text-[11px] text-teal-900 leading-relaxed font-medium">
                    Saya menyatakan dengan sesungguhnya bahwa data yang saya masukkan adalah benar dan saya aktif mengajar pendidikan keagamaan di Kelurahan Bandulan, Kota Malang.
                  </span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] rounded-[10px] shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Kirim Pendaftaran Mandiri</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
