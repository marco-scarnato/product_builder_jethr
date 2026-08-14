/**
 * Formatta un valore numerico come valuta Euro (€) in standard italiano (es. 35.000 € o 1.914,60 €).
 */
export function formatCurrency(value: number, includeDecimals = true): string {
  if (isNaN(value) || !isFinite(value)) return '0 €';

  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(value);
}

/**
 * Formatta un numero intero con separatori delle migliaia italiani (es. 35.000).
 */
export function formatNumber(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0';

  return new Intl.NumberFormat('it-IT', {
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formatta una percentuale (es. 28.89%).
 */
export function formatPercent(value: number, decimals = 1): string {
  if (isNaN(value) || !isFinite(value)) return '0%';

  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value) + '%';
}
