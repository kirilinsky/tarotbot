export function resolveGender(text: string, gender: "male" | "female"): string {
  text = text.replace(/\{([^|{}]+)\|([^|{}]+)\}/g, (_, m, f) =>
    gender === "male" ? m : f,
  );

  if (gender === "male") {
    text = text.replace(/им\((ой|ей)\)/g, "им");
    return text.replace(/\([^)]+\)/g, "");
  }

  text = text.replace(/им\((ой|ей)\)/g, "$1");
  return text.replace(/\(([^)]+)\)/g, "$1");
}
