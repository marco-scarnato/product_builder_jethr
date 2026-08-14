# 💼 Jet HR — Salary & Tax Calculator Prototype

> Prototipo interattivo di calcolo e proiezione dello stipendio netto a partire dalla Retribuzione Annua Lorda (RAL), con dettaglio trasparente di tutte le trattenute fiscali e previdenziali (INPS, IRPEF, Addizionali regionali e comunali).

---

## 🎯 Obiettivo del Progetto

Costruire un calcolatore standalone e reattivo che riceve in input una **RAL** e restituisce in output:
- **Netto Annuale** e **Netto Mensile** (su 13 o 14 mensilità).
- **Trattenute Previdenziali (INPS IVS)**.
- **Trattenute Fiscali (IRPEF Netta)** con calcolo delle detrazioni da lavoro dipendente.
- **Addizionali Regionali e Comunali** per il comune di **Milano (Lombardia)**.
- **Breakdown analitico e visivo** di ogni singola voce trattenuta dal lordo.

---

## 📌 Ipotesi e Semplificazioni di Scenario

Come da specifiche di assessment, per mantenere il prototipo chiaro ed efficace sono state adottate le seguenti assunzioni standard:

- **Tipologia contrattuale**: Lavoratore dipendente impiegato a tempo indeterminato (CCNL standard commercio/terziario).
- **Residenza fiscale**: Milano (Regione Lombardia).
- **Agevolazioni particolari**: Nessuna agevolazione fiscale specifica applicata (es. no rientro cervelli, no carichi familiari).
- **Annualità fiscale**: Calcolo sull'anno solare pieno con aliquote e scaglioni IRPEF vigenti.

---

## 🧭 Criteri di Valutazione del Test

1. **Ricerca e accuratezza**: Capacità di reperire e applicare correttamente le regole e aliquote fiscali/previdenziali italiane.
2. **Struttura architetturale**: Separazione tra motore logico di calcolo (*pure TypeScript*) e interfaccia utente (*React*).
3. **Qualità del prototipo**: UI/UX curata, reattività immediata e facilità di lettura per l'utente finale.

---

## 📂 Struttura del Progetto & Documentazione di Sessione

```
product_builder_jethr/
├── .antigravity/             # Documentazione di contesto e sessione
│   ├── CONTEXT.md            # Modello fiscale dettagliato (INPS, IRPEF, detrazioni, Milano)
│   ├── ARCHITECTURE.md       # Architettura tecnica e separazione engine/UI
│   └── TODO.md               # Roadmap di implementazione a milestone
├── src/                      # Codice sorgente React + TypeScript
│   ├── core/tax-engine/      # (In sviluppo) Motore logico di calcolo puro
│   ├── components/           # (In sviluppo) Componenti UI, grafici, form e cedolino
│   ├── index.css             # Setup Tailwind CSS
│   ├── App.tsx               # Entrypoint applicazione
│   └── main.tsx              # Bootstrap React
├── package.json              # Dipendenze e script npm
├── tailwind.config.js        # Configurazione Tailwind CSS
├── postcss.config.js         # Configurazione PostCSS
├── vite.config.ts            # Configurazione Vite
└── README.md                 # Documentazione del progetto
```

---

## 🛠️ Comandi Utilizzati per la Configurazione Iniziale

I seguenti comandi sono stati eseguiti per creare lo scaffolding e configurare l'intero ambiente di sviluppo:

### 1. Inizializzazione del Progetto Vite + React + TypeScript
```bash
# Inizializzazione dello scaffolding con Vite e template TypeScript
npx -y create-vite@latest . --template react-ts
```

### 2. Installazione delle Dipendenze di Base e UI
```bash
# Installazione pacchetti runtime e di supporto
npm install

# Installazione Tailwind CSS v3 e strumenti PostCSS
npm install -D tailwindcss@^3.4.17 postcss autoprefixer

# Installazione librerie UI: icone Lucide e utility per la gestione delle classi
npm install lucide-react clsx tailwind-merge
```

### 3. Configurazione di Tailwind e Stili
- Creato `tailwind.config.js` con i content path per `./index.html` e `./src/**/*.{js,ts,jsx,tsx}`.
- Creato `postcss.config.js` per abilitare i plugin Tailwind e Autoprefixer.
- Configurato `src/index.css` con le direttive `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`.

### 4. Setup `.gitignore` e File di Contesto
- Creato `.gitignore` completo per escludere `node_modules`, `dist`, `.env*`, log e cache di build.
- Creata la cartella `.antigravity/` contenente `CONTEXT.md`, `ARCHITECTURE.md` e `TODO.md`.

---

## 🚀 Comandi per Avviare e Utilizzare il Progetto

Per eseguire, sviluppare e compilare il progetto in locale, utilizza i seguenti comandi:

### 1. Avvio del Server di Sviluppo (Dev Mode con Hot Reload)
```bash
npm run dev
```
> Il server locale si avvierà su `http://localhost:5173/` (o sulla porta indicata nel terminale).

### 2. Verifica e Compilazione per la Produzione (Build)
```bash
npm run build
```
> Esegue il type check TypeScript (`tsc -b`) e genera il bundle ottimizzato nella cartella `dist/`.

### 3. Anteprima del Bundle di Produzione in Locale
```bash
npm run preview
```
> Avvia un server web locale per testare la build presente in `dist/`.

### 4. Linting del Codice
```bash
npm run lint
```