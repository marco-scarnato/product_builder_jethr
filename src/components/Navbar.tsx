import React from 'react';
import { HelpCircle, MapPin, Calculator } from 'lucide-react';

export interface NavbarProps {
  /** Callback per aprire il modale delle note metodologiche */
  onOpenAssumptions: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssumptions }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Jet HR
              </span>
              <span className="text-slate-400 dark:text-slate-600 font-light">•</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                Salary Calculator
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Simulatore stipendio netto da RAL dipendente
            </p>
          </div>
        </div>

        {/* Right Actions & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badge Edizione Milano */}
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/60">
            <MapPin className="w-3.5 h-3.5" />
            Milano 2026 Edition
          </span>

          {/* Bottone Note Metodologiche */}
          <button
            type="button"
            onClick={onOpenAssumptions}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700 transition-all active:scale-95 shadow-2xs"
          >
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Note metodologiche</span>
            <span className="sm:hidden">Note</span>
          </button>
        </div>
      </div>
    </header>
  );
};
