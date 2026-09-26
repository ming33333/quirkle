import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";
import { COMPUTING, computingBySlug } from "../data/computing.js";

export default function ComputingPage({ user }) {
  const { slug } = useParams();
  const topic = computingBySlug(slug);
  const related = COMPUTING.filter((item) => item.slug !== slug).map((item) => ({
    href: `/computing/${item.slug}`,
    label: item.headline,
  }));

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback="/computing"
      indexPath="/computing"
      indexLabel="All computing questions"
      related={related}
    />
  );
}
