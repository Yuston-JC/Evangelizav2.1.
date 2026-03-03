export interface User {
  id: number;
  name: string;
  email: string;
  contact?: string;
  role: 'evangelista' | 'admin' | 'acompanhante';
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface Evangelizado {
  id: number;
  name: string;
  contact: string;
  location: string;
  age_range?: string;
  address?: string;
  religion?: string;
  church?: string;
  prayer_request?: string;
  prayed_for?: boolean;
  evangelista_id: number;
  evangelista_name?: string;
  acompanhante_id?: number;
  acompanhante_name?: string;
  accepted_jesus: boolean;
  follow_up: boolean;
  follow_up_person: string;
  notes: string;
  created_at: string;
}

export interface Stats {
  total: number;
  accepted: number;
  followUp: number;
  byEvangelist: { name: string; count: number }[];
}
