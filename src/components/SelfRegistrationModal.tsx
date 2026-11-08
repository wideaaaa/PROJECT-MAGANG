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
  MapPin,
  Clock
} from 'lucide-react';
import { Recipient, HonorRole, AuthUser } from '../types';
import { RW_LIST, HONOR_ROLES_CONFIG } from '../data/mockRecipients';

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

  // Selected Role from the 5 official categories
  const [kategori, setKategori] = useState<HonorRole>('GURU_TPQ');

  // Form states - Section A (Data Diri)
  const [nama, setNama] = useState('');
  const [gelar, setGelar] = useState('');
  const [tempatTanggalLahir, setTempatTanggalLahir] = useState('Malang, ');
  const [nik, setNik] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [alamatRumah, setAlamatRumah] = useState('');
  const [rtRumah, setRtRumah] = useState('RT 01');
  const [rwRumah, setRwRumah] = useState('RW 01');
  const [telepon, setTelepon] = useState('');
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState('SMA / Sederajat');
  const [bankPenyalur, setBankPenyalur] = useState<'Bank Jatim' | 'Bank BRI' | 'Bank Mandiri' | 'Bank BSI'>('Bank Jatim');
  const [nomorRekening, setNomorRekening] = useState('');
  const [namaPemilikRekening, setNamaPemilikRekening] = useState('');
  const [lamaBertugas, setLamaBertugas] = useState('3 Tahun');

  // Form states - Section B (Data Tempat Tugas / Wilayah Kerja)
  const [namaLembaga, setNamaLembaga] = useState('');
  const [nspqOrNsm, setNspqOrNsm] = useState('');
  const [pimpinanNama, setPimpinanNama] = useState('');
  const [alamatLembaga, setAlamatLembaga] = useState('');
  const [rw, setRw] = useState('RW 01');
  const [rt, setRt] = useState('RT 01');

  // Security PIN
  const [pin, setPin] = useState('123456');
  const [integrityAgreed, setIntegrityAgreed] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredRecipient, setRegisteredRecipient] = useState<Recipient | null>(null);

  const roleConfig = HONOR_ROLES_CONFIG[kategori];

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
      setErrorMessage('Nomor Induk Kependudukan (NIK) harus 16 digit sesuai e-KTP Kota Malang.');
      return;
    }

    if (!integrityAgreed) {
      setErrorMessage('Anda wajib mencentang surat pernyataan kebenaran data formulir her-registrasi.');
      return;
    }

    const maskedNik = `${nik.slice(0, 6)}******${nik.slice(12)}`;
    const newId = `REC-BDL-${kategori.slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecipient: Recipient = {
      id: newId,
      nik,
      maskedNik,
      nama: nama.trim(),
      gelar: gelar.trim() || undefined,
      tempatTanggalLahir: tempatTanggalLahir.trim(),
      jenisKelamin,
      alamatRumah: alamatRumah.trim() || `Jl. Raya Bandulan, ${rwRumah}`,
      rtRumah,
      rwRumah,
      telepon: telepon.trim(),
      pendidikanTerakhir,
      lamaBertugas,
      masaKerjaTahun: parseInt(lamaBertugas.replace(/\D/g, ''), 10) || 1,
      bankPenyalur,
      nomorRekening: nomorRekening.trim(),
      namaPemilikRekening: namaPemilikRekening.trim() || nama.trim(),
      nominalPerBulan: 500000,
      kategori,
      kategoriLabel: roleConfig.categoryName,
      namaLembaga: namaLembaga.trim(),
      nspqOrNsm: nspqOrNsm.trim() || undefined,
      pimpinanNama: pimpinanNama.trim() || roleConfig.pimpinanTitle,
      pimpinanJabatan: roleConfig.pimpinanTitle,
      alamatLembaga: alamatLembaga.trim() || `Jl. Raya Bandulan, ${rw}`,
      rw,
      rt,
      tahunAnggaran: '2027',
      avatarUrl: jenisKelamin === 'Perempuan' 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'MENUNGGU_VERIFIKASI',
      statusUpdateDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      dukcapilVerified: true,
      documents: [
        { id: `DOC-${Date.now()}-1`, name: 'Fotocopy e-KTP (1 Lembar)', type: 'KTP', uploadDate: new Date().toISOString().slice(0, 10), status: 'VALID' },
        { id: `DOC-${Date.now()}-2`, name: `Fotocopy Rekening ${bankPenyalur} (1 Lembar)`, type: 'BUKU_REKENING', uploadDate: new Date().toISOString().slice(0, 10), status: 'VALID' },
        { id: `DOC-${Date.now()}-3`, name: `Surat Tugas ${roleConfig.roleName}`, type: 'SK_MENGAJAR', uploadDate: new Date().toISOString().slice(0, 10), status: 'VALID' },
        { id: `DOC-${Date.now()}-4`, name: 'Laporan Presensi / Piket Layanan', type: 'PRESENSI_BULANAN', uploadDate: new Date().toISOString().slice(0, 10), status: 'PENDING' },
      ],
      attendance: {
        month: 'November 2026',
        sessionsHeld: kategori === 'GURU_TPQ' ? 16 : kategori === 'GURU_SEKOLAH_MINGGU' ? 4 : 30,
        targetSessions: kategori === 'GURU_TPQ' ? 16 : kategori === 'GURU_SEKOLAH_MINGGU' ? 4 : 30,
        santriOrStudentsCount: kategori === 'GURU_TPQ' || kategori === 'GURU_SEKOLAH_MINGGU' ? 25 : undefined,
        activityDescription: `Tugas pelayanan ${roleConfig.roleName} di ${namaLembaga}`,
        reportSubmittedDate: new Date().toISOString().slice(0, 10),
        isVerifiedByRW: false,
      },
      notes: `Formulir Her-Registrasi 2027 ${roleConfig.roleName} diajukan secara mandiri. Menunggu verifikasi berkas oleh Seksi Kesra.`,
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
      honorRole: registeredRecipient.kategori,
    };

    onSuccessRegister(registeredRecipient, authUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching official PDF */}
        <div className="bg-gradient-to-r from-teal-950 via-[#0f766e] to-teal-800 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/20 text-2xl shrink-0">
              {roleConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-emerald-950/70 px-2.5 py-0.5 rounded-md border border-emerald-400/30">
                  FORM HER REGISTRASI TAHUN ANGGARAN 2027
                </span>
                <span className="text-[10px] text-teal-200 hidden sm:inline">• Kelurahan Bandulan</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                {roleConfig.title}
              </h3>
              <p className="text-xs text-teal-100/80">
                Pendaftaran & Pemutakhiran Data 5 Peran Penerima Honor Kelurahan Bandulan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Selector: Choose among the 5 roles */}
            <div className="space-y-2">
              <label className="block text-slate-800 font-bold text-xs uppercase tracking-wider">
                Pilih Peran / Jenis Honorarium Kelurahan Bandulan (5 Role) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(Object.keys(HONOR_ROLES_CONFIG) as HonorRole[]).map((rKey) => {
                  const cfg = HONOR_ROLES_CONFIG[rKey];
                  const isSelected = kategori === rKey;
                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => setKategori(rKey)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                        isSelected
                          ? 'border-[#0f766e] bg-teal-50 text-[#0f766e] shadow-xs ring-2 ring-teal-600/20 font-bold'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="text-xl">{cfg.icon}</span>
                      <span className="text-[11px] leading-tight line-clamp-2">{cfg.roleName}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0f766e] mt-0.5"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* A. DATA DIRI (Matches the 9 PDF items exactly) */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
                  A. DATA DIRI (Sesuai e-KTP & Rekening Bank Jatim)
                </h4>
                <span className="text-[10px] text-slate-500 font-medium">9 Kolom Wajib</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* 1. Nama Lengkap */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    1. Nama Lengkap (Sesuai KTP) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Ahmad Muzakki"
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e] font-semibold"
                  />
                </div>

                {/* Gelar */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Gelar (Opsional)
                  </label>
                  <input
                    type="text"
                    value={gelar}
                    onChange={(e) => setGelar(e.target.value)}
                    placeholder="Contoh: S.Pd.I, S.Pd, S.Th, Lc."
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                {/* 2. Tempat Tanggal Lahir */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    2. Tempat Tanggal Lahir *
                  </label>
                  <input
                    type="text"
                    required
                    value={tempatTanggalLahir}
                    onChange={(e) => setTempatTanggalLahir(e.target.value)}
                    placeholder="Contoh: Malang, 12 Mei 1984"
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                {/* 3. NIK */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    3. NIK (16 Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={handleNikChange}
                    placeholder="357304xxxxxxxxxx"
                    className="w-full h-10 px-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {nik.length}/16 Digit KTP Kelurahan Bandulan
                  </span>
                </div>

                {/* 4. Jenis Kelamin */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    4. Jenis Kelamin *
                  </label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e] font-semibold"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* 5. Alamat Rumah, RT, RW */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    5. Alamat Rumah (Bandulan) *
                  </label>
                  <input
                    type="text"
                    required
                    value={alamatRumah}
                    onChange={(e) => setAlamatRumah(e.target.value)}
                    placeholder="Contoh: Jl. Raya Bandulan Gang 4 No. 12"
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      RT Rumah *
                    </label>
                    <input
                      type="text"
                      required
                      value={rtRumah}
                      onChange={(e) => setRtRumah(e.target.value)}
                      placeholder="RT 02"
                      className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      RW Rumah *
                    </label>
                    <select
                      value={rwRumah}
                      onChange={(e) => setRwRumah(e.target.value)}
                      className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 font-semibold"
                    >
                      {RW_LIST.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 6. Nomor HP */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    6. Nomor HP / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full h-10 px-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900"
                  />
                </div>

                {/* 7. Pendidikan Terakhir */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    7. Pendidikan Terakhir *
                  </label>
                  <select
                    value={pendidikanTerakhir}
                    onChange={(e) => setPendidikanTerakhir(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 font-semibold"
                  >
                    <option value="SD">SD / Sederajat</option>
                    <option value="SMP / MTs">SMP / MTs</option>
                    <option value="SMA / SMK / MA">SMA / SMK / MA</option>
                    <option value="Pondok Pesantren">Pondok Pesantren</option>
                    <option value="Diploma (D3)">Diploma (D3)</option>
                    <option value="Sarjana (S1)">Sarjana (S1)</option>
                    <option value="Magister (S2)">Magister (S2)</option>
                  </select>
                </div>

                {/* 9. Lama Mengajar / Lama Marbot / Lama Perawat Jenazah / Lama Penjaga Makam */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-teal-800">
                    {roleConfig.durationLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={lamaBertugas}
                    onChange={(e) => setLamaBertugas(e.target.value)}
                    placeholder="Contoh: 5 Tahun"
                    className="w-full h-10 px-3 text-xs bg-teal-50/50 border border-teal-300 rounded-[10px] text-slate-900 font-bold focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                {/* 8. Nomor Rekening (Bank Jatim) */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    8. Nomor Rekening (Bank Jatim) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={nomorRekening}
                      onChange={(e) => setNomorRekening(e.target.value)}
                      placeholder="Nomor Rekening Bank Jatim"
                      className="w-full h-10 px-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 font-bold"
                    />
                    <input
                      type="text"
                      required
                      value={namaPemilikRekening}
                      onChange={(e) => setNamaPemilikRekening(e.target.value)}
                      placeholder="Nama Sesuai Buku Tabungan"
                      className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Pencairan honorarium wajib menggunakan rekening aktif Bank Jatim (Mitra Pemkot Malang).
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Bank Penyalur
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Bank Jatim (Utama Pemkot)"
                    className="w-full h-10 px-3 text-xs bg-slate-100 border border-slate-200 rounded-[10px] text-slate-600 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* B. DATA TEMPAT TUGAS / WILAYAH KERJA */}
            <div className="space-y-4 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0f766e]" />
                  {roleConfig.sectionBTitle}
                </h4>
                <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {roleConfig.roleName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Field 1: Nama Lembaga / Tempat Tugas */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    {roleConfig.institutionFieldLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaLembaga}
                    onChange={(e) => setNamaLembaga(e.target.value)}
                    placeholder={
                      kategori === 'GURU_TPQ' ? 'Contoh: TPQ Al-Ikhlas Bandulan' :
                      kategori === 'GURU_SEKOLAH_MINGGU' ? 'Contoh: Sekolah Minggu GKJW Bandulan' :
                      kategori === 'PENJAGA_TEMPAT_IBADAH' ? 'Contoh: Masjid Baitul Makmur' :
                      kategori === 'PERAWAT_JENAZAH' ? 'Contoh: Wilayah RW 02 Kelurahan Bandulan' :
                      'Contoh: TPU Makam Bandulan Kulon'
                    }
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 font-semibold focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                {/* Field 2: Pimpinan Pengesah (Kepala Sekolah / Takmir / Ketua RW) */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama {roleConfig.pimpinanTitle} *
                  </label>
                  <input
                    type="text"
                    required
                    value={pimpinanNama}
                    onChange={(e) => setPimpinanNama(e.target.value)}
                    placeholder={`Nama ${roleConfig.pimpinanTitle}`}
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                {/* Optional Field: NSPQ / NSM if applicable */}
                {(kategori === 'GURU_TPQ' || kategori === 'PENJAGA_TEMPAT_IBADAH') && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {roleConfig.codeFieldLabel || 'Nomor Sertifikat / Statistik'}
                    </label>
                    <input
                      type="text"
                      value={nspqOrNsm}
                      onChange={(e) => setNspqOrNsm(e.target.value)}
                      placeholder={kategori === 'GURU_TPQ' ? 'Contoh: 411.35.73.04.0019' : 'Contoh: NSM-3573.04.011'}
                      className="w-full h-10 px-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900"
                    />
                    {roleConfig.codeFieldSub && (
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        {roleConfig.codeFieldSub}
                      </span>
                    )}
                  </div>
                )}

                {/* Alamat Tempat Tugas */}
                <div className={(kategori === 'GURU_TPQ' || kategori === 'PENJAGA_TEMPAT_IBADAH') ? 'sm:col-span-2' : 'sm:col-span-2'}>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {roleConfig.addressFieldLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={alamatLembaga}
                    onChange={(e) => setAlamatLembaga(e.target.value)}
                    placeholder="Alamat lengkap tempat pelaksanaan tugas di Bandulan"
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:border-[#0f766e]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      RT Tugas *
                    </label>
                    <input
                      type="text"
                      required
                      value={rt}
                      onChange={(e) => setRt(e.target.value)}
                      placeholder="RT 02"
                      className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      RW Tugas *
                    </label>
                    <select
                      value={rw}
                      onChange={(e) => setRw(e.target.value)}
                      className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 font-semibold"
                    >
                      {RW_LIST.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* NB Dokumen Lampiran Info */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0f766e]" />
                NB Dokumen Persyaratan (Klip Jadi 1 dengan Form Her Registrasi):
              </span>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-slate-600">
                {roleConfig.attachments.map((att, idx) => (
                  <li key={idx} className="font-medium">{att}</li>
                ))}
              </ul>
            </div>

            {/* PIN Keamanan Portal User */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#0f766e]" />
                Pengaturan PIN Akses Masuk Portal Mandiri
              </h4>
              <p className="text-[11px] text-slate-500">
                PIN 6-digit ini akan digunakan untuk login mandiri mengecek status pencairan SP2D dan log kegiatan Anda.
              </p>
              <div className="max-w-xs">
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="6 Digit PIN (Default: 123456)"
                  className="w-full h-10 px-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900"
                />
              </div>
            </div>

            {/* Pakta Integritas */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrityAgreed}
                  onChange={(e) => setIntegrityAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#0f766e] rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-[11px] text-teal-950 leading-relaxed font-medium">
                  Saya menyatakan dengan sebenarnya bahwa seluruh isian Form Her-Registrasi (Tahun Anggaran 2027) di atas adalah sah dan benar, saya aktif mengabdi sebagai <strong>{roleConfig.roleName}</strong> di wilayah Kelurahan Bandulan, serta bersedia mematuhi ketentuan tata kelola honorarium daerah Kota Malang.
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kirim Formulir Her-Registrasi 2027</span>
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS CONFIRMATION */
          <div className="p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Her-Registrasi 2027 Berhasil
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Formulir Her-Registrasi Berhasil Disimpan!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Data Anda sebagai <strong>{registeredRecipient?.kategoriLabel}</strong> telah masuk ke antrean verifikasi Seksi Kesejahteraan Rakyat Kelurahan Bandulan untuk Tahun Anggaran 2027.
              </p>
            </div>

            {registeredRecipient && (
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 shadow-2xs">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Nomor Registrasi:</span>
                  <strong className="font-mono text-[#0f766e]">{registeredRecipient.id}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Nama Penerima:</span>
                  <strong className="text-slate-800">{registeredRecipient.nama}</strong>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Peran:</span>
                  <span className="font-semibold text-slate-700">{registeredRecipient.kategoriLabel}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Tempat Tugas:</span>
                  <span className="text-slate-700">{registeredRecipient.namaLembaga} ({registeredRecipient.rw})</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Rekening Bank:</span>
                  <span className="font-mono text-slate-700">{registeredRecipient.nomorRekening} (Bank Jatim)</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleProceedLogin}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0f766e] hover:bg-[#0d9488] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Masuk ke Dashboard Akun Saya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
