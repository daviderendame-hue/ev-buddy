import { UserProfile } from "./types";

export const DEFAULT_PROFILE: UserProfile = {
  budgetEuro: 25000,
  kmPerDay: 40,
  longTripsPerMonth: 2,
  longTripKm: 350,

  homeCharging: true,
  meterKw: 3,
  wallboxPossible: true,

  drivingMix: "misto",
  patience: "media",

  homeEnergyEurKwh: 0.25,
  publicEnergyEurKwh: 0.60,

  hasIceCar: true,
  iceMonthlyFuelEuro: 220
};