import type { IntentCategory, Source } from "@/lib/scoring/types";

/** A high-intent lead worth pinging the user about. */
export interface LeadAlert {
  rawMentionId: string;
  source: Source;
  score: number;
  category: IntentCategory;
  content: string;
  url: string | null;
  replyAngle: string | null;
}

export const sourceLabel: Record<Source, string> = {
  reddit: "Reddit",
  x: "X",
  hn: "Hacker News",
  g2: "G2",
  capterra: "Capterra",
};

export const categoryLabel: Record<IntentCategory, string> = {
  buying_signal: "🟢 Buying signal",
  switching_signal: "🔴 Switching signal",
  complaint: "🟠 Complaint",
  curious: "🔵 Curious",
  noise: "Noise",
};
