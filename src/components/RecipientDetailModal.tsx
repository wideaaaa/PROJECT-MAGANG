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
  Lock,
  Sparkles
} from 'lucide-react';
import { Recipient, DisbursementStatus, VerificationDocument } from '../types';
import { HONOR_ROLES_CONFIG } from '../data/mockRecipients';
import { OfficialHerRegistrasiView } from './OfficialHerRegistrasiView';

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
  const [showOfficialForm, setShowOfficialForm] = useState(false);
  const [isNikUnmasked, setIsNikUnmasked] = useState(false);

  const roleConfig = HONOR_ROLES_CONFIG[recipient.kategori] || HONOR_ROLES_CONFIG.GURU_TPQ;

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
    onUpdateStatus(recipient.id, 'SIAP_SALUR', 'Berkas Form Her-Registrasi 2027 disetujui, siap masuk batch penyaluran.');
  };

  const handleDisburse = () => {
    onUpdateStatus(recipient.id, 'TERSALURKAN', 'Penyaluran dana insentif selesai dibukukan via Bank Jatim.');
  };

  const handleRequestRevision = () => {
    if (!revisionNote.trim()) return;
    onUpdateStatus(recipient.id, 'PERLU_REVISI', revisionNote);
    setShowRevisionForm(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
        <div 
          className="bg-white rounded-3xl max-w-4xl w-full shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-teal-900 to-[#0f766e] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/20 text-2xl shrink-0">
                {roleConfig.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 bg-white/15 px-2 py-0.5 rounded">
                    Audit Her-Registrasi (T.A. 2027)
                  </span>
                  <span className="text-xs text-teal-100 font-mono">
                    {recipient.id}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {recipient.nama} {recipient.gelar && `(${recipient.gelar})`}
                </h3>
                <p className="text-xs text-teal-100/90 font-medium">
                  {roleConfig.roleName} • {recipient.namaLembaga}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOfficialForm(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Form Resmi PDF</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm text-slate-700">
            {/* Identity & Status Overview Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={recipient.avatarUrl}
                  alt={recipient.nama}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {recipient.nama}
                    </span>
                    <span className="text-xs font-bold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      {roleConfig.roleName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
                    <span>
                      NIK: <strong className="tracking-wider">{isNikUnmasked ? recipient.nik : recipient.maskedNik}</strong>
                    </span>
                    
                    <button
                      type="button"
                      onClick={toggleNikMasking}
                      className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 hover:bg-teal-100 text-slate-700 hover:text-[#0f766e] transition-colors cursor-pointer"
                      title={isNikUnmasked ? "Kunci penyamaran NIK" : "Buka NIK lengkap"}
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
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                <span className="text-xs text-slate-500 uppercase font-semibold">Alokasi Honorarium Bulanan</span>
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

            {/* Section A: DATA DIRI (Her Registrasi 2027 - 9 Items) */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0f766e]" />
                  A. DATA DIRI LENGKAP (FORM HER REGISTRASI 2027)
                </h4>
                <button
                  onClick={() => setShowOfficialForm(true)}
                  className="text-xs font-bold text-[#0f766e] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lihat Format PDF Resmi</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">1. Nama Lengkap</span>
                  <span className="font-bold text-slate-800 text-sm">{recipient.nama}</span>
                  {recipient.gelar && <span className="text-xs text-slate-500 block">({recipient.gelar})</span>}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">2. Tempat Tanggal Lahir</span>
                  <span className="font-semibold text-slate-800">{recipient.tempatTanggalLahir || '-'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">3. NIK (Kependudukan)</span>
                  <span className="font-mono font-bold text-slate-900">{isNikUnmasked ? recipient.nik : recipient.maskedNik}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">4. Jenis Kelamin</span>
                  <span className="font-semibold text-slate-800">{recipient.jenisKelamin || 'Laki-laki'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">5. Alamat Rumah</span>
                  <span className="font-semibold text-slate-800">{recipient.alamatRumah || recipient.alamatLembaga}</span>
                  <span className="text-[11px] text-teal-800 font-bold block mt-0.5">
                    RT: {recipient.rtRumah || recipient.rt} • RW: {recipient.rwRumah || recipient.rw} Kel. Bandulan
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">6. Nomor HP / WA</span>
                  <span className="font-mono font-bold text-slate-800">{recipient.telepon}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">7. Pendidikan Terakhir</span>
                  <span className="font-semibold text-slate-800">{recipient.pendidikanTerakhir || 'SMA'}</span>
                </div>

                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
                  <span className="text-teal-700 block text-[10px] uppercase font-bold">{roleConfig.durationLabel}</span>
                  <span className="font-bold text-teal-950 text-sm">{recipient.lamaBertugas || `${recipient.masaKerjaTahun} Tahun`}</span>
                </div>
              </div>
            </div>

            {/* Section B: DATA TEMPAT TUGAS */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0f766e]" />
                {roleConfig.sectionBTitle}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{roleConfig.institutionFieldLabel}</span>
                  <span className="font-bold text-slate-800 text-sm">{recipient.namaLembaga}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">{recipient.alamatLembaga} (RT {recipient.rt} / {recipient.rw})</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pengesahan Pimpinan</span>
                  <span className="font-bold text-slate-800 text-sm">{recipient.pimpinanNama || roleConfig.pimpinanTitle}</span>
                  <span className="text-xs text-teal-700 font-semibold block mt-0.5">({roleConfig.pimpinanTitle})</span>
                </div>

                {recipient.nspqOrNsm && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-3">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Nomor Statistik / Sertifikat (NSPQ / NSM)</span>
                    <span className="font-mono font-bold text-slate-800">{recipient.nspqOrNsm}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rekening Bank Jatim */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0f766e]" />
                8. Rekening Bank Jatim (Penyaluran Insentif Nontunai)
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
                  <span className="text-[10px] text-emerald-600 block mt-0.5">✓ Sesuai e-KTP Penerima</span>
                </div>
              </div>
            </div>

            {/* Verification Documents Checklist */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0f766e]" />
                Dokumen Persyaratan Administrasi Her-Registrasi 2027
              </h4>
              <div className="space-y-2">
                {recipient.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0f766e] flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">Diunggah: {doc.uploadDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        doc.status === 'VALID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revision note form if toggled */}
            {showRevisionForm && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 animate-in fade-in">
                <span className="text-xs font-bold text-rose-900 block">
                  Berikan Catatan Revisi Berkas kepada Penerima:
                </span>
                <textarea
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Contoh: Lampiran Surat Tugas dari Takmir belum dibubuhi stempel resmi. Mohon unggah ulang."
                  rows={3}
                  className="w-full p-3 text-xs bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowRevisionForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleRequestRevision}
                    className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
                  >
                    Kirim Catatan Revisi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOfficialForm(true)}
                className="px-3.5 py-2 text-xs font-bold text-[#0f766e] bg-teal-50 hover:bg-teal-100 border border-teal-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Form Her-Registrasi 2027</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {recipient.status !== 'PERLU_REVISI' && (
                <button
                  onClick={() => setShowRevisionForm(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#b91c1c] bg-[#fee2e2] hover:bg-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  Minta Revisi Berkas
                </button>
              )}

              {recipient.status === 'MENUNGGU_VERIFIKASI' && (
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Setujui (Siap Salur)</span>
                </button>
              )}

              {recipient.status === 'SIAP_SALUR' && (
                <button
                  onClick={handleDisburse}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#d97706] hover:bg-[#b45309] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Tandai Cair (Bank Jatim)</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Printable PDF View Modal */}
      {showOfficialForm && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto p-4 sm:p-6 shadow-2xl">
            <OfficialHerRegistrasiView
              recipient={recipient}
              onClose={() => setShowOfficialForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
