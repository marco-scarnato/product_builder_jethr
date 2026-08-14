import React from 'react';
import { PieChart, Info } from 'lucide-react';
import type { SalaryBreakdown } from '../types/salary';
import { cn } from '../utils/cn';
import { formatCurrency, formatPercent } from '../utils/formatters';

export interface SalaryBreakdownBarProps {
  /** Risultato completo del breakdown fiscale calcolato */
  breakdown: SalaryBreakdown;
  /** Classe CSS aggiuntiva */
  className?: string;
}

export const SalaryBreakdownBar: React.FC<SalaryBreakdownBarProps> = ({
  breakdown,
  className,
}) => {
  const { ral, netAnnual, netIrpef, inpsEmployee, regionalTax, municipalTax } = breakdown;
  const additionalTaxes = regionalTax + municipalTax;

  const netPercent = ral > 0 ? (netAnnual / ral) * 100 : 0;
  const irpefPercent = ral > 0 ? (netIrpef / ral) * 100 : 0;
  const inpsPercent = ral > 0 ? (inpsEmployee / ral) * 100 : 0;
  const additionalPercent = ral > 0 ? (additionalTaxes / ral) * 100 : 0;

  const categories = [
    {
      id: 'net',
      title: 'Netto in tasca',
      subtitle: 'Retribuzione reale disponibile',
      amount: netAnnual,
      percentage: netPercent,
      barGradient: 'from-emerald-500 to-teal-500',
      dotColor: 'bg-emerald-500',
      textAccent: 'text-emerald-600 dark:text-emerald-400',
      bgLight: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40',
    },
    {
      id: 'irpef',
      title: 'IRPEF Netta',
      subtitle: 'Imposta progressiva sul reddito',
      amount: netIrpef,
      percentage: irpefPercent,
      barGradient: 'from-blue-600 to-indigo-600',
      dotColor: 'bg-blue-600',
      textAccent: 'text-blue-600 dark:text-blue-400',
      bgLight: 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40',
    },
    {
      id: 'inps',
      title: 'Contributi INPS',
      subtitle: 'IVS dipendente (9.19% + solidarietà)',
      amount: inpsEmployee,
      percentage: inpsPercent,
      barGradient: 'from-purple-600 to-violet-600',
      dotColor: 'bg-purple-600',
      textAccent: 'text-purple-600 dark:text-purple-400',
      bgLight: 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/40',
    },
    {
      id: 'addizionali',
      title: 'Addizionali Reg. e Com.',
      subtitle: 'Lombardia (progressiva) + Milano (0.8%)',
      amount: additionalTaxes,
      percentage: additionalPercent,
      barGradient: 'from-amber-500 to-orange-500',
      dotColor: 'bg-amber-500',
      textAccent: 'text-amber-600 dark:text-amber-400',
      bgLight: 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40',
    },
  ];

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all',
        className
      )}
    >
      {/* Header Sezione */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <PieChart className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Ripartizione del Lordo Annuale
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Distribuzione percentuale di ogni euro della tua RAL ({formatCurrency(ral, false)})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 self-start sm:self-auto">
          <Info className="w-3.5 h-3.5" />
          <span>Totale: 100% RAL</span>
        </div>
      </div>

      {/* Stacked Progress Bar */}
      <div className="mt-6 space-y-3">
        <div className="h-6 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 flex overflow-hidden gap-1 ring-1 ring-slate-200/60 dark:ring-slate-700/60 shadow-inner">
          {ral > 0 ? (
            categories.map((cat) => {
              if (cat.percentage <= 0) return null;
              return (
                <div
                  key={cat.id}
                  className={cn(
                    'h-full first:rounded-l-xl last:rounded-r-xl bg-gradient-to-r transition-all duration-500 relative group cursor-pointer',
                    cat.barGradient
                  )}
                  style={{ width: `${cat.percentage}%` }}
                  title={`${cat.title}: ${formatCurrency(cat.amount)} (${formatPercent(cat.percentage)})`}
                />
              );
            })
          ) : (
            <div className="h-full w-full rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          )}
        </div>
      </div>

      {/* Legenda Dettagliata & Proporzioni */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={cn(
              'p-3.5 rounded-2xl border transition-all duration-200 hover:shadow-sm',
              cat.bgLight
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={cn('h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900', cat.dotColor)} />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {cat.title}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-1 mt-1">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(cat.amount)}
              </span>
              <span className={cn('text-xs font-bold px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/60 shadow-2xs', cat.textAccent)}>
                {formatPercent(cat.percentage)}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {cat.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
