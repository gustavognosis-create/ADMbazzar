
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Product, Donation, Transaction, Institution } from '../types';
import { Sparkles, Send, BrainCircuit, History, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  products: Product[];
  donations: Donation[];
  transactions: Transaction[];
  institution: Institution;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ products, donations, transactions, institution }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAIAdvice = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const context = `
        Sou o assistente de gestão do bazar "${institution.name}".
        Dados atuais:
        - Estoque total: ${products.length} itens ativos.
        - Pendências de triagem: ${donations.filter(d => d.status === 'Triagem').length} lotes aguardando.
        - Faturamento atual: R$ ${transactions.filter(t => t.type === 'Entrada').reduce((a, b) => a + b.amount, 0).toFixed(2)}
        
        A pergunta do gestor é: ${prompt}
        Responda em PT-BR como um consultor sênior de gestão de recursos filantrópicos. 
        Seja direto, use tópicos e Markdown. Foque em lucro, sustentabilidade e impacto social.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Upgrade para pro para conselhos estratégicos
        contents: context,
        config: {
          systemInstruction: "Você é ADMbazzar GPT, consultor sênior em gestão de recursos. Seu objetivo é ajudar bazares beneficentes a serem mais eficientes e lucrativos. Use um tom encorajador mas profissional.",
          temperature: 0.7,
        }
      });

      setResponse(result.text || "Não consegui formular uma estratégia agora. Tente reformular.");
    } catch (err: any) {
      console.error(err);
      setError("Falha na inteligência: Verifique sua conexão ou tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Como aumentar o ticket médio das vendas de roupas?",
    "Estratégia para desovar itens parados há mais de 3 meses.",
    "Script de agradecimento para atrair doadores recorrentes.",
    "Quais categorias têm maior potencial de lucro hoje?"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Consultoria Estratégica</h2>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed font-medium">
            Analise dados em tempo real para tomar decisões que aumentem sua <span className="text-amber-500">arrecadação social</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map(s => (
          <button 
            key={s}
            onClick={() => setPrompt(s)}
            className="p-5 bg-white border border-slate-200 rounded-2xl text-left hover:border-amber-500 hover:shadow-lg transition-all group flex justify-between items-center"
          >
            <span className="text-sm font-bold text-slate-700">{s}</span>
            <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-amber-500 group-hover:text-white transition-all">
              <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8">
          <div className="relative">
            <input 
              type="text"
              placeholder="Descreva seu desafio estratégico..."
              className="w-full pl-8 pr-16 py-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-800"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && getAIAdvice()}
            />
            <button 
              onClick={getAIAdvice}
              disabled={loading || !prompt.trim()}
              className="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 text-amber-500 rounded-2xl hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center font-black uppercase tracking-widest text-[10px]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Analisar"}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-black uppercase">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>

        {response && (
          <div className="px-8 pb-10 border-t border-slate-100 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-6 mt-10">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-200">
                <BrainCircuit size={28} />
              </div>
              <div className="flex-1">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-slate-800 leading-relaxed font-medium shadow-inner prose prose-slate max-w-none">
                   {response.split('\n').map((line, i) => (
                     <p key={i} className="mb-2">{line}</p>
                   ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
        ADMbazzar Pro &bull; Consultoria Inteligente &bull; 2026
      </div>
    </div>
  );
};

export default AIAssistant;
