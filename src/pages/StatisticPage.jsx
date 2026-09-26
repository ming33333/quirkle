import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";
import { STATISTICS, statisticBySlug } from "../data/statistics.js";

export default function StatisticPage({ user }) {
  const { slug } = useParams();
  const topic = statisticBySlug(slug);
  const related = STATISTICS.filter((item) => item.slug !== slug).map((item) => ({
    href: `/statistics/${item.slug}`,
    label: item.headline,
  }));

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback="/statistics"
      indexPath="/statistics"
      indexLabel="All statistics questions"
      related={related}
    />
  );
}
