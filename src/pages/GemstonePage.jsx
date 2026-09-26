import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";
import { GEMSTONES, gemstoneBySlug } from "../data/gemstones.js";

export default function GemstonePage({ user }) {
  const { slug } = useParams();
  const topic = gemstoneBySlug(slug);
  const related = GEMSTONES.filter((item) => item.slug !== slug).map((item) => ({
    href: `/gemstones/${item.slug}`,
    label: item.headline,
  }));

  if (topic) {
    related.push({
      href: "/star-signs-dates",
      label: "Star signs dates",
    });
  }

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback="/gemstones"
      indexPath="/gemstones"
      indexLabel="All colors"
      related={related}
    />
  );
}
