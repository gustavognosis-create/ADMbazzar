
import React, { useState } from 'react';
import { Donor, Customer, Category } from '../types';
import { 
  Users, 
  UserCircle, 
  Phone, 
  Mail, 
  Search, 
  Plus, 
  XCircle, 
  UserPlus, 
  Save, 
  ArrowRight, 
  Ruler, 
  Sparkles, 
  Palette, 
  Layers,
  Shirt,
  Footprints,
  ShoppingBag,
  Star,
  CheckCircle2,
  Zap,
  Tag
} from 'lucide-react';

const FABRICS = ['Algodão', 'Jeans', 'Linho', 'Seda', 'Viscose', 'Poliéster', 'Lã', 'Couro', 'Veludo', 'Malha', 'Sintético'];
const COLORS = ['Branco', 'Preto', 'Cinza', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Roxo', 'Marrom', 'Bege', 'Laranja'];
const SIZES_CLOTHING = ['PP', 'P', 'M', 'G', 'GG', 'XG', '36', '38', '40', '42', '44', '46', '48', '50'];
const SIZES_SHOES = ['33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const CLOTHING_TYPES = ['Camiseta', 'Camisa', 'Calça', 'Vestido', 'Saia', 'Casaco', 'Blazer', 'Short', 'Moletom', 'Blusa', 'Macacão'];
const SHOE_TYPES = ['Tênis', 'Sapato Social', 'Sandália', 'Bota', 'Sapatilha', 'Chinelo', 'Salto Alto', 'Mocassim'];

interface EntitiesManagerProps {
  donors: Donor[];
  setDonors: React.Dispatch<React.SetStateAction<Donor[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const EntitiesManager: React.FC<EntitiesManagerProps> = ({ donors, setDonors, customers, setCustomers }) => {
  const [activeTab, setActiveTab] = useState<'donors' | 'customers'>('donors');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({ 
    name: '', email: '', phone: '',
    sizes: { shirt: '', pants: '', shoes: '' },
    preferences: {
      categories: ['Roupas'],
      productTypes: [],
      colors: [],
      fabrics: [],
      prints: [],
      brands: []
    }
  });

  const [tempBrand, setTempBrand] = useState('');

  const list = activeTab === 'donors' ? donors : customers;
  const filteredList = list.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name) return;
    const customerToAdd: Customer = {
      id: `C-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: newCustomer.name!,
      email: newCustomer.email || '',
      phone: newCustomer.phone || '',
      totalSpent: 0,
      sizes: newCustomer.sizes,
      preferences: newCustomer.preferences as any
    };
    setCustomers(prev => [customerToAdd, ...prev]);
    setShowAddCustomerModal(false);
    // Reset modal state
    setNewCustomer({ 
      name: '', email: '', phone: '',
      sizes: { shirt: '', pants: '', shoes: '' },
      preferences: {
        categories: ['Roupas'],
        productTypes: [],
        colors: [],
        fabrics: [],
        prints: [],
        brands: []
      }
    });
  };

  const togglePreference = (field: 'brands' | 'categories' | 'fabrics' | 'colors' | 'productTypes', value: any) => {
    if (!value) return;
    const current = newCustomer.preferences?.[field] || [];
    const updated = current.includes(value) 
      ? current.filter(v => v !== value) 
      : [...current, value];
    
    setNewCustomer({
      ...newCustomer,
      preferences: {
        ...newCustomer.preferences!,
        [field]: updated
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('donors')} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'donors' ? 'text-teal-600' : 'text-slate-400'}`}>
          Doadores ({donors.length})
          {activeTab === 'donors' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-500 rounded-t-full"></div>}
        </button>
        <button onClick={() => setActiveTab('customers')} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'customers' ? 'text-indigo-600' : 'text-slate-400'}`}>
          Clientes / Monitoramento ({customers.length})
          {activeTab === 'customers' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full"></div>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Buscar por nome ou contato..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={() => { setActiveTab('customers'); setShowAddCustomerModal(true); }} className="flex items-center gap-3 px-8 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all bg-indigo-600 hover:bg-indigo-700">
          <UserPlus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map(person => (
          <div key={person.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full group hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm font-black">
                {person.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm truncate">{person.name}</h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{person.phone}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6 flex-1">
              {activeTab === 'customers' && (
                <div className="space-y-3">
                   <div className="flex flex-wrap gap-1">
                      {(person as Customer).sizes?.shirt && <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">Roupa: {(person as Customer).sizes?.shirt}</span>}
                      {(person as Customer).sizes?.shoes && <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">Pé: {(person as Customer).sizes?.shoes}</span>}
                   </div>
                   <div className="flex flex-wrap gap-1">
                      {(person as Customer).preferences?.productTypes?.map(t => <span key={t} className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-emerald-100">{t}</span>)}
                      {(person as Customer).preferences?.brands.map(b => <span key={b} className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-amber-100 flex items-center gap-1"><Star size={8}/> {b}</span>)}
                      {(person as Customer).preferences?.categories.map(c => <span key={c} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-indigo-100">{c}</span>)}
                   </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Atividade</p>
                <p className="font-black text-slate-800 text-sm">{activeTab === 'donors' ? `${(person as Donor).totalDonations} Doações` : `R$ ${(person as Customer).totalSpent.toFixed(2)}`}</p>
              </div>
              <button className="p-2 bg-slate-50 text-slate-300 rounded-lg hover:text-indigo-600 transition-colors"><ArrowRight size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Profile Otimizado */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 md:p-10 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h4 className="text-xl md:text-2xl font-black tracking-tight">Personal Shopper Monitor</h4>
                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mt-1">Defina preferências padronizadas para Match</p>
              </div>
              <button onClick={() => setShowAddCustomerModal(false)}><XCircle size={28} /></button>
            </div>
            
            <div className="p-6 md:p-10 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Cliente</span>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="Ex: Ana Maria" value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</span>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="(00) 00000-0000" value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} />
                </label>
              </div>

              {/* Medidas de Seleção */}
              <div className="p-8 bg-slate-900 rounded-[2.5rem] space-y-6">
                 <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2"><Ruler size={14}/> Perfil de Medidas</h5>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <span className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1"><Shirt size={10}/> Roupas</span>
                       <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none font-black text-white text-xs" value={newCustomer.sizes?.shirt} onChange={(e) => setNewCustomer({...newCustomer, sizes: {...newCustomer.sizes!, shirt: e.target.value}})}>
                          <option value="">Selecione...</option>
                          {SIZES_CLOTHING.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[8px] font-black text-slate-500 uppercase flex items-center gap-1"><Footprints size={10}/> Calçados</span>
                       <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none font-black text-white text-xs" value={newCustomer.sizes?.shoes} onChange={(e) => setNewCustomer({...newCustomer, sizes: {...newCustomer.sizes!, shoes: e.target.value}})}>
                          <option value="">Selecione...</option>
                          {SIZES_SHOES.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                 </div>
              </div>

              {/* Preferências Otimizadas */}
              <div className="space-y-8">
                 {/* NOVO: Tipo de Produto (Monitoramento Específico) */}
                 <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShoppingBag size={14} className="text-emerald-500"/> Tipos de Produto em Monitoramento</span>
                    <div className="flex flex-wrap gap-2">
                       {(newCustomer.preferences?.categories.includes('Calçados') ? SHOE_TYPES : CLOTHING_TYPES).map(type => (
                         <button 
                           key={type} 
                           onClick={() => togglePreference('productTypes', type)}
                           className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                             newCustomer.preferences?.productTypes?.includes(type) ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg' : 'bg-white text-slate-400 border-slate-200'
                           }`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Layers size={14} className="text-blue-500"/> Preferência de Tecidos</span>
                    <div className="flex flex-wrap gap-2">
                       {FABRICS.map(f => (
                         <button 
                           key={f} 
                           onClick={() => togglePreference('fabrics', f)}
                           className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                             newCustomer.preferences?.fabrics.includes(f) ? 'bg-blue-600 text-white border-blue-700 shadow-lg' : 'bg-white text-slate-400 border-slate-200'
                           }`}
                         >
                           {f}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Palette size={14} className="text-rose-500"/> Cores Favoritas</span>
                    <div className="flex flex-wrap gap-2">
                       {COLORS.map(c => (
                         <button 
                           key={c} 
                           onClick={() => togglePreference('colors', c)}
                           className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                             newCustomer.preferences?.colors.includes(c) ? 'bg-rose-500 text-white border-rose-600 shadow-lg' : 'bg-white text-slate-400 border-slate-200'
                           }`}
                         >
                           {c}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Star size={14} className="text-amber-500"/> Marcas Monitoradas</span>
                    <div className="flex gap-2">
                      <input type="text" className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-xs" placeholder="Digite uma marca e aperte Enter..." value={tempBrand} onChange={e => setTempBrand(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), togglePreference('brands', tempBrand), setTempBrand(''))} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {newCustomer.preferences?.brands.map(b => <span key={b} className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border border-amber-100 flex items-center gap-2">{b} <button onClick={() => togglePreference('brands', b)}><XCircle size={12}/></button></span>)}
                    </div>
                 </div>
              </div>

              <button onClick={handleAddCustomer} className="w-full py-5 bg-indigo-600 text-white font-black rounded-[2rem] uppercase tracking-widest text-xs shadow-xl shadow-indigo-900/10 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all">
                 <Save size={18} /> Ativar Monitoramento de Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntitiesManager;
