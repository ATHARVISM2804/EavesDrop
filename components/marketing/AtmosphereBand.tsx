import { CloudBackdrop } from "@/components/home/CloudBackdrop";

/**
 * Reusable atmosphere plate — the cloud band used across the site.
 *
 * The `.atmosphere` CSS gradient always paints instantly (so it never costs
 * LCP); the cloud video is opt-in via `video` because it's a ~2.5MB asset and
 * two <video> elements on one page means two decoders. Rule of thumb: at most
 * ONE video band per page.
 *
 * `tuckUnderNav` pulls the plate up behind the floating nav pill so the clouds
 * run to the very top of the page, matching the hero.
 */
export function AtmosphereBand({
  children,
  video = false,
  tuckUnderNav = false,
  className = "",
}: {
  children: React.ReactNode;
  video?: boolean;
  tuckUnderNav?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`atmosphere atmosphere-fade relative overflow-hidden ${
        tuckUnderNav ? "-mt-[4.5rem] pt-[4.5rem]" : ""
      } ${className}`}
    >
      {video && <CloudBackdrop />}

      {/* Legibility scrim — keeps dark text readable over moving clouds */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_35%,rgba(255,255,255,0.62),transparent_72%)]"
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
