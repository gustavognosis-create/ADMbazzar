
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Donation, Donor, Product, Category, ProductStatus, Institution } from '../types';
import { 
  ClipboardList, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Calendar, 
  User, 
  DollarSign, 
  FileText,
  Heart,
  Printer,
  Mail,
  Send,
  Loader2,
  X
} from 'lucide-react';

interface DonationsManagerProps {
  donations: Donation[];
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>;
  donors: Donor[];
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  institution: Institution;
}

const DonationsManager: React.FC<DonationsManagerProps> = ({ donations, setDonations, donors, products, setProducts, institution }) => {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailToRecipient, setEmailToRecipient] = useState('');
  
  const [newDonation, setNewDonation] = useState<Partial<Donation>>({
    donorId: '',
    itemsDescription: '',
    estimatedValue: 0
  });

  const categoryPrefixes: Record<Category, string> = {
    'Roupas': 'R',
    'Calçados': 'C',
    'Acessórios': 'A',
    'Casa': 'CS',
    'Brinquedos': 'B',
    'Eletros': 'E',
    'Móveis': 'M',
    'Outros': 'O'
  };

  const generateCode = (category: Category) => {
    const prefix = categoryPrefixes[category];
    const categoryProducts = products.filter(p => p.category === category);
    const maxNum = categoryProducts.reduce((max, p) => {
      const match = p.code.match(new RegExp(`^${prefix}(\\d+)$`));
      if (match) {
        const num = parseInt(match[1]);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    return `${prefix}${(maxNum + 1).toString().padStart(2, '0')}`;
  };

  const updateStatus = (id: string, newStatus: Donation['status']) => {
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const handleAddDonation = () => {
    if (!newDonation.itemsDescription) return;

    const donationToAdd: Donation = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      donorId: newDonation.donorId || 'anonimo',
      date: new Date().toISOString(),
      status: 'Triagem',
      itemsDescription: newDonation.itemsDescription!,
      estimatedValue: Number(newDonation.estimatedValue) || 0
    };

    setDonations(prev => [donationToAdd, ...prev]);
    setShowAddModal(false);
    setNewDonation({ donorId: '', itemsDescription: '', estimatedValue: 0 });
  };

  const moveToInventory = (donation: Donation, finalStatus: ProductStatus) => {
    const selectedCategory: Category = 'Outros'; 
    const generatedCode = generateCode(selectedCategory);

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      code: generatedCode,
      name: donation.itemsDescription,
      description: `Doação #${donation.id}`,
      category: selectedCategory,
      price: donation.estimatedValue || 0,
      stock: 1,
      condition: 'Bom',
      status: finalStatus
    };
    
    setProducts(prev => [...prev, newProduct]);
    updateStatus(donation.id, 'Estoque');
    setSelectedDonation(null);
  };

  const getStatusStyle = (status: Donation['status']) => {
    switch (status) {
      case 'Triagem': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Estoque': return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'Descartado': return 'bg-rose-50 text-rose-600 border-rose-200';
    }
  };

  const openReceiptModal = (donation: Donation) => {
    setSelectedDonation(donation);
    const donor = donors.find(d => d.id === donation.donorId);
    setEmailToRecipient(donor?.email || '');
    setEmailSent(false);
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendDonationEmail = async () => {
    if (!selectedDonation || !emailToRecipient) return;
    const donor = donors.find(d => d.id === selectedDonation.donorId);
    
    setIsSendingEmail(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Gere um e-mail que sirva como RECIBO DIGITAL de doação para o bazar "${institution.bazarName || institution.name}".
        Doador: ${donor?.name || 'Doador Anônimo'}
        Itens doados: ${selectedDonation.itemsDescription}
        Valor Estimado: R$ ${selectedDonation.estimatedValue?.toFixed(2) || 'Não informado'}
        ID da Doação: ${selectedDonation.id}
        Data: ${new Date(selectedDonation.date).toLocaleDateString()}
        
        O e-mail deve começar formalmente com o Recibo, listando os itens e o valor, seguido de uma mensagem de profunda gratidão. Explique que essa doação apoia a causa da nossa instituição.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      console.log("E-mail de recibo de doação simulado enviado para:", emailToRecipient);
      console.log("Conteúdo Gerado pela IA:", response.text);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailSent(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center shadow-sm">
          <div>
            <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
              <ClipboardList size={18} className="text-blue-600" /> Triagem de Entrada
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1">{donations.length} lotes pendentes</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all">
            <Plus size={16} /> Registrar Lote
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {donations.map(donation => (
            <div key={donation.id} onClick={() => openReceiptModal(donation)} className={`p-6 bg-white rounded-[2rem] border transition-all cursor-pointer ${selectedDonation?.id === donation.id ? 'border-blue-500 ring-4 ring-blue-500/5' : 'border-slate-100'}`}>
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(donation.status)}`}>{donation.status}</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openReceiptModal(donation); }}
                    className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <FileText size={16} />
                    <span className="text-[9px] font-black uppercase">Recibo</span>
                  </button>
                  <span className="text-[10px] font-bold text-slate-400">{new Date(donation.date).toLocaleDateString()}</span>
                </div>
              </div>
              <h4 className="font-black text-slate-800 text-lg mb-1">{donation.itemsDescription}</h4>
              <p className="text-xs font-bold text-slate-400 truncate">Doador: {donors.find(d => d.id === donation.donorId)?.name || 'Anônimo'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-8">
          {selectedDonation ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Gestão do Lote</h3>
                <button 
                  onClick={() => setShowReceipt(true)}
                  className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  title="Visualizar Recibo"
                >
                  <Printer size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <button onClick={() => moveToInventory(selectedDonation, 'Estoque')} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-slate-700 font-bold border border-slate-100 hover:bg-slate-100 transition-all">
                   <span>Mover p/ Estoque Interno</span> <ArrowRight size={18} />
                </button>
                <button onClick={() => moveToInventory(selectedDonation, 'Bazar')} className="w-full flex items-center justify-between p-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all">
                   <span>Direto p/ Bazar (Loja)</span> <ArrowRight size={18} />
                </button>
                <button onClick={() => moveToInventory(selectedDonation, 'Loja Online')} className="w-full flex items-center justify-between p-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all">
                   <span>Direto p/ Loja Online</span> <ArrowRight size={18} />
                </button>
                <button onClick={() => updateStatus(selectedDonation.id, 'Descartado')} className="w-full p-4 border border-rose-100 text-rose-500 rounded-2xl font-bold text-xs hover:bg-rose-50 transition-all">Descartar Lote</button>
              </div>
            </div>
          ) : (
             <div className="text-center py-20 opacity-40">
                <ClipboardList size={40} className="mx-auto mb-4" />
                <p className="text-xs font-black uppercase">Selecione um lote</p>
             </div>
          )}
        </div>
      </div>

      {/* MODAL DE RECIBO DE DOAÇÃO COM OPÇÃO DE EMAIL */}
      {showReceipt && selectedDonation && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300 max-h-[90vh]">
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center flex-shrink-0">
               <div className="flex items-center gap-3">
                 <Heart size={24} className="fill-white" />
                 <h3 className="font-black uppercase tracking-widest text-sm">Recibo de Doação</h3>
               </div>
               <button onClick={() => setShowReceipt(false)} className="hover:bg-white/20 p-2 rounded-full transition-all">
                 <X size={20} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div id="printable-receipt" className="bg-white p-6 shadow-inner border border-slate-100 rounded-2xl font-mono text-[11px] text-slate-800 leading-tight mb-6">
                <div className="text-center mb-6 space-y-1">
                  <p className="font-black text-sm uppercase">{institution.bazarName || institution.name}</p>
                  <p>CNPJ: {institution.cnpj}</p>
                  <p className="text-[9px]">{institution.address}</p>
                  <p className="border-b border-dashed border-slate-300 pt-4"></p>
                </div>

                <div className="mb-6 space-y-4">
                  <div className="text-center uppercase font-black tracking-widest text-xs">Comprovante de Doação</div>
                  <p className="text-justify leading-relaxed">
                    Recebemos de <span className="font-black">{(donors.find(d => d.id === selectedDonation.donorId)?.name || 'DOADOR ANÔNIMO').toUpperCase()}</span>, 
                    a doação dos itens descritos abaixo para fins de comercialização em nosso bazar beneficente.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
                  <p className="font-black uppercase text-[9px] mb-2 text-slate-400 tracking-widest">Descrição dos Itens</p>
                  <p className="font-bold text-slate-900 leading-tight">{selectedDonation.itemsDescription}</p>
                  {selectedDonation.estimatedValue && (
                    <p className="mt-3 text-[10px] font-black">VALOR ESTIMADO: R$ {selectedDonation.estimatedValue.toFixed(2)}</p>
                  )}
                </div>

                <div className="text-[9px] text-justify space-y-2 mb-8 italic text-slate-500">
                  <p>O doador declara que os itens acima são de sua propriedade e estão livres de ônus, autorizando sua venda.</p>
                  <p>O valor arrecadado será integralmente destinado aos projetos de assistência social da instituição.</p>
                </div>

                <div className="text-center mt-10 pt-4 border-t border-dashed border-slate-300 opacity-50 text-[8px]">
                  <p>REGISTRO: {selectedDonation.id}</p>
                  <p>DATA: {new Date(selectedDonation.date).toLocaleString()}</p>
                  <p className="mt-4 font-black">OBRIGADO POR SUA SOLIDARIEDADE!</p>
                </div>
              </div>

              {/* OPÇÃO DE ENVIAR RECIBO POR E-MAIL */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Mail size={16} className="text-blue-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enviar Recibo Digital (Email)</span>
                </div>
                {emailSent ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={20} />
                    <span className="text-xs font-bold uppercase tracking-tight">Recibo Enviado!</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="e-mail do doador..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      value={emailToRecipient}
                      onChange={(e) => setEmailToRecipient(e.target.value)}
                    />
                    <button 
                      onClick={handleSendDonationEmail}
                      disabled={isSendingEmail || !emailToRecipient}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isSendingEmail ? (
                        <> <Loader2 size={14} className="animate-spin" /> Processando... </>
                      ) : (
                        <> <Send size={14} /> Enviar p/ Doador </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-white border-t border-slate-100 grid grid-cols-1 gap-3 flex-shrink-0">
               <button 
                 onClick={handlePrint}
                 className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-black transition-all"
               >
                 <Printer size={18} /> Imprimir Recibo
               </button>
               <button 
                 onClick={() => setShowReceipt(false)}
                 className="w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
               >
                 Fechar
               </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 space-y-6">
             <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-black text-slate-900">Novo Recebimento</h4>
                <button onClick={() => setShowAddModal(false)}><XCircle className="text-slate-300" /></button>
             </div>
             
             <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doador</span>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold outline-none appearance-none"
                    value={newDonation.donorId}
                    onChange={e => setNewDonation({...newDonation, donorId: e.target.value})}
                  >
                    <option value="anonimo">Doador Anônimo</option>
                    {donors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição dos Itens</span>
                  <textarea className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 font-bold outline-none" rows={3} placeholder="Ex: 5 camisas, 2 calças jeans, 1 par de tênis..." value={newDonation.itemsDescription} onChange={e => setNewDonation({...newDonation, itemsDescription: e.target.value})} />
                </label>

                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Estimado Total (R$)</span>
                  <input type="number" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 font-bold outline-none" placeholder="0.00" value={newDonation.estimatedValue} onChange={e => setNewDonation({...newDonation, estimatedValue: parseFloat(e.target.value)})} />
                </label>
             </div>

             <button onClick={handleAddDonation} className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Registrar e Gerar Lote</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsManager;
