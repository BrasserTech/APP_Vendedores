import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getClients, getProducts, getSales, createSale, updateSale, getSellersList } from '../services/api';
import { Plus, Loader2, X, CheckCircle, Pencil, DollarSign, Search, ChevronDown, AlertTriangle, Filter, User } from 'lucide-react';

interface SearchableInputProps {
  label: string;
  options: any[];
  valueId: string;
  valueText: string;
  onChange: (id: string, text: string) => void;
  onNext?: () => void;
  // Permite que o ref comece nulo
  inputRef?: React.RefObject<HTMLInputElement | null>; 
  placeholder: string;
  showWarning?: boolean;
}

const SearchableInput = ({ 
  label, options, valueId, valueText, onChange, onNext, inputRef, placeholder, showWarning 
}: SearchableInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setFilter(valueText); }, [valueText]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options
    .filter(opt => {
      const text = opt.nome_empresa || opt.nome || '';
      return text.toLowerCase().includes(filter.toLowerCase());
    })
    .slice(0, 5);

  const handleSelect = (id: string, text: string) => {
    onChange(id, text);
    setFilter(text);
    setIsOpen(false);
    if (onNext) onNext();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setFilter(text);
    onChange('', text);
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <input
          // Correção de tipagem aqui com 'as' para satisfazer o TypeScript
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          placeholder={placeholder}
          value={filter}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
        <ChevronDown className={`absolute right-3 top-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </div>

      {showWarning && filter && !valueId && (
        <div className="text-xs text-orange-600 mt-1 flex items-center gap-1 font-medium animate-in fade-in">
          <AlertTriangle size={12} /> Cliente não selecionado ou não cadastrado.
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in zoom-in-95 duration-100">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id, opt.nome_empresa || opt.nome)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 text-sm text-slate-700"
              >
                {opt.nome_empresa || opt.nome}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-400 italic">Nenhum resultado.</div>
          )}
        </div>
      )}
    </div>
  );
};

export const Sales = () => {
  const { user } = useAuth();
  
  const [sales, setSales] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [selectedSeller, setSelectedSeller] = useState(''); 

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSaleId, setCurrentSaleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs com valor inicial null
  const productInputRef = useRef<HTMLInputElement>(null);
  const valueInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    cliente_id: '', cliente_text: '',
    produto_id: '', produto_text: '',
    valor: '', pagamento: 'PIX',
    data: new Date().toISOString().split('T')[0]
  });

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Fallback seguro se cargo não existir
      const userCargo = user.cargo || 'Vendedor';
      
      const [salesData, clientsData, productsData] = await Promise.all([
        getSales(user.id, userCargo),
        getClients(user.id, userCargo), 
        getProducts()
      ]);
      setSales(salesData || []);
      setClients(clientsData || []);
      setProducts(productsData || []);

      if (userCargo === 'Administrador') {
        const sellersData = await getSellersList();
        setSellers(sellersData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const filteredSales = sales.filter(sale => {
    const matchesSeller = selectedSeller ? sale.usuario_id === selectedSeller : true;
    return matchesSeller;
  });

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const amount = Number(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, valor: formatCurrency(e.target.value) }));
  };

  useEffect(() => {
    if (!isEditing && formData.produto_id) {
      const prod = products.find(p => p.id === formData.produto_id);
      if (prod && prod.preco_mensal) {
        setFormData(prev => ({ 
          ...prev, 
          valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.preco_mensal)
        }));
      }
    }
  }, [formData.produto_id]);

  const handleNewSale = () => {
    setIsEditing(false);
    setCurrentSaleId(null);
    setFormData({ 
      cliente_id: '', cliente_text: '', 
      produto_id: '', produto_text: '', 
      valor: '', pagamento: 'PIX', 
      data: new Date().toISOString().split('T')[0] 
    });
    setIsModalOpen(true);
  };

  const handleEditSale = (sale: any) => {
    setIsEditing(true);
    setCurrentSaleId(sale.id);
    setFormData({
      cliente_id: sale.cliente_id,
      cliente_text: sale.clientes?.nome_empresa || '',
      produto_id: sale.produto_id,
      produto_text: sale.produtos?.nome || '',
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valor_negociado),
      pagamento: sale.forma_pagamento,
      data: sale.data_venda.split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valorNumerico = parseFloat(formData.valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());

    if (!formData.cliente_id) return alert("Selecione um cliente válido.");
    if (!formData.produto_id) return alert("Selecione um produto válido.");
    if (!user?.id) return alert("Erro de sessão.");

    setIsSubmitting(true);
    try {
      const payload = {
        usuario_id: user.id,
        cliente_id: formData.cliente_id,
        produto_id: formData.produto_id,
        valor_negociado: valorNumerico,
        forma_pagamento: formData.pagamento,
        data_venda: formData.data,
        status: 'Aprovado'
      };

      if (isEditing && currentSaleId) {
        await updateSale(currentSaleId, payload);
        alert('Venda atualizada!');
      } else {
        await createSale(payload);
        alert('Venda registrada!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-6xl mx-auto pb-24 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Minhas Vendas</h1>
          <p className="text-slate-500">Gerencie seus negócios</p>
        </div>
        <button onClick={handleNewSale} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium shadow-lg flex items-center gap-2">
          <Plus size={20} /> Nova Venda
        </button>
      </div>

      {/* Filtro de Vendedor (Admin) */}
      {/* Proteção user?.cargo */}
      {user?.cargo === 'Administrador' && (
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
          <div className="relative min-w-[250px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm appearance-none focus:ring-2 focus:ring-blue-100"
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
            >
              <option value="">Todas as Vendas</option>
              {sellers.map(s => <option key={s.usuario_id} value={s.usuario_id}>{s.nome}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-slate-400"><Loader2 className="animate-spin inline mr-2"/> Carregando...</div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">Nenhuma venda encontrada.</div>
        ) : (
          filteredSales.map((sale) => (
            <div key={sale.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl font-bold"><DollarSign size={24} /></div>
                <div>
                  <h3 className="font-bold text-slate-800">{sale.clientes?.nome_empresa}</h3>
                  <p className="text-sm text-slate-500">{sale.produtos?.nome}</p>
                  
                  {/* Admin vê quem vendeu */}
                  {user?.cargo === 'Administrador' && sale.vendedores && (
                    <div className="flex items-center gap-1 text-xs text-purple-600 font-bold mt-1 bg-purple-50 px-2 py-0.5 rounded w-fit">
                      <User size={10} /> {sale.vendedores.nome}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block font-bold text-slate-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valor_negociado)}</span>
                  <span className="text-xs text-slate-400">{new Date(sale.data_venda).toLocaleDateString()}</span>
                </div>
                {/* Só edita se for venda própria ou Admin */}
                {(user?.cargo === 'Administrador' || sale.usuario_id === user?.id) && (
                  <button onClick={() => handleEditSale(sale)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Pencil size={18} /></button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Editar Venda' : 'Nova Venda'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400 hover:text-red-500 transition-colors" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <SearchableInput 
                label="Cliente"
                placeholder="Busque o cliente..."
                options={clients}
                valueId={formData.cliente_id}
                valueText={formData.cliente_text}
                onChange={(id, text) => setFormData(prev => ({...prev, cliente_id: id, cliente_text: text}))}
                onNext={() => productInputRef.current?.focus()} 
                showWarning={true}
              />

              <SearchableInput 
                label="Produto"
                placeholder="Busque o produto..."
                options={products}
                valueId={formData.produto_id}
                valueText={formData.produto_text}
                inputRef={productInputRef} 
                onChange={(id, text) => setFormData(prev => ({...prev, produto_id: id, produto_text: text}))}
                onNext={() => valueInputRef.current?.focus()} 
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Valor</label>
                  <input 
                    ref={valueInputRef} 
                    type="text" 
                    required 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700"
                    placeholder="R$ 0,00"
                    value={formData.valor}
                    onChange={handleValueChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                    value={formData.data}
                    onChange={e => setFormData({...formData, data: e.target.value})} 
                  />
                </div>
              </div>

              <button disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold py-4 rounded-xl mt-4 flex justify-center items-center gap-2 shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20} /> Salvar Venda</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};