import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";
import { GRAMMAR, grammarBySlug } from "../data/grammar.js";

export default function GrammarPage({ user }) {
  const { slug } = useParams();
  const topic = grammarBySlug(slug);
  const related = GRAMMAR.filter((item) => item.slug !== slug).map((item) => ({
    href: `/grammar/${item.slug}`,
    label: item.headline,
  }));

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback="/grammar"
      indexPath="/grammar"
      indexLabel="All grammar questions"
      related={related}
    />
  );
}
