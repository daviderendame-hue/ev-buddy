"use client";

import Header from "../../components/Header";
import Card from "../../components/Card";
import { loadProfile, loadResult } from "../../lib/storage";
import { recommend } from "../../lib/engine";

export default function ResultsPage() {
  const r = loadResult() ?? recommend(loadProfile());

  return (
    <>
      <Header />
      <Card title="Risultato personalizzato">
        <p className="small">Categoria consigliata</p>
        <div className="h2">{r.category}</div>

        <div className="hr" />

        <p className="small">Batteria consigliata</p>
        <div className="h2">{r.batteryKwhRange}</div>

        <p className="small">Autonomia realistica (stima)</p>
        <p className="p">Città ~{r.realRange.cityKm} km · Autostrada ~{r.realRange.highwayKm} km</p>

        <div className="hr" />

        <div className="h2">Strategia ricarica</div>
        <ul>
          {r.chargingStrategy.map((s, i) => (
            <li key={i} className="p">{s}</li>
          ))}
        </ul>

        <div className="hr" />

        <div className="h2">Costi mensili (stima)</div>
        <p className="p">
          {r.monthlyCost.kmMonth} km/mese · {r.monthlyCost.kwhMonth} kWh/mese · Casa {r.monthlyCost.homeSharePct}%
        </p>
        <p className="p"><b>~{r.monthlyCost.estEuro} €/mese</b></p>

        {r.monthlyCost.iceComparisonEuro !== undefined && (
          <p className="p">
            Termico: {r.monthlyCost.iceComparisonEuro} €/mese → Delta: <b>{r.monthlyCost.deltaVsIceEuro} €</b>
          </p>
        )}

        <div className="hr" />

        <div className="h2">Cosa fare domani</div>
        <ol>
          {r.checklist.map((s, i) => (
            <li key={i} className="p">{s}</li>
          ))}
        </ol>

        <div className="hr" />

        <div className="h2">Assunzioni</div>
        <ul>
          {r.assumptions.map((s, i) => (
            <li key={i} className="small">{s}</li>
          ))}
        </ul>
      </Card>
    </>
  );
}