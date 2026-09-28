import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { holidays } from "./trivia-src/holidays.mjs";
import { movies } from "./trivia-src/movies.mjs";
import { people } from "./trivia-src/people.mjs";
import { sports } from "./trivia-src/sports.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src/data");

const schedule =
  "Start with the sample cards. A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.";

function page(fieldLabel, slug, headline, lede, tests, pairs) {
  if (new Set(pairs.map(([question]) => question)).size !== pairs.length) {
    throw new Error(`duplicate question in ${slug}`);
  }
  return {
    slug,
    fieldLabel,
    headline,
    description: `${headline}. ${lede}`,
    lede,
    testsHeading: "A few questions",
    tests,
    cardRule: "One question per card.",
    schedule,
    cards: pairs.map(([question, answer]) => ({ question, answer })),
  };
}

function assertCount(label, items, expected) {
  if (items.length !== expected) {
    throw new Error(`${label} has ${items.length}, expected ${expected}`);
  }
  const slugs = items.map((item) => item.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error(`${label} has a duplicate slug`);
  }
}

const celebrities = people.map(([slug, name, known, born, more]) => {
  const pairs = [[`What is ${name} known for?`, known]];
  if (born) pairs.push([`When was ${name} born?`, born]);
  pairs.push(...more);
  const lede = born
    ? `${known} Born ${born}`
    : known;
  return page("Celebrities", slug, `${name} trivia`, lede, known, pairs);
});

const holidayPages = holidays.map(([slug, name, when, what, more]) => {
  const pairs = [
    [`When is ${name}?`, when],
    [`What does ${name} mark?`, what],
    ...more,
  ];
  return page(
    "Holidays",
    slug,
    `${name} trivia`,
    `${when} ${what}`,
    what,
    pairs,
  );
});

const moviePages = movies.map(
  ([slug, title, year, director, q3, a3, q4, a4, q5, a5]) => {
    const pairs = [
      [`When was ${title} released?`, year + "."],
      [`Who directed ${title}?`, director + "."],
      [q3, a3],
      [q4, a4],
      [q5, a5],
    ];
    const lede = `${title} came out in ${year}. ${director} directed it.`;
    return page("Movies", slug, `${title} trivia`, lede, lede, pairs);
  },
);

const sportPages = sports.map(([slug, name, players, scoring, more]) => {
  const inSentence =
    name === "Formula 1" ? name : name.charAt(0).toLowerCase() + name.slice(1);
  const pairs = [
    [`How many people compete at a time in ${inSentence}?`, players],
    [`How does scoring work in ${inSentence}?`, scoring],
    ...more,
  ];
  const lede = `${players} ${scoring}`;
  return page("Sports", slug, `${name} trivia`, lede, scoring, pairs);
});

assertCount("people", celebrities, 100);
assertCount("holidays", holidayPages, 50);
assertCount("movies", moviePages, 100);
assertCount("sports", sportPages, 24);

function write(fileName, exportName, items) {
  const target = path.join(dataDir, fileName);
  fs.writeFileSync(
    target,
    `export const ${exportName} = ${JSON.stringify(items, null, 2)};\n`,
  );
}

write("triviaCelebrities.js", "TRIVIA_CELEBRITIES", celebrities);
write("triviaHolidays.js", "TRIVIA_HOLIDAYS", holidayPages);
write("triviaMovies.js", "TRIVIA_MOVIES", moviePages);
write("triviaSports.js", "TRIVIA_SPORTS", sportPages);

console.log(
  "wrote",
  celebrities.length,
  holidayPages.length,
  moviePages.length,
  sportPages.length,
);
