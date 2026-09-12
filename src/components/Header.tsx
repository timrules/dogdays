import React from 'react';
import { ViewMode, ThemePreset } from '../types';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Users,
  Home,
  Palette,
  HeartHandshake
} from 'lucide-react';

interface HeaderProps {
  currentDateStr: string;
  onDateChange: (dateStr: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  onNewAppointment: () => void;
  onOpenClientsDogs: () => void;
  onOpenServices: () => void;
  onOpenStyleReference: () => void;
  theme: ThemePreset;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateStr,
  onDateChange,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onNewAppointment,
  onOpenClientsDogs,
  onOpenServices,
  onOpenStyleReference,
}) => {
  const dateObj = new Date(currentDateStr + 'T00:00:00');
  const formattedHeaderDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrevDay = () => {
    const d = new Date(currentDateStr + 'T00:00:00');
    d.setDate(d.getDate() - (viewMode === 'week' ? 7 : 1));
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDateStr + 'T00:00:00');
    d.setDate(d.getDate() + (viewMode === 'week' ? 7 : 1));
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    onDateChange(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur-xs">
      {/* Top Main Navigation Bar */}
      <div className="mx-auto flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        
        {/* Brand & Business Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
            <span className="text-xl">🐾</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-stone-900">
                Dog Days Pet Sitting & Visits
              </h1>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                Pet Sitting
              </span>
            </div>
            <p className="text-xs text-stone-500">
              In-Home Sitting, Drop-In Visits & Meet & Greets
            </p>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dogs & Clients Directory */}
          <button
            id="nav-dogs-clients-btn"
            onClick={onOpenClientsDogs}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-stone-500" />
            <span>Pets & Parents</span>
          </button>

          {/* Services & Rates */}
          <button
            id="nav-services-btn"
            onClick={onOpenServices}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-2xs"
          >
            <Home className="w-3.5 h-3.5 text-stone-500" />
            <span>Sitting Services & Rates</span>
          </button>

          {/* Style & Theme customizer */}
          <button
            id="nav-style-btn"
            onClick={onOpenStyleReference}
            title="Style & Visual Theme matching"
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Theme / Style</span>
          </button>

          {/* Primary CTA: New Appointment */}
          <button
            id="btn-new-appointment-main"
            onClick={onNewAppointment}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 active:scale-95 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Book Sitting / Visit</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Date navigation, Views, Search, Filter */}
      <div className="border-t border-stone-100 bg-stone-50/70 px-4 py-2.5 lg:px-6">
        <div className="mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          {/* Date Picker & Navigator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-stone-200 bg-white shadow-2xs">
              <button
                id="btn-prev-date"
                onClick={handlePrevDay}
                title="Previous"
                className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-l-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="btn-today-date"
                onClick={handleToday}
                className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-100 border-x border-stone-200 transition-colors"
              >
                Today
              </button>
              <button
                id="btn-next-date"
                onClick={handleNextDay}
                title="Next"
                className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-r-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Current Date Text & Direct Date Input */}
            <div className="relative flex items-center">
              <span className="text-sm font-semibold text-stone-900 ml-1">
                {formattedHeaderDate}
              </span>
              <input
                type="date"
                value={currentDateStr}
                onChange={(e) => e.target.value && onDateChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                title="Choose calendar date"
              />
            </div>
          </div>

          {/* Center: View Switcher */}
          <div className="flex items-center self-start rounded-lg border border-stone-200 bg-stone-200/50 p-0.5 text-xs font-medium md:self-auto">
            {(['day', 'week', 'month', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                id={`view-tab-${mode}`}
                onClick={() => onViewModeChange(mode)}
                className={`rounded-md px-3 py-1.5 capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-white font-semibold text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {mode === 'day' ? 'Day Agenda' : mode === 'week' ? 'Week' : mode === 'month' ? 'Month' : 'List View'}
              </button>
            ))}
          </div>

          {/* Right: Search & Status Filter */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56 md:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search pet, owner, address..."
                className="w-full rounded-lg border border-stone-200 bg-white py-1.5 pl-8 pr-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Filter Status Dropdown */}
            <div className="relative shrink-0">
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                aria-label="Filter appointments by status"
                className="rounded-lg border border-stone-200 bg-white py-1.5 pl-2.5 pr-7 text-xs font-medium text-stone-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="in_progress">Active Visits / In Progress</option>
                <option value="ready_for_pickup">Ready for Pickup / Return</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Awaiting Confirmation</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
