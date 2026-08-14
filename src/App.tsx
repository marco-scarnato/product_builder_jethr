import { useState } from 'react';
import { useSalaryCalculator } from './hooks/useSalaryCalculator';
import { Navbar } from './components/Navbar';
import { SalaryInputForm } from './components/SalaryInputForm';
import { SalaryHeroCards } from './components/SalaryHeroCards';
import { SalaryBreakdownBar } from './components/SalaryBreakdownBar';
import { PayslipDetailsTable } from './components/PayslipDetailsTable';
import { CompanyCostCard } from './components/CompanyCostCard';
import { AssumptionsModal } from './components/AssumptionsModal';
import { ShieldCheck, Info } from 'lucide-react';

export function App() {
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState<boolean>(false);

  const {
    ral,
    monthlyCount,
    breakdown,
    handleRalChange,
    setMonthlyCount,
  } = useSalaryCalculator({
    initialRal: 35000,
    initialMonthlyCount: 13,
  });

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header / Navbar */}
      <Navbar onOpenAssumptions={() => setIsAssumptionsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Intro Hero Header */}
        <div className="mb-8 sm:mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Modello Fiscale Aggiornato • Milano (Lombardia)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Calcola il tuo Stipendio Netto
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Inserisci la tua retribuzione lorda annua (RAL) per visualizzare la proiezione del netto mensile e la ripartizione dettagliata di ogni voce trattenuta dal lordo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAssumptionsOpen(true)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors self-center sm:self-end pb-1"
          >
            <Info className="w-4 h-4" />
            <span>Come calcoliamo il netto?</span>
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Colonna Sinistra (Desktop: Sticky Form) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <SalaryInputForm
              ral={ral}
              monthlyCount={monthlyCount}
              onRalChange={handleRalChange}
              onMonthlyCountChange={setMonthlyCount}
            />
          </div>

          {/* Colonna Destra (Risultati, Grafico, Tabella, Costo Azienda) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* KPI Cards (Netto Mensile Hero + 3 Sub-Cards) */}
            <SalaryHeroCards
              breakdown={breakdown}
              monthlyCount={monthlyCount}
            />

            {/* Ripartizione Visiva del Lordo (Stacked Bar) */}
            <SalaryBreakdownBar
              breakdown={breakdown}
            />

            {/* Tabella Dettaglio Voci Busta Paga */}
            <PayslipDetailsTable
              breakdown={breakdown}
              monthlyCount={monthlyCount}
            />

            {/* Card Prospettiva HR / Costo Totale Azienda */}
            <CompanyCostCard
              breakdown={breakdown}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-8 px-4 sm:px-6 lg:px-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500 dark:text-slate-400">
          <p>
            Prototipo a scopo dimostrativo per la valutazione del case study{' '}
            <strong className="font-semibold text-slate-700 dark:text-slate-300">Jet HR</strong>.
            Calcoli basati su assunzioni standard (tempo indeterminato, Milano).
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsAssumptionsOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline underline-offset-4"
            >
              Note metodologiche & Assunzioni
            </button>
          </div>
        </div>
      </footer>

      {/* Modale Assunzioni & Metodologia */}
      <AssumptionsModal
        isOpen={isAssumptionsOpen}
        onClose={() => setIsAssumptionsOpen(false)}
      />
    </div>
  );
}

export default App;
