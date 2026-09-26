import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";
import { LANGUAGES, languageBySlug } from "../data/languages.js";

export default function LearnLanguagePage({ user }) {
  const { slug } = useParams();
  const topic = languageBySlug(slug);
  const related = LANGUAGES.filter((item) => item.slug !== slug).map(
    (item) => ({
      href: `/how-to-learn/${item.slug}`,
      label: item.headline,
    }),
  );

  if (topic) {
    related.push({
      href: "/how-to-study/medical-school",
      label: "How to study for medical school",
    });
  }

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback="/how-to-learn"
      indexPath="/how-to-learn"
      indexLabel="All languages"
      related={related}
    />
  );
}
