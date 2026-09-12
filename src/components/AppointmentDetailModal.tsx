import React, { useState } from 'react';
import { Appointment, ClientProfile, DogProfile, Service, StaffMember, VisitCareReport } from '../types';
import { formatTime12h, addMinutesToTime, getStatusBadgeClasses, getStatusLabel, getLocationLabel } from '../utils/helpers';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Home,
  Key,
  CheckCircle2,
  AlertTriangle,
  Play,
  Bell,
  Check,
  Send,
  Trash2,
  Edit,
  ShieldCheck,
  Star,
  Copy,
  Footprints,
  HeartHandshake,
  Utensils
} from 'lucide-react';

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  dog?: DogProfile;
  client?: ClientProfile;
  service?: Service;
  staff?: StaffMember;
  onStatusChange: (aptId: string, status: Appointment['status']) => void;
  onEdit: (apt: Appointment) => void;
  onDelete: (aptId: string) => void;
  onUpdateReport?: (aptId: string, report: VisitCareReport) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  onClose,
  dog,
  client,
  service,
  staff,
  onStatusChange,
  onEdit,
  onDelete,
  onUpdateReport,
}) => {
  if (!appointment) return null;

  const [notificationMsg, setNotificationMsg] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Visit care report state
  const [peed, setPeed] = useState<boolean>(
    appointment.visitReport?.pottyBreaks?.peed ?? true
  );
  const [pooped, setPooped] = useState<boolean>(
    appointment.visitReport?.pottyBreaks?.pooped ?? true
  );
  const [foodWater, setFoodWater] = useState<boolean>(
    appointment.visitReport?.foodWaterServed ?? true
  );
  const [medicationGiven, setMedicationGiven] = useState<boolean>(
    appointment.visitReport?.medicationGiven ?? false
  );
  const [moodRating, setMoodRating] = useState<number>(
    appointment.visitReport?.moodRating ?? 5
  );
  const [sitterNotes, setSitterNotes] = useState<string>(
    appointment.visitReport?.sitterNotes ?? ''
  );
  const [reportSaved, setReportSaved] = useState(false);

  const endTime = addMinutesToTime(appointment.startTime, appointment.durationMinutes);
  const statusClasses = getStatusBadgeClasses(appointment.status);

  // Generate automated quick text notification for pet parents
  const generateNotification = (type: 'dropin_done' | 'sitting_checkin' | 'meet_greet' | 'photo_update') => {
    const dogName = dog?.name || 'your pet';
    const clientFirstName = client?.name?.split(' ')[0] || 'there';

    if (type === 'dropin_done') {
      setNotificationMsg(
        `Hi ${clientFirstName}! 🐾 Just finished our drop-in visit with ${dogName}. Refilled fresh water, served food, and enjoyed a 20-min potty walk! House is locked securely and key returned. Everything is great! 💕`
      );
    } else if (type === 'sitting_checkin') {
      setNotificationMsg(
        `Hi ${clientFirstName}! 🏡 ${dogName} is checked in and happily settled for sitting with ${staff?.name || 'our team'}! Having fun and getting lots of belly rubs and cuddles.`
      );
    } else if (type === 'meet_greet') {
      setNotificationMsg(
        `Hi ${clientFirstName}! Looking forward to our Meet & Greet consultation with ${dogName} on ${appointment.date} at ${formatTime12h(appointment.startTime)} to review routines and home access. See you soon!`
      );
    } else {
      setNotificationMsg(
        `Hi ${clientFirstName}, quick care update: ${dogName} had a fantastic afternoon playtime session! Energetic, happy, and doing wonderful.`
      );
    }
  };

  const copyToClipboard = () => {
    if (notificationMsg) {
      navigator.clipboard.writeText(notificationMsg);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  const handleSaveReport = () => {
    if (onUpdateReport) {
      onUpdateReport(appointment.id, {
        pottyBreaks: { peed, pooped },
        foodWaterServed: foodWater,
        medicationGiven,
        moodRating: moodRating as any,
        sitterNotes,
      });
      setReportSaved(true);
      setTimeout(() => setReportSaved(false), 2000);
    }
  };

  const getServiceIcon = () => {
    switch (service?.category) {
      case 'meet_greet':
        return <HeartHandshake className="w-4 h-4 text-purple-600" />;
      case 'drop_in':
        return <Footprints className="w-4 h-4 text-amber-600" />;
      case 'pet_sitting_sitter_home':
        return <Home className="w-4 h-4 text-teal-600" />;
      default:
        return <Home className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-stone-200 my-8">
        
        {/* Header with Status banner */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${statusClasses.bg} ${statusClasses.border}`}>
              <span className={`h-2 w-2 rounded-full ${statusClasses.dot}`} />
              {getStatusLabel(appointment.status)}
            </span>
            <span className="text-xs text-stone-500">
              {getLocationLabel(appointment.locationType)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-edit-apt"
              onClick={() => {
                onEdit(appointment);
                onClose();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 shadow-2xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              id="btn-delete-apt"
              onClick={() => {
                if (window.confirm(`Are you sure you want to cancel or delete this booking for ${dog?.name}?`)) {
                  onDelete(appointment.id);
                  onClose();
                }
              }}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              title="Delete Booking"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">

          {/* Dog & Pet Parent Spotlight Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-stone-200/90 bg-stone-50/60 p-4">
            <div className="flex items-center gap-3.5">
              {dog?.photoUrl ? (
                <img
                  src={dog.photoUrl}
                  alt={dog.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-amber-300 shrink-0"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-amber-100 text-amber-900 font-bold text-2xl flex items-center justify-center shrink-0">
                  {dog?.name?.[0] || '🐾'}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  {dog?.name}
                  <span className="text-xs font-normal text-stone-500">
                    ({dog?.gender === 'female' ? 'Female' : 'Male'}, {dog?.ageYears ? `${dog.ageYears} yrs` : 'Adult'})
                  </span>
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  {dog?.breed} • {dog?.weightLbs} lbs
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  {dog?.vaccinationsUpToDate ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Vaccines Verified (Rabies: {dog.rabiesExpiryDate || 'Current'})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Vaccine Expiration Due!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pet Parent Contact Card */}
            <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-stone-200 pt-3 sm:pt-0 sm:pl-4 text-xs space-y-1">
              <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                <span>{client?.name}</span>
                <span className="text-[10px] text-stone-500 font-normal">(Pet Parent)</span>
              </div>
              {client?.phone && (
                <div className="flex items-center gap-2 text-stone-600">
                  <Phone className="w-3 h-3 text-stone-400" />
                  <a href={`tel:${client.phone}`} className="hover:text-amber-600 font-medium">
                    {client.phone}
                  </a>
                </div>
              )}
              {client?.email && (
                <div className="flex items-center gap-2 text-stone-600">
                  <Mail className="w-3 h-3 text-stone-400" />
                  <span className="truncate max-w-[180px]">{client.email}</span>
                </div>
              )}
              {client?.emergencyContact && (
                <div className="text-[11px] text-stone-500 pt-0.5">
                  <span className="font-semibold text-stone-700">Emerg:</span> {client.emergencyContact}
                </div>
              )}
            </div>
          </div>

          {/* Location & Home Access Spotlight */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Service Setting & Address:</span>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-semibold text-amber-900 text-[11px]">
                {getLocationLabel(appointment.locationType)}
              </span>
            </div>
            <p className="text-amber-950 font-medium pl-6">
              {appointment.locationAddress || client?.address || 'Address provided upon booking'}
            </p>
            {(appointment.accessInstructions || client?.homeAccessNotes) && (
              <div className="mt-2 border-t border-amber-200/60 pt-2 pl-6 flex items-start gap-2">
                <Key className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900">Entry & Key / Lockbox Instructions: </span>
                  <span className="text-amber-950">
                    {appointment.accessInstructions || client?.homeAccessNotes}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Status Workflow Stepper */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Visit / Sitting Workflow Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                id="status-btn-confirmed"
                onClick={() => onStatusChange(appointment.id, 'confirmed')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  appointment.status === 'confirmed'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-200'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mb-1 text-blue-600" />
                <span>1. Confirmed</span>
              </button>

              <button
                id="status-btn-in_progress"
                onClick={() => onStatusChange(appointment.id, 'in_progress')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  appointment.status === 'in_progress'
                    ? 'border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-200'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Play className="w-4 h-4 mb-1 text-amber-600" />
                <span>2. Visit Active</span>
              </button>

              <button
                id="status-btn-ready_for_pickup"
                onClick={() => {
                  onStatusChange(appointment.id, 'ready_for_pickup');
                  generateNotification('dropin_done');
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  appointment.status === 'ready_for_pickup'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Bell className="w-4 h-4 mb-1 text-emerald-600" />
                <span>3. Ready for Return</span>
              </button>

              <button
                id="status-btn-completed"
                onClick={() => onStatusChange(appointment.id, 'completed')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  appointment.status === 'completed'
                    ? 'border-stone-800 bg-stone-100 text-stone-900 ring-2 ring-stone-300'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Check className="w-4 h-4 mb-1 text-stone-800" />
                <span>4. Completed</span>
              </button>
            </div>
          </div>

          {/* Booking & Service Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-stone-200 p-4 space-y-3">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                {getServiceIcon()}
                <span>Service Package & Add-ons</span>
              </h4>
              <div className="flex justify-between font-medium text-stone-800">
                <span>{service?.name}</span>
                <span>{service?.price === 0 ? 'Free' : `$${service?.price}`}</span>
              </div>
              {appointment.addons.length > 0 && (
                <div className="border-t border-stone-100 pt-2 space-y-1">
                  <div className="text-[11px] font-semibold text-stone-500">Care Add-ons:</div>
                  {appointment.addons.map((add) => (
                    <div key={add.id} className="flex justify-between text-stone-600">
                      <span>• {add.name}</span>
                      <span>+${add.price}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-sm text-stone-900">
                <span>Total Fee:</span>
                <span className="text-amber-700">
                  {appointment.price === 0 ? 'Complimentary ($0)' : `$${appointment.price}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>Payment Status:</span>
                <span className={`font-semibold ${appointment.paid ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {appointment.paid ? `Paid (${appointment.paymentMethod?.toUpperCase()})` : 'Unpaid / Pay upon completion'}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-stone-200 p-4 space-y-3">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Schedule & Sitter</span>
              </h4>
              <div className="space-y-1 text-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-500">Date:</span>
                  <span className="font-medium">{appointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Time Window:</span>
                  <span className="font-medium">{formatTime12h(appointment.startTime)} - {formatTime12h(endTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Duration:</span>
                  <span className="font-medium">{appointment.durationMinutes} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Assigned Sitter:</span>
                  <span className="font-medium text-stone-900">{staff?.name || 'Unassigned'} ({staff?.role})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feeding Instructions & Pet Care Notes */}
          {(dog?.feedingInstructions || appointment.notes) && (
            <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 text-xs space-y-2">
              {dog?.feedingInstructions && (
                <div className="flex items-start gap-2 text-stone-800">
                  <Utensils className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Feeding & Nutrition Instructions: </span>
                    <span>{dog.feedingInstructions}</span>
                  </div>
                </div>
              )}
              {appointment.notes && (
                <div className="border-t border-stone-200/60 pt-2 text-stone-700">
                  <span className="font-bold text-stone-900">Specific Sitter Notes: </span>
                  <p className="mt-0.5 leading-relaxed">{appointment.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Sitter Care Log & Visit Report */}
          <div className="rounded-xl border border-stone-200 p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-amber-600" />
                <span>Sitter Visit Care Log & Pet Parent Report</span>
              </h4>
              {reportSaved && (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved!
                </span>
              )}
            </div>

            {/* Checklist of visit milestones */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-2 cursor-pointer hover:bg-stone-100">
                <input
                  type="checkbox"
                  checked={peed}
                  onChange={(e) => setPeed(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-stone-800">💧 Pee Break</span>
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-2 cursor-pointer hover:bg-stone-100">
                <input
                  type="checkbox"
                  checked={pooped}
                  onChange={(e) => setPooped(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-stone-800">💩 Poop Break</span>
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-2 cursor-pointer hover:bg-stone-100">
                <input
                  type="checkbox"
                  checked={foodWater}
                  onChange={(e) => setFoodWater(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-stone-800">🥣 Food & Water</span>
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-2 cursor-pointer hover:bg-stone-100">
                <input
                  type="checkbox"
                  checked={medicationGiven}
                  onChange={(e) => setMedicationGiven(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium text-stone-800">💊 Medication</span>
              </label>
            </div>

            {/* Pet Mood / Energy rating */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-stone-100 pt-2 text-xs">
              <span className="font-semibold text-stone-700">Pet Mood & Energy Level:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setMoodRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= moodRating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-medium text-stone-600">
                  {moodRating === 5 ? '5/5 (Super Happy & Relaxed)' : `${moodRating}/5`}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1 text-xs">
                Sitter Visit Summary & Routine Notes
              </label>
              <textarea
                rows={2}
                value={sitterNotes}
                onChange={(e) => setSitterNotes(e.target.value)}
                placeholder="e.g. Played fetch in back lawn for 20 mins, refilled bowl with cool water, ate entire meal. Locked doors and set deadbolt."
                className="w-full rounded-lg border border-stone-300 bg-white p-2 text-xs text-stone-800"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveReport}
                className="rounded-lg bg-stone-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-stone-900 transition-colors"
              >
                Save Visit Care Log
              </button>
            </div>
          </div>

          {/* Client Text / Notification Generator */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-amber-600" />
                <span>Pet Parent SMS & Status Updates</span>
              </h4>
              <span className="text-[11px] text-stone-500">1-click message templates</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => generateNotification('dropin_done')}
                className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:border-amber-400 hover:text-amber-800"
              >
                🐾 "Drop-In Visit Complete"
              </button>
              <button
                type="button"
                onClick={() => generateNotification('sitting_checkin')}
                className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:border-amber-400 hover:text-amber-800"
              >
                🏡 "Sitting Check-In"
              </button>
              <button
                type="button"
                onClick={() => generateNotification('meet_greet')}
                className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:border-amber-400 hover:text-amber-800"
              >
                🤝 "Meet & Greet Reminder"
              </button>
              <button
                type="button"
                onClick={() => generateNotification('photo_update')}
                className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:border-amber-400 hover:text-amber-800"
              >
                📸 "Happy Pet Update"
              </button>
            </div>

            {notificationMsg && (
              <div className="relative mt-2">
                <textarea
                  rows={3}
                  value={notificationMsg}
                  onChange={(e) => setNotificationMsg(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Recipient: {client?.name} ({client?.phone || 'No phone recorded'})
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 rounded-md bg-stone-800 px-3 py-1 text-xs font-medium text-white hover:bg-stone-700 transition-colors"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-3 flex justify-end">
          <button
            type="button"
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
