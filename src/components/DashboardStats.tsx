import React, { useState } from 'react';
import { 
  Users, 
  Coins, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building, 
  MapPin, 
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  HeartHandshake,
  Sparkles,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Recipient, HonorRole } from '../types';
import { RW_LIST, HONOR_ROLES_CONFIG } from '../data/mockRecipients';

interface DashboardStatsProps {
  recipients: Recipient[];
  onFilterByStatus: (status: string) => void;
  onFilterByCategory: (category: string) => void;
  onFilterByRW: (rw: string) => void;
  onOpenBatchDisbursement: () => void;
  onOpenNewRegistration: () => void;
  onOpenMonthlyReport?: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  recipients,
  onFilterByStatus,
  onFilterByCategory,
  onFilterByRW,
  onOpenBatchDisbursement,
  onOpenNewRegistration,
  onOpenMonthlyReport,
}) => {
  // Calculations
  const totalRecipients = recipients.length;
  const disbursedRecipients = recipients.filter((r) => r.status === 'TERSALURKAN');
  const pendingRecipients = recipients.filter((r) => r.status === 'MENUNGGU_VERIFIKASI');
  const readyRecipients = recipients.filter((r) => r.status === 'SIAP_SALUR');
  const revisionRecipients = recipients.filter((r) => r.status === 'PERLU_REVISI');

  const totalAnggaran = totalRecipients * 500000;
  const realisasiAnggaran = disbursedRecipients.length * 500000;
  const persentaseRealisasi = totalRecipients > 0 ? ((disbursedRecipients.length / totalRecipients) * 100).toFixed(1) : '0';

  // 5 Official Roles counts
  const tpqCount = recipients.filter((r) => r.kategori === 'GURU_TPQ').length;
  const smCount = recipients.filter((r) => r.kategori === 'GURU_SEKOLAH_MINGGU').length;
  const marbotCount = recipients.filter((r) => r.kategori === 'PENJAGA_TEMPAT_IBADAH').length;
  const perawatJenazahCount = recipients.filter((r) => r.kategori === 'PERAWAT_JENAZAH').length;
  const penjagaMakamCount = recipients.filter((r) => r.kategori === 'PENJAGA_MAKAM').length;

  // Pie Chart Data for Recharts
  const pieChartData = [
    {
      name: 'Guru TPQ',
      fullName: 'Guru TPQ (Tempat Pendidikan Quran)',
      category: 'GURU_TPQ',
      value: tpqCount,
      color: '#0f766e', // Teal 700
      icon: '📖',
    },
    {
      name: 'Sekolah Minggu',
      fullName: 'Guru Sekolah Minggu',
      category: 'GURU_SEKOLAH_MINGGU',
      value: smCount,
      color: '#0284c7', // Sky 600
      icon: '⛪',
    },
    {
      name: 'Marbot Masjid',
      fullName: 'Penjaga Tempat Ibadah (Marbot)',
      category: 'PENJAGA_TEMPAT_IBADAH',
      value: marbotCount,
      color: '#059669', // Emerald 600
      icon: '🕌',
    },
    {
      name: 'Perawat Jenazah',
      fullName: 'Perawat Jenazah',
      category: 'PERAWAT_JENAZAH',
      value: perawatJenazahCount,
      color: '#7c3aed', // Violet 600
      icon: '🤝',
    },
    {
      name: 'Penjaga Makam',
      fullName: 'Penjaga Makam',
      category: 'PENJAGA_MAKAM',
      value: penjagaMakamCount,
      color: '#d97706', // Amber 600
      icon: '🌿',
    },
  ];

  const roleStats = [
    { key: 'GURU_TPQ', count: tpqCount, color: '#0f766e', bgClass: 'bg-teal-50 border-teal-200 text-teal-800' },
    { key: 'GURU_SEKOLAH_MINGGU', count: smCount, color: '#0284c7', bgClass: 'bg-sky-50 border-sky-200 text-sky-800' },
    { key: 'PENJAGA_TEMPAT_IBADAH', count: marbotCount, color: '#059669', bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { key: 'PERAWAT_JENAZAH', count: perawatJenazahCount, color: '#7c3aed', bgClass: 'bg-purple-50 border-purple-200 text-purple-800' },
    { key: 'PENJAGA_MAKAM', count: penjagaMakamCount, color: '#d97706', bgClass: 'bg-amber-50 border-amber-200 text-amber-800' },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Custom Tooltip for Recharts Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = totalRecipients > 0 ? ((data.value / totalRecipients) * 100).toFixed(1) : '0';
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="text-base">{data.icon}</span>
            <span>{data.name}</span>
          </div>
          <div className="pt-1 border-t border-slate-800 flex items-center justify-between gap-4">
            <span className="text-slate-400">Jumlah Penerima:</span>
            <span className="text-emerald-400 font-bold tabular-nums">
              {data.value} Orang ({pct}%)
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Total Honor Bulanan:</span>
            <span className="font-semibold text-teal-300 tabular-nums">
              Rp {(data.value * 500000).toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[10px] text-amber-300 italic pt-1 flex items-center gap-1">
            <span>• Klik irisan pie untuk memfilter tabel</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Municipal Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-[#0f766e] to-teal-800 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-teal-600/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-semibold backdrop-blur-xs border border-white/15">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Tata Kelola Honorarium 5 Peran Kelurahan Bandulan (Tahun Anggaran 2027)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Kelurahan Bandulan, Kota Malang
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Sistem resmi pendaftaran ulang (Her-Registrasi) dan penyaluran honorarium bulanan bagi <strong>5 peran pelayan masyarakat</strong>: Guru TPQ, Guru Sekolah Minggu, Penjaga Tempat Ibadah (Marbot), Perawat Jenazah, dan Penjaga Makam di 9 RW.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          {onOpenMonthlyReport && (
            <button
              onClick={onOpenMonthlyReport}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Laporan Realisasi (PDF)</span>
            </button>
          )}
          <button
            onClick={onOpenBatchDisbursement}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            <span>Pencairan Batch ({readyRecipients.length} Siap)</span>
          </button>
          <button
            onClick={onOpenNewRegistration}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>+ Usulkan Her-Registrasi</span>
          </button>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Penerima */}
        <div 
          onClick={() => onFilterByStatus('ALL')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total 5 Peran Terdata
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {totalRecipients} <span className="text-sm font-medium text-slate-500">Orang</span>
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold flex items-center">
                100% Terverifikasi
              </span>
              <span>di 9 RW Bandulan</span>
            </p>
          </div>
        </div>

        {/* Card 2: Realisasi Anggaran */}
        <div 
          onClick={() => onFilterByStatus('TERSALURKAN')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Realisasi Penyaluran
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              Rp {realisasiAnggaran.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> {persentaseRealisasi}%
              </span>
              <span>dari alokasi Rp {totalAnggaran.toLocaleString('id-ID')}</span>
            </p>
          </div>
        </div>

        {/* Card 3: Menunggu Verifikasi */}
        <div 
          onClick={() => onFilterByStatus('MENUNGGU_VERIFIKASI')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menunggu Verifikasi
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d97706] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {pendingRecipients.length} <span className="text-sm font-medium text-slate-500">Berkas</span>
            </p>
            <p className="text-xs text-amber-700 mt-1 font-medium flex items-center gap-1">
              <span>Perlu validasi Seksi Kesra & RW</span>
            </p>
          </div>
        </div>

        {/* Card 4: Siap Salur */}
        <div 
          onClick={() => onFilterByStatus('SIAP_SALUR')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Siap Salur (Batch)
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {readyRecipients.length} <span className="text-sm font-medium text-slate-500">Penerima</span>
            </p>
            <p className="text-xs text-sky-700 mt-1 font-medium flex items-center gap-1">
              <span>Rp {(readyRecipients.length * 500000).toLocaleString('id-ID')} siap diteruskan ke Bank Jatim</span>
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: RECHARTS PIE CHART & CATEGORY DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Pie Chart Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center">
                  <PieChartIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Grafik Pie Chart Proporsi 5 Kategori
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Visualisasi perbandingan jumlah penerima insentif per peran
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0f766e] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Recharts
              </span>
            </div>

            {/* Pie Chart Canvas Container */}
            <div className="relative h-[250px] w-full flex items-center justify-center mt-3">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={96}
                    paddingAngle={3}
                    dataKey="value"
                    cursor="pointer"
                    onClick={(entry: any) => {
                      const cat = entry?.category || entry?.payload?.category;
                      if (cat) onFilterByCategory(cat);
                    }}
                    animationDuration={800}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900 tabular-nums leading-none">
                  {totalRecipients}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 mt-1 tracking-wider">
                  Penerima
                </span>
                <span className="text-[9px] text-[#0f766e] font-semibold">
                  5 Kategori
                </span>
              </div>
            </div>
          </div>

          {/* Clickable Legend Grid */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {pieChartData.map((item) => {
              const pct = totalRecipients > 0 ? ((item.value / totalRecipients) * 100).toFixed(0) : '0';
              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => onFilterByCategory(item.category)}
                  className="p-2 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 hover:border-teal-400 text-left transition-all cursor-pointer flex items-center gap-2 group"
                  title={`Klik untuk filter: ${item.fullName}`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-[#0f766e]">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500 tabular-nums font-medium">
                      {item.value} ({pct}%)
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Metric & Budget Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs lg:col-span-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0f766e]" />
                Komposisi & Alokasi Anggaran 5 Peran
              </h3>
              <span className="text-xs text-slate-400 font-bold">Rp 500.000 / Org / Bln</span>
            </div>

            <div className="space-y-2.5 pt-3">
              {roleStats.map((st) => {
                const cfg = HONOR_ROLES_CONFIG[st.key as HonorRole];
                const pct = totalRecipients > 0 ? ((st.count / totalRecipients) * 100).toFixed(0) : '0';
                const subtotal = st.count * 500000;

                return (
                  <div
                    key={st.key}
                    onClick={() => onFilterByCategory(st.key)}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-slate-50/70 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2 text-slate-800 group-hover:text-[#0f766e]">
                        <span className="text-base">{cfg.icon}</span>
                        <span>{cfg.roleName}</span>
                      </span>
                      <div className="text-right">
                        <span className="font-bold tabular-nums text-slate-900 block">
                          {st.count} Orang <span className="text-slate-400 font-normal">({pct}%)</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Rp {subtotal.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${pct}%`,
                          backgroundColor: st.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-teal-50/70 p-3 rounded-2xl border border-teal-200 flex items-center justify-between text-xs text-teal-900">
            <span className="font-semibold">Total Alokasi Anggaran 5 Peran:</span>
            <strong className="font-bold text-sm text-[#0f766e] tabular-nums">
              Rp {totalAnggaran.toLocaleString('id-ID')} / bulan
            </strong>
          </div>
        </div>
      </div>

      {/* Row 3: Geographic Distribution across RW 01 - RW 09 Bandulan */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0f766e]" />
              Sebaran Penerima Per RW (Kelurahan Bandulan)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring pemerataan dan penyaluran honorarium di 9 Rukun Warga
            </p>
          </div>
          <span className="text-xs font-bold text-[#0f766e] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            9 RW Aktif
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-9 gap-2.5 pt-2">
          {RW_LIST.map((rw) => {
            const count = recipients.filter((r) => r.rw === rw).length;
            const disbursed = recipients.filter((r) => r.rw === rw && r.status === 'TERSALURKAN').length;
            const isAllDisbursed = count > 0 && disbursed === count;

            return (
              <div
                key={rw}
                onClick={() => onFilterByRW(rw)}
                className="p-3 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 transition-all cursor-pointer group text-center"
              >
                <div className="flex items-center justify-between lg:flex-col lg:gap-1">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#0f766e]">
                    {rw}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isAllDisbursed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {disbursed}/{count} Cair
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-center gap-1">
                  <span className="text-lg font-bold text-slate-900 tabular-nums">{count}</span>
                  <span className="text-[10px] text-slate-500">Org</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#0f766e] rounded-full transition-all"
                    style={{ width: count > 0 ? `${(disbursed / count) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick info note */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Standar Honorarium Pemkot Malang: <strong>Rp 500.000 / bulan</strong> per penerima tugas</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">Bank Penyalur: Bank Jatim (Tahun Anggaran 2027)</span>
        </div>
      </div>
    </div>
  );
};
