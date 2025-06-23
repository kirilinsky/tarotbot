export function getSeasonFromDate(
  date = new Date()
): "spring" | "summer" | "autumn" | "winter" {
  const month = date.getMonth() + 1;
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  if ([9, 10, 11].includes(month)) return "autumn";
  return "winter";
}
