import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { SalaryBreakdown } from '../types/salary';
import { cn } from '../utils/cn';
import { formatCurrency } from '../utils/formatters';

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
  const { netMonthly, netAnnual, totalTaxes } = breakdown;
  const monthlyTaxes = monthlyCount > 0 ? totalTaxes / monthlyCount : 0;

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4', className)}>
      {/* Card 1: Netto (Mensile in grande + Annuale) in Verde */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Netto in Tasca
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200/60 shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{monthlyCount} Mensilità</span>
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
              {formatCurrency(netMonthly)}
            </span>
            <span className="text-sm font-semibold text-emerald-600">/ mese</span>
          </div>

          <p className="mt-1 text-xs text-emerald-800/90 font-medium">
            Totale netto annuo:{' '}
            <strong className="font-bold text-emerald-950">{formatCurrency(netAnnual)}</strong>
          </p>
        </div>
      </div>

      {/* Card 2: Totale Trattenute (Tasse + INPS) in Rosso */}
      <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-5 sm:p-6 space-y-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
            Totale Trattenute
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-white/80 px-2 py-0.5 rounded-md border border-rose-200/60 shadow-2xs">
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            <span>Tasse + INPS</span>
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">
              {formatCurrency(totalTaxes)}
            </span>
            <span className="text-sm font-semibold text-rose-500">/ anno</span>
          </div>

          <p className="mt-1 text-xs text-rose-800/90 font-medium">
            Circa <strong className="font-bold text-rose-950">{formatCurrency(monthlyTaxes)}</strong> trattenuti al mese.
          </p>
        </div>
      </div>
    </div>
  );
};
