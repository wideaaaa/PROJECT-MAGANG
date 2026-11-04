import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Download, 
  Check, 
  CreditCard, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Printer, 
  Hash, 
  Send, 
  AlertTriangle, 
  QrCode, 
  UserCheck,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { Recipient, DisbursementStatus, VerificationDocument } from '../types';

interface RecipientDetailModalProps {
  recipient: Recipient | null;
  onClose: () => void;
  onUpdateStatus: (recipientId: string, newStatus: DisbursementStatus, notes?: string) => void;
  onLogSecurityIncident?: (type: string, details: string) => void;
  currentRole: 'ADMIN_KESRA' | 'LURAH' | 'GURU_MANDIRI';
}

export const RecipientDetailModal: React.FC<RecipientDetailModalProps> = ({
  recipient,
  onClose,
  onUpdateStatus,
  onLogSecurityIncident,
  currentRole,
}) => {
  if (!recipient) return null;

  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<VerificationDocument | null>(null);
  const [showPrintSlip, setShowPrintSlip] = useState(false);
  const [isNikUnmasked, setIsNikUnmasked] = useState(false);

  const toggleNikMasking = () => {
    if (!isNikUnmasked) {
      setIsNikUnmasked(true);
      if (onLogSecurityIncident) {
        onLogSecurityIncident('NIK_UNMASKED', `Akses unmasking NIK lengkap atas nama ${recipient.nama} (${recipient.nik}) dibuka oleh admin.`);
      }
    } else {
      setIsNikUnmasked(false);
    }
  };

  const handleApprove = () => {
    onUpdateStatus(recipient.id, 'SIAP_SALUR', 'Berkas disetujui, siap masuk batch penyaluran.');
  };

  const handleDisburse = () => {
    onUpdateStatus(recipient.id, 'TERSALURKAN', 'Penyaluran dana insentif selesai dibukukan via Bank Penyalur.');
  };

  const handleRequestRevision = () => {
    if (!revisionNote.trim()) return;
    onUpdateStatus(recipient.id, 'PERLU_REVISI', revisionNote);
    setShowRevisionForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[16px] max-w-3xl w-full shadow-[0_20px_40px_rgba(15,23,42,0.12)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-900 to-[#0f766e] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-200 border border-white/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200 bg-white/10 px-2 py-0.5 rounded">
                  Audit Verifikasi Berkas
                </span>
                <span className="text-xs text-teal-100 font-mono">
                  {recipient.id}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {recipient.nama} {recipient.gelar && `(${recipient.gelar})`}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Identity & Status Overview Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={recipient.avatarUrl}
                alt={recipient.nama}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{recipient.kategoriLabel}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-600">{recipient.rw} / {recipient.rt}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600">
                  <span>
                    NIK: <strong className="tracking-wider">{isNikUnmasked ? recipient.nik : recipient.maskedNik}</strong>
                  </span>
                  
                  {/* Unmasking Security Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleNikMasking}
                    className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 hover:bg-teal-100 text-slate-700 hover:text-[#0f766e] transition-colors cursor-pointer"
                    title={isNikUnmasked ? "Kunci kembali penyamaran NIK" : "Buka NIK lengkap (Tindakan dicatat dalam log audit)"}
                  >
                    {isNikUnmasked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{isNikUnmasked ? "Kunci NIK" : "Lihat NIK"}</span>
                  </button>

                  {recipient.dukcapilVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full font-sans">
                      <ShieldCheck className="w-3 h-3" /> Valid Dukcapil
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Lembaga: <strong className="text-slate-800">{recipient.namaLembaga}</strong> ({recipient.alamatLembaga})
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <span className="text-xs text-slate-500 uppercase font-semibold">Alokasi Insentif</span>
              <div className="text-xl font-bold text-slate-900 tabular-nums">
                Rp {recipient.nominalPerBulan.toLocaleString('id-ID')}
                <span className="text-xs font-normal text-slate-500"> /bln</span>
              </div>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  recipient.status === 'TERSALURKAN'
                    ? 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]'
                    : recipient.status === 'SIAP_SALUR'
                    ? 'bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]'
                    : recipient.status === 'MENUNGGU_VERIFIKASI'
                    ? 'bg-[#fef3c7] text-[#b45309] border border-[#fde68a]'
                    : 'bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]'
                }`}>
                  {recipient.status === 'TERSALURKAN' && <CheckCircle2 className="w-3 h-3" />}
                  {recipient.status === 'SIAP_SALUR' && <Check className="w-3 h-3" />}
                  {recipient.status === 'MENUNGGU_VERIFIKASI' && <Clock className="w-3 h-3" />}
                  {recipient.status === 'PERLU_REVISI' && <AlertCircle className="w-3 h-3" />}
                  {recipient.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Bank & Rekening Details */}
          <div className="border border-slate-200 rounded-[16px] p-4 bg-white space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0f766e]" />
              Data Rekening Bank Penyalur (Payroll Pemkot Malang)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Penyalur</span>
                <span className="font-bold text-slate-800 text-sm">{recipient.bankPenyalur}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Nomor Rekening</span>
                <span className="font-mono font-bold text-slate-900 text-sm tracking-wide">
                  {recipient.nomorRekening}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Atas Nama Rekening</span>
                <span className="font-bold text-slate-800 text-sm">{recipient.namaPemilikRekening}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">✓ Sesuai KTP Penerima</span>
              </div>
            </div>
          </div>

          {/* Attendance & Teaching Sessions Log */}
          <div className="border border-slate-200 rounded-[16px] p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0f766e]" />
                Laporan Kehadiran & Presensi Santri / Siswa ({recipient.attendance.month})
              </h4>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                recipient.attendance.isVerifiedByRW
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {recipient.attendance.isVerifiedByRW ? '✓ Paraf Pengantar RW Valid' : 'Menunggu Paraf RW'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Realisasi Pertemuan</span>
                <span className="text-lg font-bold text-slate-900">
                  {recipient.attendance.sessionsHeld} / {recipient.attendance.targetSessions} Sesi
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Santri / Siswa Aktif</span>
                <span className="text-lg font-bold text-slate-900">
                  {recipient.attendance.santriOrStudentsCount} Anak
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Tanggal Lapor</span>
                <span className="font-semibold text-slate-800">
                  {recipient.attendance.reportSubmittedDate}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Status SPJ</span>
                <span className="font-semibold text-emerald-700">
                  Lengkap Sesuai Juknis
                </span>
              </div>
            </div>
          </div>

          {/* Verification Documents Checklist */}
          <div className="border border-slate-200 rounded-[16px] p-4 bg-white space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0f766e]" />
              Dokumen Persyaratan Administrasi
            </h4>
            <div className="space-y-2">
              {recipient.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-[#0f766e] flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                      <p className="text-[11px] text-slate-400">Diunggah pada: {doc.uploadDate}</p>
                      {doc.notes && (
                        <p className="text-[11px] text-rose-600 font-medium mt-0.5">{doc.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'VALID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : doc.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {doc.status}
                    </span>
                    <button
                      onClick={() => setPreviewDocument(doc)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#0f766e] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors cursor-pointer"
                    >
                      Buka Dokumen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Preview Drawer if clicked */}
          {previewDocument && (
            <div className="p-4 rounded-xl border border-teal-300 bg-teal-50/50 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0f766e]" />
                  Preview: {previewDocument.name}
                </span>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕ Tutup
                </button>
              </div>
              <div className="h-44 bg-white border border-teal-200 rounded-lg flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-[#0f766e] mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Dokumen Digital Terverifikasi Kelurahan Bandulan
                </p>
                <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">
                  Nomor Arsip: {recipient.id}/{previewDocument.type}/2026. Berkas sah memenuhi ketentuan Peraturan Walikota Malang tentang Hibah & Insentif Kesejahteraan Guru Keagamaan.
                </p>
              </div>
            </div>
          )}

          {/* Revision Form if triggered */}
          {showRevisionForm && (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3 animate-in fade-in duration-150">
              <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Catatan Perbaikan / Revisi untuk Pengajar
              </h5>
              <textarea
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="Contoh: Foto buku rekening buram, mohon unggah ulang dengan nomor rekening yang terbaca jelas..."
                rows={3}
                className="w-full p-2.5 text-xs bg-white border border-rose-300 rounded-[10px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRevisionForm(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-[10px]"
                >
                  Batal
                </button>
                <button
                  onClick={handleRequestRevision}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-[10px]"
                >
                  Kirim Permintaan Revisi
                </button>
              </div>
            </div>
          )}

          {/* Domain Spec Component: Audit Stamp */}
          <div className="p-4 rounded-[16px] border border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#0f766e] bg-teal-100/60 px-2 py-0.5 rounded">
                  Watermark Audit Kelurahan Bandulan
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {recipient.statusUpdateDate || '2026-11-01'}
                </span>
              </div>
              <p className="text-xs text-slate-700">
                Verifikator: <strong>{recipient.verifierName || 'Bambang Trianto, S.Sos'}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Jabatan: {recipient.verifierRole || 'Kasi Kesejahteraan Rakyat Kelurahan Bandulan'}
              </p>
              <p className="text-[10px] font-mono text-slate-400 truncate max-w-md">
                Signature Hash: {recipient.verificationHash || 'SHA256:7b9f8a2e1d0c5a3b98471182cf891a2e'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <div className="w-16 h-16 border border-slate-300 bg-white rounded-lg p-1 flex items-center justify-center shadow-2xs">
                <QrCode className="w-14 h-14 text-slate-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Action Buttons strictly matching spec */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold text-[#0f766e] border border-[#0f766e] rounded-[10px] hover:bg-teal-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Slip Verifikasi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Destructive Action: Minta Revisi */}
            {recipient.status !== 'PERLU_REVISI' && (
              <button
                onClick={() => setShowRevisionForm(true)}
                className="px-3.5 py-2 text-xs font-semibold text-[#b91c1c] bg-[#fee2e2] hover:bg-rose-200 rounded-[10px] transition-colors cursor-pointer"
              >
                Minta Revisi Berkas
              </button>
            )}

            {/* Primary Action: Setujui Penyaluran */}
            {recipient.status === 'MENUNGGU_VERIFIKASI' && (
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] rounded-[10px] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Setujui Penyaluran (Siap Salur)</span>
              </button>
            )}

            {/* Warm Accent: Tandai Cair */}
            {recipient.status === 'SIAP_SALUR' && (
              <button
                onClick={handleDisburse}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#d97706] hover:bg-[#b45309] rounded-[10px] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Tandai Tersalurkan (Bank Jatim)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-[10px] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
