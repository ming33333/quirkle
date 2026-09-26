import GuidePage from "../components/GuidePage.jsx";
import { LEARN_AI } from "../data/learnAi.js";

const RELATED = [
  { href: "/how-to-learn", label: "How to learn a language fast" },
  { href: "/how-to-study/medical-school", label: "How to study for medical school" },
  { href: "/star-signs-dates", label: "Star signs dates" },
];

export default function LearnAiPage({ user }) {
  return (
    <GuidePage
      topic={LEARN_AI}
      user={user}
      fallback="/how-to-learn"
      indexPath="/how-to-learn"
      indexLabel="All languages"
      related={RELATED}
    />
  );
}
