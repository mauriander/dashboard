export function getHourMinute(isoDateTime) {
  return isoDateTime.slice(11, 16);
}

export function getHour(isoDateTime) {
  return Number(isoDateTime.slice(11, 13));
}

export function getDayOfMonth(isoDate) {
  return isoDate.slice(8, 10);
}

export function getWeekdayName(isoDate, locale = "es-AR") {
  const date = new Date(`${isoDate}T00:00:00`);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}
