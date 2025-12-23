import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants';

// Inicializa a conexão com o Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 1. AUTENTICAÇÃO E PERMISSÕES
// ==========================================

export const loginManual = async (email: string, senha: string) => {
  // 1. Busca Login na tabela de usuários
  const { data: userData, error: userError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .eq('senha', senha)
    .single();

  if (userError || !userData) return null;

  // 2. Busca dados extras do vendedor (status)
  const { data: vendedorData, error: vendedorError } = await supabase
    .from('vendedores')
    .select('status_autorizacao')
    .eq('usuario_id', userData.id)
    .single();

  // Regra de Segurança:
  // Se NÃO for Administrador, exige que tenha perfil de vendedor APROVADO.
  if (userData.cargo !== 'Administrador') {
    if (vendedorError || !vendedorData) {
       throw new Error("Usuário sem perfil de vendedor configurado.");
    }
    if (vendedorData.status_autorizacao === 2) {
      throw new Error("Cadastro em análise. Aguarde aprovação do administrador.");
    }
  }

  return userData;
};

export const registerManual = async (nome: string, email: string, senha: string) => {
  // Verifica se já existe
  const { data: existingUser } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single();

  let userId = existingUser?.id;

  // Se não existe, cria (Padrão: Vendedor)
  if (!userId) {
    const { data: newUser, error: createError } = await supabase
      .from('usuarios')
      .insert([{ nome, email, senha, cargo: 'Vendedor' }])
      .select()
      .single();

    if (createError) throw createError;
    userId = newUser.id;
  }

  // Verifica vínculo na tabela vendedores
  const { data: existingSeller } = await supabase
    .from('vendedores')
    .select('id')
    .eq('usuario_id', userId)
    .single();

  if (existingSeller) {
    throw new Error("Este email já possui um cadastro de vendedor.");
  }

  // Cria vínculo pendente
  const { error: sellerError } = await supabase
    .from('vendedores')
    .insert([{ 
      nome: nome, 
      email: email, 
      usuario_id: userId, 
      status_autorizacao: 2, // 2 = Pendente 
      total_vendas: 0 
    }]);

  if (sellerError) throw sellerError;

  return { id: userId, email };
};

// ==========================================
// 2. RANKING E DASHBOARD
// ==========================================

export const getRanking = async () => {
  // Busca apenas vendedores ativos
  const { data: vendedores, error } = await supabase
    .from('vendedores')
    .select('id, nome, usuario_id')
    .eq('status_autorizacao', 1);

  if (error) throw error;

  // Calcula totais
  const rankingCalculado = await Promise.all(vendedores.map(async (vendedor) => {
    const { data: vendas } = await supabase
      .from('vendas')
      .select('valor_negociado')
      .eq('usuario_id', vendedor.usuario_id);

    const totalVendas = vendas?.reduce((acc, curr) => acc + Number(curr.valor_negociado), 0) || 0;
    
    return {
      id: vendedor.id,
      nome: vendedor.nome,
      total_vendas: totalVendas,
      contratos_fechados: vendas?.length || 0
    };
  }));

  // Ordena do maior para o menor
  rankingCalculado.sort((a, b) => {
    if (b.total_vendas !== a.total_vendas) return b.total_vendas - a.total_vendas;
    return a.nome.localeCompare(b.nome);
  });

  return rankingCalculado;
};

export const getDashboardMetrics = async (usuarioId: string, userCargo: string = 'Vendedor') => {
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString();

  // Reutiliza a lógica de permissão de vendas
  const vendas = await getSales(usuarioId, userCargo);

  const saldoTotal = vendas?.reduce((acc: number, curr: any) => acc + Number(curr.valor_negociado), 0) || 0;
  
  const vendasMes = vendas
    ?.filter((v: any) => v.data_venda >= primeiroDiaMes)
    .reduce((acc: number, curr: any) => acc + Number(curr.valor_negociado), 0) || 0;
  
  return { 
    saldoTotal, 
    vendasMes, 
    comissao: saldoTotal * 0.10, 
    recentes: vendas?.slice(0, 5) || [] 
  };
};

// ==========================================
// 3. LEITURA DE DADOS (GET) - Com Permissões
// ==========================================

// Busca Lista de Vendedores (Apenas Admin usa isso nos filtros)
export const getSellersList = async () => {
  const { data } = await supabase
    .from('vendedores')
    .select('*')
    .eq('status_autorizacao', 1);
  return data || [];
};

export const getClients = async (usuarioId: string, userCargo: string = 'Vendedor') => {
  let query = supabase
    .from('clientes')
    .select('*, vendedores(nome)') // Traz o nome do dono
    .order('created_at', { ascending: false });

  // Se não for Admin, filtra pelo usuário
  if (userCargo !== 'Administrador') {
    query = query.eq('usuario_id', usuarioId);
  }
    
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getProducts = async () => {
  const { data, error } = await supabase.from('produtos').select('*');
  if (error) throw error;
  return data;
};

export const getSales = async (usuarioId: string, userCargo: string = 'Vendedor') => {
  let query = supabase
    .from('vendas')
    .select(`
      *,
      produtos (nome),
      clientes (nome_empresa),
      vendedores (nome)
    `)
    .order('data_venda', { ascending: false });

  // Se não for Admin, filtra pelo usuário
  if (userCargo !== 'Administrador') {
    query = query.eq('usuario_id', usuarioId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Lógica complexa de visualização de Ideias/Solicitações
export const getIdeas = async (usuarioId: string, userCargo: string = 'Vendedor') => {
  const { data, error } = await supabase
    .from('ideias')
    .select(`*, vendedores:usuario_id(nome)`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Filtragem no JavaScript (Front-end Logic applied on data fetch)
  const filteredData = data.filter((item: any) => {
    // 1. Admin vê tudo
    if (userCargo === 'Administrador') return true;
    
    // 2. Vendedor vê o que é dele
    if (item.usuario_id === usuarioId) return true;
    
    // 3. Vendedor vê itens de outros APENAS SE:
    //    - Não for privado
    //    - E Não for uma "Venda de Projeto" (vendas são sigilosas)
    if (!item.privado && item.tipo !== 'Venda de Projeto') return true;

    return false;
  });

  return filteredData;
};

// ==========================================
// 4. ESCRITA DE DADOS (POST/UPDATE)
// ==========================================

export const createSale = async (venda: any) => {
  const { numero_contrato, ...dadosVenda } = venda;
  const { data, error } = await supabase.from('vendas').insert([dadosVenda]).select().single();
  if (error) throw error;
  return data;
};

export const updateSale = async (id: string, updates: any) => {
  const { numero_contrato, ...dadosUpdate } = updates;
  const { data, error } = await supabase.from('vendas').update(dadosUpdate).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const updateClient = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('clientes').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

// Envia Ideia/Venda (Objeto completo)
export const sendIdea = async (dados: any) => {
  const { error } = await supabase
    .from('ideias')
    .insert([dados]);
    
  if (error) throw error;
  return true;
};

// Atualiza Ideia (Para Admins mudarem status/prioridade)
export const updateIdea = async (id: string, updates: any) => {
  const { error } = await supabase
    .from('ideias')
    .update(updates)
    .eq('id', id);
    
  if (error) throw error;
  return true;
};