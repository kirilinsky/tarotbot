export function cleanEnv(value?: string) {
  if (!value) return "";
  return value?.replace(/^"|"$/g, "");
}
