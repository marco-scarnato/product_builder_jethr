import type {
  SalaryInput,
  SalaryBreakdown,
  CalculationStepDetail,
  SalaryCalculationDetails,
  CompanyCostBreakdown,
} from '../types/salary';
import {
  INPS_CONSTANTS,
  IRPEF_CONSTANTS,
  EMPLOYEE_DEDUCTIONS,
  REGIONAL_TAX_CONSTANTS,
  MILAN_MUNICIPAL_TAX,
  COMPANY_COST_CONSTANTS,
} from './constants';
import { formatCurrency } from '../utils/formatters';

/**
 * Arrotonda un valore numerico a due cifre decimali (centesimi di euro standard).
 */
export function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * 1. Calcolo Contributi Previdenziali INPS Dipendente (9.19% su RAL).
 */
export function calculateInpsEmployee(ral: number): CalculationStepDetail {
  const sanitizedRal = Math.max(0, ral || 0);
  const valore = roundToTwoDecimals(sanitizedRal * INPS_CONSTANTS.EMPLOYEE_RATE);

  return {
    valore,
    formulaApplicata: 'RAL × 9,19%',
    passaggiCalcolo: `${formatCurrency(sanitizedRal, false)} × 9,19% = ${formatCurrency(valore)}`,
    fonteNormativa: INPS_CONSTANTS.FONTE_NORMATIVA,
  };
}

/**
 * 2. Calcolo Imponibile Fiscale (RAL - INPS).
 */
export function calculateTaxableIncome(ral: number, inpsValue: number): CalculationStepDetail {
  const sanitizedRal = Math.max(0, ral || 0);
  const valore = roundToTwoDecimals(Math.max(0, sanitizedRal - inpsValue));

  return {
    valore,
    formulaApplicata: 'RAL - Contributi Previdenziali INPS',
    passaggiCalcolo: `${formatCurrency(sanitizedRal, false)} - ${formatCurrency(inpsValue)} = ${formatCurrency(valore)}`,
    fonteNormativa: 'Art. 51 TUIR (Determinazione del reddito di lavoro dipendente imponibile)',
  };
}

/**
 * 3. Calcolo IRPEF Lorda:
 * - <= 28.000 €: 23%
 * - 28.001 € - 50.000 €: 6.440 € + 33% sull'eccedenza di 28k
 * - > 50.000 €: 13.700 € + 43% sull'eccedenza di 50k
 */
export function calculateGrossIrpef(taxableIncome: number): CalculationStepDetail {
  const taxable = Math.max(0, taxableIncome || 0);

  if (taxable <= 0) {
    return {
      valore: 0,
      formulaApplicata: '0 € su imponibile nullo o negativo',
      passaggiCalcolo: 'Imponibile 0,00 € ➔ IRPEF Lorda: 0,00 €',
      fonteNormativa: IRPEF_CONSTANTS.FONTE_NORMATIVA,
    };
  }

  if (taxable <= IRPEF_CONSTANTS.TIER_1_LIMIT) {
    const valore = roundToTwoDecimals(taxable * IRPEF_CONSTANTS.TIER_1_RATE);
    return {
      valore,
      formulaApplicata: 'Imponibile × 23% (fino a 28.000 €)',
      passaggiCalcolo: `${formatCurrency(taxable)} × 23% = ${formatCurrency(valore)}`,
      fonteNormativa: IRPEF_CONSTANTS.FONTE_NORMATIVA,
    };
  }

  if (taxable <= IRPEF_CONSTANTS.TIER_2_LIMIT) {
    const excess = taxable - IRPEF_CONSTANTS.TIER_1_LIMIT;
    const excessTax = excess * IRPEF_CONSTANTS.TIER_2_RATE;
    const valore = roundToTwoDecimals(IRPEF_CONSTANTS.TIER_1_MAX_TAX + excessTax);

    return {
      valore,
      formulaApplicata: '6.440 € + 33% sull’eccedenza oltre 28.000 €',
      passaggiCalcolo: `6.440,00 € + (${formatCurrency(taxable)} - 28.000,00 €) × 33% = 6.440,00 € + ${formatCurrency(excessTax)} = ${formatCurrency(valore)}`,
      fonteNormativa: IRPEF_CONSTANTS.FONTE_NORMATIVA,
    };
  }

  // Oltre 50.000 €
  const excess = taxable - IRPEF_CONSTANTS.TIER_2_LIMIT;
  const excessTax = excess * IRPEF_CONSTANTS.TIER_3_RATE;
  const valore = roundToTwoDecimals(IRPEF_CONSTANTS.TIER_2_MAX_TAX + excessTax);

  return {
    valore,
    formulaApplicata: '13.700 € + 43% sull’eccedenza oltre 50.000 €',
    passaggiCalcolo: `13.700,00 € + (${formatCurrency(taxable)} - 50.000,00 €) × 43% = 13.700,00 € + ${formatCurrency(excessTax)} = ${formatCurrency(valore)}`,
    fonteNormativa: IRPEF_CONSTANTS.FONTE_NORMATIVA,
  };
}

