
import React, { useState } from 'react';
import { Partner, Institution, Transaction } from '../types';
import { 
  Users, 
  Link as LinkIcon, 
  DollarSign, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  UserPlus, 
  TrendingUp, 
  Zap,
  Info,
  X,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface PartnerManagerProps {
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  institution: Institution;
  transactions: Transaction[];
}

const PartnerManager: React.FC<PartnerManagerProps> = ({ partners, setPartners, institution, transactions }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    name: '',
    email: '',
    phone: '',
    pixKey: '',
    referralCode: ''
  });

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.referralCode) return;
    
    const partnerToAdd: Partner = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPartner.name!,
      email: newPartner.email || '',
      phone: newPartner.phone || '',
      pixKey: newPartner.pixKey || '',
      referralCode: newPartner.referralCode!.toLowerCase().replace(/\s/g, '-'),
      commissionEarned: 0,
      totalSalesCount: 0,
      status: 'Ativo'
    };

    setPartners(prev => [...prev, partnerToAdd]);
    setShowAddModal(false);
    setNewPartner({ name: '', email: '', phone: '', pixKey: '', referralCode: '' });
  };

  const copyAffiliateLink = (code: string, id: string) => {
    // Simulação do link de venda do PRO
    const link = `${window.location.origin}/upgrade?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalCommissions = partners.reduce((acc, p) => acc + p.commissionEarned, 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Premium para Parceiros */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-2xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <div className="p-4 bg-indigo-500 rounded-3xl shadow-xl shadow-indigo-500/20">
                <Users size={32} className="text-white" />
              </div>
              <h2 className="text-4xl font-black tracking-tight">Rede de Afiliados</h2>
            </div>
            <p className="text-indigo-100/70 text-lg leading-relaxed font-medium">
              Transforme seus parceiros em promotores do seu bazar. Gere links exclusivos para a venda da versão <span className="text-amber-400 font-black">PRO</span> e divida <span className="text-emerald-400 font-black">{institution.commissionRate || 30}%</span> do valor automaticamente.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-center min-w-[280px] shadow-2xl">
            <p className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Total em Comissões</p>
            <p className="text-5xl font-black text-white">R$ {totalCommissions.toFixed(2)}</p>
            <div className="mt-6 flex items-center gap-2 justify-center px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
               <Zap size={14} className="text-emerald-400" />
               <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Split Ativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Afiliados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {partners.map(partner => (
          <div key={partner.id} className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
            <div className="p-10 flex-1">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-950 text-amber-500 rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-lg">
                    {partner.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-xl leading-tight">{partner.name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                      <ShieldCheck size={12} className="text-indigo-500" /> Parceiro Verificado
                    </span>
                  </div>
                </div>
                <button onClick={() => setPartners(prev => prev.filter(p => p.id !== partner.id))} className="p-2 text-slate-200 hover:text-rose-500 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vendas PRO</p>
                  <p className="text-2xl font-black text-slate-900">{partner.totalSalesCount}</p>
                </div>
                <div className="bg-indigo-50 p-5 rounded-[2rem] border border-indigo-100">
                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Comissão</p>
                  <p className="text-2xl font-black text-indigo-600">R$ {partner.commissionEarned.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <div className="flex items-center gap-2 mb-2">
                     <CreditCard size={14} className="text-slate-400" />
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dados de Repasse (Pix)</p>
                   </div>
                   <p className="text-xs font-bold text-slate-700 truncate">{partner.pixKey || 'Chave não cadastrada'}</p>
                </div>

                <button 
                  onClick={() => copyAffiliateLink(partner.referralCode, partner.id)}
                  className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg ${
                    copiedId === partner.id 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-slate-900 text-amber-500 hover:bg-black shadow-slate-900/20'
                  }`}
                >
                  {copiedId === partner.id ? <Check size={18} /> : <LinkIcon size={18} />}
                  {copiedId === partner.id ? 'Copiado!' : 'Link de Venda PRO'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Botão Adicionar Parceiro */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="border-4 border-dashed border-slate-200 rounded-[3rem] p-10 flex flex-col items-center justify-center text-slate-300 hover:border-indigo-400 hover:text-indigo-500 transition-all group min-h-[400px]"
        >
          <div className="p-6 bg-slate-50 rounded-[2rem] mb-6 group-hover:bg-indigo-50 transition-all">
            <UserPlus size={48} />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">Novo Afiliado</span>
        </button>
      </div>

      {/* Seção Explicativa Split */}
      <div className="bg-indigo-50 p-10 rounded-[3.5rem] border border-indigo-100 flex flex-col md:flex-row gap-10 items-center">
        <div className="p-6 bg-white rounded-[2rem] shadow-xl text-indigo-600 shrink-0">
          <Zap size={48} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-2xl font-black text-indigo-950 mb-3">Automatização Mercado Pago</h4>
          <p className="text-indigo-800/70 text-lg font-medium leading-relaxed">
            Para que seus parceiros recebam instantaneamente na conta Mercado Pago deles, ative o <b>Split de Pagamentos</b> nas configurações. O ADMbazzar enviará 30% da venda diretamente para a carteira digital do parceiro no momento da aprovação do pagamento.
          </p>
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
              Configurar Split <ExternalLink size={14} />
            </button>
            <button className="px-8 py-4 bg-white border border-indigo-200 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2">
              Tutorial Passo a Passo <Info size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Novo Parceiro */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-2xl border border-slate-100 animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <div className="flex items-center gap-4">
                <UserPlus size={24} />
                <h3 className="font-black uppercase tracking-widest text-sm">Novo Parceiro PRO</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={28} /></button>
            </div>
            
            <div className="p-10 space-y-8">
              <label className="block space-y-3">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo / Canal</span>
                <input 
                  type="text" 
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                  placeholder="Ex: Pedro Influencer"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                />
              </label>

              <div className="grid grid-cols-2 gap-6">
                <label className="block space-y-3">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Cód. Referência</span>
                  <input 
                    type="text" 
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                    placeholder="pedro-30"
                    value={newPartner.referralCode}
                    onChange={(e) => setNewPartner({...newPartner, referralCode: e.target.value})}
                  />
                </label>
                <label className="block space-y-3">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Chave PIX</span>
                  <input 
                    type="text" 
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                    placeholder="CPF ou Celular"
                    value={newPartner.pixKey}
                    onChange={(e) => setNewPartner({...newPartner, pixKey: e.target.value})}
                  />
                </label>
              </div>

              <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
                <Info size={24} className="text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                  Ao criar este código, um link de venda será gerado. Todas as assinaturas PRO vindas deste link darão 30% de comissão recorrente ao parceiro.
                </p>
              </div>

              <button 
                onClick={handleAddPartner}
                className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl shadow-slate-900/20"
              >
                Ativar Novo Afiliado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerManager;
