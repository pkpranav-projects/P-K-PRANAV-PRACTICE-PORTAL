import React from 'react';
import {
  Compass,
  BookOpen,
  Database,
  Sparkles,
  Menu
} from 'lucide-react';
import { LeetCodeTab } from './LeetCodeNavbar';

interface MobileBottomNavProps {
  activeTab: LeetCodeTab;
  setActiveTab: (tab: LeetCodeTab) => void;
  onOpenDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenDrawer
}) => {
  // Hide bottom nav while solving problems in the coding workspace to maximize editor space
  if (activeTab === 'workspace') return null;

  const navItems = [
    {
      id: 'explore' as LeetCodeTab,
      label: 'Explore',
      icon: Compass
    },
    {
      id: 'problems' as LeetCodeTab,
      label: 'Problems',
      icon: BookOpen
    },
    {
      id: 'dbms' as LeetCodeTab,
      label: 'DBMS',
      icon: Database
    },
    {
      id: 'masterclass' as LeetCodeTab,
      label: 'Discuss',
      icon: Sparkles
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1a1a1a]/95 border-t border-slate-200 dark:border-[#2e2e2e] shadow-lg flex items-center justify-around h-14 px-2 safe-bottom [isolation:isolate]"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer ${
              isActive
                ? 'text-[#FFA116] font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}

      {/* More / Menu Button to open Drawer */}
      <button
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
        title="More tabs & tools"
      >
        <Menu className="w-4 h-4 mb-0.5 stroke-2" />
        <span className="text-[10px] tracking-tight">More</span>
      </button>
    </nav>
  );
};
