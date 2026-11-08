import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck2, 
  EyeOff, 
  RefreshCw, 
  Sliders, 
  Activity, 
  Clock, 
  Fingerprint, 
  Database, 
  WifiOff, 
  ShieldAlert,
  Server,
  FileText,
  Search
} from 'lucide-react';
import { SecurityIncident, SecurityStatus, Recipient } from '../types';

interface SecurityDashboardProps {
  incidents: SecurityIncident[];
  recipients: Recipient[];
  securityStatus: SecurityStatus;
  onUpdateSecurityStatus: (newStatus: Partial<SecurityStatus>) => void;
  onRunIntegrityCheck: () => void;
  isScanning: boolean;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  incidents,
  recipients,
  securityStatus,
  onUpdateSecurityStatus,
  onRunIntegrityCheck,
  isScanning,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchIncident, setSearchIncident] = useState<string>('');

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (searchIncident.trim()) {
      const q = searchIncident.toLowerCase();
      return (
        inc.actor.toLowerCase().includes(q) ||
        inc.details.toLowerCase().includes(q) ||
        inc.ipAddress.toLowerCase().includes(q) ||
        inc.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Security Health Score Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-[#0f766e] to-teal-900 text-white rounded-2xl p-6 shadow-md border border-teal-700/60 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-teal-200 border border-white/20 shrink-0">
            <ShieldCheck className="w-8 h-8 text-emerald-300" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                STATUS PERLINDUNGAN MAKSIMAL
              </span>
              <span className="text-xs text-teal-200 font-mono">
                ISO/IEC 27001 & UU PDP
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Pusat Keamanan Siber & Proteksi Data Pribadi
            </h2>
            <p className="text-xs text-teal-100 max-w-xl leading-relaxed">
              Melindungi NIK 16 digit warga, data perbankan 5 peran penerima honorarium, dan SPJ dana hibah dari pencurian data, scraping ilegal, kebocoran data, dan serangan brute-force.
            </p>
          </div>
        </div>

        {/* Security Health Meter */}
        <div className="bg-black/25 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex items-center gap-5 shrink-0">
          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-300 tabular-nums">
              98<span className="text-lg font-bold text-teal-200">/100</span>
            </span>
            <span className="block text-[10px] font-bold text-teal-200 uppercase tracking-wider mt-0.5">
              Skor Keamanan
            </span>
          </div>

          <div className="border-l border-white/20 pl-4 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Enkripsi AES-256 Aktif</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Proteksi Anti Brute-Force</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>WAF Rate-Limiting Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Security Dimension Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dimension 1: Penyamaran Data (Data Masking) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dynamic Masking
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              100% NIK Tersamar
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Format <code>357304******0002</code> aktif secara default. Hanya admin terverifikasi yang dapat membuka akses.
            </p>
          </div>
        </div>

        {/* Dimension 2: Multi-Factor Authentication */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Otorisasi 2FA / OTP
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Fingerprint className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              2FA Wajib Pencairan
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Penyetujuan Berita Acara & Transfer Bank wajib kode verifikasi keamanan 6-digit.
            </p>
          </div>
        </div>

        {/* Dimension 3: Proteksi Serangan Brute-Force */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Anti-Brute Force
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#d97706] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              Throttling & Cooldown
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Batas 5x kesalahan kata sandi sebelum IP diblokir otomatis 60 detik.
            </p>
          </div>
        </div>

        {/* Dimension 4: Integritas Hash SHA-256 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Audit Kriptografi
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              SHA-256 Checksum
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Setiap catatan pengajar memiliki signature hash anti-pemalsuan data.
            </p>
          </div>
        </div>
      </div>

      {/* Control Panel: Security Policy Switches & Live Integrity Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Security Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0f766e]" />
            Konfigurasi Kebijakan Keamanan
          </h3>

          <div className="space-y-4 text-xs">
            {/* Auto Timeout Setting */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Auto-Lock Session Timeout</span>
                <span className="text-[#0f766e] font-bold">{securityStatus.autoTimeoutMinutes} Menit</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Sistem otomatis mengunci layar jika tidak ada aktivitas operator untuk mencegah akses tidak sah saat komputer ditinggalkan.
              </p>
              <div className="flex items-center gap-2 pt-1">
                {[5, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onUpdateSecurityStatus({ autoTimeoutMinutes: mins })}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border ${
                      securityStatus.autoTimeoutMinutes === mins
                        ? 'bg-[#0f766e] text-white border-[#0f766e]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {mins} Menit
                  </button>
                ))}
              </div>
            </div>

            {/* MFA Enforcement Switch */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block">Wajib 2FA / OTP untuk Pencairan</span>
                <span className="text-[11px] text-slate-500 block">
                  Mencegah pencairan dana sepihak tanpa otorisasi ganda.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={securityStatus.mfaEnforced}
                  onChange={(e) => onUpdateSecurityStatus({ mfaEnforced: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f766e]"></div>
              </label>
            </div>

            {/* UU PDP Compliance Stamp */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Kepatuhan UU PDP No. 27/2022</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Pengelolaan data kependudukan dan insentif di Kelurahan Bandulan memenuhi standar kewajiban pengendali data pribadi: minimalisasi pengungkapan, hak perbaikan data oleh subjek data (guru), dan pencatatan audit komprehensif.
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Cryptographic Tamper Scanner & Live Threat Monitoring */}
        <div className="lg:col-span-2 space-y-6">
          {/* Integrity Scanner Tool */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-[#0f766e]" />
                  Pemindaian Integritas Kriptografis (Anti-Cracking)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Memeriksa apakah ada catatan database yang diubah tanpa otorisasi resmi kelurahan.
                </p>
              </div>

              <button
                disabled={isScanning}
                onClick={onRunIntegrityCheck}
                className="px-4 py-2 bg-[#0f766e] hover:bg-[#0d9488] disabled:bg-slate-300 text-white text-xs font-bold rounded-[10px] shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Memverifikasi Hash...' : 'Uji Integritas Data Sekarang'}</span>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>142 Catatan Guru Terverifikasi Utuh (0 Anomali)</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Algoritma: SHA-256 HMAC dengan Salt Kelurahan Bandulan Kota Malang
                </p>
              </div>

              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shrink-0">
                Status: Integrity Verified
              </span>
            </div>
          </div>

          {/* Incident Log & Intrusion Attempts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#0f766e]" />
                  Log Percobaan Akses & Pencegahan Ancaman (WAF)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar insiden keamanan yang dicegat secara otomatis oleh firewall aplikasi.
                </p>
              </div>

              {/* Severity filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                aria-label="Filter Tingkat Ancaman"
                className="h-8 px-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#0f766e]"
              >
                <option value="ALL">Semua Tingkat Bahaya</option>
                <option value="CRITICAL">Kritis (Critical)</option>
                <option value="HIGH">Tinggi (High)</option>
                <option value="MEDIUM">Sedang (Medium)</option>
                <option value="LOW">Rendah / Normal (Low)</option>
              </select>
            </div>

            {/* Incidents Table */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              {filteredIncidents.map((incident) => (
                <div key={incident.id} className="p-3.5 hover:bg-slate-50 transition-colors text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        incident.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : incident.severity === 'HIGH'
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : incident.severity === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {incident.severity}
                      </span>
                      <span className="font-bold text-slate-900">{incident.actor}</span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {incident.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {incident.details}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                    <span>IP / Sumber: {incident.ipAddress}</span>
                    <span className="text-emerald-700 font-bold">
                      Tindakan: {incident.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
