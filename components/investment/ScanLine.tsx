// Ambient horizontal scanner line that drifts slowly down the Investment
// page blueprint grid. Pure CSS animation (animate-scan-drift defined in
// tailwind.config.ts) \u2014 zero JS, zero rAF, compositor-only transform.
//
// Hidden on:
//   - Sub-lg viewports (mobile/tablet: too small to add visual value,
//     and touch users don't get the "technical instrument" reading)
//   - motion-reduce: the animation is decorative; killing the whole
//     line rather than leaving a static bar avoids a stuck-artifact.

export function ScanLine() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 hidden lg:block motion-reduce:hidden"
    >
      <div className="animate-scan-drift h-px w-full bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
    </div>
  );
}
