
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  ShoppingCart, 
  Users, 
  ArrowRight, 
  Package, 
  Building2, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Save, 
  XCircle, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Lock, 
  Target,
  BarChart3,
  MousePointerClick,
  UploadCloud,
  ChevronRight,
  ShieldAlert,
  Server,
  Activity,
  BarChartHorizontal,
  Eye,
  EyeOff,
  LayoutGrid,
  CreditCard,
  // Add missing Crown icon import
  Crown
} from 'lucide-react';
import { Institution } from '../types';

interface LandingPageProps {
  setInstitution: React.Dispatch<React.SetStateAction<Institution>>;
}

const LandingPage: React.FC<LandingPageProps> = ({ setInstitution }) => {
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('pro');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Institution>({
    name: '', cnpj: '', address: '', phone: '', email: '', password: '', isPro: false, commissionRate: 30, bazarName: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const importInputRef = useRef<HTMLInputElement>(null);

  const LOGO_URL = "https://i.ibb.co/hxH3NTDF/360-F-544950008_jizrelzjnj0za-U4e-Bc-Deo4-E0-I7qk-JQs-X.jpg";

  useEffect(() => {
    document.title = "ADMbazzar | Sistema de Gestão para Bazares Beneficentes e ONGs";
  }, []);

  const handleRegister = () => {
    if (!formData.name || !formData.cnpj || !formData.email || !formData.password) {
      alert("Por favor, preencha todos os campos obrigatórios para ativar seu acesso.");
      return;
    }

    if (formData.password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    if (selectedPlan === 'pro') {
      const now = new Date();
      const expiry = new Date();
      expiry.setFullYear(now.getFullYear() + 1); // 1 ano

      setInstitution({ 
        ...formData, 
        isPro: true, 
        proActivationDate: now.toISOString(),
        proExpiryDate: expiry.toISOString()
      });
    } else {
      setInstitution({ ...formData, isPro: false });
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.institution) {
          localStorage.setItem('adm_institution', JSON.stringify(data.institution));
          localStorage.setItem('adm_products', JSON.stringify(data.products || []));
          localStorage.setItem('adm_partners', JSON.stringify(data.partners || []));
          localStorage.setItem('adm_users', JSON.stringify(data.users || []));
          localStorage.setItem('adm_donations', JSON.stringify(data.donations || []));
          localStorage.setItem('adm_transactions', JSON.stringify(data.transactions || []));
          localStorage.setItem('adm_donors', JSON.stringify(data.donors || []));
          localStorage.setItem('adm_customers', JSON.stringify(data.customers || []));
          localStorage.setItem('adm_social_goals', JSON.stringify(data.socialGoals || []));
          
          alert("Backup restaurado com sucesso! Bem-vindo de volta.");
          window.location.reload();
        } else {
          alert("Arquivo de backup inválido.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo de backup.");
      }
    };
    reader.readAsText(file);
  };

  const bentoFeatures = [
    { 
      icon: ShoppingCart, 
      title: "PDV Solidário & Caixa", 
      desc: "Venda em segundos com controle de estoque automático e emissão de recibos profissionais para seus doadores. Totalmente integrado ao financeiro e meios de pagamento.",
      color: "text-amber-500", bg: "bg-amber-500/10",
      tag: "Faturamento"
    },
    { 
      icon: Heart, 
      title: "Triagem & Curadoria", 
      desc: "Transforme montanhas de doações em um estoque organizado com precificação estratégica, registro de fotos e histórico de doadores. Reduza o tempo de triagem em até 60%.",
      color: "text-rose-500", bg: "bg-rose-500/10",
      tag: "Operação"
    },
    { 
      icon: Target, 
      title: "Smart Match Engine", 
      desc: "O sistema monitora automaticamente o desejo dos seus clientes e avisa via WhatsApp assim que o item ideal chega ao seu estoque, aumentando a conversão em 40%.",
      color: "text-indigo-500", bg: "bg-indigo-500/10",
      tag: "Vendas"
    },
    { 
      icon: TrendingUp, 
      title: "Consultor de IA", 
      desc: "Inteligência Artificial que analisa seus dados para sugerir estratégias de aumento de ticket médio, gestão de itens parados e otimização de campanhas sociais.",
      color: "text-emerald-500", bg: "bg-emerald-500/10",
      tag: "Estratégia"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500 selection:text-white font-sans overflow-x-hidden">
      
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-white/5 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover scale-[1.8]" />
            </div>
            <span className="font-black text-xl tracking-tighter">ADM<span className="text-amber-500">bazzar</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => importInputRef.current?.click()}
              className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
            >
              <UploadCloud size={16} /> Restaurar Backup
            </button>
            <button 
              onClick={() => { setSelectedPlan('free'); setShowRegModal(true); }}
              className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all border border-white/10"
            >
              Teste Grátis
            </button>
            <button 
              onClick={() => { setSelectedPlan('pro'); setShowRegModal(true); }}
              className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-900/20"
            >
              Assinar PRO Anual
            </button>
          </div>
          <input type="file" ref={importInputRef} onChange={handleImportBackup} accept=".json" className="hidden" />
        </div>
      </nav>

      {/* Hero Section Completa */}
      <section className="relative pt-40 pb-20 md:pt-64 md:pb-48 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.ibb.co/kYYbxLX/desconto-para-temporada-de-compras-com-venda.jpg" 
            alt="Fundo Temporada de Compras" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-sm">
             <Award size={16} className="text-amber-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-200">A Plataforma Nº 1 para Bazares Beneficentes e ONGs</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-12 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent drop-shadow-2xl">
            Profissionalize seu bazar e <br/>
            <span className="text-amber-500">multiplique sua causa.</span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-2xl font-medium max-w-3xl mx-auto mb-16 leading-relaxed drop-shadow">
            Abandone o controle manual e amador. Gerencie doações, controle o estoque com precisão e impulsione as vendas com a inteligência do <strong>ADMbazzar</strong>. Tecnologia profissional feita para quem faz o bem.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <button 
              onClick={() => { setSelectedPlan('pro'); setShowRegModal(true); }}
              className="group w-full md:w-auto px-14 py-7 bg-amber-500 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-amber-900/40 hover:scale-105 hover:bg-amber-600 transition-all flex items-center justify-center gap-4"
            >
              Começar Agora (Plano PRO) <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => { setSelectedPlan('free'); setShowRegModal(true); }}
              className="group w-full md:w-auto px-10 py-7 bg-white/5 text-slate-400 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-4"
            >
              Teste Grátis por 14 dias <Zap size={20} className="text-amber-500" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section (Nova) */}
      <section className="py-28 px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Escolha o melhor plano para sua ONG</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Tecnologia acessível para quem gera impacto real na sociedade.</p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Plano Free */}
          <div className="p-12 bg-slate-900 border border-white/10 rounded-[3rem] relative group hover:border-white/20 transition-all">
            <div className="mb-10">
              <h3 className="text-2xl font-black mb-2">Plano Community</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Grátis para sempre</p>
            </div>
            <div className="text-5xl font-black mb-10">R$ 0</div>
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3 text-slate-400 font-medium">
                <CheckCircle2 size={18} className="text-emerald-500" /> Limite de 20 Itens ativos
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-medium">
                <CheckCircle2 size={18} className="text-emerald-500" /> Controle de PDV / Caixa
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-medium">
                <CheckCircle2 size={18} className="text-emerald-500" /> Registro de Doações
              </li>
              <li className="flex items-center gap-3 text-slate-400 font-medium opacity-40">
                <XCircle size={18} className="text-slate-600" /> Relatórios de BI
              </li>
            </ul>
            <button 
              onClick={() => { setSelectedPlan('free'); setShowRegModal(true); }}
              className="w-full py-5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/5"
            >
              Começar Teste
            </button>
          </div>

          {/* Plano PRO */}
          <div className="p-12 bg-amber-500 border border-amber-400 rounded-[3rem] relative shadow-2xl shadow-amber-900/20 group hover:scale-[1.02] transition-all">
            <div className="absolute -top-4 right-8 px-6 py-2 bg-slate-950 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Mais Popular</div>
            <div className="mb-10">
              <h3 className="text-2xl font-black mb-2 text-slate-950">Plano Profissional</h3>
              <p className="text-amber-900 font-black uppercase tracking-widest text-[10px]">Acesso Anual Ilimitado</p>
            </div>
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-5xl font-black text-slate-950">R$ 97</span>
              <span className="text-amber-900 font-black text-lg">/ ano</span>
            </div>
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-3 text-slate-900 font-bold">
                <Zap size={18} className="fill-slate-950" /> Itens Ilimitados no Estoque
              </li>
              <li className="flex items-center gap-3 text-slate-900 font-bold">
                <Zap size={18} className="fill-slate-950" /> Consultoria com IA (Gemini 3)
              </li>
              <li className="flex items-center gap-3 text-slate-900 font-bold">
                <Zap size={18} className="fill-slate-950" /> Vitrine Virtual Personalizada
              </li>
              <li className="flex items-center gap-3 text-slate-900 font-bold">
                <Zap size={18} className="fill-slate-950" /> Relatórios Gerenciais (BI)
              </li>
            </ul>
            <button 
              onClick={() => { setSelectedPlan('pro'); setShowRegModal(true); }}
              className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black"
            >
              Assinar PRO Agora
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar Section Restaurada */}
      <section className="relative z-20 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-center hover:bg-white/10 transition-all group">
            <p className="text-5xl font-black text-amber-500 mb-2 group-hover:scale-110 transition-transform">+40%</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aumento na Arrecadação</p>
            <p className="text-slate-500 text-xs mt-4 font-medium">Média obtida com o uso do Smart Match Engine e IA.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-center hover:bg-white/10 transition-all group">
            <p className="text-5xl font-black text-indigo-500 mb-2 group-hover:scale-110 transition-transform">-60%</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo Gasto em Triagem</p>
            <p className="text-slate-500 text-xs mt-4 font-medium">Automatização de curadoria e precificação inteligente.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-center hover:bg-white/10 transition-all group">
            <p className="text-5xl font-black text-emerald-500 mb-2 group-hover:scale-110 transition-transform">100%</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibilidade dos Ativos</p>
            <p className="text-slate-500 text-xs mt-4 font-medium">Controle total de cada item doado, da entrada à venda.</p>
          </div>
        </div>
      </section>

      {/* Bento Grid - Funcionalidades Detalhadas */}
      <section className="py-28 px-6 bg-white text-slate-950 rounded-[4rem] mx-2 md:mx-6 relative z-10 shadow-[0_-20px_80px_rgba(0,0,0,0.15)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
             <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-slate-50 rounded-full mb-8 shadow-sm border border-slate-100">
                <LayoutGrid size={16} className="text-amber-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Plataforma de Gestão Completa</span>
             </div>
            <h3 className="text-4xl md:text-7xl font-black tracking-tight text-slate-900 leading-[0.9]">Gestão Inteligente para <br className="hidden md:block" /> captação de recursos</h3>
            <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto mt-8 leading-relaxed">
              Digitalizamos cada etapa da sua operação, transformando doações desorganizadas 
              em recursos financeiros previsíveis para sua causa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {bentoFeatures.map((f, i) => (
              <div key={i} className="p-12 rounded-[4rem] bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 group flex flex-col md:flex-row gap-10 items-start">
                <div className={`w-24 h-24 rounded-3xl ${f.bg} ${f.color} flex items-center justify-center shrink-0 shadow-[0_20px_40px_rgba(0,0,0,0.05)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                  <f.icon size={44} />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">{f.tag}</span>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight">{f.title}</h4>
                  </div>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">{f.desc}</p>
                  <button className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-amber-500 transition-colors">
                    Explorar Recurso <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section Restaurada */}
      <section className="py-28 px-6 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="p-12 bg-white/5 rounded-[4rem] border border-white/10 flex-shrink-0 shadow-[0_30px_60px_rgba(0,0,0,0.3)] backdrop-blur-md">
             <ShieldCheck size={96} className="text-amber-500" />
          </div>
          <div className="text-center md:text-left space-y-8">
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">Transparência para sua OSC.</h3>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl">
              O ADMbazzar foi construído sob pilares de conformidade e transparência. 
              Gere relatórios automáticos para conselhos fiscais e preste contas com precisão sobre cada item doado.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
               <div className="flex flex-col items-center gap-2"><Server size={32} /> <span className="text-[8px] font-black uppercase tracking-widest">Cloud AWS</span></div>
               <div className="flex flex-col items-center gap-2"><Lock size={32} /> <span className="text-[8px] font-black uppercase tracking-widest">LGPD Compliance</span></div>
               <div className="flex flex-col items-center gap-2"><ShieldAlert size={32} /> <span className="text-[8px] font-black uppercase tracking-widest">Anti-Fraude</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Final */}
      <footer className="py-24 px-6 text-center border-t border-white/5">
         <div className="mb-14">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl overflow-hidden border-2 border-amber-400/20 shadow-xl">
                 <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover scale-[1.8]" />
              </div>
              <span className="font-black text-3xl tracking-tighter">ADM<span className="text-amber-500">bazzar</span></span>
            </div>
            <p className="text-slate-500 text-xs uppercase tracking-[0.5em] font-black">Gestão Profissional de Bazar &bull; 2026</p>
         </div>
         <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">
           © ADMbazzar. A solução especialista nº 1 para Bazares de ONGs e Instituições de Caridade.<br/>
           Tecnologia voltada para o Impacto Social e Sustentabilidade Filantrópica.
         </p>
      </footer>

      {/* Modal de Registro Otimizado */}
      {showRegModal && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-[200] flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in slide-in-from-bottom-10 duration-500 max-h-[95vh]">
            <div className={`p-8 md:p-12 ${selectedPlan === 'pro' ? 'bg-amber-500' : 'bg-slate-950'} text-white flex justify-between items-center flex-shrink-0`}>
               <div className="flex items-center gap-4">
                 <div className={`p-3 ${selectedPlan === 'pro' ? 'bg-slate-950' : 'bg-amber-500'} rounded-2xl`}>
                    {selectedPlan === 'pro' ? <Crown size={24} className="text-amber-500" /> : <Building2 size={24} className="text-white" />}
                 </div>
                 <div>
                   <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">
                     {selectedPlan === 'pro' ? 'Ativar Plano PRO Anual' : 'Configurar Teste Grátis'}
                   </h3>
                   <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mt-1">
                     {selectedPlan === 'pro' ? 'Acesso Ilimitado Garantido' : 'Experimente todos os recursos por 14 dias'}
                   </p>
                 </div>
               </div>
               <button onClick={() => setShowRegModal(false)} className="p-3 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white">
                 <XCircle size={32} />
               </button>
            </div>

            <div className="p-8 md:p-12 overflow-y-auto space-y-8 custom-scrollbar">
               <div className={`p-6 rounded-[2.5rem] flex gap-5 items-center ${selectedPlan === 'pro' ? 'bg-amber-50 border border-amber-100 text-amber-900' : 'bg-slate-50 border border-slate-100 text-slate-900'}`}>
                  {selectedPlan === 'pro' ? <Award size={24} className="shrink-0" /> : <Sparkles size={24} className="text-amber-500 shrink-0" />}
                  <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                    {selectedPlan === 'pro' 
                      ? "Ao se tornar PRO, você remove todos os limites de estoque e libera a Inteligência Artificial estrategista." 
                      : "Aproveite 14 dias de acesso irrestrito para profissionalizar sua gestão."}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da ONG / Bazar</span>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 font-bold outline-none focus:ring-4 focus:ring-amber-500/10 transition-all" 
                      placeholder="Ex: Associação Esperança" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CNPJ</span>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 font-bold outline-none" 
                      placeholder="00.000.000/0000-00" 
                      value={formData.cnpj} 
                      onChange={e => setFormData({...formData, cnpj: e.target.value})} 
                    />
                  </label>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail do Gestor</span>
                    <input 
                      type="email" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 font-bold outline-none" 
                      placeholder="seu@email.org" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Suporte</span>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 font-bold outline-none" 
                      placeholder="(00) 00000-0000" 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                    />
                  </label>
               </div>

               <div className="p-8 bg-slate-900 rounded-[2.5rem] space-y-6">
                  <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Lock size={14} /> Segurança do Painel
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="block space-y-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Criar Senha Mestra</span>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-amber-500/50" 
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </label>
                    <label className="block space-y-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confirmar Senha</span>
                      <input 
                        type="password"
                        className="w-full px-5 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-amber-500/50" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                    </label>
                  </div>
               </div>

               <div className="pt-4">
                 {selectedPlan === 'pro' ? (
                   <button 
                    onClick={handleRegister}
                    className="w-full py-6 bg-amber-500 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-amber-600 transition-all flex items-center justify-center gap-4 active:scale-95"
                   >
                      Finalizar Assinatura Anual <ArrowRight size={20} />
                   </button>
                 ) : (
                   <button 
                    onClick={handleRegister}
                    className="w-full py-6 bg-slate-950 text-amber-500 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 border border-amber-500/20"
                   >
                      Ativar Teste Grátis <Zap size={20} />
                   </button>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default LandingPage;
