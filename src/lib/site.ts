/**
 * Company contact details and external links — the only place they live.
 * A link set to `null` is hidden everywhere until a real value exists.
 */
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://afaq-website-ten.vercel.app",
  bookingUrl: "https://calendly.com/afaq-ai-team/30min",
  // TODO: switch to a domain address (e.g. hello@<domain>) once the domain is bought.
  email: "afaq.ai.team@gmail.com",
  // Hidden until confirmed: the old number (201500877290) opens a WhatsApp
  // Business profile named "Waqar", not Afaq AI.
  whatsapp: null as string | null,
  socials: {
    facebook: "https://www.facebook.com/share/1bBoJGiTi7/",
    linkedin: null as string | null,
  },
} as const;

export const whatsappUrl = (number: string) => `https://wa.me/${number}`;
