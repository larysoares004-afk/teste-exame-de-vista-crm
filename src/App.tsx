import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { CustomerList } from './components/CustomerList';
import { ServiceList } from './components/ServiceList';
import { CommandPalette } from './components/CommandPalette';
import { MOCK_CUSTOMERS, MOCK_SERVICES, MOCK_APPOINTMENTS } from './mockData';
import { DashboardStats, SourceData, LeadSource } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, User } from 'lucide-react';
import { format, subDays, isSameDay, startOfDay, eachDayOfInterval } from 'date-fns';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [customers] = React.useState(MOCK_CUSTOMERS);
  const [services] = React.useState(MOCK_SERVICES);
  const [appointments] = React.useState(MOCK_APPOINTMENTS);
  
  const [filters, setFilters] = React.useState({
    origin: 'Todos',
    period: 'Hoje'
  });

  const handleFilterChange = (type: 'origin' | 'period', value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesOrigin = filters.origin === 'Todos' || customer.source === filters.origin;
    
    // Simple period filtering logic
    let matchesPeriod = true;
    const customerDate = new Date(customer.createdAt);
    const now = new Date();
    
    if (filters.period === 'Hoje') {
      matchesPeriod = customerDate.toDateString() === now.toDateString();
    } else if (filters.period === 'Últimos 7 dias') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      matchesPeriod = customerDate >= sevenDaysAgo;
    } else if (filters.period === 'Últimos 30 dias') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      matchesPeriod = customerDate >= thirtyDaysAgo;
    }

    return matchesOrigin && matchesPeriod;
  });

  const stats: DashboardStats = {
    totalLeads: filteredCustomers.length,
    newLeads: filteredCustomers.filter(c => c.status === 'Novo').length,
    inProgress: filteredCustomers.filter(c => c.status === 'Em Atendimento').length,
    scheduled: filteredCustomers.filter(c => c.status === 'Agendado').length,
    confirmed: filteredCustomers.filter(c => c.status === 'Confirmado').length,
    qualified: filteredCustomers.filter(c => c.status === 'Qualificado').length,
    converted: filteredCustomers.filter(c => c.status === 'Convertido').length,
    lost: filteredCustomers.filter(c => c.status === 'Perdido').length,
    conversionRate: filteredCustomers.length > 0 
      ? Math.round((filteredCustomers.filter(c => c.status === 'Convertido').length / filteredCustomers.length) * 100)
      : 0,
  };

  // Calculate dynamic chart data (last 7 days by default, or 30 if selected)
  const chartDays = (filters.period === 'Últimos 30 dias' || filters.period === 'Máximo') ? 30 : 7;
  const now = new Date();
  const chartInterval = eachDayOfInterval({
    start: startOfDay(subDays(now, chartDays - 1)),
    end: startOfDay(now)
  });

  const chartData = chartInterval.map(day => {
    const count = filteredCustomers.filter(c => isSameDay(new Date(c.createdAt), day)).length;
    return {
      date: format(day, 'dd/MM'),
      leads: count
    };
  });

  // Calculate source distribution for filtered data
  const sourceMap = filteredCustomers.reduce((acc, customer) => {
    acc[customer.source] = (acc[customer.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceData: SourceData[] = Object.entries(sourceMap).map(([name, value]) => ({
    name: name as LeadSource,
    value: value as number
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            chartData={chartData} 
            sourceData={sourceData} 
            customers={filteredCustomers}
            onNavigate={setActiveTab}
            onFilterChange={handleFilterChange}
          />
        );
      case 'calendar':
        return <CalendarView appointments={appointments} services={services} customers={customers} />;
      case 'leads':
      case 'customers':
        return <CustomerList customers={filteredCustomers} />;
      case 'services':
        return <ServiceList services={services} />;
      case 'settings':
      case 'sectors':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-4">
              <span className="text-2xl font-bold">⚙️</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">Configurações</h2>
            <p className="text-zinc-500 mt-2">Esta seção está em desenvolvimento.</p>
          </div>
        );
      default:
        return (
          <Dashboard 
            stats={stats} 
            chartData={chartData} 
            sourceData={sourceData} 
            customers={filteredCustomers}
            onNavigate={setActiveTab}
            onFilterChange={handleFilterChange}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-8 shrink-0">
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-3 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="text-zinc-400 group-hover:text-zinc-600" size={14} />
              <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-700">Pesquisar no sistema...</span>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-white text-[10px] text-zinc-400 font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-white text-[10px] text-zinc-400 font-mono">K</kbd>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-all relative"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </motion.button>
            <div className="h-8 w-px bg-zinc-200 mx-1" />
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-zinc-900">Lary Soares</p>
                <p className="text-[10px] text-zinc-500">Administrador</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <User size={16} />
              </div>
            </motion.div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        customers={customers}
        services={services}
        onNavigate={setActiveTab}
      />
    </div>
  );
}
