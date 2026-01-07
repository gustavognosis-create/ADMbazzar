
import React, { useState, useRef } from 'react';
import { Product, Institution } from '../types';
import { 
  Store, 
  Star, 
  Facebook, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  AlertCircle,
  Package,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Play,
  Zap,
  Download,
  ExternalLink,
  ClipboardCheck,
  Instagram,
  FileText,
  Share2,
  Camera,
  Smartphone,
  ChevronRight
} from 'lucide-react';

interface StorefrontManagerProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  institution: Institution;
}

const StorefrontManager: React.FC<StorefrontManagerProps> = ({ products, setProducts, institution }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'store' | 'facebook' | 'instagram'>('store');
  const [editingMediaProduct, setEditingMediaProduct] = useState<Product | null>(null);
  const [syncProduct, setSyncProduct] = useState<Product | null>(null);
  const [showStoryAssistant, setShowStoryAssistant] = useState<Product | null>(null);
  const [syncSteps, setSyncSteps] = useState({ media: false, text: false });
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const toggleStore = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, inStore: !p.inStore } : p));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file || !editingMediaProduct) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProducts(prev => prev.map(p => 
        p.id === editingMediaProduct.id 
          ? { ...p, [type === 'image' ? 'imageUrl' : 'videoUrl']: base64String } 
          : p
      ));
      setEditingMediaProduct(prev => prev ? { ...prev, [type === 'image' ? 'imageUrl' : 'videoUrl']: base64String } : null);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (syncProduct) setSyncSteps(prev => ({ ...prev, text: true }));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadMedia = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (syncProduct) setSyncSteps(prev => ({ ...prev, media: true }));
  };

  const generateMarketplaceText = (product: Product) => {
    return `
🛒 DISPONÍVEL NO BAZAR: ${product.name.toUpperCase()}
📍 Local: ${institution.name}

Descrição: ${product.description}
💰 Valor: R$ ${product.price.toFixed(2)}
✨ Condição: ${product.condition}
📌 Retirada: ${institution.address}
📞 WhatsApp: ${institution.phone}

Todo valor arrecadado é destinado aos nossos projetos sociais.
#Bazar #Solidariedade #Marketplace #Oferta #${institution.name.replace(/\s/g, '')}
    `.trim();
  };

  const generateCSVFeed = () => {
    const header = "id,title,description,availability,condition,price,link,image_link,brand\n";
    const rows = products
      .filter(p => p.inStore)
      .map(p => {
        return `${p.id},"${p.name}","${p.description}",in stock,${p.condition === 'Novo' ? 'new' : 'used'},"${p.price.toFixed(2)} BRL","https://bazar.com/item/${p.id}","${p.imageUrl || ''}","${institution.name}"`;
      }).join("\n");
    
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalogo-instagram-${institution.name.toLowerCase().replace(/\s/g, '-')}.csv`;
    a.click();
  };

  const filteredProducts = products.filter(p => p.inStore || activeTab === 'store');

  return (
    <div className="space-y-8 pb-20">
      {/* Dynamic Header */}
      <div className={`p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden transition-all duration-500 border ${
        activeTab === 'facebook' ? 'bg-blue-900 border-blue-800' : 
        activeTab === 'instagram' ? 'bg-gradient-to-br from-purple-800 via-rose-700 to-amber-700 border-rose-800' : 
        'bg-slate-950 border-slate-800'
      }`}>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-xl text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                {activeTab === 'facebook' ? <Facebook size={28} /> : 
                 activeTab === 'instagram' ? <Instagram size={28} /> : 
                 <Store size={28} />}
              </div>
              <h2 className="text-3xl font-black tracking-tight">
                {activeTab === 'facebook' ? 'Facebook Marketplace' : 
                 activeTab === 'instagram' ? 'Instagram Shopping' : 
                 'Vitrine Digital'}
              </h2>
            </div>
            <p className="text-white/70 text-lg leading-relaxed font-medium">
              {activeTab === 'facebook' ? 'Sincronize seus itens com o Marketplace local em segundos.' : 
               activeTab === 'instagram' ? 'Ative a sacolinha e gerencie seu catálogo de produtos no Instagram.' : 
               'Gerencie a visibilidade dos seus itens na sua loja online pública.'}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            {activeTab === 'instagram' && (
              <button onClick={generateCSVFeed} className="px-8 py-4 bg-white text-rose-600 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                <FileText size={18} /> Exportar Feed CSV
              </button>
            )}
            {activeTab === 'store' && (
              <button className="px-8 py-4 bg-amber-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3">
                <Eye size={18} /> Ver Loja Pública
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'store', label: 'Vitrine Online', icon: Store },
          { id: 'facebook', label: 'Facebook Marketplace', icon: Facebook },
          { id: 'instagram', label: 'Instagram Shop', icon: Instagram },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full animate-in slide-in-from-left duration-300"></div>}
          </button>
        ))}
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
            {/* Media Area */}
            <div className="h-64 relative overflow-hidden bg-slate-100">
              {product.videoUrl ? (
                <video src={product.videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                  <Package size={48} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sem Mídia</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-sm">
                <button onClick={() => setEditingMediaProduct(product)} className="p-4 bg-white text-slate-900 rounded-2xl hover:scale-110 shadow-xl" title="Alterar Mídia"><Upload size={24} /></button>
                <button onClick={() => toggleStore(product.id)} className={`p-4 rounded-2xl hover:scale-110 shadow-xl ${product.inStore ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {product.inStore ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 pr-4">
                  <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{product.name}</h4>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-950">R$ {product.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Botões de Ação por Canal */}
              <div className="space-y-3">
                {activeTab === 'facebook' ? (
                  <button 
                    onClick={() => { setSyncProduct(product); setSyncSteps({ media: false, text: false }); }}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/10"
                  >
                    <Zap size={16} /> Turbo-Sinc FB
                  </button>
                ) : activeTab === 'instagram' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setShowStoryAssistant(product)}
                      className="py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 size={14} /> Story Script
                    </button>
                    <button 
                       onClick={() => copyToClipboard(`🛒 ${product.name}\n💰 R$ ${product.price.toFixed(2)}\n✨ ${product.condition}\n📍 Disponível em: ${institution.name}`, product.id)}
                       className="py-4 bg-slate-50 text-slate-600 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      {copiedId === product.id ? <Check size={14} /> : <Copy size={14} />} Legenda
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => copyToClipboard(generateMarketplaceText(product), product.id)}
                    className="w-full py-4 bg-slate-900 text-amber-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3"
                  >
                    {copiedId === product.id ? <Check size={16} /> : <Copy size={16} />} Copiar Link Vitrine
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Turbo-Sinc Facebook */}
      {syncProduct && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-lg z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
              <div className="flex items-center gap-4">
                <Zap size={24} />
                <h3 className="font-black uppercase tracking-widest text-sm">Turbo-Sinc Facebook</h3>
              </div>
              <button onClick={() => setSyncProduct(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={28} /></button>
            </div>
            
            <div className="p-10 space-y-6">
              <div className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all ${syncSteps.media ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${syncSteps.media ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>01</div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-900">Mídia</p>
                  <p className="text-[10px] text-slate-500 font-medium">Baixe a foto/vídeo.</p>
                </div>
                <button onClick={() => downloadMedia(syncProduct.imageUrl || '', `bazar-${syncProduct.id}.jpg`)} className="p-4 bg-white text-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <Download size={20} />
                </button>
              </div>

              <div className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all ${syncSteps.text ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${syncSteps.text ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>02</div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-900">Dados</p>
                  <p className="text-[10px] text-slate-500 font-medium">Copie a descrição otimizada.</p>
                </div>
                <button onClick={() => copyToClipboard(generateMarketplaceText(syncProduct), syncProduct.id)} className={`p-4 rounded-2xl shadow-sm transition-all ${copiedId === syncProduct.id ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900'}`}>
                   {copiedId === syncProduct.id ? <Check size={20} /> : <ClipboardCheck size={20} />}
                </button>
              </div>

              <div className="flex items-center gap-6 p-6 rounded-3xl border-2 bg-slate-950 text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black">03</div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-widest">Postar</p>
                  <p className="text-[10px] text-white/50 font-medium">Abrir Marketplace e colar dados.</p>
                </div>
                <a href="https://www.facebook.com/marketplace/create/item" target="_blank" rel="noreferrer" className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-all">
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Story Assistant Instagram */}
      {showStoryAssistant && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-lg z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-600 to-rose-500 text-white">
              <div className="flex items-center gap-4">
                <Camera size={24} />
                <h3 className="font-black uppercase tracking-widest text-sm">Story Assistant</h3>
              </div>
              <button onClick={() => setShowStoryAssistant(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={28} /></button>
            </div>
            <div className="p-10 space-y-8 text-center">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Roteiro sugerido:</p>
                <p className="text-slate-800 font-medium leading-relaxed italic">
                  "Gente, olha o que acabou de chegar no bazar da {institution.name}! 😱 <br/><br/>
                  Este item {showStoryAssistant.name} está em excelente estado e por apenas <b>R$ {showStoryAssistant.price.toFixed(2)}</b>. <br/><br/>
                  Corre que é peça única! Todo valor vai para nossa causa. ❤️"
                </p>
              </div>
              <button 
                onClick={() => copyToClipboard(`Chegou: ${showStoryAssistant.name}! Apenas R$ ${showStoryAssistant.price.toFixed(2)} na {institution.name}. Link na bio!`, 'story')}
                className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 transition-all shadow-xl"
              >
                {copiedId === 'story' ? 'Texto Copiado!' : 'Copiar Legenda do Story'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Media Manager */}
      {editingMediaProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Gerenciar Mídia</h3>
              <button onClick={() => setEditingMediaProduct(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6 text-center">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => imageInputRef.current?.click()} className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center gap-3 hover:border-amber-500 transition-all group">
                  <ImageIcon size={32} className="text-slate-300 group-hover:text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Foto</span>
                  <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={(e) => handleFileUpload(e, 'image')} />
                </button>
                <button onClick={() => videoInputRef.current?.click()} className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center gap-3 hover:border-rose-500 transition-all group">
                  <VideoIcon size={32} className="text-slate-300 group-hover:text-rose-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add Vídeo</span>
                  <input type="file" accept="video/*" className="hidden" ref={videoInputRef} onChange={(e) => handleFileUpload(e, 'video')} />
                </button>
              </div>
              <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                {editingMediaProduct.videoUrl ? <video src={editingMediaProduct.videoUrl} className="w-full h-full object-cover" controls /> : 
                 editingMediaProduct.imageUrl ? <img src={editingMediaProduct.imageUrl} className="w-full h-full object-cover" /> : 
                 <p className="text-xs font-bold text-slate-300">Nenhuma mídia enviada</p>}
              </div>
              <button onClick={() => setEditingMediaProduct(null)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Finalizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontManager;
