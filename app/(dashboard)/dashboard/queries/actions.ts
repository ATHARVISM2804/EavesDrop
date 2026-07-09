"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Source } from "@/lib/scoring/types";

const VALID_SOURCES: Source[] = ["reddit", "x", "hn", "g2", "capterra"];

export type QueryFormState = { error: string } | { ok: true } | null;

function parseList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createQuery(
  _prev: QueryFormState,
  formData: FormData,
): Promise<QueryFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const productDescription = String(formData.get("product_description") ?? "").trim();
  if (productDescription.length < 10) {
    return { error: "Describe your product in at least 10 characters." };
  }

  const keywords = parseList(formData.get("keywords"));
  const competitors = parseList(formData.get("competitors"));
  const sources = formData
    .getAll("sources")
    .map(String)
    .filter((s): s is Source => VALID_SOURCES.includes(s as Source));

  const { error } = await supabase.from("tracked_queries").insert({
    user_id: user.id,
    product_description: productDescription,
    keywords,
    competitors,
    sources: sources.length ? sources : ["reddit"],
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/queries");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function toggleQuery(id: string, isActive: boolean) {
  const supabase = await createClient();
  await supabase
    .from("tracked_queries")
    .update({ is_active: isActive })
    .eq("id", id);
  revalidatePath("/dashboard/queries");
}

export async function deleteQuery(id: string) {
  const supabase = await createClient();
  await supabase.from("tracked_queries").delete().eq("id", id);
  revalidatePath("/dashboard/queries");
  revalidatePath("/dashboard");
}
