import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { QueryForm } from "@/components/dashboard/QueryForm";
import { QueryRow, type QueryRowData } from "@/components/dashboard/QueryRow";
import type { TrackedQueryRow } from "@/lib/supabase/database.types";

export const metadata: Metadata = {
  title: "Queries — Eavesdrop",
};

export const dynamic = "force-dynamic";

export default async function QueriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tracked_queries")
    .select("id, product_description, keywords, competitors, sources, is_active")
    .order("created_at", { ascending: false });

  const queries: QueryRowData[] = (
    (data ?? []) as Pick<
      TrackedQueryRow,
      "id" | "product_description" | "keywords" | "competitors" | "sources" | "is_active"
    >[]
  ).map((q) => ({
    id: q.id,
    productDescription: q.product_description,
    keywords: q.keywords,
    competitors: q.competitors,
    sources: q.sources,
    isActive: q.is_active,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink">
          Tracked queries
        </h1>
        <p className="mt-1 text-sm text-static">
          Each query is a product you want buyers for. Eavesdrop scans your chosen
          sources and scores every mention.
        </p>
      </div>

      <QueryForm />

      {queries.length > 0 ? (
        <ul className="space-y-3">
          {queries.map((q) => (
            <QueryRow key={q.id} query={q} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-static">No queries yet — create one above.</p>
      )}
    </div>
  );
}
