import "./globals.css";

export const metadata = {
  title: "EV Buddy",
  description: "Guida pratica per iniziare con l’auto elettrica",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0b0f14" />
      </head>
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}