export type DrivingMix = "preval_citta" | "misto" | "preval_autostrada";
export type Patience = "bassa" | "media" | "alta";

export type UserProfile = {
  budgetEuro: number;
  kmPerDay: number;
  longTripsPerMonth: number;
  longTripKm: number;

  homeCharging: boolean;
  meterKw: number;
  wallboxPossible: boolean;

  drivingMix: DrivingMix;
  patience: Patience;

  homeEnergyEurKwh: number;
  publicEnergyEurKwh: number;

  hasIceCar: boolean;
  iceMonthlyFuelEuro?: number;
};

export type Recommendation = {
  category: string;
  batteryKwhRange: string;
  realRange: { cityKm: number; highwayKm: number };
  chargingStrategy: string[];
  monthlyCost: {
    kmMonth: number;
    kwhMonth: number;
    homeSharePct: number;
    estEuro: number;
    iceComparisonEuro?: number;
    deltaVsIceEuro?: number;
  };
  checklist: string[];
  assumptions: string[];
};