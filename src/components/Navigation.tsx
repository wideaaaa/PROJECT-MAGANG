import { 
  LayoutDashboard, 
  Users, 
  FileCheck2, 
  UserPlus, 
  SearchCode, 
  History,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

import { AuthUser } from '../types';

export type TabKey = 'DASHBOARD' | 'RECIPIENTS' | 'BATCH' | 'TEACHER_PORTAL' | 'REGISTER' | 'PUBLIC_CHECK' | 'SECURITY' | 'AUDIT';

interface NavigationProps {
  currentUser: AuthUser | null;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pendingCount: number;
  readyCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  pendingCount,
  readyCount,
}) => {
  const allTabs = [
    {
      key: 'DASHBOARD' as TabKey,
      label: 'Ringkasan Eksekutif',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: true,
    },
    {
      key: 'RECIPIENTS' as TabKey,
      label: 'Data & Verifikasi Penerima',
      icon: Users,
      badge: pendingCount > 0 ? `${pendingCount} Verifikasi` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      adminOnly: true,
    },
    {
      key: 'TEACHER_PORTAL' as TabKey,
      label: currentUser?.role === 'TEACHER' ? 'Dashboard Pengajar & Insentif' : 'Pratinjau Portal Guru',
      icon: Users,
      badge: currentUser?.role === 'TEACHER' ? 'Akun Saya' : 'Pratinjau',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      adminOnly: false,
    },
    {
      key: 'BATCH' as TabKey,
      label: 'Penyaluran Batch & SPJ',
      icon: FileCheck2,
      badge: readyCount > 0 ? `${readyCount} Siap Salur` : null,
      badgeColor: 'bg-teal-100 text-[#0f766e] border-teal-300',
      adminOnly: true,
    },
    {
      key: 'REGISTER' as TabKey,
      label: 'Pendaftaran Guru Baru',
      icon: UserPlus,
      badge: null,
      adminOnly: true,
    },
    {
      key: 'SECURITY' as TabKey,
      label: 'Pusat Keamanan & UU PDP',
      icon: ShieldCheck,
      badge: '98 Skor',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      adminOnly: true,
    },
    {
      key: 'PUBLIC_CHECK' as TabKey,
      label: 'Cek Status Mandiri (Publik)',
      icon: SearchCode,
      badge: null,
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      adminOnly: false,
    },
    {
      key: 'AUDIT' as TabKey,
      label: 'Audit Trail & Rekam Jejak',
      icon: History,
      badge: null,
      adminOnly: true,
    },
  ];

  // If teacher, only show teacher relevant tabs
  const tabs = currentUser?.role === 'TEACHER'
    ? allTabs.filter((t) => !t.adminOnly)
    : allTabs;

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto no-scrollbar py-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`group inline-flex items-center gap-2 py-3.5 px-3 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#0f766e] text-[#0f766e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#0f766e]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tab.badgeColor}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
