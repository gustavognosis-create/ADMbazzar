
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  HeartHandshake, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Building2, 
  Lightbulb,
  Menu,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Store,
  Crown,
  Lock,
  UserPlus,
  ShieldHalf,
  Download,
  Smartphone,
  Share2,
  Save,
  Zap,
  BarChartHorizontal,
  ArrowUpCircle,
  XCircle,
  Box,
  Ruler,
  Palette,
  Layers,
  Star,
  PhoneCall,
  CalendarClock
} from 'lucide-react';
import { View, Product, Donation, Transaction, Donor, Customer, Institution, Category, User, Partner, SocialGoal } from './types';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import DonationsManager from './components/DonationsManager';
import POS from './components/POS';
import Financials from './components/Financials';
import EntitiesManager from './components/EntitiesManager';
import InstitutionProfile from './components/InstitutionProfile';
import AIAssistant from './components/AIAssistant';
import StorefrontManager from './components/StorefrontManager';
import UpgradeScreen from './components/UpgradeScreen';
import TeamManager from './components/TeamManager';
import PartnerManager from './components/PartnerManager';
import LandingPage from './components/LandingPage';
import ReportsManager from './components/ReportsManager';
import PaymentAIValidator from './components/PaymentAIValidator';

const Logo: React.FC<{ collapsed?: boolean; institution: Institution }> = ({ collapsed, institution }) => {
  const displayLogo = (institution.isPro && institution.logoUrl) 
    ? institution.logoUrl 
    : "https://i.ibb.co/hxH3NTDF/360-F-544950008_jizrelzjnj0za-U4e-Bc-Deo4-E0-I7qk-JQs-X.jpg";

  const displayName = institution.bazarName || institution.name || "ADMbazzar";

  return (
    <div className={`flex flex-col items-center gap-4 ${collapsed ? 'justify-center' : ''}`}>
      <div className={`relative flex-shrink-0 group overflow-hidden rounded-full border-4 ${institution.isPro ? 'border-amber-500 shadow-amber-500/20' : 'border-slate-800 shadow-black/50'} shadow-[0_15px_35px] transition-all duration-500 hover:scale-105 ${collapsed ? 'w-14 h-14' : 'w-24 h-24 md:w-28 md:h-28'}`}>
        <img 
          src={displayLogo} 
          alt="Bazar Logo" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-40 pointer-events-none"></div>
      </div>
      
      {!collapsed && (
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-700 w-full px-2">
          {institution.bazarName || institution.name ? (
            <span className="font-black text-white text-lg md:text-xl tracking-tighter leading-tight mt-1 truncate max-w-full">
              {displayName.toUpperCase()}
            </span>
          ) : (
            <span className="font-black text-xl md:text-2xl tracking-tighter leading-none flex items-baseline mt-1">
              <span className="text-white">ADM</span>
              <span className="text-amber-500">bazzar</span>
            </span>
          )}
          <span className={`hidden md:block text-[9px] font-black uppercase tracking-[0.2em] mt-3 px-3 py-1 rounded-full border ${institution.isPro ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : 'text-slate-500 border-slate-800 bg-slate-900/50'}`}>
            {institution.isPro ? 'SISTEMA PROFISSIONAL' : 'VERSÃO GRATUITA'}
          </span>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchingCustomers, setMatchingCustomers] = useState<Customer[]>([]);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const [institution, setInstitution] = useState<Institution>(() => {
    const saved = localStorage.getItem('adm_institution');
    return saved ? JSON.parse(saved) : {
      name: '', cnpj: '', address: '', phone: '', email: '', isPro: false, commissionRate: 30, bazarName: ''
    };
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('adm_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [socialGoals, setSocialGoals] = useState<SocialGoal[]>(() => {
    const saved = localStorage.getItem('adm_social_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Manutenção da Sede', description: 'Reforma do telhado e pintura externa.', targetValue: 5000, currentValue: 0, isActive: true },
      { id: '2', title: 'Cestas Básicas', description: 'Compra de 100 cestas para famílias locais.', targetValue: 8000, currentValue: 0, isActive: true }
    ];
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('adm_partners');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('adm_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    const saved = localStorage.getItem('adm_donations');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('adm_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = localStorage.getItem('adm_donors');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('adm_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [quickProduct, setQuickProduct] = useState<Partial<Product>>({
    name: '', category: 'Roupas', price: 0, stock: 1, condition: 'Bom', size: '', fabric: '', brand: ''
  });

  // Verificação de Expiração PRO
  useEffect(() => {
    if (institution.isPro && institution.proExpiryDate) {
      const now = new Date();
      const expiry = new Date(institution.proExpiryDate);
      if (now > expiry) {
        setInstitution(prev => ({ ...prev, isPro: false }));
        alert("Sua assinatura PRO expirou. Retornando para o plano gratuito.");
      }
    }
  }, [institution.isPro, institution.proExpiryDate]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  useEffect(() => localStorage.setItem('adm_institution', JSON.stringify(institution)), [institution]);
  useEffect(() => localStorage.setItem('adm_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('adm_social_goals', JSON.stringify(socialGoals)), [socialGoals]);
  useEffect(() => localStorage.setItem('adm_partners', JSON.stringify(partners)), [partners]);
  useEffect(() => localStorage.setItem('adm_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('adm_donations', JSON.stringify(donations)), [donations]);
  useEffect(() => localStorage.setItem('adm_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('adm_donors', JSON.stringify(donors)), [donors]);
  useEffect(() => localStorage.setItem('adm_customers', JSON.stringify(customers)), [customers]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const findMatches = (product: Product) => {
    const matches = customers.filter(customer => {
      if (!customer.preferences) return false;
      const categoryMatch = customer.preferences.categories.includes(product.category);
      const sizeMatch = 
        (product.category === 'Roupas' && customer.sizes?.shirt === product.size) ||
        (product.category === 'Calçados' && customer.sizes?.shoes === product.size) ||
        !product.size;
      return categoryMatch && sizeMatch;
    });

    if (matches.length > 0) {
      setMatchingCustomers(matches);
      setLastAddedProduct(product);
      setShowMatchModal(true);
    }
  };

  const handleQuickAdd = () => {
    if (!quickProduct.name) return;
    const pToAdd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      code: `${quickProduct.category?.charAt(0)}${Math.floor(Math.random() * 999)}`,
      name: quickProduct.name!,
      description: 'Cadastro Rápido',
      category: quickProduct.category as Category,
      price: Number(quickProduct.price) || 0,
      stock: Number(quickProduct.stock) || 1,
      condition: quickProduct.condition as any || 'Bom',
      status: 'Estoque',
      size: quickProduct.size,
      fabric: quickProduct.fabric,
      brand: quickProduct.brand
    };
    
    setProducts(prev => [pToAdd, ...prev]);
    setShowQuickAdd(false);
    findMatches(pToAdd);
    setQuickProduct({ name: '', category: 'Roupas', price: 0, stock: 1, condition: 'Bom' });
  };

  const handleUpgradeActivation = () => {
    const activation = new Date();
    const expiry = new Date();
    expiry.setFullYear(activation.getFullYear() + 1); // 1 ano de acesso

    setInstitution(prev => ({ 
      ...prev, 
      isPro: true,
      proActivationDate: activation.toISOString(),
      proExpiryDate: expiry.toISOString()
    }));
    setActiveView('dashboard');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard products={products} donations={donations} transactions={transactions} />;
      case 'inventory': return <Inventory products={products} setProducts={setProducts} isPro={institution.isPro} limitReached={!institution.isPro && products.length >= 20} limit={20} customers={customers} />;
      case 'donations': return <DonationsManager donations={donations} setDonations={setDonations} donors={donors} products={products} setProducts={setProducts} institution={institution} />;
      case 'pos': return <POS products={products} setProducts={setProducts} transactions={transactions} setTransactions={setTransactions} customers={customers} institution={institution} />;
      case 'financial': return <Financials transactions={transactions} setTransactions={setTransactions} />;
      case 'entities': return <EntitiesManager donors={donors} setDonors={setDonors} customers={customers} setCustomers={setCustomers} />;
      case 'institution': return <InstitutionProfile institution={institution} setInstitution={setInstitution} />;
      case 'ai-assistant': return <AIAssistant products={products} donations={donations} transactions={transactions} institution={institution} />;
      case 'storefront': return <StorefrontManager products={products} setProducts={setProducts} institution={institution} />;
      case 'upgrade': return <UpgradeScreen onUpgrade={handleUpgradeActivation} />;
      case 'team': return <TeamManager users={users} setUsers={setUsers} />;
      case 'partners': return <PartnerManager partners={partners} setPartners={setPartners} institution={institution} transactions={transactions} />;
      case 'reports': return <ReportsManager products={products} donations={donations} transactions={transactions} donors={donors} customers={customers} partners={partners} />;
      default: return <Dashboard products={products} donations={donations} transactions={transactions} />;
    }
  };

  if (institution.name === '') {
    return <LandingPage setInstitution={setInstitution} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard, pro: false },
    { id: 'pos', label: 'Caixa / PDV', icon: ShoppingCart, pro: false },
    { id: 'inventory', label: 'Estoque', icon: Package, pro: false },
    { id: 'reports', label: 'Relatórios BI', icon: BarChartHorizontal, pro: true },
    { id: 'storefront', label: 'Vitrine Digital', icon: Store, pro: true },
    { id: 'partners', label: 'Afiliados', icon: Share2, pro: true },
    { id: 'donations', label: 'Triagem', icon: HeartHandshake, pro: false },
    { id: 'financial', label: 'Financeiro', icon: DollarSign, pro: true },
    { id: 'entities', label: 'Clientes/Doadores', icon: Users, pro: false },
    { id: 'team', label: 'Equipe', icon: ShieldHalf, pro: true },
    { id: 'institution', label: 'Instituição', icon: Building2, pro: false },
    { id: 'ai-assistant', label: 'Consultor IA', icon: Lightbulb, pro: true },
  ];

  const handleNavigate = (view: View) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const getDaysRemaining = () => {
    if (!institution.proExpiryDate) return 0;
    const diffTime = Math.abs(new Date(institution.proExpiryDate).getTime() - new Date().getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const currentBazarName = institution.bazarName || institution.name || "ADMbazzar";

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-x-hidden">
      {!institution.isPro && activeView === 'upgrade' && (
        <PaymentAIValidator 
          isOpen={isAIChatOpen} 
          setIsOpen={setIsAIChatOpen} 
          onValidated={handleUpgradeActivation} 
        />
      )}

      {activeView !== 'upgrade' && (
        <button 
          onClick={() => setShowQuickAdd(true)}
          className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[60] w-16 h-16 bg-amber-500 text-white rounded-full shadow-[0_15px_30px_-5px_rgba(245,158,11,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden animate-bounce-subtle"
        >
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[45] md:hidden animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`fixed h-full z-50 bg-slate-950 border-r border-slate-900 flex flex-col transition-all duration-300 shadow-2xl ${isMobileMenuOpen ? 'translate-x-0 w-80' : '-translate-x-full md:translate-x-0'} ${isSidebarOpen ? 'md:w-80' : 'md:w-24'}`}>
        <div className={`p-6 md:p-8 flex flex-col items-center justify-center border-b border-slate-900 transition-all duration-500 bg-slate-950 ${isSidebarOpen ? 'h-[14rem] md:h-[18rem]' : 'h-32'}`}>
          <Logo collapsed={!isSidebarOpen && window.innerWidth > 768} institution={institution} />
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-1.5 hover:bg-slate-800 rounded-lg text-slate-600 absolute -right-3 top-10 bg-slate-950 border border-slate-800 shadow-xl z-30 transition-colors">
            {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 mt-2">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => handleNavigate(item.id as View)} className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-200 group relative ${activeView === item.id ? 'bg-amber-500 text-white shadow-xl shadow-amber-900/30 font-black' : 'text-slate-500 hover:bg-slate-900 hover:text-white'}`}>
              <item.icon size={22} className={activeView === item.id ? 'text-white' : 'text-slate-600 group-hover:text-amber-400'} />
              {(isSidebarOpen || isMobileMenuOpen) && (
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-widest font-bold">{item.label}</span>
                  {item.pro && !institution.isPro && <Lock size={12} className="text-slate-700" />}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 md:p-6 border-t border-slate-900 space-y-2">
          {deferredPrompt && (isSidebarOpen || isMobileMenuOpen) && (
            <button onClick={handleInstallClick} className="w-full mb-2 p-3.5 bg-indigo-600 text-white rounded-2xl flex items-center gap-3 hover:bg-indigo-700 transition-all group shadow-lg shadow-indigo-900/20">
              <Smartphone size={20} className="animate-bounce" />
              <div className="text-left"><p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">App Nativo</p><p className="text-[10px] font-bold uppercase tracking-tight">Instalar no Celular</p></div>
            </button>
          )}

          {institution.isPro && (isSidebarOpen || isMobileMenuOpen) && (
            <div className="w-full mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3">
              <CalendarClock size={20} className="text-amber-500" />
              <div className="text-left">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Acesso PRO Ativo</p>
                <p className="text-[10px] font-bold text-white uppercase tracking-tight">{getDaysRemaining()} Dias Restantes</p>
              </div>
            </div>
          )}

          {!institution.isPro && (isSidebarOpen || isMobileMenuOpen) && (
            <button onClick={() => handleNavigate('upgrade')} className="w-full mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 hover:bg-amber-500/20 transition-all group">
              <ArrowUpCircle size={20} className="text-amber-500 animate-bounce" />
              <div className="text-left"><p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Limite: {products.length}/20</p><p className="text-[10px] font-bold text-white uppercase tracking-tight">Upgrade para PRO</p></div>
            </button>
          )}

          <button onClick={() => {
            const data = { institution, products, partners, users, donations, transactions, donors, customers, socialGoals };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup-bazar-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }} className={`w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-all ${!isSidebarOpen && 'justify-center'}`}>
            <Save size={18} />
            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Backup Local</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 min-h-screen flex flex-col ${isSidebarOpen ? 'md:ml-80' : 'md:ml-24'} pb-24 md:pb-10`}>
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-[40]">
           <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-slate-50 rounded-xl text-slate-600"><Menu size={20} /></button>
           <span className="font-black text-slate-900 uppercase tracking-tighter text-sm truncate max-w-[150px]">{currentBazarName}</span>
           <button onClick={() => handleNavigate('pos')} className="p-2 bg-amber-500 rounded-xl text-white shadow-lg"><ShoppingCart size={20} /></button>
        </header>

        <div className="p-4 md:p-10 flex-1 flex flex-col h-full">
          <header className="hidden md:flex mb-10 flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-0">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter">{menuItems.find(m => m.id === activeView)?.label || 'Bem-vindo'}</h1>
              <div className="flex items-center gap-3 mt-3">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${institution.isPro ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-400'}`}></span>
                <p className="text-slate-400 font-black text-[9px] md:text-[11px] uppercase tracking-[0.4em]">{currentBazarName} &bull; {institution.isPro ? 'Professional Edition' : 'Community Edition'}</p>
              </div>
            </div>
            <div className="flex gap-4">
              {deferredPrompt && <button onClick={handleInstallClick} className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100"><Smartphone size={18} /> Instalar App</button>}
              {!institution.isPro && <button onClick={() => handleNavigate('upgrade')} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-2"><Zap size={18} className="text-amber-500" /> Seja Pro</button>}
              <button onClick={() => handleNavigate('pos')} className="px-6 py-3.5 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-amber-200"><ShoppingCart size={18} /> Abrir Caixa</button>
            </div>
          </header>

          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out flex-1">{renderView()}</section>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-20 px-6 flex items-center justify-between z-[40] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button onClick={() => handleNavigate('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'dashboard' ? 'text-amber-500' : 'text-slate-400'}`}><LayoutDashboard size={24} /><span className="text-[9px] font-black uppercase">Home</span></button>
        <button onClick={() => handleNavigate('inventory')} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'inventory' ? 'text-amber-500' : 'text-slate-400'}`}><Package size={24} /><span className="text-[9px] font-black uppercase">Estoque</span></button>
        <div className="relative -top-8"><button onClick={() => handleNavigate('pos')} className="w-16 h-16 bg-amber-500 text-white rounded-[2rem] shadow-xl shadow-amber-500/30 flex items-center justify-center border-4 border-white active:scale-90 transition-transform"><ShoppingCart size={28} /></button></div>
        <button onClick={() => handleNavigate('financial')} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'financial' ? 'text-amber-500' : 'text-slate-400'}`}><DollarSign size={24} /><span className="text-[9px] font-black uppercase">Finanças</span></button>
        <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-1 text-slate-400"><Menu size={24} /><span className="text-[9px] font-black uppercase">Menu</span></button>
      </nav>

      {showQuickAdd && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-8 bg-amber-500 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4"><div className="p-3 bg-white/20 rounded-2xl"><Zap size={24} /></div><div><h3 className="font-black uppercase tracking-widest text-xs">Entrada Expressa</h3><p className="text-[10px] text-white/70 font-bold mt-0.5 tracking-tight uppercase">Cadastro de item em 10 segundos</p></div></div>
               <button onClick={() => setShowQuickAdd(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6">
              <label className="block space-y-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Produto</span><input autoFocus type="text" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 focus:ring-4 focus:ring-amber-500/10 transition-all" placeholder="Ex: Camiseta Vintage" value={quickProduct.name} onChange={e => setQuickProduct({...quickProduct, name: e.target.value})} /></label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</span><select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm appearance-none" value={quickProduct.category} onChange={e => setQuickProduct({...quickProduct, category: e.target.value as Category})}><option value="Roupas">Roupas</option><option value="Calçados">Calçados</option><option value="Acessórios">Acessórios</option><option value="Casa">Casa</option><option value="Eletros">Eletros</option></select></label>
                <label className="block space-y-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço (R$)</span><input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-amber-600" placeholder="0.00" value={quickProduct.price} onChange={e => setQuickProduct({...quickProduct, price: parseFloat(e.target.value)})} /></label>
              </div>
              <button onClick={handleQuickAdd} className="w-full py-6 bg-amber-500 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-amber-900/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-4">Salvar no Estoque <Save size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