/**
 * 4. Calcolo Detrazioni da Lavoro Dipendente (Art. 13 TUIR):
 * - Imponibile <= 15.000 €: 1.955 €
 * - 15.001 € - 28.000 €: 1.910 € + 1.190 € * ((28.000 - Imponibile) / 13.000)
 * - 28.001 € - 50.000 €: 1.910 € * ((50.000 - Imponibile) / 22.000)
 * - > 50.000 €: 0 €
 */
export function calculateEmployeeDeductions(taxableIncome: number): CalculationStepDetail {
  const taxable = Math.max(0, taxableIncome || 0);

  if (taxable <= 0) {
    return {
      valore: 0,
      formulaApplicata: '0 € su imponibile nullo o negativo',
      passaggiCalcolo: 'Imponibile 0,00 € ➔ Detrazione: 0,00 €',
      fonteNormativa: EMPLOYEE_DEDUCTIONS.FONTE_NORMATIVA,
    };
  }

  if (taxable <= EMPLOYEE_DEDUCTIONS.TIER_1_LIMIT) {
    const valore = EMPLOYEE_DEDUCTIONS.TIER_1_AMOUNT;
    return {
      valore,
      formulaApplicata: 'Detrazione fissa intera 1.955 € per redditi fino a 15.000 €',
      passaggiCalcolo: `Imponibile ${formatCurrency(taxable)} ≤ 15.000,00 € ➔ Detrazione spettante: 1.955,00 €`,
      fonteNormativa: EMPLOYEE_DEDUCTIONS.FONTE_NORMATIVA,
    };
  }

  if (taxable <= EMPLOYEE_DEDUCTIONS.TIER_2_LIMIT) {
    const quota = (EMPLOYEE_DEDUCTIONS.TIER_2_LIMIT - taxable) / EMPLOYEE_DEDUCTIONS.TIER_2_DIVISOR;
    const extra = EMPLOYEE_DEDUCTIONS.TIER_2_EXTRA * quota;
    const valore = roundToTwoDecimals(EMPLOYEE_DEDUCTIONS.TIER_2_BASE + extra);

    return {
      valore,
      formulaApplicata: '1.910 € + 1.190 € × ((28.000 - Imponibile) / 13.000)',
      passaggiCalcolo: `1.910,00 € + 1.190,00 € × ((28.000,00 € - ${formatCurrency(taxable)}) / 13.000) = 1.910,00 € + ${formatCurrency(extra)} = ${formatCurrency(valore)}`,
      fonteNormativa: EMPLOYEE_DEDUCTIONS.FONTE_NORMATIVA,
    };
  }

  if (taxable <= EMPLOYEE_DEDUCTIONS.TIER_3_LIMIT) {
    const quota = (EMPLOYEE_DEDUCTIONS.TIER_3_LIMIT - taxable) / EMPLOYEE_DEDUCTIONS.TIER_3_DIVISOR;
    const valore = roundToTwoDecimals(EMPLOYEE_DEDUCTIONS.TIER_3_BASE * quota);

    return {
      valore,
      formulaApplicata: '1.910 € × ((50.000 - Imponibile) / 22.000)',
      passaggiCalcolo: `1.910,00 € × ((50.000,00 € - ${formatCurrency(taxable)}) / 22.000) = ${formatCurrency(valore)}`,
      fonteNormativa: EMPLOYEE_DEDUCTIONS.FONTE_NORMATIVA,
    };
  }

  // Oltre 50.000 €
  return {
    valore: 0,
    formulaApplicata: '0 € (Detrazione non spettante per redditi superiori a 50.000 €)',
    passaggiCalcolo: `Imponibile ${formatCurrency(taxable)} > 50.000,00 € ➔ Detrazione applicata: 0,00 €`,
    fonteNormativa: EMPLOYEE_DEDUCTIONS.FONTE_NORMATIVA,
  };
}

