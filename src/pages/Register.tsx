import { useState } from 'react';
import { registerManual } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

export const Register = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newUser = await registerManual(name, email, password);
      if (newUser) {
        login(newUser);
        alert('Usuário cadastrado com sucesso!');
      }
    } catch (err: any) {
      alert('Erro ao cadastrar: Verifique a API Key ou se o email já existe.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-100 w-full max-w-md border border-slate-100 relative">
        <button onClick={onSwitchToLogin} className="absolute top-8 left-8 text-slate-400 hover:text-slate-600">
          <ArrowLeft size={24} />
        </button>
        
        <div className="text-center mb-8 mt-4">
          <h1 className="text-2xl font-bold text-slate-800">Criar Conta (Teste)</h1>
          <p className="text-slate-500">Os dados serão salvos na tabela 'usuarios'</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nome</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : 'Cadastrar Usuário'}
          </button>
        </form>
      </div>
    </div>
  );
};