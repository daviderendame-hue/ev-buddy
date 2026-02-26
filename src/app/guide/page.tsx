import Header from "../../components/Header";
import Card from "../../components/Card";
import { GUIDE } from "../../lib/content";

export default function GuidePage() {
  return (
    <>
      <Header />
      <Card title="Mini-guida EV">
        {GUIDE.map((g: any) => (
          <div key={g.slug} style={{ marginBottom: 14 }}>
            <div className="h2">{g.title}</div>
            <p className="p">{g.body}</p>
            <div className="hr" />
          </div>
        ))}
      </Card>
    </>
  );
}