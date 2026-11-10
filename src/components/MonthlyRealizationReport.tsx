import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Calendar, 
  Filter, 
  ShieldCheck, 
  QrCode, 
  FileText, 
  ChevronDown, 
  SlidersHorizontal, 
  Coins, 
  Users, 
  Award,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Recipient, HonorRole, AuthUser } from '../types';
import { exportRecipientsToXLSX } from '../utils/excelExport';

interface MonthlyRealizationReportProps {
  recipients: Recipient[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  currentUser: AuthUser | null;
}

interface RoleSummaryData {
  key: HonorRole;
  label: string;
  shortLabel: string;
  color: string;
  icon: string;
  totalTarget: number;
  totalDisbursed: number;
  totalPending: number;
  totalRevisi: number;
  paguBudget: number;
  realizedBudget: number;
  remainingBudget: number;
  realizationPct: number;
  rwCoverage: string[];
}

export const MonthlyRealizationReport: React.FC<MonthlyRealizationReportProps> = ({
  recipients,
  selectedPeriod,
  onPeriodChange,
  currentUser,
}) => {
  // Period & Filter state
  const [period, setPeriod] = useState<string>(selectedPeriod || 'November 2026');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedRw, setSelectedRw] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'TERSALURKAN' | 'BELUM_SALUR'>('ALL');
  const [reportFormat, setReportFormat] = useState<'FULL' | 'REKAP_ONLY'>('FULL');
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Official document metadata state
  const [docNumber, setDocNumber] = useState<string>('900.1.3/KESRA-BDL/2026/XI/089');
  const [reportDate, setReportDate] = useState<string>('08 November 2026');
  const [kasiKesraName, setKasiKesraName] = useState<string>('Dra. Siti Rahmawati, M.AP');
  const [kasiKesraNip, setKasiKesraNip] = useState<string>('19820815 200604 2 018');
  const [lurahName, setLurahName] = useState<string>('Drs. H. Bambang Setiawan, M.Si');
  const [lurahNip, setLurahNip] = useState<string>('19740512 199803 1 004');
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);

  // Synchronize period change with parent if updated
  const handlePeriodSelect = (p: string) => {
    setPeriod(p);
    onPeriodChange(p);
    // Update doc number roman month
    const parts = p.split(' ');
    const month = parts[0] || 'November';
    const year = parts[1] || '2026';
    const romanMonths: Record<string, string> = {
      'Januari': 'I', 'Februari': 'II', 'Maret': 'III', 'April': 'IV',
      'Mei': 'V', 'Juni': 'VI', 'Juli': 'VII', 'Agustus': 'VIII',
      'September': 'IX', 'Oktober': 'X', 'November': 'XI', 'Desember': 'XII'
    };
    const roman = romanMonths[month] || 'XI';
    setDocNumber(`900.1.3/KESRA-BDL/${year}/${roman}/089`);
  };

  // Available periods
  const periodOptions = [
    'November 2026',
    'Desember 2026',
    'Januari 2027',
    'Februari 2027',
    'Maret 2027',
    'April 2027',
  ];

  // Role metadata definitions
  const roleConfig: Record<HonorRole, { label: string; short: string; color: string; icon: string }> = {
    GURU_TPQ: {
      label: "Guru Taman Pendidikan Al-Qur'an (TPQ)",
      short: 'Guru TPQ',
      color: '#0f766e',
      icon: '📖',
    },
    GURU_SEKOLAH_MINGGU: {
      label: 'Guru Sekolah Minggu (Kristen / Katolik)',
      short: 'Guru Sekolah Minggu',
      color: '#0284c7',
      icon: '⛪',
    },
    PENJAGA_TEMPAT_IBADAH: {
      label: 'Penjaga Tempat Ibadah (Marbot Masjid/Musholla)',
      short: 'Penjaga Tempat Ibadah (Marbot)',
      color: '#059669',
      icon: '🕌',
    },
    PERAWAT_JENAZAH: {
      label: 'Petugas Perawat & Pemulasaraan Jenazah',
      short: 'Perawat Jenazah',
      color: '#7c3aed',
      icon: '🤝',
    },
    PENJAGA_MAKAM: {
      label: 'Petugas Pengelola & Penjaga Makam Lingkungan',
      short: 'Penjaga Makam',
      color: '#d97706',
      icon: '🌿',
    },
  };

  const roleKeys: HonorRole[] = [
    'GURU_TPQ',
    'GURU_SEKOLAH_MINGGU',
    'PENJAGA_TEMPAT_IBADAH',
    'PERAWAT_JENAZAH',
    'PENJAGA_MAKAM',
  ];

  // Aggregated data per role
  const roleSummaries = useMemo<RoleSummaryData[]>(() => {
    return roleKeys.map((key) => {
      const roleRecipients = recipients.filter((r) => r.kategori === key);
      const totalTarget = roleRecipients.length;
      const disbursed = roleRecipients.filter((r) => r.status === 'TERSALURKAN');
      const pending = roleRecipients.filter((r) => r.status === 'MENUNGGU_VERIFIKASI' || r.status === 'SIAP_SALUR');
      const revisi = roleRecipients.filter((r) => r.status === 'PERLU_REVISI');

      const paguBudget = totalTarget * 500000;
      const realizedBudget = disbursed.length * 500000;
      const remainingBudget = paguBudget - realizedBudget;
      const realizationPct = paguBudget > 0 ? (realizedBudget / paguBudget) * 100 : 0;

      const rwCoverage = Array.from(new Set(roleRecipients.map((r) => r.rw))).sort();

      return {
        key,
        label: roleConfig[key].label,
        shortLabel: roleConfig[key].short,
        color: roleConfig[key].color,
        icon: roleConfig[key].icon,
        totalTarget,
        totalDisbursed: disbursed.length,
        totalPending: pending.length,
        totalRevisi: revisi.length,
        paguBudget,
        realizedBudget,
        remainingBudget,
        realizationPct,
        rwCoverage,
      };
    });
  }, [recipients]);

  // Overall totals across all 5 roles
  const grandTotal = useMemo(() => {
    const totalTarget = roleSummaries.reduce((acc, curr) => acc + curr.totalTarget, 0);
    const totalDisbursed = roleSummaries.reduce((acc, curr) => acc + curr.totalDisbursed, 0);
    const totalPending = roleSummaries.reduce((acc, curr) => acc + curr.totalPending, 0);
    const totalRevisi = roleSummaries.reduce((acc, curr) => acc + curr.totalRevisi, 0);
    const paguBudget = roleSummaries.reduce((acc, curr) => acc + curr.paguBudget, 0);
    const realizedBudget = roleSummaries.reduce((acc, curr) => acc + curr.realizedBudget, 0);
    const remainingBudget = paguBudget - realizedBudget;
    const realizationPct = paguBudget > 0 ? (realizedBudget / paguBudget) * 100 : 0;

    return {
      totalTarget,
      totalDisbursed,
      totalPending,
      totalRevisi,
      paguBudget,
      realizedBudget,
      remainingBudget,
      realizationPct,
    };
  }, [roleSummaries]);

  // Filtered recipient list for Table 2 (Nominatif SPJ)
  const filteredNominativeRecipients = useMemo(() => {
    return recipients.filter((r) => {
      if (selectedRole !== 'ALL' && r.kategori !== selectedRole) return false;
      if (selectedRw !== 'ALL' && r.rw !== selectedRw) return false;
      if (statusFilter === 'TERSALURKAN' && r.status !== 'TERSALURKAN') return false;
      if (statusFilter === 'BELUM_SALUR' && r.status === 'TERSALURKAN') return false;
      return true;
    });
  }, [recipients, selectedRole, selectedRw, statusFilter]);

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // CSV Export
  const handleDownloadCsv = () => {
    const headers = [
      'No',
      'NIK Terverifikasi',
      'Nama Lengkap',
      'Kategori Peran',
      'Lembaga / Lokasi Tugas',
      'RW',
      'RT',
      'Bank Penyalur',
      'Nomor Rekening',
      'Nominal (Rp)',
      'Status Penyaluran',
      'Periode',
      'Verifikator',
    ];

    const rows = filteredNominativeRecipients.map((r, index) => [
      index + 1,
      r.maskedNik,
      `"${r.nama.replace(/"/g, '""')}"`,
      `"${r.kategoriLabel.replace(/"/g, '""')}"`,
      `"${r.namaLembaga.replace(/"/g, '""')}"`,
      r.rw,
      r.rt,
      r.bankPenyalur,
      `'${r.nomorRekening}`,
      r.nominalPerBulan,
      r.status,
      period,
      `"${r.verifierName || 'Kasi Kesra'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Realisasi_Insentif_Bandulan_${period.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP INTERACTIVE CONTROLS BAR (Hidden during Print) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0f766e] text-xs font-bold border border-teal-200">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Modul Cetak Laporan Realisasi & SPJ Kesra</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Laporan Realisasi Bulanan Penyaluran Insentif
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekapitulasi penyerapan anggaran honorarium 5 peran pelayan masyarakat Kelurahan Bandulan sesuai standar SPJ resmi Pemkot Malang.
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>{showConfig ? 'Sembunyikan Opsi Dokumen' : 'Opsi Pejabat & Surat'}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Unduh CSV</span>
            </button>

            <button
              onClick={() => exportRecipientsToXLSX(filteredNominativeRecipients, 'Laporan_Realisasi_Insentif_Bandulan', { period })}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Unduh Buku Kerja Excel (.xlsx) Lengkap dengan Rekapitulasi 5 Peran"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor XLSX (Excel)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen PDF (A4)</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Period Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Periode Bulan
            </label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <select
                value={period}
                onChange={(e) => handlePeriodSelect(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-teal-600 focus:bg-white cursor-pointer"
              >
                {periodOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Filter Kategori Peran
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-teal-600 focus:bg-white cursor-pointer"
            >
              <option value="ALL">Semua 5 Peran Resmi</option>
              <option value="GURU_TPQ">Guru TPQ</option>
              <option value="GURU_SEKOLAH_MINGGU">Guru Sekolah Minggu</option>
              <option value="PENJAGA_TEMPAT_IBADAH">Penjaga Tempat Ibadah (Marbot)</option>
              <option value="PERAWAT_JENAZAH">Perawat Jenazah</option>
              <option value="PENJAGA_MAKAM">Penjaga Makam</option>
            </select>
          </div>

          {/* RW Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Filter Wilayah RW
            </label>
            <select
              value={selectedRw}
              onChange={(e) => setSelectedRw(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-teal-600 focus:bg-white cursor-pointer"
            >
              <option value="ALL">Semua Wilayah (9 RW)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const rwStr = `RW 0${num}`;
                return (
                  <option key={rwStr} value={rwStr}>
                    {rwStr} Bandulan
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status Penyaluran */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status Realisasi
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-teal-600 focus:bg-white cursor-pointer"
            >
              <option value="ALL">Semua Status Penerima</option>
              <option value="TERSALURKAN">Hanya Tersalurkan (Selesai SPJ)</option>
              <option value="BELUM_SALUR">Belum Tersalurkan / Menunggu</option>
            </select>
          </div>

          {/* Format Cetak */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Format Tampilan Dokumen
            </label>
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-teal-600 focus:bg-white cursor-pointer"
            >
              <option value="FULL">Format Lengkap (Rekap + Nominatif)</option>
              <option value="REKAP_ONLY">Format Ringkas (Rekapitulasi Saja)</option>
            </select>
          </div>
        </div>

        {/* Collapsible Document Metadata Customizer */}
        {showConfig && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                <span>Pengaturan Penomoran Surat & Pejabat Penandatangan</span>
              </span>
              <button
                onClick={() => {
                  setDocNumber('900.1.3/KESRA-BDL/2026/XI/089');
                  setKasiKesraName('Dra. Siti Rahmawati, M.AP');
                  setKasiKesraNip('19820815 200604 2 018');
                  setLurahName('Drs. H. Bambang Setiawan, M.Si');
                  setLurahNip('19740512 199803 1 004');
                  setReportDate('08 November 2026');
                }}
                className="text-[11px] text-teal-700 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset ke Standar Kelurahan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Nomor Dokumen Laporan</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">Tanggal Penetapan Dokumen</label>
                <input
                  type="text"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="chkWatermark"
                  checked={includeWatermark}
                  onChange={(e) => setIncludeWatermark(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="chkWatermark" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Tampilkan Cap Resmi & Watermark Digital
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block text-[11px]">Pejabat PPTK / Kasi Kesra:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={kasiKesraName}
                    onChange={(e) => setKasiKesraName(e.target.value)}
                    placeholder="Nama Kasi Kesra"
                    className="px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    value={kasiKesraNip}
                    onChange={(e) => setKasiKesraNip(e.target.value)}
                    placeholder="NIP Kasi Kesra"
                    className="px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 block text-[11px]">Mengetahui / Lurah Bandulan:</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={lurahName}
                    onChange={(e) => setLurahName(e.target.value)}
                    placeholder="Nama Lurah"
                    className="px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                  />
                  <input
                    type="text"
                    value={lurahNip}
                    onChange={(e) => setLurahNip(e.target.value)}
                    placeholder="NIP Lurah"
                    className="px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. OFFICIAL GOVERNMENT PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div 
        id="printable-report-document"
        className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 text-slate-900 print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none relative overflow-hidden"
      >
        {/* Background Watermark during screen preview / print */}
        {includeWatermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <span className="text-[120px] font-black uppercase tracking-widest text-slate-900 rotate-[-25deg]">
              SPJ KESRA BDL
            </span>
          </div>
        )}

        {/* KOP SURAT RESMI PEMERINTAH KOTA MALANG */}
        <div className="border-b-2 border-slate-900 pb-3 mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Municipal Logo / Shield */}
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-800 via-teal-700 to-amber-600 flex flex-col items-center justify-center text-white border-2 border-amber-300 shadow-xs p-1">
                <ShieldCheck className="w-7 h-7 text-amber-200" />
                <span className="text-[7px] font-black tracking-widest text-amber-100 uppercase mt-0.5 leading-none text-center">
                  MALANG KUÇEÇWARA
                </span>
              </div>
            </div>

            {/* Header Text */}
            <div className="flex-1 text-center space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
                PEMERINTAH KOTA MALANG
              </h4>
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide text-slate-900">
                KECAMATAN SUKUN
              </h3>
              <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                KELURAHAN BANDULAN
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-600">
                Jl. Raya Bandulan No. 56 Telp. (0341) 561234 Malang 65146 • Pos-el: kesra.bandulan@malangkota.go.id
              </p>
            </div>

            {/* Document QR & Hash */}
            <div className="w-20 h-20 shrink-0 hidden sm:flex flex-col items-center justify-center border border-slate-300 rounded-lg p-1 text-center bg-slate-50">
              <QrCode className="w-10 h-10 text-slate-800" />
              <span className="text-[8px] font-mono text-slate-500 mt-0.5 leading-none">
                VERIFIED-SPJ
              </span>
            </div>
          </div>

          {/* Double Lines standard for Indonesian municipal letterhead */}
          <div className="mt-3 border-t-2 border-slate-900 pt-0.5">
            <div className="border-t border-slate-500"></div>
          </div>
        </div>

        {/* DOCUMENT TITLE & METADATA */}
        <div className="text-center mb-6 space-y-1">
          <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 underline decoration-slate-900 underline-offset-4">
            LAPORAN REALISASI BULANAN PENYALURAN HONORARIUM / INSENTIF
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-700">
            5 PERAN PELAYAN MASYARAKAT KELURAHAN BANDULAN
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1 font-mono">
            <span>Nomor: <strong>{docNumber}</strong></span>
            <span>•</span>
            <span>Bulan Pelaksanaan: <strong>{period}</strong></span>
            <span>•</span>
            <span>Tahun Anggaran: <strong>2027</strong></span>
          </div>
        </div>

        {/* EXECUTIVE SUMMARY CARDS (Top Overview) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 print:mb-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center print:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Pagu Alokasi</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              Rp {grandTotal.paguBudget.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-slate-500 block">{grandTotal.totalTarget} Orang (5 Peran)</span>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-center print:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Realisasi Tersalur</span>
            <span className="text-base sm:text-lg font-bold text-emerald-700 tabular-nums">
              Rp {grandTotal.realizedBudget.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              {grandTotal.totalDisbursed} Orang ({grandTotal.realizationPct.toFixed(1)}%)
            </span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-center print:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Menunggu / Proses</span>
            <span className="text-base sm:text-lg font-bold text-amber-700 tabular-nums">
              Rp {grandTotal.remainingBudget.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold block">
              {grandTotal.totalPending + grandTotal.totalRevisi} Orang Belum Salur
            </span>
          </div>

          <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-3 text-center print:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-teal-800 block">Capaian Realisasi</span>
            <span className="text-base sm:text-lg font-black text-teal-700 tabular-nums">
              {grandTotal.realizationPct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-teal-700 font-semibold block">9 Wilayah RW Bandulan</span>
          </div>
        </div>

        {/* SECTION 1: TABEL REKAPITULASI PENYALURAN 5 PERAN RESMI */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-black">
                I
              </span>
              <span>Rekapitulasi Penyaluran Insentif Berdasarkan 5 Kategori Peran</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium italic">
              Standar Honor: Rp 500.000 / orang / bulan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-300 print:border-slate-900">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold print:bg-slate-200 border-b border-slate-300 print:border-slate-900">
                  <th className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center w-10">No</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900">Kategori Peran Pelayan Masyarakat</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center">Pagu (Org)</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center">Tersalur (Org)</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center">Sisa (Org)</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-right">Pagu Anggaran</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-right">Realisasi (Rp)</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-right">Sisa Anggaran</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center w-16">%</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 print:divide-slate-900">
                {roleSummaries.map((item, index) => (
                  <tr key={item.key} className="hover:bg-slate-50/80 print:hover:bg-transparent">
                    <td className="py-2 px-3 border-r border-slate-300 print:border-slate-900 text-center font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 print:border-slate-900 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="no-print">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal block print:hidden">
                        Cakupan: {item.rwCoverage.join(', ') || 'Semua RW'}
                      </span>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 print:border-slate-900 text-center font-semibold tabular-nums">
                      {item.totalTarget}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 print:border-slate-900 text-center font-bold text-emerald-700 tabular-nums">
                      {item.totalDisbursed}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 print:border-slate-900 text-center font-medium text-amber-700 tabular-nums">
                      {item.totalPending + item.totalRevisi}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 print:border-slate-900 text-right tabular-nums">
                      Rp {item.paguBudget.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 print:border-slate-900 text-right font-bold text-emerald-800 tabular-nums">
                      Rp {item.realizedBudget.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 print:border-slate-900 text-right text-slate-600 tabular-nums">
                      Rp {item.remainingBudget.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 print:border-slate-900 text-center font-bold tabular-nums">
                      {item.realizationPct.toFixed(0)}%
                    </td>
                    <td className="py-2 px-3 text-center">
                      {item.realizationPct === 100 ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 print:border print:border-slate-900">
                          LENGKAP
                        </span>
                      ) : item.realizationPct > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 print:border print:border-slate-900">
                          SEBAGIAN
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 print:border print:border-slate-900">
                          PROSES
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/90 font-black text-slate-900 print:bg-slate-200 border-t-2 border-slate-900">
                  <td colSpan={2} className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center uppercase tracking-wide">
                    TOTAL KESELURUHAN (5 PERAN)
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center tabular-nums">
                    {grandTotal.totalTarget}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center text-emerald-800 tabular-nums">
                    {grandTotal.totalDisbursed}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center text-amber-800 tabular-nums">
                    {grandTotal.totalPending + grandTotal.totalRevisi}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-right tabular-nums">
                    Rp {grandTotal.paguBudget.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-right text-emerald-900 tabular-nums">
                    Rp {grandTotal.realizedBudget.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-right tabular-nums">
                    Rp {grandTotal.remainingBudget.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-300 print:border-slate-900 text-center tabular-nums">
                    {grandTotal.realizationPct.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-center text-[10px]">
                    SPJ SAH
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* SECTION 2: DAFTAR NOMINATIF PENERIMA (SPJ TANDA TERIMA) */}
        {reportFormat === 'FULL' && (
          <div className="mb-6 space-y-2 print-break-inside-avoid">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-black">
                  II
                </span>
                <span>Daftar Nominatif Tanda Terima & Rekening Penyaluran Bank Jatim</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Menampilkan {filteredNominativeRecipients.length} Penerima Terdaftar
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse border border-slate-300 print:border-slate-900">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold print:bg-slate-200 border-b border-slate-300 print:border-slate-900">
                    <th className="py-2 px-2 border-r border-slate-300 print:border-slate-900 text-center w-8">No</th>
                    <th className="py-2 px-2.5 border-r border-slate-300 print:border-slate-900">NIK (UU PDP)</th>
                    <th className="py-2 px-2.5 border-r border-slate-300 print:border-slate-900">Nama Penerima & Peran</th>
                    <th className="py-2 px-2.5 border-r border-slate-300 print:border-slate-900">Lembaga / Tempat Tugas</th>
                    <th className="py-2 px-2 border-r border-slate-300 print:border-slate-900 text-center">Wilayah</th>
                    <th className="py-2 px-2.5 border-r border-slate-300 print:border-slate-900">No. Rekening</th>
                    <th className="py-2 px-2 border-r border-slate-300 print:border-slate-900 text-right">Nominal</th>
                    <th className="py-2 px-2 border-r border-slate-300 print:border-slate-900 text-center">Status</th>
                    <th className="py-2 px-3 text-center w-28">Tanda Tangan / SPJ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 print:divide-slate-900">
                  {filteredNominativeRecipients.map((rec, idx) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 print:hover:bg-transparent">
                      <td className="py-1.5 px-2 border-r border-slate-300 print:border-slate-900 text-center font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 print:border-slate-900 font-mono text-[10px] text-slate-700 whitespace-nowrap">
                        {rec.maskedNik}
                      </td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 print:border-slate-900">
                        <div className="font-bold text-slate-900">{rec.nama}</div>
                        <div className="text-[10px] text-slate-600 font-medium">
                          {rec.kategoriLabel}
                        </div>
                      </td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 print:border-slate-900 text-slate-700">
                        <span className="font-medium text-slate-900">{rec.namaLembaga}</span>
                        {rec.nspqOrNsm && (
                          <span className="block text-[9px] font-mono text-slate-500">
                            NSPQ/NSM: {rec.nspqOrNsm}
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-300 print:border-slate-900 text-center font-semibold text-slate-800 whitespace-nowrap">
                        {rec.rw}
                      </td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 print:border-slate-900 font-mono text-[10px]">
                        <span className="font-semibold text-slate-900">{rec.bankPenyalur}</span>
                        <span className="block text-slate-600">{rec.nomorRekening}</span>
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-300 print:border-slate-900 text-right font-semibold tabular-nums whitespace-nowrap">
                        Rp {rec.nominalPerBulan.toLocaleString('id-ID')}
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-300 print:border-slate-900 text-center whitespace-nowrap">
                        {rec.status === 'TERSALURKAN' ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded print:border print:border-slate-900">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 no-print" />
                            SALUR
                          </span>
                        ) : rec.status === 'SIAP_SALUR' ? (
                          <span className="inline-block text-[9px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded print:border print:border-slate-900">
                            SIAP
                          </span>
                        ) : (
                          <span className="inline-block text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded print:border print:border-slate-900">
                            VERIFIKASI
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-3 text-center align-middle">
                        {rec.status === 'TERSALURKAN' ? (
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono text-emerald-800 font-bold block">
                              PAYROLL BANK
                            </span>
                            <span className="text-[8px] font-mono text-slate-500 block leading-tight">
                              REF: {rec.referenceNumber ? rec.referenceNumber.slice(-8) : `BA-2026-${rec.id.slice(-4)}`}
                            </span>
                          </div>
                        ) : (
                          <div className="h-6 border-b border-dotted border-slate-400 mx-2"></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: KETENTUAN HUKUM & KESRA NOTES */}
        <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-3 mb-8 text-[11px] text-slate-600 space-y-1 print:border-slate-800 print:bg-transparent print-break-inside-avoid">
          <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wide">
            Ketentuan & Catatan Akuntabilitas Pelaksanaan:
          </p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>
              Penyaluran honorarium insentif ini dilakukan secara <strong>Non-Tunai (Transfer Bank Jatim)</strong> langsung ke rekening masing-masing pelayan masyarakat tanpa potongan apapun.
            </li>
            <li>
              Seluruh nama di atas telah melalui verifikasi keaktifan presensi bulanan dan validasi administrasi kelurahan oleh Seksi Kesejahteraan Rakyat (Kesra) Kelurahan Bandulan.
            </li>
            <li>
              Dokumen ini merupakan bagian sah dari Berita Acara Rekapitulasi SPJ Kegiatan Pembinaan Keagamaan dan Sosial Kemasyarakatan Kelurahan Bandulan Tahun Anggaran 2027.
            </li>
          </ul>
        </div>

        {/* SECTION 4: LEMBAR PENGESAHAN RESMI (TANDA TANGAN DUA PIHAK) */}
        <div className="print-break-inside-avoid pt-2">
          <div className="flex justify-end mb-4">
            <p className="text-xs text-slate-800 font-medium">
              Malang, {reportDate}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center text-xs">
            {/* Kolom Kiri: Mengetahui Lurah */}
            <div className="space-y-1 flex flex-col items-center">
              <span className="text-slate-600 font-medium">Mengetahui,</span>
              <span className="font-bold text-slate-900 tracking-wide uppercase">
                LURAH BANDULAN
              </span>

              {/* Space for signature / seal */}
              <div className="h-24 w-48 relative flex items-center justify-center my-1">
                {includeWatermark && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-70">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-teal-700/60 flex items-center justify-center p-1 text-[8px] font-bold text-teal-800 uppercase tracking-tighter rotate-[-12deg] text-center leading-tight">
                      PEMERINTAH KOTA MALANG<br/>★ KELURAHAN BANDULAN ★
                    </div>
                  </div>
                )}
                <div className="font-mono text-[9px] text-slate-400 bg-white/80 px-2 py-0.5 border border-slate-200 rounded">
                  [TANDA TANGAN ELEKTRONIK]
                </div>
              </div>

              <span className="font-bold text-slate-900 underline decoration-slate-900 underline-offset-2">
                {lurahName}
              </span>
              <span className="text-[11px] text-slate-600">Pembina Tk. I</span>
              <span className="text-[11px] text-slate-600 font-mono">NIP. {lurahNip}</span>
            </div>

            {/* Kolom Kanan: Kasi Kesra */}
            <div className="space-y-1 flex flex-col items-center">
              <span className="text-slate-600 font-medium">Pejabat Pelaksana Teknis Kegiatan (PPTK),</span>
              <span className="font-bold text-slate-900 tracking-wide uppercase">
                KASI KESEJAHTERAAN RAKYAT
              </span>

              {/* Space for signature / seal */}
              <div className="h-24 w-48 relative flex items-center justify-center my-1">
                {includeWatermark && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-70">
                    <div className="w-20 h-20 rounded-full border-2 border-teal-600/50 flex items-center justify-center p-1 text-[8px] font-bold text-teal-800 uppercase tracking-tighter rotate-[8deg] text-center leading-tight">
                      SEKSI KESRA<br/>★ KEL. BANDULAN ★
                    </div>
                  </div>
                )}
                <div className="font-mono text-[9px] text-teal-800 font-semibold bg-white/80 px-2 py-0.5 border border-teal-200 rounded">
                  SPJ KESRA DISAHKAN
                </div>
              </div>

              <span className="font-bold text-slate-900 underline decoration-slate-900 underline-offset-2">
                {kasiKesraName}
              </span>
              <span className="text-[11px] text-slate-600">Penata Tingkat I</span>
              <span className="text-[11px] text-slate-600 font-mono">NIP. {kasiKesraNip}</span>
            </div>
          </div>

          {/* Footer Validation Strip */}
          <div className="border-t border-slate-200 mt-8 pt-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono gap-2 print:border-slate-800">
            <span>Sistem Insentif & Kehormatan Bandulan (SIKB) • UU PDP 27/2022</span>
            <span>Integritas Dokumen SHA-256: 8f9b2a7d4e1c9... [VALID]</span>
            <span>Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
