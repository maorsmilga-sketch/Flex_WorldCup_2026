import { PHASE1_LOCK_ISO, PHASE2_LOCK_ISO } from "./constants";

const phase1Lock = new Date(PHASE1_LOCK_ISO);
const phase2Lock = new Date(PHASE2_LOCK_ISO);

export function getPhase1LockDate(): Date {
  return phase1Lock;
}

export function getPhase2LockDate(): Date {
  return phase2Lock;
}

export function isPhase1Locked(now: Date = new Date()): boolean {
  return now.getTime() >= phase1Lock.getTime();
}

export function isPhase2Locked(now: Date = new Date()): boolean {
  return now.getTime() >= phase2Lock.getTime();
}
