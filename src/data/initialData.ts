import { Appointment, ClientProfile, DogProfile, Service, StaffMember } from '../types';

export const initialServices: Service[] = [
  {
    id: 'srv-sit-client',
    name: 'Pet Sitting in Client Home (Overnight)',
    category: 'pet_sitting_client_home',
    locationType: 'client_home',
    description: 'Overnight pet care in your pet’s familiar home environment. Includes evening & morning routines, feedings, continuous companionship, home security, plant care, mail retrieval, and real-time photo updates.',
    durationMinutes: 720,
    price: 85,
    color: '#2563eb',
    availableAddons: [
      { id: 'add-med', name: 'Medication / Insulin Administration', price: 10, durationMinutes: 10 },
      { id: 'add-midday', name: 'Mid-Day Afternoon Enrichment Walk', price: 20, durationMinutes: 30 },
      { id: 'add-sibling', name: 'Additional Pet / Sibling Fee', price: 25, durationMinutes: 0 },
      { id: 'add-plants', name: 'Indoor & Garden Plant Care', price: 10, durationMinutes: 15 },
    ]
  },
  {
    id: 'srv-sit-sitter',
    name: 'Pet Sitting in Sitter Home (Boarding)',
    category: 'pet_sitting_sitter_home',
    locationType: 'sitter_home',
    description: 'Cozy, family-style cage-free boarding at the sitter’s residence. Fenced yard playtime, regular feeding schedule, adventure walks, couch privileges, and 24/7 loving supervision.',
    durationMinutes: 720,
    price: 75,
    color: '#0d9488',
    availableAddons: [
      { id: 'add-shuttle', name: 'Pick-up & Drop-off Pet Shuttle', price: 25, durationMinutes: 30 },
      { id: 'add-raw', name: 'Special Diet / Fresh Food Prep', price: 10, durationMinutes: 10 },
      { id: 'add-sitter-sibling', name: 'Second Dog Household Discount', price: 35, durationMinutes: 0 },
    ]
  },
  {
    id: 'srv-dropin-30',
    name: 'Drop-In Visit (30 Minutes)',
    category: 'drop_in',
    locationType: 'client_home',
    description: '30-minute visit at client home: fresh water bowl refill, portioned feeding, backyard playtime or neighborhood potty walk, litter/waste disposal, and a visit report with cute photos.',
    durationMinutes: 30,
    price: 28,
    color: '#d97706',
    availableAddons: [
      { id: 'add-dropin-med', name: 'Medication Administration', price: 8, durationMinutes: 5 },
      { id: 'add-dropin-brush', name: 'Gentle Brush & Coat Refresh', price: 10, durationMinutes: 10 },
      { id: 'add-dropin-mail', name: 'Mail / Package Pickup & Water Plants', price: 5, durationMinutes: 5 },
    ]
  },
  {
    id: 'srv-dropin-60',
    name: 'Extended Drop-In Visit (60 Minutes)',
    category: 'drop_in',
    locationType: 'client_home',
    description: 'Full 1-hour visit ideal for high-energy pups, multiple pets, or pets needing extensive exercise, mental enrichment puzzles, medication, and extra cuddle time.',
    durationMinutes: 60,
    price: 45,
    color: '#ea580c',
    availableAddons: [
      { id: 'add-dropin-med2', name: 'Medication Administration', price: 8, durationMinutes: 5 },
      { id: 'add-dropin-mail2', name: 'Mail / Package Pickup & Water Plants', price: 5, durationMinutes: 5 },
    ]
  },
  {
    id: 'srv-meet-greet',
    name: 'Meet & Greet Consultation',
    category: 'meet_greet',
    locationType: 'meet_greet',
    description: 'Complimentary pre-sitting consultation. Sitter and pet parents meet in person to review routines, verify house keys/lockbox access, confirm emergency contacts, and test pet chemistry.',
    durationMinutes: 30,
    price: 0,
    color: '#7c3aed',
    availableAddons: [
      { id: 'add-key-pickup', name: 'Advance Key Collection / Setup Trip', price: 10, durationMinutes: 15 }
    ]
  }
];

