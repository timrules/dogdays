export type AppointmentStatus = 'confirmed' | 'in_progress' | 'ready_for_pickup' | 'completed' | 'cancelled' | 'pending';

export type ServiceCategory =
  | 'pet_sitting_client_home'
  | 'pet_sitting_sitter_home'
  | 'drop_in'
  | 'meet_greet';

export type SittingLocationType = 'client_home' | 'sitter_home' | 'meet_greet';

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  durationMinutes: number;
  price: number;
  color: string;
  locationType: SittingLocationType;
  availableAddons?: ServiceAddon[];
}

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  ageYears?: number;
  weightLbs: number;
  gender: 'male' | 'female';
  photoUrl?: string;
  temperament?: string[]; // e.g. ["Friendly", "High energy", "Loves belly rubs", "Good on leash"]
  medicalAlerts?: string; // e.g. "Daily thyroid pill with breakfast, sensitive stomach"
  feedingInstructions?: string; // e.g. "1 cup dry kibble morning & evening"
  vaccinationsUpToDate: boolean;
  rabiesExpiryDate?: string;
  ownerId: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
  emergencyContact?: string;
  homeAccessNotes?: string; // e.g. "Lockbox code 8492 on porch railing. Sitter park in driveway."
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Lead Pet Sitter' | 'Overnight House Sitter' | 'Drop-In Visit Specialist' | 'In-Home Boarding Host' | 'Pet Care Specialist';
  avatar?: string;
  color: string;
}

export interface VisitCareReport {
  pottyBreaks?: {
    peed: boolean;
    pooped: boolean;
  };
  foodWaterServed?: boolean;
  medicationGiven?: boolean;
  moodRating?: 1 | 2 | 3 | 4 | 5;
  sitterNotes?: string;
}

export interface Appointment {
  id: string;
  dogId: string;
  clientId: string;
  serviceId: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM in 24hr format, e.g. "09:30"
  durationMinutes: number;
  status: AppointmentStatus;
  locationType: SittingLocationType;
  locationAddress?: string;
  addons: ServiceAddon[];
  price: number;
  paid: boolean;
  paymentMethod?: 'card' | 'cash' | 'unpaid' | 'online';
  notes?: string;
  accessInstructions?: string; // Gate/key/lockbox access for client home visits
  visitReport?: VisitCareReport;
  reminderSent?: boolean;
}

export type ViewMode = 'day' | 'week' | 'month' | 'list';

export type ThemePreset = 'warm-amber' | 'sage-mint' | 'luxe-slate' | 'rose-terracotta';

