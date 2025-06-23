export function getTimeOfDay(): "morning" | "day" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour < 10) return "morning";
  if (hour < 17) return "day";
  if (hour < 22) return "evening";
  return "night";
}
