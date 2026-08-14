import React, { useState, useEffect } from 'react';
import { Euro, Calendar, Sparkles, SlidersHorizontal, Building2, MapPin } from 'lucide-react';
import { cn } from '../utils/cn';
import { formatCurrency, formatNumber } from '../utils/formatters';

export interface SalaryInputFormProps {
  /** Valore corrente della RAL in Euro */
  ral: number;
  /** Numero di mensilità selezionate (13 o 14) */
  monthlyCount: 13 | 14;
  /** Callback al cambio della RAL */
  onRalChange: (value: number) => void;
  /** Callback al cambio del numero di mensilità */
  onMonthlyCountChange: (count: 13 | 14) => void;
  /** Valori preset personalizzabili (opzionale) */
  presets?: number[];
  /** Classe CSS aggiuntiva */
  className?: string;
}

const DEFAULT_PRESETS = [25000, 35000, 45000, 60000, 80000];
const MIN_SLIDER_RAL = 10000;
const MAX_SLIDER_RAL = 120000;
const SLIDER_STEP = 500;

export const SalaryInputForm: React.FC<SalaryInputFormProps> = ({
  ral,
  monthlyCount,
  onRalChange,
  onMonthlyCountChange,
  presets = DEFAULT_PRESETS,
  className,
}) => {
  // Stato locale per consentire una digitazione fluida nell'input di testo
  const [inputValue, setInputValue] = useState<string>(() => (ral > 0 ? String(ral) : ''));
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Sincronizza lo stato locale dell'input quando la RAL esterna cambia e l'input non è in focus
  useEffect(() => {
    if (!isFocused) {
      setInputValue(ral > 0 ? formatNumber(ral) : '');
    }
  }, [ral, isFocused]);

  // Gestione digitazione nell'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Filtra mantenendo solo i numeri
    const digitsOnly = raw.replace(/\D/g, '');
    setInputValue(digitsOnly);

    const parsed = digitsOnly === '' ? 0 : parseInt(digitsOnly, 10);
    onRalChange(parsed);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setInputValue(ral > 0 ? String(ral) : '');
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    setInputValue(ral > 0 ? formatNumber(ral) : '');
  };

  // Gestione slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onRalChange(value);
    setInputValue(formatNumber(value));
  };

  // Calcolo percentuale di riempimento dello slider per barra dinamica
  const sliderPercentage = Math.min(
    100,
    Math.max(0, ((ral - MIN_SLIDER_RAL) / (MAX_SLIDER_RAL - MIN_SLIDER_RAL)) * 100)
  );

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all',
        className
      )}
    >
      {/* Header del Form con Badge Scenario */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Parametri Retribuzione
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inserisci la tua retribuzione lorda annua o utilizza lo slider interattivo.
          </p>
        </div>

        {/* Badge Scenario di Riferimento */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
            <MapPin className="w-3.5 h-3.5" />
            Milano (Lombardia)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Building2 className="w-3.5 h-3.5" />
            Indeterminato
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Campo Principale Input RAL */}
        <div>
          <label
            htmlFor="ral-input"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
          >
            Retribuzione Annua Lorda (RAL)
          </label>
          <div className="relative rounded-2xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
              <Euro className="h-6 w-6" />
            </div>
            <input
              id="ral-input"
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="es. 35.000"
              className="block w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/50 py-4 pl-12 pr-16 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/15 transition-all"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              EUR / anno
            </div>
          </div>
        </div>

        {/* Slider Interattivo con Barra Dinamica */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{formatCurrency(MIN_SLIDER_RAL, false)}</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {formatCurrency(ral, false)}
            </span>
            <span>{formatCurrency(MAX_SLIDER_RAL, false)}+</span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={MIN_SLIDER_RAL}
              max={MAX_SLIDER_RAL}
              step={SLIDER_STEP}
              value={Math.min(MAX_SLIDER_RAL, Math.max(MIN_SLIDER_RAL, ral))}
              onChange={handleSliderChange}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${sliderPercentage}%, #e2e8f0 ${sliderPercentage}%, #e2e8f0 100%)`,
              }}
            />
          </div>
        </div>

        {/* Quick Select Presets (Chip Bar) */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Selezioni Rapide</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((presetValue) => {
              const isSelected = ral === presetValue;
              return (
                <button
                  key={presetValue}
                  type="button"
                  onClick={() => onRalChange(presetValue)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 active:scale-95',
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-300 border border-transparent'
                  )}
                >
                  {formatCurrency(presetValue, false)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Segmented Control per Numero di Mensilità (13 vs 14) */}
        <div className="pt-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
            Numero di Mensilità Contrattuali
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => onMonthlyCountChange(13)}
              className={cn(
                'flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-98',
                monthlyCount === 13
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Calendar className="w-4 h-4" />
              <span>13 Mensilità</span>
              <span className="text-xs font-normal opacity-70 hidden sm:inline">(Standard)</span>
            </button>

            <button
              type="button"
              onClick={() => onMonthlyCountChange(14)}
              className={cn(
                'flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-98',
                monthlyCount === 14
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Calendar className="w-4 h-4" />
              <span>14 Mensilità</span>
              <span className="text-xs font-normal opacity-70 hidden sm:inline">(Commercio/CCNL)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
