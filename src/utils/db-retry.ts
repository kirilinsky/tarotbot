const RETRYABLE_CODES = new Set(["57P03", "08006", "08001", "08004", "ECONNRESET", "ECONNREFUSED"]);
const MAX_ATTEMPTS = 3;
const DELAY_MS = 1500;

function isRetryable(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as Record<string, unknown>;
  return (
    RETRYABLE_CODES.has(e.code as string) ||
    RETRYABLE_CODES.has(e.errno as string)
  );
}

export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!isRetryable(err) || attempt === MAX_ATTEMPTS) throw err;
      await new Promise((r) => setTimeout(r, DELAY_MS * attempt));
    }
  }
  throw lastErr;
}
