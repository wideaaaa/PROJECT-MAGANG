import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Building2, 
  CheckCircle2, 
  Printer, 
  Download, 
  Send, 
  FileCheck2, 
  ShieldCheck,
  QrCode,
  Users,
  AlertCircle
} from 'lucide-react';
import { Recipient } from '../types';

interface BatchDisbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Recipient[];
  selectedRecipientIds: string[];
  onExecuteBatchDisbursement: (selectedIds: string[], batchNumber: string) => void;
  selectedPeriod: string;
}

export const BatchDisbursementModal: React.FC<BatchDisbursementModalProps> = ({
  isOpen,
  onClose,
  recipients,
  selectedRecipientIds,
  onExecuteBatchDisbursement,
  selectedPeriod,
}) => {
  if (!isOpen) return null;

  // Determine eligible recipients: if user had explicit selections, use those; otherwise defaults to all 'SIAP_SALUR' recipients
  const targets = selectedRecipientIds.length > 0
    ? recipients.filter((r) => selectedRecipientIds.includes(r.id))
    : recipients.filter((r) => r.status === 'SIAP_SALUR');

  const [batchNumber, setBatchNumber] = useState(`BA-INS/2026/XI/BDL-${Math.floor(100 + Math.random() * 900)}`);
  const [bankTarget, setBankTarget] = useState('Bank Jatim (Sistem Payroll Pemkot Malang)');
  const [lurahSignChecked, setLurahSignChecked] = useState(true);
  const [kasiSignChecked, setKasiSignChecked] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalNominal = targets.length * 500000;

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onExecuteBatchDisbursement(targets.map((t) => t.id), batchNumber);
      setIsProcessing(false);
      setIsCompleted(true);
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[16px] max-w-3xl w-full shadow-[0_20px_40px_rgba(15,23,42,0.12)] border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0f766e] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-200 border border-white/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200 bg-white/10 px-2 py-0.5 rounded">
                Modul Pencairan Massal (SP2D / Payroll)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Berita Acara Penyaluran Insentif Guru Keagamaan
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {isCompleted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">
                  Penyaluran Batch Berhasil Dibukukan!
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Sebanyak <strong>{targets.length} Pengajar Keagamaan</strong> telah disalurkan dengan total nominal <strong>Rp {totalNominal.toLocaleString('id-ID')}</strong> melalui {bankTarget}.
                </p>
                <p className="font-mono text-xs text-teal-800 font-bold mt-2">
                  Nomor Berita Acara: {batchNumber}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 text-xs font-semibold text-[#0f766e] bg-teal-50 border border-teal-300 rounded-[10px] hover:bg-teal-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Berita Acara & Tanda Terima</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0f766e] rounded-[10px] hover:bg-[#0d9488] transition-colors cursor-pointer"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Official Document Preview Box */}
              <div className="border border-slate-300 rounded-2xl p-6 bg-slate-50/50 space-y-4">
                {/* Government Letterhead / KOP Surat */}
                <div className="text-center border-b-2 border-slate-800 pb-4 space-y-0.5">
                  <p className="text-xs font-bold text-slate-700 tracking-wide">
                    PEMERINTAH KOTA MALANG
                  </p>
                  <p className="text-sm font-extrabold text-slate-900 tracking-wider">
                    KECAMATAN SUKUN • KELURAHAN BANDULAN
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Jl. Raya Bandulan No. 54 Malang • Telp. (0341) 561234 • Kode Pos 65146
                  </p>
                </div>

                {/* Surat Title */}
                <div className="text-center pt-1 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 uppercase underline decoration-1">
                    BERITA ACARA PENYALURAN DANA INSENTIF GURU KEAGAMAAN
                  </h4>
                  <p className="font-mono text-xs text-slate-600">
                    Nomor: {batchNumber}
                  </p>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  Pada hari ini, <strong>Senin tanggal Dua bulan November tahun Dua Ribu Dua Puluh Enam</strong>, bertempat di Kantor Kelurahan Bandulan Kecamatan Sukun Kota Malang, telah disetujui dan diajukan penyaluran bantuan insentif operasional bagi Guru Ngaji (TPQ/Madrasah Diniyah) dan Guru Sekolah Minggu untuk <strong>Periode {selectedPeriod}</strong>.
                </p>

                {/* Summary Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-2.5 px-4 font-semibold text-slate-600 w-1/3">Jumlah Penerima Batch</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 tabular-nums">
                          {targets.length} Pengajar Keagamaan
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2.5 px-4 font-semibold text-slate-600">Besaran Insentif</td>
                        <td className="py-2.5 px-4 text-slate-800">
                          Rp 500.000 / orang / bulan
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100 bg-teal-50/40">
                        <td className="py-2.5 px-4 font-bold text-teal-900">Total Anggaran Dicairkan</td>
                        <td className="py-2.5 px-4 font-extrabold text-[#0f766e] text-sm tabular-nums">
                          Rp {totalNominal.toLocaleString('id-ID')}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-600">Mekanisme Penyaluran</td>
                        <td className="py-2.5 px-4 text-slate-800 font-medium">
                          Transfer Langsung ke Rekening Bank Penerima (Nontunai)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Target Recipients Mini-List */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Daftar Guru dalam Batch Ini ({targets.length})</span>
                    <span className="text-slate-400 font-normal">Sesuai SK & Verifikasi Dokumen</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
                    {targets.length === 0 ? (
                      <p className="p-4 text-center text-slate-400">
                        Tidak ada guru dalam status 'Siap Salur'. Silakan verifikasi berkas guru terlebih dahulu.
                      </p>
                    ) : (
                      targets.map((t, idx) => (
                        <div key={t.id} className="p-2.5 px-3 flex items-center justify-between text-xs hover:bg-slate-50">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono text-[10px]">{idx + 1}.</span>
                            <span className="font-semibold text-slate-800">{t.nama}</span>
                            <span className="text-[10px] text-slate-500">({t.namaLembaga} - {t.rw})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-500 text-[11px]">{t.bankPenyalur} {t.nomorRekening}</span>
                            <span className="font-bold text-slate-900 tabular-nums">Rp 500.000</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Official Signatures Verification */}
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-6 text-center">
                  <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500">Disiapkan & Diverifikasi oleh:</p>
                    <p className="text-xs font-bold text-slate-900">Bambang Trianto, S.Sos</p>
                    <p className="text-[10px] text-slate-500">Kasi Kesejahteraan Rakyat Kelurahan Bandulan</p>
                    <label className="flex items-center justify-center gap-1.5 text-[11px] text-teal-800 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={kasiSignChecked}
                        onChange={(e) => setKasiSignChecked(e.target.checked)}
                        className="rounded text-[#0f766e]"
                      />
                      <span>Bubuhkan Tanda Tangan Digital</span>
                    </label>
                  </div>

                  <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500">Mengetahui & Menyetujui:</p>
                    <p className="text-xs font-bold text-slate-900">Drs. Supriyanto, M.AP</p>
                    <p className="text-[10px] text-slate-500">Lurah Bandulan Kota Malang</p>
                    <label className="flex items-center justify-center gap-1.5 text-[11px] text-teal-800 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lurahSignChecked}
                        onChange={(e) => setLurahSignChecked(e.target.checked)}
                        className="rounded text-[#0f766e]"
                      />
                      <span>Otorisasi & Cap Stempel Resmi</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-[10px] hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Draf Berita Acara</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    disabled={targets.length === 0 || isProcessing}
                    onClick={handleProcess}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#d97706] hover:bg-[#b45309] disabled:bg-slate-300 rounded-[10px] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Meneruskan ke Bank Penyalur...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Eksekusi Pencairan Dana (Rp {totalNominal.toLocaleString('id-ID')})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
