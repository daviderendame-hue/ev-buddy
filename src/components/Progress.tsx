// FILE: src/components/Progress.tsx
export default function Progress({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);

  return (
    <div className="progressWrap" aria-label="progress">
      <div className="small">
        Step {step}/{total}
      </div>
      <div className="progressBar">
        <div className="progressFill" style={{ width: `${pct}%` }} />
      </div>
      <div className="small">{pct}%</div>
    </div>
  );
}