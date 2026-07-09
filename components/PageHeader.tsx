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
    <div className="container-content py-16 text-center md:py-20">
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-lg text-static">{subtitle}</p>
      )}
    </div>
  );
}
