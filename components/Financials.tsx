
import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  Download, 
  Filter, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Plus, 
  TrendingDown, 
  Receipt, 
  Wallet, 
  Calendar,
  PieChart as PieChartIcon,
  Tag,
  AlertCircle,
  X,
  CreditCard,
  QrCode,
  Banknote,
  Divide
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FinancialsProps {
  transactions: Transaction[];
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const Financials: React.FC<FinancialsProps> = ({ transactions, setTransactions }) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Custo Fixo',
    paymentMethod: 'PIX'
  });

  const incomes = transactions.filter(t => t.type === 'Entrada').reduce((acc, curr) => acc + curr.amount, 0);
  const outcomes = transactions.filter(t => t.type === 'Saída').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = incomes - outcomes;

  const costs = transactions.filter(t => t.type === 'Saída');

  const costCategories = costs.reduce((acc: any, curr) => {
    const cat = curr.description.split(']')[0].replace('[', '') || 'Outros';
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  const chartData = Object.keys(costCategories).map(key => ({
    name: key,
    value: costCategories[key]
  }));

  const COLORS = ['#f43f5e', '#f59e0b', '#6366f1', '#10b981', '#8b5cf6'];

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !setTransactions) return;

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      type: 'Saída',
      amount: parseFloat(newExpense.amount),
      description: `[${newExpense.category}] ${newExpense.description}`,
      paymentMethod: newExpense.paymentMethod as any
    };

    setTransactions(prev => [transaction, ...prev]);
    setShowAddExpense(false);
    setNewExpense({ description: '', amount: '', category: 'Custo Fixo', paymentMethod: 'PIX' });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Dinheiro': return <Banknote size={10} />;
      case 'PIX': return <QrCode size={10} />;
      case 'Cartão': return <CreditCard size={10} />;
      case 'Múltiplo': return <Divide size={10} />;
      default: return <Wallet size={10} />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 text-emerald-600 mb-6">
            <div className="p-3 bg-emerald-50 rounded-2xl"><ArrowUpCircle size={28} /></div>
            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Entradas / Vendas</h4>
          </div>
          <p className="text-4xl font-black text-slate-900">R$ {incomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 text-rose-600 mb-6">
            <div className="p-3 bg-rose-50 rounded-2xl"><ArrowDownCircle size={28} /></div>
            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Saídas / Custos</h4>
          </div>
          <p className="text-4xl font-black text-slate-900">R$ {outcomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-slate-950 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="relative z-10">
            <h4 className="font-black text-amber-500 text-[10px] uppercase tracking-[0.2em] mb-6">Saldo em Caixa</h4>
            <p className="text-4xl font-black text-white">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-[10px] font-black px-2 py-1 rounded-md ${balance >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {balance >= 0 ? 'Superávit' : 'Déficit'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <TrendingDown size={24} className="text-rose-500" /> Gestão de Custos
              </h3>
              <button onClick={() => setShowAddExpense(true)} className="p-3 bg-rose-500 text-white rounded-2xl hover:bg-rose-600 shadow-lg transition-all">
                <Plus size={20} />
              </button>
            </div>

            {chartData.length > 0 ? (
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl text-[10px] font-black uppercase tracking-widest">
                Sem custos registrados
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-xl font-black text-slate-900">Extrato Consolidado</h3>
            <div className="flex gap-3">
              <button className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-slate-900 transition-all"><Filter size={20} /></button>
              <button className="px-6 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl flex items-center gap-3"><Download size={18} /> Exportar</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data / Meio</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-slate-700">{new Date(t.date).toLocaleDateString()}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                        {getMethodIcon(t.paymentMethod || '')} 
                        {t.paymentMethod === 'Múltiplo' && t.paymentBreakdown 
                          ? t.paymentBreakdown.map(b => b.method.charAt(0)).join('+') 
                          : t.paymentMethod}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-slate-800">{t.description.includes(']') ? t.description.split(']')[1].trim() : t.description}</div>
                      <div className="mt-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          t.type === 'Entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {t.description.includes(']') ? t.description.split(']')[0].replace('[', '') : t.type}
                        </span>
                      </div>
                    </td>
                    <td className={`px-8 py-6 text-right font-black text-lg ${
                      t.type === 'Entrada' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {t.type === 'Entrada' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddExpense && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-rose-500 text-white">
              <h3 className="font-black uppercase tracking-widest text-sm">Registrar Despesa</h3>
              <button onClick={() => setShowAddExpense(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <label className="block space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</span>
                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor (R$)</span>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</span>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold appearance-none" value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}>
                    <option value="Custo Fixo">Custo Fixo</option>
                    <option value="Compras">Compras</option>
                    <option value="Operacional">Operacional</option>
                  </select>
                </label>
              </div>
              <button onClick={handleAddExpense} className="w-full py-5 bg-slate-900 text-rose-500 font-black rounded-2xl uppercase tracking-widest text-xs">Confirmar Lançamento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financials;
