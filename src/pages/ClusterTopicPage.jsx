import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";

export default function ClusterTopicPage({
  user,
  items,
  basePath,
  indexLabel,
}) {
  const { slug } = useParams();
  const topic = items.find((item) => item.slug === slug) ?? null;
  const related = items
    .filter((item) => item.slug !== slug)
    .map((item) => ({
      href: `${basePath}/${item.slug}`,
      label: item.headline,
    }));

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback={basePath}
      indexPath={basePath}
      indexLabel={indexLabel}
      related={related}
    />
  );
}
