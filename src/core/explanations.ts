import type { SalaryBreakdown } from '../types/salary';
import { formatCurrency, formatPercent } from '../utils/formatters';

export interface ItemExplanation {
  /** Titolo identificativo della voce */
  title: string;
  /** Testo esplicativo sintetico per il popup/tooltip */
  explanation: string;
  /** Riferimento normativo/legislativo ufficiale */
  reference: string;
  /** Formula matematica o logica di calcolo applicata */
  formula: string;
  /** Dettaglio numerico dei passaggi di calcolo effettivi */
  calculationSteps: string;
  /** Importo numerico associato alla voce */
  amount: number;
}

export type SalaryExplanationKey =
  | 'inpsEmployee'
  | 'taxableIrpef'
  | 'grossIrpef'
  | 'deductions'
  | 'netIrpef'
  | 'regionalTax'
  | 'municipalTax'
  | 'totalTaxes'
  | 'netAnnual'
  | 'netMonthly';

export type SalaryExplanationsMap = Record<SalaryExplanationKey, ItemExplanation>;

/**
 * Genera l'insieme completo delle spiegazioni, formule e note normative per ciascuna voce del breakdown fiscale.
 *
 * @param breakdown Oggetto con i valori calcolati dello stipendio
 * @returns Mappa con i dettagli per popup, tooltip e schede informative
 */
