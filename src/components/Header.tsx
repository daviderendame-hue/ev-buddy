"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();
  const pill = (href: string, label: string) => (
    <Link href={href} style={{ opacity: path === href ? 1 : 0.85 }}>
      {label}
    </Link>
  );

  return (
    <div className="header">
      <div>
        <div className="h2" style={{ marginBottom: 2 }}>
          <span style={{ color: "var(--accent)", fontWeight: 900 }}>EV</span> Buddy
        </div>
        <div className="small">Consigli pratici, niente fuffa.</div>
      </div>
      <div className="nav">
        {pill("/", "Home")}
        {pill("/onboarding", "Questionario")}
        {pill("/results", "Risultati")}
        {pill("/guide", "Guida")}
        {pill("/settings", "Impostazioni")}
      </div>
    </div>
  );
}