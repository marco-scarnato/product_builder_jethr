import React from 'react';
import { Wallet, TrendingDown, Receipt, Percent, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import type { SalaryBreakdown } from '../types/salary';
import { cn } from '../utils/cn';
import { formatCurrency, formatPercent } from '../utils/formatters';

export interface SalaryHeroCardsProps {
  /** Risultato completo del breakdown fiscale calcolato */
  breakdown: SalaryBreakdown;
  /** Numero di mensilità contrattuali (13 o 14) */
  monthlyCount: 13 | 14;
  /** Classe CSS opzionale */
  className?: string;
}

export const SalaryHeroCards: React.FC<SalaryHeroCardsProps> = ({
  breakdown,
  monthlyCount,
  className,
}) => {
  const { netMonthly, netAnnual, totalTaxes, effectiveTaxRate, ral } = breakdown;

  return (
    <div className={cn('space-y-4 sm:space-y-5', className)}>
      {/* Hero Card Principale: Netto Mensile */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/20">
        {/* Pattern decorativo di sfondo */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-1/3 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6">
          {/* Header Hero */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-white ring-1 ring-white/20">
                <Wallet className="h-5 w-5" />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                  Proiezione Netta
                </span>
                <h3 className="text-lg font-bold text-white">Stipendio Netto Mensile</h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-medium text-blue-100 backdrop-blur-md ring-1 ring-white/20">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Base calcolo: {monthlyCount} mensilità</span>
            </div>
          </div>

          {/* Importo Netto Mensile */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-sm">
                  {formatCurrency(netMonthly)}
                </span>
                <span className="text-lg sm:text-xl font-semibold text-blue-200">/ mese</span>
              </div>
              <p className="mt-2 text-sm text-blue-100/90 font-medium">
                Corrisponde a circa{' '}
                <span className="font-bold text-white">{formatCurrency(netAnnual)}</span> netti
                all'anno su una RAL di {formatCurrency(ral, false)}.
              </p>
            </div>

            {/* Badge Garanzia Detrazioni & Aliquota */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
              <span className="text-xs text-blue-200">Rapporto Netto/Lordo</span>
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                {ral > 0 ? formatPercent(100 - effectiveTaxRate) : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Griglia delle 3 Sub-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Sub-Card 1: Netto Annuale */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Netto Totale
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Netto Annuale
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(netAnnual)}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Somma di tutte le {monthlyCount} mensilità percepite.
          </p>
        </div>

        {/* Sub-Card 2: Totale Tasse & Contributi Trattenuti */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-700/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Receipt className="h-4 w-4" />
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              Trattenute
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tasse e INPS Totali
            </span>
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
              {formatCurrency(totalTaxes)}
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            IRPEF netta, contributi INPS e addizionali.
          </p>
        </div>

        {/* Sub-Card 3: Pressione Fiscale Effettiva (%) */}
        <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700/60 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Percent className="h-4 w-4" />
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400">
              Incidenza
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Pressione Fiscale Effettiva
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatPercent(effectiveTaxRate)}
            </div>
          </div>

          {/* Mini progress bar visuale dell'aliquota */}
          <div className="mt-2.5">
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, effectiveTaxRate))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
