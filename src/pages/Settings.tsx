import { User, Bell, Shield, LogOut } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="p-6 md:p-8 w-full max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
        <p className="text-slate-500">Gerencie sua conta e preferências.</p>
      </div>

      {/* Card de Perfil */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold border-4 border-white shadow-sm">
          US
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Usuário Silva</h2>
          <p className="text-slate-500">usuario@bluecontrol.com</p>
          <button className="text-blue-600 text-sm font-medium mt-1 hover:underline">Alterar foto</button>
        </div>
      </div>

      {/* Formulário Geral */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <User size={20} className="text-blue-600" />
          <h3 className="font-bold text-slate-800">Dados Pessoais</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nome Completo</label>
            <input type="text" defaultValue="Usuário Silva" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input type="email" defaultValue="usuario@bluecontrol.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Telefone</label>
            <input type="tel" defaultValue="(11) 99999-0000" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* Preferências (Toggles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-800">Notificações</h3>
          </div>
          <div className="space-y-4">
            {['Alertas de saldo baixo', 'Resumo semanal por email', 'Novas funcionalidades'].map((item) => (
              <div key={item} className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">{item}</span>
                <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-800">Segurança</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left text-slate-600 hover:text-blue-600 text-sm font-medium py-2 transition-colors">Alterar Senha</button>
            <button className="w-full text-left text-slate-600 hover:text-blue-600 text-sm font-medium py-2 transition-colors">Dispositivos Conectados</button>
            <button className="w-full text-left text-red-500 hover:text-red-600 text-sm font-medium py-2 transition-colors flex items-center gap-2">
              <LogOut size={16} /> Encerrar Sessão em Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};