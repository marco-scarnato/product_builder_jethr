import type { TaxBracket, RegionalTaxBracket } from '../types/salary';

/**
 * Parametri e aliquote per la contribuzione previdenziale INPS a carico del dipendente.
 */
export const INPS_CONSTANTS = {
  /** Aliquota contributiva IVS a carico del dipendente per tempo indeterminato (9.19%) */
  EMPLOYEE_RATE: 0.0919,
  FONTE_NORMATIVA: 'INPS, Circolare n. 117 del 20 ottobre 2022, Allegato n. 1, tabella delle aliquote contributive.',
} as const;

/**
 * Scaglioni IRPEF e aliquote:
 * 1. Fino a 28.000 €: 23%
 * 2. 28.001 € - 50.000 €: 6.440 € + 33% sull'eccedenza di 28.000 €
 * 3. Oltre 50.000 €: 13.700 € + 43% sull'eccedenza di 50.000 €
 */
export const IRPEF_CONSTANTS = {
  TIER_1_LIMIT: 28000,
  TIER_1_RATE: 0.23,
  TIER_1_MAX_TAX: 6440, // 28.000 * 0.23

  TIER_2_LIMIT: 50000,
  TIER_2_RATE: 0.33,
  TIER_2_MAX_TAX: 13700, // 6.440 + (22.000 * 0.33)

  TIER_3_RATE: 0.43,

  FONTE_NORMATIVA: 'Art. 11 TUIR (Imposta sul Reddito delle Persone Fisiche - Scaglioni di reddito e aliquote)',
} as const;

export const IRPEF_BRACKETS: readonly TaxBracket[] = [
  { upTo: 28000, rate: 0.23 },
  { upTo: 50000, rate: 0.33 },
  { upTo: Infinity, rate: 0.43 },
] as const;

/**
 * Parametri Detrazioni da Lavoro Dipendente (Art. 13 TUIR):
 * - Imponibile <= 15.000 €: 1.955 €
 * - 15.001 € - 28.000 €: 1.910 € + 1.190 € * ((28.000 - Imponibile) / 13.000)
 * - 28.001 € - 50.000 €: 1.910 € * ((50.000 - Imponibile) / 22.000)
 * - > 50.000 €: 0 €
 */
export const EMPLOYEE_DEDUCTIONS = {
  TIER_1_LIMIT: 15000,
  TIER_1_AMOUNT: 1955,

  TIER_2_LIMIT: 28000,
  TIER_2_BASE: 1910,
  TIER_2_EXTRA: 1190,
  TIER_2_DIVISOR: 13000,

  TIER_3_LIMIT: 50000,
  TIER_3_BASE: 1910,
  TIER_3_DIVISOR: 22000,

  FONTE_NORMATIVA: 'Art. 13, comma 1, TUIR (Detrazioni per redditi di lavoro dipendente a tempo indeterminato)',
} as const;

/**
 * Scaglioni progressivi Addizionale Regionale per la Regione Lombardia:
 * 1. Fino a 15.000 €: 1.23% (max 184.50 €)
 * 2. 15.001 € - 28.000 €: 1.58% (max 205.40 €)
 * 3. 28.001 € - 50.000 €: 1.72% (max 378.40 €)
 * 4. Oltre 50.000 €: 1.73% sull'eccedenza
 */
export const LOMBARDY_REGIONAL_BRACKETS: readonly RegionalTaxBracket[] = [
  { upTo: 15000, rate: 0.0123 },
  { upTo: 28000, rate: 0.0158 },
  { upTo: 50000, rate: 0.0172 },
  { upTo: Infinity, rate: 0.0173 },
] as const;

export const REGIONAL_TAX_CONSTANTS = {
  TIER_1_LIMIT: 15000,
  TIER_1_RATE: 0.0123,
  TIER_1_MAX_TAX: 184.5, // 15.000 * 0.0123

  TIER_2_LIMIT: 28000,
  TIER_2_RATE: 0.0158,
  TIER_2_MAX_TAX: 389.9, // 184.50 + (13.000 * 0.0158)

  TIER_3_LIMIT: 50000,
  TIER_3_RATE: 0.0172,
  TIER_3_MAX_TAX: 768.3, // 389.90 + (22.000 * 0.0172)

  TIER_4_RATE: 0.0173,

  FONTE_NORMATIVA: 'L.R. Lombardia n. 34/2001 e s.m.i. (Scaglioni progressivi Addizionale Regionale all’IRPEF)',
} as const;

/**
 * Addizionale Comunale per il Comune di Milano:
 * - Se Imponibile <= 23.000 €: 0 € (esenzione totale)
 * - Se Imponibile > 23.000 €: 0.80% su TUTTO l'imponibile
 */
export const MILAN_MUNICIPAL_TAX = {
  RATE: 0.008, // 0.80%
  EXEMPTION_THRESHOLD: 23000,
  FONTE_NORMATIVA: 'Regolamento per l’applicazione dell’Addizionale Comunale all’IRPEF - Comune di Milano',
} as const;

/**
 * Costi stimati a carico dell'azienda (Datore di lavoro).
 */
export const COMPANY_COST_CONSTANTS = {
  INPS_EMPLOYER_RATE: 0.2381,
  TFR_DIVISOR: 13.5,
  INAIL_RATE: 0.004,
  FONTE_NORMATIVA: 'C.C.N.L. Terziario/Commercio - Contribuzione IVS/DS a carico azienda e quota accantonamento TFR (Art. 2120 c.c.)',
} as const;
