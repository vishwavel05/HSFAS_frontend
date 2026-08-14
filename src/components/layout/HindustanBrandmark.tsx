export function HindustanBadge40() {
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gold text-gold">
      <span className="text-[11px] font-bold">40</span>
    </div>
  );
}

export function HindustanWordmark({
  size = "sm",
}: {
  size?: "sm" | "lg";
}) {
  const isLg = size === "lg";
  return (
    <div className="leading-none">
      <p
        className={
          isLg
            ? "text-2xl font-extrabold tracking-tight text-white"
            : "text-[15px] font-extrabold tracking-tight text-white"
        }
      >
        HINDUSTAN
      </p>
      <p
        className={
          isLg
            ? "mt-0.5 text-[10px] font-medium tracking-wide text-white/70"
            : "text-[6.5px] font-medium tracking-wide text-white/70"
        }
      >
        INSTITUTE OF TECHNOLOGY &amp; SCIENCE
      </p>
      {isLg && (
        <p className="text-[9px] font-medium tracking-wide text-white/70">
          (DEEMED TO BE UNIVERSITY)
        </p>
      )}
    </div>
  );
}
