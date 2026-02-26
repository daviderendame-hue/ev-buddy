"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Card from "../../components/Card";
import { loadProfile, resetAll, saveProfile } from "../../lib/storage";
import { UserProfile } from "../../lib/types";

export default function SettingsPage() {
  const [p, setP] = useState<UserProfile>(() => loadProfile());

  return (
    <>
      <Header />
      <Card title="Impostazioni">
        <div className="row">
          <div className="field">
            <label>Prezzo energia casa (€/kWh)</label>
            <input type="number" step="0.01" value={p.homeEnergyEurKwh} onChange={(e) => setP((x) => ({ ...x, homeEnergyEurKwh: Number(e.target.value) }))} />
          </div>

          <div className="field">
            <label>Prezzo colonnine (€/kWh)</label>
            <input type="number" step="0.01" value={p.publicEnergyEurKwh} onChange={(e) => setP((x) => ({ ...x, publicEnergyEurKwh: Number(e.target.value) }))} />
          </div>
        </div>

        <div className="spacer" />
        <div className="row">
          <button className="btn" onClick={() => { saveProfile(p); alert("Salvato."); }}>
            Salva
          </button>
          <button className="btn secondary" onClick={() => { if (confirm("Reset profilo e risultati. Sicuro?")) { resetAll(); window.location.href = "/"; } }}>
            Reset dati
          </button>
        </div>

        <div className="hr" />
        <p className="small">Privacy: profilo e risultati restano sul tuo dispositivo (localStorage).</p>
      </Card>
    </>
  );
}