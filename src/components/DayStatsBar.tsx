import React from 'react';
import { Appointment, DogProfile } from '../types';
import { CalendarCheck, DollarSign, ShieldAlert, Footprints, Bell, Home } from 'lucide-react';

interface DayStatsBarProps {
  appointments: Appointment[];
  dogs: DogProfile[];
  currentDateStr: string;
}

export const DayStatsBar: React.FC<DayStatsBarProps> = ({
  appointments,
  dogs,
  currentDateStr,
}) => {
  const todayApts = appointments.filter((a) => a.date === currentDateStr);
  const inProgressCount = todayApts.filter((a) => a.status === 'in_progress').length;
  const readyPickupCount = todayApts.filter((a) => a.status === 'ready_for_pickup').length;
  const completedCount = todayApts.filter((a) => a.status === 'completed').length;
  
  const totalRevenue = todayApts
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + (a.price || 0), 0);
  
  const dogsWithExpiredVaccines = dogs.filter((d) => !d.vaccinationsUpToDate);

  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-4 lg:grid-cols-5 lg:px-6">
      {/* Total Appointments Today */}
      <div className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">Day's Bookings</span>
          <div className="rounded-md bg-stone-100 p-1.5 text-stone-600">
            <CalendarCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-stone-900">{todayApts.length}</span>
          <span className="text-[11px] text-stone-500">
            {completedCount} completed
          </span>
        </div>
      </div>

      {/* Active Visits / In Sitting */}
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-800">Active Visits / Sitting</span>
          <div className="rounded-md bg-amber-100 p-1.5 text-amber-700">
            <Footprints className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-amber-900">{inProgressCount}</span>
          <span className="text-[11px] text-amber-700">active now</span>
        </div>
      </div>

      {/* Ready for Pickup / Return */}
      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-800">Ready for Return</span>
          <div className="rounded-md bg-emerald-100 p-1.5 text-emerald-700">
            <Bell className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-emerald-900">{readyPickupCount}</span>
          <span className="text-[11px] text-emerald-700">notified</span>
        </div>
      </div>

      {/* Projected Day Revenue */}
      <div className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">Day's Bookings Value</span>
          <div className="rounded-md bg-stone-100 p-1.5 text-stone-600">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-stone-900">${totalRevenue}</span>
          <span className="text-[11px] text-stone-500">gross</span>
        </div>
      </div>

      {/* Vaccination Alerts */}
      <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-xl border border-stone-200/80 bg-white p-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">Health Verification</span>
          <div className={`rounded-md p-1.5 ${dogsWithExpiredVaccines.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className={`text-xl font-bold ${dogsWithExpiredVaccines.length > 0 ? 'text-rose-700' : 'text-stone-900'}`}>
            {dogsWithExpiredVaccines.length === 0 ? '100%' : `${dogsWithExpiredVaccines.length} Alerts`}
          </span>
          <span className="text-[11px] text-stone-500">
            {dogsWithExpiredVaccines.length === 0 ? 'All Rabies valid' : 'Needs records'}
          </span>
        </div>
      </div>
    </div>
  );
};
