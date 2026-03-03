import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  LayoutDashboard, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Filter,
  Download,
  Menu,
  X,
  ChevronRight,
  Heart,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User, Evangelizado, Stats } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden", className)}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  className,
  disabled
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required,
  error 
}: any) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={cn(
        "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all",
        error && "border-red-500 focus:ring-red-500/20"
      )}
    />
  </div>
);

const Select = ({ label, value, onChange, options, required }: any) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// --- Pages ---

const Login = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      let data;
      const text = await res.text();
      
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Resposta não-JSON do servidor:", text);
        setError(`Erro do servidor (${res.status}): Resposta inválida`);
        return;
      }

      if (res.ok) {
        onLogin(data);
      } else {
        // Se o status for 403, a mensagem de "aguardando aprovação" estará aqui
        setError(data.error || 'Erro desconhecido');
      }
    } catch (err: any) {
      console.error("Erro de conexão:", err);
      setError(`Erro de conexão: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Evangeliza</h1>
          <p className="text-slate-500 mt-2">Gestão de acompanhamento espiritual</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="E-mail" 
              type="email" 
              value={email} 
              onChange={(e: any) => setEmail(e.target.value)} 
              required 
              placeholder="seu@email.com"
            />
            <Input 
              label="Senha" 
              type="password" 
              value={password} 
              onChange={(e: any) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
            
            {error && (
              <div className={cn(
                "p-4 rounded-xl text-sm font-medium flex items-start gap-3",
                error.includes("aguardando aprovação") 
                  ? "bg-amber-50 text-amber-800 border border-amber-100" 
                  : "bg-red-50 text-red-600 border border-red-100"
              )}>
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full py-3" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-500">
              Não tem uma conta? Cadastre-se como:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link to="/register?role=evangelista" className="text-indigo-600 font-semibold hover:underline text-sm">
                Evangelista
              </Link>
              <span className="hidden sm:inline text-slate-300">•</span>
              <Link to="/register?role=acompanhante" className="text-indigo-600 font-semibold hover:underline text-sm">
                Acompanhante
              </Link>
            </div>
          </div>
        </Card>

        <p className="text-center mt-6 text-sm text-slate-500">
          Acesso restrito para evangelistas e administradores.
        </p>
      </motion.div>
    </div>
  );
};

const Register = () => {
  const [searchParams] = React.useMemo(() => [new URLSearchParams(window.location.search)], []);
  const initialRole = searchParams.get('role') as 'evangelista' | 'acompanhante' || 'evangelista';
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    contact: '',
    role: initialRole 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => navigate('/login'), 10000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Cadastro</h1>
          <p className="text-slate-500 mt-2">
            {formData.role === 'evangelista' ? 'Junte-se à nossa rede de evangelistas' : 'Seja um acompanhante espiritual'}
          </p>
        </div>

        <Card className="p-8">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Solicitação Enviada</h3>
              <div className="space-y-2">
                <p className="text-slate-600 font-medium">Seu cadastro foi recebido com sucesso!</p>
                <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Para garantir a segurança da nossa rede, sua conta precisa ser <strong>aprovada por um administrador</strong> antes do primeiro acesso.
                </p>
              </div>
              <div className="pt-4">
                <Link to="/login">
                  <Button variant="primary" className="w-full">Voltar para o Login</Button>
                </Link>
                <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest">Você será redirecionado automaticamente em 10 segundos</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Tipo de Acesso</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'evangelista' })}
                    className={cn(
                      "flex-1 py-2 rounded-xl border-2 transition-all text-sm font-medium",
                      formData.role === 'evangelista' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 text-slate-500"
                    )}
                  >
                    Evangelista
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'acompanhante' })}
                    className={cn(
                      "flex-1 py-2 rounded-xl border-2 transition-all text-sm font-medium",
                      formData.role === 'acompanhante' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 text-slate-500"
                    )}
                  >
                    Acompanhante
                  </button>
                </div>
              </div>

              <Input 
                label="Nome Completo" 
                value={formData.name} 
                onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} 
                required 
                placeholder="Seu nome"
              />
              <Input 
                label="E-mail" 
                type="email" 
                value={formData.email} 
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })} 
                required 
                placeholder="seu@email.com"
              />
              <Input 
                label="Contato (Telefone)" 
                value={formData.contact} 
                onChange={(e: any) => setFormData({ ...formData, contact: e.target.value })} 
                required 
                placeholder="(00) 00000-0000"
              />
              <Input 
                label="Senha" 
                type="password" 
                value={formData.password} 
                onChange={(e: any) => setFormData({ ...formData, password: e.target.value })} 
                required 
                placeholder="••••••••"
              />
              
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full py-3" disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Solicitar Acesso'}
              </Button>
              
              <div className="text-center">
                <Link to="/login" className="text-sm text-slate-500 hover:text-indigo-600">
                  Já tem uma conta? Faça login
                </Link>
              </div>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

const Layout = ({ user, onLogout, children }: { user: User; onLogout: () => void; children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <Heart size={18} fill="currentColor" />
                </div>
                <span className="text-xl font-bold font-serif text-slate-900">Evangeliza</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link>
                  <Link to="/admin/list" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Todos Registros</Link>
                </>
              ) : user.role === 'acompanhante' ? (
                <>
                  <Link to="/acompanhante" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Meus Acompanhamentos</Link>
                  <Link to="/acompanhante/disponiveis" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Sem Acompanhamento</Link>
                </>
              ) : (
                <>
                  <Link to="/evangelista" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Meus Registros</Link>
                  <Link to="/evangelista/novo" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Novo Registro</Link>
                </>
              )}
              <div className="h-4 w-px bg-slate-200 mx-2" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-700">Dashboard</Link>
                  <Link to="/admin/list" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-700">Todos Registros</Link>
                </>
              ) : user.role === 'acompanhante' ? (
                <>
                  <Link to="/acompanhante" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-700">Meus Acompanhamentos</Link>
                  <Link to="/acompanhante/disponiveis" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-700">Sem Acompanhamento</Link>
                </>
              ) : (
                <>
                  <Link to="/evangelista" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-700">Meus Registros</Link>
                  <Link to="/evangelista/novo" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-slate-700">Novo Registro</Link>
                </>
              )}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500 capitalize">{user.role}</p>
                </div>
                <Button variant="danger" onClick={handleLogout} className="px-4 py-2">
                  Sair
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

const EvangelistaDashboard = ({ user }: { user: User }) => {
  const [registros, setRegistros] = useState<Evangelizado[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    try {
      const res = await fetch(`/api/evangelizados?evangelista_id=${user.id}&role=evangelista`);
      const data = await res.json();
      setRegistros(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrayToggle = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/evangelizados/${id}/pray`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prayed_for: !currentStatus })
      });
      if (res.ok) {
        setRegistros(registros.map(r => r.id === id ? { ...r, prayed_for: !currentStatus } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Meus Registros</h1>
          <p className="text-slate-500">Pessoas que você evangelizou e está acompanhando.</p>
        </div>
        <Link to="/evangelista/novo">
          <Button className="w-full sm:w-auto">
            <UserPlus size={20} />
            Novo Registro
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : registros.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Nenhum registro encontrado</h3>
          <p className="text-slate-500 mt-1">Comece registrando sua primeira evangelização.</p>
          <Link to="/evangelista/novo" className="mt-6 inline-block">
            <Button variant="outline">Cadastrar Agora</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registros.map((reg) => (
            <motion.div key={reg.id} layout>
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{reg.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {reg.location}
                    </p>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    reg.accepted_jesus ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {reg.accepted_jesus ? 'Aceitou Jesus' : 'Semeado'}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    {reg.contact}
                  </div>
                  {reg.age_range && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Users size={16} className="text-slate-400" />
                      {reg.age_range}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MessageSquare size={16} className="text-slate-400" />
                    {reg.follow_up ? `Acompanhado por: ${reg.follow_up_person}` : 'Sem acompanhamento'}
                  </div>
                </div>

                {reg.notes && (
                  <p className="mt-4 text-sm text-slate-500 italic line-clamp-2">
                    "{reg.notes}"
                  </p>
                )}

                {reg.prayer_request && (
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pedido de Oração</p>
                      <button 
                        onClick={() => handlePrayToggle(reg.id, !!reg.prayed_for)}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-all",
                          reg.prayed_for ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        )}
                      >
                        {reg.prayed_for ? 'Orado' : 'Marcar como Orado'}
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{reg.prayer_request}"</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const NovoRegistro = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    age_range: '',
    address: '',
    religion: '',
    church: '',
    prayer_request: '',
    prayed_for: false,
    accepted_jesus: false,
    follow_up: false,
    follow_up_person: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/evangelizados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, evangelista_id: user.id })
      });
      if (res.ok) {
        navigate('/evangelista');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-serif">Novo Registro</h1>
        <p className="text-slate-500">Preencha os dados da pessoa evangelizada.</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Nome Completo" 
            value={formData.name} 
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })} 
            required 
            placeholder="Ex: João Silva"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input 
              label="Contato (Telefone/Email)" 
              value={formData.contact} 
              onChange={(e: any) => setFormData({ ...formData, contact: e.target.value })} 
              required 
              placeholder="(00) 00000-0000"
            />
            <Input 
              label="Localização (Onde foi evangelizado)" 
              value={formData.location} 
              onChange={(e: any) => setFormData({ ...formData, location: e.target.value })} 
              required 
              placeholder="Ex: Praça Central"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input 
              label="Idade / Intervalo" 
              value={formData.age_range} 
              onChange={(e: any) => setFormData({ ...formData, age_range: e.target.value })}
              placeholder="Ex: 18 ou Jovem"
            />
            <Input 
              label="Onde vive (Endereço/Bairro)" 
              value={formData.address} 
              onChange={(e: any) => setFormData({ ...formData, address: e.target.value })} 
              placeholder="Ex: Bairro Santa Luzia"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input 
              label="Religião" 
              value={formData.religion} 
              onChange={(e: any) => setFormData({ ...formData, religion: e.target.value })} 
              placeholder="Ex: Mulçulmano, Cristão"
            />
            <Input 
              label="Igreja que frequenta (se houver)" 
              value={formData.church} 
              onChange={(e: any) => setFormData({ ...formData, church: e.target.value })} 
              placeholder="Nome da igreja"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-3">
              <label className="text-sm font-medium text-slate-700">Aceitou a Jesus?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accepted_jesus: true })}
                  className={cn(
                    "flex-1 py-2 rounded-xl border-2 transition-all flex items-center justify-center gap-2",
                    formData.accepted_jesus ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 text-slate-500"
                  )}
                >
                  <CheckCircle2 size={18} /> Sim
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accepted_jesus: false })}
                  className={cn(
                    "flex-1 py-2 rounded-xl border-2 transition-all flex items-center justify-center gap-2",
                    !formData.accepted_jesus ? "border-slate-600 bg-slate-50 text-slate-600" : "border-slate-100 text-slate-500"
                  )}
                >
                  <XCircle size={18} /> Não
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <label className="text-sm font-medium text-slate-700">Recebendo acompanhamento?</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, follow_up: true })}
                  className={cn(
                    "flex-1 py-2 rounded-xl border-2 transition-all flex items-center justify-center gap-2",
                    formData.follow_up ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 text-slate-500"
                  )}
                >
                  <CheckCircle2 size={18} /> Sim
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, follow_up: false })}
                  className={cn(
                    "flex-1 py-2 rounded-xl border-2 transition-all flex items-center justify-center gap-2",
                    !formData.follow_up ? "border-slate-600 bg-slate-50 text-slate-600" : "border-slate-100 text-slate-500"
                  )}
                >
                  <XCircle size={18} /> Não
                </button>
              </div>
            </div>
          </div>

          {formData.follow_up && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Input 
                label="Quem está fazendo o acompanhamento?" 
                value={formData.follow_up_person} 
                onChange={(e: any) => setFormData({ ...formData, follow_up_person: e.target.value })} 
                required 
                placeholder="Nome do evangelista ou líder"
              />
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Observações Adicionais</label>
            <textarea
              value={formData.notes}
              onChange={(e: any) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all min-h-[100px]"
              placeholder="Detalhes sobre a conversa, etc."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Pedido de Oração</label>
            <textarea
              value={formData.prayer_request}
              onChange={(e: any) => setFormData({ ...formData, prayer_request: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all min-h-[80px]"
              placeholder="Descreva o pedido de oração..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => navigate('/evangelista')} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const AcompanhanteDashboard = ({ user, showAvailableOnly = false }: { user: User; showAvailableOnly?: boolean }) => {
  const [registros, setRegistros] = useState<Evangelizado[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRegistros();
  }, [showAvailableOnly]);

  const fetchRegistros = async () => {
    try {
      const url = showAvailableOnly 
        ? '/api/evangelizados?role=acompanhante' 
        : `/api/evangelizados?role=acompanhante&acompanhante_id=${user.id}`;
      const res = await fetch(url);
      const data = await res.json();
      setRegistros(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrayToggle = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/evangelizados/${id}/pray`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prayed_for: !currentStatus })
      });
      if (res.ok) {
        setRegistros(registros.map(r => r.id === id ? { ...r, prayed_for: !currentStatus } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">
          {showAvailableOnly ? 'Pessoas sem Acompanhamento' : 'Meus Acompanhamentos'}
        </h1>
        <p className="text-slate-500">
          {showAvailableOnly 
            ? 'Lista de pessoas que ainda não possuem um acompanhante designado.' 
            : 'Pessoas designadas para você fazer o acompanhamento espiritual.'}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : registros.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Nenhum registro encontrado</h3>
          <p className="text-slate-500 mt-1">
            {showAvailableOnly ? 'Todos os evangelizados já possuem acompanhamento.' : 'Você ainda não tem pessoas designadas para acompanhar.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registros.map((reg) => (
            <motion.div key={reg.id} layout>
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{reg.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {reg.location}
                    </p>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    reg.accepted_jesus ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {reg.accepted_jesus ? 'Aceitou Jesus' : 'Semeado'}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    {reg.contact}
                  </div>
                  {reg.age_range && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Users size={16} className="text-slate-400" />
                      {reg.age_range}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MessageSquare size={16} className="text-slate-400" />
                    <span className="font-medium text-indigo-600">Evangelista: {reg.evangelista_name}</span>
                  </div>
                </div>

                {reg.notes && (
                  <p className="mt-4 text-sm text-slate-500 italic line-clamp-2">
                    "{reg.notes}"
                  </p>
                )}

                {reg.prayer_request && (
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pedido de Oração</p>
                      <button 
                        onClick={() => handlePrayToggle(reg.id, !!reg.prayed_for)}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-all",
                          reg.prayed_for ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        )}
                      >
                        {reg.prayed_for ? 'Orado' : 'Marcar como Orado'}
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{reg.prayer_request}"</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) return <div className="h-96 flex items-center justify-center">Carregando estatísticas...</div>;

  const chartData = stats.byEvangelist.map(item => ({
    name: item.name.split(' ')[0],
    count: item.count
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Dashboard Administrativo</h1>
          <p className="text-slate-500">Visão geral da obra evangelística.</p>
        </div>
        <Link to="/admin/list">
          <Button variant="outline">
            <Users size={20} />
            Ver Todos Registros
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-indigo-600">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Evangelizados</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{stats.total}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Aceitaram Jesus</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{stats.accepted}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {stats.total > 0 ? ((stats.accepted / stats.total) * 100).toFixed(1) : 0}% do total
          </p>
        </Card>
        <Card className="p-6 border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Em Acompanhamento</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{stats.followUp}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">
            {stats.total > 0 ? ((stats.followUp / stats.total) * 100).toFixed(1) : 0}% do total
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Evangelizações por Evangelista</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Ações Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="secondary" className="h-24 flex-col gap-2">
              <Download size={24} />
              Exportar Excel
            </Button>
            <Button variant="secondary" className="h-24 flex-col gap-2">
              <Download size={24} />
              Exportar PDF
            </Button>
            <Link to="/admin/users" className="sm:col-span-2">
              <Button variant="outline" className="w-full h-16">
                Gerenciar Evangelistas (Aprovações)
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

const AdminList = () => {
  const [registros, setRegistros] = useState<Evangelizado[]>([]);
  const [filtered, setFiltered] = useState<Evangelizado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acompanhantes, setAcompanhantes] = useState<{id: number, name: string}[]>([]);
  const [filters, setFilters] = useState({
    evangelista: '',
    accepted: 'all',
    followUp: 'all'
  });

  useEffect(() => {
    fetchRegistros();
    fetchAcompanhantes();
  }, []);

  const fetchAcompanhantes = async () => {
    try {
      const res = await fetch('/api/admin/acompanhantes');
      const data = await res.json();
      setAcompanhantes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async (evangelizadoId: number, acompanhanteId: string) => {
    if (!acompanhanteId) return;
    try {
      const res = await fetch('/api/admin/evangelizados/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evangelizadoId, acompanhanteId: parseInt(acompanhanteId) })
      });
      if (res.ok) {
        const updated = await res.json();
        setRegistros(registros.map(r => r.id === evangelizadoId ? { 
          ...r, 
          acompanhante_id: updated.acompanhante_id,
          follow_up: true,
          follow_up_person: acompanhantes.find(a => a.id === parseInt(acompanhanteId))?.name || ''
        } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let result = registros;
    if (filters.evangelista) {
      result = result.filter(r => r.evangelista_name?.toLowerCase().includes(filters.evangelista.toLowerCase()));
    }
    if (filters.accepted !== 'all') {
      result = result.filter(r => r.accepted_jesus === (filters.accepted === 'true'));
    }
    if (filters.followUp !== 'all') {
      result = result.filter(r => r.follow_up === (filters.followUp === 'true'));
    }
    setFiltered(result);
  }, [filters, registros]);

  const fetchRegistros = async () => {
    try {
      const res = await fetch('/api/evangelizados?role=admin');
      const data = await res.json();
      setRegistros(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrayToggle = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/evangelizados/${id}/pray`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prayed_for: !currentStatus })
      });
      if (res.ok) {
        setRegistros(registros.map(r => r.id === id ? { ...r, prayed_for: !currentStatus } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Contato', 'Localização', 'Idade/Intervalo', 'Onde Vive', 'Religião', 'Igreja', 'Pedido Oração', 'Orado', 'Evangelista', 'Aceitou Jesus', 'Acompanhamento', 'Pessoa Acompanhamento', 'Notas', 'Data'];
    const rows = filtered.map(r => [
      r.name,
      r.contact,
      r.location,
      r.age_range || '-',
      r.address || '-',
      r.religion || '-',
      r.church || '-',
      r.prayer_request || '-',
      r.prayed_for ? 'Sim' : 'Não',
      r.evangelista_name,
      r.follow_up ? 'Sim' : 'Não',
      r.follow_up_person || '-',
      r.notes || '-',
      new Date(r.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "evangelizados.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Todos os Registros</h1>
          <p className="text-slate-500">Lista completa de pessoas evangelizadas.</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download size={20} />
          Exportar CSV
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input 
            label="Filtrar por Evangelista" 
            value={filters.evangelista} 
            onChange={(e: any) => setFilters({ ...filters, evangelista: e.target.value })}
            placeholder="Nome do evangelista..."
          />
          <Select 
            label="Aceitou Jesus?" 
            value={filters.accepted} 
            onChange={(e: any) => setFilters({ ...filters, accepted: e.target.value })}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'true', label: 'Sim' },
              { value: 'false', label: 'Não' }
            ]}
          />
          <Select 
            label="Em Acompanhamento?" 
            value={filters.followUp} 
            onChange={(e: any) => setFilters({ ...filters, followUp: e.target.value })}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'true', label: 'Sim' },
              { value: 'false', label: 'Não' }
            ]}
          />
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pessoa</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Evangelista</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aceitou?</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acompanhamento</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pedido Oração</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/50" />
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Nenhum registro encontrado com esses filtros.</td>
              </tr>
            ) : (
              filtered.map(reg => (
                <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{reg.name}</p>
                    <p className="text-xs text-slate-500">{reg.contact}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{reg.evangelista_name}</td>
                  <td className="px-6 py-4 text-center">
                    {reg.accepted_jesus ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 size={14} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        <XCircle size={14} />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{reg.follow_up ? 'Sim' : 'Não'}</p>
                    {reg.follow_up ? (
                      <p className="text-xs text-slate-400">Por: {reg.follow_up_person}</p>
                    ) : (
                      <select 
                        className="mt-1 text-xs bg-indigo-50 border-none rounded px-1 py-0.5 text-indigo-600 outline-none"
                        onChange={(e) => handleAssign(reg.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Designar...</option>
                        {acompanhantes.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {reg.prayer_request ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-slate-600 italic line-clamp-1">"{reg.prayer_request}"</p>
                        <button 
                          onClick={() => handlePrayToggle(reg.id, !!reg.prayed_for)}
                          className={cn(
                            "text-[10px] w-fit px-2 py-0.5 rounded-full font-bold uppercase transition-all",
                            reg.prayed_for ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          )}
                        >
                          {reg.prayed_for ? 'Orado' : 'Marcar Orado'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(reg.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/users/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">Gerenciar Usuários</h1>
        <p className="text-slate-500">Aprove ou rejeite solicitações de Evangelistas e Acompanhantes.</p>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Função</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data Cadastro</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/50" />
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Nenhum usuário cadastrado.</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                    {u.contact && <p className="text-[10px] text-indigo-500 font-medium">{u.contact}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600 capitalize">{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      u.status === 'approved' ? "bg-emerald-100 text-emerald-700" : 
                      u.status === 'pending' ? "bg-amber-100 text-amber-700" : 
                      "bg-red-100 text-red-700"
                    )}>
                      {u.status === 'approved' ? 'Aprovado' : u.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {u.status !== 'approved' && (
                        <Button 
                          variant="primary" 
                          className="px-3 py-1 text-xs"
                          onClick={() => handleApprove(u.id, 'approved')}
                        >
                          Aprovar
                        </Button>
                      )}
                      {u.status !== 'rejected' && (
                        <Button 
                          variant="danger" 
                          className="px-3 py-1 text-xs"
                          onClick={() => handleApprove(u.id, 'rejected')}
                        >
                          Rejeitar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('evangeliza_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('evangeliza_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('evangeliza_user');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'acompanhante' ? '/acompanhante' : '/evangelista'} /> : <Login onLogin={handleLogin} />} 
        />

        <Route 
          path="/register" 
          element={user ? <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'acompanhante' ? '/acompanhante' : '/evangelista'} /> : <Register />} 
        />
        
        <Route 
          path="/evangelista" 
          element={
            user?.role === 'evangelista' ? (
              <Layout user={user} onLogout={handleLogout}><EvangelistaDashboard user={user} /></Layout>
            ) : <Navigate to="/login" />
          } 
        />
        
        <Route 
          path="/evangelista/novo" 
          element={
            user?.role === 'evangelista' ? (
              <Layout user={user} onLogout={handleLogout}><NovoRegistro user={user} /></Layout>
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/acompanhante" 
          element={
            user?.role === 'acompanhante' ? (
              <Layout user={user} onLogout={handleLogout}><AcompanhanteDashboard user={user} /></Layout>
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/acompanhante/disponiveis" 
          element={
            user?.role === 'acompanhante' ? (
              <Layout user={user} onLogout={handleLogout}><AcompanhanteDashboard user={user} showAvailableOnly /></Layout>
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/admin" 
          element={
            user?.role === 'admin' ? (
              <Layout user={user} onLogout={handleLogout}><AdminDashboard /></Layout>
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/admin/list" 
          element={
            user?.role === 'admin' ? (
              <Layout user={user} onLogout={handleLogout}><AdminList /></Layout>
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/admin/users" 
          element={
            user?.role === 'admin' ? (
              <Layout user={user} onLogout={handleLogout}><AdminUserManagement /></Layout>
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/" 
          element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : user.role === 'acompanhante' ? '/acompanhante' : '/evangelista') : '/login'} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
