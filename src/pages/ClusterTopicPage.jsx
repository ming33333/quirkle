import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";

export default function ClusterTopicPage({
  user,
  items,
  basePath,
  indexLabel,
  alsoRelated,
  maxRelated,
}) {
  const { slug } = useParams();
  const topic = items.find((item) => item.slug === slug) ?? null;
  const related = items
    .filter((item) => item.slug !== slug)
    .slice(0, maxRelated)
    .map((item) => ({
      href: `${basePath}/${item.slug}`,
      label: item.headline,
    }));

  if (topic && alsoRelated) related.unshift(...alsoRelated(topic));

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
