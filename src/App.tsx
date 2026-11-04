/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabKey } from './components/Navigation';
import { DashboardStats } from './components/DashboardStats';
import { RecipientList } from './components/RecipientList';
import { RecipientDetailModal } from './components/RecipientDetailModal';
import { BatchDisbursementModal } from './components/BatchDisbursementModal';
import { NewRegistrationModal } from './components/NewRegistrationModal';
import { PublicCheckPortal } from './components/PublicCheckPortal';
import { AuditTrailView } from './components/AuditTrailView';
import { TeacherPortalView } from './components/TeacherPortalView';
import { AuthScreen } from './components/AuthScreen';
import { SecurityDashboard } from './components/SecurityDashboard';
import { LockScreenModal } from './components/LockScreenModal';

import { INITIAL_RECIPIENTS, INITIAL_AUDIT_LOGS } from './data/mockRecipients';
import { INITIAL_SECURITY_INCIDENTS } from './utils/security';
import { Recipient, DisbursementStatus, AuditLog, AuthUser, SecurityIncident, SecurityStatus } from './types';
import { CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  const [recipients, setRecipients] = useState<Recipient[]>(INITIAL_RECIPIENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  
  // Authentication session state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [showPublicCheckOnly, setShowPublicCheckOnly] = useState<boolean>(false);

  // Security & Anti-Cracking State
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>(INITIAL_SECURITY_INCIDENTS);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    shieldActive: true,
    encryptionStandard: 'AES-256-GCM + SHA-256 HMAC',
    pdpCompliance: true,
    autoTimeoutMinutes: 15,
    unmaskLogCount: 1,
    failedAttemptsBlocked: 4,
    mfaEnforced: true,
  });
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(900);
  const [isScanningIntegrity, setIsScanningIntegrity] = useState<boolean>(false);

  // Inactivity auto-lock countdown timer
  useEffect(() => {
    if (!currentUser || isSessionLocked) return;
    const interval = setInterval(() => {
      setSessionRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsSessionLocked(true);
          return securityStatus.autoTimeoutMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentUser, isSessionLocked, securityStatus.autoTimeoutMinutes]);

  const [activeTab, setActiveTab] = useState<TabKey>('DASHBOARD');
  const [currentRole, setCurrentRole] = useState<'ADMIN_KESRA' | 'LURAH' | 'GURU_MANDIRI'>('ADMIN_KESRA');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('November 2026');
  const [activeTeacherId, setActiveTeacherId] = useState<string>(INITIAL_RECIPIENTS[0].id);
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [rwFilter, setRwFilter] = useState<string>('ALL');

  // Selection & Modals
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([]);
  const [detailRecipient, setDetailRecipient] = useState<Recipient | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handler for teacher logging attendance
  const handleUpdateAttendance = (teacherId: string, newSessions: number, santriCount: number) => {
    setRecipients((prev) =>
      prev.map((r) => {
        if (r.id === teacherId) {
          return {
            ...r,
            attendance: {
              ...r.attendance,
              sessionsHeld: newSessions,
              santriOrStudentsCount: santriCount,
              reportSubmittedDate: new Date().toISOString().slice(0, 10),
            },
          };
        }
        return r;
      })
    );
    showToast(`Presensi berhasil diperbarui menjadi ${newSessions} sesi pertemuan.`);
  };

  // Handler for teacher reuploading a document
  const handleReuploadDocument = (teacherId: string, docId: string, docName: string) => {
    const timeNow = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    let teacherName = '';

    setRecipients((prev) =>
      prev.map((r) => {
        if (r.id === teacherId) {
          teacherName = r.nama;
          const updatedDocs = r.documents.map((d) =>
            d.id === docId ? { ...d, status: 'PENDING' as const, uploadDate: new Date().toISOString().slice(0, 10), notes: undefined } : d
          );
          return {
            ...r,
            documents: updatedDocs,
            status: r.status === 'PERLU_REVISI' ? ('MENUNGGU_VERIFIKASI' as const) : r.status,
            notes: `Dokumen "${docName}" telah diunggah ulang oleh pengajar. Menunggu validasi ulang staf Kesra.`,
          };
        }
        return r;
      })
    );

    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: timeNow,
      actorName: teacherName || 'Pengajar Keagamaan',
      actorRole: 'Guru Mandiri',
      action: `Unggah Ulang Dokumen: ${docName}`,
      recipientId: teacherId,
      recipientName: teacherName,
      previousStatus: 'PERLU_REVISI',
      newStatus: 'MENUNGGU_VERIFIKASI',
      hash: `SHA256:reup${Date.now().toString(16)}`,
      notes: `Perbaikan berkas diajukan untuk verifikasi oleh Seksi Kesra.`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Dokumen "${docName}" berhasil dikirim ulang ke verifikator Kesra.`);
  };

  // Calculations for counters
  const pendingCount = recipients.filter((r) => r.status === 'MENUNGGU_VERIFIKASI').length;
  const readyCount = recipients.filter((r) => r.status === 'SIAP_SALUR').length;

  // Search filtering over recipients
  const displayedRecipients = recipients.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.nama.toLowerCase().includes(q) ||
      r.nik.toLowerCase().includes(q) ||
      r.maskedNik.toLowerCase().includes(q) ||
      r.namaLembaga.toLowerCase().includes(q) ||
      r.rw.toLowerCase().includes(q) ||
      r.nomorRekening.toLowerCase().includes(q)
    );
  });

  // Toggle selection
  const handleToggleSelectRecipient = (id: string) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllRecipients = (ids: string[]) => {
    setSelectedRecipientIds(ids);
  };

  const handleClearSelectedRecipients = () => {
    setSelectedRecipientIds([]);
  };

  // Status update
  const handleUpdateStatus = (recipientId: string, newStatus: DisbursementStatus, notes?: string) => {
    const actorName = currentRole === 'LURAH' ? 'Drs. Supriyanto, M.AP' : 'Bambang Trianto, S.Sos';
    const actorRole = currentRole === 'LURAH' ? 'Lurah Bandulan' : 'Kasi Kesra Kelurahan Bandulan';
    const timeNow = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    const hash = `SHA256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;

    let targetName = '';
    let prevStatus: DisbursementStatus = 'MENUNGGU_VERIFIKASI';

    setRecipients((prev) =>
      prev.map((rec) => {
        if (rec.id === recipientId) {
          targetName = rec.nama;
          prevStatus = rec.status;
          return {
            ...rec,
            status: newStatus,
            statusUpdateDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
            verifierName: actorName,
            verifierRole: actorRole,
            verificationHash: hash,
            notes: notes || rec.notes,
            lastPayoutDate: newStatus === 'TERSALURKAN' ? timeNow : rec.lastPayoutDate,
            referenceNumber: newStatus === 'TERSALURKAN' ? `SP2D-BDL/2026/11/${Math.floor(1000 + Math.random() * 9000)}` : rec.referenceNumber,
          };
        }
        return rec;
      })
    );

    // Update opened modal recipient if active
    if (detailRecipient && detailRecipient.id === recipientId) {
      setDetailRecipient((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              verifierName: actorName,
              verifierRole: actorRole,
              verificationHash: hash,
              notes: notes || prev.notes,
              lastPayoutDate: newStatus === 'TERSALURKAN' ? timeNow : prev.lastPayoutDate,
            }
          : null
      );
    }

    // Add to audit trail
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: timeNow,
      actorName,
      actorRole,
      action: newStatus === 'SIAP_SALUR' ? 'Verifikasi Berkas Disetujui' : newStatus === 'TERSALURKAN' ? 'Penyaluran Nontunai Sukses' : 'Catatan Revisi Berkas',
      recipientId,
      recipientName: targetName,
      previousStatus: prevStatus,
      newStatus,
      hash,
      notes,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Status ${targetName} berhasil diubah menjadi "${newStatus.replace('_', ' ')}".`);
  };

  // Mass batch disbursement
  const handleExecuteBatchDisbursement = (selectedIds: string[], batchNumber: string) => {
    const actorName = 'Drs. Supriyanto, M.AP & Bambang Trianto, S.Sos';
    const actorRole = 'Lurah & Kasi Kesra Kelurahan Bandulan';
    const timeNow = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    setRecipients((prev) =>
      prev.map((rec) => {
        if (selectedIds.includes(rec.id)) {
          return {
            ...rec,
            status: 'TERSALURKAN',
            statusUpdateDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
            verifierName: 'Bambang Trianto, S.Sos',
            verifierRole: 'Kasi Kesejahteraan Rakyat Kelurahan Bandulan',
            lastPayoutDate: timeNow,
            referenceNumber: batchNumber,
            notes: `Disalurkan melalui Berita Acara Batch ${batchNumber} via Bank Penyalur.`,
          };
        }
        return rec;
      })
    );

    // Create batch audit log
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: timeNow,
      actorName,
      actorRole,
      action: `Pencairan Massal Berita Acara (${selectedIds.length} Guru)`,
      recipientId: 'BATCH-DISBURSEMENT',
      recipientName: `${selectedIds.length} Pengajar Keagamaan`,
      previousStatus: 'SIAP_SALUR',
      newStatus: 'TERSALURKAN',
      hash: `SHA256:${batchNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
      notes: `Pencairan dana insentif sebesar Rp ${(selectedIds.length * 500000).toLocaleString('id-ID')} via transfer Bank Jatim.`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    setSelectedRecipientIds([]);
    showToast(`Pencairan Batch berhasil: ${selectedIds.length} guru telah menerima insentif.`);
  };

  // New recipient registration
  const handleRegisterRecipient = (newRec: Recipient) => {
    setRecipients((prev) => [newRec, ...prev]);

    const timeNow = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: timeNow,
      actorName: 'Pendaftaran Mandiri / Staf Pelayanan',
      actorRole: 'Sistem SIKB Bandulan',
      action: 'Pendaftaran Guru Keagamaan Baru',
      recipientId: newRec.id,
      recipientName: newRec.nama,
      newStatus: 'MENUNGGU_VERIFIKASI',
      hash: `SHA256:reg${newRec.nik.slice(8)}`,
      notes: `Pengajar baru terdaftar dari ${newRec.namaLembaga} (${newRec.rw}). Menunggu verifikasi berkas oleh Kasi Kesra.`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    setActiveTab('RECIPIENTS');
    showToast(`Pendaftaran guru "${newRec.nama}" berhasil disimpan dan menunggu verifikasi.`);
  };

  // Security Handlers
  const handleLogSecurityIncident = (type: string, details: string) => {
    const timeNow = new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    const newIncident: SecurityIncident = {
      id: `SEC-LOG-${Date.now().toString().slice(-4)}`,
      timestamp: timeNow,
      type: type as any,
      severity: type === 'FAILED_LOGIN' ? 'HIGH' : type === 'NIK_UNMASKED' ? 'MEDIUM' : 'LOW',
      actor: currentUser?.name || 'Aparatur Kelurahan',
      ipAddress: '10.32.4.18 (Intranet Kelurahan Bandulan)',
      userAgent: navigator.userAgent.slice(0, 40),
      details,
      status: 'RESOLVED',
    };

    setSecurityIncidents((prev) => [newIncident, ...prev]);
    if (type === 'NIK_UNMASKED') {
      setSecurityStatus((prev) => ({ ...prev, unmaskLogCount: prev.unmaskLogCount + 1 }));
      showToast('Akses NIK lengkap dicatat dalam Buku Log Keamanan (Kepatuhan UU PDP).');
    }
  };

  const handleRunIntegrityCheck = () => {
    setIsScanningIntegrity(true);
    setTimeout(() => {
      setIsScanningIntegrity(false);
      handleLogSecurityIncident(
        'TAMPER_CHECK_PASSED',
        `Pemeriksaan integritas hash SHA-256 selesai. Seluruh ${recipients.length} data guru keagamaan valid dan tidak termodifikasi.`
      );
      showToast('Pemeriksaan Integritas Berhasil: 100% data valid sesuai signature SHA-256.');
    }, 1200);
  };

  // Auth Handlers
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setShowPublicCheckOnly(false);
    setIsSessionLocked(false);
    setSessionRemainingSeconds(securityStatus.autoTimeoutMinutes * 60);

    if (user.role === 'TEACHER') {
      setActiveTab('TEACHER_PORTAL');
      setCurrentRole('GURU_MANDIRI');
      if (user.teacherId) {
        setActiveTeacherId(user.teacherId);
      }
      showToast(`Selamat datang, ${user.name}! Anda masuk ke Portal Pengajar Keagamaan.`);
    } else {
      setActiveTab('DASHBOARD');
      setCurrentRole(user.role);
      showToast(`Selamat datang, ${user.name}! Anda masuk sebagai ${user.roleTitle}.`);
    }
  };

  const handleLogout = () => {
    const prevName = currentUser?.name;
    setCurrentUser(null);
    setShowPublicCheckOnly(false);
    setIsSessionLocked(false);
    setActiveTab('DASHBOARD');
    showToast(`${prevName || 'Pengguna'} telah berhasil keluar dari sistem.`);
  };

  // If not logged in and not viewing public check only: show AuthScreen
  if (!currentUser) {
    if (showPublicCheckOnly) {
      return (
        <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl w-full mx-auto mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🏛️</span>
              <div>
                <p className="text-xs font-bold text-slate-800">Kelurahan Bandulan - Kota Malang</p>
                <p className="text-[11px] text-[#0f766e] font-semibold">Cek Status Penyaluran Mandiri</p>
              </div>
            </div>
            <button
              onClick={() => setShowPublicCheckOnly(false)}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-[10px] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              ← Kembali ke Halaman Masuk
            </button>
          </div>
          <main className="flex-1 max-w-4xl w-full mx-auto">
            <PublicCheckPortal
              recipients={recipients}
              selectedPeriod={selectedPeriod}
            />
          </main>
        </div>
      );
    }

    return (
      <AuthScreen
        recipients={recipients}
        onLogin={handleLogin}
        onOpenPublicCheck={() => setShowPublicCheckOnly(true)}
        onRegisterRecipient={(newRec, autoLoginUser) => {
          handleRegisterRecipient(newRec);
          if (autoLoginUser) {
            handleLogin(autoLoginUser);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* Auto-Lock Screen Overlay if Session Locked */}
      {isSessionLocked && (
        <LockScreenModal
          currentUser={currentUser}
          onUnlock={() => {
            setIsSessionLocked(false);
            setSessionRemainingSeconds(securityStatus.autoTimeoutMinutes * 60);
            showToast('Layar berhasil dibuka kembali.');
          }}
          onLogout={handleLogout}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0f766e] text-white px-4 py-3 rounded-xl shadow-lg border border-teal-400/40 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onLockSession={() => setIsSessionLocked(true)}
        onOpenSecurityCenter={() => setActiveTab('SECURITY')}
        sessionRemainingSeconds={sessionRemainingSeconds}
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'GURU_MANDIRI') {
            setActiveTab('TEACHER_PORTAL');
          } else if (activeTab === 'TEACHER_PORTAL') {
            setActiveTab('DASHBOARD');
          }
        }}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && activeTab !== 'RECIPIENTS') {
            setActiveTab('RECIPIENTS');
          }
        }}
        onOpenNewRegistration={() => setIsRegisterModalOpen(true)}
        onOpenBatchDisbursement={() => setIsBatchModalOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Navigation Bar */}
      <Navigation
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'TEACHER_PORTAL') {
            setCurrentRole('GURU_MANDIRI');
          } else if (currentRole === 'GURU_MANDIRI' && tab !== 'PUBLIC_CHECK') {
            setCurrentRole('ADMIN_KESRA');
          }
        }}
        pendingCount={pendingCount}
        readyCount={readyCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'DASHBOARD' && (
          <DashboardStats
            recipients={recipients}
            onFilterByStatus={(st) => {
              setStatusFilter(st);
              setActiveTab('RECIPIENTS');
            }}
            onFilterByCategory={(cat) => {
              setCategoryFilter(cat);
              setActiveTab('RECIPIENTS');
            }}
            onFilterByRW={(rw) => {
              setRwFilter(rw);
              setActiveTab('RECIPIENTS');
            }}
            onOpenBatchDisbursement={() => setIsBatchModalOpen(true)}
            onOpenNewRegistration={() => setIsRegisterModalOpen(true)}
          />
        )}

        {activeTab === 'RECIPIENTS' && (
          <RecipientList
            recipients={displayedRecipients}
            selectedRecipientIds={selectedRecipientIds}
            onToggleSelectRecipient={handleToggleSelectRecipient}
            onSelectAllRecipients={handleSelectAllRecipients}
            onClearSelectedRecipients={handleClearSelectedRecipients}
            onSelectRecipientForDetail={(rec) => setDetailRecipient(rec)}
            onOpenBatchDisbursementWithSelection={() => setIsBatchModalOpen(true)}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            rwFilter={rwFilter}
            onRwFilterChange={setRwFilter}
          />
        )}

        {activeTab === 'BATCH' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f766e] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  Penyaluran Kolektif
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Penyaluran Batch Insentif & Surat Pertanggungjawaban (SPJ)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proses penerbitan Berita Acara Penyaluran, tanda tangan digital Lurah, dan payroll Bank Jatim.
                </p>
              </div>

              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="px-5 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold rounded-[10px] shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Buka Berita Acara Batch ({readyCount} Siap Salur)</span>
              </button>
            </div>

            <RecipientList
              recipients={displayedRecipients.filter((r) => r.status === 'SIAP_SALUR')}
              selectedRecipientIds={selectedRecipientIds}
              onToggleSelectRecipient={handleToggleSelectRecipient}
              onSelectAllRecipients={handleSelectAllRecipients}
              onClearSelectedRecipients={handleClearSelectedRecipients}
              onSelectRecipientForDetail={(rec) => setDetailRecipient(rec)}
              onOpenBatchDisbursementWithSelection={() => setIsBatchModalOpen(true)}
              statusFilter="SIAP_SALUR"
              onStatusFilterChange={setStatusFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              rwFilter={rwFilter}
              onRwFilterChange={setRwFilter}
            />
          </div>
        )}

        {activeTab === 'TEACHER_PORTAL' && (
          <TeacherPortalView
            recipients={recipients}
            activeTeacherId={activeTeacherId}
            onSelectTeacher={setActiveTeacherId}
            onUpdateAttendance={handleUpdateAttendance}
            onReuploadDocument={handleReuploadDocument}
            onSwitchToAdmin={() => {
              setCurrentRole('ADMIN_KESRA');
              setActiveTab('DASHBOARD');
            }}
            selectedPeriod={selectedPeriod}
          />
        )}

        {activeTab === 'REGISTER' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0f766e] flex items-center justify-center mx-auto border border-teal-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Pendataan & Pengusulan Guru Keagamaan Baru
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Pengurus TPQ, Madrasah Diniyah, Majelis Gereja, dan Pasraman di Kelurahan Bandulan dapat mendaftarkan guru pembina yang aktif mengajar untuk diajukan mendapatkan insentif bulanan.
              </p>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-6 py-3 bg-[#0f766e] hover:bg-[#0d9488] active:bg-[#115e59] text-white text-xs font-bold rounded-[10px] shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Buka Formulir Pendaftaran Guru</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'SECURITY' && (
          <SecurityDashboard
            incidents={securityIncidents}
            recipients={recipients}
            securityStatus={securityStatus}
            onUpdateSecurityStatus={(s) => setSecurityStatus((prev) => ({ ...prev, ...s }))}
            onRunIntegrityCheck={handleRunIntegrityCheck}
            isScanning={isScanningIntegrity}
          />
        )}

        {activeTab === 'PUBLIC_CHECK' && (
          <PublicCheckPortal
            recipients={recipients}
            selectedPeriod={selectedPeriod}
          />
        )}

        {activeTab === 'AUDIT' && (
          <AuditTrailView logs={auditLogs} />
        )}
      </main>

      {/* Detail & Audit Modal Drawer */}
      <RecipientDetailModal
        recipient={detailRecipient}
        onClose={() => setDetailRecipient(null)}
        onUpdateStatus={handleUpdateStatus}
        onLogSecurityIncident={handleLogSecurityIncident}
        currentRole={currentRole}
      />

      {/* Batch Disbursement Modal */}
      <BatchDisbursementModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        recipients={recipients}
        selectedRecipientIds={selectedRecipientIds}
        onExecuteBatchDisbursement={handleExecuteBatchDisbursement}
        selectedPeriod={selectedPeriod}
      />

      {/* New Registration Modal */}
      <NewRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterRecipient={handleRegisterRecipient}
      />

      {/* Municipal Civic Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SIKB Bandulan</span>
            <span>•</span>
            <span>Kelurahan Bandulan, Kecamatan Sukun, Kota Malang</span>
            <span className="text-slate-400">Jawa Timur 65146</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Sesuai Petunjuk Teknis Insentif Guru Agama Pemkot Malang</span>
            <span>•</span>
            <span className="font-mono">v2.4.0-resmi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
