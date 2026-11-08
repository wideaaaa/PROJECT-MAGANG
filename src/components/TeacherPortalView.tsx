import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Upload, 
  Download, 
  Printer, 
  ShieldCheck, 
  QrCode, 
  Plus, 
  Check, 
  HelpCircle, 
  Send,
  Sparkles,
  PhoneCall,
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { Recipient, DisbursementStatus, VerificationDocument } from '../types';
import { HONOR_ROLES_CONFIG } from '../data/mockRecipients';
import { OfficialHerRegistrasiView } from './OfficialHerRegistrasiView';

interface TeacherPortalViewProps {
  recipients: Recipient[];
  activeTeacherId: string;
  onSelectTeacher: (id: string) => void;
  onUpdateAttendance: (teacherId: string, newSessions: number, santriCount: number) => void;
  onReuploadDocument: (teacherId: string, docId: string, docName: string) => void;
  onSwitchToAdmin: () => void;
  selectedPeriod: string;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  recipients,
  activeTeacherId,
  onSelectTeacher,
  onUpdateAttendance,
  onReuploadDocument,
  onSwitchToAdmin,
  selectedPeriod,
}) => {
  const currentRecipient = recipients.find((r) => r.id === activeTeacherId) || recipients[0];

  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'HER_REGISTRASI' | 'PRESENSI' | 'DOKUMEN' | 'RIWAYAT'>('OVERVIEW');
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [newSessionStudents, setNewSessionStudents] = useState(currentRecipient?.attendance?.santriOrStudentsCount?.toString() || '35');
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);
  const [showOfficialPdfModal, setShowOfficialPdfModal] = useState(false);

  if (!currentRecipient) return null;

  const roleConfig = HONOR_ROLES_CONFIG[currentRecipient.kategori] || HONOR_ROLES_CONFIG.GURU_TPQ;

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newCount = Math.min(
      currentRecipient.attendance.sessionsHeld + 1,
      currentRecipient.attendance.targetSessions + 2
    );
    const students = parseInt(newSessionStudents, 10) || currentRecipient.attendance.santriOrStudentsCount || 25;
    onUpdateAttendance(currentRecipient.id, newCount, students);
    setShowAddSessionModal(false);
    setNewSessionTopic('');
    setUploadSuccessToast(`Catatan tugas/presensi ${roleConfig.roleName} berhasil dicatat!`);
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  const handleReupload = (doc: VerificationDocument) => {
    onReuploadDocument(currentRecipient.id, doc.id, doc.name);
    setUploadSuccessToast(`Dokumen "${doc.name}" berhasil diunggah ulang dan diserahkan ke verifikator!`);
    setTimeout(() => setUploadSuccessToast(null), 3500);
  };

  // Helper status badge strictly matching spec
  const renderStatusBadge = (status: DisbursementStatus) => {
    switch (status) {
      case 'TERSALURKAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Dana Telah Cair (Tersalurkan)
          </span>
        );
      case 'MENUNGGU_VERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Verifikasi Berkas
          </span>
        );
      case 'SIAP_SALUR':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
            <Check className="w-3.5 h-3.5" />
            Siap Masuk Batch Pencairan
          </span>
        );
      case 'PERLU_REVISI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]">
            <AlertCircle className="w-3.5 h-3.5" />
            Perlu Perbaikan Dokumen
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Switcher & User View Indicator Bar */}
      <div className="bg-gradient-to-r from-teal-900 to-[#0f766e] text-white rounded-3xl p-5 shadow-sm border border-teal-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center text-amber-300 border border-white/20 text-2xl shrink-0">
            {roleConfig.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950">
                Portal Penerima Honor (User View)
              </span>
              <span className="text-xs text-teal-200 font-medium hidden sm:inline">
                • {roleConfig.roleName}
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              Antarmuka mandiri pemantauan status honorarium, cek berkas Her-Registrasi 2027, dan log tugas.
            </p>
          </div>
        </div>

        {/* Quick Profile Selector for Demo (Across the 5 roles) */}
        <div className="flex flex-wrap items-center gap-2.5 bg-black/20 p-2 rounded-2xl border border-white/10 shrink-0">
          <span className="text-xs font-semibold text-teal-100 whitespace-nowrap">
            Ganti Akun Demo:
          </span>
          <select
            value={currentRecipient.id}
            onChange={(e) => onSelectTeacher(e.target.value)}
            className="text-xs bg-white text-slate-800 font-semibold py-1.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer max-w-[240px] truncate"
          >
            {recipients.map((r) => {
              const cfg = HONOR_ROLES_CONFIG[r.kategori] || HONOR_ROLES_CONFIG.GURU_TPQ;
              return (
                <option key={r.id} value={r.id}>
                  {cfg.icon} {r.nama} ({cfg.roleName} - {r.rw})
                </option>
              );
            })}
          </select>
          <button
            onClick={onSwitchToAdmin}
            className="px-3 py-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            Kembali ke Admin Kesra
          </button>
        </div>
      </div>

      {/* Toast */}
      {uploadSuccessToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccessToast}</span>
        </div>
      )}

      {/* Main Grid: Left ID Card & Profile, Right Active Subtab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Official ID Card */}
        <div className="space-y-4">
          {/* Card: Kartu Tanda Penerima Honor Digital */}
          <div className="bg-gradient-to-br from-teal-950 via-[#0f766e] to-teal-800 text-white rounded-3xl p-6 shadow-md border border-teal-600/40 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute top-2 right-3 text-[10px] font-mono text-teal-300 uppercase tracking-widest">
              BANDULAN-2027
            </div>

            <div className="flex items-center gap-2 mb-4 border-b border-white/15 pb-3">
              <span className="text-base">🏛️</span>
              <div>
                <p className="text-[10px] font-bold text-teal-200 tracking-wider uppercase">
                  PEMERINTAH KOTA MALANG
                </p>
                <p className="text-xs font-extrabold text-white">
                  KARTU PENERIMA HONOR RESMI (T.A. 2027)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <img
                src={currentRecipient.avatarUrl}
                alt={currentRecipient.nama}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/60 shadow-sm shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/30 inline-block mb-1">
                  {roleConfig.roleName}
                </span>
                <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                  {currentRecipient.nama}
                </h3>
                {currentRecipient.gelar && (
                  <p className="text-xs text-teal-200">{currentRecipient.gelar}</p>
                )}
                <p className="font-mono text-xs text-teal-100 tracking-wider mt-0.5">
                  NIK: {currentRecipient.nik}
                </p>
              </div>
            </div>

            {/* Institution & RW details */}
            <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-teal-300 uppercase block font-semibold">Tempat Tugas</span>
                <span className="font-bold text-white text-xs truncate block">{currentRecipient.namaLembaga}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-300 uppercase block font-semibold">Wilayah</span>
                <span className="font-bold text-white text-xs">{currentRecipient.rw} / {currentRecipient.rt}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-300 uppercase block font-semibold">Masa Pengabdian</span>
                <span className="font-semibold text-teal-100 text-xs">{currentRecipient.lamaBertugas || `${currentRecipient.masaKerjaTahun} Tahun`}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-300 uppercase block font-semibold">ID Registrasi</span>
                <span className="font-mono text-teal-200 text-xs">{currentRecipient.id}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-teal-200">
              <span className="flex items-center gap-1 font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                Honor Rp 500.000 / Bulan (Bank Jatim)
              </span>
              <QrCode className="w-5 h-5 text-teal-100" />
            </div>
          </div>

          {/* Teacher Navigation Subtabs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-xs space-y-1">
            <button
              onClick={() => setActiveSubTab('OVERVIEW')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSubTab === 'OVERVIEW'
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0f766e]" />
                Ringkasan & Status Honor
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveSubTab('HER_REGISTRASI')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSubTab === 'HER_REGISTRASI'
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0f766e]" />
                Form Her-Registrasi 2027
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Resmi PDF
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('PRESENSI')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSubTab === 'PRESENSI'
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0f766e]" />
                Logbook Tugas & Presensi
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-[#0f766e]">
                {currentRecipient.attendance.sessionsHeld} Sesi
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('DOKUMEN')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSubTab === 'DOKUMEN'
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0f766e]" />
                Berkas Lampiran Persyaratan
              </span>
              {currentRecipient.status === 'PERLU_REVISI' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse font-bold">
                  Perlu Revisi
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('RIWAYAT')}
              className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSubTab === 'RIWAYAT'
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0f766e]" />
                Riwayat SP2D & Pencairan
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Quick Help Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 text-xs text-slate-600 space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#0f766e]" />
              Layanan Informasi Kesra Bandulan
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ada kendala rekening Bank Jatim, pergantian takmir/ketua RW, atau pertanyaan berkas Her-Registrasi 2027?
            </p>
            <button
              onClick={() => setShowOfficialPdfModal(true)}
              className="w-full py-2 bg-white hover:bg-teal-50 text-[#0f766e] font-bold text-xs rounded-xl border border-teal-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Form Her-Registrasi 2027</span>
            </button>
          </div>
        </div>

        {/* Right 2-Columns: Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* SUBTAB 1: OVERVIEW & STATUS INSENTIF */}
          {activeSubTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Main Status Hero Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Tahun Anggaran & Periode Penyaluran
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Tahun Anggaran 2027 • {selectedPeriod}
                    </h3>
                  </div>
                  <div>{renderStatusBadge(currentRecipient.status)}</div>
                </div>

                {/* Nominal & Bank Payout Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-4 space-y-1">
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                      Besaran Honorarium Bersih
                    </span>
                    <p className="text-3xl font-extrabold text-[#0f766e] tabular-nums">
                      Rp {currentRecipient.nominalPerBulan.toLocaleString('id-ID')}
                    </p>
                    <p className="text-[11px] text-teal-700">
                      Disalurkan nontunai via Bank Jatim (Bebas Potongan APBD)
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Rekening Penerima (Bank Jatim)
                    </span>
                    <p className="text-lg font-bold text-slate-800">
                      {currentRecipient.bankPenyalur}
                    </p>
                    <p className="font-mono text-sm font-semibold text-slate-600">
                      {currentRecipient.nomorRekening}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      a.n. {currentRecipient.namaPemilikRekening}
                    </p>
                  </div>
                </div>

                {/* Important Alert Notice if Revision Needed */}
                {currentRecipient.status === 'PERLU_REVISI' && (
                  <div className="p-4 rounded-2xl border border-rose-300 bg-rose-50 text-rose-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Catatan Penting dari Verifikator Kesra Kelurahan:</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      {currentRecipient.notes || 'Mohon periksa kembali berkas nomor rekening atau surat tugas Anda.'}
                    </p>
                    <button
                      onClick={() => setActiveSubTab('DOKUMEN')}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
                    >
                      Perbaiki & Unggah Berkas Sekarang →
                    </button>
                  </div>
                )}

                {/* Payout Details Confirmation */}
                {currentRecipient.status === 'TERSALURKAN' && (
                  <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/60 text-emerald-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Penyaluran Berhasil Dibukukan
                      </span>
                      <span className="font-mono text-[11px] text-emerald-700">
                        {currentRecipient.referenceNumber || 'SP2D-BDL/2026/11/0014'}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      Dana honorarium telah ditransfer ke rekening Bank Jatim pada <strong>{currentRecipient.lastPayoutDate || '1 November 2026 10:15 WIB'}</strong>.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => setShowOfficialPdfModal(true)}
                        className="px-3.5 py-1.5 text-xs font-bold text-[#0f766e] bg-white border border-teal-300 rounded-xl hover:bg-teal-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Dokumen Form Her-Registrasi 2027</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Her-Registrasi Quick Summary Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0f766e]" />
                    Ringkasan Form Her-Registrasi 2027
                  </h4>
                  <button
                    onClick={() => setActiveSubTab('HER_REGISTRASI')}
                    className="text-xs font-bold text-[#0f766e] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Seluruh Isian Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Peran Terdaftar</span>
                    <span className="font-bold text-slate-800">{roleConfig.roleName}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">{roleConfig.durationLabel.slice(3)}</span>
                    <span className="font-bold text-slate-800">{currentRecipient.lamaBertugas || `${currentRecipient.masaKerjaTahun} Tahun`}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Tempat Tugas</span>
                    <span className="font-bold text-slate-800 truncate block">{currentRecipient.namaLembaga}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Pengesah</span>
                    <span className="font-bold text-teal-800">{roleConfig.pimpinanTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: HER REGISTRASI 2027 RESMI (Direct Preview & Print) */}
          {activeSubTab === 'HER_REGISTRASI' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {roleConfig.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Format cetak resmi sesuai petunjuk teknis Kelurahan Bandulan Tahun Anggaran 2027.
                  </p>
                </div>
                <button
                  onClick={() => setShowOfficialPdfModal(true)}
                  className="px-4 py-2 bg-[#0f766e] hover:bg-[#0d9488] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Dokumen Resmi</span>
                </button>
              </div>

              {/* Render the actual form directly */}
              <OfficialHerRegistrasiView
                recipient={currentRecipient}
              />
            </div>
          )}

          {/* SUBTAB 3: PRESENSI / LOGBOOK TUGAS */}
          {activeSubTab === 'PRESENSI' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Buku Logbook Pelayanan & Kehadiran ({roleConfig.roleName})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Laporan tugas pengabdian di {currentRecipient.namaLembaga} ({currentRecipient.rw})
                  </p>
                </div>

                <button
                  onClick={() => setShowAddSessionModal(true)}
                  className="px-4 py-2 bg-[#0f766e] hover:bg-[#0d9488] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Catatan Tugas</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Deskripsi Pelayanan</span>
                  <span className="font-semibold text-slate-800">{currentRecipient.attendance.activityDescription || `Pelayanan ${roleConfig.roleName}`}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Kehadiran / Piket</span>
                  <span className="text-base font-bold text-[#0f766e]">{currentRecipient.attendance.sessionsHeld} Sesi Terpenuhi</span>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 4: DOKUMEN LAMPIRAN */}
          {activeSubTab === 'DOKUMEN' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Lampiran Dokumen Her-Registrasi 2027
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sesuai NB Formulir: Lampiran di klip jadi 1 dengan Form Her Registrasi.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {currentRecipient.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center font-bold shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                        <p className="text-[10px] text-slate-400">Diunggah: {doc.uploadDate}</p>
                        {doc.notes && (
                          <p className="text-xs text-rose-600 font-semibold mt-1">
                            Catatan: {doc.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        doc.status === 'VALID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {doc.status}
                      </span>
                      <button
                        onClick={() => handleReupload(doc)}
                        className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-[#0f766e] rounded-lg transition-colors cursor-pointer"
                      >
                        Unggah Ulang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBTAB 5: RIWAYAT PENCAIRAN */}
          {activeSubTab === 'RIWAYAT' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Riwayat SP2D & Penyaluran Honorarium
              </h3>
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Tahun Anggaran 2027 • SP2D Bank Jatim</span>
                  <span className="text-slate-500 text-[11px]">Nomor Referensi: {currentRecipient.referenceNumber || 'SP2D-BDL/2026/11/0014'}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#0f766e]">Rp 500.000</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">✓ Tersalurkan</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Session Log */}
      {showAddSessionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Catat Tugas / Presensi Pelayanan
            </h3>
            <form onSubmit={handleAddSession} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Deskripsi / Materi Kegiatan
                </label>
                <input
                  type="text"
                  required
                  value={newSessionTopic}
                  onChange={(e) => setNewSessionTopic(e.target.value)}
                  placeholder="Contoh: Mengajar tajwid / Piket kebersihan tempat ibadah / Pemulasaraan jenazah"
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSessionModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0f766e] text-white rounded-xl cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Official Form PDF */}
      {showOfficialPdfModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[95vh] overflow-y-auto p-4 sm:p-6 shadow-2xl">
            <OfficialHerRegistrasiView
              recipient={currentRecipient}
              onClose={() => setShowOfficialPdfModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
