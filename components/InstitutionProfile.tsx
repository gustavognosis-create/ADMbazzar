
import React, { useState, useRef } from 'react';
import { Institution } from '../types';
import { Building2, Save, FileText, MapPin, Phone, ShieldCheck, CreditCard, ExternalLink, Zap, Percent, Camera, Upload, Image as ImageIcon, Mail } from 'lucide-react';

interface InstitutionProfileProps {
  institution: Institution;
  setInstitution: React.Dispatch<React.SetStateAction<Institution>>;
}

const InstitutionProfile: React.FC<InstitutionProfileProps> = ({ institution, setInstitution }) => {
  const [formData, setFormData] = useState(institution);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'geral' | 'integracoes' | 'regras'>('geral');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setInstitution(formData);
    setIsEditing(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all ${formData.logoUrl ? 'p-1 bg-white' : 'bg-slate-950 text-amber-500'}`}>
              {formData.logoUrl ? (
                <img src={formData.logoUrl} className="w-full h-full object-contain rounded-xl" alt="Logo preview" />
              ) : (
                <Building2 size={32} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Configurações</h2>
              <p className="text-sm font-medium text-slate-500">Gerencie os dados da sua instituição e branding.</p>
            </div>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:shadow-md transition-all"
            >
              Editar
            </button>
          )}
        </div>

        <div className="flex border-b border-slate-100 px-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('geral')}
            className={`py-4 px-6 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'geral' ? 'text-slate-950' : 'text-slate-400'}`}
          >
            Dados Gerais & Branding
            {activeTab === 'geral' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('regras')}
            className={`py-4 px-6 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'regras' ? 'text-slate-950' : 'text-slate-400'}`}
          >
            Regras de Repasse
            {activeTab === 'regras' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('integracoes')}
            className={`py-4 px-6 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'integracoes' ? 'text-slate-950' : 'text-slate-400'}`}
          >
            Integrações
            {activeTab === 'integracoes' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-t-full"></div>}
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'geral' ? (
            <div className="space-y-8">
              {/* Branding Section */}
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Identidade Visual (Exclusivo PRO)</h4>
                
                <div className="flex flex-col md:flex-row gap-8 items-center">
                   <div 
                     onClick={() => isEditing && institution.isPro && fileInputRef.current?.click()}
                     className={`w-32 h-32 rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden group ${
                       !institution.isPro ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-indigo-400'
                     } ${formData.logoUrl ? 'border-indigo-500' : 'border-slate-300'}`}
                   >
                     {formData.logoUrl ? (
                       <img src={formData.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                     ) : (
                       <>
                         <Camera size={24} className="text-slate-300" />
                         <span className="text-[9px] font-black text-slate-400 uppercase">Logo</span>
                       </>
                     )}
                     {isEditing && institution.isPro && (
                       <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Upload size={24} className="text-white" />
                       </div>
                     )}
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                   </div>

                   <div className="flex-1 w-full space-y-4">
                      <label className="block space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Seu Bazar</span>
                        <input 
                          type="text"
                          disabled={!isEditing || !institution.isPro}
                          placeholder={!institution.isPro ? "Requer Plano PRO" : "Ex: Bazar Solidário Amparo"}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-800 disabled:opacity-50"
                          value={formData.bazarName}
                          onChange={(e) => setFormData({...formData, bazarName: e.target.value})}
                        />
                      </label>
                      {!institution.isPro && (
                        <div className="flex items-center gap-2 text-amber-600">
                          <Zap size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Ative o PRO para personalizar sua marca</span>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Building2 size={14} /> Razão Social</span>
                  <input 
                    type="text"
                    disabled={!isEditing}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-slate-800 disabled:opacity-60"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FileText size={14} /> CNPJ</span>
                  <input 
                    type="text"
                    disabled={!isEditing}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-slate-800 disabled:opacity-60"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Mail size={14} /> E-mail Institucional</span>
                  <input 
                    type="email"
                    disabled={!isEditing}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-slate-800 disabled:opacity-60"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Phone size={14} /> Telefone de Contato</span>
                  <input 
                    type="text"
                    disabled={!isEditing}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-slate-800 disabled:opacity-60"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14} /> Endereço Sede</span>
                <input 
                  type="text"
                  disabled={!isEditing}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-slate-800 disabled:opacity-60"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </label>
            </div>
          ) : activeTab === 'regras' ? (
            <div className="space-y-8">
               <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
                  <h4 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Percent size={18} className="text-amber-500" /> Taxa de Afiliados
                  </h4>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed mb-6">
                    Defina a porcentagem padrão de comissão que seus parceiros receberão sobre as vendas geradas através de links de indicação.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative max-w-[180px]">
                      <input 
                        type="number"
                        disabled={!isEditing}
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-black text-slate-800 pr-12"
                        value={formData.commissionRate || 30}
                        onChange={(e) => setFormData({...formData, commissionRate: parseInt(e.target.value)})}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Padrão: 30%</span>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                  <Zap size={20} className="text-amber-500 flex-shrink-0" />
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    Nota: Alterar a taxa de comissão não afeta vendas já concluídas, apenas novos registros de transações via afiliado.
                  </p>
               </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-2048.png" className="w-10" alt="Mercado Pago" />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-1">Mercado Pago</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">Integre sua conta para receber pagamentos via Cartão e PIX diretamente no checkout do seu Bazar.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.mercadoPagoEnabled}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, mercadoPagoEnabled: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className={`space-y-6 transition-opacity ${formData.mercadoPagoEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <label className="block space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={14} /> Public Key (Credencial de Produção)
                    </span>
                    <a href="https://www.mercadopago.com.br/developers/panel/credentials" target="_blank" className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                      Onde encontro? <ExternalLink size={10} />
                    </a>
                  </div>
                  <input 
                    type="password"
                    disabled={!isEditing}
                    placeholder="APP_USR-XXXXX-XXXXX..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-mono text-xs text-slate-800"
                    value={formData.mercadoPagoPublicKey || ''}
                    onChange={(e) => setFormData({...formData, mercadoPagoPublicKey: e.target.value})}
                  />
                </label>
                
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                    <Zap size={12} className="inline mr-1" /> Nota: Para segurança máxima, recomendamos utilizar apenas a Public Key. O ADMbazzar não armazena seu Access Token secreto.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="pt-10 flex gap-4">
              <button 
                onClick={handleSave}
                className="flex-1 py-5 bg-slate-950 text-amber-500 font-black rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
              >
                <Save size={18} /> Salvar Configurações
              </button>
              <button 
                onClick={() => {setFormData(institution); setIsEditing(false);}}
                className="px-8 py-5 bg-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionProfile;
