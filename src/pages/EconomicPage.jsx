import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";
import { ECONOMICS, economicBySlug } from "../data/economics.js";

export default function EconomicPage({ user }) {
  const { slug } = useParams();
  const topic = economicBySlug(slug);
  const related = ECONOMICS.filter((item) => item.slug !== slug).map((item) => ({
    href: `/economics/${item.slug}`,
    label: item.headline,
  }));

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback="/economics"
      indexPath="/economics"
      indexLabel="All economics questions"
      related={related}
    />
  );
}
