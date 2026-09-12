import React from 'react';
import { Appointment, ClientProfile, DogProfile, Service, StaffMember } from '../types';
import { addMinutesToTime, formatTime12h, getStatusBadgeClasses, getStatusLabel, getLocationLabel } from '../utils/helpers';
import {
  Clock,
  Home,
  MapPin,
  Key,
  User,
  Phone,
  CheckCircle,
  Play,
  Bell,
  AlertTriangle,
  HeartHandshake,
  Footprints,
  FileText
} from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  dog?: DogProfile;
  client?: ClientProfile;
  service?: Service;
  staff?: StaffMember;
  onSelect: (apt: Appointment) => void;
  onStatusChange: (aptId: string, newStatus: Appointment['status']) => void;
  compact?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  dog,
  client,
  service,
  staff,
  onSelect,
  onStatusChange,
  compact = false,
}) => {
  const endTime = addMinutesToTime(appointment.startTime, appointment.durationMinutes);
  const statusClasses = getStatusBadgeClasses(appointment.status);

  // Quick next status action helper
  const getNextStatus = () => {
    switch (appointment.status) {
      case 'pending':
        return { label: 'Confirm Booking', next: 'confirmed' as const, icon: CheckCircle, color: 'bg-blue-600 text-white' };
      case 'confirmed':
        return { label: 'Check In / Start Visit', next: 'in_progress' as const, icon: Play, color: 'bg-amber-600 text-white' };
      case 'in_progress':
        if (appointment.locationType === 'sitter_home') {
          return { label: 'Ready for Pickup', next: 'ready_for_pickup' as const, icon: Bell, color: 'bg-emerald-600 text-white' };
        }
        return { label: 'Complete Visit', next: 'completed' as const, icon: CheckCircle, color: 'bg-emerald-700 text-white' };
      case 'ready_for_pickup':
        return { label: 'Complete & Picked Up', next: 'completed' as const, icon: CheckCircle, color: 'bg-stone-800 text-white' };
      default:
        return null;
    }
  };

  const nextAction = getNextStatus();

  const getCategoryIcon = () => {
    switch (service?.category) {
      case 'meet_greet':
        return <HeartHandshake className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case 'drop_in':
        return <Footprints className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'pet_sitting_sitter_home':
        return <Home className="w-3.5 h-3.5 text-teal-600 shrink-0" />;
      default:
        return <Home className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
    }
  };

  if (compact) {
    return (
      <div
        id={`apt-compact-${appointment.id}`}
        onClick={() => onSelect(appointment)}
        className="group cursor-pointer rounded-lg border border-stone-200 bg-white p-2.5 shadow-xs transition-all hover:border-amber-400 hover:shadow-sm"
      >
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-stone-800 flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            {formatTime12h(appointment.startTime)}
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusClasses.bg} ${statusClasses.border} border`}>
            {getStatusLabel(appointment.status)}
          </span>
        </div>
        <div className="font-medium text-stone-900 text-sm truncate flex items-center gap-1.5">
          {dog?.name || 'Unknown Dog'}
          <span className="text-xs text-stone-500 font-normal">({dog?.breed || 'Pet'})</span>
        </div>
        <div className="text-xs text-stone-600 truncate flex items-center gap-1 mt-0.5">
          {getCategoryIcon()}
          <span>{service?.name || 'Sitting Service'}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-stone-500">
          <MapPin className="w-2.5 h-2.5 text-stone-400" />
          <span className="truncate">{getLocationLabel(appointment.locationType)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`apt-card-${appointment.id}`}
      onClick={() => onSelect(appointment)}
      className="group relative cursor-pointer rounded-xl border border-stone-200/90 bg-white p-4 shadow-xs transition-all hover:border-amber-400 hover:shadow-md"
    >
      {/* Top Header: Time & Status Badge & Location Type */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-800">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>{formatTime12h(appointment.startTime)} - {formatTime12h(endTime)}</span>
          </div>
          <span className="text-xs text-stone-500 font-medium">({appointment.durationMinutes}m)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Location Badge */}
          <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-700">
            <MapPin className="w-3 h-3 text-stone-500" />
            {getLocationLabel(appointment.locationType)}
          </span>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${statusClasses.bg} ${statusClasses.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusClasses.dot}`} />
            {getStatusLabel(appointment.status)}
          </span>
        </div>
      </div>

      {/* Main Card Body: Dog & Owner Details */}
      <div className="mt-3 flex items-start gap-3">
        {/* Dog Avatar */}
        <div className="relative shrink-0">
          {dog?.photoUrl ? (
            <img
              src={dog.photoUrl}
              alt={dog.name}
              className="h-13 w-13 rounded-full object-cover ring-2 ring-stone-100 group-hover:ring-amber-300 transition-all"
            />
          ) : (
            <div className="h-13 w-13 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
              {dog?.name?.[0] || '🐾'}
            </div>
          )}
          {dog && !dog.vaccinationsUpToDate && (
            <span
              title="Vaccine update required"
              className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] text-white ring-1 ring-white"
            >
              !
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between">
            <h3 className="font-semibold text-stone-900 text-base leading-tight truncate flex items-center gap-1.5">
              {dog?.name || 'Pet'}
              <span className="text-xs font-normal text-stone-500 truncate">
                • {dog?.breed} {dog?.weightLbs ? `(${dog.weightLbs} lbs)` : ''}
              </span>
            </h3>
            <span className="font-semibold text-stone-900 text-sm shrink-0 ml-2">
              {appointment.price === 0 ? 'Free' : `$${appointment.price}`}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-xs text-stone-700 font-medium">
            {getCategoryIcon()}
            <span className="truncate">{service?.name || 'Pet Care Service'}</span>
            {appointment.addons.length > 0 && (
              <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-600 shrink-0">
                +{appointment.addons.length} add-on{appointment.addons.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1 truncate">
              <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {client?.name || 'Client'}
            </span>
            {client?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                {client.phone}
              </span>
            )}
          </div>

          {/* Home Access Note Indicator */}
          {(appointment.accessInstructions || client?.homeAccessNotes) && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50/70 border border-amber-200/60 rounded px-2 py-0.5 max-w-md">
              <Key className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate font-medium">
                {appointment.accessInstructions || client?.homeAccessNotes}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Special Warnings or Temperament / Care Notes */}
      {dog?.temperament && dog.temperament.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {dog.temperament.map((tag, idx) => (
            <span
              key={idx}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                tag.toLowerCase().includes('nervous') || tag.toLowerCase().includes('protective') || tag.toLowerCase().includes('allerg')
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              {tag}
            </span>
          ))}
          {dog?.feedingInstructions && (
            <span className="rounded-md bg-stone-100 border border-stone-200 px-2 py-0.5 text-[11px] font-medium text-stone-700 flex items-center gap-1 truncate max-w-xs">
              🍽️ {dog.feedingInstructions}
            </span>
          )}
          {dog?.medicalAlerts && (
            <span className="rounded-md bg-rose-50 border border-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              Med / Allergy
            </span>
          )}
        </div>
      )}

      {/* Sitter Care Log summary snippet if active/completed */}
      {appointment.visitReport && (
        <div className="mt-2 rounded bg-stone-50 border border-stone-200/80 p-2 text-xs text-stone-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium text-stone-800">Care Log:</span>
            <span>
              {appointment.visitReport.pottyBreaks?.peed ? '💧 Pee ✅' : ''}{' '}
              {appointment.visitReport.pottyBreaks?.pooped ? '💩 Poop ✅' : ''}{' '}
              {appointment.visitReport.foodWaterServed ? '🥣 Fed ✅' : ''}
            </span>
          </div>
          {appointment.visitReport.moodRating && (
            <span className="text-amber-500 font-bold">
              {'⭐'.repeat(appointment.visitReport.moodRating)}
            </span>
          )}
        </div>
      )}

      {/* Footer bar with Sitter and Quick Advance Action */}
      <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          {staff?.avatar ? (
            <img src={staff.avatar} alt={staff.name} className="w-4.5 h-4.5 rounded-full object-cover" />
          ) : (
            <div className="w-4.5 h-4.5 rounded-full bg-stone-300" />
          )}
          <span className="text-stone-700 font-medium truncate">{staff?.name || 'Unassigned Sitter'}</span>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {nextAction && (
            <button
              id={`quick-status-btn-${appointment.id}`}
              onClick={() => onStatusChange(appointment.id, nextAction.next)}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all shadow-2xs hover:opacity-90 active:scale-95 ${nextAction.color}`}
            >
              <nextAction.icon className="w-3 h-3" />
              {nextAction.label}
            </button>
          )}

          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${appointment.paid ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
            {appointment.price === 0 ? 'Free' : appointment.paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      </div>
    </div>
  );
};
