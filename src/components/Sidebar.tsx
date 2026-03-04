import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Layers,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const menuItems = [
  { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'calendar', label: 'Agenda', icon: Calendar },
  { id: 'sectors', label: 'Setores', icon: Layers },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div 
      className={cn(
        "h-screen bg-white text-zinc-600 flex flex-col transition-all duration-300 border-r border-zinc-200",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <BarChart3 className="text-white" size={18} />
          </div>
          {!isCollapsed && (
            <span className="text-zinc-900 font-bold text-sm tracking-tight">CRM Omnicanal</span>
          )}
        </div>
        {!isCollapsed && <span className="text-[10px] text-zinc-400 font-medium ml-10">Profissional</span>}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            whileHover={{ x: 4 }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-blue-50 text-blue-600" 
                : "hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <item.icon size={18} className={cn(
              "shrink-0",
              activeTab === item.id ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-600"
            )} />
            {!isCollapsed && <span className="font-medium text-xs">{item.label}</span>}
          </motion.button>
        ))}
        
        <motion.button
          onClick={() => setActiveTab('new-appointment')}
          whileHover={{ x: 4 }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
            activeTab === 'new-appointment' 
              ? "bg-blue-50 text-blue-600" 
              : "hover:bg-zinc-50 hover:text-zinc-900"
          )}
        >
          <PlusCircle size={18} className={cn(
            "shrink-0",
            activeTab === 'new-appointment' ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-600"
          )} />
          {!isCollapsed && <span className="font-medium text-xs">Novo Agendamento</span>}
        </motion.button>
      </nav>

      <div className="p-4 border-t border-zinc-100">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-xs shrink-0">
            LS
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-900 truncate">Lary Soares</p>
              <p className="text-[10px] text-zinc-500 truncate">lary@example.com</p>
            </div>
          )}
          {!isCollapsed && <LogOut size={14} className="text-zinc-400 hover:text-zinc-600" />}
        </div>
      </div>
    </div>
  );
}
