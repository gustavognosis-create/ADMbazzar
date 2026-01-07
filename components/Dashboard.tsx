
import React from 'react';
import { Product, Donation, Transaction } from '../types';
import { TrendingUp, Package, Heart, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  products: Product[];
  donations: Donation[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, donations, transactions }) => {
  const totalSales = transactions
    .filter(t => t.type === 'Entrada')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDonations = donations.length;
  const stockCount = products.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStock = products.filter(p => p.stock < 3).length;

  const data = [
    { name: 'Seg', vendas: 120 },
    { name: 'Ter', vendas: 300 },
    { name: 'Qua', vendas: 200 },
    { name: 'Qui', vendas: 450 },
    { name: 'Sex', vendas: 600 },
    { name: 'Sáb', vendas: 800 },
    { name: 'Dom', vendas: 150 },
  ];

  const stats = [
    { label: 'Receita Total', value: `R$ ${totalSales.toFixed(2)}`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+12%', trendUp: true },
    { label: 'Itens em Loja', value: stockCount, icon: Package, color: 'text-slate-800', bg: 'bg-slate-100', trend: '-2%', trendUp: false },
    { label: 'Triagem Ativa', value: totalDonations, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', trend: '+5%', trendUp: true },
    { label: 'Itens Críticos', value: lowStock, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Atenção', trendUp: false },
  ];

  return (
    <div className="space-y-6 pb-6 md:pb-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-3xl md:rounded-[2rem] shadow-sm border border-slate-200/50">
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} className="md:w-6 md:h-6" />
              </div>
            </div>
            <h3 className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em]">{stat.label}</h3>
            <p className="text-sm md:text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200/50 overflow-hidden">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h3 className="text-base md:text-xl font-black text-slate-900">Performance</h3>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-lg">Semana</span>
          </div>
          <div className="h-48 md:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 10}}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px'}}
                />
                <Bar dataKey="vendas" fill="#d97706" radius={[4, 4, 0, 0]} barSize={window.innerWidth > 768 ? 36 : 16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-xl shadow-slate-900/10 border border-slate-800">
          <h3 className="text-base md:text-lg font-black mb-6 md:mb-8 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            Processo de Curadoria
          </h3>
          <div className="space-y-4 md:space-y-6">
            {['Recebido', 'Triagem', 'Curadoria', 'Estoque'].map((status) => {
              const count = donations.filter(d => d.status === status).length;
              const total = donations.length || 1;
              const percent = (count / total) * 100;
              return (
                <div key={status}>
                  <div className="flex justify-between text-[9px] md:text-[10px] mb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">{status}</span>
                    <span className="text-amber-500 font-black">{count}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 md:h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-amber-500 transition-all duration-1000 ease-out" 
                      style={{width: `${percent}%`}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
