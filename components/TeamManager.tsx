
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Mail, 
  ShieldHalf, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Crown,
  // Added missing Plus icon import
  Plus
} from 'lucide-react';

interface TeamManagerProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const TeamManager: React.FC<TeamManagerProps> = ({ users, setUsers }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'Voluntário',
    status: 'Ativo'
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const userToAdd: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name!,
      email: newUser.email!,
      role: newUser.role as UserRole,
      status: 'Ativo'
    };

    setUsers(prev => [...prev, userToAdd]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'Voluntário', status: 'Ativo' });
  };

  const removeUser = (id: string) => {
    if (confirm('Remover este membro da equipe? O acesso será revogado imediatamente.')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Administrador': return 'bg-amber-500 text-white shadow-amber-900/10';
      case 'Gerente': return 'bg-blue-600 text-white shadow-blue-900/10';
      case 'Voluntário': return 'bg-emerald-500 text-white shadow-emerald-900/10';
      default: return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Gestão da Equipe</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">Colabore com outros voluntários e gerencie permissões.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-slate-950 text-amber-500 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all flex items-center gap-3"
        >
          <UserPlus size={18} /> Convidar Membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => removeUser(user.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${getRoleBadge(user.role)}`}>
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg leading-tight">{user.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                <Mail size={16} className="text-slate-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-600 truncate">{user.email}</span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível de Acesso</span>
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setShowAddModal(true)}
          className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-slate-300 hover:border-amber-400 hover:text-amber-500 transition-all group min-h-[250px]"
        >
          <div className="p-4 bg-slate-50 rounded-2xl mb-4 group-hover:bg-amber-50 transition-all">
            <Plus size={32} />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">Novo Membro</span>
        </button>
      </div>

      {/* Add User Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Convidar para Equipe</h4>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><XCircle size={24} className="text-slate-400" /></button>
            </div>
            <div className="p-8 space-y-6">
              <label className="block space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome Completo</span>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 font-bold" 
                  placeholder="Ex: João da Silva"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail de Acesso</span>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 font-bold" 
                  placeholder="joao@ong.org"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Papel na Equipe</span>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 font-bold appearance-none"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Voluntário">Voluntário</option>
                </select>
              </label>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                  O convite será enviado para o e-mail informado. O usuário terá permissões baseadas no papel selecionado.
                </p>
              </div>

              <button 
                onClick={handleAddUser}
                className="w-full py-5 bg-slate-950 text-amber-500 font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl"
              >
                Confirmar Convite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
