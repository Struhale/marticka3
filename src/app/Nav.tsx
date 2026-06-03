"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#kdy-kde", label: "Kdy & Kde" },
  { href: "#svedci", label: "Svědci" },
  { href: "#ubytovani", label: "Ubytování" },
  { href: "#dary", label: "Dary" },
  { href: "#rsvp", label: "RSVP" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 z-50 w-full"
      style={{
        backgroundColor: scrolled ? "rgba(253,248,240,0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--green-light)" : "none",
        transition: "background-color 0.3s ease, border-bottom 0.3s ease",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-center gap-6 flex-wrap text-sm">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:underline"
            style={{
              color: scrolled ? "var(--green)" : "white",
              transition: "color 0.3s ease",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
