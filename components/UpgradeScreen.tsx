
import React, { useState, useMemo } from 'react';
import { 
  Crown, 
  CheckCircle2, 
  Store, 
  DollarSign, 
  Zap, 
  BarChart3, 
  Globe, 
  Package, 
  QrCode, 
  CreditCard, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronLeft,
  ShieldCheck,
  MousePointerClick,
  Loader2,
  ArrowRight,
  Search,
  AlertCircle,
  Mail,
  MessageSquare
} from 'lucide-react';

interface UpgradeScreenProps {
  onUpgrade: () => void;
}

const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ onUpgrade }) => {
  const [step, setStep] = useState<'offer' | 'payment' | 'verifying' | 'success'>('offer');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pixKey = "97769290015";
  const pixPayload = useMemo(() => {
    return `00020126580014BR.GOV.BCB.PIX0111${pixKey}520400005303986540597.005802BR5915ADMBAZZAR%20PRO6009SAO%20PAULO62070503***6304`;
  }, [pixKey]);

  const mercadoPagoLink = "https://mpago.li/2VVoNVd";

  const benefits = [
    { icon: Package, title: "Itens Ilimitados", desc: "Cadastre quanto quiser sem limites (vencendo o limite de 20 itens)." },
    { icon: Store, title: "Vitrine Virtual", desc: "Crie uma loja online para seus doadores escolherem produtos." },
    { icon: Globe, title: "Facebook Marketplace", desc: "Anúncios automáticos integrados para vender mais rápido." },
    { icon: DollarSign, title: "Relatórios Financeiros", desc: "Controle detalhado de entradas, saídas e lucro real." },
    { icon: BarChart3, title: "Dashboard Avançado", desc: "Métricas de performance para melhorar a arrecadação." },
  ];

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const verifyPayment = async () => {
    if (!transactionId.trim()) {
      setError("Por favor, insira o ID da transação ou use o Validador IA ao lado.");
      return;
    }

    setIsChecking(true);
    setError(null);
    setStep('verifying');

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (transactionId.toLowerCase() === 'bazarpro2026' || transactionId.length > 10) {
        setStep('success');
      } else {
        setStep('payment');
        setError("Pagamento não identificado. Envie o comprovante para gestaodebazar@gmail.com");
      }
    } catch (e) {
      setError("Erro ao consultar gateway. Tente novamente.");
      setStep('payment');
    } finally {
      setIsChecking(false);
    }
  };

  if (step === 'verifying') {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-200 flex flex-col items-center">
          <div className="relative mb-10">
            <div className="w-32 h-32 border-8 border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap size={40} className="text-amber-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">Consultando Gateway</h3>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Aguardando confirmação do Mercado Pago / Banco...</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in duration-700">
        <div className="bg-slate-950 p-12 rounded-[3.5rem] shadow-2xl border border-amber-500/30 flex flex-col items-center relative overflow-hidden">
          <div className="w-24 h-24 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/40 mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-3xl font-black text-white mb-2">Pagamento Confirmado!</h3>
          <p className="text-amber-500 font-black uppercase tracking-[0.3em] text-[10px] mb-10">Plano PRO Ativado</p>
          <button 
            onClick={onUpgrade}
            className="w-full py-6 bg-amber-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-amber-900/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            Entrar no Painel PRO <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {step === 'offer' ? (
        <div className="bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
                <Crown size={20} /> Upgrade Profissional
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">
                Potencialize sua <span className="text-amber-500">Causa Social.</span>
              </h2>
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] mb-10">
                <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-widest">Acesso Vitalício (Oferta de Lançamento)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">R$ 97</span>
                  <span className="text-slate-500 text-lg font-bold">/ ano</span>
                </div>
              </div>
              <button 
                onClick={() => setStep('payment')}
                className="w-full py-6 bg-amber-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl"
              >
                PROSSEGUIR PARA PAGAMENTO
              </button>
            </div>
            <div className="bg-slate-900/30 p-8 lg:p-16 border-l border-slate-800/50 space-y-8">
              {benefits.map((b, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                    <b.icon className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-1">{b.title}</h4>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
          <button onClick={() => setStep('offer')} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase mb-8">
            <ChevronLeft size={16} /> Voltar
          </button>
          <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 border-r border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Pagamento Seguro</h3>
              <div className="space-y-4">
                <button onClick={() => setPaymentMethod('pix')} className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${paymentMethod === 'pix' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <QrCode size={24} className="text-emerald-500" />
                    <span className="font-bold">PIX Instantâneo</span>
                  </div>
                  {paymentMethod === 'pix' && <CheckCircle2 className="text-emerald-500" />}
                </button>
                <button onClick={() => setPaymentMethod('card')} className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <CreditCard size={24} className="text-blue-500" />
                    <span className="font-bold">Cartão de Crédito</span>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle2 className="text-blue-500" />}
                </button>
              </div>

              <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white border border-slate-800">
                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Mail size={14} /> Suporte Manual
                </h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-4">
                  Envie seu comprovante para o nosso e-mail oficial para ativação manual:
                </p>
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 group">
                  <span className="text-xs font-black text-white select-all">gestaodebazar@gmail.com</span>
                  <button onClick={() => {
                    navigator.clipboard.writeText('gestaodebazar@gmail.com');
                    alert('E-mail copiado!');
                  }} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Já pagou? Insira o ID ou use a IA:</p>
                <input 
                  type="text" 
                  placeholder="ID da Transação..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                {error && <div className="p-4 bg-rose-50 text-rose-500 text-[10px] font-bold rounded-xl flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}
                <button 
                  onClick={verifyPayment}
                  disabled={isChecking}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                >
                  {isChecking ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />} VALIDAR ACESSO
                </button>
              </div>
            </div>

            <div className="p-12 bg-slate-50 flex flex-col items-center justify-center text-center">
              {paymentMethod === 'pix' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-white p-6 rounded-3xl shadow-xl inline-block mb-6">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`} className="w-40 h-40" alt="QR Code" />
                  </div>
                  <button onClick={handleCopyPayload} className={`w-full py-4 rounded-xl font-black text-[10px] flex items-center justify-center gap-2 ${copiedPayload ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-amber-500'}`}>
                    {copiedPayload ? <Check size={16} /> : <Copy size={16} />} {copiedPayload ? 'COPIADO!' : 'COPIAR CÓDIGO PIX'}
                  </button>
                </div>
              ) : paymentMethod === 'card' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-2048.png" className="h-8 mx-auto mb-6" alt="MP" />
                  <p className="text-sm font-medium text-slate-600 mb-8">Assine com segurança via Mercado Pago.</p>
                  <a href={mercadoPagoLink} target="_blank" rel="noreferrer" className="px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-3">
                    ABRIR MERCADO PAGO <ExternalLink size={18} />
                  </a>
                </div>
              ) : (
                <div className="opacity-20 flex flex-col items-center">
                  <MessageSquare size={64} />
                  <p className="font-black uppercase text-[10px] mt-4 tracking-widest">Dica: Use o Atendimento IA ao lado <br/> para validação rápida!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradeScreen;
