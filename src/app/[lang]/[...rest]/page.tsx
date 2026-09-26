import { notFound } from "next/navigation";

/** Any URL without a real page renders the branded 404 with a 404 status. */
export default function CatchAll() {
  notFound();
}
