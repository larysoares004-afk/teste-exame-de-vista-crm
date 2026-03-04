import React from 'react';
import { 
  Users, 
  Calendar,
  CalendarCheck, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Filter,
  BarChart3,
  CheckCircle2,
  UserPlus,
  Target,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardStats, ChartData, SourceData, Customer } from '../types';
import { cn } from '../lib/utils';
import { isSameDay } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

type DashboardProps = {
  stats: DashboardStats;
  chartData: ChartData[];
  sourceData: SourceData[];
  customers: Customer[];
  onNavigate?: (tab: string) => void;
  onFilterChange?: (type: 'origin' | 'period', value: string) => void;
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard({ stats, chartData, sourceData, customers, onNavigate, onFilterChange }: DashboardProps) {
  const statCards = [
    { id: 'total', label: 'Total de Leads', value: stats.totalLeads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'new', label: 'Novos', value: stats.newLeads, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'progress', label: 'Em Atendimento', value: stats.inProgress, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'scheduled', label: 'Agendados', value: stats.scheduled, icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'confirmed', label: 'Confirmados', value: stats.confirmed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'qualified', label: 'Qualificados', value: stats.qualified, icon: UserPlus, color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: 'converted', label: 'Convertidos', value: stats.converted, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'lost', label: 'Perdidos', value: stats.lost, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const recentLeads = [...customers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 1);

  const todayExams = customers.filter(c => 
    c.status === 'Confirmado' && isSameDay(new Date(c.createdAt), new Date())
  ).slice(0, 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Painel</h1>
          <p className="text-sm text-zinc-500 mt-1">Visão geral do CRM Omnichannel</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm"
          >
            <Filter size={14} className="text-zinc-400" />
            <select 
              onChange={(e) => onFilterChange?.('origin', e.target.value)}
              className="text-xs font-medium text-zinc-600 bg-transparent border-none focus:ring-0 outline-none cursor-pointer"
            >
              <option value="Todos">Todos</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Landing Page">Landing Page</option>
            </select>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm"
          >
            <Calendar size={14} className="text-zinc-400" />
            <select 
              onChange={(e) => onFilterChange?.('period', e.target.value)}
              className="text-xs font-medium text-zinc-600 bg-transparent border-none focus:ring-0 outline-none cursor-pointer"
            >
              <option value="Hoje">Hoje</option>
              <option value="Últimos 7 dias">Últimos 7 dias</option>
              <option value="Últimos 30 dias">Últimos 30 dias</option>
              <option value="Máximo">Máximo</option>
            </select>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onNavigate?.('customers')}
            className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", card.bg)}>
                <card.icon className={card.color} size={16} />
              </div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{card.label}</p>
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mt-2">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Taxas de Conversão (Convertidos / Total)</p>
            <h3 className="text-xl font-bold text-zinc-900">{stats.conversionRate}%</h3>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm"
        >
          <h3 className="text-sm font-bold text-zinc-900 mb-6">Leads por Dia ({chartData.length}d)</h3>
          <div className="h-[200px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 text-xs italic">
                Sem dados para o período
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm"
        >
          <h3 className="text-sm font-bold text-zinc-900 mb-6">Leads por Origem</h3>
          <div className="h-[200px] w-full">
            {sourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400 text-xs italic">
                Sem dados para a origem selecionada
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm"
        >
          <h3 className="text-sm font-bold text-zinc-900 mb-6">Funil de Conversão</h3>
          <div className="space-y-4">
            {(() => {
              const funnelItems = [
                { label: 'Novo', value: stats.newLeads, color: 'bg-blue-500' },
                { label: 'Em atend.', value: stats.inProgress, color: 'bg-emerald-500' },
                { label: 'Qualificado', value: stats.qualified, color: 'bg-amber-500' },
                { label: 'Convertido', value: stats.converted, color: 'bg-rose-500' },
              ];
              const maxValue = Math.max(...funnelItems.map(i => i.value), 1);
              
              return funnelItems.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-4 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-500", item.color)} 
                      style={{ width: `${(item.value / maxValue) * 100}%` }} 
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm"
        >
          <h3 className="text-sm font-bold text-zinc-900 mb-6">Performance por Atendente (Convertidos)</h3>
          <div className="space-y-4">
            {(() => {
              const attendantStats = customers.reduce((acc, customer) => {
                if (!customer.attendant) return acc;
                if (!acc[customer.attendant]) {
                  acc[customer.attendant] = { total: 0, converted: 0 };
                }
                acc[customer.attendant].total += 1;
                if (customer.status === 'Convertido') {
                  acc[customer.attendant].converted += 1;
                }
                return acc;
              }, {} as Record<string, { total: number, converted: number }>);

              const sortedAttendants = Object.entries(attendantStats)
                .sort((a, b) => b[1].converted - a[1].converted)
                .slice(0, 4);

              if (sortedAttendants.length === 0) {
                return <p className="text-xs text-zinc-400 italic">Nenhum dado de atendente disponível.</p>;
              }

              const maxConverted = Math.max(...sortedAttendants.map(a => a[1].converted), 1);

              return sortedAttendants.map(([name, data]) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                    <span>{name}</span>
                    <span>{data.converted} conv. / {data.total} total</span>
                  </div>
                  <div className="h-4 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                      style={{ width: `${(data.converted / maxConverted) * 100}%` }} 
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate?.('calendar')}
          className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm cursor-pointer hover:border-blue-200 transition-colors"
        >
          <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              Exames de Hoje ({stats.confirmed})
            </div>
            <ArrowUpRight size={14} className="text-zinc-400" />
          </h3>
          {todayExams.length > 0 ? (
            todayExams.map(exam => (
              <div key={exam.id} className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">{exam.name}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Confirmado — {exam.source}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Confirmado</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400 italic">Nenhum exame confirmado para hoje.</p>
          )}
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate?.('customers')}
          className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm cursor-pointer hover:border-blue-200 transition-colors"
        >
          <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              Leads Recentes
            </div>
            <ArrowUpRight size={14} className="text-zinc-400" />
          </h3>
          {recentLeads.length > 0 ? (
            recentLeads.map(lead => (
              <div key={lead.id} className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">{lead.name}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{lead.source} — {new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{lead.status}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400 italic">Nenhum lead recente encontrado.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
