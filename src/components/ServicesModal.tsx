import React, { useState } from 'react';
import { Service, ServiceCategory, SittingLocationType } from '../types';
import { X, Home, Plus, Clock, Sparkles, Footprints, HeartHandshake, MapPin } from 'lucide-react';
import { getCategoryLabel, getLocationLabel } from '../utils/helpers';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  isOpen,
  onClose,
  services,
  onUpdateServices,
}) => {
  if (!isOpen) return null;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newCategory, setNewCategory] = useState<ServiceCategory>('pet_sitting_client_home');
  const [newLocationType, setNewLocationType] = useState<SittingLocationType>('client_home');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState<number>(30);
  const [newPrice, setNewPrice] = useState<number>(35);

  const handleCategoryChange = (cat: ServiceCategory) => {
    setNewCategory(cat);
    if (cat === 'pet_sitting_sitter_home') {
      setNewLocationType('sitter_home');
      setNewDuration(480);
      setNewPrice(65);
    } else if (cat === 'drop_in') {
      setNewLocationType('client_home');
      setNewDuration(30);
      setNewPrice(28);
    } else if (cat === 'meet_greet') {
      setNewLocationType('meet_greet');
      setNewDuration(30);
      setNewPrice(0);
    } else {
      setNewLocationType('client_home');
      setNewDuration(120);
      setNewPrice(45);
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: Service = {
      id: `srv-${Date.now()}`,
      name: newServiceName,
      category: newCategory,
      locationType: newLocationType,
      description: newDescription,
      durationMinutes: Number(newDuration),
      price: Number(newPrice),
      color: '#f59e0b',
      availableAddons: [
        { id: `add-${Date.now()}-1`, name: 'Oral Medication Administration', price: 5, durationMinutes: 5 },
        { id: `add-${Date.now()}-2`, name: 'Extra 15-Minute Outdoor Play', price: 10, durationMinutes: 15 },
        { id: `add-${Date.now()}-3`, name: 'Plant Watering & Mail Retrieval', price: 6, durationMinutes: 5 }
      ]
    };
    onUpdateServices([...services, newService]);
    setNewServiceName('');
    setNewDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-stone-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow-2xs">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Pet Sitting & Visit Services Menu
              </h2>
              <p className="text-xs text-stone-500">
                Configure in-home sitting, sitter home boarding, drop-ins, meet & greets, and care add-ons
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

        {/* Action Bar */}
        <div className="border-b border-stone-100 bg-stone-50/50 px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-700">
            {services.length} Active Services & Packages
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancel' : 'Add New Service / Package'}</span>
          </button>
        </div>

        {/* New Service Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleCreateService} className="border-b border-stone-200 bg-amber-50/30 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Create New Pet Sitting or Visit Service
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. 45-Minute Extended Drop-In & Snuggle"
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Category & Type *</label>
                <select
                  value={newCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as ServiceCategory)}
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                >
                  <option value="pet_sitting_client_home">Pet Sitting in Client Home</option>
                  <option value="pet_sitting_sitter_home">Pet Sitting in Sitter Home</option>
                  <option value="drop_in">Drop-In Visit</option>
                  <option value="meet_greet">Meet & Greet Consultation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Sitting Location *</label>
                <select
                  value={newLocationType}
                  onChange={(e) => setNewLocationType(e.target.value as SittingLocationType)}
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                >
                  <option value="client_home">Client Home</option>
                  <option value="sitter_home">Sitter Home</option>
                  <option value="meet_greet">Meet & Greet</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Duration (minutes) *</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  required
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Standard Rate ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-stone-300 bg-white p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1 text-xs">Description</label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Care details, feeding, playtime, walk info, and check-in routine..."
                className="w-full rounded-lg border border-stone-300 bg-white p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Save Service
              </button>
            </div>
          </form>
        )}

        {/* Services List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-amber-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {service.name}
                    </h4>
                    <span className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                      {getCategoryLabel(service.category)}
                    </span>
                    <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-stone-400" />
                      {getLocationLabel(service.locationType)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-stone-900">
                    {service.price === 0 ? 'Complimentary' : `$${service.price}`}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-500 justify-end mt-0.5">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{service.durationMinutes} mins</span>
                  </div>
                </div>
              </div>

              {/* Addons List */}
              {service.availableAddons && service.availableAddons.length > 0 && (
                <div className="mt-3 border-t border-stone-100 pt-2.5">
                  <div className="text-[11px] font-semibold text-stone-500 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Available Care Enhancements:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {service.availableAddons.map((add) => (
                      <span
                        key={add.id}
                        className="rounded-md bg-stone-50 border border-stone-200 px-2 py-0.5 text-xs text-stone-700"
                      >
                        {add.name} (+${add.price} • {add.durationMinutes}m)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
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
