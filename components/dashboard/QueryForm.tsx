"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createQuery, type QueryFormState } from "@/app/(dashboard)/dashboard/queries/actions";

const inputClass =
  "mt-1.5 w-full rounded-md border border-divider bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-static/70 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal";

const SOURCES: { value: string; label: string }[] = [
  { value: "reddit", label: "Reddit" },
  { value: "x", label: "X" },
  { value: "hn", label: "Hacker News" },
];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-signal text-sm disabled:opacity-60">
      {pending ? "Saving…" : "Start tracking"}
    </button>
  );
}

export function QueryForm() {
  const [state, formAction] = useActionState<QueryFormState, FormData>(createQuery, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "ok" in state) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-lg border border-divider bg-paper p-5"
    >
      <div>
        <label htmlFor="product_description" className="block text-sm font-medium text-ink">
          What do you sell?
        </label>
        <textarea
          id="product_description"
          name="product_description"
          rows={2}
          required
          placeholder="A buyer-intent lead-gen tool that scans Reddit, X, and HN for people ready to buy."
          className={inputClass}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-ink">
            Keywords
          </label>
          <input
            id="keywords"
            name="keywords"
            placeholder="lead gen, buyer intent, social listening"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-static">Comma-separated.</p>
        </div>
        <div>
          <label htmlFor="competitors" className="block text-sm font-medium text-ink">
            Competitors
          </label>
          <input
            id="competitors"
            name="competitors"
            placeholder="Linkeddit, F5Bot"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-static">Comma-separated.</p>
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-ink">Sources</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {SOURCES.map((s) => (
            <label key={s.value} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="sources"
                value={s.value}
                defaultChecked={s.value === "reddit"}
                className="h-4 w-4 rounded border-divider text-signal focus:ring-signal"
              />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      {state && "error" in state ? (
        <p className="mt-4 rounded-md border border-alert/30 bg-alert/8 px-3 py-2 text-sm text-alert">
          {state.error}
        </p>
      ) : null}

      <div className="mt-5">
        <Submit />
      </div>
    </form>
  );
}
