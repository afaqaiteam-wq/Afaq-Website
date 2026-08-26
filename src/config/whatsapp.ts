/**
 * WhatsApp contact configuration — shared by the floating WhatsApp button
 * and the Footer's "Let's Talk" column, so there is exactly one place that
 * knows the real number. wa.me requires the bare international-format
 * number: no leading "+", spaces, dashes or parentheses.
 */
export const WHATSAPP_NUMBER = "201500877290";

/** Human-readable form for display only — never used in the URL itself. */
export const WHATSAPP_DISPLAY = "+20 1500877290";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
