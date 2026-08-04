// Static, off-center compositional glow behind the Hero headline — pure
// CSS blur/opacity, zero JS. Deliberately a server component: a static
// blurred shape is not "motion" and needs no prefers-reduced-motion
// gating, so there's no reason to pay a client-component cost for it.
export function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -top-24 left-[8%] h-[520px] w-[520px] rounded-full bg-accent opacity-[0.12] blur-3xl" />
      <div className="absolute top-[200px] right-[4%] h-[380px] w-[380px] rounded-full bg-accent-glow opacity-[0.08] blur-3xl" />
    </div>
  );
}
