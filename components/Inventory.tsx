
import React, { useState, useRef, useEffect } from 'react';
import { Product, Category, Customer, ProductStatus } from '../types';
import { 
  Search, 
  Plus, 
  Trash2, 
  XCircle, 
  Box, 
  Sparkles, 
  ChevronDown,
  Palette,
  Layers,
  Ruler,
  Image as ImageIcon,
  Video as VideoIcon,
  Upload,
  MoreVertical,
  CheckCircle2,
  PhoneCall,
  Zap,
  Tag,
  Star,
  Shirt,
  Footprints
} from 'lucide-react';

// Listas Padronizadas para Otimização de Match
const FABRICS = ['Algodão', 'Jeans', 'Linho', 'Seda', 'Viscose', 'Poliéster', 'Lã', 'Couro', 'Veludo', 'Malha', 'Sintético'];
const PRINTS = ['Liso', 'Floral', 'Listrado', 'Xadrez', 'Poá (Bolinhas)', 'Animal Print', 'Geométrico', 'Tie-Dye', 'Estampado'];
const CLOTHING_TYPES = ['Camiseta', 'Camisa', 'Calça', 'Vestido', 'Saia', 'Casaco', 'Blazer', 'Short', 'Moletom', 'Blusa', 'Macacão'];
const SHOE_TYPES = ['Tênis', 'Sapato Social', 'Sandália', 'Bota', 'Sapatilha', 'Chinelo', 'Salto Alto', 'Mocassim'];
const COLORS = ['Branco', 'Preto', 'Cinza', 'Azul', 'Vermelho', 'Verde', 'Amarelo', 'Rosa', 'Roxo', 'Marrom', 'Bege', 'Laranja', 'Dourado', 'Prateado'];
const SIZES_CLOTHING = ['PP', 'P', 'M', 'G', 'GG', 'XG', '36', '38', '40', '42', '44', '46', '48', '50'];
const SIZES_SHOES = ['33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isPro: boolean;
  limitReached: boolean;
  limit: number;
  customers: Customer[];
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts, isPro, limitReached, limit, customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'Todos'>('Todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [matchingCustomers, setMatchingCustomers] = useState<Customer[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastMatchedProduct, setLastMatchedProduct] = useState<Product | null>(null);
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', description: '', category: 'Roupas', price: 0, stock: 1, condition: 'Bom',
    status: 'Estoque', color: '', fabric: '', size: '', subCategory: '', brand: '', print: ''
  });

  const categories: (Category | 'Todos')[] = ['Todos', 'Roupas', 'Calçados', 'Acessórios', 'Casa', 'Brinquedos', 'Eletros', 'Móveis', 'Outros'];

  // Define filteredProducts to fix "Cannot find name 'filteredProducts'" error
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'Todos' || p.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case 'Vendido': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Loja Online': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Bazar': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      default: return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  const findMatches = (product: Product) => {
    const matches = customers.filter(customer => {
      if (!customer.preferences) return false;
      
      const categoryMatch = customer.preferences.categories.includes(product.category);
      
      // Match por Tipo de Produto (subcategoria)
      const typeMatch = !product.subCategory || 
                       customer.preferences.productTypes?.length === 0 || 
                       customer.preferences.productTypes?.includes(product.subCategory);

      const sizeMatch = 
        (product.category === 'Roupas' && customer.sizes?.shirt === product.size) ||
        (product.category === 'Calçados' && customer.sizes?.shoes === product.size) ||
        !product.size;

      // Match opcional por tecido ou estampa se o cliente tiver preferência
      const fabricMatch = !product.fabric || customer.preferences.fabrics.length === 0 || customer.preferences.fabrics.includes(product.fabric);
      
      return categoryMatch && typeMatch && sizeMatch && fabricMatch;
    });

    if (matches.length > 0) {
      setMatchingCustomers(matches);
      setLastMatchedProduct(product);
      setShowMatchModal(true);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) return;
    const pToAdd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      code: `${newProduct.category?.charAt(0)}${Math.floor(Math.random() * 999)}`,
      name: newProduct.name!, description: newProduct.description || '',
      category: newProduct.category as Category, price: Number(newProduct.price) || 0,
      stock: Number(newProduct.stock) || 0, condition: (newProduct.condition as any) || 'Bom',
      status: (newProduct.status as ProductStatus) || 'Estoque',
      size: newProduct.size, color: newProduct.color, fabric: newProduct.fabric,
      brand: newProduct.brand, print: newProduct.print, subCategory: newProduct.subCategory,
      imageUrl: newProduct.imageUrl
    };
    
    setProducts(prev => [pToAdd, ...prev]);
    setShowAddModal(false);
    findMatches(pToAdd);
    setNewProduct({ name: '', description: '', category: 'Roupas', price: 0, stock: 1, condition: 'Bom', status: 'Estoque' });
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-0">
      {/* Smart Match Modal */}
      {showMatchModal && lastMatchedProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-200">
             <div className="p-8 bg-amber-500 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Zap size={24} className="fill-white" />
                  <h3 className="font-black uppercase tracking-widest text-xs">Venda Proativa: Smart Match!</h3>
                </div>
                <button onClick={() => setShowMatchModal(false)}><XCircle /></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                    {lastMatchedProduct.imageUrl ? <img src={lastMatchedProduct.imageUrl} className="w-full h-full object-cover" /> : <Box className="text-slate-200" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lastMatchedProduct.category} &bull; {lastMatchedProduct.size}</p>
                    <p className="font-black text-slate-900 leading-none mt-1">{lastMatchedProduct.name}</p>
                    <p className="text-[10px] text-amber-600 font-bold mt-1">{lastMatchedProduct.fabric} | {lastMatchedProduct.print}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estes clientes buscam exatamente isso:</p>
                  {matchingCustomers.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100 group hover:scale-[1.02] transition-all">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-amber-500 shadow-sm border border-amber-200">{c.name.charAt(0)}</div>
                         <div>
                            <p className="font-black text-slate-800 text-sm">{c.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold">{c.phone}</p>
                         </div>
                       </div>
                       <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=Olá ${c.name}, temos uma novidade que é a sua cara: ${lastMatchedProduct.name} (Tam: ${lastMatchedProduct.size}). Quer reservar?`} target="_blank" className="px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase">
                          <PhoneCall size={14} /> WhatsApp
                       </a>
                    </div>
                  ))}
                </div>
                
                <button onClick={() => setShowMatchModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Continuar Cadastrando</button>
             </div>
          </div>
        </div>
      )}

      {/* Header Search & Actions */}
      <div className="bg-white p-4 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar por nome, código ou marca..."
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterCategory === cat ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAddModal(true)} disabled={limitReached} className="py-3 px-6 bg-slate-950 text-amber-500 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all">
            <Plus size={18} /> Novo Item
          </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item / Identificação</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Smart Atributos</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
                       {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <Box className="text-slate-300" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{p.code}</span>
                        <h4 className="font-bold text-slate-800">{p.name}</h4>
                      </div>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{p.brand || 'Sem Marca'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex flex-wrap gap-1.5">
                    {p.size && <span className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-black text-slate-600 uppercase">Tam: {p.size}</span>}
                    {p.fabric && <span className="px-2 py-0.5 bg-blue-50 rounded text-[8px] font-black text-blue-600 uppercase border border-blue-100">{p.fabric}</span>}
                    {p.print && <span className="px-2 py-0.5 bg-rose-50 rounded text-[8px] font-black text-rose-600 uppercase border border-rose-100">{p.print}</span>}
                  </div>
                </td>
                <td className="px-10 py-6 font-black text-slate-800">R$ {p.price.toFixed(2)}</td>
                <td className="px-10 py-6">
                  <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase border ${getStatusColor(p.status)}`}>{p.status}</span>
                </td>
                <td className="px-10 py-6 text-right">
                  <button onClick={() => setProducts(prev => prev.filter(item => item.id !== p.id))} className="p-2 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal with Standardized Selection */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 md:p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Cadastro Otimizado</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Use as listas para garantir o Smart Match</p>
              </div>
              <button onClick={() => setShowAddModal(false)}><XCircle size={28} className="text-slate-300" /></button>
            </div>
            
            <div className="p-6 md:p-10 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Item</span>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="Ex: Vestido de Festa" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria Principal</span>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value as Category})}>
                    {categories.filter(c => c !== 'Todos').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </label>
              </div>

              {/* Dynamic Attributes with Lists */}
              <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 space-y-8">
                 <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2"><Sparkles size={14}/> Configuração para Match</h5>
                 
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Tamanho Dinâmico */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><Ruler size={10}/> Tamanho</span>
                      <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none font-black text-white text-xs" value={newProduct.size} onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}>
                        <option value="">Selecione...</option>
                        {(newProduct.category === 'Calçados' ? SIZES_SHOES : SIZES_CLOTHING).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Tipo Dinâmico */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><Layers size={10}/> Tipo</span>
                      <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none font-black text-white text-xs" value={newProduct.subCategory} onChange={(e) => setNewProduct({...newProduct, subCategory: e.target.value})}>
                        <option value="">Selecione...</option>
                        {(newProduct.category === 'Calçados' ? SHOE_TYPES : CLOTHING_TYPES).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><Palette size={10}/> Cor</span>
                      <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none font-black text-white text-xs" value={newProduct.color} onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}>
                         <option value="">Selecione...</option>
                         {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {newProduct.category === 'Roupas' && (
                      <>
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-slate-500 uppercase">Tecido</span>
                          <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none font-black text-white text-xs" value={newProduct.fabric} onChange={(e) => setNewProduct({...newProduct, fabric: e.target.value})}>
                             <option value="">Selecione...</option>
                             {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[9px] font-black text-slate-500 uppercase">Estampa</span>
                          <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none font-black text-white text-xs" value={newProduct.print} onChange={(e) => setNewProduct({...newProduct, print: e.target.value})}>
                             <option value="">Selecione...</option>
                             {PRINTS.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1"><Star size={10}/> Marca</span>
                      <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl outline-none font-black text-white text-xs" placeholder="Ex: Farm, Zara..." value={newProduct.brand} onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})} />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preço de Bazar (R$)</span>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-amber-600" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</span>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={newProduct.condition} onChange={(e) => setNewProduct({...newProduct, condition: e.target.value as any})}>
                    <option value="Novo">Novo (com etiqueta)</option>
                    <option value="Excelente">Excelente (seminovo)</option>
                    <option value="Bom">Bom (uso normal)</option>
                    <option value="Usado">Usado (possui marcas)</option>
                  </select>
                </label>
              </div>

              <button onClick={handleAddProduct} className="w-full py-5 bg-slate-950 text-amber-500 font-black rounded-[2rem] uppercase tracking-widest text-xs shadow-xl hover:bg-black transition-all">
                Salvar Item e Notificar Clientes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
