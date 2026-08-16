import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  PiggyBank,
  Shield,
  Briefcase,
  Building2,
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
      description: 'Lordo concordato',
      rate: '100%',
      amount: ral,
      icon: Briefcase,
    },
    {
      id: 'inps-employer',
      title: 'INPS a carico Azienda',
      description: 'Contributi previdenziali ditta',
      rate: '~23.81%',
      amount: cost.inpsCompany,
      icon: Building2,
    },
    {
      id: 'tfr',
      title: 'Quota TFR Maturata',
      description: 'Trattamento di Fine Rapporto (RAL / 13.5)',
      rate: '~7.41%',
      amount: cost.tfr,
      icon: PiggyBank,
    },
    {
      id: 'inail',
      title: 'Premio INAIL',
      description: 'Assicurazione infortuni',
      rate: '~0.40%',
      amount: cost.inail,
      icon: Shield,
    },
  ];

  return (
    <div
      className={cn(
        'bg-white border border-neutral-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-3',
        className
      )}
    >
      {/* Header & Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-neutral-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700">
            Costo Totale Azienda
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm sm:text-base font-black text-neutral-900">
              {formatCurrency(cost.totalCompanyCost)}
            </span>
            <span className="text-[11px] text-neutral-500 block">
              +{formatPercent(extraPercentage)} vs RAL
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
            title={isExpanded ? 'Comprimi' : 'Espandi'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sezione Espandibile */}
      {isExpanded && (
        <div className="pt-3 border-t border-neutral-100 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {costItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-neutral-800 truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-neutral-500">{item.rate}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-neutral-900 shrink-0">
                    {formatCurrency(item.amount)}
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
