import type { TaxBracket, RegionalTaxBracket } from '../types/salary';

/**
 * Aliquote e soglie per la contribuzione previdenziale INPS a carico del lavoratore dipendente.
 */
export const INPS_CONSTANTS = {
  /** Aliquota contributiva IVS a carico del dipendente per tempo indeterminato standard */
  EMPLOYEE_RATE: 0.0919, // 9.19%
  /** Aliquota aggiuntiva di solidarietà (art. 3-ter D.L. 384/1992) oltre la prima fascia pensionabile */
  ADDITIONAL_SURCHARGE_RATE: 0.01, // 1%
  /** Prima fascia di retribuzione pensionabile annua oltre cui scatta l'aliquota aggiuntiva 1% (~55.008 €) */
  FIRST_PENSION_BRACKET_CEILING: 55008,
} as const;

/**
 * Scaglioni di reddito e aliquote IRPEF a scaglioni progressivi.
 * Applicati sull'imponibile fiscale (RAL - Contributi INPS).
 */
export const IRPEF_BRACKETS: readonly TaxBracket[] = [
  { upTo: 28000, rate: 0.23 },      // 23% fino a 28.000 €
  { upTo: 50000, rate: 0.35 },      // 35% tra 28.000 € e 50.000 €
  { upTo: Infinity, rate: 0.43 },   // 43% oltre i 50.000 €
] as const;

/**
 * Parametri di calcolo per le detrazioni da lavoro dipendente (Art. 13 TUIR).
 * Il valore della detrazione si rapporta al periodo di lavoro nell'anno (365 giorni).
 */
export const EMPLOYEE_DEDUCTIONS = {
  FIRST_TIER_MAX_INCOME: 15000,
  FIRST_TIER_BASE: 1955,
  FIRST_TIER_MIN_AMOUNT: 690, // Importo minimo garantito a tempo indeterminato

  SECOND_TIER_MAX_INCOME: 28000,
  SECOND_TIER_BASE: 1910,
  SECOND_TIER_EXTRA: 1190,
  SECOND_TIER_DIVISOR: 13000,

  THIRD_TIER_MAX_INCOME: 50000,
  THIRD_TIER_BASE: 1910,
  THIRD_TIER_DIVISOR: 22000,
} as const;

/**
 * Scaglioni di aliquota Addizionale Regionale per la Regione Lombardia.
 */
export const LOMBARDY_REGIONAL_BRACKETS: readonly RegionalTaxBracket[] = [
  { upTo: 15000, rate: 0.0123 },    // 1.23% fino a 15.000 €
  { upTo: 28000, rate: 0.0158 },    // 1.58% da 15.000,01 € a 28.000 €
  { upTo: 50000, rate: 0.0172 },    // 1.72% da 28.000,01 € a 50.000 €
  { upTo: Infinity, rate: 0.0173 }, // 1.73% oltre i 50.000 €
] as const;

/**
 * Parametri Addizionale Comunale per il Comune di Milano.
 */
export const MILAN_MUNICIPAL_TAX = {
  /** Aliquota unica dell'addizionale comunale per Milano */
  RATE: 0.008, // 0.80%
  /** Soglia di esenzione: se l'imponibile non supera 23.000 €, l'addizionale non è dovuta */
  EXEMPTION_THRESHOLD: 23000,
} as const;

/**
 * Stima parametri del costo azienda (Datore di Lavoro).
 */
export const COMPANY_COST_CONSTANTS = {
  /** Aliquota INPS standard a carico azienda per CCNL commercio/terziario (~23.81% - 28%) */
  INPS_EMPLOYER_RATE: 0.2381,
  /** Quota accantonamento Trattamento di Fine Rapporto (TFR = RAL / 13.5 ≈ 7.41%) */
  TFR_DIVISOR: 13.5,
  /** Premio assicurativo INAIL indicativo medio dipendenti d'ufficio (~0.4%) */
  INAIL_RATE: 0.004,
} as const;
