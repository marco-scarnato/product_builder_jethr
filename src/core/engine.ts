import type { SalaryInput, SalaryBreakdown, CompanyCostBreakdown } from '../types/salary';
import {
  INPS_CONSTANTS,
  IRPEF_BRACKETS,
  EMPLOYEE_DEDUCTIONS,
  LOMBARDY_REGIONAL_BRACKETS,
  MILAN_MUNICIPAL_TAX,
  COMPANY_COST_CONSTANTS,
} from './constants';

/**
 * Arrotonda un valore numerico a due cifre decimali (centesimi di euro).
 */
export function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calcola la contribuzione previdenziale INPS a carico del lavoratore (IVS 9.19% + eventuale 1% eccedenza).
 */
export function calculateInpsEmployee(ral: number): number {
  if (ral <= 0) return 0;

  const baseContribution = ral * INPS_CONSTANTS.EMPLOYEE_RATE;
  let surcharge = 0;

  if (ral > INPS_CONSTANTS.FIRST_PENSION_BRACKET_CEILING) {
    const excess = ral - INPS_CONSTANTS.FIRST_PENSION_BRACKET_CEILING;
    surcharge = excess * INPS_CONSTANTS.ADDITIONAL_SURCHARGE_RATE;
  }

  return roundToTwoDecimals(baseContribution + surcharge);
}

/**
 * Calcola l'IRPEF lorda a scaglioni progressivi sull'imponibile fiscale.
 */
export function calculateGrossIrpef(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let totalIrpef = 0;
  let previousLimit = 0;

  for (const bracket of IRPEF_BRACKETS) {
    if (taxableIncome > previousLimit) {
      const taxableInBracket = Math.min(taxableIncome, bracket.upTo) - previousLimit;
      totalIrpef += taxableInBracket * bracket.rate;
      previousLimit = bracket.upTo;
    } else {
      break;
    }
  }

  return roundToTwoDecimals(totalIrpef);
}

/**
 * Calcola le detrazioni fiscali per lavoro dipendente a tempo indeterminato (Art. 13 TUIR).
 */
export function calculateEmployeeDeductions(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let deductions = 0;

  if (taxableIncome <= EMPLOYEE_DEDUCTIONS.FIRST_TIER_MAX_INCOME) {
    // 1° Scaglione (fino a 15.000 €): detrazione piena 1.955 € (minimo garantito 690 €)
    deductions = Math.max(
      EMPLOYEE_DEDUCTIONS.FIRST_TIER_BASE,
      EMPLOYEE_DEDUCTIONS.FIRST_TIER_MIN_AMOUNT
    );
  } else if (taxableIncome <= EMPLOYEE_DEDUCTIONS.SECOND_TIER_MAX_INCOME) {
    // 2° Scaglione (15.000 € - 28.000 €): 1.910 + 1.190 * [(28.000 - Reddito) / 13.000]
    const quota = (EMPLOYEE_DEDUCTIONS.SECOND_TIER_MAX_INCOME - taxableIncome) / EMPLOYEE_DEDUCTIONS.SECOND_TIER_DIVISOR;
    deductions = EMPLOYEE_DEDUCTIONS.SECOND_TIER_BASE + EMPLOYEE_DEDUCTIONS.SECOND_TIER_EXTRA * quota;
  } else if (taxableIncome <= EMPLOYEE_DEDUCTIONS.THIRD_TIER_MAX_INCOME) {
    // 3° Scaglione (28.000 € - 50.000 €): 1.910 * [(50.000 - Reddito) / 22.000]
    const quota = (EMPLOYEE_DEDUCTIONS.THIRD_TIER_MAX_INCOME - taxableIncome) / EMPLOYEE_DEDUCTIONS.THIRD_TIER_DIVISOR;
    deductions = EMPLOYEE_DEDUCTIONS.THIRD_TIER_BASE * quota;
  } else {
    // Oltre 50.000 €: nessuna detrazione per lavoro dipendente
    deductions = 0;
  }

  return roundToTwoDecimals(Math.max(0, deductions));
}

/**
 * Calcola l'Addizionale Regionale per la Regione Lombardia a scaglioni progressivi.
 */
export function calculateRegionalTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let totalRegionalTax = 0;
  let previousLimit = 0;

  for (const bracket of LOMBARDY_REGIONAL_BRACKETS) {
    if (taxableIncome > previousLimit) {
      const taxableInBracket = Math.min(taxableIncome, bracket.upTo) - previousLimit;
      totalRegionalTax += taxableInBracket * bracket.rate;
      previousLimit = bracket.upTo;
    } else {
      break;
    }
  }

  return roundToTwoDecimals(totalRegionalTax);
}

/**
 * Calcola l'Addizionale Comunale per il Comune di Milano (0.80% con esenzione fino a 23.000 €).
 */
export function calculateMunicipalTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  if (taxableIncome <= MILAN_MUNICIPAL_TAX.EXEMPTION_THRESHOLD) {
    return 0;
  }

  return roundToTwoDecimals(taxableIncome * MILAN_MUNICIPAL_TAX.RATE);
}

/**
 * Calcola la stima del costo complessivo per il datore di lavoro (Costo Azienda).
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
 * Funzione principale e deterministica per il calcolo completo dello stipendio netto e del breakdown fiscale.
 *
 * @param input Dati retributivi di input (RAL, numero mensilità, regime opzionale)
 * @returns SalaryBreakdown con tutte le voci di trattenuta, netto annuale, mensile e costo azienda
 */
export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const ral = Math.max(0, input.ral || 0);
  const monthlyCount = input.monthlyCount === 14 ? 14 : 13;

  // 1. Contributi INPS dipendente
  const inpsEmployee = calculateInpsEmployee(ral);

  // 2. Imponibile Fiscale (IRPEF)
  const taxableIrpef = roundToTwoDecimals(Math.max(0, ral - inpsEmployee));

  // 3. IRPEF Lorda e Detrazioni Lavoro Dipendente
  const grossIrpef = calculateGrossIrpef(taxableIrpef);
  const deductions = calculateEmployeeDeductions(taxableIrpef);

  // 4. IRPEF Netta (capienza fiscale: non può essere negativa)
  const netIrpef = roundToTwoDecimals(Math.max(0, grossIrpef - deductions));

  // 5. Addizionali IRPEF
  const regionalTax = calculateRegionalTax(taxableIrpef);
  const municipalTax = calculateMunicipalTax(taxableIrpef);

  // 6. Totale trattenute e Netto
  const totalTaxes = roundToTwoDecimals(inpsEmployee + netIrpef + regionalTax + municipalTax);
  const netAnnual = roundToTwoDecimals(Math.max(0, ral - totalTaxes));
  const netMonthly = roundToTwoDecimals(netAnnual / monthlyCount);

  // 7. Pressione fiscale effettiva (%)
  const effectiveTaxRate = ral > 0 ? roundToTwoDecimals((totalTaxes / ral) * 100) : 0;

  // 8. Stima Costo Azienda
  const companyCost = calculateCompanyCost(ral);

  return {
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
    effectiveTaxRate,
    companyCost,
  };
}
