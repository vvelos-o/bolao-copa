export function calculatePoints(predHome: number, predAway: number, actualHome: number, actualAway: number): number {
  if (predHome === actualHome && predAway === actualAway) return 25;
  if (Math.sign(predHome - predAway) === Math.sign(actualHome - actualAway)) return 10;
  return 0;
}
export function isMatchLocked(kickoff: string): boolean {
  return Date.now() >= new Date(kickoff).getTime() - 30 * 60 * 1000;
}
export function isRegistrationOpen(firstMatchKickoff: string): boolean {
  return Date.now() < new Date(firstMatchKickoff).getTime() - 24 * 60 * 60 * 1000;
}
