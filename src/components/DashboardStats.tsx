import React from 'react';
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
  HeartHandshake
} from 'lucide-react';
import { Recipient } from '../types';
import { RW_LIST } from '../data/mockRecipients';

interface DashboardStatsProps {
  recipients: Recipient[];
  onFilterByStatus: (status: string) => void;
  onFilterByCategory: (category: string) => void;
  onFilterByRW: (rw: string) => void;
  onOpenBatchDisbursement: () => void;
  onOpenNewRegistration: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  recipients,
  onFilterByStatus,
  onFilterByCategory,
  onFilterByRW,
  onOpenBatchDisbursement,
  onOpenNewRegistration,
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

  const guruNgajiCount = recipients.filter((r) => r.kategori === 'GURU_NGAJI').length;
  const guruSekolahMingguCount = recipients.filter((r) => r.kategori === 'GURU_SEKOLAH_MINGGU').length;
  const guruLainnyaCount = recipients.filter((r) => r.kategori === 'GURU_PASRAMAN' || r.kategori === 'GURU_VIHARA').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Alert / Information */}
      <div className="bg-gradient-to-r from-teal-900 to-[#0f766e] text-white rounded-2xl p-6 shadow-md border border-teal-700/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-teal-100 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Tata Kelola Insentif Kesejahteraan Pengajar Keagamaan 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Kelurahan Bandulan, Kota Malang
          </h2>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Program apresiasi berkala bagi para pejuang pendidikan agama dan moral anak-anak: Guru Ngaji (TPQ/Madrasah Diniyah) serta Guru Sekolah Minggu di seluruh 9 Rukun Warga (RW 01 s/d RW 09).
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button
            onClick={onOpenBatchDisbursement}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white font-semibold text-sm rounded-[10px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            <span>Pencairan Batch ({readyRecipients.length})</span>
          </button>
          <button
            onClick={onOpenNewRegistration}
            className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-[10px] border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>+ Usulkan Guru Baru</span>
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
              Total Penerima Terdata
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {totalRecipients} <span className="text-sm font-medium text-slate-500">Guru</span>
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold flex items-center">
                100%
              </span>
              <span>Terdaftar di 9 RW Bandulan</span>
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
              <span>dari total Rp {totalAnggaran.toLocaleString('id-ID')}</span>
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
              <span>Perlu validasi presensi & paraf RW</span>
            </p>
          </div>
        </div>

        {/* Card 4: Siap Cair / Batch */}
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
              {readyRecipients.length} <span className="text-sm font-medium text-slate-500">Guru</span>
            </p>
            <p className="text-xs text-sky-700 mt-1 font-medium flex items-center gap-1">
              <span>Rp {(readyRecipients.length * 500000).toLocaleString('id-ID')} siap diteruskan ke Bank</span>
            </p>
          </div>
        </div>
      </div>

      {/* Second Row: Distribution by Category & RW breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0f766e]" />
              Komposisi Pengajar Keagamaan
            </h3>
            <span className="text-xs text-slate-400">Total {totalRecipients}</span>
          </div>

          <div className="space-y-3 pt-2">
            {/* TPQ */}
            <div 
              onClick={() => onFilterByCategory('GURU_NGAJI')}
              className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/50 hover:bg-teal-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0f766e] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0f766e]"></span>
                  Guru Ngaji (TPQ / Madrasah)
                </span>
                <span className="text-slate-800 font-bold tabular-nums">
                  {guruNgajiCount} Guru ({((guruNgajiCount / totalRecipients) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-teal-200/50 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-[#0f766e] rounded-full transition-all duration-500"
                  style={{ width: `${(guruNgajiCount / totalRecipients) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Al-Ikhlas, Baitul Makmur, Nurul Huda, Darussalam, Al-Amin, dll.
              </p>
            </div>

            {/* Sekolah Minggu */}
            <div 
              onClick={() => onFilterByCategory('GURU_SEKOLAH_MINGGU')}
              className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/50 hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0284c7] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
                  Guru Sekolah Minggu (Kristen / Katolik)
                </span>
                <span className="text-slate-800 font-bold tabular-nums">
                  {guruSekolahMingguCount} Guru ({((guruSekolahMingguCount / totalRecipients) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-sky-200/50 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-[#0284c7] rounded-full transition-all duration-500"
                  style={{ width: `${(guruSekolahMingguCount / totalRecipients) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                GKJW Bandulan, BIA St. Vincentius A Paulo, GSJA, GPdI Gloria.
              </p>
            </div>

            {/* Pasraman & Vihara */}
            <div 
              onClick={() => onFilterByCategory('ALL')}
              className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#b45309] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#d97706]"></span>
                  Pasraman Hindu & Vihara Buddhis
                </span>
                <span className="text-slate-800 font-bold tabular-nums">
                  {guruLainnyaCount} Guru ({((guruLainnyaCount / totalRecipients) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-amber-200/50 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-[#d97706] rounded-full transition-all duration-500"
                  style={{ width: `${(guruLainnyaCount / totalRecipients) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Pasraman Widya Dharma & Vihara Dharma Santi Bandulan.
              </p>
            </div>
          </div>
        </div>

        {/* Geographic Distribution across RW 01 - RW 09 Bandulan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0f766e]" />
                Sebaran Penerima Per RW (Kelurahan Bandulan)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring pemerataan dan penyaluran insentif ke 9 Rukun Warga
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0f766e] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              9 RW Aktif
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 pt-2">
            {RW_LIST.map((rw) => {
              const count = recipients.filter((r) => r.rw === rw).length;
              const disbursed = recipients.filter((r) => r.rw === rw && r.status === 'TERSALURKAN').length;
              const isAllDisbursed = count > 0 && disbursed === count;

              return (
                <div
                  key={rw}
                  onClick={() => onFilterByRW(rw)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#0f766e]">
                      {rw}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isAllDisbursed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {disbursed}/{count} Cair
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-900 tabular-nums">{count}</span>
                    <span className="text-[11px] text-slate-500">Guru</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
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
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Besaran Standar Insentif: <strong>Rp 500.000 / bulan</strong> per pengajar keagamaan</span>
            </div>
            <span className="text-slate-400 hidden sm:inline">Bank Penyalur: Bank Jatim (Mitra Pemkot Malang)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