/**
 * Calcolo IRPEF Netta (Max(0, IRPEF Lorda - Detrazioni)).
 */
export function calculateNetIrpef(grossIrpef: number, deductions: number): CalculationStepDetail {
  const gross = Math.max(0, grossIrpef || 0);
  const ded = Math.max(0, deductions || 0);
  const valore = roundToTwoDecimals(Math.max(0, gross - ded));

  return {
    valore,
    formulaApplicata: 'Max(0, IRPEF Lorda - Detrazioni Lavoro Dipendente)',
    passaggiCalcolo: `${formatCurrency(gross)} - ${formatCurrency(ded)} = ${formatCurrency(valore)} (con limite capienza fiscale)`,
    fonteNormativa: 'Art. 11 e 13 TUIR (Determinazione dell’IRPEF netta dovuta)',
  };
}

/**
 * 5. Calcolo Addizionale Regionale Lombardia (Scaglioni progressivi):
 * - Fino a 15.000 €: 1.23%
 * - 15.001 € - 28.000 €: 1.58%
 * - 28.001 € - 50.000 €: 1.72%
 * - Oltre 50.000 €: 1.73%
 */
export function calculateRegionalTax(taxableIncome: number): CalculationStepDetail {
  const taxable = Math.max(0, taxableIncome || 0);

  if (taxable <= 0) {
    return {
      valore: 0,
      formulaApplicata: '0 € su imponibile nullo o negativo',
      passaggiCalcolo: 'Imponibile 0,00 € ➔ Addizionale Regionale: 0,00 €',
      fonteNormativa: REGIONAL_TAX_CONSTANTS.FONTE_NORMATIVA,
    };
  }

  let valore = 0;
  let passaggi = '';

  if (taxable <= REGIONAL_TAX_CONSTANTS.TIER_1_LIMIT) {
    valore = roundToTwoDecimals(taxable * REGIONAL_TAX_CONSTANTS.TIER_1_RATE);
    passaggi = `${formatCurrency(taxable)} × 1,23% = ${formatCurrency(valore)}`;
  } else if (taxable <= REGIONAL_TAX_CONSTANTS.TIER_2_LIMIT) {
    const excess = taxable - REGIONAL_TAX_CONSTANTS.TIER_1_LIMIT;
    const excessTax = excess * REGIONAL_TAX_CONSTANTS.TIER_2_RATE;
    valore = roundToTwoDecimals(REGIONAL_TAX_CONSTANTS.TIER_1_MAX_TAX + excessTax);
    passaggi = `184,50 € (quota 15k) + (${formatCurrency(taxable)} - 15.000,00 €) × 1,58% = 184,50 € + ${formatCurrency(excessTax)} = ${formatCurrency(valore)}`;
  } else if (taxable <= REGIONAL_TAX_CONSTANTS.TIER_3_LIMIT) {
    const excess = taxable - REGIONAL_TAX_CONSTANTS.TIER_2_LIMIT;
    const excessTax = excess * REGIONAL_TAX_CONSTANTS.TIER_3_RATE;
    valore = roundToTwoDecimals(REGIONAL_TAX_CONSTANTS.TIER_2_MAX_TAX + excessTax);
    passaggi = `389,90 € (quota 28k) + (${formatCurrency(taxable)} - 28.000,00 €) × 1,72% = 389,90 € + ${formatCurrency(excessTax)} = ${formatCurrency(valore)}`;
  } else {
    const excess = taxable - REGIONAL_TAX_CONSTANTS.TIER_3_LIMIT;
    const excessTax = excess * REGIONAL_TAX_CONSTANTS.TIER_4_RATE;
    valore = roundToTwoDecimals(REGIONAL_TAX_CONSTANTS.TIER_3_MAX_TAX + excessTax);
    passaggi = `768,30 € (quota 50k) + (${formatCurrency(taxable)} - 50.000,00 €) × 1,73% = 768,30 € + ${formatCurrency(excessTax)} = ${formatCurrency(valore)}`;
  }

  return {
    valore,
    formulaApplicata: 'Aliquote progressive Regione Lombardia: 1,23% (fino a 15k), 1,58% (15k-28k), 1,72% (28k-50k), 1,73% (>50k)',
    passaggiCalcolo: passaggi,
    fonteNormativa: REGIONAL_TAX_CONSTANTS.FONTE_NORMATIVA,
  };
}

