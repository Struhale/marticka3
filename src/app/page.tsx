const VENUE_MAPS =
  "https://maps.google.com/?q=Restaurace+u+Kollerů,+Poteč+68,+Valašské+Klobouky+766+01";
const HOTEL_MAPS =
  "https://maps.google.com/?q=Hotel+Aréna+Brumov-Bylnice,+Družba+1223,+763+31+Brumov-Bylnice";

const NAV_LINKS = [
  { href: "#kdy-kde", label: "Kdy & Kde" },
  { href: "#svedci", label: "Svědci" },
  { href: "#ubytovani", label: "Ubytování" },
  { href: "#dary", label: "Dary" },
  { href: "#rsvp", label: "RSVP" },
];

const WITNESSES = [
  {
    name: "Martin Vadlejch",
    role: "svědek za stranu ženicha",
    phone: "+420 XXX XXX XXX",
  },
  {
    name: "Aleš Struhař",
    role: "svědek za stranu nevěsty",
    phone: "+420 XXX XXX XXX",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "rgba(253,248,240,0.95)",
          borderColor: "var(--gold)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-center gap-6 flex-wrap text-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:underline transition-colors"
              style={{ color: "var(--gold)" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-4">
        <div
          className="mx-auto mb-8 w-48 h-48 rounded-full overflow-hidden border-4 flex items-center justify-center text-6xl"
          style={{ borderColor: "var(--gold)", backgroundColor: "#f0e8d0" }}
        >
          💍
        </div>
        <p className="text-lg mb-2" style={{ color: "var(--gold)" }}>
          Máme radost, že Vás můžeme pozvat na naši svatbu
        </p>
        <h1
          className="text-5xl md:text-6xl font-bold mb-4"
          style={{ color: "var(--dark)" }}
        >
          Marta & Jakub
        </h1>
        <p className="text-2xl" style={{ color: "var(--gold)" }}>
          10. října 2026
        </p>

        <div
          className="mt-6 inline-block px-6 py-3 border-2 rounded text-sm font-semibold"
          style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
        >
          Potvrďte prosím účast do 1. 7. 2026
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 space-y-16 pb-20">
        {/* Kdy & Kde */}
        <section id="kdy-kde" className="pt-4">
          <SectionHeading>Kdy & Kde</SectionHeading>
          <div className="text-center space-y-3">
            <p className="text-xl font-semibold">10. října 2026, 11:00</p>
            <p className="text-lg">Restaurace u Kollerů</p>
            <p style={{ color: "#666" }}>Poteč 68, Valašské Klobouky 766 01</p>
            <p className="text-sm" style={{ color: "#666" }}>
              Celý svatební den probíhá na jednom místě.
            </p>
            <a
              href={VENUE_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-5 py-2 rounded text-sm font-medium text-white"
              style={{ backgroundColor: "var(--gold)" }}
            >
              Navigovat na místo →
            </a>
          </div>
        </section>

        <Divider />

        {/* Svědci */}
        <section id="svedci">
          <SectionHeading>Svědci</SectionHeading>
          <p className="text-center text-sm mb-8" style={{ color: "#666" }}>
            V případě dotazů nebo problémů v den svatby se obraťte na svědky.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {WITNESSES.map((w) => (
              <div
                key={w.name}
                className="text-center p-6 rounded-lg border"
                style={{
                  borderColor: "var(--gold-light)",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  className="mx-auto mb-4 w-24 h-24 rounded-full border-2 flex items-center justify-center text-3xl"
                  style={{ borderColor: "var(--gold)", backgroundColor: "#f0e8d0" }}
                >
                  👤
                </div>
                <p className="font-bold text-lg">{w.name}</p>
                <p className="text-sm mb-2" style={{ color: "var(--gold)" }}>
                  {w.role}
                </p>
                <a
                  href={`tel:${w.phone.replace(/\s/g, "")}`}
                  className="text-sm font-mono"
                  style={{ color: "#444" }}
                >
                  {w.phone}
                </a>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-sm space-y-2">
            <p style={{ color: "#888" }}>
              Plánujete ohňostroj? Domluvte se předem přes svědky — je potřeba
              koordinace s hasiči Valašských Klobouk.
            </p>
            <p className="font-semibold" style={{ color: "var(--dark)" }}>
              🚫 Konfety nejsou na místě povoleny.
            </p>
          </div>
        </section>

        <Divider />

        {/* Ubytování */}
        <section id="ubytovani">
          <SectionHeading>Ubytování</SectionHeading>
          <div
            className="rounded-lg p-6 border text-center"
            style={{ borderColor: "var(--gold-light)", backgroundColor: "#fff" }}
          >
            <p className="font-bold text-xl mb-1">Hotel Aréna Brumov-Bylnice</p>
            <p className="text-sm mb-5" style={{ color: "#666" }}>
              Družba 1223, 763 31 Brumov-Bylnice
            </p>
            <ul
              className="text-sm space-y-2 text-left max-w-sm mx-auto mb-6"
              style={{ color: "#444" }}
            >
              <li>✓ Dostupné od pátku 9. 10. 2026</li>
              <li>✓ Snídaně v pátek, sobotu i neděli v ceně</li>
              <li>✓ Odvoz na obřad i zpět zajištěn</li>
              <li>✓ Parkování zdarma před hotelem</li>
            </ul>
            <p className="text-sm mb-5 font-medium" style={{ color: "var(--gold)" }}>
              Ubytování je zajištěno — stačí jen přijet.
            </p>
            <a
              href={HOTEL_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 rounded text-sm font-medium text-white"
              style={{ backgroundColor: "var(--gold)" }}
            >
              Navigovat na hotel →
            </a>
          </div>
        </section>

        <Divider />

        {/* Dary */}
        <section id="dary">
          <SectionHeading>Dary</SectionHeading>
          <div className="text-center max-w-md mx-auto">
            <p className="mb-4" style={{ color: "#444" }}>
              Nejlepší dar pro nás jsou vaše přítomnost a přání do společného
              života. Pokud nás chcete obdarovat finančně, rádi přijmeme dary
              v hotovosti nebo převodem.
            </p>
            <p className="text-sm" style={{ color: "#888" }}>
              QR kód pro platbu bude k dispozici přímo na svatbě.
            </p>
          </div>
        </section>

        <Divider />

        {/* RSVP */}
        <section id="rsvp">
          <SectionHeading>Potvrďte účast</SectionHeading>
          <div className="text-center">
            <p className="mb-2 text-lg font-semibold" style={{ color: "var(--gold)" }}>
              Termín: do 1. července 2026
            </p>
            <p className="text-sm mb-6" style={{ color: "#666" }}>
              Prosíme o potvrzení účasti přes náš online formulář.
            </p>
            <a
              href="/rsvp"
              className="inline-block px-8 py-3 rounded text-white font-semibold text-lg"
              style={{ backgroundColor: "var(--gold)" }}
            >
              Vyplnit formulář →
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-8 text-sm border-t"
        style={{ borderColor: "var(--gold-light)", color: "#aaa" }}
      >
        Marta & Jakub — 10. 10. 2026
      </footer>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-3xl font-bold mb-8" style={{ color: "var(--dark)" }}>
      <span className="inline-block border-b-2 pb-2" style={{ borderColor: "var(--gold)" }}>
        {children}
      </span>
    </h2>
  );
}

function Divider() {
  return (
    <div className="text-center text-2xl" style={{ color: "var(--gold-light)" }}>
      ✦ ✦ ✦
    </div>
  );
}
