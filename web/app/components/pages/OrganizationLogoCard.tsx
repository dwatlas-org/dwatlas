type OrganizationLogoCardProps = {
  name: string | null;
  logoRef?: string | null;
  url?: string | null;
};

export function OrganizationLogoCard({
  name,
  logoRef,
  url,
}: OrganizationLogoCardProps) {
  const content = logoRef ? (
    <img
      src={logoRef}
      alt={name ? `${name} logo` : "Institution logo"}
      className="h-24 w-full object-contain"
    />
  ) : (
    <span className="text-center text-sm font-medium leading-5 text-slate-500">
      {name ?? "Logo"}
    </span>
  );

  const classes =
    "flex min-h-32 items-center justify-center rounded-lg border border-slate-200 bg-white p-4 transition-colors";

  if (!url) {
    return <div className={classes}>{content}</div>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name ? `Visit ${name}` : "Visit institution website"}
      className={`${classes} hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2`}
    >
      {content}
    </a>
  );
}
