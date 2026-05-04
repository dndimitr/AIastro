export function Starfield() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(139,92,246,0.22),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_40%,rgba(79,70,229,0.18),transparent_50%),linear-gradient(180deg,#0f0c29_0%,#1a1535_38%,#0b0e14_100%)]" />
      <div
        className="stars absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: [
            "radial-gradient(1px 1px at 20% 30%, white, transparent)",
            "radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.8), transparent)",
            "radial-gradient(1.5px 1.5px at 80% 10%, rgba(212,175,55,0.9), transparent)",
            "radial-gradient(1px 1px at 90% 60%, white, transparent)",
            "radial-gradient(1px 1px at 33% 80%, rgba(255,255,255,0.7), transparent)",
            "radial-gradient(1px 1px at 15% 55%, white, transparent)",
            "radial-gradient(1px 1px at 50% 50%, rgba(167,139,250,0.85), transparent)",
          ].join(", "),
          backgroundSize: "320px 320px, 420px 420px, 280px 280px, 360px 360px, 400px 400px, 340px 340px, 500px 500px",
          backgroundPosition:
            "0 0, 40px 60px, 130px 270px, 70px 120px, 200px 200px, -20px 80px, 100px 0",
        }}
      />
    </div>
  );
}
