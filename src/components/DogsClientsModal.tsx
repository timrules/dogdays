import React, { useState } from 'react';
import { Appointment, ClientProfile, DogProfile } from '../types';
import {
  X,
  Search,
  Plus,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  User,
  Dog as DogIcon,
  Home,
  Key,
  Utensils
} from 'lucide-react';

interface DogsClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dogs: DogProfile[];
  clients: ClientProfile[];
  appointments: Appointment[];
  onAddNewDogAndClient: (dog: Omit<DogProfile, 'id'>, client: Omit<ClientProfile, 'id'>) => void;
  onBookForDog: (dogId: string) => void;
}

export const DogsClientsModal: React.FC<DogsClientsModalProps> = ({
  isOpen,
  onClose,
  dogs,
  clients,
  appointments,
  onAddNewDogAndClient,
  onBookForDog,
}) => {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'dogs' | 'clients'>('dogs');

  // Add form state
  const [dogName, setDogName] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(3);
  const [temperamentInput, setTemperamentInput] = useState('');
  const [feedingInstructions, setFeedingInstructions] = useState('');
  const [medicalAlerts, setMedicalAlerts] = useState('');
  const [vaccinesCurrent, setVaccinesCurrent] = useState(true);
  const [rabiesExpiry, setRabiesExpiry] = useState('2027-06-30');
  const [photoUrl, setPhotoUrl] = useState('');

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [homeAccessNotes, setHomeAccessNotes] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const clientMap = new Map<string, ClientProfile>(clients.map((c) => [c.id, c]));

  const filteredDogs = dogs.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.breed.toLowerCase().includes(search.toLowerCase()) ||
      clientMap.get(d.ownerId)?.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const tempArray = temperamentInput
      ? temperamentInput.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Friendly'];

    onAddNewDogAndClient(
      {
        name: dogName,
        breed,
        weightLbs: Number(weight),
        gender,
        ageYears: Number(age),
        temperament: tempArray,
        feedingInstructions,
        medicalAlerts,
        vaccinationsUpToDate: vaccinesCurrent,
        rabiesExpiryDate: rabiesExpiry,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=80',
        ownerId: '', // Assigned in handler
      },
      {
        name: clientName,
        phone: clientPhone,
        email: clientEmail,
        address: clientAddress,
        homeAccessNotes,
        emergencyContact,
      }
    );

    // Reset
    setDogName('');
    setBreed('');
    setFeedingInstructions('');
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setClientAddress('');
    setHomeAccessNotes('');
    setEmergencyContact('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-stone-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow-2xs">
              <DogIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Pets & Pet Parent Directory
              </h2>
              <p className="text-xs text-stone-500">
                Manage pet care routines, feeding schedules, lockbox access, and addresses
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action / Search Bar */}
        <div className="border-b border-stone-100 bg-stone-50/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-stone-200 bg-stone-100 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('dogs')}
                className={`rounded-md px-3 py-1 transition-all ${
                  activeTab === 'dogs' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                Pets ({dogs.length})
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`rounded-md px-3 py-1 transition-all ${
                  activeTab === 'clients' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                }`}
              >
                Pet Parents ({clients.length})
              </button>
            </div>

            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pet, breed, owner, address..."
                className="w-full rounded-lg border border-stone-200 bg-white py-1.5 pl-8 pr-3 text-xs text-stone-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Close Form' : 'Register New Pet & Parent'}</span>
          </button>
        </div>

        {/* New Pet & Parent Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleCreateNew} className="border-b border-stone-200 bg-amber-50/30 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Register New Pet & Sitting Client Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Pet Name *</label>
                <input
                  type="text"
                  required
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="e.g. Barnaby"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Breed *</label>
                <input
                  type="text"
                  required
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Weight (lbs) & Gender</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-20 rounded-lg border border-stone-300 bg-white p-2"
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="flex-1 rounded-lg border border-stone-300 bg-white p-2"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Rabies Expiration</label>
                <input
                  type="date"
                  value={rabiesExpiry}
                  onChange={(e) => setRabiesExpiry(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Owner Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Jessica Taylor"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Owner Phone *</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Owner Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>
            </div>

            {/* Address & Home Access Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Home Address *</label>
                <input
                  type="text"
                  required
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Street address & Apt #"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Lockbox / Key / Gate Code</label>
                <input
                  type="text"
                  value={homeAccessNotes}
                  onChange={(e) => setHomeAccessNotes(e.target.value)}
                  placeholder="Code #1234, side porch key"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Name & phone number"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Feeding Routine & Schedule</label>
                <input
                  type="text"
                  value={feedingInstructions}
                  onChange={(e) => setFeedingInstructions(e.target.value)}
                  placeholder="e.g. 1 cup kibble at 8am & 5pm"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Temperament / Personality</label>
                <input
                  type="text"
                  value={temperamentInput}
                  onChange={(e) => setTemperamentInput(e.target.value)}
                  placeholder="e.g. Friendly, Loves fetch, Cuddle bug"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Medications & Allergies</label>
                <input
                  type="text"
                  value={medicalAlerts}
                  onChange={(e) => setMedicalAlerts(e.target.value)}
                  placeholder="e.g. Apoquel 1 tablet AM with cheese"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700"
              >
                Save New Pet & Parent
              </button>
            </div>
          </form>
        )}

        {/* Directory Content List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'dogs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDogs.map((dog) => {
                const owner = clientMap.get(dog.ownerId);
                const dogApts = appointments.filter((a) => a.dogId === dog.id);

                return (
                  <div
                    key={dog.id}
                    className="rounded-xl border border-stone-200/90 bg-white p-4 shadow-2xs hover:border-amber-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {dog.photoUrl ? (
                            <img
                              src={dog.photoUrl}
                              alt={dog.name}
                              className="h-14 w-14 rounded-full object-cover ring-2 ring-stone-100"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xl">
                              {dog.name[0]}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                              {dog.name}
                              <span className="text-xs font-normal text-stone-500">
                                ({dog.breed})
                              </span>
                            </h4>
                            <p className="text-xs text-stone-600">
                              {dog.weightLbs} lbs • {dog.gender === 'female' ? 'Female' : 'Male'} • {dog.ageYears ? `${dog.ageYears} yrs` : 'Adult'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onBookForDog(dog.id);
                            onClose();
                          }}
                          className="rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 text-xs font-semibold shadow-2xs active:scale-95"
                        >
                          + Book
                        </button>
                      </div>

                      {/* Owner, Routine, & Vaccines */}
                      <div className="mt-3 border-t border-stone-100 pt-2.5 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-stone-600">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            {owner?.name} ({owner?.phone})
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {dogApts.length} booking{dogApts.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {owner?.address && (
                          <div className="flex items-center gap-1 text-[11px] text-stone-500">
                            <Home className="w-3 h-3 text-stone-400" />
                            <span>{owner.address}</span>
                          </div>
                        )}

                        {dog.feedingInstructions && (
                          <div className="flex items-center gap-1 text-[11px] text-stone-700 bg-stone-50 p-1.5 rounded border border-stone-200/60">
                            <Utensils className="w-3 h-3 text-amber-600 shrink-0" />
                            <span><strong>Feeding:</strong> {dog.feedingInstructions}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[11px]">
                          {dog.vaccinationsUpToDate ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Rabies Expiry: {dog.rabiesExpiryDate || 'Verified'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              Vaccine Update Required
                            </span>
                          )}
                        </div>

                        {/* Temperament Badges */}
                        {dog.temperament && dog.temperament.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {dog.temperament.map((tag, i) => (
                              <span
                                key={i}
                                className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {dog.medicalAlerts && (
                          <p className="text-[11px] text-rose-700 font-medium bg-rose-50 rounded p-1.5 mt-1 border border-rose-100">
                            ⚠️ {dog.medicalAlerts}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClients.map((client) => {
                const clientDogs = dogs.filter((d) => d.ownerId === client.id);

                return (
                  <div
                    key={client.id}
                    className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">
                          {client.name}
                        </h4>
                        <div className="mt-1 flex items-center gap-2 text-xs text-stone-600">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <a href={`tel:${client.phone}`} className="hover:text-amber-600 font-medium">
                            {client.phone}
                          </a>
                        </div>
                        {client.email && (
                          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                            <Mail className="w-3 h-3 text-stone-400" />
                            <span>{client.email}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="flex items-center gap-2 text-xs text-stone-600 mt-0.5">
                            <Home className="w-3 h-3 text-stone-400 shrink-0" />
                            <span>{client.address}</span>
                          </div>
                        )}
                      </div>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-700">
                        {clientDogs.length} Pet{clientDogs.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {client.homeAccessNotes && (
                      <div className="text-xs text-amber-900 bg-amber-50/70 border border-amber-200/60 rounded p-2 flex items-start gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Access:</strong> {client.homeAccessNotes}
                        </div>
                      </div>
                    )}

                    {client.emergencyContact && (
                      <div className="text-[11px] text-stone-500">
                        <strong>Emergency Contact:</strong> {client.emergencyContact}
                      </div>
                    )}

                    <div className="border-t border-stone-100 pt-2 flex flex-wrap gap-2">
                      {clientDogs.map((d) => (
                        <span
                          key={d.id}
                          className="rounded-md bg-amber-50 border border-amber-200 px-2 py-1 text-xs font-semibold text-amber-900 flex items-center gap-1"
                        >
                          🐾 {d.name} ({d.breed})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
