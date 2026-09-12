import React, { useState, useEffect } from 'react';
import {
  Appointment,
  ClientProfile,
  DogProfile,
  Service,
  StaffMember,
  ThemePreset,
  ViewMode,
} from './types';
import {
  initialAppointments,
  initialClients,
  initialDogs,
  initialServices,
  initialStaff,
  getDateStr,
} from './data/initialData';
import { Header } from './components/Header';
import { DayStatsBar } from './components/DayStatsBar';
import { ScheduleView } from './components/ScheduleView';
import { AppointmentModal } from './components/AppointmentModal';
import { AppointmentDetailModal } from './components/AppointmentDetailModal';
import { DogsClientsModal } from './components/DogsClientsModal';
import { ServicesModal } from './components/ServicesModal';
import { StyleReferenceModal } from './components/StyleReferenceModal';
import { Download, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';

const STORAGE_KEYS = {
  APPOINTMENTS: 'pawcare_sitting_appointments_v2',
  DOGS: 'pawcare_sitting_dogs_v2',
  CLIENTS: 'pawcare_sitting_clients_v2',
  SERVICES: 'pawcare_sitting_services_v2',
  THEME: 'pawcare_sitting_theme_v2',
  REFERENCE_IMG: 'pawcare_sitting_ref_img_v2',
};

export default function App() {
  // Initialize state with localStorage fallbacks
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : initialAppointments;
    } catch {
      return initialAppointments;
    }
  });

  const [dogs, setDogs] = useState<DogProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOGS);
      return saved ? JSON.parse(saved) : initialDogs;
    } catch {
      return initialDogs;
    }
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : initialClients;
    } catch {
      return initialClients;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : initialServices;
    } catch {
      return initialServices;
    }
  });

  const [staff] = useState<StaffMember[]>(initialStaff);

  const [theme, setTheme] = useState<ThemePreset>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.THEME) as ThemePreset) || 'warm-amber';
    } catch {
      return 'warm-amber';
    }
  });

  const [referenceImage, setReferenceImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.REFERENCE_IMG);
    } catch {
      return null;
    }
  });

  // Calendar / Agenda state
  const [currentDateStr, setCurrentDateStr] = useState<string>(() => getDateStr(0));
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDetailAppointment, setSelectedDetailAppointment] = useState<Appointment | null>(null);
  const [defaultSlotTime, setDefaultSlotTime] = useState<string>('10:00');
  const [targetDateForNew, setTargetDateForNew] = useState<string>(currentDateStr);

  const [isClientsDogsOpen, setIsClientsDogsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Failed to persist appointments', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOGS, JSON.stringify(dogs));
    } catch (e) {
      console.warn('Failed to persist dogs', e);
    }
  }, [dogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.warn('Failed to persist clients', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('Failed to persist services', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn('Failed to persist theme', e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      if (referenceImage) {
        localStorage.setItem(STORAGE_KEYS.REFERENCE_IMG, referenceImage);
      } else {
        localStorage.removeItem(STORAGE_KEYS.REFERENCE_IMG);
      }
    } catch (e) {
      console.warn('Failed to persist reference image', e);
    }
  }, [referenceImage]);

  // Appointment CRUD Handlers
  const handleSaveAppointment = (aptData: Partial<Appointment>) => {
    if (editingAppointment) {
      // Update existing
      setAppointments((prev) =>
        prev.map((a) => (a.id === editingAppointment.id ? ({ ...a, ...aptData } as Appointment) : a))
      );
      // Also update selectedDetailAppointment if currently open
      if (selectedDetailAppointment?.id === editingAppointment.id) {
        setSelectedDetailAppointment((prev) => (prev ? ({ ...prev, ...aptData } as Appointment) : null));
      }
    } else {
      // Create new
      const srv = services.find((s) => s.id === (aptData.serviceId || services[0]?.id));
      const client = clients.find((c) => c.id === (aptData.clientId || clients[0]?.id));

      const newApt: Appointment = {
        id: `apt-${Date.now()}`,
        dogId: aptData.dogId || dogs[0]?.id || '',
        clientId: aptData.clientId || clients[0]?.id || '',
        serviceId: aptData.serviceId || services[0]?.id || '',
        staffId: aptData.staffId || staff[0]?.id || '',
        date: aptData.date || currentDateStr,
        startTime: aptData.startTime || '10:00',
        durationMinutes: aptData.durationMinutes || srv?.durationMinutes || 60,
        status: aptData.status || 'confirmed',
        locationType: aptData.locationType || srv?.locationType || 'client_home',
        locationAddress: aptData.locationAddress || client?.address || '',
        accessInstructions: aptData.accessInstructions || client?.homeAccessNotes || '',
        addons: aptData.addons || [],
        price: aptData.price !== undefined ? aptData.price : (srv?.price ?? 45),
        paid: aptData.paid || false,
        paymentMethod: aptData.paymentMethod || 'unpaid',
        notes: aptData.notes || '',
        reminderSent: false,
      };
      setAppointments((prev) => [newApt, ...prev]);
    }
    setEditingAppointment(null);
  };

  const handleStatusChange = (aptId: string, newStatus: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
    );
    if (selectedDetailAppointment && selectedDetailAppointment.id === aptId) {
      setSelectedDetailAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteAppointment = (aptId: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== aptId));
    if (selectedDetailAppointment?.id === aptId) {
      setSelectedDetailAppointment(null);
    }
  };

  const handleUpdateReport = (aptId: string, report: Appointment['visitReport']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, visitReport: report } : a))
    );
  };

  const handleAddNewDogAndClient = (
    newDog: Omit<DogProfile, 'id'>,
    newClient: Omit<ClientProfile, 'id'>
  ) => {
    const clientId = `client-${Date.now()}`;
    const dogId = `dog-${Date.now()}`;

    const clientRecord: ClientProfile = {
      ...newClient,
      id: clientId,
    };

    const dogRecord: DogProfile = {
      ...newDog,
      id: dogId,
      ownerId: clientId,
    };

    setClients((prev) => [...prev, clientRecord]);
    setDogs((prev) => [...prev, dogRecord]);

    return { dogId, clientId };
  };

  const handleBookForDog = (dogId: string) => {
    const dog = dogs.find((d) => d.id === dogId);
    setTargetDateForNew(currentDateStr);
    setDefaultSlotTime('10:00');
    setEditingAppointment(null);
    setIsAppointmentModalOpen(true);
  };

  const handleBookAtTime = (date: string, time: string) => {
    setTargetDateForNew(date);
    setDefaultSlotTime(time);
    setEditingAppointment(null);
    setIsAppointmentModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Reset application data to original demo appointments and dog profiles?')) {
      setAppointments(initialAppointments);
      setDogs(initialDogs);
      setClients(initialClients);
      setServices(initialServices);
      localStorage.clear();
    }
  };

  const handleExportData = () => {
    const data = {
      appointments,
      dogs,
      clients,
      services,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dog-appointments-backup-${currentDateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter appointments for search and status
  const dogMap = new Map<string, DogProfile>(dogs.map((d) => [d.id, d]));
  const clientMap = new Map<string, ClientProfile>(clients.map((c) => [c.id, c]));

  const filteredAppointments = appointments.filter((apt) => {
    const dog = dogMap.get(apt.dogId);
    const client = clientMap.get(apt.clientId);

    // Status filter
    if (statusFilter !== 'all' && apt.status !== statusFilter) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const dogMatch = dog?.name.toLowerCase().includes(q) || dog?.breed.toLowerCase().includes(q);
      const clientMatch = client?.name.toLowerCase().includes(q) || client?.phone.includes(q);
      const notesMatch = apt.notes?.toLowerCase().includes(q);
      if (!dogMatch && !clientMatch && !notesMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        currentDateStr={currentDateStr}
        onDateChange={setCurrentDateStr}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onNewAppointment={() => {
          setEditingAppointment(null);
          setTargetDateForNew(currentDateStr);
          setIsAppointmentModalOpen(true);
        }}
        onOpenClientsDogs={() => setIsClientsDogsOpen(true)}
        onOpenServices={() => setIsServicesOpen(true)}
        onOpenStyleReference={() => setIsStyleModalOpen(true)}
        theme={theme}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-12">
        {/* Reference Image Side-Banner Alert if user attached one */}
        {referenceImage && (
          <div className="mx-4 mt-3 lg:mx-6 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Reference Screenshot Active:</strong> Styling and fields are matched against your uploaded layout.
              </span>
            </div>
            <button
              onClick={() => setIsStyleModalOpen(true)}
              className="text-amber-800 underline font-semibold hover:text-amber-950 ml-2"
            >
              View / Swap
            </button>
          </div>
        )}

        {/* Day-At-A-Glance Metric Bar */}
        <DayStatsBar
          appointments={appointments}
          dogs={dogs}
          currentDateStr={currentDateStr}
        />

        {/* Central Schedule & Calendar View */}
        <ScheduleView
          viewMode={viewMode}
          currentDateStr={currentDateStr}
          onDateChange={setCurrentDateStr}
          appointments={filteredAppointments}
          dogs={dogs}
          clients={clients}
          services={services}
          staff={staff}
          onSelectAppointment={(apt) => setSelectedDetailAppointment(apt)}
          onStatusChange={handleStatusChange}
          onBookAtTime={handleBookAtTime}
        />
      </main>

      {/* Footer Utility Bar */}
      <footer className="border-t border-stone-200 bg-white py-3 px-4 text-xs text-stone-500 lg:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🐾 Dog Days Pet Sitting & Visits</span>
            <span>•</span>
            <span className="text-stone-400">All changes autosaved to browser</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1 hover:text-stone-800 transition-colors"
              title="Download schedule and records backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1 hover:text-stone-800 transition-colors"
              title="Restore sample dogs and appointments"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Create / Edit Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setEditingAppointment(null);
        }}
        onSave={handleSaveAppointment}
        initialAppointment={editingAppointment}
        defaultDate={targetDateForNew}
        defaultTime={defaultSlotTime}
        dogs={dogs}
        clients={clients}
        services={services}
        staff={staff}
        onAddNewDog={handleAddNewDogAndClient}
      />

      {/* 2. Detailed Appointment View Modal */}
      <AppointmentDetailModal
        appointment={selectedDetailAppointment}
        onClose={() => setSelectedDetailAppointment(null)}
        dog={selectedDetailAppointment ? dogMap.get(selectedDetailAppointment.dogId) : undefined}
        client={selectedDetailAppointment ? clientMap.get(selectedDetailAppointment.clientId) : undefined}
        service={selectedDetailAppointment ? services.find((s) => s.id === selectedDetailAppointment.serviceId) : undefined}
        staff={selectedDetailAppointment ? staff.find((s) => s.id === selectedDetailAppointment.staffId) : undefined}
        onStatusChange={handleStatusChange}
        onEdit={(apt) => {
          setEditingAppointment(apt);
          setIsAppointmentModalOpen(true);
        }}
        onDelete={handleDeleteAppointment}
        onUpdateReport={handleUpdateReport}
      />

      {/* 3. Dogs & Clients Directory Modal */}
      <DogsClientsModal
        isOpen={isClientsDogsOpen}
        onClose={() => setIsClientsDogsOpen(false)}
        dogs={dogs}
        clients={clients}
        appointments={appointments}
        onAddNewDogAndClient={handleAddNewDogAndClient}
        onBookForDog={handleBookForDog}
      />

      {/* 4. Services Catalog Modal */}
      <ServicesModal
        isOpen={isServicesOpen}
        onClose={() => setIsServicesOpen(false)}
        services={services}
        onUpdateServices={setServices}
      />

      {/* 5. Style & Reference Matching Modal */}
      <StyleReferenceModal
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={setTheme}
        referenceImage={referenceImage}
        onSetReferenceImage={setReferenceImage}
      />
    </div>
  );
}