export function getSalaryItemExplanations(breakdown: SalaryBreakdown): SalaryExplanationsMap {
  const {
    ral,
    inpsEmployee,
    taxableIrpef,
    grossIrpef,
    deductions,
    netIrpef,
    regionalTax,
    municipalTax,
    totalTaxes,
    netAnnual,
    netMonthly,
    details,
  } = breakdown;

  return {
    inpsEmployee: {
      title: 'Contributi INPS Dipendente',
      explanation: 'Contributi IVS a carico del lavoratore: 9,19% della retribuzione imponibile previdenziale.',
      reference: 'INPS, Circolare n. 117 del 20 ottobre 2022, Allegato n. 1, tabella delle aliquote contributive.',
      formula: details?.inpsEmployee?.formulaApplicata || 'RAL × 9,19%',
      calculationSteps: details?.inpsEmployee?.passaggiCalcolo || `${formatCurrency(ral, false)} × 9,19% = ${formatCurrency(inpsEmployee)}`,
      amount: inpsEmployee,
    },

    taxableIrpef: {
      title: 'Imponibile Fiscale (Base IRPEF)',
      explanation: 'Reddito imponibile fiscale semplificato dopo i contributi previdenziali a carico del lavoratore',
      reference: 'Art. 10 e Art. 51 TUIR',
      formula: details?.taxableIrpef?.formulaApplicata || 'RAL - Contributi INPS',
      calculationSteps: details?.taxableIrpef?.passaggiCalcolo || `${formatCurrency(ral, false)} - ${formatCurrency(inpsEmployee)} = ${formatCurrency(taxableIrpef)}`,
      amount: taxableIrpef,
    },

    grossIrpef: {
      title: 'IRPEF Lorda',
      explanation: 'Per il periodo d’imposta 2026, l’IRPEF lorda è calcolata applicando aliquote progressive del 23% sul reddito imponibile fino a 28.000 euro, del 33% sulla parte compresa tra 28.000 e 50.000 euro e del 43% sulla parte eccedente 50.000 euro',
      reference: 'art. 11, comma 1, TUIR, come modificato dall’art. 1, commi 3 e 4, della Legge 30 dicembre 2025, n. 199',
      formula: details?.grossIrpef?.formulaApplicata || '23% fino a 28k, 33% 28k-50k, 43% oltre 50k',
      calculationSteps: details?.grossIrpef?.passaggiCalcolo || `IRPEF lorda calcolata: ${formatCurrency(grossIrpef)}`,
      amount: grossIrpef,
    },

    deductions: {
      title: 'Detrazioni da Lavoro Dipendente',
      explanation: 'Sconto fiscale che riduce direttamente l’IRPEF lorda da pagare. L’importo è inversamente proporzionale all’imponibile fiscale: massimo (1.955 €) per redditi fino a 15.000 €, decresce progressivamente tra 15.000 € e 50.000 €, fino ad azzerarsi oltre 50.000 €. Si calcola su base annua (365 giorni di lavoro dipendente a tempo indeterminato).',
      reference: 'Art. 13, comma 1, TUIR (D.P.R. 917/1986 e successive modificazioni).',
      formula: details?.deductions?.formulaApplicata || 'Formula a scaglioni decrescenti Art. 13 TUIR',
      calculationSteps: details?.deductions?.passaggiCalcolo || `Detrazione spettante: ${formatCurrency(deductions)}`,
      amount: deductions,
    },

    netIrpef: {
      title: 'IRPEF Netta Trattenuta',
      explanation: 'Imposta IRPEF dovuta dopo aver sottratto dall’IRPEF lorda le detrazioni spettanti per il lavoro dipendente. Il risultato non può essere inferiore a zero, perché le detrazioni possono ridurre l’imposta fino ad azzerarla, ma non generano un credito nell’ambito di questo calcolo.',
      reference: 'Art. 11 e art. 13 del TUIR — D.P.R. 917/1986; Agenzia delle Entrate, modello 730/2026: l’imposta netta si ottiene sottraendo dall’imposta lorda le detrazioni spettanti.',
      formula: details?.netIrpef?.formulaApplicata || 'Max(0, IRPEF Lorda - Detrazioni)',
      calculationSteps: details?.netIrpef?.passaggiCalcolo || `${formatCurrency(grossIrpef)} - ${formatCurrency(deductions)} = ${formatCurrency(netIrpef)}`,
      amount: netIrpef,
    },

    regionalTax: {
      title: 'Addizionale Regionale (Lombardia)',
      explanation: 'Aliquota progressiva regionale applicata all’imponibile IRPEF',
      reference: 'L.R. Lombardia n. 34/2001 e s.m.i.',
      formula: details?.regionalTax?.formulaApplicata || 'Aliquote scaglioni 1,23% - 1,73%',
      calculationSteps: details?.regionalTax?.passaggiCalcolo || `Addizionale Regionale: ${formatCurrency(regionalTax)}`,
      amount: regionalTax,
    },

    municipalTax: {
      title: 'Addizionale Comunale (Milano)',
      explanation: 'Aliquota 0,80% con franchigia totale fino a 23.000 € - Delibera Comune di Milano',
      reference: 'Regolamento Addizionale Comunale IRPEF - Comune di Milano',
      formula: details?.municipalTax?.formulaApplicata || '0,80% su imponibile (se > 23.000 €)',
      calculationSteps: details?.municipalTax?.passaggiCalcolo || (taxableIrpef <= 23000 ? 'Imponibile ≤ 23.000 € ➔ Esente (0,00 €)' : `${formatCurrency(taxableIrpef)} × 0,80% = ${formatCurrency(municipalTax)}`),
      amount: municipalTax,
    },

    totalTaxes: {
      title: 'Totale Trattenute Fiscali e Previdenziali',
      explanation: 'Somma di tutte le imposte erariali, locali e contributi previdenziali a carico del lavoratore',
      reference: 'Totale trattenute di legge',
      formula: 'INPS + IRPEF Netta + Addizionale Regionale + Addizionale Comunale',
      calculationSteps: `${formatCurrency(inpsEmployee)} + ${formatCurrency(netIrpef)} + ${formatCurrency(regionalTax)} + ${formatCurrency(municipalTax)} = ${formatCurrency(totalTaxes)}`,
      amount: totalTaxes,
    },

    netAnnual: {
      title: 'Stipendio Netto Annuale',
      explanation: 'Compenso netto reale annuo spettante al dipendente dopo tutte le ritenute fiscali e contributive',
      reference: 'Retribuzione Netta Annua',
      formula: 'RAL - Totale Trattenute',
      calculationSteps: `${formatCurrency(ral, false)} - ${formatCurrency(totalTaxes)} = ${formatCurrency(netAnnual)} (${formatPercent(ral > 0 ? (netAnnual / ral) * 100 : 0)} del lordo)`,
      amount: netAnnual,
    },

    netMonthly: {
      title: 'Stipendio Netto Mensile',
      explanation: 'Quota netta percepita in ciascuna busta paga in base al numero di mensilità previste dal contratto',
      reference: 'Busta paga mensile ordinaria',
      formula: 'Netto Annuale / Numero Mensilità',
      calculationSteps: `${formatCurrency(netAnnual)} / ${breakdown.netMonthly > 0 ? Math.round(netAnnual / netMonthly) : 13} = ${formatCurrency(netMonthly)}`,
      amount: netMonthly,
    },
  };
}
