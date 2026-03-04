import { Customer, Service, Appointment, SourceData } from './types';
import { addDays, setHours, setMinutes, formatISO, subDays, format } from 'date-fns';

export const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'João Silva', email: 'joao@example.com', phone: '(11) 98765-4321', source: 'WhatsApp', status: 'Confirmado', createdAt: '2026-03-04T10:00:00Z', attendant: 'Ana Costa' },
  { id: '2', name: 'Maria Oliveira', email: 'maria@example.com', phone: '(11) 91234-5678', source: 'Meta Ads', status: 'Agendado', createdAt: '2026-03-03T14:30:00Z', attendant: 'Carlos Lima' },
  { id: '3', name: 'Pedro Santos', email: 'pedro@example.com', phone: '(11) 99887-7665', source: 'Google Ads', status: 'Novo', createdAt: '2026-03-02T09:15:00Z', attendant: 'Ana Costa' },
  { id: '4', name: 'Ana Costa', email: 'ana@example.com', phone: '(11) 97766-5544', source: 'Landing Page', status: 'Em Atendimento', createdAt: '2026-03-04T16:45:00Z', attendant: 'Mariana Santos' },
  { id: '5', name: 'Carlos Lima', email: 'carlos@example.com', phone: '(11) 96655-4433', source: 'WhatsApp', status: 'Convertido', createdAt: '2026-03-04T11:00:00Z', attendant: 'Carlos Lima' },
  { id: '6', name: 'Lucas Ferreira', email: 'lucas@example.com', phone: '(11) 95544-3322', source: 'Meta Ads', status: 'Convertido', createdAt: '2026-03-04T09:00:00Z', attendant: 'Ana Costa' },
  { id: '7', name: 'Beatriz Souza', email: 'beatriz@example.com', phone: '(11) 94433-2211', source: 'Google Ads', status: 'Perdido', createdAt: '2026-02-25T10:00:00Z', attendant: 'Pedro Oliveira' },
  { id: '8', name: 'Fernanda Rocha', email: 'fernanda@example.com', phone: '(11) 93322-1100', source: 'WhatsApp', status: 'Novo', createdAt: '2026-03-04T08:30:00Z', attendant: 'Mariana Santos' },
];

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Corte de Cabelo', duration: 30, price: 50, color: '#3b82f6' },
  { id: '2', name: 'Barba', duration: 20, price: 30, color: '#10b981' },
  { id: '3', name: 'Combo (Corte + Barba)', duration: 50, price: 70, color: '#8b5cf6' },
  { id: '4', name: 'Coloração', duration: 90, price: 120, color: '#f59e0b' },
];

const today = new Date('2026-03-04T12:00:00Z');

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    customerId: '1',
    serviceId: '1',
    date: formatISO(setMinutes(setHours(today, 10), 0)),
    status: 'scheduled',
  },
  {
    id: '2',
    customerId: '2',
    serviceId: '3',
    date: formatISO(setMinutes(setHours(today, 14), 30)),
    status: 'scheduled',
  },
];

export const MOCK_CHART_DATA = Array.from({ length: 7 }).map((_, i) => ({
  date: format(subDays(today, 6 - i), 'dd/MM'),
  leads: Math.floor(Math.random() * 5),
}));

export const MOCK_SOURCE_DATA: SourceData[] = [
  { name: 'WhatsApp', value: 2 },
  { name: 'Landing Page', value: 2 },
  { name: 'Meta Ads', value: 2 },
  { name: 'Google Ads', value: 2 },
];
