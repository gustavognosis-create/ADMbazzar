
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Bot, 
  Send, 
  X, 
  Paperclip, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Maximize2,
  Minimize2,
  BrainCircuit,
  Zap,
  Image as ImageIcon
} from 'lucide-react';

interface PaymentAIValidatorProps {
  onValidated: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const PaymentAIValidator: React.FC<PaymentAIValidatorProps> = ({ onValidated, isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', content: string, image?: string}[]>([
    { role: 'ai', content: 'Olá! Sou seu assistente de ativação PRO. Já realizou o pagamento de R$ 97,00? Envie uma foto do seu comprovante aqui que eu analiso e libero seu acesso agora mesmo!' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeReceipt = async (base64Image: string) => {
    setIsAnalyzing(true);
    setMessages(prev => [...prev, { role: 'ai', content: 'Estou analisando seu comprovante... Só um momento.' }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const prompt = `
        Analise esta imagem de comprovante de pagamento. 
        Procure por:
        1. Valor de aproximadamente R$ 97,00.
        2. Palavras como "Comprovante", "Transferência", "PIX" ou "Pagamento".
        3. Status de "Concluído", "Sucesso" ou "Efetivado".

        Responda em formato JSON (somente o JSON):
        {
          "isValid": boolean,
          "reason": "uma frase curta explicando o que encontrou",
          "confidence": number (0-1)
        }
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: prompt },
              { 
                inlineData: { 
                  mimeType: 'image/jpeg', 
                  data: base64Image.split(',')[1] 
                } 
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(result.text || '{}');

      if (data.isValid && data.confidence > 0.7) {
        setMessages(prev => [...prev, { role: 'ai', content: `Excelente! Identifiquei seu pagamento de R$ 97,00. Seu acesso PRO foi liberado com sucesso! 🎉` }]);
        setTimeout(() => {
          onValidated();
        }, 2000);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: `Humm, não consegui validar totalmente esse comprovante. Erro: ${data.reason}. Você pode tentar outra foto ou enviar para gestaodebazar@gmail.com.` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Desculpe, tive um erro técnico na análise. Por favor, tente enviar novamente ou fale com o suporte por e-mail.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setMessages(prev => [...prev, { role: 'user', content: 'Aqui está meu comprovante:', image: base64 }]);
      analyzeReceipt(base64);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-10 right-10 z-[200] w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group animate-bounce-subtle"
    >
      <BrainCircuit size={32} />
      <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></div>
      <div className="absolute right-20 bg-indigo-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Validar Pagamento via IA
      </div>
    </button>
  );

  return (
    <div className={`fixed bottom-10 right-10 z-[200] bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden flex flex-col transition-all duration-500 ${isMinimized ? 'h-20 w-80' : 'h-[600px] w-[400px] max-w-[90vw] animate-in slide-up'}`}>
      <div className="p-6 bg-indigo-600 text-white flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
            <Zap size={20} className="fill-white" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-widest text-[11px]">Atendimento PRO</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[9px] font-bold text-white/70 uppercase">IA Validadora Ativa</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg">
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  msg.role === 'ai' 
                    ? 'bg-white text-slate-700 border border-slate-100' 
                    : 'bg-indigo-600 text-white'
                }`}>
                  {msg.content}
                  {msg.image && (
                    <div className="mt-3 rounded-xl overflow-hidden border-2 border-white/20">
                      <img src={msg.image} className="w-full h-auto" alt="Comprovante" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <Loader2 className="animate-spin text-indigo-500" size={16} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Analisando Pix...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
              >
                <ImageIcon size={16} /> Enviar Comprovante
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
            <p className="text-[8px] text-center text-slate-400 font-black uppercase tracking-widest mt-4">
              Dúvidas? gestaodebazar@gmail.com
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentAIValidator;
