import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  Check, 
  Upload, 
  Building2, 
  CreditCard, 
  AlertCircle,
  FileText,
  MapPin
} from 'lucide-react';
import { Recipient, ReligiousCategory } from '../types';
import { RW_LIST } from '../data/mockRecipients';

interface NewRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterRecipient: (newRecipient: Recipient) => void;
}

export const NewRegistrationModal: React.FC<NewRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegisterRecipient,
}) => {
  if (!isOpen) return null;

  const [nama, setNama] = useState('');
  const [gelar, setGelar] = useState('');
  const [nik, setNik] = useState('');
  const [telepon, setTelepon] = useState('');
  const [kategori, setKategori] = useState<ReligiousCategory>('GURU_NGAJI');
  const [namaLembaga, setNamaLembaga] = useState('');
  const [alamatLembaga, setAlamatLembaga] = useState('');
  const [rw, setRw] = useState('RW 03');
  const [rt, setRt] = useState('RT 02');
  const [masaKerjaTahun, setMasaKerjaTahun] = useState('4');
  const [bankPenyalur, setBankPenyalur] = useState<'Bank Jatim' | 'Bank BRI' | 'Bank Mandiri' | 'Bank BSI'>('Bank Jatim');
  const [nomorRekening, setNomorRekening] = useState('');
  const [namaPemilikRekening, setNamaPemilikRekening] = useState('');
  const [santriCount, setSantriCount] = useState('30');

  // Simple validation
  const [errorMsg, setErrorMsg] = useState('');

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only digits, up to 16
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setNik(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nik.trim() || !namaLembaga.trim() || !nomorRekening.trim()) {
      setErrorMsg('Mohon lengkapi seluruh kolom yang wajib diisi.');
      return;
    }

    if (nik.length < 16) {
      setErrorMsg('Nomor Induk Kependudukan (NIK) harus berjumlah 16 digit angka.');
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
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      telepon: telepon.trim() || '0812-3456-7890',
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
        { id: `DOC-${Date.now()}-1`, name: 'KTP Elektronik Terverifikasi Dukcapil', type: 'KTP', uploadDate: new Date().toISOString().slice(0, 10), status: 'VALID' },
        { id: `DOC-${Date.now()}-2`, name: `SK Pengangkatan Lembaga ${namaLembaga}`, type: 'SK_MENGAJAR', uploadDate: new Date().toISOString().slice(0, 10), status: 'VALID' },
        { id: `DOC-${Date.now()}-3`, name: `Buku Tabungan ${bankPenyalur}`, type: 'BUKU_REKENING', uploadDate: new Date().toISOString().slice(0, 10), status: 'VALID' },
        { id: `DOC-${Date.now()}-4`, name: 'Laporan Presensi Mengajar', type: 'PRESENSI_BULANAN', uploadDate: new Date().toISOString().slice(0, 10), status: 'PENDING' },
      ],
      attendance: {
        month: 'November 2026',
        sessionsHeld: 16,
        targetSessions: 16,
        santriOrStudentsCount: parseInt(santriCount, 10) || 25,
        reportSubmittedDate: new Date().toISOString().slice(0, 10),
        isVerifiedByRW: false,
      },
      notes: 'Pengajuan guru keagamaan baru melalui sistem formulir SIKB Bandulan.',
    };

    onRegisterRecipient(newRecipient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[16px] max-w-2xl w-full shadow-[0_20px_40px_rgba(15,23,42,0.12)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0f766e] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-200 border border-white/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 bg-white/10 px-2 py-0.5 rounded">
                Formulir Pendataan & Validasi
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Pendaftaran Guru Keagamaan Baru
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Identitas Pribadi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
              1. Identitas Kependudukan (Dukcapil Kota Malang)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={handleNikChange}
                    placeholder="Contoh: 3573041205840002"
                    className="h-[44px] w-full px-3 font-mono text-sm bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                  />
                  {nik.length === 16 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 text-[10px] font-bold flex items-center gap-0.5">
                      <Check className="w-3.5 h-3.5" /> 16 Digit Valid
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Format NIK wilayah Kota Malang (diawali 3573...)
                </p>
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
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Gelar Akademik / Keagamaan (Opsional)
                </label>
                <input
                  type="text"
                  value={gelar}
                  onChange={(e) => setGelar(e.target.value)}
                  placeholder="Contoh: S.Pd.I / M.Th. / S.Ag"
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  No. Handphone / WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  required
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="Contoh: 0812-3341-8902"
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Lembaga & Wilayah */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0f766e]" />
              2. Kategori Keagamaan & Tempat Mengajar
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Kategori Pengajar *
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                >
                  <option value="GURU_NGAJI">Guru Ngaji (TPQ / Madrasah)</option>
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
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
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
                  placeholder="Contoh: RT 03"
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Lembaga / Masjid / Gereja / Tempat Ibadah *
                </label>
                <input
                  type="text"
                  required
                  value={namaLembaga}
                  onChange={(e) => setNamaLembaga(e.target.value)}
                  placeholder="Contoh: TPQ Al-Ikhlas / Sekolah Minggu GKJW Bandulan"
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
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
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Rekening Bank Penyalur */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0f766e]" />
              3. Rekening Bank Penyalur (Nontunai)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Bank Penyalur *
                </label>
                <select
                  value={bankPenyalur}
                  onChange={(e) => setBankPenyalur(e.target.value as any)}
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
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
                  className="h-[44px] w-full px-3 font-mono text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
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
                  placeholder="Harus sama dengan nama KTP"
                  className="h-[44px] w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e] focus:ring-3 focus:ring-teal-700/15"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Simulasi Berkas Upload */}
          <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
            <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0f766e]" />
              Kelengkapan Berkas Persyaratan (Otomatis Diunggah)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-teal-800">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> KTP Elektronik Kota Malang
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> SK Pengangkatan Guru Lembaga
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Buku Rekening Aktif
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Laporan Presensi Mengajar
              </div>
            </div>
          </div>

          {/* Footer Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] rounded-[10px] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan & Ajukan Verifikasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
