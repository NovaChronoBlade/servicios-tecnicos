import axios from 'axios';

function extractMessages(data: unknown) {
  const messages: string[] = [];

  if (!data || typeof data !== 'object') return messages;

  const payload = data as Record<string, unknown>;
  const candidates = [payload.message, payload.error, payload.errors];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      messages.push(candidate.trim());
    }

    if (Array.isArray(candidate)) {
      for (const entry of candidate) {
        if (typeof entry === 'string' && entry.trim()) {
          messages.push(entry.trim());
        } else if (entry && typeof entry === 'object') {
          const entryObject = entry as Record<string, unknown>;
          if (typeof entryObject.message === 'string' && entryObject.message.trim()) {
            messages.push(entryObject.message.trim());
          }
        }
      }
    }
  }

  return messages;
}

export function getApiErrorMessage(error: unknown, fallback = 'No se pudo completar la operacion') {
  if (axios.isAxiosError(error)) {
    const backendMessages = extractMessages(error.response?.data);
    if (backendMessages.length > 0) return backendMessages.join('. ');
    if (error.message) return error.message;
  }

  if (error instanceof Error && error.message.trim()) return error.message;

  return fallback;
}
