import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";
import { BUSINESS, businessBySlug } from "../data/business.js";

export default function BusinessPage({ user }) {
  const { slug } = useParams();
  const topic = businessBySlug(slug);
  const related = BUSINESS.filter((item) => item.slug !== slug).map((item) => ({
    href: `/business/${item.slug}`,
    label: item.headline,
  }));

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback="/business"
      indexPath="/business"
      indexLabel="All business questions"
      related={related}
    />
  );
}