/**
 * 6. Calcolo Addizionale Comunale Milano:
 * - Se Imponibile <= 23.000 €: 0 €
 * - Se Imponibile > 23.000 €: 0.80% su TUTTO l'imponibile
 */
export function calculateMunicipalTax(taxableIncome: number): CalculationStepDetail {
  const taxable = Math.max(0, taxableIncome || 0);

  if (taxable <= MILAN_MUNICIPAL_TAX.EXEMPTION_THRESHOLD) {
    return {
      valore: 0,
      formulaApplicata: '0 € (Esenzione totale per imponibile ≤ 23.000 €)',
      passaggiCalcolo: `Imponibile ${formatCurrency(taxable)} ≤ 23.000,00 € (Soglia di esenzione Comune di Milano) ➔ 0,00 €`,
      fonteNormativa: MILAN_MUNICIPAL_TAX.FONTE_NORMATIVA,
    };
  }

  const valore = roundToTwoDecimals(taxable * MILAN_MUNICIPAL_TAX.RATE);
  return {
    valore,
    formulaApplicata: 'Imponibile × 0,80% (applicata sull’intero imponibile per redditi > 23.000 €)',
    passaggiCalcolo: `${formatCurrency(taxable)} × 0,80% = ${formatCurrency(valore)}`,
    fonteNormativa: MILAN_MUNICIPAL_TAX.FONTE_NORMATIVA,
  };
}

/**
 * Calcola la stima del costo complessivo per il datore di lavoro.
 */
export function calculateCompanyCost(ral: number): CompanyCostBreakdown {
  if (ral <= 0) {
    return {
      tfr: 0,
      inpsCompany: 0,
      inail: 0,
      totalCompanyCost: 0,
    };
  }

  const tfr = roundToTwoDecimals(ral / COMPANY_COST_CONSTANTS.TFR_DIVISOR);
  const inpsCompany = roundToTwoDecimals(ral * COMPANY_COST_CONSTANTS.INPS_EMPLOYER_RATE);
  const inail = roundToTwoDecimals(ral * COMPANY_COST_CONSTANTS.INAIL_RATE);
  const totalCompanyCost = roundToTwoDecimals(ral + tfr + inpsCompany + inail);

  return {
    tfr,
    inpsCompany,
    inail,
    totalCompanyCost,
  };
}

/**
 * Funzione principale per il calcolo completo dello stipendio con tutti i passaggi trasparenti.
 */
