import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendIdea, getIdeas, updateIdea } from '../services/api';
import { 
  Lightbulb, ShoppingBag, Send, Loader2, AlertCircle, 
  Calendar, User, DollarSign, Lock, Unlock, List, Pencil, X, CheckCircle
} from 'lucide-react';

export const Ideas = () => {
  const { user } = useAuth();
  
  const [viewMode, setViewMode] = useState<'form' | 'list'>('form');
  const [activeType, setActiveType] = useState<'venda' | 'sugestao'>('venda');
  const [filterMode, setFilterMode] = useState<'todos' | 'meus'>('todos');
  
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: '', nome_cliente: '', valor: '', descricao: '', especificacoes: '',
    motivo: '', objetivo: '', prazo: '', prioridade: 'Média', privado: false, status: 'Pendente'
  });

  useEffect(() => { if (viewMode === 'list') loadIdeas(); }, [viewMode, user]);

  const loadIdeas = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getIdeas(user.id, user.cargo);
      setIdeas(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filteredIdeas = ideas.filter(idea => filterMode === 'meus' ? idea.usuario_id === user?.id : true);

  const formatCurrency = (v: string) => {
    const num = v.replace(/\D/g, '');
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(num) / 100);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'valor' ? formatCurrency(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const valorNumerico = formData.valor ? parseFloat(formData.valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) : 0;
      const isPrivado = activeType === 'venda' ? true : formData.privado;
      const payload = { ...formData, valor_projeto: valorNumerico, privado: isPrivado, tipo: activeType === 'venda' ? 'Venda de Projeto' : 'Ideia/Sugestão' };
      
      if (isEditModalOpen && currentIdeaId) {
        await updateIdea(currentIdeaId, payload);
        alert("Atualizado!");
        setIsEditModalOpen(false);
        loadIdeas();
      } else {
        await sendIdea({ ...payload, usuario_id: user?.id });
        alert("Enviado!");
        setViewMode('list');
      }
      setFormData({ titulo: '', nome_cliente: '', valor: '', descricao: '', especificacoes: '', motivo: '', objetivo: '', prazo: '', prioridade: 'Média', privado: false, status: 'Pendente' });
      setCurrentIdeaId(null);
    } catch (error) { alert("Erro ao salvar."); } finally { setLoading(false); }
  };

  const handleEdit = (idea: any) => {
    setCurrentIdeaId(idea.id);
    setActiveType(idea.tipo === 'Venda de Projeto' ? 'venda' : 'sugestao');
    setFormData({ ...idea, valor: idea.valor_projeto ? formatCurrency(idea.valor_projeto.toString()) : '' });
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-5xl mx-auto pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Central de Solicitações</h1>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
          <button onClick={() => setViewMode('form')} className={`px-4 py-2 rounded-lg text-sm font-bold flex gap-2 ${viewMode === 'form' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}><Send size={16}/> Nova</button>
          <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-sm font-bold flex gap-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}><List size={16}/> Mural</button>
        </div>
      </div>

      {viewMode === 'form' && !isEditModalOpen && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button onClick={() => setActiveType('venda')} className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${activeType === 'venda' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}><ShoppingBag size={20}/> Venda</button>
            <button onClick={() => setActiveType('sugestao')} className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${activeType === 'sugestao' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}><Lightbulb size={20}/> Ideia</button>
          </div>
          {/* Componente de Formulário Extraído */}
          <IdeaForm activeType={activeType} formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} handleSubmit={handleSubmit} loading={loading} />
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex justify-end"><button onClick={() => setFilterMode(filterMode === 'todos' ? 'meus' : 'todos')} className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{filterMode === 'todos' ? 'Ver só minhas' : 'Ver todas'}</button></div>
          {loading ? <Loader2 className="animate-spin mx-auto"/> : filteredIdeas.map(idea => (
            <div key={idea.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative">
              {(user?.cargo === 'Administrador' || user?.id === idea.usuario_id) && <button onClick={() => handleEdit(idea)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-lg hover:text-blue-600"><Pencil size={16}/></button>}
              <div className="flex gap-2 mb-2"><span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">{idea.tipo}</span>{idea.privado && <span className="text-xs font-bold px-2 py-1 rounded bg-red-50 text-red-600 flex items-center gap-1"><Lock size={10}/> Privado</span>}</div>
              <h3 className="font-bold text-lg">{idea.titulo}</h3>
              <p className="text-slate-500 text-sm mt-1">{idea.descricao || idea.especificacoes}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${idea.status === 'Pendente' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{idea.status}</span>
                {idea.valor_projeto > 0 && <span className="font-bold text-slate-700">R$ {new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 2}).format(idea.valor_projeto)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Editar</h2><button onClick={() => setIsEditModalOpen(false)}><X/></button></div>
            <IdeaForm activeType={activeType} formData={formData} handleInputChange={handleInputChange} setFormData={setFormData} handleSubmit={handleSubmit} loading={loading} isAdmin={user?.cargo === 'Administrador'} isEditing={true}/>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de Formulário para limpar o código principal
const IdeaForm = ({ activeType, formData, handleInputChange, setFormData, handleSubmit, loading, isAdmin, isEditing }: any) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    {isEditing && isAdmin && (
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl">
        <div><label className="text-xs font-bold text-slate-500">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 rounded border"><option>Pendente</option><option>Aprovado</option><option>Concluído</option></select></div>
        <div><label className="text-xs font-bold text-slate-500">Prioridade</label><select name="prioridade" value={formData.prioridade} onChange={handleInputChange} className="w-full p-2 rounded border"><option>Baixa</option><option>Média</option><option>Alta</option></select></div>
      </div>
    )}
    {activeType === 'venda' ? (
      <>
        {/* Aqui usamos AlertCircle, Calendar, User, DollarSign para não dar erro de unused */}
        {!isEditing && <div className="bg-blue-50 p-3 rounded-xl flex gap-2 text-blue-800 text-sm"><AlertCircle size={18}/><span>Registro privado.</span></div>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="text-sm font-bold">Projeto</label><input name="titulo" value={formData.titulo} onChange={handleInputChange} className="w-full p-3 border rounded-xl" required /></div>
          <div><label className="text-sm font-bold">Cliente</label><div className="relative"><User size={16} className="absolute left-3 top-3.5 text-slate-400"/><input name="nome_cliente" value={formData.nome_cliente} onChange={handleInputChange} className="w-full pl-9 p-3 border rounded-xl" required /></div></div>
          <div><label className="text-sm font-bold">Prazo</label><div className="relative"><Calendar size={16} className="absolute left-3 top-3.5 text-slate-400"/><input type="date" name="prazo" value={formData.prazo} onChange={handleInputChange} className="w-full pl-9 p-3 border rounded-xl" /></div></div>
          <div><label className="text-sm font-bold">Valor</label><div className="relative"><DollarSign size={16} className="absolute left-3 top-3.5 text-slate-400"/><input name="valor" value={formData.valor} onChange={handleInputChange} className="w-full pl-9 p-3 border rounded-xl" /></div></div>
        </div>
        <div><label className="text-sm font-bold">Especificações</label><textarea name="especificacoes" value={formData.especificacoes} onChange={handleInputChange} rows={5} className="w-full p-3 border rounded-xl" required /></div>
      </>
    ) : (
      <>
        <input name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título da Ideia" className="w-full p-3 border rounded-xl font-bold" required />
        <textarea name="descricao" value={formData.descricao} onChange={handleInputChange} placeholder="Descrição detalhada..." rows={3} className="w-full p-3 border rounded-xl" required />
        <div className="grid grid-cols-2 gap-4">
          <textarea name="motivo" value={formData.motivo} onChange={handleInputChange} placeholder="Motivo/Problema" rows={2} className="w-full p-3 border rounded-xl" />
          <textarea name="objetivo" value={formData.objetivo} onChange={handleInputChange} placeholder="Objetivo/Ganho" rows={2} className="w-full p-3 border rounded-xl" />
        </div>
        <button type="button" onClick={() => setFormData((p:any) => ({...p, privado: !p.privado}))} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold ${formData.privado ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>{formData.privado ? <><Lock size={16}/> Privado</> : <><Unlock size={16}/> Público</>}</button>
      </>
    )}
    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2">{loading ? <Loader2 className="animate-spin"/> : (isEditing ? <><CheckCircle size={20}/> Salvar</> : <><Send size={20}/> Enviar</>)}</button>
  </form>
);