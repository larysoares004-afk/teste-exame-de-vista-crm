import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, Calendar, Settings, LayoutDashboard, Plus, X, ArrowRight, ClipboardList, Briefcase } from 'lucide-react';
import { Customer, Service } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  services: Service[];
  onNavigate: (tab: string) => void;
}

interface SearchResult {
  id: string;
  name: string;
  type: string;
  icon: any;
  category: string;
  sub?: string;
}

export function CommandPalette({ isOpen, onClose, customers, services, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, category: 'Navegação' },
    { id: 'calendar', name: 'Calendário de Agendamentos', icon: Calendar, category: 'Navegação' },
    { id: 'leads', name: 'Lista de Leads', icon: User, category: 'Navegação' },
    { id: 'services', name: 'Serviços e Exames', icon: Briefcase, category: 'Navegação' },
    { id: 'settings', name: 'Configurações do Sistema', icon: Settings, category: 'Navegação' },
  ];

  const actions = [
    { id: 'new-lead', name: 'Adicionar Novo Lead', icon: Plus, category: 'Ações Rápidas' },
    { id: 'export', name: 'Exportar Relatório Mensal', icon: ClipboardList, category: 'Ações Rápidas' },
  ];

  const filteredNav = navigation.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actions.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCustomers = query.length > 1 ? customers.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.email.toLowerCase().includes(query.toLowerCase()) ||
    c.phone.includes(query)
  ).slice(0, 5) : [];

  const filteredServices = query.length > 1 ? services.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3) : [];

  const suggestions: SearchResult[] = navigation.slice(0, 3).map(i => ({ ...i, type: 'nav', category: 'Sugestões' }));

  const allResults: SearchResult[] = query === '' 
    ? suggestions 
    : [
        ...filteredNav.map(i => ({ ...i, type: 'nav' })),
        ...filteredActions.map(i => ({ ...i, type: 'action' })),
        ...filteredCustomers.map(i => ({ id: i.id, name: i.name, type: 'customer', icon: User, category: 'Leads Encontrados', sub: i.phone })),
        ...filteredServices.map(i => ({ id: i.id, name: i.name, type: 'service', icon: Briefcase, category: 'Serviços', sub: `R$ ${i.price}` })),
      ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % allResults.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === 'Enter') {
      const selected = allResults[selectedIndex];
      if (selected) handleSelect(selected);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item: any) => {
    if (item.type === 'nav') {
      onNavigate(item.id);
    } else if (item.type === 'customer') {
      onNavigate('leads');
    } else if (item.type === 'service') {
      onNavigate('services');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-24 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden border border-zinc-200"
          >
            <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
              <Search className="text-zinc-400" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pesquisar leads, serviços ou navegar pelo sistema..."
                className="flex-1 bg-transparent border-none outline-none text-zinc-900 placeholder:text-zinc-400 text-sm"
              />
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-[10px] text-zinc-400 font-mono">ESC</kbd>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {query === '' && (
                <div className="px-3 py-2 mb-2">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Sugestões e Atalhos</p>
                </div>
              )}

              {query !== '' && allResults.length === 0 ? (
                <div className="py-12 text-center">
                  <Search className="mx-auto text-zinc-200 mb-3" size={40} />
                  <p className="text-zinc-500 text-sm">Nenhum resultado encontrado para "{query}"</p>
                </div>
              ) : (
                <div className="space-y-4 pb-2">
                  {Array.from(new Set(allResults.map(r => r.category || 'Sugestões'))).map(category => (
                    <div key={category}>
                      {query !== '' && <h3 className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{category}</h3>}
                      <div className="space-y-0.5">
                        {allResults.filter(r => (r.category || 'Sugestões') === category).map((item, idx) => {
                          const globalIdx = allResults.indexOf(item);
                          const isSelected = selectedIndex === globalIdx;
                          return (
                            <button
                              key={`${item.type}-${item.id}`}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                                isSelected ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50 text-zinc-600'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                <item.icon size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                {item.sub && (
                                  <p className={`text-[10px] truncate ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    {item.sub}
                                  </p>
                                )}
                              </div>
                              {isSelected && <ArrowRight size={14} className="text-zinc-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-zinc-50 border-top border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded border border-zinc-200 bg-white">↑↓</kbd> Navegar
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded border border-zinc-200 bg-white">ENTER</kbd> Selecionar
                </span>
              </div>
              <span>Sistemático & Funcional</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
