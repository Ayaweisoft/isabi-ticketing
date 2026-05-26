import { checkTicket } from "../adapters/CommonAdapter";

// Excludes visually ambiguous chars: I, O, 1, 0
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAX_ATTEMPTS = 10;

// crypto.getRandomValues gives uniform distribution: CHARSET.length (32) = 2^5, divides 2^32 exactly
const randomChar = () => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return CHARSET[buf[0] % CHARSET.length];
};

// NOTE: uniqueness is checked via a server round-trip, which cannot prevent a race condition
// between two simultaneous purchases generating the same ID. A server-side atomic ID
// generation endpoint is the only complete fix.
export const generateTicketId = async (len, event_id) => {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const id = Array.from({ length: len }, randomChar).join('');

    try {
      await checkTicket({ ticketId: id, eventId: event_id });
      // 200 → ticket exists, try a new ID
    } catch (err) {
      if (err?.response?.status === 404) return id; // confirmed free
      throw err; // network error or server error — don't silently accept
    }
  }

  throw new Error('Could not generate a unique ticket ID. Please try again.');
};

export default generateTicketId;
