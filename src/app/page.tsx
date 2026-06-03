import Image from "next/image";
import Nav from "./Nav";

const VENUE_MAPS =
  "https://maps.google.com/?q=Restaurace+u+Kollerů,+Poteč+68,+Valašské+Klobouky+766+01";
const HOTEL_MAPS =
  "https://maps.google.com/?q=Hotel+Aréna+Brumov-Bylnice,+Družba+1223,+763+31+Brumov-Bylnice";

const WITNESSES = [
  {
    name: "Martin Vadlejch",
    role: "svědek za stranu ženicha",
    phone: "+420 XXX XXX XXX",
    initials: "M",
  },
  {
    name: "Aleš Struhař",
    role: "svědek za stranu nevěsty",
    phone: "+420 XXX XXX XXX",
    initials: "A",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      <Nav />

      {/* Hero — full viewport, photo background */}
      <section className="relative" style={{ height: "100svh" }}>
        <Image
          src="/svatebni-par.jpeg"
          alt="Marta a Jakub"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(15,35,15,0.80) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 text-center pb-16 px-4">
          <h1
            className="text-7xl md:text-9xl text-white mb-3"
            style={{ fontFamily: "var(--font-script)" }}
          >
            Marta & Jakub
          </h1>
          <p className="text-xl text-white">10. října 2026</p>
          <p className="text-lg text-white mt-1 opacity-90">
            Restaurace u Kollerů, Poteč
          </p>
        </div>
      </section>

      {/* Kdy & Kde — green background */}
      <section
        id="kdy-kde"
        className="py-20 px-4"
        style={{ backgroundColor: "var(--green)" }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeading inverted>Kdy & Kde</SectionHeading>
          <div className="text-center space-y-3 text-white">
            <p className="text-xl font-semibold">10. října 2026, 11:00</p>
            <p className="text-lg">Restaurace u Kollerů</p>
            <p className="opacity-80">Poteč 68, Valašské Klobouky 766 01</p>
            <p className="text-sm opacity-70">
              Celý svatební den probíhá na jednom místě.
            </p>
            <a
              href={VENUE_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-5 py-2 rounded text-sm font-medium border-2 border-white text-white hover:bg-white hover:text-green-800 transition-colors"
            >
              Navigovat na místo →
            </a>
          </div>
        </div>
      </section>

      {/* Svědci — cream background */}
      <section id="svedci" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeading>Svědci</SectionHeading>
          <p className="text-center text-sm mb-8" style={{ color: "#666" }}>
            Pokud nám budete chtít připravit překvapení, hru, zábavu, úkoly,.. Prosím s
            jakýmkoliv zásahem do harmonogramu svatby anebo v případě dotazů, problémů v
            den svatby se obraťte na naše svědky. Děkujeme!
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {WITNESSES.map((w) => (
              <div
                key={w.name}
                className="text-center p-6 rounded-lg border"
                style={{
                  borderColor: "var(--green-light)",
                  backgroundColor: "var(--green-pale)",
                }}
              >
                <div
                  className="mx-auto mb-4 w-24 h-24 rounded-full border-2 flex items-center justify-center text-3xl font-bold text-white"
                  style={{
                    borderColor: "var(--green)",
                    backgroundColor: "var(--green)",
                  }}
                >
                  {w.initials}
                </div>
                <p className="font-bold text-lg">{w.name}</p>
                <p className="text-sm mb-2" style={{ color: "var(--green)" }}>
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
              Plánujete ohňostroj? Domluvte se předem přes svědky — je potřeba koordinace
              s hasiči Valašských Klobouk.
            </p>
            <p className="font-semibold" style={{ color: "var(--dark)" }}>
              🚫 Konfety nejsou na místě povoleny.
            </p>
          </div>
        </div>
      </section>

      {/* Ubytování — cream background */}
      <section id="ubytovani" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeading>Ubytování</SectionHeading>
          <div
            className="rounded-lg p-6 border"
            style={{
              borderColor: "var(--green-light)",
              backgroundColor: "var(--green-pale)",
            }}
          >
            <p className="font-bold text-xl mb-1 text-center">
              Hotel Aréna Brumov-Bylnice
            </p>
            <p className="text-sm mb-5 text-center" style={{ color: "#666" }}>
              Družba 1223, 763 31 Brumov-Bylnice
            </p>
            <p className="mb-4 leading-relaxed" style={{ color: "#444" }}>
              Ubytování pro rodinu a kamarády (z Prahy, Mostu, Litoměřic, Trenčína), kteří
              nemají azyl na Valašsku, je zajištěno se snídaní. Ubytování je zarezervováno
              od pátku do neděle. Prosíme dejte nám níže v dotazníku vědět, jestli přijedete
              už v pátek nebo až v sobotu.
            </p>
            <p className="mb-5 leading-relaxed" style={{ color: "#444" }}>
              Odvoz na obřad i zpět je zajištěn — stačí jen přijet.
            </p>
            <div className="text-center">
              <a
                href={HOTEL_MAPS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 rounded text-sm font-medium text-white"
                style={{ backgroundColor: "var(--green)" }}
              >
                Navigovat na hotel →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dary — cream background */}
      <section id="dary" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeading>Dary</SectionHeading>
          <div className="text-center max-w-md mx-auto">
            <p style={{ color: "#444" }}>
              Největším darem pro nás bude vaše přítomnost. Pokud byste nám chtěli přispět
              do společného života, budeme rádi za finanční příspěvek.
            </p>
          </div>
        </div>
      </section>

      {/* RSVP — green background */}
      <section
        id="rsvp"
        className="py-20 px-4"
        style={{ backgroundColor: "var(--green)" }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeading inverted>Potvrďte účast</SectionHeading>
          <div className="text-center text-white">
            <p className="mb-2 text-lg font-semibold">Termín: do 1. července 2026</p>
            <p className="text-sm mb-6 opacity-80">
              Prosíme o potvrzení účasti přes náš online formulář.
            </p>
            <a
              href="/rsvp"
              className="inline-block px-8 py-3 rounded font-semibold text-lg border-2 border-white text-white hover:bg-white hover:text-green-800 transition-colors"
            >
              Vyplnit formulář →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-8 text-sm border-t"
        style={{ borderColor: "var(--green-light)", color: "#aaa" }}
      >
        Marta & Jakub — 10. 10. 2026
      </footer>
    </div>
  );
}

function SectionHeading({
  children,
  inverted,
}: {
  children: React.ReactNode;
  inverted?: boolean;
}) {
  return (
    <h2
      className="text-center text-4xl font-bold mb-8"
      style={{ color: inverted ? "white" : "var(--dark)" }}
    >
      <span
        className="inline-block border-b-2 pb-2"
        style={{ borderColor: inverted ? "rgba(255,255,255,0.5)" : "var(--green)" }}
      >
        {children}
      </span>
    </h2>
  );
}
