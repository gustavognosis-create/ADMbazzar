
export type Category = 'Roupas' | 'Calçados' | 'Acessórios' | 'Casa' | 'Brinquedos' | 'Eletros' | 'Móveis' | 'Outros';

export type ProductStatus = 'Triagem' | 'Estoque' | 'Bazar' | 'Loja Online' | 'Vendido' | 'Reservado' | 'Devolvido';

export type UserRole = 'Administrador' | 'Gerente' | 'Voluntário';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Ativo' | 'Inativo';
}

export interface Institution {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  isPro: boolean;
  proActivationDate?: string;
  proExpiryDate?: string;
  mercadoPagoPublicKey?: string;
  mercadoPagoEnabled?: boolean;
  commissionRate?: number;
  logoUrl?: string;
  bazarName?: string;
  password?: string; // Adicionado para persistência simples no exemplo
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  pixKey: string;
  commissionEarned: number;
  totalSalesCount: number;
  status: 'Ativo' | 'Inativo';
  referralCode: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalDonations: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  sizes?: {
    shirt?: string;
    pants?: string;
    shoes?: string;
    waist?: string;
  };
  preferences?: {
    categories: Category[];
    productTypes: string[]; // Adicionado: Monitoramento específico (Camiseta, Calça, etc)
    colors: string[];
    fabrics: string[];
    prints: string[];
    brands: string[];
    minPrice?: number;
    maxPrice?: number;
  };
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: Category;
  subCategory?: string; // Ex: Camiseta, Calça, Tênis, Salto
  price: number;
  stock: number;
  condition: 'Novo' | 'Excelente' | 'Bom' | 'Usado';
  status: ProductStatus;
  isFeatured?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  size?: string;
  color?: string;
  fabric?: string;
  print?: string; // Estampa
  brand?: string; // Marca
  gender?: 'Masculino' | 'Feminino' | 'Unissex' | 'Infantil';
  inStore?: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  date: string;
  status: 'Triagem' | 'Estoque' | 'Descartado';
  itemsDescription: string;
  estimatedValue?: number;
}

export interface PaymentItem {
  method: 'Dinheiro' | 'PIX' | 'Cartão';
  amount: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Entrada' | 'Saída';
  amount: number;
  description: string;
  paymentMethod?: 'Dinheiro' | 'PIX' | 'Cartão' | 'Múltiplo';
  paymentBreakdown?: PaymentItem[];
  partnerId?: string;
  commissionAmount?: number;
}

// Added missing SocialGoal interface
export interface SocialGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  isActive: boolean;
}

export type View = 'dashboard' | 'inventory' | 'donations' | 'pos' | 'financial' | 'entities' | 'institution' | 'ai-assistant' | 'storefront' | 'upgrade' | 'team' | 'partners' | 'reports';
