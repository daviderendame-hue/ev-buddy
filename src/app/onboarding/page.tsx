// FILE: src/app/onboarding/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Header from "../../components/Header";
import Card from "../../components/Card";
import Progress from "../../components/Progress";
import { loadProfile, saveProfile, saveResult } from "../../lib/storage";
import { recommend } from "../../lib/engine";
import { DrivingMix, Patience, UserProfile } from "../../lib/types";
import { useRouter } from "next/navigation";

type StepId =
  | "budgetEuro"
  | "kmPerDay"
  | "longTripsPerMonth"
  | "longTripKm"
  | "homeCharging"
  | "meterKw"
  | "wallboxPossible"
  | "drivingMix"
  | "patience"
  | "homeEnergyEurKwh"
  | "publicEnergyEurKwh"
  | "hasIceCar"
  | "iceMonthlyFuelEuro";

type Step = {
  id: StepId;
  title: string;
  help?: string;
  render: (p: UserProfile, setP: (fn: (x: UserProfile) => UserProfile) => void) => React.ReactNode;
  validate?: (p: UserProfile) => string | null; // ritorna errore se non valido
};

function clampNum(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export default function OnboardingPage() {
  const router = useRouter();
  const [p, setP] = useState<UserProfile>(() => loadProfile());
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const setProfile = (fn: (x: UserProfile) => UserProfile) => setP((prev) => fn(prev));

  const stepsAll: Step[] = useMemo(() => {
    const numField = (label: string, value: number, onChange: (v: number) => void, opts?: { step?: number; min?: number; max?: number }) => (
      <div className="field">
        <label>{label}</label>
        <input
          type="number"
          value={value}
          step={opts?.step ?? 1}
          onChange={(e) => onChange(Number(e.target.value))}
          min={opts?.min}
          max={opts?.max}
        />
      </div>
    );

    const selectField = <T extends string,>(label: string, value: T, options: { value: T; label: string }[], onChange: (v: T) => void) => (
      <div className="field">
        <label>{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value as T)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );

    return [
      {
        id: "budgetEuro",
        title: "Budget auto",
        help: "Non serve essere precisi al centesimo: ci basta capire la fascia.",
        render: (p, setP) =>
          numField("Budget (€)", p.budgetEuro, (v) => setP((x) => ({ ...x, budgetEuro: clampNum(v, 0, 200000) })), { step: 500, min: 0 }),
        validate: (p) => (p.budgetEuro >= 0 ? null : "Inserisci un budget valido."),
      },
      {
        id: "kmPerDay",
        title: "Km medi al giorno",
        help: "È il dato che influenza di più la tua spesa e quanto spesso ricarichi.",
        render: (p, setP) =>
          numField("Km al giorno", p.kmPerDay, (v) => setP((x) => ({ ...x, kmPerDay: clampNum(v, 0, 1000) })), { step: 1, min: 0 }),
        validate: (p) => (p.kmPerDay >= 0 ? null : "Inserisci km/giorno validi."),
      },
      {
        id: "longTripsPerMonth",
        title: "Viaggi lunghi al mese",
        help: "Esempio: autostrada, gite fuori porta, lavoro fuori città.",
        render: (p, setP) =>
          numField("Viaggi lunghi / mese", p.longTripsPerMonth, (v) => setP((x) => ({ ...x, longTripsPerMonth: clampNum(v, 0, 60) })), {
            step: 1,
            min: 0,
          }),
      },
      {
        id: "longTripKm",
        title: "Distanza tipica del viaggio lungo",
        help: "Quanti km fai di solito in un ‘viaggio lungo’ (solo andata).",
        render: (p, setP) =>
          numField("Km viaggio lungo", p.longTripKm, (v) => setP((x) => ({ ...x, longTripKm: clampNum(v, 0, 2000) })), { step: 10, min: 0 }),
      },
      {
        id: "homeCharging",
        title: "Ricarica a casa",
        help: "È la differenza tra ‘comodissimo’ e ‘devo pianificare’ 😄",
        render: (p, setP) =>
          selectField("Puoi ricaricare a casa?", String(p.homeCharging) as any, [
            { value: "true" as any, label: "Sì" },
            { value: "false" as any, label: "No" },
          ], (v) => setP((x) => ({ ...x, homeCharging: v === "true" }))),
      },
      {
        id: "meterKw",
        title: "Potenza contatore",
        help: "Con 3 kW si fa, ma devi gestire gli altri consumi. Con 6 kW vivi più sereno.",
        render: (p, setP) =>
          numField("Contatore (kW)", p.meterKw, (v) => setP((x) => ({ ...x, meterKw: clampNum(v, 1.5, 15) })), { step: 0.5, min: 1.5 }),
        validate: (p) => (p.meterKw >= 1.5 ? null : "Inserisci un valore ≥ 1.5 kW."),
      },
      {
        id: "wallboxPossible",
        title: "Wallbox possibile?",
        help: "Se sei in condominio: ‘possibile’ = tecnicamente e con permessi gestibili.",
        render: (p, setP) =>
          selectField("Wallbox possibile?", String(p.wallboxPossible) as any, [
            { value: "true" as any, label: "Sì" },
            { value: "false" as any, label: "No" },
          ], (v) => setP((x) => ({ ...x, wallboxPossible: v === "true" }))),
      },
      {
        id: "drivingMix",
        title: "Tipo di utilizzo",
        help: "Autostrada = consumi più alti e autonomia più bassa. Città = più efficiente.",
        render: (p, setP) =>
          selectField<DrivingMix>("Uso prevalente", p.drivingMix, [
            { value: "preval_citta", label: "Prevalenza città" },
            { value: "misto", label: "Misto" },
            { value: "preval_autostrada", label: "Prevalenza autostrada" },
          ], (v) => setP((x) => ({ ...x, drivingMix: v }))),
      },
      {
        id: "patience",
        title: "Pazienza con le ricariche",
        help: "Bassa = vuoi soste brevi e pochi sbatti. Alta = ti adatti facilmente.",
        render: (p, setP) =>
          selectField<Patience>("Pazienza", p.patience, [
            { value: "bassa", label: "Bassa (soste brevi)" },
            { value: "media", label: "Media (ok flessibilità)" },
            { value: "alta", label: "Alta (mi adatto)" },
          ], (v) => setP((x) => ({ ...x, patience: v }))),
      },
      {
        id: "homeEnergyEurKwh",
        title: "Prezzo energia a casa",
        help: "Metti un valore realistico: cambia parecchio il conto finale.",
        render: (p, setP) =>
          numField("€/kWh casa", p.homeEnergyEurKwh, (v) => setP((x) => ({ ...x, homeEnergyEurKwh: clampNum(v, 0.05, 2) })), {
            step: 0.01,
            min: 0.05,
          }),
      },
      {
        id: "publicEnergyEurKwh",
        title: "Prezzo colonnine",
        help: "Se usi spesso ricariche rapide (HPC), tende ad essere più alto.",
        render: (p, setP) =>
          numField("€/kWh colonnine", p.publicEnergyEurKwh, (v) => setP((x) => ({ ...x, publicEnergyEurKwh: clampNum(v, 0.05, 3) })), {
            step: 0.01,
            min: 0.05,
          }),
      },
      {
        id: "hasIceCar",
        title: "Confronto con auto termica",
        help: "Se metti la spesa carburante, ti faccio anche il delta €/mese.",
        render: (p, setP) =>
          selectField("Hai un’auto termica per confronto?", String(p.hasIceCar) as any, [
            { value: "true" as any, label: "Sì" },
            { value: "false" as any, label: "No" },
          ], (v) => setP((x) => ({ ...x, hasIceCar: v === "true" }))),
      },
      {
        id: "iceMonthlyFuelEuro",
        title: "Spesa carburante mensile",
        help: "Metti una media. Se non lo sai, fai una stima a spanne: meglio di niente.",
        render: (p, setP) =>
          numField(
            "€ carburante/mese",
            p.iceMonthlyFuelEuro ?? 0,
            (v) => setP((x) => ({ ...x, iceMonthlyFuelEuro: clampNum(v, 0, 5000) })),
            { step: 10, min: 0 }
          ),
      },
    ];
  }, []);

  // Steps "smart": meterKw & wallbox solo se homeCharging; fuel solo se hasIceCar
  const steps = useMemo(() => {
    const base: StepId[] = [
      "budgetEuro",
      "kmPerDay",
      "longTripsPerMonth",
      "longTripKm",
      "homeCharging",
      "drivingMix",
      "patience",
      "homeEnergyEurKwh",
      "publicEnergyEurKwh",
      "hasIceCar",
    ];

    const withHome: StepId[] = p.homeCharging ? ["meterKw", "wallboxPossible"] : [];
    const withFuel: StepId[] = p.hasIceCar ? ["iceMonthlyFuelEuro"] : [];

    // Inseriamo meterKw/wallbox subito dopo homeCharging
    const out: StepId[] = [];
    for (const id of base) {
      out.push(id);
      if (id === "homeCharging") out.push(...withHome);
      if (id === "hasIceCar") out.push(...withFuel);
    }

    return out.map((id) => stepsAll.find((s) => s.id === id)!).filter(Boolean);
  }, [p.homeCharging, p.hasIceCar, stepsAll]);

  // Se cambi una risposta e sparisce uno step, non vogliamo idx fuori range
  useEffect(() => {
    setIdx((i) => Math.min(i, Math.max(0, steps.length - 1)));
  }, [steps.length]);

  const current = steps[idx];
  const isLast = idx === steps.length - 1;

  function validateCurrent(): boolean {
    setError(null);
    const msg = current.validate?.(p) ?? null;
    if (msg) {
      setError(msg);
      return false;
    }
    return true;
  }

  function next() {
    if (!validateCurrent()) return;
    setIdx((i) => Math.min(i + 1, steps.length - 1));
  }

  function prev() {
    setError(null);
    setIdx((i) => Math.max(i - 1, 0));
  }

  function finish() {
    if (!validateCurrent()) return;

    const normalized: UserProfile = {
      ...p,
      iceMonthlyFuelEuro: p.hasIceCar && (p.iceMonthlyFuelEuro ?? 0) > 0 ? p.iceMonthlyFuelEuro : undefined,
    };

    saveProfile(normalized);
    saveResult(recommend(normalized));
    router.push("/results");
  }

  return (
    <>
      <Header />
      <Card title="Questionario (wizard smart)">
        <Progress step={idx + 1} total={steps.length} />

        <div className="wizardStepTitle">{current.title}</div>
        {current.help ? <div className="help">{current.help}</div> : null}

        <div className="spacer" />
        {current.render(p, setProfile)}

        {error ? (
          <>
            <div className="spacer" />
            <div className="small" style={{ color: "var(--bad)", fontWeight: 700 }}>
              {error}
            </div>
          </>
        ) : null}

        <div className="stepActions">
          <button className="btn secondary" onClick={prev} disabled={idx === 0}>
            Indietro
          </button>

          {!isLast ? (
            <button className="btn" onClick={next}>
              Avanti
            </button>
          ) : (
            <button className="btn" onClick={finish}>
              Calcola risultati
            </button>
          )}
        </div>

        <div className="hr" />
        <p className="small">Salviamo profilo + ultimo risultato solo sul tuo dispositivo (localStorage).</p>
      </Card>
    </>
  );
}