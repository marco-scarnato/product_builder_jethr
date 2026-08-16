import React, { useState } from 'react';
import { Info, FileText } from 'lucide-react';
import type { SalaryBreakdown } from '../types/salary';
import { getSalaryItemExplanations, type ItemExplanation } from '../core/explanations';
import { ExplanationDialog } from './ExplanationDialog';
import { cn } from '../utils/cn';
import { formatCurrency, formatPercent } from '../utils/formatters';

export interface PayslipDetailsTableProps {
  /** Risultato completo del calcolo dello stipendio */
  breakdown: SalaryBreakdown;
  /** Numero di mensilità contrattuali (13 o 14) */
  monthlyCount: 13 | 14;
  /** Classe CSS opzionale */
  className?: string;
}

interface RowItem {
  id: string;
  label: string;
  rate?: string;
  annual: number;
  monthly: number;
  isDeduction?: boolean;
  isCredit?: boolean;
  isSubtotal?: boolean;
  isFinal?: boolean;
  explanationKey?: keyof ReturnType<typeof getSalaryItemExplanations>;
}

export const PayslipDetailsTable: React.FC<PayslipDetailsTableProps> = ({
  breakdown,
  monthlyCount,
  className,
}) => {
  const [selectedExplanation, setSelectedExplanation] = useState<ItemExplanation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const explanations = getSalaryItemExplanations(breakdown);

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

  const toMonthly = (val: number) => (monthlyCount > 0 ? val / monthlyCount : 0);

  const handleOpenInfo = (key?: keyof typeof explanations) => {
    if (key && explanations[key]) {
      setSelectedExplanation(explanations[key]);
      setIsDialogOpen(true);
    }
  };

  const rows: RowItem[] = [
    {
      id: 'ral',
      label: 'Retribuzione Annua Lorda (RAL)',
      rate: '100% RAL',
      annual: ral,
      monthly: toMonthly(ral),
    },
    {
      id: 'inps',
      label: 'Contributi INPS Dipendente',
      rate: '9,19%',
      annual: inpsEmployee,
      monthly: toMonthly(inpsEmployee),
      isDeduction: true,
      explanationKey: 'inpsEmployee',
    },
    {
      id: 'taxable',
      label: 'Imponibile Fiscale (Base IRPEF)',
      rate: ral > 0 ? formatPercent((taxableIrpef / ral) * 100) : '0%',
      annual: taxableIrpef,
      monthly: toMonthly(taxableIrpef),
      isSubtotal: true,
      explanationKey: 'taxableIrpef',
    },
    {
      id: 'gross-irpef',
      label: 'IRPEF Lorda',
      rate: '23% / 33% / 43%',
      annual: grossIrpef,
      monthly: toMonthly(grossIrpef),
      isSubtotal: true,
      explanationKey: 'grossIrpef',
    },
    {
      id: 'deductions',
      label: 'Detrazioni Lavoro Dipendente',
      rate: 'Art. 13 TUIR',
      annual: deductions,
      monthly: toMonthly(deductions),
      isCredit: true,
      explanationKey: 'deductions',
    },
    {
      id: 'net-irpef',
      label: 'IRPEF Netta Trattenuta',
      rate: ral > 0 ? formatPercent((netIrpef / ral) * 100) : '0%',
      annual: netIrpef,
      monthly: toMonthly(netIrpef),
      isDeduction: true,
      explanationKey: 'netIrpef',
    },
    {
      id: 'regional',
      label: 'Addizionale Regionale (Lombardia)',
      rate: '1,23% - 1,73%',
      annual: regionalTax,
      monthly: toMonthly(regionalTax),
      isDeduction: true,
      explanationKey: 'regionalTax',
    },
    {
      id: 'municipal',
      label: 'Addizionale Comunale (Milano)',
      rate: '0,80%',
      annual: municipalTax,
      monthly: toMonthly(municipalTax),
      isDeduction: true,
      explanationKey: 'municipalTax',
    },
    {
      id: 'net-final',
      label: 'Stipendio Netto Finale',
      rate: ral > 0 ? formatPercent((netAnnual / ral) * 100) : '0%',
      annual: netAnnual,
      monthly: netMonthly,
      isFinal: true,
      explanationKey: 'netAnnual',
    },
  ];

  return (
    <>
      <div
        className={cn(
          'bg-white border border-neutral-200 rounded-xl shadow-sm p-5 sm:p-6 space-y-4 overflow-hidden',
          className
        )}
      >
        {/* Header Tabella */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-700">
              Dettaglio Voci Busta Paga
            </h2>
          </div>
          <span className="text-xs font-semibold text-neutral-400">
            {monthlyCount} Mensilità
          </span>
        </div>

        {/* Tabella Scannabile */}
        <div className="-mx-5 sm:mx-0 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[480px] sm:min-w-full">
            <thead>
              <tr className="border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50/50">
                <th className="py-2.5 px-4">Voce</th>
                <th className="py-2.5 px-3 text-right">Importo Annuo</th>
                <th className="py-2.5 px-4 text-right">Importo Mensile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((row) => {
                const isFinal = row.isFinal;
                const isSubtotal = row.isSubtotal;
                const isCredit = row.isCredit;
                const isDeduction = row.isDeduction;

                return (
                  <tr
                    key={row.id}
                    className={cn(
                      'transition-colors',
                      isFinal && 'bg-emerald-50/90 font-bold border-t-2 border-emerald-300',
                      isSubtotal && 'bg-neutral-50/70 text-neutral-600',
                      !isFinal && !isSubtotal && 'hover:bg-neutral-50/80'
                    )}
                  >
                    {/* Colonna Voce con Icona Info (i) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-xs sm:text-sm',
                            isFinal && 'font-black text-emerald-900',
                            isDeduction && 'font-medium text-neutral-800',
                            isCredit && 'font-semibold text-emerald-800',
                            isSubtotal && 'font-medium text-neutral-600',
                            !isFinal && !isDeduction && !isCredit && !isSubtotal && 'font-bold text-neutral-900'
                          )}
                        >
                          {row.label}
                        </span>

                        {row.explanationKey && (
                          <button
                            type="button"
                            onClick={() => handleOpenInfo(row.explanationKey)}
                            className="inline-flex items-center justify-center text-neutral-400 hover:text-neutral-900 p-0.5 rounded transition-colors"
                            title={`Dettagli e normativa: ${row.label}`}
                            aria-label={`Dettagli su ${row.label}`}
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Colonna Annuale */}
                    <td className="py-3 px-3 text-right font-medium">
                      <span
                        className={cn(
                          isFinal && 'text-base font-black text-emerald-800',
                          isDeduction && 'text-rose-600 font-semibold',
                          isCredit && 'text-emerald-600 font-semibold',
                          isSubtotal && 'text-neutral-600',
                          !isFinal && !isDeduction && !isCredit && !isSubtotal && 'font-bold text-neutral-900'
                        )}
                      >
                        {isDeduction ? `- ${formatCurrency(row.annual)}` : isCredit ? `+ ${formatCurrency(row.annual)}` : formatCurrency(row.annual)}
                      </span>
                    </td>

                    {/* Colonna Mensile */}
                    <td className="py-3 px-4 text-right font-medium">
                      <span
                        className={cn(
                          isFinal && 'text-base font-black text-emerald-800',
                          isDeduction && 'text-rose-600 font-semibold',
                          isCredit && 'text-emerald-600 font-semibold',
                          isSubtotal && 'text-neutral-600',
                          !isFinal && !isDeduction && !isCredit && !isSubtotal && 'font-bold text-neutral-900'
                        )}
                      >
                        {isDeduction ? `- ${formatCurrency(row.monthly)}` : isCredit ? `+ ${formatCurrency(row.monthly)}` : formatCurrency(row.monthly)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Modale Informativo Spiegazioni */}
      <ExplanationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        item={selectedExplanation}
      />
    </>
  );
};