export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const ral = Math.max(0, input.ral || 0);
  const monthlyCount = input.monthlyCount === 14 ? 14 : 13;

  // 1. INPS Dipendente
  const inpsDetail = calculateInpsEmployee(ral);

  // 2. Imponibile Fiscale
  const taxableDetail = calculateTaxableIncome(ral, inpsDetail.valore);

  // 3. IRPEF Lorda
  const grossIrpefDetail = calculateGrossIrpef(taxableDetail.valore);

  // 4. Detrazioni Lavoro Dipendente
  const deductionsDetail = calculateEmployeeDeductions(taxableDetail.valore);

  // 5. IRPEF Netta
  const netIrpefDetail = calculateNetIrpef(grossIrpefDetail.valore, deductionsDetail.valore);

  // 6. Addizionale Regionale Lombardia
  const regionalTaxDetail = calculateRegionalTax(taxableDetail.valore);

  // 7. Addizionale Comunale Milano
  const municipalTaxDetail = calculateMunicipalTax(taxableDetail.valore);

  // 8. Totale Tasse & Trattenute
  const totalTaxesVal = roundToTwoDecimals(
    inpsDetail.valore + netIrpefDetail.valore + regionalTaxDetail.valore + municipalTaxDetail.valore
  );

  const totalTaxesDetail: CalculationStepDetail = {
    valore: totalTaxesVal,
    formulaApplicata: 'INPS + IRPEF Netta + Addizionale Regionale + Addizionale Comunale',
    passaggiCalcolo: `${formatCurrency(inpsDetail.valore)} + ${formatCurrency(netIrpefDetail.valore)} + ${formatCurrency(regionalTaxDetail.valore)} + ${formatCurrency(municipalTaxDetail.valore)} = ${formatCurrency(totalTaxesVal)}`,
    fonteNormativa: 'Totale imposte e contributi a carico lavoratore dipendente',
  };

  // 9. Netto Annuale e Mensile
  const netAnnualVal = roundToTwoDecimals(Math.max(0, ral - totalTaxesVal));
  const netMonthlyVal = roundToTwoDecimals(netAnnualVal / monthlyCount);

  const netAnnualDetail: CalculationStepDetail = {
    valore: netAnnualVal,
    formulaApplicata: 'RAL - Totale Trattenute Fiscali e Previdenziali',
    passaggiCalcolo: `${formatCurrency(ral, false)} - ${formatCurrency(totalTaxesVal)} = ${formatCurrency(netAnnualVal)}`,
    fonteNormativa: 'Retribuzione netta annua effettiva percepita',
  };

  const netMonthlyDetail: CalculationStepDetail = {
    valore: netMonthlyVal,
    formulaApplicata: `Netto Annuale / ${monthlyCount} mensilità`,
    passaggiCalcolo: `${formatCurrency(netAnnualVal)} / ${monthlyCount} = ${formatCurrency(netMonthlyVal)}`,
    fonteNormativa: `C.C.N.L. di riferimento (${monthlyCount} mensilità contrattuali)`,
  };

  // Pressione fiscale (%)
  const effectiveTaxRate = ral > 0 ? roundToTwoDecimals((totalTaxesVal / ral) * 100) : 0;

  // Stima Costo Azienda
  const companyCost = calculateCompanyCost(ral);

  const details: SalaryCalculationDetails = {
    inpsEmployee: inpsDetail,
    taxableIrpef: taxableDetail,
    grossIrpef: grossIrpefDetail,
    deductions: deductionsDetail,
    netIrpef: netIrpefDetail,
    regionalTax: regionalTaxDetail,
    municipalTax: municipalTaxDetail,
    totalTaxes: totalTaxesDetail,
    netAnnual: netAnnualDetail,
    netMonthly: netMonthlyDetail,
  };

  return {
    ral,
    inpsEmployee: inpsDetail.valore,
    taxableIrpef: taxableDetail.valore,
    grossIrpef: grossIrpefDetail.valore,
    deductions: deductionsDetail.valore,
    netIrpef: netIrpefDetail.valore,
    regionalTax: regionalTaxDetail.valore,
    municipalTax: municipalTaxDetail.valore,
    totalTaxes: totalTaxesVal,
    netAnnual: netAnnualVal,
    netMonthly: netMonthlyVal,
    effectiveTaxRate,
    companyCost,
    details,
  };
}
