import React from 'react';
import { Scissors, Plus, Clock, DollarSign, MoreHorizontal } from 'lucide-react';
import { Service } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

type ServiceListProps = {
  services: Service[];
};

export function ServiceList({ services }: ServiceListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Serviços</h1>
          <p className="text-sm text-zinc-500 mt-1">Configure o que você oferece aos clientes.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={14} />
          Novo Serviço
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <motion.div 
            key={service.id} 
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden cursor-pointer"
          >
            <div 
              className="absolute top-0 left-0 w-1 h-full" 
              style={{ backgroundColor: service.color }} 
            />
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-zinc-50 text-zinc-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Scissors size={20} />
              </div>
              <button className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-400 hover:text-zinc-600 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-zinc-900 mb-1">{service.name}</h3>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                <Clock size={14} className="text-zinc-400" />
                {service.duration} min
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                <DollarSign size={14} />
                R$ {service.price.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-50 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Ativo</span>
              <div className="w-8 h-4 bg-emerald-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
