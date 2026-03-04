export type LeadSource = 'WhatsApp' | 'Meta Ads' | 'Google Ads' | 'Landing Page';
export type LeadStatus = 'Novo' | 'Em Atendimento' | 'Qualificado' | 'Convertido' | 'Perdido' | 'Agendado' | 'Confirmado';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
  attendant?: string;
};

export type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  color: string;
};

export type Appointment = {
  id: string;
  customerId: string;
  serviceId: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
};

export type DashboardStats = {
  totalLeads: number;
  newLeads: number;
  inProgress: number;
  scheduled: number;
  confirmed: number;
  qualified: number;
  converted: number;
  lost: number;
  conversionRate: number;
};

export type ChartData = {
  date: string;
  leads: number;
};

export type SourceData = {
  name: LeadSource;
  value: number;
};
