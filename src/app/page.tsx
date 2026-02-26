import Header from "../components/Header";
import Card from "../components/Card";

export default function HomePage() {
  return (
    <>
      <Header />
      <Card title="Cosa fa questa app">
        <p className="p">
          Ti fa poche domande e ti restituisce una guida personalizzata per entrare nel mondo EV:
          batteria consigliata, autonomia realistica, strategia di ricarica e stima costi.
        </p>
        <div className="spacer" />
        <div className="row">
          <a className="btn" href="/onboarding">Inizia il questionario</a>
          <a className="btn secondary" href="/guide">Leggi la mini-guida</a>
        </div>
        <div className="hr" />
        <p className="small">Risultati = stime trasparenti, non numeri magici.</p>
      </Card>
    </>
  );
}