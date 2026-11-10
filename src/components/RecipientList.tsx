import React, { useState } from 'react';
import { 
  Check, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCcw, 
  ArrowUpDown, 
  FileText, 
  Building2, 
  CreditCard, 
  CheckSquare, 
  Square, 
  MinusSquare,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Download,
  Send,
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';
import { Recipient, DisbursementStatus, ReligiousCategory } from '../types';
import { RW_LIST } from '../data/mockRecipients';
import { exportRecipientsToXLSX } from '../utils/excelExport';

interface RecipientListProps {
  recipients: Recipient[];
  selectedRecipientIds: string[];
  onToggleSelectRecipient: (id: string) => void;
  onSelectAllRecipients: (ids: string[]) => void;
  onClearSelectedRecipients: () => void;
  onSelectRecipientForDetail: (recipient: Recipient) => void;
  onOpenBatchDisbursementWithSelection: () => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  rwFilter: string;
  onRwFilterChange: (rw: string) => void;
  selectedPeriod?: string;
}

export const RecipientList: React.FC<RecipientListProps> = ({
  recipients,
  selectedRecipientIds,
  onToggleSelectRecipient,
  onSelectAllRecipients,
  onClearSelectedRecipients,
  onSelectRecipientForDetail,
  onOpenBatchDisbursementWithSelection,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  rwFilter,
  onRwFilterChange,
  selectedPeriod = 'November 2026',
}) => {
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');
  const [bankFilter, setBankFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NAMA' | 'RW' | 'STATUS'>('NAMA');

  // Handle Export to XLSX
  const handleExportXlsx = (mode: 'ALL' | 'FILTERED' | 'SELECTED') => {
    let dataToExport = filteredRecipients;
    let prefix = 'Penerima_Insentif_Bandulan';

    if (mode === 'SELECTED' && selectedRecipientIds.length > 0) {
      dataToExport = recipients.filter((r) => selectedRecipientIds.includes(r.id));
      prefix = 'Penerima_Terpilih_Bandulan';
    } else if (mode === 'ALL') {
      dataToExport = recipients;
      prefix = 'Master_Penerima_Insentif_5Peran_Bandulan';
    } else {
      if (categoryFilter !== 'ALL') prefix += `_${categoryFilter}`;
      if (rwFilter !== 'ALL') prefix += `_${rwFilter.replace(/\s+/g, '')}`;
    }

    exportRecipientsToXLSX(dataToExport, prefix, {
      period: selectedPeriod,
    });
  };

  // Filter logic
  const filteredRecipients = recipients.filter((recipient) => {
    if (statusFilter !== 'ALL' && recipient.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && recipient.kategori !== categoryFilter) return false;
    if (rwFilter !== 'ALL' && recipient.rw !== rwFilter) return false;
    if (bankFilter !== 'ALL' && recipient.bankPenyalur !== bankFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'NAMA') return a.nama.localeCompare(b.nama);
    if (sortBy === 'RW') return a.rw.localeCompare(b.rw);
    if (sortBy === 'STATUS') return a.status.localeCompare(b.status);
    return 0;
  });

  const isAllFilteredSelected = 
    filteredRecipients.length > 0 && 
    filteredRecipients.every((r) => selectedRecipientIds.includes(r.id));

  const isSomeFilteredSelected = 
    filteredRecipients.some((r) => selectedRecipientIds.includes(r.id)) && 
    !isAllFilteredSelected;

  const handleSelectAllToggle = () => {
    if (isAllFilteredSelected) {
      onClearSelectedRecipients();
    } else {
      onSelectAllRecipients(filteredRecipients.map((r) => r.id));
    }
  };

  // Helper for Status Badge styling strictly following design spec
  const renderStatusBadge = (status: DisbursementStatus) => {
    switch (status) {
      case 'TERSALURKAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
            <CheckCircle2 className="w-3 h-3" />
            Tersalurkan
          </span>
        );
      case 'MENUNGGU_VERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
            <Clock className="w-3 h-3" />
            Menunggu Verifikasi
          </span>
        );
      case 'SIAP_SALUR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
            <Check className="w-3 h-3" />
            Siap Salur
          </span>
        );
      case 'PERLU_REVISI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]">
            <AlertCircle className="w-3 h-3" />
            Perlu Revisi
          </span>
        );
    }
  };

  // Helper for Category Badge strictly following the 5 official roles
  const renderCategoryBadge = (category: ReligiousCategory) => {
    switch (category) {
      case 'GURU_TPQ':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4]">
            Guru TPQ
          </span>
        );
      case 'GURU_SEKOLAH_MINGGU':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
            Sekolah Minggu
          </span>
        );
      case 'PENJAGA_TEMPAT_IBADAH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
            Marbot / Tempat Ibadah
          </span>
        );
      case 'PERAWAT_JENAZAH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe]">
            Perawat Jenazah
          </span>
        );
      case 'PENJAGA_MAKAM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
            Penjaga Makam
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-700">
            {category}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters & Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              aria-label="Filter Berdasarkan Status Penyaluran"
              className="h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-[10px] text-slate-800 focus:outline-none focus:ring-3 focus:ring-teal-700/15 focus:border-[#0f766e]"
            >
              <option value="ALL">Semua Status Penyaluran</option>
              <option value="TERSALURKAN">Tersalurkan (Selesai)</option>
              <option value="SIAP_SALUR">Siap Salur (Batch)</option>
              <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
              <option value="PERLU_REVISI">Perlu Revisi Dokumen</option>
            </select>

            {/* Category Filter for 5 Roles */}
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              aria-label="Filter Berdasarkan Kategori Peran"
              className="h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-[10px] text-slate-800 focus:outline-none focus:ring-3 focus:ring-teal-700/15 focus:border-[#0f766e]"
            >
              <option value="ALL">Semua Peran (5 Peran Kelurahan)</option>
              <option value="GURU_TPQ">1. Guru TPQ (Tempat Pendidikan Quran)</option>
              <option value="GURU_SEKOLAH_MINGGU">2. Guru Sekolah Minggu</option>
              <option value="PENJAGA_TEMPAT_IBADAH">3. Penjaga Tempat Ibadah (Marbot)</option>
              <option value="PERAWAT_JENAZAH">4. Perawat Jenazah</option>
              <option value="PENJAGA_MAKAM">5. Penjaga Makam</option>
            </select>

            {/* RW Filter */}
            <select
              value={rwFilter}
              onChange={(e) => onRwFilterChange(e.target.value)}
              aria-label="Filter Berdasarkan Wilayah RW"
              className="h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-[10px] text-slate-800 focus:outline-none focus:ring-3 focus:ring-teal-700/15 focus:border-[#0f766e]"
            >
              <option value="ALL">Semua Wilayah RW (01-09)</option>
              {RW_LIST.map((rw) => (
                <option key={rw} value={rw}>
                  {rw} Bandulan
                </option>
              ))}
            </select>

            {/* Bank Penyalur Filter */}
            <select
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              aria-label="Filter Berdasarkan Bank Penyalur"
              className="h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-[10px] text-slate-800 focus:outline-none focus:ring-3 focus:ring-teal-700/15 focus:border-[#0f766e]"
            >
              <option value="ALL">Semua Bank Penyalur</option>
              <option value="Bank Jatim">Bank Jatim</option>
              <option value="Bank BRI">Bank BRI</option>
              <option value="Bank Mandiri">Bank Mandiri</option>
              <option value="Bank BSI">Bank BSI</option>
            </select>
          </div>

          {/* Right: View Mode Toggle & Sort */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-[10px] border border-slate-300">
              <button
                onClick={() => setViewMode('CARDS')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'CARDS'
                    ? 'bg-white text-[#0f766e] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Kartu Profil"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'TABLE'
                    ? 'bg-white text-[#0f766e] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tampilan Tabel Administratif"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Urutkan Data Penerima"
                className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="NAMA">Urutkan: Nama</option>
                <option value="RW">Urutkan: Wilayah RW</option>
                <option value="STATUS">Urutkan: Status</option>
              </select>
            </div>

            {/* Export XLSX Button */}
            <button
              onClick={() => handleExportXlsx('FILTERED')}
              className="h-10 px-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-[10px] shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Ekspor Seluruh Data Penerima Terfilter ke File Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor XLSX</span>
              <span className="text-[10px] font-semibold bg-emerald-800/80 px-1.5 py-0.5 rounded">
                {filteredRecipients.length}
              </span>
            </button>
          </div>
        </div>

        {/* Batch Selection Action Bar when items are selected */}
        {selectedRecipientIds.length > 0 && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#0f766e] text-white flex items-center justify-center text-xs font-bold">
                {selectedRecipientIds.length}
              </span>
              <span className="text-xs font-semibold text-teal-900">
                Penerima Terpilih untuk Tindakan Masal
              </span>
              <span className="text-xs text-teal-700 font-bold tabular-nums">
                (Total Alokasi: Rp {(selectedRecipientIds.length * 500000).toLocaleString('id-ID')})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportXlsx('SELECTED')}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-[10px] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Unduh data yang dipilih dalam format Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh XLSX Terpilih ({selectedRecipientIds.length})</span>
              </button>
              <button
                onClick={onOpenBatchDisbursementWithSelection}
                className="px-3.5 py-1.5 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-semibold rounded-[10px] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Proses Pencairan Batch ({selectedRecipientIds.length})</span>
              </button>
              <button
                onClick={onClearSelectedRecipients}
                className="px-3 py-1.5 bg-white text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-[10px] border border-slate-300 transition-colors cursor-pointer"
              >
                Batal Pilih
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Select All Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAllToggle}
            className="flex items-center gap-2 font-medium text-slate-700 hover:text-[#0f766e] transition-colors cursor-pointer"
          >
            {isAllFilteredSelected ? (
              <CheckSquare className="w-4 h-4 text-[#0f766e]" />
            ) : isSomeFilteredSelected ? (
              <MinusSquare className="w-4 h-4 text-[#0f766e]" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Pilih Semua di Halaman ({filteredRecipients.length} Data)</span>
          </button>
        </div>
        <span className="text-slate-400">
          Menampilkan {filteredRecipients.length} dari {recipients.length} penerima honorarium (5 peran)
        </span>
      </div>

      {/* VIEW MODE 1: DATA CARDS (Strictly implementing design spec) */}
      {viewMode === 'CARDS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipients.map((recipient) => {
            const isSelected = selectedRecipientIds.includes(recipient.id);

            return (
              <div
                key={recipient.id}
                className={`bg-white rounded-[16px] border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#0f766e] ring-2 ring-teal-600/20 bg-teal-50/10'
                    : 'border-[#e2e8f0] hover:border-teal-500/70'
                }`}
              >
                {/* Header Split */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Custom styled 20x20 checkbox */}
                      <button
                        onClick={() => onToggleSelectRecipient(recipient.id)}
                        className={`mt-1 w-5 h-5 rounded-[6px] flex items-center justify-center transition-colors cursor-pointer shrink-0 border ${
                          isSelected
                            ? 'bg-[#0f766e] border-[#0f766e] text-white'
                            : 'border-slate-300 bg-white hover:border-teal-600'
                        }`}
                        title="Pilih untuk Penyaluran Batch"
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      {/* Avatar */}
                      <img
                        src={recipient.avatarUrl}
                        alt={recipient.nama}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                      />

                      {/* Name & Identity */}
                      <div className="min-w-0">
                        <h4 
                          onClick={() => onSelectRecipientForDetail(recipient)}
                          className="text-sm font-bold text-slate-900 truncate hover:text-[#0f766e] transition-colors cursor-pointer"
                        >
                          {recipient.nama} {recipient.gelar && <span className="text-xs font-normal text-slate-500">({recipient.gelar})</span>}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tracking-tight mt-0.5">
                          <span>NIK: {recipient.maskedNik}</span>
                          {recipient.dukcapilVerified && (
                            <span className="text-emerald-600" title="Terverifikasi Dukcapil Kota Malang">
                              <ShieldCheck className="w-3.5 h-3.5 inline" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge right */}
                    <div className="shrink-0">
                      {renderStatusBadge(recipient.status)}
                    </div>
                  </div>

                  {/* Institution and RW Tag */}
                  <div className="pt-1 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      {renderCategoryBadge(recipient.kategori)}
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {recipient.rw} / {recipient.rt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">
                        {recipient.namaLembaga}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Masa Mengajar: <strong>{recipient.masaKerjaTahun} Tahun</strong></span>
                      <span>Kehadiran: <strong>{recipient.attendance.sessionsHeld}/{recipient.attendance.targetSessions} Sesi</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Section separated by 1px subtle divider */}
                <div className="border-t border-[#e2e8f0] bg-slate-50/70 p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CreditCard className="w-3.5 h-3.5 text-[#0f766e]" />
                      <span className="font-semibold">{recipient.bankPenyalur}</span>
                    </div>
                    <p className="font-mono text-xs text-slate-500 tracking-tight">
                      {recipient.nomorRekening}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-sm font-bold text-slate-900 tabular-nums">
                      Rp {recipient.nominalPerBulan.toLocaleString('id-ID')}
                      <span className="text-[10px] font-normal text-slate-500"> /bln</span>
                    </div>
                    <button
                      onClick={() => onSelectRecipientForDetail(recipient)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f766e] hover:text-[#0d9488] transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Audit Berkas</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: DENSE ADMINISTRATIVE TABLE VIEW */
        <div className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4 w-10 text-center">
                    <button
                      onClick={handleSelectAllToggle}
                      className="cursor-pointer"
                      title="Pilih Semua"
                    >
                      {isAllFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0f766e]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Nama Pengajar Keagamaan</th>
                  <th className="py-3 px-4">NIK Dukcapil</th>
                  <th className="py-3 px-4">Lembaga / Tempat Ibadah</th>
                  <th className="py-3 px-4">Wilayah</th>
                  <th className="py-3 px-4">Rekening Penyalur</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRecipients.map((recipient) => {
                  const isSelected = selectedRecipientIds.includes(recipient.id);

                  return (
                    <tr
                      key={recipient.id}
                      className={`hover:bg-teal-50/20 transition-colors ${
                        isSelected ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onToggleSelectRecipient(recipient.id)}
                          className={`w-5 h-5 rounded-[6px] inline-flex items-center justify-center transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-[#0f766e] border-[#0f766e] text-white'
                              : 'border-slate-300 bg-white hover:border-teal-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={recipient.avatarUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p 
                              onClick={() => onSelectRecipientForDetail(recipient)}
                              className="font-bold text-slate-900 hover:text-[#0f766e] cursor-pointer"
                            >
                              {recipient.nama} {recipient.gelar && <span className="font-normal text-slate-500">({recipient.gelar})</span>}
                            </p>
                            <p className="text-[11px] text-slate-500">{recipient.telepon}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">
                        <span className="flex items-center gap-1">
                          {recipient.maskedNik}
                          {recipient.dukcapilVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{recipient.namaLembaga}</p>
                        <div className="mt-0.5">{renderCategoryBadge(recipient.kategori)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {recipient.rw} / {recipient.rt}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{recipient.bankPenyalur}</p>
                        <p className="font-mono text-slate-500 text-[11px]">{recipient.nomorRekening}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                        Rp {recipient.nominalPerBulan.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {renderStatusBadge(recipient.status)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onSelectRecipientForDetail(recipient)}
                          className="p-1.5 text-slate-500 hover:text-[#0f766e] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Detail & Dokumen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredRecipients.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">
            Tidak Ada Data Penerima yang Sesuai Filter
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Silakan ubah pilihan filter status, kategori keagamaan, atau wilayah RW di atas.
          </p>
          <button
            onClick={() => {
              onStatusFilterChange('ALL');
              onCategoryFilterChange('ALL');
              onRwFilterChange('ALL');
              setBankFilter('ALL');
            }}
            className="px-4 py-2 text-xs font-semibold text-[#0f766e] bg-teal-50 border border-teal-200 rounded-[10px] hover:bg-teal-100 transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
};
