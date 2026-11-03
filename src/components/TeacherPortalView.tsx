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
  ChevronRight
} from 'lucide-react';
import { Recipient, DisbursementStatus, VerificationDocument } from '../types';

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
  // Currently active teacher or default to first
  const currentTeacher = recipients.find((r) => r.id === activeTeacherId) || recipients[0];

  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'PRESENSI' | 'DOKUMEN' | 'RIWAYAT'>('OVERVIEW');
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [newSessionStudents, setNewSessionStudents] = useState(currentTeacher?.attendance?.santriOrStudentsCount?.toString() || '35');
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);

  if (!currentTeacher) return null;

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newCount = Math.min(
      currentTeacher.attendance.sessionsHeld + 1,
      currentTeacher.attendance.targetSessions + 2
    );
    const students = parseInt(newSessionStudents, 10) || currentTeacher.attendance.santriOrStudentsCount;
    onUpdateAttendance(currentTeacher.id, newCount, students);
    setShowAddSessionModal(false);
    setNewSessionTopic('');
    setUploadSuccessToast('Sesi mengajar berhasil dicatat dalam Laporan Presensi Bulanan!');
    setTimeout(() => setUploadSuccessToast(null), 3000);
  };

  const handleReupload = (doc: VerificationDocument) => {
    onReuploadDocument(currentTeacher.id, doc.id, doc.name);
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
      <div className="bg-gradient-to-r from-teal-900 to-[#0f766e] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-teal-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-teal-200 border border-white/20 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950">
                Tampilan Pengajar (User View)
              </span>
              <span className="text-xs text-teal-200 font-medium">
                Portal Guru Keagamaan Bandulan
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              Menampilkan antarmuka mandiri bagi pengajar keagamaan untuk cek insentif, presensi, dan berkas.
            </p>
          </div>
        </div>

        {/* Quick Teacher Profile Selector */}
        <div className="flex items-center gap-2.5 bg-black/20 p-2 rounded-xl border border-white/10 shrink-0">
          <span className="text-xs font-semibold text-teal-100 whitespace-nowrap">
            Masuk Sebagai:
          </span>
          <select
            value={currentTeacher.id}
            onChange={(e) => onSelectTeacher(e.target.value)}
            className="text-xs bg-white text-slate-800 font-semibold py-1.5 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer max-w-[220px] truncate"
          >
            {recipients.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nama} ({r.kategori === 'GURU_NGAJI' ? 'TPQ' : 'Sekolah Minggu'} - {r.rw})
              </option>
            ))}
          </select>
          <button
            onClick={onSwitchToAdmin}
            className="px-3 py-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Kembali ke Admin Kesra
          </button>
        </div>
      </div>

      {/* Toast */}
      {uploadSuccessToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccessToast}</span>
        </div>
      )}

      {/* Main Grid: Left ID Card & Profile, Right Active Subtab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Official Teacher ID Card (Civic Badge) */}
        <div className="space-y-4">
          {/* Card: Kartu Tanda Pengajar Digital */}
          <div className="bg-gradient-to-br from-teal-950 via-[#0f766e] to-teal-800 text-white rounded-[16px] p-5 shadow-md border border-teal-600/40 relative overflow-hidden">
            {/* Background civic watermark graphic */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute top-2 right-3 text-[10px] font-mono text-teal-300 uppercase tracking-widest">
              SIKB-MALANG-2026
            </div>

            <div className="flex items-center gap-2 mb-4 border-b border-white/15 pb-3">
              <span className="text-base">🏛️</span>
              <div>
                <p className="text-[10px] font-bold text-teal-200 tracking-wider uppercase">
                  PEMERINTAH KOTA MALANG
                </p>
                <p className="text-xs font-extrabold text-white">
                  KARTU PENGAJAR KEAGAMAAN RESMI
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <img
                src={currentTeacher.avatarUrl}
                alt={currentTeacher.nama}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white/60 shadow-sm shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                  {currentTeacher.nama}
                </h3>
                {currentTeacher.gelar && (
                  <p className="text-xs text-teal-200">{currentTeacher.gelar}</p>
                )}
                <p className="font-mono text-xs text-teal-100 tracking-wider mt-1">
                  {currentTeacher.nik}
                </p>
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold text-teal-100">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  <span>Dukcapil Kota Malang Terverifikasi</span>
                </div>
              </div>
            </div>

            {/* Teaching Institution & RW details */}
            <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-teal-300 uppercase block font-semibold">Lembaga Mengajar</span>
                <span className="font-bold text-white text-xs truncate block">{currentTeacher.namaLembaga}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-300 uppercase block font-semibold">Wilayah Tugas</span>
                <span className="font-bold text-white text-xs">{currentTeacher.rw} / {currentTeacher.rt}</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-300 uppercase block font-semibold">Masa Pengabdian</span>
                <span className="font-semibold text-teal-100 text-xs">{currentTeacher.masaKerjaTahun} Tahun</span>
              </div>
              <div>
                <span className="text-[10px] text-teal-300 uppercase block font-semibold">ID Pengajar</span>
                <span className="font-mono text-teal-200 text-xs">{currentTeacher.id}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-teal-200">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                Penerima Insentif Sah 2026
              </span>
              <QrCode className="w-5 h-5 text-teal-100" />
            </div>
          </div>

          {/* Teacher Navigation Subtabs */}
          <div className="bg-white rounded-[16px] border border-slate-200 p-2 shadow-xs space-y-1">
            <button
              onClick={() => setActiveSubTab('OVERVIEW')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSubTab === 'OVERVIEW'
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0f766e]" />
                Ringkasan & Status Insentif
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveSubTab('PRESENSI')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSubTab === 'PRESENSI'
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0f766e]" />
                Laporan Kehadiran Santri/Siswa
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-[#0f766e]">
                {currentTeacher.attendance.sessionsHeld}/{currentTeacher.attendance.targetSessions} Sesi
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('DOKUMEN')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSubTab === 'DOKUMEN'
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0f766e]" />
                Berkas & Administrasi SK
              </span>
              {currentTeacher.status === 'PERLU_REVISI' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse font-bold">
                  Perlu Revisi
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('RIWAYAT')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeSubTab === 'RIWAYAT'
                  ? 'bg-teal-50 text-[#0f766e]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0f766e]" />
                Riwayat Pencairan Bulanan
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Quick Help Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-4 text-xs text-slate-600 space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#0f766e]" />
              Layanan Bantuan Guru Bandulan
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ada kendala rekening pasif, perubahan nomor rekening, atau mutasi tempat mengajar? Hubungi WhatsApp Seksi Kesra Kelurahan Bandulan:
            </p>
            <a
              href="#chat-kesra"
              onClick={(e) => {
                e.preventDefault();
                alert('Menghubungkan ke Petugas Layanan Kesra Kelurahan Bandulan (0341-561234 / WA: 0812-3341-8900)');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f766e] hover:underline"
            >
              <span>Hubungi WA Staf Kesra</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right 2-Columns: Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* SUBTAB 1: OVERVIEW & STATUS INSENTIF */}
          {activeSubTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Main Status Hero Card */}
              <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Periode Penyaluran Berjalan
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {selectedPeriod}
                    </h3>
                  </div>
                  <div>{renderStatusBadge(currentTeacher.status)}</div>
                </div>

                {/* Nominal & Bank Payout Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-teal-50/60 border border-teal-200/80 rounded-2xl p-4 space-y-1">
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                      Besaran Insentif Bersih
                    </span>
                    <p className="text-3xl font-extrabold text-[#0f766e] tabular-nums">
                      Rp {currentTeacher.nominalPerBulan.toLocaleString('id-ID')}
                    </p>
                    <p className="text-[11px] text-teal-700">
                      Bebas potongan administrasi (Ditanggung APBD Kota Malang)
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Rekening Bank Penyalur
                    </span>
                    <p className="text-lg font-bold text-slate-800">
                      {currentTeacher.bankPenyalur}
                    </p>
                    <p className="font-mono text-sm font-semibold text-slate-600">
                      {currentTeacher.nomorRekening}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      a.n. {currentTeacher.namaPemilikRekening}
                    </p>
                  </div>
                </div>

                {/* Important Alert Notice if Revision Needed */}
                {currentTeacher.status === 'PERLU_REVISI' && (
                  <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Catatan Penting dari Verifikator Kelurahan:</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      {currentTeacher.notes || 'Mohon periksa kembali berkas nomor rekening tabungan Anda.'}
                    </p>
                    <button
                      onClick={() => setActiveSubTab('DOKUMEN')}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Perbaiki & Unggah Berkas Sekarang →
                    </button>
                  </div>
                )}

                {/* Payout Details Confirmation */}
                {currentTeacher.status === 'TERSALURKAN' && (
                  <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 text-emerald-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Bukti Transfer Payroll Berhasil Dibukukan
                      </span>
                      <span className="font-mono text-[11px] text-emerald-700">
                        {currentTeacher.referenceNumber || 'SP2D-BDL/2026/11/0014'}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      Dana telah dikreditkan ke rekening {currentTeacher.bankPenyalur} pada <strong>{currentTeacher.lastPayoutDate || '1 November 2026 10:15 WIB'}</strong>.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-1.5 text-xs font-bold text-[#0f766e] bg-white border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Slip Tanda Terima Insentif</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Summary Card */}
              <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0f766e]" />
                    Status Presensi Mengajar Bulan Ini
                  </h4>
                  <button
                    onClick={() => setActiveSubTab('PRESENSI')}
                    className="text-xs font-semibold text-[#0f766e] hover:underline"
                  >
                    Buka Rincian Presensi →
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Realisasi Sesi Mengajar:</span>
                    <span className="text-slate-900 font-bold tabular-nums">
                      {currentTeacher.attendance.sessionsHeld} dari {currentTeacher.attendance.targetSessions} Sesi Terpenuhi
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0f766e] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (currentTeacher.attendance.sessionsHeld / currentTeacher.attendance.targetSessions) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Santri/Siswa Didik</span>
                    <span className="font-bold text-slate-800 text-sm">{currentTeacher.attendance.santriOrStudentsCount} Anak</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Paraf Pengantar RW</span>
                    <span className={`font-bold text-xs ${currentTeacher.attendance.isVerifiedByRW ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {currentTeacher.attendance.isVerifiedByRW ? '✓ Terverifikasi RW' : 'Menunggu Paraf'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Tanggal Lapor</span>
                    <span className="font-semibold text-slate-800">{currentTeacher.attendance.reportSubmittedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: PRESENSI MENGAJAR */}
          {activeSubTab === 'PRESENSI' && (
            <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Buku Log Presensi & Aktivitas Mengajar
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Laporan kehadiran pengajar keagamaan di {currentTeacher.namaLembaga} ({currentTeacher.rw})
                  </p>
                </div>

                <button
                  onClick={() => setShowAddSessionModal(true)}
                  className="px-4 py-2 bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] text-white text-xs font-bold rounded-[10px] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Sesi Mengajar Hari Ini</span>
                </button>
              </div>

              {/* Attendance Sessions Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Daftar Sesi Mengajar Bulan {selectedPeriod}</span>
                  <span className="text-[#0f766e] font-bold">
                    {currentTeacher.attendance.sessionsHeld} Pertemuan Tercatat
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Array.from({ length: currentTeacher.attendance.targetSessions }).map((_, index) => {
                    const sessionNumber = index + 1;
                    const isCompleted = sessionNumber <= currentTeacher.attendance.sessionsHeld;

                    return (
                      <div
                        key={sessionNumber}
                        className={`p-3 rounded-xl border text-xs flex flex-col justify-between transition-colors ${
                          isCompleted
                            ? 'bg-teal-50/60 border-teal-200 text-teal-900'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">Sesi #{sessionNumber}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#0f766e]" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                        <div className="mt-2 text-[11px]">
                          {isCompleted ? (
                            <>
                              <p className="font-medium text-teal-800">Hadir Mengajar</p>
                              <p className="text-[10px] text-teal-600 mt-0.5">
                                {currentTeacher.attendance.santriOrStudentsCount} Santri/Siswa
                              </p>
                            </>
                          ) : (
                            <p className="text-slate-400">Jadwal Mendatang</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Add Session */}
              {showAddSessionModal && (
                <div className="p-4 rounded-xl border border-teal-300 bg-teal-50/50 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900">
                      Catat Sesi Pertemuan #{currentTeacher.attendance.sessionsHeld + 1}
                    </span>
                    <button
                      onClick={() => setShowAddSessionModal(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddSession} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Materi / Pokok Bahasan Mengajar
                        </label>
                        <input
                          type="text"
                          required
                          value={newSessionTopic}
                          onChange={(e) => setNewSessionTopic(e.target.value)}
                          placeholder="Contoh: Tajwid Makharijul Huruf / Pelajaran Kasih"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#0f766e]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Jumlah Anak / Santri Hadir
                        </label>
                        <input
                          type="number"
                          required
                          value={newSessionStudents}
                          onChange={(e) => setNewSessionStudents(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-[10px] focus:outline-none focus:border-[#0f766e]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddSessionModal(false)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-[10px]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#0f766e] hover:bg-[#0d9488] rounded-[10px]"
                      >
                        Simpan Sesi Kehadiran
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* SUBTAB 3: DOKUMEN & ADMINISTRASI */}
          {activeSubTab === 'DOKUMEN' && (
            <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Pusat Berkas Administrasi & Persyaratan Insentif
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pastikan dokumen selalu mutakhir dan terbaca jelas oleh tim verifikator Kelurahan Bandulan.
                </p>
              </div>

              <div className="space-y-3">
                {currentTeacher.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-100 text-[#0f766e] flex items-center justify-center font-bold text-xs shrink-0">
                        PDF
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs">{doc.name}</h5>
                        <p className="text-[11px] text-slate-400">
                          Diperbarui pada: {doc.uploadDate} • Status Dokumen:{' '}
                          <span className={`font-bold ${
                            doc.status === 'VALID'
                              ? 'text-emerald-700'
                              : doc.status === 'PENDING'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}>
                            {doc.status}
                          </span>
                        </p>
                        {doc.notes && (
                          <p className="text-[11px] text-rose-600 font-semibold mt-1">
                            ⚠️ {doc.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => handleReupload(doc)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#0f766e] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Ulang File</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBTAB 4: RIWAYAT PENYALURAN */}
          {activeSubTab === 'RIWAYAT' && (
            <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Riwayat Penyaluran Insentif Tahun Anggaran 2026
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekapitulasi pencairan honorarium guru keagamaan yang telah masuk ke rekening Bank Jatim.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    bulan: 'Oktober 2026',
                    tahap: 'Tahap III',
                    nominal: 500000,
                    status: 'Tersalurkan',
                    tanggal: '1 Oktober 2026',
                    sp2d: 'SP2D-BDL/2026/10/0088',
                  },
                  {
                    bulan: 'September 2026',
                    tahap: 'Tahap II',
                    nominal: 500000,
                    status: 'Tersalurkan',
                    tanggal: '2 September 2026',
                    sp2d: 'SP2D-BDL/2026/09/0064',
                  },
                  {
                    bulan: 'Agustus 2026',
                    tahap: 'Tahap I',
                    nominal: 500000,
                    status: 'Tersalurkan',
                    tanggal: '1 Agustus 2026',
                    sp2d: 'SP2D-BDL/2026/08/0022',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#0f766e] uppercase tracking-wider bg-teal-100/70 px-2 py-0.5 rounded">
                        {item.tahap}
                      </span>
                      <h5 className="font-bold text-slate-900 text-sm mt-1">{item.bulan}</h5>
                      <p className="font-mono text-[11px] text-slate-400">
                        {item.sp2d} • Dibukukan: {item.tanggal}
                      </p>
                    </div>

                    <div className="text-right flex items-center justify-between sm:justify-end gap-4">
                      <div>
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          Rp {item.nominal.toLocaleString('id-ID')}
                        </span>
                        <span className="block text-[11px] text-emerald-700 font-semibold">
                          ✓ {item.status}
                        </span>
                      </div>
                      <button
                        onClick={() => window.print()}
                        className="p-2 text-[#0f766e] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
                        title="Cetak Bukti Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
