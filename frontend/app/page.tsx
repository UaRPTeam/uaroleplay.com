export default function Home() {
  const comingSoonText = "Coming soon ...";

  return (
    <section
      className="relative min-h-[70vh] w-full overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero.jpeg')" }}
    >
      <div className="relative z-10 flex min-h-[70vh] items-center justify-center px-4 text-center">
        <div>
          <h1
            className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
            style={{
              textShadow: "0 2px 12px rgba(255,255,255,0.55)",
              animation:
                "heroFadeUp 900ms ease-out both, heroSoftPulse 3s ease-in-out infinite",
            }}
          >
            UaRP
          </h1>
          <p className="mt-4 text-2xl font-extrabold tracking-[0.08em] text-slate-800 sm:text-3xl">
            {comingSoonText.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="inline-block"
                style={{
                  textShadow: "0 2px 10px rgba(255,255,255,0.45)",
                  animation:
                    "heroFadeUp 1200ms ease-out both, heroStrongGlow 2.6s ease-in-out infinite, pianoWave 1.8s ease-in-out infinite",
                  animationDelay: `${index * 90}ms`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
