import React from 'react';
import { PieChart } from 'lucide-react';
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
      amount: netAnnual,
      percentage: netPercent,
      barColor: 'bg-emerald-500',
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
    },
    {
      id: 'irpef',
      title: 'IRPEF Netta',
      amount: netIrpef,
      percentage: irpefPercent,
      barColor: 'bg-blue-600',
      dotColor: 'bg-blue-600',
      textColor: 'text-blue-700',
    },
    {
      id: 'inps',
      title: 'INPS (9.19%)',
      amount: inpsEmployee,
      percentage: inpsPercent,
      barColor: 'bg-purple-600',
      dotColor: 'bg-purple-600',
      textColor: 'text-purple-700',
    },
    {
      id: 'addizionali',
      title: 'Addizionali',
      amount: additionalTaxes,
      percentage: additionalPercent,
      barColor: 'bg-amber-500',
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-700',
    },
  ];

  return (
    <div
      className={cn(
        'bg-white border border-neutral-200 rounded-xl shadow-sm p-6 space-y-4',
        className
      )}
    >
      {/* Header Sezione */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-neutral-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700">
            Ripartizione della RAL
          </h2>
        </div>
        <span className="text-xs font-semibold text-neutral-400">
          Totale: {formatCurrency(ral, false)}
        </span>
      </div>

      {/* Stacked Progress Bar */}
      <div className="h-4 w-full rounded-lg bg-neutral-100 p-0.5 flex overflow-hidden gap-0.5">
        {ral > 0 ? (
          categories.map((cat) => {
            if (cat.percentage <= 0) return null;
            return (
              <div
                key={cat.id}
                className={cn('h-full first:rounded-l-md last:rounded-r-md transition-all duration-300', cat.barColor)}
                style={{ width: `${cat.percentage}%` }}
                title={`${cat.title}: ${formatCurrency(cat.amount)} (${formatPercent(cat.percentage)})`}
              />
            );
          })
        ) : (
          <div className="h-full w-full rounded-md bg-neutral-200" />
        )}
      </div>

      {/* Legenda a 4 colonne compatte */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {categories.map((cat) => (
          <div key={cat.id} className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={cn('h-2 w-2 rounded-full', cat.dotColor)} />
              <span className="text-[11px] font-semibold text-neutral-600 truncate">
                {cat.title}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-neutral-900">
              {formatCurrency(cat.amount)}
            </div>
            <div className="text-[10px] font-medium text-neutral-500">
              {formatPercent(cat.percentage)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
