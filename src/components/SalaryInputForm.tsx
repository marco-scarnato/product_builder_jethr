import React, { useState, useEffect } from 'react';
import { Euro, Sparkles, Share2, Check, MapPin, Briefcase, Info } from 'lucide-react';
import { cn } from '../utils/cn';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { copyShareableLink } from '../utils/urlState';

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
  const [inputValue, setInputValue] = useState<string>(() => (ral > 0 ? String(ral) : ''));
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(ral > 0 ? formatNumber(ral) : '');
    }
  }, [ral, isFocused]);

  const handleCopyLink = async () => {
    const success = await copyShareableLink();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onRalChange(value);
    setInputValue(formatNumber(value));
  };

  const sliderPercentage = Math.min(
    100,
    Math.max(0, ((ral - MIN_SLIDER_RAL) / (MAX_SLIDER_RAL - MIN_SLIDER_RAL)) * 100)
  );

  return (
    <div
      className={cn(
        'bg-white border border-neutral-200 rounded-xl shadow-sm p-6 sm:p-7 space-y-6',
        className
      )}
    >
      {/* Header con Badge Visivi e Postilla di Semplificazione */}
      <div className="border-b border-neutral-100 pb-5 space-y-3.5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Calcolatore Stipendio Netto
            </h1>
            {/* Badge in evidenza */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200/80 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                Milano (Lombardia)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200/80 shadow-2xs">
                <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                Tempo Indeterminato
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            title="Copia link della simulazione negli appunti"
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 shrink-0',
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200 shadow-2xs'
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 animate-in fade-in" />
                <span>Link Copiato!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Condividi</span>
              </>
            )}
          </button>
        </div>

        {/* Postilla esplicativa delle assunzioni per la semplificazione del calcolo */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-600 leading-relaxed">
          <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-neutral-800">Nota sulle assunzioni:</strong> per semplificare la simulazione e renderla immediata, il calcolo assume residenza fiscale nel <strong>Comune di Milano</strong> (addizionale regionale Lombardia + comunale Milano 0,80%) e un contratto a <strong>tempo indeterminato standard</strong> (aliquota IVS 9,19%, senza carichi familiari né detrazioni accessorie variabili).
          </p>
        </div>
      </div>

      {/* Input RAL Grande */}
      <div className="space-y-2">
        <label
          htmlFor="ral-input"
          className="block text-xs font-bold uppercase tracking-wider text-neutral-600"
        >
          Retribuzione Annua Lorda (RAL)
        </label>

        <div className="relative rounded-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
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
            className="block w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3.5 pl-12 pr-16 text-2xl sm:text-3xl font-extrabold text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-neutral-400 uppercase">
            EUR / anno
          </div>
        </div>

        {/* Slider Compatto Sotto l'Input */}
        <div className="pt-2 space-y-1.5">
          <div className="flex justify-between items-center text-[11px] font-semibold text-neutral-400">
            <span>{formatCurrency(MIN_SLIDER_RAL, false)}</span>
            <span className="text-neutral-900 font-bold">{formatCurrency(ral, false)}</span>
            <span>{formatCurrency(MAX_SLIDER_RAL, false)}+</span>
          </div>
          <input
            type="range"
            min={MIN_SLIDER_RAL}
            max={MAX_SLIDER_RAL}
            step={SLIDER_STEP}
            value={Math.min(MAX_SLIDER_RAL, Math.max(MIN_SLIDER_RAL, ral))}
            onChange={handleSliderChange}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900 focus:outline-none"
            style={{
              background: `linear-gradient(to right, #171717 0%, #171717 ${sliderPercentage}%, #e5e5e5 ${sliderPercentage}%, #e5e5e5 100%)`,
            }}
          />
        </div>
      </div>

      {/* Preset Rapidi */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-neutral-500">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          <span>Preset rapidi:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((presetVal) => {
            const isSelected = ral === presetVal;
            return (
              <button
                key={presetVal}
                type="button"
                onClick={() => onRalChange(presetVal)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                )}
              >
                {formatCurrency(presetVal, false)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle Semplice 13 / 14 Mensilità */}
      <div className="pt-2 border-t border-neutral-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
          Mensilità
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-xl">
          <button
            type="button"
            onClick={() => onMonthlyCountChange(13)}
            className={cn(
              'py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center',
              monthlyCount === 13
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            13 Mensilità
          </button>
          <button
            type="button"
            onClick={() => onMonthlyCountChange(14)}
            className={cn(
              'py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center',
              monthlyCount === 14
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            14 Mensilità
          </button>
        </div>
      </div>
    </div>
  );
};
