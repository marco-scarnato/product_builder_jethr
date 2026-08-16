import React, { useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  MapPin,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Scale,
  Sparkles,
} from 'lucide-react';

export interface AssumptionsModalProps {
  /** Stato di apertura del modale */
  isOpen: boolean;
  /** Callback per chiudere il modale */
  onClose: () => void;
}

export const AssumptionsModal: React.FC<AssumptionsModalProps> = ({ isOpen, onClose }) => {
  // Chiusura con tasto Escape e blocco dello scroll della pagina
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const assumptionsList = [
    {
      id: 'contract',
      title: 'Inquadramento Contrattuale',
      icon: Building2,
      badge: 'CCNL Standard',
      description:
        'Lavoratore dipendente impiegato a tempo indeterminato del settore terziario / commercio / servizi, assunto a tempo pieno (365 giorni/anno).',
    },
    {
      id: 'location',
      title: 'Residenza Fiscale: Milano (Lombardia)',
      icon: MapPin,
      badge: 'Addizionali Locali',
      description:
        'Applicazione dell’Addizionale Regionale Lombardia (aliquote progressive da 1,23% a 1,73%) e dell’Addizionale Comunale di Milano fissa allo 0,80% con franchigia totale di esenzione fino a 23.000 € di imponibile.',
    },
    {
      id: 'inps',
      title: 'Contributi Previdenziali INPS (IVS)',
      icon: ShieldCheck,
      badge: '9.19% Dipendente',
      description:
        'Aliquota contributiva a carico lavoratore del 9,19% sulla RAL, con applicazione dell’aliquota di solidarietà aggiuntiva dell’1% sull’eccedenza oltre la prima fascia pensionabile (€55.008).',
    },
    {
      id: 'irpef',
      title: 'Scaglioni IRPEF e Detrazioni TUIR',
      icon: Scale,
      badge: 'Art. 13 TUIR',
      description:
        'Calcolo IRPEF progressivo a 3 scaglioni (23% fino a 28k€, 33% tra 28k€ e 50k€, 43% oltre 50k€) con formule esatte delle detrazioni fiscali da lavoro dipendente decrescenti.',
    },
    {
      id: 'exclusions',
      title: 'Assunzioni di Base ed Esclusioni',
      icon: AlertCircle,
      badge: 'Scenario Puro',
      description:
        'Nessun familiare o figlio a carico, assenza di fringe benefit o rimborsi spese forfettari, e nessuna agevolazione fiscale speciale applicata (es. Rientro dei Cervelli / Impatriati).',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assumptions-title"
    >
      {/* Backdrop con effetto blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenitore Modale */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-8 transition-all">
        {/* Header Modale */}
        <div className="flex items-center justify-between p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <div>
              <h3 id="assumptions-title" className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Note Metodologiche & Assunzioni
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Logiche e riferimenti normativi alla base delle proiezioni
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Chiudi finestra informativa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo con Elenco Assunzioni */}
        <div className="p-6 sm:p-7 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              Questo calcolatore è stato progettato per offrire una stima affidabile e trasparente della retribuzione netta per un caso dipendente standard, evidenziando ogni singola trattenuta.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {assumptionsList.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start gap-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <span className="p-2 rounded-xl bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs border border-slate-200/60 dark:border-slate-700/60 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{item.title}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Modale */}
        <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            Ispirato agli standard di trasparenza Jet HR
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-98 transition-all"
          >
            Ho capito, chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
