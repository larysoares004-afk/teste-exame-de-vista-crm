import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Appointment, Service, Customer } from '../types';

type CalendarViewProps = {
  appointments: Appointment[];
  services: Service[];
  customers: Customer[];
};

export function CalendarView({ appointments, services, customers }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(app => isSameDay(new Date(app.date), day));
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Agenda</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerencie seus horários e compromissos.</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-600 px-3 py-2 rounded-lg font-bold text-xs hover:bg-zinc-50 transition-colors"
          >
            <Filter size={14} />
            Filtrar
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={14} />
            Novo Agendamento
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-zinc-900 capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <div className="flex items-center gap-1 bg-white border border-zinc-200 p-0.5 rounded-lg shadow-sm">
              <motion.button 
                onClick={prevMonth}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 hover:bg-zinc-50 rounded-md transition-all text-zinc-600"
              >
                <ChevronLeft size={14} />
              </motion.button>
              <motion.button 
                onClick={nextMonth}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 hover:bg-zinc-50 rounded-md transition-all text-zinc-600"
              >
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white border border-zinc-200 p-0.5 rounded-lg shadow-sm">
            {['Mês', 'Semana', 'Dia'].map((view) => (
              <motion.button 
                key={view}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
                  view === 'Mês' ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                {view}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-zinc-100">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="py-2 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day, idx) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div 
                key={day.toISOString()} 
                className={cn(
                  "min-h-[100px] p-2 border-r border-b border-zinc-100 transition-colors hover:bg-zinc-50/30",
                  !isCurrentMonth && "bg-zinc-50/50",
                  idx % 7 === 6 && "border-r-0"
                )}
              >
                <div className="flex justify-end mb-1">
                  <span className={cn(
                    "text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-md",
                    isToday(day) ? "bg-indigo-600 text-white" : isCurrentMonth ? "text-zinc-900" : "text-zinc-300"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayAppointments.map(app => {
                    const service = services.find(s => s.id === app.serviceId);
                    const customer = customers.find(c => c.id === app.customerId);
                    return (
                      <motion.div 
                        key={app.id}
                        whileHover={{ scale: 1.02, x: 2 }}
                        className="text-[9px] p-1 rounded-md border border-zinc-100 bg-white shadow-sm truncate font-bold flex items-center gap-1.5 cursor-pointer hover:border-indigo-200 transition-colors"
                      >
                        <div className="w-1 h-3 rounded-full shrink-0" style={{ backgroundColor: service?.color }} />
                        <span className="text-zinc-900">{customer?.name.split(' ')[0]}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
