import React, { useState } from 'react';
import { 
  History, 
  ShieldCheck, 
  Search, 
  Download, 
  Printer, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Hash,
  Clock
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditTrailViewProps {
  logs: AuditLog[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    const q = filterQuery.toLowerCase();
    return (
      log.actorName.toLowerCase().includes(q) ||
      log.recipientName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.hash.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0f766e] flex items-center justify-center border border-teal-200 shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              Buku Log Audit Digital (Integritas & Anti-Pungli)
            </h3>
            <p className="text-xs text-slate-500">
              Setiap verifikasi, persetujuan, dan mutasi penyaluran dana insentif dicatat dengan timestamp dan hash kriptografis SHA-256.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari log atau nama..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-[10px] text-slate-800 focus:outline-none focus:border-[#0f766e]"
            />
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold text-[#0f766e] bg-teal-50 border border-teal-200 rounded-[10px] hover:bg-teal-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Log</span>
          </button>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-[16px] border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">Waktu (WIB)</th>
                <th className="py-3 px-4">Pejabat / Verifikator</th>
                <th className="py-3 px-4">Aktivitas Otorisasi</th>
                <th className="py-3 px-4">Pengajar Penerima</th>
                <th className="py-3 px-4">Status Mutasi</th>
                <th className="py-3 px-4">Cryptographic Hash Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.timestamp}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{log.actorName}</p>
                    <p className="text-[11px] text-slate-500">{log.actorRole}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{log.action}</span>
                    {log.notes && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{log.notes}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{log.recipientName}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{log.recipientId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-[#0f766e] border border-teal-200">
                      {log.newStatus || 'SELESAI'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">
                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-600 block truncate max-w-xs" title={log.hash}>
                      {log.hash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
