import Header from "../../components/Header";
import Card from "../../components/Card";

export default function ResultsPage() {
  return (
    <>
      <Header />
      <Card title="Risultati">
        <p className="p">Qui vedrai consigli personalizzati e numeri.</p>
        <div className="hr" />
<div className="row">
  <a className="btn secondary" href="/onboarding">Modifica risposte</a>
  <a className="btn secondary" href="/settings">Modifica prezzi</a>
  <a className="btn" href="/guide">Leggi guida</a>
</div>
      </Card>
    </>
  );
}