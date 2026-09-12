import { AppointmentStatus, ServiceCategory, SittingLocationType, ThemePreset } from '../types';

export const formatTime12h = (time24: string): string => {
  if (!time24) return '';
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // 0 becomes 12
  return `${hour}:${minuteStr} ${ampm}`;
};

export const addMinutesToTime = (time24: string, minutes: number): string => {
  const [hourStr, minuteStr] = time24.split(':');
  const totalMinutes = parseInt(hourStr, 10) * 60 + parseInt(minuteStr, 10) + minutes;
  const newHour = Math.floor(totalMinutes / 60) % 24;
  const newMinute = totalMinutes % 60;
  return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
};

export const getStatusLabel = (status: AppointmentStatus): string => {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'in_progress':
      return 'Visit Active / Sitting in Progress';
    case 'ready_for_pickup':
      return 'Ready for Sitter Pickup';
    case 'completed':
      return 'Completed';
    case 'pending':
      return 'Awaiting Confirmation';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export const getLocationLabel = (loc: SittingLocationType): string => {
  switch (loc) {
    case 'client_home':
      return 'Client Home';
    case 'sitter_home':
      return 'Sitter Home';
    case 'meet_greet':
      return 'Meet & Greet';
    default:
      return 'Client Home';
  }
};

export const getCategoryLabel = (category: ServiceCategory): string => {
  switch (category) {
    case 'pet_sitting_client_home':
      return 'Sitting in Client Home';
    case 'pet_sitting_sitter_home':
      return 'Sitting in Sitter Home';
    case 'drop_in':
      return 'Drop-In Visit';
    case 'meet_greet':
      return 'Meet & Greet';
    default:
      return category;
  }
};

export const getStatusBadgeClasses = (status: AppointmentStatus): { bg: string; text: string; border: string; dot: string } => {
  switch (status) {
    case 'confirmed':
      return {
        bg: 'bg-blue-50 text-blue-700',
        border: 'border-blue-200',
        text: 'text-blue-700',
        dot: 'bg-blue-500'
      };
    case 'in_progress':
      return {
        bg: 'bg-amber-50 text-amber-800',
        border: 'border-amber-200',
        text: 'text-amber-800',
        dot: 'bg-amber-500 animate-pulse'
      };
    case 'ready_for_pickup':
      return {
        bg: 'bg-emerald-50 text-emerald-800',
        border: 'border-emerald-300',
        text: 'text-emerald-800',
        dot: 'bg-emerald-500 ring-2 ring-emerald-300'
      };
    case 'completed':
      return {
        bg: 'bg-stone-100 text-stone-700',
        border: 'border-stone-200',
        text: 'text-stone-700',
        dot: 'bg-stone-400'
      };
    case 'pending':
      return {
        bg: 'bg-purple-50 text-purple-700',
        border: 'border-purple-200',
        text: 'text-purple-700',
        dot: 'bg-purple-500'
      };
    case 'cancelled':
      return {
        bg: 'bg-rose-50 text-rose-700',
        border: 'border-rose-200',
        text: 'text-rose-700',
        dot: 'bg-rose-400'
      };
    default:
      return {
        bg: 'bg-stone-100 text-stone-700',
        border: 'border-stone-200',
        text: 'text-stone-700',
        dot: 'bg-stone-400'
      };
  }
};

export const themeStyles: Record<ThemePreset, { name: string; primary: string; primaryHover: string; badge: string; border: string; ring: string }> = {
  'warm-amber': {
    name: 'Warm Amber & Honey (MoeGo Style)',
    primary: 'bg-amber-600 hover:bg-amber-700 text-white',
    primaryHover: 'hover:bg-amber-500',
    badge: 'bg-amber-100 text-amber-900',
    border: 'border-amber-200',
    ring: 'ring-amber-500'
  },
  'sage-mint': {
    name: 'Crisp Sage & Mint',
    primary: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    primaryHover: 'hover:bg-emerald-600',
    badge: 'bg-emerald-100 text-emerald-900',
    border: 'border-emerald-200',
    ring: 'ring-emerald-600'
  },
  'luxe-slate': {
    name: 'Modern Luxe Indigo & Slate',
    primary: 'bg-slate-900 hover:bg-slate-800 text-white',
    primaryHover: 'hover:bg-slate-700',
    badge: 'bg-slate-100 text-slate-900',
    border: 'border-slate-300',
    ring: 'ring-slate-700'
  },
  'rose-terracotta': {
    name: 'Terracotta Boutique',
    primary: 'bg-stone-800 hover:bg-stone-900 text-white',
    primaryHover: 'hover:bg-stone-700',
    badge: 'bg-orange-100 text-orange-950',
    border: 'border-orange-200',
    ring: 'ring-orange-600'
  }
};
