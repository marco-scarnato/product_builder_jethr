import { useSalaryCalculator } from './hooks/useSalaryCalculator';
import { SalaryInputForm } from './components/SalaryInputForm';
import { SalaryHeroCards } from './components/SalaryHeroCards';
import { PayslipDetailsTable } from './components/PayslipDetailsTable';
import { CompanyCostCard } from './components/CompanyCostCard';

export function App() {
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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
        {/* Form di Input RAL & Parametri */}
        <SalaryInputForm
          ral={ral}
          monthlyCount={monthlyCount}
          onRalChange={handleRalChange}
          onMonthlyCountChange={setMonthlyCount}
        />

        {/* Visualizzazione Pulita dei KPI (Netto Verde / Trattenute Rosso) */}
        <SalaryHeroCards
          breakdown={breakdown}
          monthlyCount={monthlyCount}
        />

        {/* Tabella Dettaglio Busta Paga con Icone Info Cliccabili */}
        <PayslipDetailsTable
          breakdown={breakdown}
          monthlyCount={monthlyCount}
        />

        {/* Costo Totale Datore di Lavoro (HR) */}
        <CompanyCostCard
          breakdown={breakdown}
        />
      </main>
    </div>
  );
}

export default App;
