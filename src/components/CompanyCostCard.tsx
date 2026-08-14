import React, { useState } from 'react';
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Layers,
  PiggyBank,
  Shield,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import type { SalaryBreakdown } from '../types/salary';
import { cn } from '../utils/cn';
import { formatCurrency, formatPercent } from '../utils/formatters';

export interface CompanyCostCardProps {
  /** Risultato completo del calcolo dello stipendio */
  breakdown: SalaryBreakdown;
  /** Stato iniziale di espansione (default: false) */
  defaultExpanded?: boolean;
  /** Classe CSS opzionale */
  className?: string;
}

export const CompanyCostCard: React.FC<CompanyCostCardProps> = ({
  breakdown,
  defaultExpanded = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const { ral, companyCost } = breakdown;

  const cost = companyCost || {
    tfr: ral > 0 ? ral / 13.5 : 0,
    inpsCompany: ral > 0 ? ral * 0.2381 : 0,
    inail: ral > 0 ? ral * 0.004 : 0,
    totalCompanyCost: ral > 0 ? ral + ral / 13.5 + ral * 0.2381 + ral * 0.004 : 0,
  };

  const extraCost = cost.totalCompanyCost - ral;
  const extraPercentage = ral > 0 ? (extraCost / ral) * 100 : 0;

  const costItems = [
    {
      id: 'ral',
      title: 'Retribuzione Lorda (RAL)',
      description: 'Lordo concordato nel contratto di lavoro',
      rate: '100% RAL',
      amount: ral,
      icon: Briefcase,
      color: 'text-slate-700 dark:text-slate-300',
      bg: 'bg-slate-100 dark:bg-slate-800',
    },
    {
      id: 'inps-employer',
      title: 'Contributi INPS a carico Azienda',
      description: 'Contributi previdenziali e assistenziali obbligatori ditta',
      rate: '~23.81%',
      amount: cost.inpsCompany,
      icon: Building2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      id: 'tfr',
      title: 'Quota TFR Maturata',
      description: 'Trattamento di Fine Rapporto accantonato annualmente (RAL / 13.5)',
      rate: '~7.41%',
      amount: cost.tfr,
      icon: PiggyBank,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      id: 'inail',
      title: 'Premio Assicurativo INAIL',
      description: 'Assicurazione contro infortuni e malattie professionali sul lavoro',
      rate: '~0.40%',
      amount: cost.inail,
      icon: Shield,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
  ];

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all overflow-hidden',
        className
      )}
    >
      {/* Header & Toggle Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Layers className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Costo Totale Aziendale (HR Perspective)
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Azienda
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Quanto spende realmente l'azienda includendo contributi ditta, TFR e assicurazioni.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <span className="text-xs text-slate-400 dark:text-slate-500 block">Costo Annuo Stimato</span>
            <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {formatCurrency(cost.totalCompanyCost)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={isExpanded ? 'Comprimi dettaglio' : 'Espandi dettaglio'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sezione Espandibile */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-4 animate-in fade-in duration-200">
          {/* Banner Moltiplicatore Aziendale */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-indigo-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                L'azienda sostiene un costo superiore di circa{' '}
                <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                  +{formatPercent(extraPercentage)} ({formatCurrency(extraCost)})
                </strong>{' '}
                rispetto alla RAL concordata.
              </span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-2xs self-start sm:self-auto shrink-0">
              Moltiplicatore ~1.32x
            </span>
          </div>

          {/* Griglia Dettaglio Voci Costo Azienda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {costItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3"
                >
                  <span className={cn('p-2 rounded-xl shrink-0', item.bg, item.color)}>
                    <Icon className="w-4 h-4" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-2xs">
                        {item.rate}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
