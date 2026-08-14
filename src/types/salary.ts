export interface SalaryInput {
  /** Retribuzione Annua Lorda in Euro */
  ral: number;
  /** Numero di mensilità contrattuali (13 per commercio base, 14 per terziario/commercio esteso) */
  monthlyCount: 13 | 14;
  /** Flag opzionale per regimi fiscali agevolati (es. rientro cervelli) */
  hasSpecialRegime?: boolean;
}

export interface TaxBracket {
  /** Limite superiore dello scaglione (Infinity per l'ultimo scaglione) */
  upTo: number;
  /** Aliquota percentuale in decimale (es. 0.23 per 23%) */
  rate: number;
}

export interface RegionalTaxBracket {
  upTo: number;
  rate: number;
}

export interface CompanyCostBreakdown {
  /** Quota TFR maturata annualmente (RAL / 13.5) */
  tfr: number;
  /** Contributi previdenziali INPS a carico del datore di lavoro (~23.81% - 28%) */
  inpsCompany: number;
  /** Contributo assicurativo INAIL stimato (~0.4%) */
  inail: number;
  /** Costo complessivo totale sostenuto dall'azienda */
  totalCompanyCost: number;
}

export interface SalaryBreakdown {
  /** Retribuzione Annua Lorda di partenza */
  ral: number;
  /** Contributi previdenziali INPS a carico dipendente (IVS 9.19% + eventuale 1% eccedenza) */
  inpsEmployee: number;
  /** Imponibile Fiscale su cui si calcolano IRPEF e Addizionali (RAL - INPS) */
  taxableIrpef: number;
  /** IRPEF Lorda calcolata prima delle detrazioni */
  grossIrpef: number;
  /** Detrazioni fiscali da lavoro dipendente (Art. 13 TUIR) */
  deductions: number;
  /** IRPEF Netta dovuta (max(0, grossIrpef - deductions)) */
  netIrpef: number;
  /** Addizionale Regionale (Regione Lombardia) */
  regionalTax: number;
  /** Addizionale Comunale (Comune di Milano, 0.8% con esenzione fino a 23.000€) */
  municipalTax: number;
  /** Totale complessivo trattenute (INPS + IRPEF Netta + Add. Regionale + Add. Comunale) */
  totalTaxes: number;
  /** Stipendio Netto Annuale */
  netAnnual: number;
  /** Stipendio Netto Mensile (netAnnual / monthlyCount) */
  netMonthly: number;
  /** Pressione fiscale e contributiva effettiva in percentuale ((totalTaxes / ral) * 100) */
  effectiveTaxRate: number;
  /** Dettaglio e stima del costo complessivo per l'azienda (TFR + INPS ditta) */
  companyCost?: CompanyCostBreakdown;
}
