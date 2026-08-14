import React from 'react';
import {
  FileText,
  PlusCircle,
  MinusCircle,
  Equal,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import type { SalaryBreakdown } from '../types/salary';
import { cn } from '../utils/cn';
import { formatCurrency, formatPercent } from '../utils/formatters';

export interface PayslipDetailsTableProps {
  /** Risultato del calcolo dello stipendio */
  breakdown: SalaryBreakdown;
  /** Numero di mensilità (13 o 14) */
  monthlyCount: 13 | 14;
  /** Classe CSS opzionale */
  className?: string;
}

interface TableRowData {
  id: string;
  name: string;
  category: 'base' | 'deduction' | 'credit' | 'subtotal' | 'final';
  description: string;
  rateInfo?: string;
  annualAmount: number;
  monthlyAmount: number;
  isNegative?: boolean;
}

export const PayslipDetailsTable: React.FC<PayslipDetailsTableProps> = ({
  breakdown,
  monthlyCount,
  className,
}) => {
  const {
    ral,
    inpsEmployee,
    taxableIrpef,
    grossIrpef,
    deductions,
    netIrpef,
    regionalTax,
    municipalTax,
    netAnnual,
    netMonthly,
  } = breakdown;

  const toMonthly = (annualVal: number) => annualVal / monthlyCount;

  const rows: TableRowData[] = [
    {
      id: 'ral',
      name: 'Retribuzione Annua Lorda (RAL)',
      category: 'base',
      description: 'Retribuzione contrattuale lorda pattuita',
      rateInfo: '100% RAL',
      annualAmount: ral,
      monthlyAmount: toMonthly(ral),
      isNegative: false,
    },
    {
      id: 'inps',
      name: 'Contributi Previdenziali INPS (IVS)',
      category: 'deduction',
      description: 'Quota previdenziale standard a carico dipendente',
      rateInfo: '9.19% (IVS)',
      annualAmount: inpsEmployee,
      monthlyAmount: toMonthly(inpsEmployee),
      isNegative: true,
    },
    {
      id: 'taxable',
      name: 'Imponibile Fiscale (Base IRPEF)',
      category: 'subtotal',
      description: 'Reddito imponibile per le imposte (RAL - INPS)',
      rateInfo: ral > 0 ? formatPercent((taxableIrpef / ral) * 100) : '0%',
      annualAmount: taxableIrpef,
      monthlyAmount: toMonthly(taxableIrpef),
      isNegative: false,
    },
    {
      id: 'gross-irpef',
      name: 'IRPEF Lorda Calcolata',
      category: 'subtotal',
      description: 'Imposta teorica calcolata a 3 scaglioni progressivi',
      rateInfo: '23% / 35% / 43%',
      annualAmount: grossIrpef,
      monthlyAmount: toMonthly(grossIrpef),
      isNegative: false,
    },
    {
      id: 'deductions',
      name: 'Detrazioni da Lavoro Dipendente',
      category: 'credit',
      description: 'Detrazione fiscale applicata (Art. 13 TUIR)',
      rateInfo: 'Fino a 1.955 €',
      annualAmount: deductions,
      monthlyAmount: toMonthly(deductions),
      isNegative: false,
    },
    {
      id: 'net-irpef',
      name: 'IRPEF Netta Trattenuta',
      category: 'deduction',
      description: 'Imposta netta effettiva trattenuta alla fonte (Lorda - Detrazioni)',
      rateInfo: ral > 0 ? formatPercent((netIrpef / ral) * 100) : '0%',
      annualAmount: netIrpef,
      monthlyAmount: toMonthly(netIrpef),
      isNegative: true,
    },
    {
      id: 'regional',
      name: 'Addizionale Regionale (Lombardia)',
      category: 'deduction',
      description: 'Addizionale progressiva Regione Lombardia',
      rateInfo: '1.23% - 1.73%',
      annualAmount: regionalTax,
      monthlyAmount: toMonthly(regionalTax),
      isNegative: true,
    },
    {
      id: 'municipal',
      name: 'Addizionale Comunale (Milano)',
      category: 'deduction',
      description: 'Addizionale Comune di Milano (esenzione sotto 23k€)',
      rateInfo: '0.80%',
      annualAmount: municipalTax,
      monthlyAmount: toMonthly(municipalTax),
      isNegative: true,
    },
    {
      id: 'net-final',
      name: 'Stipendio Netto Finale',
      category: 'final',
      description: `Importo netto realmente percepito (${monthlyCount} mensilità)`,
      rateInfo: ral > 0 ? formatPercent((netAnnual / ral) * 100) : '0%',
      annualAmount: netAnnual,
      monthlyAmount: netMonthly,
      isNegative: false,
    },
  ];

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-all overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <FileText className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Dettaglio Voci Busta Paga
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Analisi riga per riga di tutte le componenti dal lordo al netto.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <MapPin className="w-3 h-3 text-blue-500" />
            Milano
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {monthlyCount} Mensilità
          </span>
        </div>
      </div>

      {/* Tabella Dettaglio */}
      <div className="mt-6 -mx-6 sm:mx-0 overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse min-w-[600px] sm:min-w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/50">
              <th className="py-3.5 px-4 sm:px-6">Voce / Descrizione</th>
              <th className="py-3.5 px-4 text-center">Aliquota / Riferimento</th>
              <th className="py-3.5 px-4 text-right">Importo Annuo</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Importo Mensile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {rows.map((row) => {
              const isFinal = row.category === 'final';
              const isSubtotal = row.category === 'subtotal';
              const isCredit = row.category === 'credit';
              const isDeduction = row.category === 'deduction';
              const isBase = row.category === 'base';

              return (
                <tr
                  key={row.id}
                  className={cn(
                    'transition-colors',
                    isFinal && 'bg-blue-50/80 dark:bg-blue-950/40 font-bold border-t-2 border-blue-500/30',
                    isSubtotal && 'bg-slate-50/40 dark:bg-slate-800/30 text-slate-600 dark:text-slate-300 font-medium',
                    !isFinal && !isSubtotal && 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                  )}
                >
                  {/* Nome & Descrizione */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      {isBase && <span className="h-2 w-2 rounded-full bg-slate-400" />}
                      {isDeduction && <MinusCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                      {isCredit && <PlusCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {isSubtotal && <Equal className="w-4 h-4 text-slate-400 shrink-0" />}
                      {isFinal && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />}

                      <div>
                        <div
                          className={cn(
                            'text-sm',
                            isFinal ? 'text-base font-extrabold text-blue-700 dark:text-blue-300' : 'font-semibold text-slate-900 dark:text-white'
                          )}
                        >
                          {row.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                          {row.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Riferimento / Aliquota */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold',
                        isFinal && 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold',
                        isDeduction && 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
                        isCredit && 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
                        !isFinal && !isDeduction && !isCredit && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      )}
                    >
                      {row.rateInfo}
                    </span>
                  </td>

                  {/* Importo Annuale */}
                  <td className="py-3.5 px-4 text-right font-semibold">
                    <span
                      className={cn(
                        isFinal && 'text-lg font-extrabold text-blue-700 dark:text-blue-300',
                        isDeduction && 'text-rose-600 dark:text-rose-400',
                        isCredit && 'text-emerald-600 dark:text-emerald-400',
                        !isFinal && !isDeduction && !isCredit && 'text-slate-900 dark:text-white'
                      )}
                    >
                      {row.isNegative ? `- ${formatCurrency(row.annualAmount)}` : formatCurrency(row.annualAmount)}
                    </span>
                  </td>

                  {/* Importo Mensile */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-semibold">
                    <span
                      className={cn(
                        isFinal && 'text-lg font-extrabold text-blue-700 dark:text-blue-300',
                        isDeduction && 'text-rose-600 dark:text-rose-400',
                        isCredit && 'text-emerald-600 dark:text-emerald-400',
                        !isFinal && !isDeduction && !isCredit && 'text-slate-900 dark:text-white'
                      )}
                    >
                      {row.isNegative ? `- ${formatCurrency(row.monthlyAmount)}` : formatCurrency(row.monthlyAmount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
