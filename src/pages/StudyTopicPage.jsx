import { useParams } from "react-router-dom";
import GuidePage from "../components/GuidePage.jsx";
import { STUDY_TOPICS, studyTopicBySlug } from "../data/studyTopics.js";

export default function StudyTopicPage({ user }) {
  const { slug } = useParams();
  const topic = studyTopicBySlug(slug);
  const related = STUDY_TOPICS.filter((item) => item.slug !== slug).map(
    (item) => ({
      href: `/how-to-study/${item.slug}`,
      label: item.headline ?? `How to study for ${item.title}`,
    }),
  );

  if (topic) {
    related.push({
      href: "/how-to-learn",
      label: "How to learn a language fast",
    });
  }

  return (
    <GuidePage
      topic={topic}
      user={user}
      fallback="/how-to-study"
      indexPath="/how-to-study"
      indexLabel="All study guides"
      related={related}
    />
  );
}
