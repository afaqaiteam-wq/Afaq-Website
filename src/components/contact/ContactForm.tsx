"use client";

import { useId, useState, type FormEvent } from "react";

import { ArrowIcon } from "@/components/ui/Button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { contactSchema, type ContactErrorKey, type ContactField } from "@/lib/contact-schema";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<ContactField, ContactErrorKey>>;

interface ContactFormProps {
  lang: Locale;
  form: Dictionary["contact"]["form"];
  services: string[];
  bookCall: string;
}

const EMPTY = { name: "", email: "", company: "", service: "", message: "", website: "" };

export function ContactForm({ lang, form, services, bookCall }: ContactFormProps) {
  const id = useId();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<"generic" | "rate">("generic");

  const validate = (v: typeof EMPTY): Errors => {
    const result = contactSchema.safeParse({ ...v, locale: lang });
    if (result.success) return {};
    const out: Errors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as ContactField;
      if (!out[field]) out[field] = issue.message as ContactErrorKey;
    }
    return out;
  };

  const set = (field: keyof typeof EMPTY, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as ContactField]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    const first = (["name", "email", "service", "message"] as ContactField[]).find((f) => found[f]);
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale: lang }),
      });
      if (res.ok) {
        setStatus("success");
        setValues(EMPTY);
        return;
      }
      setFailure(res.status === 429 ? "rate" : "generic");
      setStatus("error");
    } catch {
      setFailure("generic");
      setStatus("error");
    }
  };

  const label = "block text-sm font-medium text-soft";
  const control =
    "mt-2 w-full rounded-2xl border bg-white/[0.03] px-4 py-3.5 text-base text-ink placeholder:text-dim outline-none transition-colors focus:bg-white/[0.05]";
  const border = (f: ContactField) =>
    errors[f] ? "border-rose-400/60 focus:border-rose-300" : "border-line focus:border-lav/60";
  const errorLine = (f: ContactField) => (
    <p id={`${id}-${f}-error`} className="min-h-6 pt-1.5 text-sm text-rose-300" aria-live="polite">
      {errors[f] ? form[errors[f]] : ""}
    </p>
  );
  const described = (f: ContactField) => (errors[f] ? `${id}-${f}-error` : undefined);

  if (status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-line bg-surface p-8">
        <p className="font-display text-2xl font-medium tracking-[-0.02em]">✓</p>
        <p className="mt-2 text-lg text-ink">{form.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-5 sm:grid-cols-2">
      <div>
        <label htmlFor={`${id}-name`} className={label}>
          {form.name}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={described("name")}
          className={`${control} ${border("name")}`}
        />
        {errorLine("name")}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className={label}>
          {form.email}
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={described("email")}
          className={`${control} ${border("email")} text-start`}
        />
        {errorLine("email")}
      </div>

      <div>
        <label htmlFor={`${id}-company`} className={label}>
          {form.company} <span className="font-normal text-dim">({form.optional})</span>
        </label>
        <input
          id={`${id}-company`}
          name="company"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => set("company", e.target.value)}
          className={`${control} border-line focus:border-lav/60`}
        />
        <p className="min-h-6" />
      </div>

      <div>
        <label htmlFor={`${id}-service`} className={label}>
          {form.service}
        </label>
        <select
          id={`${id}-service`}
          name="service"
          value={values.service}
          onChange={(e) => set("service", e.target.value)}
          aria-invalid={!!errors.service}
          aria-describedby={described("service")}
          className={`${control} ${border("service")} appearance-none bg-surface`}
        >
          <option value="" disabled>
            {form.servicePlaceholder}
          </option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errorLine("service")}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className={label}>
          {form.message}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={6}
          placeholder={form.messagePlaceholder}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={described("message")}
          className={`${control} ${border("message")} resize-y`}
        />
        {errorLine("message")}
      </div>

      {/* Honeypot — hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input
          id={`${id}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div className="mt-2 sm:col-span-2">
        {status === "error" && (
          <div role="alert" className="mb-5 rounded-2xl border border-rose-400/30 bg-rose-400/5 p-4 text-sm text-rose-100">
            <p>{failure === "rate" ? form.errorRate : form.errorGeneric}</p>
            <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              <a href={`mailto:${site.email}`} className="underline underline-offset-4" dir="ltr">
                {site.email}
              </a>
              <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {bookCall}
              </a>
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary inline-flex h-12 items-center gap-2.5 rounded-pill px-7 text-[15px] font-medium disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" && (
            <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-on-lav/30 border-t-on-lav" />
          )}
          {status === "sending" ? form.sending : form.submit}
          {status !== "sending" && <ArrowIcon className="btn-arrow" />}
        </button>
      </div>
    </form>
  );
}