export const initialStaff: StaffMember[] = [
  { id: 'staff-1', name: 'Alex Rivera', role: 'Lead Pet Sitter', color: '#2563eb', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'staff-2', name: 'Jordan Hayes', role: 'Overnight House Sitter', color: '#0d9488', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'staff-3', name: 'Samira Patel', role: 'Drop-In Visit Specialist', color: '#d97706', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'staff-4', name: 'Marcus Chen', role: 'In-Home Boarding Host', color: '#16a34a', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
];

export const initialClients: ClientProfile[] = [
  {
    id: 'client-1',
    name: 'Emily Watson',
    phone: '(555) 234-8901',
    email: 'emily.w@example.com',
    address: '742 Evergreen Terrace, Suite 4B',
    homeAccessNotes: 'Side porch lockbox code #4092. Park on left side of driveway.',
    notes: 'Very organized. Feeding bowls are labeled in pantry.',
    emergencyContact: 'Mark Watson (Husband) - (555) 991-0021'
  },
  {
    id: 'client-2',
    name: 'David & Lisa Miller',
    phone: '(555) 872-1130',
    email: 'david.miller@example.com',
    address: '128 Willow Creek Way',
    homeAccessNotes: 'Smart front keypad: *1130#. Back gate latch opens inward.',
    notes: 'Prefers text updates with photos immediately after each drop-in.',
    emergencyContact: 'Lisa Miller - (555) 872-1131'
  },
  {
    id: 'client-3',
    name: 'Sofia Rodriguez',
    phone: '(555) 438-9922',
    email: 'sofia.rodriguez@example.com',
    address: '890 Sunset Blvd Apt 12',
    homeAccessNotes: 'Concierge desk has spare key fob filed under "Sofia Apt 12".',
    notes: 'Frequent business traveler needing overnight home sitting.',
    emergencyContact: 'Carlos Rodriguez (Brother) - (555) 438-9955'
  },
  {
    id: 'client-4',
    name: 'James O\'Connor',
    phone: '(555) 601-3482',
    email: 'j.oconnor@example.com',
    address: '344 Pinecrest Hill',
    homeAccessNotes: 'Lockbox on back patio fence post, code 1984.',
    notes: 'Prefers afternoon drop-in visits between 3pm and 5pm.',
    emergencyContact: 'Dr. Harris DVM (Vet) - (555) 777-3311'
  },
  {
    id: 'client-5',
    name: 'Hannah & Chloe Brooks',
    phone: '(555) 919-2470',
    email: 'brooks.family@example.com',
    address: '15 Ocean Breeze Lane',
    homeAccessNotes: 'Garage exterior keypad code 9192. Sitter may park in driveway.',
    notes: 'Two dogs in household (Mochi & Teddy). Both love sitter sleepovers.',
    emergencyContact: 'Chloe Brooks - (555) 919-2475'
  }
];

export const initialDogs: DogProfile[] = [
  {
    id: 'dog-1',
    name: 'Cooper',
    breed: 'Golden Retriever',
    ageYears: 3,
    weightLbs: 68,
    gender: 'male',
    ownerId: 'client-1',
    temperament: ['Gentle & Sweet', 'Loves Leash Walks', 'Prefers Belly Rubs', 'Treat Motivated'],
    medicalAlerts: 'Mild seasonal allergies. Wipes paws after grass walks.',
    feedingInstructions: '1.5 cups dry food in stainless bowl morning (8am) and evening (6pm). Fresh water.',
    vaccinationsUpToDate: true,
    rabiesExpiryDate: '2027-04-15',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dog-2',
    name: 'Boba',
    breed: 'French Bulldog',
    ageYears: 2,
    weightLbs: 26,
    gender: 'male',
    ownerId: 'client-2',
    temperament: ['Playful', 'Snorts when happy', 'Loves naps on lap', 'Friendly with people'],
    medicalAlerts: 'Brachycephalic: keep walks under 15 minutes when above 75°F.',
    feedingInstructions: '1 cup kibble mixed with 1 spoonful wet topper at noon.',
    vaccinationsUpToDate: true,
    rabiesExpiryDate: '2026-11-20',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dog-3',
    name: 'Bella',
    breed: 'Labradoodle',
    ageYears: 4,
    weightLbs: 48,
    gender: 'female',
    ownerId: 'client-3',
    temperament: ['High energy', 'Loves fetch in yard', 'Affectionate', 'Great indoors'],
    medicalAlerts: 'Sensitive stomach: no human food or chicken treats.',
    feedingInstructions: '1 cup sensitive skin & stomach salmon formula at 7am and 7pm.',
    vaccinationsUpToDate: true,
    rabiesExpiryDate: '2027-01-10',
    photoUrl: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dog-4',
    name: 'Zeus',
    breed: 'German Shepherd',
    ageYears: 5,
    weightLbs: 82,
    gender: 'male',
    ownerId: 'client-4',
    temperament: ['Loyal', 'Calm when introduced', 'Well trained', 'Protective of home'],
    medicalAlerts: 'Give joint chew with dinner. Needs slow initial greeting at front door.',
    feedingInstructions: '2 cups large breed kibble with evening joint supplement.',
    vaccinationsUpToDate: true,
    rabiesExpiryDate: '2026-09-30',
    photoUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dog-5',
    name: 'Mochi',
    breed: 'Pembroke Welsh Corgi',
    ageYears: 1,
    weightLbs: 24,
    gender: 'female',
    ownerId: 'client-5',
    temperament: ['Affectionate', 'Playful', 'Vocal when doorbell rings', 'Loves squeaky toys'],
    medicalAlerts: 'Keep back supported; use doggy ramp for high beds/sofas.',
    feedingInstructions: '3/4 cup kibble twice daily. Likes carrot slice as dessert.',
    vaccinationsUpToDate: true,
    rabiesExpiryDate: '2027-08-01',
    photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dog-6',
    name: 'Teddy',
    breed: 'Pomeranian',
    ageYears: 3,
    weightLbs: 8,
    gender: 'male',
    ownerId: 'client-5',
    temperament: ['Cuddle bug', 'Spunky', 'Loves sitting on cushions', 'Very quiet'],
    medicalAlerts: 'Small treats only; harness only on walks (no neck collar).',
    feedingInstructions: '1/3 cup small breed bites morning and night.',
    vaccinationsUpToDate: true,
    rabiesExpiryDate: '2027-03-12',
    photoUrl: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=300&auto=format&fit=crop&q=80'
  }
];

// Helper to get formatted date string YYYY-MM-DD relative to today
export const getDateStr = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    dogId: 'dog-1',
    clientId: 'client-1',
    serviceId: 'srv-dropin-30',
    staffId: 'staff-3',
    date: getDateStr(0), // Today
    startTime: '09:30',
    durationMinutes: 30,
    status: 'in_progress',
    locationType: 'client_home',
    locationAddress: '742 Evergreen Terrace, Suite 4B',
    accessInstructions: 'Side porch lockbox code #4092. Park on left side of driveway.',
    addons: [
      { id: 'add-dropin-mail', name: 'Mail / Package Pickup & Water Plants', price: 5, durationMinutes: 5 }
    ],
    price: 33,
    paid: true,
    paymentMethod: 'card',
    notes: 'Morning drop-in: fresh water, backyard playtime, and brought in Amazon box on porch.',
    visitReport: {
      pottyBreaks: { peed: true, pooped: true },
      foodWaterServed: true,
      medicationGiven: false,
      moodRating: 5,
      sitterNotes: 'Cooper was thrilled to see me! Went potty immediately in the backyard, had his bowl refilled, and we played fetch with his yellow tennis ball for 15 minutes.'
    },
    reminderSent: true,
  },
  {
    id: 'apt-2',
    dogId: 'dog-2',
    clientId: 'client-2',
    serviceId: 'srv-meet-greet',
    staffId: 'staff-1',
    date: getDateStr(0), // Today
    startTime: '11:30',
    durationMinutes: 30,
    status: 'confirmed',
    locationType: 'meet_greet',
    locationAddress: '128 Willow Creek Way',
    accessInstructions: 'Front keypad: *1130#. Owners will be home to greet sitter.',
    addons: [],
    price: 0,
    paid: true,
    paymentMethod: 'online',
    notes: 'Meet & Greet for upcoming holiday sitting. Reviewing Boba’s heat sensitivities and key handoff.',
    reminderSent: true,
  },
  {
    id: 'apt-3',
    dogId: 'dog-3',
    clientId: 'client-3',
    serviceId: 'srv-sit-client',
    staffId: 'staff-2',
    date: getDateStr(0), // Today
    startTime: '14:00',
    durationMinutes: 720,
    status: 'confirmed',
    locationType: 'client_home',
    locationAddress: '890 Sunset Blvd Apt 12',
    accessInstructions: 'Concierge desk has key fob for Sofia Apt 12. Park in visitor bay #4.',
    addons: [
      { id: 'add-midday', name: 'Mid-Day Afternoon Enrichment Walk', price: 20, durationMinutes: 30 },
      { id: 'add-plants', name: 'Indoor & Garden Plant Care', price: 10, durationMinutes: 15 },
    ],
    price: 115,
    paid: false,
    paymentMethod: 'unpaid',
    notes: 'Overnight sitting in client home while client is at conference. Sitter stays overnight. Feed 1 cup salmon kibble at 7pm.',
    reminderSent: true,
  },
  {
    id: 'apt-4',
    dogId: 'dog-4',
    clientId: 'client-4',
    serviceId: 'srv-dropin-60',
    staffId: 'staff-1',
    date: getDateStr(0), // Today
    startTime: '16:30',
    durationMinutes: 60,
    status: 'pending',
    locationType: 'client_home',
    locationAddress: '344 Pinecrest Hill',
    accessInstructions: 'Lockbox on back patio fence post, code 1984.',
    addons: [
      { id: 'add-dropin-med2', name: 'Medication Administration', price: 8, durationMinutes: 5 }
    ],
    price: 53,
    paid: false,
    paymentMethod: 'unpaid',
    notes: 'Evening 60-min drop in. Give dinner + joint chew. 30-minute neighborhood walk on front harness.',
    reminderSent: false,
  },
  {
    id: 'apt-5',
    dogId: 'dog-5',
    clientId: 'client-5',
    serviceId: 'srv-sit-sitter',
    staffId: 'staff-4',
    date: getDateStr(1), // Tomorrow
    startTime: '09:00',
    durationMinutes: 720,
    status: 'confirmed',
    locationType: 'sitter_home',
    locationAddress: 'Sitter Marcus Chen’s Residence (Fenced Yard)',
    accessInstructions: 'Client dropping dog off at sitter residence at 9:00 AM.',
    addons: [
      { id: 'add-sitter-sibling', name: 'Second Dog Household Discount', price: 35, durationMinutes: 0 }
    ],
    price: 110,
    paid: true,
    paymentMethod: 'card',
    notes: 'In-sitter-home boarding for Mochi (and Teddy visiting). Bringing favorite dog beds and crate.',
    reminderSent: true,
  },
  {
    id: 'apt-6',
    dogId: 'dog-6',
    clientId: 'client-5',
    serviceId: 'srv-meet-greet',
    staffId: 'staff-3',
    date: getDateStr(1), // Tomorrow
    startTime: '13:00',
    durationMinutes: 30,
    price: 0,
    status: 'confirmed',
    locationType: 'meet_greet',
    locationAddress: '15 Ocean Breeze Lane',
    accessInstructions: 'Garage keypad code 9192. Client will be present.',
    addons: [],
    paid: true,
    paymentMethod: 'online',
    notes: 'Meet & Greet with Samira for upcoming weekend drop-in schedule.',
    reminderSent: true,
  },
  {
    id: 'apt-7',
    dogId: 'dog-1',
    clientId: 'client-1',
    serviceId: 'srv-dropin-30',
    staffId: 'staff-3',
    date: getDateStr(2),
    startTime: '10:00',
    durationMinutes: 30,
    status: 'confirmed',
    locationType: 'client_home',
    locationAddress: '742 Evergreen Terrace, Suite 4B',
    accessInstructions: 'Side porch lockbox code #4092.',
    addons: [],
    price: 28,
    paid: true,
    paymentMethod: 'card',
    notes: 'Mid-morning drop in potty break and water check.',
    reminderSent: false,
  },
  {
    id: 'apt-8',
    dogId: 'dog-2',
    clientId: 'client-2',
    serviceId: 'srv-dropin-30',
    staffId: 'staff-3',
    date: getDateStr(-1), // Yesterday (completed)
    startTime: '14:00',
    durationMinutes: 30,
    status: 'completed',
    locationType: 'client_home',
    locationAddress: '128 Willow Creek Way',
    accessInstructions: 'Smart front keypad: *1130#.',
    addons: [],
    price: 28,
    paid: true,
    paymentMethod: 'card',
    notes: 'Afternoon drop-in check. Boba had a great 15 min yard session.',
    visitReport: {
      pottyBreaks: { peed: true, pooped: true },
      foodWaterServed: true,
      medicationGiven: false,
      moodRating: 5,
      sitterNotes: 'Boba greeted me with full tail wiggles! Took care of business immediately, drank a full bowl of fresh water, and enjoyed head scratches on the rug.'
    },
    reminderSent: true,
  }
];
