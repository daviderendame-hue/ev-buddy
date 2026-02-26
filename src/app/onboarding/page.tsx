"use client";

import { useState } from "react";
import Header from "../../components/Header";
import Card from "../../components/Card";
import { loadProfile, saveProfile, saveResult } from "../../lib/storage";
import { recommend } from "../../lib/engine";
import { UserProfile } from "../../lib/types";

export default function OnboardingPage() {
  const [p, setP] = useState<UserProfile>(() => loadProfile());

  const setNum = (k: keyof UserProfile) => (e: any) => setP((x) => ({ ...x, [k]: Number(e.target.value) as any }));
  const setBool = (k: keyof UserProfile) => (e: any) => setP((x) => ({ ...x, [k]: e.target.value === "true" as any }));
  const setStr = (k: keyof UserProfile) => (e: any) => setP((x) => ({ ...x, [k]: e.target.value as any }));

  function calcola() {
    const normalized: UserProfile = {
      ...p,
      iceMonthlyFuelEuro: p.hasIceCar && (p.iceMonthlyFuelEuro ?? 0) > 0 ? p.iceMonthlyFuelEuro : undefined
    };
    saveProfile(normalized);
    saveResult(recommend(normalized));
    window.location.href = "/results";
  }

  return (
    <>
      <Header />
      <Card title="Questionario (rapido)">
        <div className="formGrid">
          <div className="field">
            <label>Budget (€)</label>
            <input type="number" value={p.budgetEuro} onChange={setNum("budgetEuro")} />
          </div>

          <div className="field">
            <label>Km medi al giorno</label>
            <input type="number" value={p.kmPerDay} onChange={setNum("kmPerDay")} />
          </div>

          <div className="field">
            <label>Viaggi lunghi al mese</label>
            <input type="number" value={p.longTripsPerMonth} onChange={setNum("longTripsPerMonth")} />
          </div>

          <div className="field">
            <label>Km tipici viaggio lungo</label>
            <input type="number" value={p.longTripKm} onChange={setNum("longTripKm")} />
          </div>

          <div className="field">
            <label>Ricarica a casa?</label>
            <select value={String(p.homeCharging)} onChange={setBool("homeCharging")}>
              <option value="true">Sì</option>
              <option value="false">No</option>
            </select>
          </div>

          {p.homeCharging && (
            <>
              <div className="field">
                <label>Contatore (kW)</label>
                <input type="number" step="0.5" value={p.meterKw} onChange={setNum("meterKw")} />
              </div>

              <div className="field">
                <label>Wallbox possibile?</label>
                <select value={String(p.wallboxPossible)} onChange={setBool("wallboxPossible")}>
                  <option value="true">Sì</option>
                  <option value="false">No</option>
                </select>
              </div>
            </>
          )}

          <div className="field">
            <label>Uso</label>
            <select value={p.drivingMix} onChange={setStr("drivingMix")}>
              <option value="preval_citta">Prevalenza città</option>
              <option value="misto">Misto</option>
              <option value="preval_autostrada">Prevalenza autostrada</option>
            </select>
          </div>

          <div className="field">
            <label>Pazienza ricariche</label>
            <select value={p.patience} onChange={setStr("patience")}>
              <option value="bassa">Bassa</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="field">
            <label>Prezzo energia casa (€/kWh)</label>
            <input type="number" step="0.01" value={p.homeEnergyEurKwh} onChange={setNum("homeEnergyEurKwh")} />
          </div>

          <div className="field">
            <label>Prezzo colonnine (€/kWh)</label>
            <input type="number" step="0.01" value={p.publicEnergyEurKwh} onChange={setNum("publicEnergyEurKwh")} />
          </div>

          <div className="field">
            <label>Hai auto termica per confronto?</label>
            <select value={String(p.hasIceCar)} onChange={setBool("hasIceCar")}>
              <option value="true">Sì</option>
              <option value="false">No</option>
            </select>
          </div>

          {p.hasIceCar && (
            <div className="field">
              <label>Spesa carburante mensile (€)</label>
              <input
                type="number"
                value={p.iceMonthlyFuelEuro ?? 0}
                onChange={(e) => setP((x) => ({ ...x, iceMonthlyFuelEuro: Number(e.target.value) }))}
              />
            </div>
          )}
        </div>

        <div className="spacer" />
        <button className="btn" onClick={calcola}>Calcola risultati</button>
        <div className="hr" />
        <p className="small">Salviamo profilo + ultimo risultato solo sul tuo dispositivo (localStorage).</p>
      </Card>
    </>
  );
}