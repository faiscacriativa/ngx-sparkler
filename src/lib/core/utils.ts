export function convertToUTCDate(date: Date): Date {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

export function getUTCTime(date: Date): number {
  return date.getTime() + date.getTimezoneOffset() * 60000;
}
