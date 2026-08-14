# Roadmap di Sviluppo & Task List

## Milestone 1: Setup dell'Ambiente e Scaffolding
- [x] Inizializzazione progetto React + TypeScript con Vite
- [x] Installazione dipendenze (`tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, `clsx`, `tailwind-merge`)
- [x] Configurazione `tailwind.config.js` e `src/index.css`
- [x] Configurazione `.gitignore` e file di contesto `.antigravity/` (`CONTEXT.md`, `ARCHITECTURE.md`, `TODO.md`)
- [x] Verifica build di base (`npm run build`)

---

## Milestone 2: Motore di Calcolo Fiscale (`src/core/` & `src/types/`)
- [x] Definizione tipi TypeScript per input (`SalaryInput`) e output (`SalaryBreakdown`) in `src/types/salary.ts`
- [x] Implementazione costanti fiscali e previdenziali in `src/core/constants.ts` (INPS, IRPEF 3 scaglioni, detrazioni Art. 13 TUIR, Lombardia/Milano)
- [x] Implementazione motore puro `calculateSalary()` in `src/core/engine.ts` (calcolo deterministico netto annuale/mensile, trattenute e stima costo azienda)
- [x] Verifica compilazione TypeScript e assenza errori di build

---

## Milestone 3: Componenti UI e Form di Input
- [x] Creazione utility `cn` e helper di formattazione valuta/percentuale (`src/utils/formatters.ts`)
- [x] Navbar e Hero Section in stile Jet HR (`src/components/Navbar.tsx`)
- [x] Form di input interattivo per la RAL (`src/components/SalaryInputForm.tsx`):
  - Input numerico formattato con valuta (€) e validazione
  - Slider rapido sincronizzato (10k€ - 120k€)
  - Quick-preset buttons (25k€, 35k€, 45k€, 60k€, 80k€)
  - Segmented control per selezione numero mensilità (13 vs 14)

---

## Milestone 4: Dashboard Risultati & Visual Breakdown
- [x] Card di riepilogo metriche chiave (`src/components/SalaryHeroCards.tsx`): Netto Mensile Hero, Netto Annuale, Totale Trattenute, Pressione Fiscale %
- [x] Grafico di breakdown visivo del lordo (`src/components/SalaryBreakdownBar.tsx`): stacked bar proporzionale con legenda interattiva
- [x] Tabella analitica dettagliata con riga per riga di ogni voce fiscale (`src/components/PayslipDetailsTable.tsx`)
- [x] Card prospettiva HR sul costo aziendale complessivo (`src/components/CompanyCostCard.tsx`)

---

## Milestone 5: Trasparenza Metodologica, Note e Polish Finale
- [x] Modale "Note metodologiche & Assunzioni" (`src/components/AssumptionsModal.tsx`) con riferimenti normativi per Milano
- [x] Disclaimer a piè di pagina e note di trasparenza (tempo indeterminato, Milano, no agevolazioni)
- [x] Layout responsive a 2 colonne (desktop) / colonna singola (mobile) in `src/App.tsx`
- [x] Build finale (`npm run build`) e linting (`oxlint`) verificati al 100% senza errori o warning
