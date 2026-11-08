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
  MapPin
} from 'lucide-react';
import { Recipient, HonorRole } from '../types';
import { RW_LIST, HONOR_ROLES_CONFIG } from '../data/mockRecipients';

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

  const [kategori, setKategori] = useState<HonorRole>('GURU_TPQ');

  // Section A: Data Diri
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
  const [lamaBertugas, setLamaBertugas] = useState('4 Tahun');
  const [bankPenyalur, setBankPenyalur] = useState<'Bank Jatim' | 'Bank BRI' | 'Bank Mandiri' | 'Bank BSI'>('Bank Jatim');
  const [nomorRekening, setNomorRekening] = useState('');
  const [namaPemilikRekening, setNamaPemilikRekening] = useState('');

  // Section B: Tempat Tugas
  const [namaLembaga, setNamaLembaga] = useState('');
  const [nspqOrNsm, setNspqOrNsm] = useState('');
  const [pimpinanNama, setPimpinanNama] = useState('');
  const [alamatLembaga, setAlamatLembaga] = useState('');
  const [rw, setRw] = useState('RW 01');
  const [rt, setRt] = useState('RT 01');

  const [errorMsg, setErrorMsg] = useState('');

  const roleConfig = HONOR_ROLES_CONFIG[kategori];

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setNik(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nik.trim() || !namaLembaga.trim() || !nomorRekening.trim()) {
      setErrorMsg('Mohon lengkapi seluruh kolom yang wajib diisi (*).');
      return;
    }

    if (nik.length < 16) {
      setErrorMsg('Nomor Induk Kependudukan (NIK) harus berjumlah 16 digit angka.');
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
      telepon: telepon.trim() || '0812-3456-7890',
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
        { id: `DOC-${Date.now()}-4`, name: 'Laporan Presensi / Catatan Piket Tugas', type: 'PRESENSI_BULANAN', uploadDate: new Date().toISOString().slice(0, 10), status: 'PENDING' },
      ],
      attendance: {
        month: 'November 2026',
        sessionsHeld: kategori === 'GURU_TPQ' ? 16 : kategori === 'GURU_SEKOLAH_MINGGU' ? 4 : 30,
        targetSessions: kategori === 'GURU_TPQ' ? 16 : kategori === 'GURU_SEKOLAH_MINGGU' ? 4 : 30,
        santriOrStudentsCount: kategori === 'GURU_TPQ' || kategori === 'GURU_SEKOLAH_MINGGU' ? 25 : undefined,
        activityDescription: `Tugas ${roleConfig.roleName} di wilayah ${namaLembaga}`,
        reportSubmittedDate: new Date().toISOString().slice(0, 10),
        isVerifiedByRW: false,
      },
      notes: `Pengusulan baru penerima honor ${roleConfig.roleName} oleh staf Pelayanan Kesra Kelurahan Bandulan.`,
    };

    onRegisterRecipient(newRecipient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-[0_20px_40px_rgba(15,23,42,0.15)] border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0f766e] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-200 border border-white/20 text-xl">
              {roleConfig.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 bg-white/10 px-2 py-0.5 rounded">
                Formulir Her-Registrasi 2027 (Kesra Kelurahan)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Pengusulan {roleConfig.roleName} Baru
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="block text-slate-800 font-bold text-xs uppercase tracking-wider">
              Kategori Peran Honorarium (5 Role) *
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
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-[#0f766e] bg-teal-50 text-[#0f766e] font-bold ring-2 ring-teal-600/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{cfg.icon}</span>
                    <span className="text-[10px] leading-tight line-clamp-1">{cfg.roleName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section A: Identitas Kependudukan */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
              A. Data Diri Penerima Honor
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  1. Nama Lengkap (Sesuai KTP) *
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Muzakki"
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Gelar
                </label>
                <input
                  type="text"
                  value={gelar}
                  onChange={(e) => setGelar(e.target.value)}
                  placeholder="Contoh: S.Pd.I / M.Th"
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a] focus:outline-none focus:border-[#0f766e]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  2. Tempat Tanggal Lahir *
                </label>
                <input
                  type="text"
                  required
                  value={tempatTanggalLahir}
                  onChange={(e) => setTempatTanggalLahir(e.target.value)}
                  placeholder="Malang, 12 Mei 1984"
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  3. NIK (16 Digit) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={nik}
                  onChange={handleNikChange}
                  placeholder="Contoh: 3573041205840002"
                  className="h-10 w-full px-3 font-mono text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  4. Jenis Kelamin *
                </label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as any)}
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a]"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  5. Alamat Rumah *
                </label>
                <input
                  type="text"
                  required
                  value={alamatRumah}
                  onChange={(e) => setAlamatRumah(e.target.value)}
                  placeholder="Contoh: Jl. Raya Bandulan Gang 4 No. 12"
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] text-[#0f172a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">RT Rumah *</label>
                  <input
                    type="text"
                    required
                    value={rtRumah}
                    onChange={(e) => setRtRumah(e.target.value)}
                    className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">RW Rumah *</label>
                  <select
                    value={rwRumah}
                    onChange={(e) => setRwRumah(e.target.value)}
                    className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
                  >
                    {RW_LIST.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  6. No. Handphone / WA *
                </label>
                <input
                  type="tel"
                  required
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="0812-3341-8902"
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  7. Pendidikan Terakhir *
                </label>
                <select
                  value={pendidikanTerakhir}
                  onChange={(e) => setPendidikanTerakhir(e.target.value)}
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
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

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1 text-teal-800">
                  {roleConfig.durationLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={lamaBertugas}
                  onChange={(e) => setLamaBertugas(e.target.value)}
                  placeholder="Contoh: 4 Tahun"
                  className="h-10 w-full px-3 text-xs bg-teal-50 border border-teal-300 rounded-[10px] font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section B: Data Tempat Tugas / Wilayah Kerja */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0f766e]" />
              {roleConfig.sectionBTitle}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {roleConfig.institutionFieldLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={namaLembaga}
                  onChange={(e) => setNamaLembaga(e.target.value)}
                  placeholder="Nama lembaga / masjid / makam / wilayah kerja"
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px] font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama {roleConfig.pimpinanTitle} *
                </label>
                <input
                  type="text"
                  required
                  value={pimpinanNama}
                  onChange={(e) => setPimpinanNama(e.target.value)}
                  placeholder={`Nama ${roleConfig.pimpinanTitle}`}
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
                />
              </div>

              {(kategori === 'GURU_TPQ' || kategori === 'PENJAGA_TEMPAT_IBADAH') && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {roleConfig.codeFieldLabel || 'Nomor Sertifikat / Statistik'}
                  </label>
                  <input
                    type="text"
                    value={nspqOrNsm}
                    onChange={(e) => setNspqOrNsm(e.target.value)}
                    placeholder="Nomor Statistik / Sertifikat jika ada"
                    className="h-10 w-full px-3 font-mono text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
                  />
                </div>
              )}

              <div className={(kategori === 'GURU_TPQ' || kategori === 'PENJAGA_TEMPAT_IBADAH') ? 'sm:col-span-2' : 'sm:col-span-2'}>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {roleConfig.addressFieldLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={alamatLembaga}
                  onChange={(e) => setAlamatLembaga(e.target.value)}
                  placeholder="Alamat lengkap lokasi pengabdian"
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">RT Tugas *</label>
                  <input
                    type="text"
                    required
                    value={rt}
                    onChange={(e) => setRt(e.target.value)}
                    className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">RW Tugas *</label>
                  <select
                    value={rw}
                    onChange={(e) => setRw(e.target.value)}
                    className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
                  >
                    {RW_LIST.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Rekening Bank Jatim */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0f766e]" />
              8. Rekening Bank Jatim (Penyaluran Nontunai Rp 500.000/bln)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nomor Rekening Bank Jatim *
                </label>
                <input
                  type="text"
                  required
                  value={nomorRekening}
                  onChange={(e) => setNomorRekening(e.target.value)}
                  placeholder="Contoh: 0042-8819-21"
                  className="h-10 w-full px-3 font-mono text-xs bg-white border border-[#cbd5e1] rounded-[10px] font-bold"
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
                  placeholder="Sesuai buku tabungan"
                  className="h-10 w-full px-3 text-xs bg-white border border-[#cbd5e1] rounded-[10px]"
                />
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
              <span>Simpan Data & Ajukan Verifikasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
