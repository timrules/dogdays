import React from 'react';
import { Appointment, ClientProfile, DogProfile, Service, StaffMember, ViewMode } from '../types';
import { AppointmentCard } from './AppointmentCard';
import { formatTime12h, addMinutesToTime, getStatusBadgeClasses, getStatusLabel, getLocationLabel } from '../utils/helpers';
import {
  Clock,
  Plus,
  Calendar,
  Home,
  MapPin,
  Key,
  Footprints,
  HeartHandshake
} from 'lucide-react';

interface ScheduleViewProps {
  viewMode: ViewMode;
  currentDateStr: string;
  onDateChange: (d: string) => void;
  appointments: Appointment[];
  dogs: DogProfile[];
  clients: ClientProfile[];
  services: Service[];
  staff: StaffMember[];
  onSelectAppointment: (apt: Appointment) => void;
  onStatusChange: (aptId: string, newStatus: Appointment['status']) => void;
  onBookAtTime: (date: string, time: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  viewMode,
  currentDateStr,
  onDateChange,
  appointments,
  dogs,
  clients,
  services,
  staff,
  onSelectAppointment,
  onStatusChange,
  onBookAtTime,
}) => {
  const dogMap = new Map<string, DogProfile>(dogs.map((d) => [d.id, d]));
  const clientMap = new Map<string, ClientProfile>(clients.map((c) => [c.id, c]));
  const serviceMap = new Map<string, Service>(services.map((s) => [s.id, s]));
  const staffMap = new Map<string, StaffMember>(staff.map((st) => [st.id, st]));

  // Standard hours for pet sitting visits & drop-ins: 08:00 AM to 06:00 PM
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // --------------------------------------------------------------------------
  // 1. DAY VIEW
  // --------------------------------------------------------------------------
  if (viewMode === 'day') {
    const dayAppointments = appointments
      .filter((a) => a.date === currentDateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
      <div className="px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900">
              Daily Visits & Pet Sitting Schedule
            </h2>
            <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-700">
              {dayAppointments.length} Scheduled
            </span>
          </div>
          <span className="text-xs text-stone-500">
            Click any open slot or "+ Book" to schedule a visit
          </span>
        </div>

        {dayAppointments.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-stone-200 p-12 text-center bg-stone-50/50">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-stone-900">No visits or pet sitting scheduled for this date</h3>
            <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
              Your sitters' calendar is open. Schedule a drop-in, in-home sit, or meet & greet.
            </p>
            <div className="mt-5">
              <button
                id="btn-book-empty-day"
                onClick={() => onBookAtTime(currentDateStr, '09:00')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700"
              >
                <Plus className="w-4 h-4" />
                Book 9:00 AM Slot
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left main schedule flow */}
              <div className="lg:col-span-8 space-y-3">
                {dayAppointments.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    dog={dogMap.get(apt.dogId)}
                    client={clientMap.get(apt.clientId)}
                    service={serviceMap.get(apt.serviceId)}
                    staff={staffMap.get(apt.staffId)}
                    onSelect={onSelectAppointment}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>

              {/* Right: Quick Hourly Slots & Sitter availability overview */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center justify-between">
                    <span>Available Visit Windows</span>
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const isOccupied = dayAppointments.some(
                        (a) => a.startTime <= slot && addMinutesToTime(a.startTime, a.durationMinutes) > slot
                      );

                      return (
                        <button
                          key={slot}
                          id={`slot-btn-${slot.replace(':', '-')}`}
                          disabled={isOccupied}
                          onClick={() => onBookAtTime(currentDateStr, slot)}
                          className={`flex items-center justify-between rounded-lg border p-2 text-xs font-medium transition-all ${
                            isOccupied
                              ? 'border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed'
                              : 'border-stone-200 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-900 active:scale-95'
                          }`}
                        >
                          <span>{formatTime12h(slot)}</span>
                          {isOccupied ? (
                            <span className="text-[10px] text-stone-400">Booked</span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-semibold">+ Book</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Team / Sitters & Hosts on Duty */}
                <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                    Sitters & Hosts on Schedule
                  </h3>
                  <div className="space-y-2.5">
                    {staff.map((st) => {
                      const staffApts = dayAppointments.filter((a) => a.staffId === st.id);
                      return (
                        <div key={st.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            {st.avatar ? (
                              <img src={st.avatar} alt={st.name} className="h-6 w-6 rounded-full object-cover" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-stone-200" />
                            )}
                            <div>
                              <div className="font-medium text-stone-900">{st.name}</div>
                              <div className="text-[10px] text-stone-500">{st.role}</div>
                            </div>
                          </div>
                          <span className="rounded bg-stone-100 px-2 py-0.5 font-medium text-stone-700">
                            {staffApts.length} pets
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. WEEK VIEW
  // --------------------------------------------------------------------------
  if (viewMode === 'week') {
    const baseDate = new Date(currentDateStr + 'T00:00:00');
    const dayOfWeek = baseDate.getDay();
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + distanceToMonday);

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      return {
        dateStr: iso,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isToday: iso === new Date().toISOString().split('T')[0],
        isSelected: iso === currentDateStr,
      };
    });

    return (
      <div className="px-4 py-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dayApts = appointments
              .filter((a) => a.date === day.dateStr)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={day.dateStr}
                className={`flex flex-col rounded-xl border bg-white p-3 min-h-[420px] transition-all ${
                  day.isSelected
                    ? 'border-amber-500 ring-2 ring-amber-100 shadow-sm'
                    : 'border-stone-200/90'
                }`}
              >
                {/* Day Header */}
                <div
                  onClick={() => onDateChange(day.dateStr)}
                  className="cursor-pointer border-b border-stone-100 pb-2.5 mb-2.5 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold uppercase text-stone-500">
                      {day.dayName}
                    </span>
                    <div className="text-lg font-bold text-stone-900">
                      {day.dayNum} <span className="text-xs font-normal text-stone-400">{day.monthName}</span>
                    </div>
                  </div>
                  {day.isToday && (
                    <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Today
                    </span>
                  )}
                </div>

                {/* Day's appointments list */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                  {dayApts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-stone-400">
                      No visits
                    </div>
                  ) : (
                    dayApts.map((apt) => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        dog={dogMap.get(apt.dogId)}
                        client={clientMap.get(apt.clientId)}
                        service={serviceMap.get(apt.serviceId)}
                        staff={staffMap.get(apt.staffId)}
                        onSelect={onSelectAppointment}
                        onStatusChange={onStatusChange}
                        compact
                      />
                    ))
                  )}
                </div>

                {/* Quick Add Button on Day */}
                <button
                  id={`week-add-${day.dateStr}`}
                  onClick={() => onBookAtTime(day.dateStr, '10:00')}
                  className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-stone-200 py-1.5 text-xs font-medium text-stone-500 hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-900 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Book Visit</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 3. MONTH VIEW
  // --------------------------------------------------------------------------
  if (viewMode === 'month') {
    const currentYear = parseInt(currentDateStr.split('-')[0], 10);
    const currentMonth = parseInt(currentDateStr.split('-')[1], 10) - 1;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
    const totalDays = lastDayOfMonth.getDate();

    const calendarCells = [];
    for (let i = 0; i < startDayIndex; i++) {
      calendarCells.push({ empty: true });
    }
    for (let d = 1; d <= totalDays; d++) {
      const mm = String(currentMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateString = `${currentYear}-${mm}-${dd}`;
      calendarCells.push({
        empty: false,
        dayNum: d,
        dateStr: dateString,
        isToday: dateString === new Date().toISOString().split('T')[0],
        isSelected: dateString === currentDateStr,
      });
    }

    return (
      <div className="px-4 py-4 lg:px-6">
        <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-2xs">
          <div className="grid grid-cols-7 border-b border-stone-200 pb-2 text-center text-xs font-bold text-stone-500">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 pt-2">
            {calendarCells.map((cell, idx) => {
              if (cell.empty || !cell.dateStr) {
                return <div key={`empty-${idx}`} className="h-24 rounded-lg bg-stone-50/50" />;
              }

              const cellApts = appointments.filter((a) => a.date === cell.dateStr);

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => onDateChange(cell.dateStr)}
                  className={`flex h-28 flex-col rounded-lg border p-1.5 cursor-pointer transition-all hover:border-amber-400 ${
                    cell.isSelected
                      ? 'border-amber-500 bg-amber-50/30'
                      : 'border-stone-100 bg-white hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center font-bold ${
                        cell.isToday
                          ? 'bg-amber-600 text-white'
                          : cell.isSelected
                          ? 'text-amber-900 font-extrabold'
                          : 'text-stone-700'
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {cellApts.length > 0 && (
                      <span className="rounded-full bg-stone-100 px-1.5 py-0.2 text-[10px] font-semibold text-stone-600">
                        {cellApts.length} visit{cellApts.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex-1 space-y-1 overflow-hidden">
                    {cellApts.slice(0, 2).map((apt) => {
                      const dog = dogMap.get(apt.dogId);
                      return (
                        <div
                          key={apt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAppointment(apt);
                          }}
                          className="truncate rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-800 hover:bg-amber-100"
                        >
                          {apt.startTime} {dog?.name || 'Pet'}
                        </div>
                      );
                    })}
                    {cellApts.length > 2 && (
                      <div className="text-[10px] font-semibold text-stone-400 pl-1">
                        +{cellApts.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 4. LIST VIEW (Detailed Master Table)
  // --------------------------------------------------------------------------
  return (
    <div className="px-4 py-4 lg:px-6">
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="border-b border-stone-200 bg-stone-50 font-semibold text-stone-600">
            <tr>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Pet Details</th>
              <th className="py-3 px-4">Service & Setting</th>
              <th className="py-3 px-4">Client & Address</th>
              <th className="py-3 px-4">Assigned Sitter</th>
              <th className="py-3 px-4">Rate</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-stone-400">
                  No appointments match the selected filter.
                </td>
              </tr>
            ) : (
              appointments.map((apt) => {
                const dog = dogMap.get(apt.dogId);
                const client = clientMap.get(apt.clientId);
                const srv = serviceMap.get(apt.serviceId);
                const st = staffMap.get(apt.staffId);
                const statusClasses = getStatusBadgeClasses(apt.status);

                return (
                  <tr
                    key={apt.id}
                    onClick={() => onSelectAppointment(apt)}
                    className="cursor-pointer transition-colors hover:bg-stone-50/70"
                  >
                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{formatTime12h(apt.startTime)}</div>
                      <div className="text-[11px] text-stone-500">{apt.date} ({apt.durationMinutes}m)</div>
                    </td>

                    {/* Dog */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {dog?.photoUrl ? (
                          <img src={dog.photoUrl} alt={dog.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                            {dog?.name?.[0] || '🐾'}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-stone-900">{dog?.name || 'Unknown'}</div>
                          <div className="text-[11px] text-stone-500">{dog?.breed} • {dog?.weightLbs} lbs</div>
                        </div>
                      </div>
                    </td>

                    {/* Service & Setting */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{srv?.name || 'Sitting Service'}</div>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{getLocationLabel(apt.locationType)}</span>
                      </div>
                    </td>

                    {/* Client & Address */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{client?.name || 'Client'}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-[180px]">
                        {apt.locationAddress || client?.address || client?.phone}
                      </div>
                    </td>

                    {/* Sitter */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800">{st?.name || 'Unassigned'}</div>
                      <div className="text-[11px] text-stone-400">{st?.role}</div>
                    </td>

                    {/* Rate & Paid status */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">
                        {apt.price === 0 ? 'Free' : `$${apt.price}`}
                      </div>
                      <span className={`inline-block text-[10px] font-medium ${apt.paid ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {apt.price === 0 ? 'Complimentary' : apt.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusClasses.bg} ${statusClasses.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusClasses.dot}`} />
                        {getStatusLabel(apt.status)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectAppointment(apt)}
                        className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100 shadow-2xs"
                      >
                        View & Manage
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
