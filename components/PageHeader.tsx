import { AtmosphereBand } from "@/components/marketing/AtmosphereBand";

/**
 * Standard page header — a cloud band tucked behind the floating nav, matching
 * the home hero. Used at the top of the marketing pages, so it carries the one
 * video band those pages get (see AtmosphereBand for why it's one per page).
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <AtmosphereBand video tuckUnderNav>
      <div className="container-content py-20 text-center md:py-24">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display-2 mx-auto mt-4 max-w-3xl text-ink">{title}</h1>
        {subtitle && <p className="lead mx-auto mt-5 max-w-xl">{subtitle}</p>}
      </div>
    </AtmosphereBand>
  );
}
