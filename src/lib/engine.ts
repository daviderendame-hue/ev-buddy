import { CATEGORIES } from "./content";
import { Recommendation, UserProfile } from "./types";

function mixFactor(drivingMix: UserProfile["drivingMix"]) {
  if (drivingMix === "preval_citta") return { city: 0.75, highway: 0.25 };
  if (drivingMix === "preval_autostrada") return { city: 0.35, highway: 0.65 };
  return { city: 0.55, highway: 0.45 };
}

function pickCategory(p: UserProfile) {
  const long = p.longTripKm >= 400 || p.longTripsPerMonth >= 3;
  const daily = p.kmPerDay >= 70;

  if (p.budgetEuro <= 22000 && !long) return "city";
  if ((long || daily) && p.budgetEuro >= 26000) return "compact";
  if (p.budgetEuro >= 38000 && (long || daily)) return "suv";
  return long ? "compact" : "city";
}

function batteryBand(requiredKwh: number) {
  if (requiredKwh <= 32) return "30–45 kWh";
  if (requiredKwh <= 48) return "45–60 kWh";
  if (requiredKwh <= 64) return "60–80 kWh";
  return "80+ kWh";
}

function publicShareFrom(p: UserProfile) {
  if (!p.homeCharging) return p.patience === "alta" ? 0.85 : p.patience === "media" ? 0.92 : 0.98;
  if (p.patience === "alta") return 0.15;
  if (p.patience === "media") return 0.25;
  return 0.35;
}

export function recommend(p: UserProfile): Recommendation {
  const key = pickCategory(p);
  const cat = CATEGORIES.find((c: any) => c.key === key) ?? CATEGORIES[0];

  const w = mixFactor(p.drivingMix);
  const consCity = cat.baseConsumption.city;     // kWh/100
  const consHwy = cat.baseConsumption.highway;   // kWh/100
  const consMixed = consCity * w.city + consHwy * w.highway;

  const assumedUsableKwh = key === "city" ? 42 : key === "compact" ? 58 : 75;
  const realCityKm = Math.round((assumedUsableKwh / consCity) * 100);
  const realHwyKm  = Math.round((assumedUsableKwh / consHwy) * 100);

  const winterBuffer = 1.15;
  const arrivalReserve = 0.15;
  const energyForTrip = (p.longTripKm * consHwy * winterBuffer) / 100;
  const requiredKwh = energyForTrip / (1 - arrivalReserve);
  const band = batteryBand(requiredKwh);

  const publicShare = publicShareFrom(p);
  const homeShare = 1 - publicShare;

  const kmMonth = p.kmPerDay * 30;
  const kwhMonth = (kmMonth * consMixed) / 100;

  const estEuro = kwhMonth * (homeShare * p.homeEnergyEurKwh + publicShare * p.publicEnergyEurKwh);

  const iceComparisonEuro = p.hasIceCar ? p.iceMonthlyFuelEuro : undefined;
  const deltaVsIceEuro = iceComparisonEuro !== undefined ? Math.round(iceComparisonEuro - estEuro) : undefined;

  const chargingStrategy: string[] = [];
  if (p.homeCharging) {
    chargingStrategy.push(`Casa: ${p.wallboxPossible ? "wallbox" : "presa"} (contatore ${p.meterKw} kW).`);
    chargingStrategy.push(homeShare >= 0.7 ? "Ottimo: farai la maggior parte delle ricariche a casa." : "Ok: casa + un po’ di pubblico.");
  } else {
    chargingStrategy.push("Niente ricarica a casa: pianifica AC vicino a casa/lavoro + DC per viaggi.");
  }

  return {
    category: cat.name,
    batteryKwhRange: band,
    realRange: { cityKm: realCityKm, highwayKm: realHwyKm },
    chargingStrategy,
    monthlyCost: {
      kmMonth,
      kwhMonth: Math.round(kwhMonth),
      homeSharePct: Math.round(homeShare * 100),
      estEuro: Math.round(estEuro),
      iceComparisonEuro,
      deltaVsIceEuro
    },
    checklist: [
      "Decidi dove ricarichi nel 70% dei casi (casa / vicino casa / lavoro).",
      "Imposta prezzi energia reali in Impostazioni.",
      "Se fai autostrada: privilegia efficienza e ricarica DC valida.",
      "Fai una prova reale: un viaggio + una ricarica. Ti togli i dubbi subito."
    ],
    assumptions: [
      `Consumi categoria: città ${consCity} / autostrada ${consHwy} kWh/100km.`,
      "Viaggio lungo: buffer inverno 15% + riserva arrivo 15%.",
      "Stime: non sono dati del singolo modello."
    ]
  };
}