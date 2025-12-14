export function toLocalDateString(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
}
