import { Clock, Hash, Phone, Coins } from 'lucide-react';

export const modules = [
  {
    id: 'time',
    title: 'Time Practice',
    subtitle: 'Soatni mashq qilish',
    icon: Clock,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    shadowColor: 'shadow-blue-500/50'
  },
  {
    id: 'numbers',
    title: 'Numbers Practice',
    subtitle: 'Raqamlarni mashq qilish',
    icon: Hash,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    shadowColor: 'shadow-green-500/50'
  },
  {
    id: 'phone',
    title: 'Phone Numbers',
    subtitle: 'Telefon raqamlarini mashq qilish',
    icon: Phone,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    shadowColor: 'shadow-purple-500/50'
  },
  {
    id: 'prices',
    title: 'Prices Practice',
    subtitle: 'Narx aytishni mashq qilish',
    icon: Coins,
    color: 'bg-amber-500',
    hoverColor: 'hover:bg-amber-600',
    shadowColor: 'shadow-amber-500/50'
  }
];
