import GuidePage from "../components/GuidePage.jsx";
import { STAR_SIGNS } from "../data/starSigns.js";

const RELATED = [
  { href: "/gemstones", label: "Gemstones by color" },
  { href: "/how-to-learn/ai", label: "How to learn AI" },
  {
    href: "/how-to-study/medical-school",
    label: "How to study for medical school",
  },
];

export default function StarSignsPage({ user }) {
  return (
    <GuidePage
      topic={STAR_SIGNS}
      user={user}
      fallback="/"
      indexPath="/how-to-study"
      indexLabel="Study guides"
      related={RELATED}
    />
  );
}