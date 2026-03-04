import React from 'react';
import { Search, UserPlus, MoreHorizontal, Mail, Phone, Calendar, Filter } from 'lucide-react';
import { Customer } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

type CustomerListProps = {
  customers: Customer[];
};

export function CustomerList({ customers }: CustomerListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Clientes</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerencie sua base de contatos e histórico.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <UserPlus size={14} />
          Novo Cliente
        </motion.button>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between gap-4 bg-zinc-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input 
              type="text" 
              placeholder="Buscar clientes..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-600 px-3 py-2 rounded-lg font-bold text-xs hover:bg-zinc-50 transition-colors"
          >
            <Filter size={14} />
            Filtros
          </motion.button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-50/30 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-100">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Contato</th>
                <th className="px-6 py-3">Cadastro</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCustomers.map((customer) => (
                <motion.tr 
                  key={customer.id} 
                  whileHover={{ backgroundColor: "rgba(244, 244, 245, 0.5)" }}
                  className="transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-bold text-zinc-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Mail size={12} className="text-zinc-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Phone size={12} className="text-zinc-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Calendar size={12} className="text-zinc-400" />
                      {format(new Date(customer.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-zinc-100 rounded-md text-zinc-400 hover:text-zinc-600 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
