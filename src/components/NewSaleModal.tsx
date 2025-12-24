import { useEffect, useState } from 'react';
import { X, Loader2, CheckCircle, DollarSign } from 'lucide-react';
import { getClients, getProducts, createSale } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewSaleModal = ({ isOpen, onClose, onSuccess }: NewSaleModalProps) => {
  const { user } = useAuth();
  
  // Dados para os Selects
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  // Dados do Formulário
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [value, setValue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  
  // Estados de Loading
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const [clientsData, productsData] = await Promise.all([
            // CORREÇÃO: Passando o ID e o Cargo do usuário para filtrar os clientes corretamente
            getClients(user.id, user.cargo || 'Vendedor'),
            getProducts()
          ]);
          setClients(clientsData || []);
          setProducts(productsData || []);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [isOpen, user]);

  // Ao selecionar um produto, sugere o preço automaticamente
  useEffect(() => {
    const prod = products.find(p => p.id === selectedProduct);
    if (prod) {
      setValue(prod.preco_mensal?.toString() || '');
    }
  }, [selectedProduct, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !selectedProduct || !value) return;

    setSubmitting(true);
    try {
      await createSale({
        usuario_id: user?.id,
        cliente_id: selectedClient,
        produto_id: selectedProduct,
        valor_negociado: parseFloat(value),
        forma_pagamento: paymentMethod,
        data_venda: new Date().toISOString(),
        status: 'Aprovado'
      });

      onSuccess(); 
      onClose();   
      
      // Limpa formulário
      setSelectedClient('');
      setSelectedProduct('');
      setValue('');
      setPaymentMethod('PIX');
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar venda.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="bg-white/20 p-1 rounded-lg box-content" size={20} />
            Nova Venda
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {loadingData ? (
            <div className="py-10 text-center text-slate-400 flex flex-col items-center gap-2">
              <Loader2 className="animate-spin" /> Carregando dados...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                <select 
                  required
                  value={selectedClient}
                  onChange={e => setSelectedClient(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Selecione quem comprou...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.nome_empresa}</option>
                  ))}
                </select>
                {clients.length === 0 && <p className="text-xs text-red-500 mt-1">Nenhum cliente encontrado. Cadastre um na aba Clientes.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Produto / Serviço</label>
                <select 
                  required
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">O que foi vendido?</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pagamento</label>
                  <select 
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option>PIX</option>
                    <option>Cartão Crédito</option>
                    <option>Boleto</option>
                    <option>Dinheiro</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <> <CheckCircle size={20} /> Registrar Venda </>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};