import React, { useState } from 'react';
import { Appointment, ClientProfile, DogProfile, Service, StaffMember, ServiceAddon, SittingLocationType } from '../types';
import { X, Clock, Calendar, User, Sparkles, Check, Home, MapPin, Key, Shield } from 'lucide-react';
import { getLocationLabel } from '../utils/helpers';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (aptData: Partial<Appointment>) => void;
  initialAppointment?: Appointment | null;
  defaultDate?: string;
  defaultTime?: string;
  dogs: DogProfile[];
  clients: ClientProfile[];
  services: Service[];
  staff: StaffMember[];
  onAddNewDog?: (dog: Omit<DogProfile, 'id'>, client: Omit<ClientProfile, 'id'>) => { dogId: string; clientId: string };
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAppointment,
  defaultDate,
  defaultTime,
  dogs,
  clients,
  services,
  staff,
}) => {
  if (!isOpen) return null;

  const [selectedDogId, setSelectedDogId] = useState<string>(
    initialAppointment?.dogId || dogs[0]?.id || ''
  );
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialAppointment?.clientId || clients[0]?.id || ''
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialAppointment?.serviceId || services[0]?.id || ''
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    initialAppointment?.staffId || staff[0]?.id || ''
  );
  const [date, setDate] = useState<string>(
    initialAppointment?.date || defaultDate || new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState<string>(
    initialAppointment?.startTime || defaultTime || '10:00'
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(
    initialAppointment?.durationMinutes || 30
  );
  const [locationType, setLocationType] = useState<SittingLocationType>(
    initialAppointment?.locationType || services[0]?.locationType || 'client_home'
  );
  const [locationAddress, setLocationAddress] = useState<string>(
    initialAppointment?.locationAddress || ''
  );
  const [accessInstructions, setAccessInstructions] = useState<string>(
    initialAppointment?.accessInstructions || ''
  );
  const [status, setStatus] = useState<Appointment['status']>(
    initialAppointment?.status || 'confirmed'
  );
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>(
    initialAppointment?.addons || []
  );
  const [customPrice, setCustomPrice] = useState<string>(
    initialAppointment ? String(initialAppointment.price) : ''
  );
  const [paid, setPaid] = useState<boolean>(
    initialAppointment?.paid || false
  );
  const [paymentMethod, setPaymentMethod] = useState<Appointment['paymentMethod']>(
    initialAppointment?.paymentMethod || 'unpaid'
  );
  const [notes, setNotes] = useState<string>(
    initialAppointment?.notes || ''
  );

  // When dog is selected, automatically update client and default access info
  const handleDogChange = (dogId: string) => {
    setSelectedDogId(dogId);
    const chosenDog = dogs.find((d) => d.id === dogId);
    if (chosenDog && chosenDog.ownerId) {
      setSelectedClientId(chosenDog.ownerId);
      const owner = clients.find((c) => c.id === chosenDog.ownerId);
      if (owner) {
        if (!locationAddress) setLocationAddress(owner.address || '');
        if (!accessInstructions) setAccessInstructions(owner.homeAccessNotes || '');
      }
    }
  };

  // When service is selected, update duration, default price, and location type
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const srv = services.find((s) => s.id === serviceId);
    if (srv) {
      setLocationType(srv.locationType);
      const addonsTotalTime = selectedAddons.reduce((acc, a) => acc + a.durationMinutes, 0);
      setDurationMinutes(srv.durationMinutes + addonsTotalTime);
      
      const addonsTotalPrice = selectedAddons.reduce((acc, a) => acc + a.price, 0);
      setCustomPrice(String(srv.price + addonsTotalPrice));

      // Preset location address if sitter home vs client home
      if (srv.locationType === 'sitter_home') {
        const assignedStaff = staff.find((st) => st.id === selectedStaffId);
        setLocationAddress(`Sitter ${assignedStaff?.name || 'Sitter'} Home Residence`);
      } else {
        const owner = clients.find((c) => c.id === selectedClientId);
        if (owner?.address) setLocationAddress(owner.address);
      }
    }
  };

  const activeService = services.find((s) => s.id === selectedServiceId);
  const calculatedBasePrice = activeService ? activeService.price : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = customPrice !== '' ? parseFloat(customPrice) || 0 : calculatedBasePrice + addonsTotal;

  const toggleAddon = (addon: ServiceAddon) => {
    const exists = selectedAddons.some((a) => a.id === addon.id);
    let updated: ServiceAddon[];
    if (exists) {
      updated = selectedAddons.filter((a) => a.id !== addon.id);
    } else {
      updated = [...selectedAddons, addon];
    }
    setSelectedAddons(updated);

    const baseDuration = activeService?.durationMinutes || 30;
    const addDuration = updated.reduce((s, a) => s + a.durationMinutes, 0);
    setDurationMinutes(baseDuration + addDuration);

    const baseP = activeService?.price || 0;
    const addP = updated.reduce((s, a) => s + a.price, 0);
    setCustomPrice(String(baseP + addP));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      dogId: selectedDogId,
      clientId: selectedClientId,
      serviceId: selectedServiceId,
      staffId: selectedStaffId,
      date,
      startTime,
      durationMinutes: Number(durationMinutes),
      locationType,
      locationAddress,
      accessInstructions,
      status,
      addons: selectedAddons,
      price: totalPrice,
      paid,
      paymentMethod,
      notes,
    });
    onClose();
  };

  const selectedDog = dogs.find((d) => d.id === selectedDogId);
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden border border-stone-200 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {initialAppointment ? 'Edit Pet Sitting Booking' : 'Schedule Pet Sitting or Visit'}
              </h2>
              <p className="text-xs text-stone-500">
                Book in-home sitting, drop-in visit, or meet & greet
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Pet & Pet Parent Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Dog / Pet Profile <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-dog"
                value={selectedDogId}
                onChange={(e) => handleDogChange(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              >
                {dogs.map((dog) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name} ({dog.breed} - {dog.weightLbs} lbs)
                  </option>
                ))}
              </select>
              {selectedDog && (
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-stone-500">
                  <span>Vaccinations: {selectedDog.vaccinationsUpToDate ? '✅ Verified' : '⚠️ Due'}</span>
                  {selectedDog.feedingInstructions && (
                    <span className="truncate">• 🍽️ {selectedDog.feedingInstructions}</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Owner / Pet Parent <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-client"
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  const cl = clients.find((c) => c.id === e.target.value);
                  if (cl?.address && !locationAddress) setLocationAddress(cl.address);
                  if (cl?.homeAccessNotes && !accessInstructions) setAccessInstructions(cl.homeAccessNotes);
                }}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
              </select>
              {selectedClient?.phone && (
                <div className="mt-1.5 text-[11px] text-stone-500 truncate">
                  Phone: {selectedClient.phone} {selectedClient.address ? `• ${selectedClient.address}` : ''}
                </div>
              )}
            </div>
          </div>

          {/* Service & Staff Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Sitting Service / Visit Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-service"
                value={selectedServiceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} ({srv.price === 0 ? 'Free' : `$${srv.price}`} • {srv.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Assigned Sitter / Host <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-staff"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              >
                {staff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sitting Location & Access Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-stone-200 bg-stone-50/70 p-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Sitting Setting
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as SittingLocationType)}
                className="w-full rounded-lg border border-stone-300 bg-white p-2 text-xs"
              >
                <option value="client_home">Client Home (In-Home / Drop-In)</option>
                <option value="sitter_home">Sitter Home (Boarding)</option>
                <option value="meet_greet">Meet & Greet (Consultation)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Location Address
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="Street address or park location"
                className="w-full rounded-lg border border-stone-300 bg-white p-2 text-xs"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Home Access Info (Lockbox, Gate Code, Alarm, Key Location)</span>
              </label>
              <input
                type="text"
                value={accessInstructions}
                onChange={(e) => setAccessInstructions(e.target.value)}
                placeholder="e.g. Side porch lockbox code #4092. Park on left side of driveway."
                className="w-full rounded-lg border border-stone-300 bg-white p-2 text-xs"
              />
            </div>
          </div>

          {/* Service Add-ons (Medication, extra walk, plant care, etc.) */}
          {activeService?.availableAddons && activeService.availableAddons.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5">
              <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center justify-between">
                <span>Care Enhancements & Add-Ons</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeService.availableAddons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between rounded-lg border p-2 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-medium'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`h-4 w-4 rounded border flex items-center justify-center ${isChecked ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300 bg-white'}`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-stone-900 shrink-0">
                        +${addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Date, Start Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Duration (minutes) <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-duration"
                type="number"
                min="15"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Pricing, Payment & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-100 pt-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Rate / Total ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">$</span>
                <input
                  id="input-price"
                  type="number"
                  step="0.5"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder={String(totalPrice)}
                  className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-7 pr-3 text-xs font-semibold text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Payment Status
              </label>
              <div className="flex items-center gap-3 py-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paid}
                    onChange={(e) => {
                      setPaid(e.target.checked);
                      if (e.target.checked && paymentMethod === 'unpaid') setPaymentMethod('card');
                      if (!e.target.checked) setPaymentMethod('unpaid');
                    }}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Mark as Paid</span>
                </label>
                {paid && (
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="text-xs rounded border border-stone-200 py-0.5 px-1.5 bg-stone-50"
                  >
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Booking Status
              </label>
              <select
                id="select-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">Visit Active / In Progress</option>
                <option value="ready_for_pickup">Ready for Pickup / Return</option>
                <option value="completed">Completed</option>
                <option value="pending">Awaiting Confirmation</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Notes & Pet Care Instructions */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Care Instructions & Sitter Routine Notes
            </label>
            <textarea
              id="input-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Feed 1 cup kibble at 5pm, 20 min walk around block, lock front deadbolt upon leaving..."
              className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-stone-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-save-appointment"
              type="submit"
              className="rounded-lg bg-amber-600 hover:bg-amber-700 active:scale-95 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-all"
            >
              {initialAppointment ? 'Save Changes' : 'Confirm & Schedule Booking'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
