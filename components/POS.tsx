
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Product, Transaction, Customer, Institution, PaymentItem } from '../types';
import { 
  Search, 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Trash2, 
  Plus, 
  Printer, 
  X, 
  CheckCircle2, 
  Mail, 
  Send, 
  Loader2,
  User as UserIcon,
  ArrowLeft,
  Divide,
  Calculator,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface POSProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  customers: Customer[];
  institution: Institution;
}

const POS: React.FC<POSProps> = ({ products, setProducts, transactions, setTransactions, customers, institution }) => {
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Transaction['paymentMethod']>('Dinheiro');
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [lastSale, setLastSale] = useState<{items: any[], total: number, breakdown: PaymentItem[], id: string, customer?: Customer | null} | null>(null);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [splitPayments, setSplitPayments] = useState<Record<string, number>>({
    'Dinheiro': 0, 'PIX': 0, 'Cartão': 0
  });

  const [emailToPrint, setEmailToPrint] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const filteredProducts = products.filter(p => 
    p.stock > 0 && 
    (p.status === 'Bazar' || p.status === 'Loja Online' || p.status === 'Estoque') &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const total: number = cart.reduce((acc: number, curr) => acc + (curr.product.price * curr.quantity), 0);
  const splitTotal: number = (Object.values(splitPayments) as number[]).reduce((a, b) => a + b, 0);
  const remainingSplit: number = total - splitTotal;

  const finalizeSale = () => {
    if (cart.length === 0) return;
    if (isSplitMode && Math.abs(remainingSplit) > 0.01) {
      alert("A soma dos pagamentos não confere com o total!");
      return;
    }

    const saleId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const finalBreakdown: PaymentItem[] = isSplitMode 
      ? (Object.entries(splitPayments) as [string, number][])
          .filter(([_, amount]) => amount > 0)
          .map(([method, amount]) => ({ method: method as any, amount }))
      : [{ method: paymentMethod as any, amount: total }];

    const newTransaction: Transaction = {
      id: saleId,
      date: new Date().toISOString(),
      type: 'Entrada',
      amount: total,
      description: `Venda ${isSplitMode ? '(Múltiplos)' : `(${paymentMethod})`} de ${cart.length} itens`,
      paymentMethod: isSplitMode ? 'Múltiplo' : paymentMethod,
      paymentBreakdown: finalBreakdown
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(item => item.product.id === p.id);
      if (cartItem) {
        const remainingStock = p.stock - cartItem.quantity;
        return { ...p, stock: remainingStock, status: remainingStock === 0 ? 'Vendido' : p.status };
      }
      return p;
    }));

    setLastSale({ items: [...cart], total, breakdown: finalBreakdown, id: saleId, customer: selectedCustomer });
    setEmailToPrint(selectedCustomer?.email || '');
    setCart([]);
    setShowReceipt(true);
    setEmailSent(false);
    setIsSplitMode(false);
    setSplitPayments({ 'Dinheiro': 0, 'PIX': 0, 'Cartão': 0 });
  };

  const handleSendEmail = async () => {
    if (!emailToPrint || !lastSale) return;
    setIsSendingEmail(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere um agradecimento caloroso para um cliente do bazar beneficente "${institution.name}". Compra #${lastSale.id}`,
      });
      setEmailSent(true);
    } catch (e) { console.error(e); } finally { setIsSendingEmail(false); }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 md:gap-8 h-full">
      {/* Search & Products */}
      <div className="lg:col-span-3 bg-white rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col overflow-hidden min-h-[400px]">
        <div className="p-4 md:p-8 border-b border-slate-100 bg-slate-50/30">
          <div className="flex flex-col gap-3">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 appearance-none text-xs md:text-sm"
                  value={selectedCustomer?.id || ''}
                  onChange={(e) => setSelectedCustomer(customers.find(c => c.id === e.target.value) || null)}
                >
                  <option value="">Cliente Anônimo</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-4 md:p-6 bg-white border border-slate-100 rounded-2xl md:rounded-3xl hover:border-amber-500 hover:shadow-lg transition-all text-left flex flex-col justify-between"
            >
              <div>
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.code}</span>
                <h4 className="font-black text-slate-800 leading-tight text-xs md:text-sm truncate mt-1">{product.name}</h4>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm md:text-lg font-black text-slate-900">R$ {product.price.toFixed(2)}</span>
                <div className="p-1.5 md:p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <Plus size={14} className="md:w-4 md:h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className={`lg:col-span-2 flex flex-col gap-6 fixed bottom-0 left-0 right-0 md:static bg-white md:bg-transparent z-40 transition-all duration-300 ${isCartExpanded ? 'h-[80vh]' : 'h-24 md:h-auto'}`}>
        {/* Mobile Header Toggle */}
        <button 
          onClick={() => setIsCartExpanded(!isCartExpanded)}
          className="md:hidden w-full h-24 p-6 bg-slate-950 flex items-center justify-between text-white"
        >
          <div className="flex items-center gap-4">
             <div className="relative">
               <ShoppingCart size={24} className="text-amber-500" />
               <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-slate-500">Total Venda</p>
                <p className="text-xl font-black">R$ {total.toFixed(2)}</p>
             </div>
          </div>
          {isCartExpanded ? <ChevronDown /> : <ChevronUp />}
        </button>

        <div className={`bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-200/60 flex-1 flex flex-col overflow-hidden ${!isCartExpanded && 'hidden md:flex'}`}>
          <div className="hidden md:flex p-6 md:p-8 bg-slate-950 border-b border-slate-900 justify-between items-center text-white">
            <h3 className="font-black flex items-center gap-3 text-xs uppercase tracking-widest"><ShoppingCart size={18} className="text-amber-500" /> Carrinho</h3>
            <span className="text-xs font-black bg-amber-500 text-white px-3 py-1.5 rounded-full">{cart.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                <div className="flex-1 overflow-hidden">
                  <h5 className="text-[11px] md:text-xs font-black text-slate-800 truncate">{item.product.name}</h5>
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-400">{item.quantity}x R$ {item.product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="font-black text-slate-800 text-xs md:text-sm">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 space-y-4 md:space-y-6">
            <div className="hidden md:flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-3xl md:text-4xl font-black text-slate-900">R$ {total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center bg-white p-2.5 md:p-3 rounded-xl md:rounded-2xl border border-slate-200">
               <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Divide size={12}/> Múltiplos</span>
               <button onClick={() => setIsSplitMode(!isSplitMode)} className={`w-10 h-5 md:w-12 md:h-6 rounded-full transition-all relative ${isSplitMode ? 'bg-amber-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isSplitMode ? 'left-5.5 md:left-7' : 'left-0.5 md:left-1'}`}></div>
               </button>
            </div>

            {isSplitMode ? (
              <div className="space-y-3 md:space-y-4">
                {['Dinheiro', 'PIX', 'Cartão'].map(method => (
                  <div key={method} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100">
                    <span className="w-16 text-[9px] font-black uppercase text-slate-400">{method}</span>
                    <input type="number" className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-lg outline-none font-black text-xs" placeholder="0,00" value={splitPayments[method] || ''} onChange={(e) => setSplitPayments({...splitPayments, [method]: parseFloat(e.target.value) || 0})} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {['Dinheiro', 'PIX', 'Cartão'].map(method => (
                  <button key={method} onClick={() => setPaymentMethod(method as any)} className={`py-3 md:py-4 rounded-xl md:rounded-2xl border transition-all text-[9px] md:text-[10px] font-black uppercase ${paymentMethod === method ? 'bg-amber-500 text-white' : 'bg-white text-slate-500'}`}>{method}</button>
                ))}
              </div>
            )}

            <button 
               onClick={finalizeSale} 
               disabled={cart.length === 0 || (isSplitMode && remainingSplit !== 0)} 
               className="w-full py-4 md:py-6 bg-slate-950 text-white font-black rounded-xl md:rounded-2xl uppercase tracking-widest text-[10px] disabled:opacity-30"
            >
               FINALIZAR VENDA
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal (Simplified for mobile) */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-slate-950/90 z-[200] flex items-center justify-center p-2 md:p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300 max-h-[95vh]">
            <div className="p-6 md:p-8 bg-emerald-500 text-white flex justify-between items-center">
               <h3 className="font-black uppercase tracking-widest text-xs">Venda Realizada</h3>
               <button onClick={() => setShowReceipt(false)} className="p-2 rounded-full hover:bg-white/20"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
               <div id="printable-receipt" className="bg-white p-4 md:p-6 border border-slate-100 rounded-xl font-mono text-[10px] mb-4">
                  <p className="text-center font-black uppercase mb-2">{institution.bazarName || institution.name}</p>
                  <p className="border-b border-dashed border-slate-300 pb-2 mb-2"></p>
                  {lastSale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between mb-1">
                      <span className="truncate flex-1">{item.product.name}</span>
                      <span className="ml-2">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <p className="border-b border-dashed border-slate-300 pt-2 mb-2"></p>
                  <div className="flex justify-between font-black text-xs"><span>TOTAL</span><span>R$ {lastSale.total.toFixed(2)}</span></div>
               </div>
               <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase mb-2"><Printer size={16} className="inline mr-2"/> Imprimir</button>
               <button onClick={() => setShowReceipt(false)} className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-black text-[10px] uppercase"><ArrowLeft size={16} className="inline mr-2"/> Voltar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
