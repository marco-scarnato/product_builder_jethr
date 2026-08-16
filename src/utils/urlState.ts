/**
 * Utility per la sincronizzazione bidirezionale tra lo stato del calcolatore e i parametri URL.
 * Permette la condivisibilità immediata delle simulazioni di stipendio.
 */

export interface UrlSalaryState {
  ral?: number;
  monthlyCount?: 13 | 14;
}

/**
 * Estrae e valida i parametri `ral` e `mensilita` dai query parameters dell'URL corrente.
 */
export function getSalaryStateFromUrl(): UrlSalaryState {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const result: UrlSalaryState = {};

    // Parsing e validazione RAL
    const ralParam = params.get('ral');
    if (ralParam !== null) {
      const parsedRal = parseInt(ralParam.replace(/\D/g, ''), 10);
      if (!isNaN(parsedRal) && parsedRal > 0 && parsedRal <= 10000000) {
        result.ral = parsedRal;
      }
    }

    // Parsing e validazione mensilità (supporta sia ?mensilita= che ?monthlyCount=)
    const monthlyParam = params.get('mensilita') || params.get('monthlyCount');
    if (monthlyParam === '13' || monthlyParam === '14') {
      result.monthlyCount = parseInt(monthlyParam, 10) as 13 | 14;
    }

    return result;
  } catch {
    return {};
  }
}

/**
 * Sincronizza lo stato corrente con l'URL della pagina tramite window.history.replaceState
 * senza ricaricare la pagina e senza inquinare la cronologia del browser.
 */
export function syncSalaryStateToUrl(state: { ral: number; monthlyCount: 13 | 14 }): void {
  if (typeof window === 'undefined' || !window.history || !window.history.replaceState) {
    return;
  }

  try {
    const params = new URLSearchParams(window.location.search);

    // Aggiorna o rimuove la RAL
    if (state.ral > 0) {
      params.set('ral', state.ral.toString());
    } else {
      params.delete('ral');
    }

    // Aggiorna il numero di mensilità
    if (state.monthlyCount === 13 || state.monthlyCount === 14) {
      params.set('mensilita', state.monthlyCount.toString());
    }

    // Se prima c'era monthlyCount legacy, rimuoviamolo per pulizia
    params.delete('monthlyCount');

    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}${window.location.hash}`
      : `${window.location.pathname}${window.location.hash}`;

    // Aggiorna la barra degli indirizzi solo se è cambiata
    if (window.location.pathname + window.location.search + window.location.hash !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  } catch {
    // Ignora eventuali errori in ambienti sandbox o restrittivi
  }
}

/**
 * Copia l'URL corrente con i parametri negli appunti dell'utente.
 */
export async function copyShareableLink(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const urlToCopy = window.location.href;
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(urlToCopy);
      return true;
    }

    // Fallback per browser datati o contesti non-secure
    const textarea = document.createElement('textarea');
    textarea.value = urlToCopy;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
}
