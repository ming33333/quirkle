import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";
import { PHYSICS, physicsBySlug } from "../data/physics.js";

export default function PhysicsPage({ user }) {
  const { slug } = useParams();
  const topic = physicsBySlug(slug);
  const related = PHYSICS.filter((item) => item.slug !== slug).map((item) => ({
    href: `/physics/${item.slug}`,
    label: item.headline,
  }));

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback="/physics"
      indexPath="/physics"
      indexLabel="All physics questions"
      related={related}
    />
  );
}
