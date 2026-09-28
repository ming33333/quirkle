import fs from "fs";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { GEMSTONES } from "./src/data/gemstones.js";
import { ECONOMICS } from "./src/data/economics.js";
import { ARTS } from "./src/data/arts.js";
import { AVIATION } from "./src/data/aviation.js";
import { BUILDING } from "./src/data/building.js";
import { BUSINESS } from "./src/data/business.js";
import { CHEMISTRY } from "./src/data/chemistry.js";
import { COMPUTING } from "./src/data/computing.js";
import { GEOGRAPHY } from "./src/data/geography.js";
import { GRAMMAR } from "./src/data/grammar.js";
import { HEALTH } from "./src/data/health.js";
import { HISTORY } from "./src/data/history.js";
import { HOME } from "./src/data/home.js";
import { NATURE } from "./src/data/nature.js";
import { PSYCHOLOGY } from "./src/data/psychology.js";
import { RELIGION } from "./src/data/religion.js";
import { SPACE } from "./src/data/space.js";
import { WORK } from "./src/data/work.js";
import { PHYSICS } from "./src/data/physics.js";
import { STATISTICS } from "./src/data/statistics.js";
import { LANGUAGES } from "./src/data/languages.js";
import { LANGUAGE_COURSES } from "./src/data/languageCourses.js";
import { STUDY_TOPICS } from "./src/data/studyTopics.js";
import { FUN_FACT_ANIMALS } from "./src/data/funFactsAnimals.js";
import { FUN_FACT_COUNTRIES } from "./src/data/funFactsCountries.js";
import { FUN_FACT_COUNTRY_CAPITALS } from "./src/data/funFactsCountryCapitals.js";
import { FUN_FACT_GENERAL } from "./src/data/funFactsGeneral.js";
import { FUN_FACT_PLANETS } from "./src/data/funFactsPlanets.js";
import { FUN_FACT_US_CAPITALS } from "./src/data/funFactsUsCapitals.js";
import { TRIVIA_CELEBRITIES } from "./src/data/triviaCelebrities.js";
import { TRIVIA_HOLIDAYS } from "./src/data/triviaHolidays.js";
import { TRIVIA_MOVIES } from "./src/data/triviaMovies.js";
import { TRIVIA_SPORTS } from "./src/data/triviaSports.js";
import { TRIVIA_TOPICS } from "./src/data/triviaTopics.js";

function publishCrawlableRoutes() {
  return {
    name: "publish-crawlable-routes",
    apply: "build",
    closeBundle() {
      const buildDir = path.resolve("build");
      const indexPath = path.join(buildDir, "index.html");
      if (!fs.existsSync(indexPath)) return;

      const html = fs.readFileSync(indexPath);
      fs.writeFileSync(path.join(buildDir, "404.html"), html);

      const routes = [
        "how-to-study",
        ...STUDY_TOPICS.map((topic) => `how-to-study/${topic.slug}`),
        "how-to-learn",
        "how-to-learn/ai",
        ...LANGUAGES.map((language) => `how-to-learn/${language.slug}`),
        "learn",
        ...LANGUAGE_COURSES.map((language) => `learn/${language.slug}`),
        "gemstones",
        ...GEMSTONES.map((stone) => `gemstones/${stone.slug}`),
        "star-signs-dates",
        "statistics",
        ...STATISTICS.map((item) => `statistics/${item.slug}`),
        "economics",
        ...ECONOMICS.map((item) => `economics/${item.slug}`),
        "physics",
        ...PHYSICS.map((item) => `physics/${item.slug}`),
        "computing",
        ...COMPUTING.map((item) => `computing/${item.slug}`),
        "grammar",
        ...GRAMMAR.map((item) => `grammar/${item.slug}`),
        "business",
        ...BUSINESS.map((item) => `business/${item.slug}`),
        "fun-facts",
        ...FUN_FACT_GENERAL.map((item) => `fun-facts/${item.slug}`),
        "fun-facts/planets",
        ...FUN_FACT_PLANETS.map((item) => `fun-facts/planets/${item.slug}`),
        "fun-facts/countries",
        ...FUN_FACT_COUNTRIES.map((item) => `fun-facts/countries/${item.slug}`),
        "fun-facts/country-capitals",
        ...FUN_FACT_COUNTRY_CAPITALS.map(
          (item) => `fun-facts/country-capitals/${item.slug}`,
        ),
        "fun-facts/us-state-capitals",
        ...FUN_FACT_US_CAPITALS.map(
          (item) => `fun-facts/us-state-capitals/${item.slug}`,
        ),
        "fun-facts/animals",
        ...FUN_FACT_ANIMALS.map((item) => `fun-facts/animals/${item.slug}`),
        "trivia",
        "trivia/celebrities",
        ...TRIVIA_CELEBRITIES.map((item) => `trivia/celebrities/${item.slug}`),
        "trivia/holidays",
        ...TRIVIA_HOLIDAYS.map((item) => `trivia/holidays/${item.slug}`),
        "trivia/movies",
        ...TRIVIA_MOVIES.map((item) => `trivia/movies/${item.slug}`),
        "trivia/sports",
        ...TRIVIA_SPORTS.map((item) => `trivia/sports/${item.slug}`),
        ...TRIVIA_TOPICS.map((item) => `trivia/${item.slug}`),
        "geography",
        ...GEOGRAPHY.map((item) => `geography/${item.slug}`),
        "history",
        ...HISTORY.map((item) => `history/${item.slug}`),
        "religion",
        ...RELIGION.map((item) => `religion/${item.slug}`),
        "health",
        ...HEALTH.map((item) => `health/${item.slug}`),
        "psychology",
        ...PSYCHOLOGY.map((item) => `psychology/${item.slug}`),
        "nature",
        ...NATURE.map((item) => `nature/${item.slug}`),
        "space",
        ...SPACE.map((item) => `space/${item.slug}`),
        "chemistry",
        ...CHEMISTRY.map((item) => `chemistry/${item.slug}`),
        "building",
        ...BUILDING.map((item) => `building/${item.slug}`),
        "home",
        ...HOME.map((item) => `home/${item.slug}`),
        "aviation",
        ...AVIATION.map((item) => `aviation/${item.slug}`),
        "arts",
        ...ARTS.map((item) => `arts/${item.slug}`),
        "work",
        ...WORK.map((item) => `work/${item.slug}`),
      ];
      for (const route of routes) {
        const dir = path.join(buildDir, route);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "REACT_APP_");
  const localTesting =
    loadEnv(mode, process.cwd(), "").LOCAL_TESTING || "false";

  return {
    plugins: [react(), publishCrawlableRoutes()],
    envPrefix: "REACT_APP_",
    optimizeDeps: {
      entries: ["index.html"],
    },
    build: {
      outDir: "build",
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      strictPort: false,
      open: false,
      fs: {
        deny: ["legacy/**"],
      },
    },
    define: {
      ...Object.fromEntries(
        Object.entries(env).map(([key, value]) => [
          `process.env.${key}`,
          JSON.stringify(value),
        ]),
      ),
      "process.env.LOCAL_TESTING": JSON.stringify(localTesting),
      "import.meta.env.LOCAL_TESTING": JSON.stringify(localTesting),
    },
  };
});
