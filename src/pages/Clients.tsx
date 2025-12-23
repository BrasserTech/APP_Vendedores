import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, getProducts, getClients, updateClient, getSellersList } from '../services/api';
import { 
  UserPlus, Search, Building2, Loader2, MapPin, Phone, FileText,
  X, CheckCircle, User, Pencil, Ban, Archive, AlertTriangle, Filter
} from 'lucide-react';

interface Cliente {
  id: string;
  nome_empresa: string;
  documento: string;
  telefone: string;
  cidade: string;
  estado: string;
  endereco: string;
  modulo: string;
  status: string;
  tipo_pessoa: 'PF' | 'PJ';
  sem_vendedor: number;
  motivo_inativacao?: string;
  usuario_id: string;
  vendedores?: { nome: string };
}

interface Produto {
  id: string;
  nome: string;
}

export const Clients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [products, setProducts] = useState<Produto[]>([]);
  const [sellers, setSellers] = useState<any[]>([]); 
  const [selectedSeller, setSelectedSeller] = useState(''); 
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeTab, setActiveTab] = useState<'ativos' | 'inativos'>('ativos');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isInactivateModalOpen, setIsInactivateModalOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clientToInactivate, setClientToInactivate] = useState<Cliente | null>(null);
  const [inactivationReason, setInactivationReason] = useState('');
  
  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>('PJ');
  const [formData, setFormData] = useState({
    nome: '', documento: '', telefone: '', cidade: '', 
    estado: '', endereco: '', modulo: ''
  });

  const maskCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  const maskCNPJ = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  const maskPhone = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');

  const loadData = async () => {
    // Proteção se usuário for nulo
    if (!user) return;
    try {
      setLoading(true);
      // Pega cargo com segurança
      const userCargo = user.cargo || 'Vendedor';
      
      const clientsData = await getClients(user.id, userCargo);
      const productsData = await getProducts();
      
      setClients(clientsData || []);
      setProducts(productsData || []);

      if (userCargo === 'Administrador') {
        const sellersData = await getSellersList();
        setSellers(sellersData || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const filteredClients = clients.filter(client => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = client.nome_empresa.toLowerCase().includes(term) || client.documento?.includes(term) || client.cidade?.toLowerCase().includes(term);
    const matchesTab = activeTab === 'ativos' ? client.status === 'Ativo' : client.status === 'Inativo';
    const matchesSeller = selectedSeller ? client.usuario_id === selectedSeller : true;
    return matchesSearch && matchesTab && matchesSeller;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'documento') finalValue = tipoPessoa === 'PF' ? maskCPF(value) : maskCNPJ(value);
    else if (name === 'telefone') finalValue = maskPhone(value);
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentClientId(null);
    setFormData({ nome: '', documento: '', telefone: '', cidade: '', estado: '', endereco: '', modulo: '' });
    setTipoPessoa('PJ');
    setIsFormModalOpen(true);
  };

  const openEditModal = (client: Cliente) => {
    setIsEditing(true);
    setCurrentClientId(client.id);
    setTipoPessoa(client.tipo_pessoa);
    setFormData({
      nome: client.nome_empresa,
      documento: client.documento || '',
      telefone: client.telefone || '',
      cidade: client.cidade || '',
      estado: client.estado || '',
      endereco: client.endereco || '',
      modulo: client.modulo || ''
    });
    setIsFormModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.documento || !formData.modulo) return alert("Preencha os campos obrigatórios (*)");
    if (!user?.id) return alert("Erro de sessão.");

    setIsSubmitting(true);
    try {
      const payload = {
        nome_empresa: formData.nome,
        documento: formData.documento,
        telefone: formData.telefone,
        cidade: formData.cidade,
        estado: formData.estado,
        endereco: formData.endereco,
        modulo: formData.modulo,
        tipo_pessoa: tipoPessoa,
        usuario_id: user.id
      };

      if (isEditing && currentClientId) {
        await updateClient(currentClientId, payload);
        alert("Cliente atualizado!");
      } else {
        const { error } = await supabase.from('clientes').insert([{ ...payload, status: 'Ativo', sem_vendedor: 0 }]);
        if(error) throw error;
        alert("Cliente cadastrado!");
      }
      setIsFormModalOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInactivateClick = (client: Cliente) => {
    setClientToInactivate(client);
    setInactivationReason('');
    setIsInactivateModalOpen(true);
  };

  const confirmInactivation = async () => {
    if (!clientToInactivate || !inactivationReason.trim()) return alert("Digite um motivo.");
    setIsSubmitting(true);
    try {
      await updateClient(clientToInactivate.id, { status: 'Inativo', motivo_inativacao: inactivationReason });
      alert("Cliente inativado.");
      setIsInactivateModalOpen(false);
      loadData();
    } catch (error) { console.error(error); alert("Erro ao inativar."); } 
    finally { setIsSubmitting(false); }
  };

  const handleReactivate = async (id: string) => {
    if(!confirm("Reativar este cliente?")) return;
    try { await updateClient(id, { status: 'Ativo', motivo_inativacao: null }); loadData(); } 
    catch(err) { console.error(err); }
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-6xl mx-auto pb-24 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Carteira de Clientes</h1>
          <p className="text-slate-500">Gerencie seus contratos ativos</p>
        </div>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-blue-200 flex items-center gap-2">
          <UserPlus size={20} /> Novo Cliente
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('ativos')} className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'ativos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Ativos</button>
          <button onClick={() => setActiveTab('inativos')} className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === 'inativos' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Inativos</button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {/* Uso de user?.cargo para evitar erro se for nulo */}
          {user?.cargo === 'Administrador' && (
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm appearance-none focus:ring-2 focus:ring-blue-100"
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
              >
                <option value="">Todos os Vendedores</option>
                {sellers.map(s => <option key={s.usuario_id} value={s.usuario_id}>{s.nome}</option>)}
              </select>
            </div>
          )}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? <div className="text-center py-10 text-slate-400"><Loader2 className="animate-spin inline mr-2"/> Carregando...</div> : filteredClients.length === 0 ? <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">{searchTerm ? 'Nenhum cliente encontrado.' : 'Nenhum cliente nesta lista.'}</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map((client) => (
              <div key={client.id} className={`p-5 rounded-2xl border shadow-sm transition-all group relative ${client.sem_vendedor === 1 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100'}`}>
                {client.sem_vendedor === 1 && <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-bl-xl rounded-tr-xl font-bold flex items-center gap-1"><AlertTriangle size={12} /> Sem Vendedor</div>}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => openEditModal(client)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600"><Pencil size={16} /></button>
                   {client.status === 'Ativo' ? <button onClick={() => handleInactivateClick(client)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600"><Ban size={16} /></button> : <button onClick={() => handleReactivate(client.id)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><CheckCircle size={16} /></button>}
                </div>
                <div className="flex justify-between items-start mb-3 pr-20">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${client.tipo_pessoa === 'PJ' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{client.tipo_pessoa === 'PJ' ? <Building2 size={20} /> : <User size={20} />}</div>
                      <div><h3 className="font-bold text-slate-800">{client.nome_empresa}</h3><p className="text-xs text-slate-400 font-mono">{client.documento}</p></div>
                    </div>
                    {user?.cargo === 'Administrador' && client.vendedores && <div className="mt-2 ml-1 text-xs text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded w-fit">Resp: {client.vendedores.nome}</div>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 mt-4 border-t border-slate-200 pt-3">
                  <div className="flex items-center gap-2"><FileText size={14} className="text-slate-400"/><span className="truncate">{client.modulo}</span></div>
                  <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/><span>{client.telefone || '-'}</span></div>
                  <div className="flex items-center gap-2 col-span-2"><MapPin size={14} className="text-slate-400"/><span className="truncate">{client.cidade}/{client.estado}</span></div>
                  {client.status === 'Inativo' && <div className="col-span-2 mt-2 p-2 bg-red-50 text-red-600 text-xs rounded-lg flex items-start gap-2"><Archive size={14} className="shrink-0 mt-0.5" /><span><strong>Motivo:</strong> {client.motivo_inativacao}</span></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isFormModalOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]"><div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4"><h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Editar' : 'Novo'} Cliente</h2><button onClick={() => setIsFormModalOpen(false)}><X className="text-slate-400 hover:text-slate-600" /></button></div><form onSubmit={handleSave} className="space-y-4"><div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-4"><button type="button" onClick={() => setTipoPessoa('PJ')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tipoPessoa === 'PJ' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Pessoa Jurídica</button><button type="button" onClick={() => setTipoPessoa('PF')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tipoPessoa === 'PF' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Pessoa Física</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="col-span-2"><label className="text-sm font-bold text-slate-700">Nome *</label><input className="w-full p-3 border rounded-xl" name="nome" value={formData.nome} onChange={handleInputChange} required /></div><div><label className="text-sm font-bold text-slate-700">{tipoPessoa === 'PJ' ? 'CNPJ' : 'CPF'} *</label><input className="w-full p-3 border rounded-xl" name="documento" value={formData.documento} onChange={handleInputChange} required /></div><div><label className="text-sm font-bold text-slate-700">Telefone</label><input className="w-full p-3 border rounded-xl" name="telefone" value={formData.telefone} onChange={handleInputChange} /></div><div><label className="text-sm font-bold text-slate-700">Cidade</label><input className="w-full p-3 border rounded-xl" name="cidade" value={formData.cidade} onChange={handleInputChange} /></div><div><label className="text-sm font-bold text-slate-700">Estado</label><input className="w-full p-3 border rounded-xl uppercase" name="estado" value={formData.estado} onChange={handleInputChange} maxLength={2} /></div><div className="col-span-2"><label className="text-sm font-bold text-slate-700">Módulo *</label><select name="modulo" className="w-full p-3 border rounded-xl" value={formData.modulo} onChange={handleInputChange} required><option value="">Selecione...</option>{products.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}</select></div><div className="col-span-2"><label className="text-sm font-bold text-slate-700">Endereço</label><input className="w-full p-3 border rounded-xl" name="endereco" value={formData.endereco} onChange={handleInputChange} /></div></div><button disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-4 flex justify-center items-center gap-2">{isSubmitting ? <Loader2 className="animate-spin"/> : <><CheckCircle size={20}/> Salvar</>}</button></form></div></div>}
      {isInactivateModalOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6"><div className="flex flex-col items-center text-center mb-6"><div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4"><Archive size={32} /></div><h2 className="text-xl font-bold text-slate-800">Inativar Cliente?</h2><p className="text-slate-500 mt-2">O cliente será movido para Inativos. Informe o motivo.</p></div><label className="block text-sm font-bold text-slate-700 mb-2">Motivo</label><textarea rows={3} className="w-full p-3 bg-slate-50 border rounded-xl mb-6 focus:ring-2 focus:ring-red-100" value={inactivationReason} onChange={e => setInactivationReason(e.target.value)} placeholder="Ex: Cancelamento..."></textarea><div className="flex gap-3"><button onClick={() => setIsInactivateModalOpen(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl">Cancelar</button><button onClick={confirmInactivation} disabled={isSubmitting} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Confirmar</button></div></div></div>}
    </div>
  );
};