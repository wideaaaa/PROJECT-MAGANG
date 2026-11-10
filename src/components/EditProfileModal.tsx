import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Camera, 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Sparkles,
  KeyRound,
  FileText,
  Clock,
  Layers
} from 'lucide-react';
import { AuthUser, Recipient, HonorRole } from '../types';
import { HONOR_ROLES_CONFIG } from '../data/mockRecipients';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  currentRecipient?: Recipient | null;
  onSaveProfile: (updatedUser: Partial<AuthUser>, updatedRecipient?: Partial<Recipient>) => void;
}

// Preset avatars for quick selection
const PRESET_AVATARS = [
  { label: 'Pria 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { label: 'Wanita 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Pria 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Wanita 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Pria 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { label: 'Pejabat', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentRecipient,
  onSaveProfile,
}) => {
  if (!isOpen || !currentUser) return null;

  const isTeacher = currentUser.role === 'TEACHER';

  // Active tab state
  const [activeTab, setActiveTab] = useState<'BIODATA' | 'REKENING' | 'PENUGASAN' | 'KEAMANAN'>('BIODATA');

  // Form states initialized from currentUser and currentRecipient
  const [name, setName] = useState(currentUser.name || '');
  const [gelar, setGelar] = useState(currentRecipient?.gelar || '');
  const [phone, setPhone] = useState(currentRecipient?.telepon || currentUser.phone || '081234567890');
  const [email, setEmail] = useState(currentUser.email || (isTeacher ? '' : 'kesra.bandulan@malangkota.go.id'));
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle || '');

  // Teacher / Recipient specific fields
  const [alamatRumah, setAlamatRumah] = useState(currentRecipient?.alamatRumah || 'Jl. Bandulan Gang 1');
  const [rtRumah, setRtRumah] = useState(currentRecipient?.rtRumah || '01');
  const [rwRumah, setRwRumah] = useState(currentRecipient?.rwRumah || currentRecipient?.rw || 'RW 01');
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState(currentRecipient?.pendidikanTerakhir || 'S1 Pendidikan');
  const [tempatTanggalLahir, setTempatTanggalLahir] = useState(currentRecipient?.tempatTanggalLahir || 'Malang, 12 Mei 1985');
  
  // Bank fields
  const [bankPenyalur, setBankPenyalur] = useState<'Bank Jatim' | 'Bank BRI' | 'Bank Mandiri' | 'Bank BSI'>(
    currentRecipient?.bankPenyalur || 'Bank Jatim'
  );
  const [nomorRekening, setNomorRekening] = useState(currentRecipient?.nomorRekening || '0142891029');
  const [namaPemilikRekening, setNamaPemilikRekening] = useState(currentRecipient?.namaPemilikRekening || currentUser.name || '');

  // Penugasan fields
  const [namaLembaga, setNamaLembaga] = useState(currentRecipient?.namaLembaga || currentUser.institution || '');
  const [alamatLembaga, setAlamatLembaga] = useState(currentRecipient?.alamatLembaga || 'Jl. Raya Bandulan');
  const [lamaBertugas, setLamaBertugas] = useState(currentRecipient?.lamaBertugas || '5 Tahun');
  const [pimpinanNama, setPimpinanNama] = useState(currentRecipient?.pimpinanNama || 'Drs. H. Ahmad Fauzi');
  const [pimpinanJabatan, setPimpinanJabatan] = useState(currentRecipient?.pimpinanJabatan || 'Kepala TPQ');

  // Security / PIN fields
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAvatarUrl(currentUser.avatarUrl || '');
      setRoleTitle(currentUser.roleTitle || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || currentRecipient?.telepon || '');
    }
    if (currentRecipient) {
      setGelar(currentRecipient.gelar || '');
      setAlamatRumah(currentRecipient.alamatRumah || '');
      setRtRumah(currentRecipient.rtRumah || '');
      setRwRumah(currentRecipient.rwRumah || currentRecipient.rw || '');
      setPendidikanTerakhir(currentRecipient.pendidikanTerakhir || '');
      setTempatTanggalLahir(currentRecipient.tempatTanggalLahir || '');
      setBankPenyalur(currentRecipient.bankPenyalur || 'Bank Jatim');
      setNomorRekening(currentRecipient.nomorRekening || '');
      setNamaPemilikRekening(currentRecipient.namaPemilikRekening || currentRecipient.nama || '');
      setNamaLembaga(currentRecipient.namaLembaga || '');
      setAlamatLembaga(currentRecipient.alamatLembaga || '');
      setLamaBertugas(currentRecipient.lamaBertugas || '');
      setPimpinanNama(currentRecipient.pimpinanNama || '');
      setPimpinanJabatan(currentRecipient.pimpinanJabatan || '');
    }
  }, [currentUser, currentRecipient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap tidak boleh kosong.');
      return;
    }

    if (newPin && newPin !== confirmPin) {
      setErrorMsg('Konfirmasi PIN/Kata Sandi baru tidak cocok.');
      return;
    }

    if (isTeacher && newPin && (newPin.length < 6 || !/^\d+$/.test(newPin))) {
      setErrorMsg('PIN login pengajar harus berupa 6 digit angka.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const updatedUser: Partial<AuthUser> = {
        name: name.trim(),
        avatarUrl,
        phone: phone.trim(),
        email: email.trim(),
        roleTitle: roleTitle.trim() || currentUser.roleTitle,
        institution: namaLembaga.trim() || currentUser.institution,
      };

      const updatedRecipient: Partial<Recipient> | undefined = isTeacher && currentRecipient ? {
        nama: name.trim(),
        gelar: gelar.trim(),
        telepon: phone.trim(),
        avatarUrl,
        alamatRumah: alamatRumah.trim(),
        rtRumah: rtRumah.trim(),
        rwRumah: rwRumah.trim(),
        pendidikanTerakhir,
        tempatTanggalLahir: tempatTanggalLahir.trim(),
        bankPenyalur,
        nomorRekening: nomorRekening.trim(),
        namaPemilikRekening: namaPemilikRekening.trim(),
        namaLembaga: namaLembaga.trim(),
        alamatLembaga: alamatLembaga.trim(),
        lamaBertugas: lamaBertugas.trim(),
        pimpinanNama: pimpinanNama.trim(),
        pimpinanJabatan: pimpinanJabatan.trim(),
      } : undefined;

      onSaveProfile(updatedUser, updatedRecipient);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const roleConfig = currentRecipient?.kategori 
    ? HONOR_ROLES_CONFIG[currentRecipient.kategori] 
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-[#0f766e] to-teal-800 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-teal-200 shrink-0">
              <User className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-teal-100 border border-white/20">
                  {currentUser.role === 'TEACHER' ? (roleConfig?.roleName || 'Penerima Honor') : currentUser.roleTitle}
                </span>
                <span className="text-xs text-teal-200 font-mono">
                  {currentUser.nipOrNik}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Edit Profil & Pengaturan Akun
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs Bar */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('BIODATA')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'BIODATA'
                ? 'bg-white text-[#0f766e] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Data Diri & Kontak</span>
          </button>

          {isTeacher && (
            <button
              type="button"
              onClick={() => setActiveTab('REKENING')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'REKENING'
                  ? 'bg-white text-[#0f766e] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Rekening Bank Penyalur</span>
            </button>
          )}

          {isTeacher && (
            <button
              type="button"
              onClick={() => setActiveTab('PENUGASAN')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'PENUGASAN'
                  ? 'bg-white text-[#0f766e] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Tempat Tugas & Wilayah</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('KEAMANAN')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'KEAMANAN'
                ? 'bg-white text-[#0f766e] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Keamanan Akun & PIN</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AVATAR SELECTOR & PREVIEW (Always visible at top of form) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-600 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#0f766e] text-white p-1 rounded-full shadow">
                <Camera className="w-3 h-3" />
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Foto Profil Pengguna
              </label>
              <p className="text-[11px] text-slate-500">
                Pilih salah satu preset foto resmi atau masukkan URL foto profil Anda.
              </p>

              {/* Quick Preset Avatars */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {PRESET_AVATARS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(p.url)}
                    className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === p.url ? 'border-[#0f766e] scale-110 shadow-sm' : 'border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                    title={p.label}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TAB 1: BIODATA & KONTAK */}
          {activeTab === 'BIODATA' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-teal-600"
                    placeholder="Nama lengkap sesuai KTP"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gelar Akademik / Keagamaan
                  </label>
                  <input
                    type="text"
                    value={gelar}
                    onChange={(e) => setGelar(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                    placeholder="Contoh: S.Pd.I, S.Th, Lc, dll."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIK / NIP (Identitas Terdaftar)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentUser.nipOrNik}
                      disabled
                      className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-500 cursor-not-allowed"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                      UU PDP
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Terkunci dengan verifikasi Dukcapil Kota Malang.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-teal-600"
                      placeholder="0812xxxxxxxx"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Digunakan untuk notifikasi SMS/WA payroll honorarium.
                  </p>
                </div>
              </div>

              {!isTeacher && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Kedinasan
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-teal-600"
                      placeholder="nama@malangkota.go.id"
                    />
                  </div>
                </div>
              )}

              {isTeacher && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tempat, Tanggal Lahir
                      </label>
                      <input
                        type="text"
                        value={tempatTanggalLahir}
                        onChange={(e) => setTempatTanggalLahir(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                        placeholder="Malang, 14 Mei 1982"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pendidikan Terakhir
                      </label>
                      <select
                        value={pendidikanTerakhir}
                        onChange={(e) => setPendidikanTerakhir(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600 cursor-pointer"
                      >
                        <option value="SMA/SMK/MA">SMA / SMK / MA</option>
                        <option value="Diploma (D3)">Diploma (D3)</option>
                        <option value="Sarjana (S1)">Sarjana (S1)</option>
                        <option value="Magister (S2)">Magister (S2)</option>
                        <option value="Pesantren / Salafiyah">Pondok Pesantren</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Alamat Tempat Tinggal
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={alamatRumah}
                          onChange={(e) => setAlamatRumah(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                          placeholder="Nama jalan / nomor rumah"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">RT</label>
                        <input
                          type="text"
                          value={rtRumah}
                          onChange={(e) => setRtRumah(e.target.value)}
                          className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-center font-semibold text-slate-900 focus:outline-teal-600"
                          placeholder="01"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">RW</label>
                        <input
                          type="text"
                          value={rwRumah}
                          onChange={(e) => setRwRumah(e.target.value)}
                          className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-center font-semibold text-slate-900 focus:outline-teal-600"
                          placeholder="RW 03"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: REKENING BANK PENYALUR (Khusus Penerima Honor) */}
          {activeTab === 'REKENING' && isTeacher && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Ketentuan Rekening Penyaluran:</span>
                  Sesuai juknis Pemkot Malang, rekening wajib atas nama pribadi penerima insentif pada <strong>Bank Jatim</strong> untuk menjamin kelancaran batch payroll tanpa retur bank.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bank Penyalur <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Bank Jatim', 'Bank BRI', 'Bank Mandiri', 'Bank BSI'] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBankPenyalur(b)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        bankPenyalur === b
                          ? 'border-[#0f766e] bg-teal-50 text-[#0f766e] ring-2 ring-teal-600/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                      {b === 'Bank Jatim' && (
                        <span className="block text-[9px] font-normal text-teal-700 mt-0.5">
                          (Rekomendasi)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Rekening Bank <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={nomorRekening}
                      onChange={(e) => setNomorRekening(e.target.value.replace(/\D/g, ''))}
                      required
                      className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono text-slate-900 font-bold focus:outline-teal-600"
                      placeholder="0142891029"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Hanya digit angka tanpa spasi atau tanda hubung.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pemilik Rekening (Sesuai Buku Tabungan) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={namaPemilikRekening}
                    onChange={(e) => setNamaPemilikRekening(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-teal-600"
                    placeholder="Nama sesuai buku tabungan"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Harus sama persis dengan nama pada KTP dan buku rekening.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PENUGASAN & TEMPAT TUGAS */}
          {activeTab === 'PENUGASAN' && isTeacher && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lembaga / Tempat Tugas / Masjid / Wilayah Makam <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={namaLembaga}
                    onChange={(e) => setNamaLembaga(e.target.value)}
                    required
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-teal-600"
                    placeholder="Nama TPQ / Gereja / Masjid / Makam"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap Lokasi Tugas
                </label>
                <input
                  type="text"
                  value={alamatLembaga}
                  onChange={(e) => setAlamatLembaga(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                  placeholder="Alamat lokasi tempat pengabdian"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Masa Pengabdian / Lama Bertugas
                  </label>
                  <input
                    type="text"
                    value={lamaBertugas}
                    onChange={(e) => setLamaBertugas(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                    placeholder="Contoh: 5 Tahun"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pimpinan / Takmir / Ketua RW
                  </label>
                  <input
                    type="text"
                    value={pimpinanNama}
                    onChange={(e) => setPimpinanNama(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-teal-600"
                    placeholder="Nama pimpinan lembaga"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KEAMANAN & PIN */}
          {activeTab === 'KEAMANAN' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-[#0f766e] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Autentikasi Terenkripsi SIKB</span>
                    <span className="text-[11px] text-slate-500">Sesuai standar perlindungan data UU PDP No. 27/2022</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  AKTIF & AMAN
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isTeacher ? 'Perbarui PIN Akses Mandiri (6 Digit)' : 'Ganti Kata Sandi Pejabat'}</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isTeacher 
                    ? 'Kosongkan kolom di bawah jika Anda tidak ingin mengubah PIN 6 digit Anda saat ini.' 
                    : 'Kosongkan jika tidak ingin mengubah kata sandi akses akun dinas.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isTeacher ? 'PIN Baru (6 Angka)' : 'Kata Sandi Baru'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={isTeacher ? "password" : "password"}
                        maxLength={isTeacher ? 6 : 30}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-teal-600"
                        placeholder={isTeacher ? "Contoh: 123456" : "Minimal 8 karakter"}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Konfirmasi {isTeacher ? 'PIN Baru' : 'Kata Sandi Baru'}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        maxLength={isTeacher ? 6 : 30}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-teal-600"
                        placeholder="Ulangi masukan di sebelah"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Perubahan data akan tercatat pada log audit kelurahan</span>
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
