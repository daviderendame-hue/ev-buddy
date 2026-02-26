export default function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="card">
      {title ? <div className="h2">{title}</div> : null}
      {children}
    </div>
  );
}