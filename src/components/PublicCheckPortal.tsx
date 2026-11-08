import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Check, 
  Building2, 
  CreditCard, 
  FileText, 
  Printer, 
  HelpCircle,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Recipient } from '../types';

interface PublicCheckPortalProps {
  recipients: Recipient[];
  selectedPeriod: string;
}

export const PublicCheckPortal: React.FC<PublicCheckPortalProps> = ({
  recipients,
  selectedPeriod,
}) => {
  const [searchKey, setSearchKey] = useState('');
  const [matchedRecipient, setMatchedRecipient] = useState<Recipient | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKey.trim()) return;

    const query = searchKey.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = recipients.find((r) => {
      const cleanNik = r.nik.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanTel = r.telepon.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanName = r.nama.toLowerCase();
      return cleanNik.includes(query) || cleanTel.includes(query) || cleanName.includes(query);
    });

    setMatchedRecipient(found || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Friendly Informative Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0f766e] flex items-center justify-center mx-auto mb-2 border border-teal-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Portal Mandiri Pengecekan Honorarium (5 Peran)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Guru TPQ, Guru Sekolah Minggu, Penjaga Tempat Ibadah (Marbot), Perawat Jenazah, & Penjaga Makam di Kelurahan Bandulan dapat memantau status Her-Registrasi 2027 dan pencairan honor secara transparan.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-lg mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Masukkan NIK KTP (16 Digit) atau No. WhatsApp"
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-300 rounded-[10px] text-slate-900 focus:outline-none focus:ring-3 focus:ring-teal-700/15 focus:border-[#0f766e]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] text-white text-xs sm:text-sm font-bold rounded-[10px] shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Cek Status
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span>Contoh pencarian cepat:</span>
            <button
              type="button"
              onClick={() => {
                setSearchKey('3573041205840002');
              }}
              className="text-[#0f766e] font-mono hover:underline cursor-pointer"
            >
              3573041205840002
            </button>
            <span>atau</span>
            <button
              type="button"
              onClick={() => {
                setSearchKey('Maria Kristina');
              }}
              className="text-[#0f766e] font-medium hover:underline cursor-pointer"
            >
              Maria Kristina
            </button>
          </div>
        </form>

        {/* Results Box */}
        {hasSearched && (
          <div className="pt-4 border-t border-slate-200 animate-in fade-in duration-200">
            {matchedRecipient ? (
              <div className="bg-slate-50 rounded-2xl border border-teal-200 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={matchedRecipient.avatarUrl}
                      alt={matchedRecipient.nama}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0f766e] bg-teal-100/70 px-2 py-0.5 rounded">
                          {matchedRecipient.kategoriLabel}
                        </span>
                        <span className="text-xs text-slate-500">{matchedRecipient.rw} / {matchedRecipient.rt}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {matchedRecipient.nama} {matchedRecipient.gelar && `(${matchedRecipient.gelar})`}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        NIK: {matchedRecipient.maskedNik}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Status Penyaluran</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1 ${
                      matchedRecipient.status === 'TERSALURKAN'
                        ? 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]'
                        : matchedRecipient.status === 'SIAP_SALUR'
                        ? 'bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]'
                        : matchedRecipient.status === 'MENUNGGU_VERIFIKASI'
                        ? 'bg-[#fef3c7] text-[#b45309] border border-[#fde68a]'
                        : 'bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]'
                    }`}>
                      {matchedRecipient.status === 'TERSALURKAN' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {matchedRecipient.status === 'SIAP_SALUR' && <Check className="w-3.5 h-3.5" />}
                      {matchedRecipient.status === 'MENUNGGU_VERIFIKASI' && <Clock className="w-3.5 h-3.5" />}
                      {matchedRecipient.status === 'PERLU_REVISI' && <AlertCircle className="w-3.5 h-3.5" />}
                      {matchedRecipient.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tempat Tugas / Wilayah</span>
                    <span className="font-semibold text-slate-800">{matchedRecipient.namaLembaga}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank & No. Rekening</span>
                    <span className="font-mono font-semibold text-slate-800">{matchedRecipient.bankPenyalur} • {matchedRecipient.nomorRekening}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Nominal Insentif</span>
                    <span className="font-bold text-[#0f766e] text-sm tabular-nums">
                      Rp {matchedRecipient.nominalPerBulan.toLocaleString('id-ID')} / bln
                    </span>
                  </div>
                </div>

                {/* Status Explanation Message */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0f766e]" />
                    Catatan Verifikasi Periode {selectedPeriod}:
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {matchedRecipient.notes || 'Berkas telah diterima dan tercatat dalam sistem administrasi Kelurahan Bandulan.'}
                  </p>
                  {matchedRecipient.referenceNumber && (
                    <p className="text-[11px] font-mono text-slate-500 pt-1">
                      Nomor Referensi Pencairan: <strong>{matchedRecipient.referenceNumber}</strong> ({matchedRecipient.lastPayoutDate})
                    </p>
                  )}
                </div>

                {/* Assistance note */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                  <span className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-[#0f766e]" />
                    Butuh bantuan atau perbaikan data? Hubungi Kasi Kesra Kelurahan Bandulan.
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="text-[#0f766e] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Cetak Bukti Status
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">
                  Data Tidak Ditemukan
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Pastikan 16 digit NIK atau nama yang Anda masukkan sesuai dengan data KTP yang didaftarkan ke Kelurahan Bandulan.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Information Guide Accordion / Info Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#0f766e]" />
          Alur & Ketentuan Penyaluran Insentif Guru Keagamaan Bandulan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center font-bold text-xs mb-1">
              1
            </span>
            <h4 className="font-bold text-slate-800">Verifikasi Presensi Bulanan</h4>
            <p className="text-[11px] text-slate-500">
              Guru menyetorkan absensi mengajar (minimal target 16 sesi untuk TPQ atau 4 sesi ibadah anak) dan diketahui Ketua RW setempat.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center font-bold text-xs mb-1">
              2
            </span>
            <h4 className="font-bold text-slate-800">Validasi NIK & Rekening</h4>
            <p className="text-[11px] text-slate-500">
              Seksi Kesejahteraan Rakyat (Kesra) melakukan pencocokan data NIK Dukcapil dan rekening Bank Jatim / mitra yang aktif.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-[#0f766e] flex items-center justify-center font-bold text-xs mb-1">
              3
            </span>
            <h4 className="font-bold text-slate-800">Transfer Nontunai Payroll</h4>
            <p className="text-[11px] text-slate-500">
              Setelah Berita Acara diotorisasi Lurah Bandulan, dana insentif sebesar Rp 500.000 otomatis ditransfer ke rekening pengajar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
