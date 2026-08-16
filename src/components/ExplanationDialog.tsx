import React, { useEffect } from 'react';
import { X, BookOpen, Calculator, Info } from 'lucide-react';
import type { ItemExplanation } from '../core/explanations';

export interface ExplanationDialogProps {
  /** Se il dialog è aperto */
  isOpen: boolean;
  /** Callback per chiudere */
  onClose: () => void;
  /** Dettaglio della voce selezionata */
  item: ItemExplanation | null;
}

export const ExplanationDialog: React.FC<ExplanationDialogProps> = ({
  isOpen,
  onClose,
  item,
}) => {
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

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explanation-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenuto Dialog */}
      <div className="relative w-full max-w-lg rounded-xl bg-white border border-neutral-200 shadow-xl overflow-hidden z-10 my-8">
        {/* Header Dialog */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
              <Info className="w-4 h-4" />
            </div>
            <h3
              id="explanation-dialog-title"
              className="text-base font-bold text-neutral-900 tracking-tight"
            >
              {item.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Chiudi dettaglio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo del Dialog */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Spiegazione in parole semplici */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
              Spiegazione
            </span>
            <p className="text-neutral-700 leading-relaxed font-medium">
              {item.explanation}
            </p>
          </div>

          {/* Formula e Passaggi Reali */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
              Formula & Passaggi di Calcolo
            </span>

            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-start gap-2">
                <Calculator className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-neutral-600">Formula applicata:</div>
                  <div className="font-mono text-xs font-bold text-neutral-900 mt-0.5">
                    {item.formula}
                  </div>
                </div>
              </div>

              <div className="pt-1.5 border-t border-neutral-200/60">
                <div className="text-[11px] font-bold text-neutral-600">Calcolo con i tuoi dati:</div>
                <div className="font-mono text-xs text-neutral-800 mt-0.5 whitespace-pre-line leading-relaxed">
                  {item.calculationSteps}
                </div>
              </div>
            </div>
          </div>

          {/* Box Grigio Chiaro con Fonte Ufficiale/Normativa */}
          <div className="pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
              Fonte Ufficiale / Normativa
            </span>

            <div className="p-3 rounded-lg bg-neutral-100 border border-neutral-200 flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-700 font-medium">
                {item.reference}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
