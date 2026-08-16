import { useState, useMemo, useCallback, useEffect } from 'react';
import type { SalaryBreakdown, SalaryInput } from '../types/salary';
import { calculateSalary } from '../core/engine';
import { getSalaryStateFromUrl, syncSalaryStateToUrl } from '../utils/urlState';

export interface UseSalaryCalculatorOptions {
  /** Valore RAL iniziale in Euro (default: 35.000 € o da URL) */
  initialRal?: number;
  /** Numero iniziale di mensilità (default: 13 o da URL) */
  initialMonthlyCount?: 13 | 14;
  /** Regime speciale iniziale (default: false) */
  initialHasSpecialRegime?: boolean;
}

export interface UseSalaryCalculatorReturn {
  /** Valore numerico corrente della RAL */
  ral: number;
  /** Numero di mensilità selezionate (13 o 14) */
  monthlyCount: 13 | 14;
  /** Flag opzionale regime agevolato */
  hasSpecialRegime: boolean;
  /** Dettaglio completo e istantaneo delle trattenute e dei netti */
  breakdown: SalaryBreakdown;
  /** Helper per aggiornare la RAL accettando sia numeri che stringhe formattate */
  handleRalChange: (raw: string | number) => void;
  /** Helper per impostare direttamente un valore di preset */
  setPreset: (value: number) => void;
  /** Helper per alternare tra 13 e 14 mensilità */
  toggleMonthlyCount: () => void;
  /** Helper per impostare esplicitamente il numero di mensilità */
  setMonthlyCount: (count: 13 | 14) => void;
  /** Helper diretto per impostare la RAL numerica */
  setRal: (value: number) => void;
  /** Helper per abilitare/disabilitare regimi speciali */
  setHasSpecialRegime: (enabled: boolean) => void;
}

const DEFAULT_RAL = 35000;
const DEFAULT_MONTHLY_COUNT: 13 | 14 = 13;

/**
 * Pulisce e converte una stringa o un numero in un valore numerico valido per la RAL.
 */
export function parseRalInput(raw: string | number): number {
  if (typeof raw === 'number') {
    if (isNaN(raw) || !isFinite(raw) || raw < 0) {
      return 0;
    }
    return Math.round(raw);
  }

  if (typeof raw === 'string') {
    // Rimuove spazi, simboli di valuta, separatori di migliaia
    const cleaned = raw
      .replace(/[€\s_]/g, '')
      .replace(/\.(?=\d{3}(,|$|\D))/g, '') // rimuove i punti delle migliaia
      .replace(',', '.'); // converte la virgola decimale in punto

    const parsed = parseFloat(cleaned);
    if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) {
      return 0;
    }
    return Math.round(parsed);
  }

  return 0;
}

/**
 * Custom hook per la gestione dello stato reattivo e del calcolo dello stipendio netto,
 * con sincronizzazione automatica dei parametri nell'URL (?ral=45000&mensilita=13).
 */
export function useSalaryCalculator(options: UseSalaryCalculatorOptions = {}): UseSalaryCalculatorReturn {
  const {
    initialRal = DEFAULT_RAL,
    initialMonthlyCount = DEFAULT_MONTHLY_COUNT,
    initialHasSpecialRegime = false,
  } = options;

  // Inizializza lo stato leggendo prima dai query params dell'URL (zero-flicker)
  const [ral, setRalState] = useState<number>(() => {
    const urlState = getSalaryStateFromUrl();
    if (urlState.ral !== undefined) {
      return parseRalInput(urlState.ral);
    }
    return parseRalInput(initialRal);
  });

  const [monthlyCount, setMonthlyCount] = useState<13 | 14>(() => {
    const urlState = getSalaryStateFromUrl();
    if (urlState.monthlyCount !== undefined) {
      return urlState.monthlyCount;
    }
    return initialMonthlyCount === 14 ? 14 : 13;
  });

  const [hasSpecialRegime, setHasSpecialRegime] = useState<boolean>(initialHasSpecialRegime);

  // Sincronizza lo stato con l'URL ad ogni modifica tramite window.history.replaceState
  useEffect(() => {
    syncSalaryStateToUrl({ ral, monthlyCount });
  }, [ral, monthlyCount]);

  // Ascolta gli eventi popstate per supportare la cronologia del browser (Avanti/Indietro)
  useEffect(() => {
    const handlePopState = () => {
      const urlState = getSalaryStateFromUrl();
      if (urlState.ral !== undefined) {
        setRalState(urlState.ral);
      }
      if (urlState.monthlyCount !== undefined) {
        setMonthlyCount(urlState.monthlyCount);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Aggiornamento sicuro della RAL
  const setRal = useCallback((value: number) => {
    const validRal = parseRalInput(value);
    setRalState(validRal);
  }, []);

  // Gestione flessibile dell'input da stringhe/form/slider
  const handleRalChange = useCallback((raw: string | number) => {
    const parsed = parseRalInput(raw);
    setRalState(parsed);
  }, []);

  // Selezione rapida da bottoni preset
  const setPreset = useCallback((value: number) => {
    const validValue = parseRalInput(value);
    setRalState(validValue);
  }, []);

  // Switch tra 13esima e 14esima
  const toggleMonthlyCount = useCallback(() => {
    setMonthlyCount((prev) => (prev === 13 ? 14 : 13));
  }, []);

  // Ricalcolo istantaneo del breakdown fiscale tramite useMemo
  const breakdown = useMemo<SalaryBreakdown>(() => {
    const input: SalaryInput = {
      ral,
      monthlyCount,
      hasSpecialRegime,
    };
    return calculateSalary(input);
  }, [ral, monthlyCount, hasSpecialRegime]);

  return {
    ral,
    monthlyCount,
    hasSpecialRegime,
    breakdown,
    handleRalChange,
    setPreset,
    toggleMonthlyCount,
    setMonthlyCount,
    setRal,
    setHasSpecialRegime,
  };
}
