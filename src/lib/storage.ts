import { DEFAULT_PROFILE } from "./defaults";
import { Recommendation, UserProfile } from "./types";

const KEY_PROFILE = "evb_profile_v1";
const KEY_RESULT = "evb_result_v1";

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(KEY_PROFILE);
    return raw ? (JSON.parse(raw) as UserProfile) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(p: UserProfile) {
  localStorage.setItem(KEY_PROFILE, JSON.stringify(p));
}

export function loadResult(): Recommendation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_RESULT);
    return raw ? (JSON.parse(raw) as Recommendation) : null;
  } catch {
    return null;
  }
}

export function saveResult(r: Recommendation) {
  localStorage.setItem(KEY_RESULT, JSON.stringify(r));
}

export function resetAll() {
  localStorage.removeItem(KEY_PROFILE);
  localStorage.removeItem(KEY_RESULT);
}