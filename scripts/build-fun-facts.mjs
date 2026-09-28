import fs from "fs";

const scheduleLine =
  "A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.";

const header = `const schedule = (start) =>
  \`\${start} ${scheduleLine}\`;

const card = (question, answer) => ({ question, answer });

`;

const emit = (exportName, items) => {
  const body = items
    .map((item) => {
      const cards = item.cards
        .map(
          (c) =>
            `      card(${JSON.stringify(c.question)}, ${JSON.stringify(c.answer)})`,
        )
        .join(",\n");
      return `  {
    slug: ${JSON.stringify(item.slug)},
    fieldLabel: ${JSON.stringify(item.fieldLabel)},
    headline: ${JSON.stringify(item.headline)},
    description: ${JSON.stringify(item.description)},
    lede: ${JSON.stringify(item.lede)},
    testsHeading: ${JSON.stringify(item.testsHeading || "A few facts")},
    tests: ${JSON.stringify(item.tests)},
    cardRule: ${JSON.stringify(item.cardRule || "One fact per card.")},
    schedule: schedule(${JSON.stringify(item.scheduleStart || "Start with the sample cards.")}),
    cards: [
${cards}
    ],
  }`;
    })
    .join(",\n");
  return `${header}export const ${exportName} = [\n${body}\n];\n`;
};

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const page = ({
  slug,
  field,
  headline,
  description,
  lede,
  tests,
  cards,
  scheduleStart,
}) => ({
  slug,
  fieldLabel: field,
  headline,
  description,
  lede,
  tests,
  cards: cards.map(([question, answer]) => ({ question, answer })),
  scheduleStart,
});

const countriesRaw = JSON.parse(
  fs.readFileSync("/tmp/countries.json", "utf8"),
).filter((country) => country.unMember && country.name.common !== "Vatican City");

const displayName = {
  "United States": "the United States",
  "United Kingdom": "the United Kingdom",
  "United Arab Emirates": "the United Arab Emirates",
  Netherlands: "the Netherlands",
  Philippines: "the Philippines",
  Bahamas: "the Bahamas",
  Gambia: "the Gambia",
  Maldives: "the Maldives",
  "Marshall Islands": "the Marshall Islands",
  "Solomon Islands": "the Solomon Islands",
  Congo: "the Republic of the Congo",
  "DR Congo": "the Democratic Republic of the Congo",
  Türkiye: "Turkey",
  "Cape Verde": "Cabo Verde",
  "Ivory Coast": "Côte d'Ivoire",
  "East Timor": "Timor-Leste",
};

const capitalOverride = {
  "Sri Lanka": ["Sri Jayawardenepura Kotte"],
};

const capitalNote = {
  "United States":
    "Washington, D.C. is not inside any of the 50 states.",
  Bolivia:
    "Sucre is the constitutional capital. The government sits in La Paz.",
  Netherlands:
    "Amsterdam is the capital. The government sits in The Hague.",
  "Sri Lanka":
    "Sri Jayawardenepura Kotte is the official capital. Colombo is the larger commercial city.",
  "South Africa":
    "Pretoria is the executive capital. Cape Town is the legislative capital. Bloemfontein is the judicial capital.",
  Benin: "Porto-Novo is the official capital. The government sits in Cotonou.",
  "Ivory Coast":
    "Yamoussoukro is the official capital. Abidjan is the largest city and the economic center.",
  Eswatini:
    "Lobamba is the royal and legislative capital. Mbabane is the administrative capital.",
  Malaysia:
    "Kuala Lumpur is the official capital. Putrajaya is the administrative capital.",
  Tanzania:
    "Dodoma is the official capital. Dar es Salaam is the largest city.",
};

const languageNote = {
  "United States":
    "The United States has no official language at the federal level. English is the language most used in government.",
};

const countryExtra = {
  Mexico:
    "People celebrate the start of the independence war on September 16. The flag's eagle, cactus, and snake come from the story of Tenochtitlan.",
  Japan:
    "Japan has four main islands: Honshu, Hokkaido, Kyushu, and Shikoku. People drive on the left.",
  France: "The euro is the currency. Paris sits on the Seine.",
  "United States":
    "The country has 50 states. Alaska and Hawaii do not touch the other 48.",
  China: "Standard Chinese, often called Mandarin, is the official spoken language.",
  India:
    "Hindi and English are used by the national government. The constitution lists many more scheduled languages.",
  Brazil: "Portuguese is the official language. Brazil is the largest country in South America.",
  Australia:
    "Australia is a country and a continent. People drive on the left.",
  Canada:
    "English and French are the official languages at the federal level.",
  Russia: "Russia spans eastern Europe and northern Asia. The currency is the ruble.",
  "United Kingdom":
    "The United Kingdom is England, Scotland, Wales, and Northern Ireland. People drive on the left.",
};

const nameOf = (country) =>
  displayName[country.name.common] || country.name.common;

const capitalsOf = (country) =>
  capitalOverride[country.name.common] || country.capital || [];

const currencyOf = (country) => {
  const values = country.currencies ? Object.values(country.currencies) : [];
  if (!values.length) return "No single currency is listed.";
  return values.map((item) => item.name).join(" and ");
};

const languagesOf = (country) => {
  if (languageNote[country.name.common]) return languageNote[country.name.common];
  const values = country.languages ? Object.values(country.languages) : [];
  if (!values.length) return "No language is listed.";
  if (values.length === 1) return `The main language is ${values[0]}.`;
  return `Languages used officially or nationally include ${values.join(", ")}.`;
};

countriesRaw.sort((a, b) => nameOf(a).localeCompare(nameOf(b)));

const countryPages = countriesRaw.map((country) => {
  const name = nameOf(country);
  const capitals = capitalsOf(country);
  const capitalText = capitals.join(", ") || "not listed";
  const place = country.subregion || country.region;
  const extra = countryExtra[country.name.common];
  const note = capitalNote[country.name.common];
  const cards = [
    [`What is the capital of ${name}?`, note || capitalText + "."],
    [`Where is ${name}?`, place + "."],
    [`What is the currency of ${name}?`, currencyOf(country) + "."],
    [`What language is used in ${name}?`, languagesOf(country)],
    [`Is ${name} in the United Nations?`, "Yes. It is one of the 193 member states."],
  ];
  if (extra) cards.push([`What is one more fact about ${name}?`, extra]);
  return page({
    slug: slugify(country.name.common),
    field: "Countries",
    headline: `Fun facts about ${name}`,
    description: `Fun facts about ${name}: the capital, the currency, and the language. A sample deck and a spaced review schedule.`,
    lede: `${name} is in ${place}. The capital is ${capitalText}. The currency is ${currencyOf(country)}.`,
    tests: `${languagesOf(country)} ${note ? note : ""} These are directory facts, not a travel ranking.`.replace(/\s+/g, " ").trim(),
    cards,
    scheduleStart: "Start with the capital, then the currency.",
  });
});

const capitalPages = countriesRaw.map((country) => {
  const name = nameOf(country);
  const capitals = capitalsOf(country);
  const primary = capitals[0] || "The capital";
  const note = capitalNote[country.name.common];
  const place = country.subregion || country.region;
  const cards = [
    [`What country is ${primary} the capital of?`, name + "."],
    [
      capitals.length > 1 ? "What are the other capital roles?" : `Where does the government of ${name} meet?`,
      note || `In ${primary}.`,
    ],
    [`What currency is used there?`, currencyOf(country) + "."],
    [`What part of the world is that?`, place + "."],
  ];
  return page({
    slug: slugify(primary),
    field: "Capitals",
    headline: `Fun facts about ${primary}`,
    description: `Fun facts about ${primary}, the capital of ${name}. A sample deck and a spaced review schedule.`,
    lede: `${primary} is the capital of ${name}. ${note || `The government meets there.`} The country is in ${place}.`,
    tests: `The currency is ${currencyOf(country)}. ${languagesOf(country)}`,
    cards,
    scheduleStart: "Start with which country this capital belongs to.",
  });
});

const seenCapital = new Map();
for (const item of capitalPages) {
  if (seenCapital.has(item.slug)) {
    item.slug = `${item.slug}-${slugify(item.cards[0].answer)}`;
  }
  seenCapital.set(item.slug, true);
}

const planets = [
  page({
    slug: "mercury",
    field: "Planets",
    headline: "Fun facts about Mercury",
    description: "Fun facts about Mercury: the smallest planet, a short year, and a very long day. A sample deck and a spaced review schedule.",
    lede: "Mercury is the closest planet to the Sun and the smallest planet. A year there is about 88 Earth days. One solar day, from noon to noon, is about 176 Earth days, so a day lasts longer than a year.",
    tests: "Mercury has almost no atmosphere, so the temperature swings from very hot in the sun to very cold in the dark. The surface is covered with craters. It has no moons.",
    cards: [
      ["Which planet is closest to the Sun?", "Mercury."],
      ["Which planet is the smallest?", "Mercury."],
      ["How long is a year on Mercury?", "About 88 Earth days."],
      ["How long is a solar day on Mercury?", "About 176 Earth days, longer than its year."],
      ["Does Mercury have a moon?", "No."],
      ["Why do temperatures swing so much?", "It has almost no atmosphere to hold the heat."],
    ],
  }),
  page({
    slug: "venus",
    field: "Planets",
    headline: "Fun facts about Venus",
    description: "Fun facts about Venus: the hottest planet, a backwards spin, and a day longer than its year. A sample deck and a spaced review schedule.",
    lede: "Venus is the second planet from the Sun. A thick carbon-dioxide atmosphere makes it the hottest planet, hotter than Mercury. It spins backwards, and one day is longer than one year.",
    tests: "A year on Venus is about 225 Earth days. A day is about 243 Earth days. Clouds of sulfuric acid hide the surface. Venus has no moon. It is close to Earth in size.",
    cards: [
      ["Which planet is the hottest?", "Venus, because of a runaway greenhouse atmosphere."],
      ["Which way does Venus spin?", "Backwards compared with most planets."],
      ["How long is a day on Venus?", "About 243 Earth days, longer than its year of about 225 Earth days."],
      ["What are the clouds made of?", "Sulfuric acid, over a carbon-dioxide atmosphere."],
      ["Does Venus have a moon?", "No."],
      ["Is Venus much smaller than Earth?", "No. It is close to Earth in size."],
    ],
  }),
  page({
    slug: "earth",
    field: "Planets",
    headline: "Fun facts about Earth",
    description: "Fun facts about Earth: liquid water, one moon, and a day of 24 hours. A sample deck and a spaced review schedule.",
    lede: "Earth is the third planet from the Sun and the only planet known to have liquid water on the surface and life. It has one moon.",
    tests: "About 71 percent of the surface is water. The air is mostly nitrogen, then oxygen. A day is 24 hours. A year is about 365.25 days, which is why a leap day is added.",
    cards: [
      ["Where is Earth?", "The third planet from the Sun."],
      ["How many moons does Earth have?", "One."],
      ["About how much of the surface is water?", "About 71 percent."],
      ["What is the air mostly made of?", "Nitrogen, then oxygen."],
      ["How long is a day?", "24 hours."],
      ["Why is there a leap day?", "A year is about 365.25 days."],
    ],
  }),
  page({
    slug: "mars",
    field: "Planets",
    headline: "Fun facts about Mars",
    description: "Fun facts about Mars: the red planet, two moons, and Olympus Mons. A sample deck and a spaced review schedule.",
    lede: "Mars is the fourth planet from the Sun. Iron oxide makes the surface red. It has two small moons, Phobos and Deimos.",
    tests: "A day on Mars, called a sol, is about 24 hours and 37 minutes. The atmosphere is thin and mostly carbon dioxide. Olympus Mons is the tallest volcano in the solar system. Ice caps sit at the poles.",
    cards: [
      ["Why is Mars red?", "Iron oxide on the surface."],
      ["What are the moons of Mars?", "Phobos and Deimos."],
      ["How long is a day on Mars?", "About 24 hours and 37 minutes."],
      ["What is Olympus Mons?", "The tallest volcano in the solar system."],
      ["What is the atmosphere mostly?", "Carbon dioxide, and it is thin."],
      ["What is at the poles?", "Ice caps."],
    ],
  }),
  page({
    slug: "jupiter",
    field: "Planets",
    headline: "Fun facts about Jupiter",
    description: "Fun facts about Jupiter: the largest planet, the Great Red Spot, and a short day. A sample deck and a spaced review schedule.",
    lede: "Jupiter is the largest planet. It is a gas giant made mostly of hydrogen and helium. The Great Red Spot is a storm that has lasted for centuries.",
    tests: "A day on Jupiter is about 10 hours. It has faint rings. Ganymede, one of its moons, is the largest moon in the solar system. The moon count is over 90 and still changes as new ones are confirmed.",
    cards: [
      ["Which planet is the largest?", "Jupiter."],
      ["What is Jupiter mostly made of?", "Hydrogen and helium."],
      ["What is the Great Red Spot?", "A giant storm."],
      ["How long is a day on Jupiter?", "About 10 hours."],
      ["What is Ganymede?", "Jupiter's largest moon, and the largest moon in the solar system."],
      ["How many moons does Jupiter have?", "More than 90. The count still changes."],
    ],
  }),
  page({
    slug: "saturn",
    field: "Planets",
    headline: "Fun facts about Saturn",
    description: "Fun facts about Saturn: the rings, a density lower than water, and the moon Titan. A sample deck and a spaced review schedule.",
    lede: "Saturn is the sixth planet from the Sun. Its rings are made of ice and rock. It is a gas giant, and it is the least dense planet.",
    tests: "Saturn's average density is lower than water. Titan, its largest moon, has a thick atmosphere. A day is about 10.7 hours. Like Jupiter, the moon count keeps changing.",
    cards: [
      ["What are Saturn's rings made of?", "Pieces of ice and rock."],
      ["How dense is Saturn?", "Less dense than water. It is the least dense planet."],
      ["What is Titan?", "Saturn's largest moon. It has a thick atmosphere."],
      ["How long is a day on Saturn?", "About 10.7 hours."],
      ["Is Saturn a gas giant?", "Yes. It is mostly hydrogen and helium."],
      ["Is the moon count finished?", "No. New moons are still confirmed."],
    ],
  }),
  page({
    slug: "uranus",
    field: "Planets",
    headline: "Fun facts about Uranus",
    description: "Fun facts about Uranus: an ice giant that spins on its side. A sample deck and a spaced review schedule.",
    lede: "Uranus is an ice giant and the seventh planet from the Sun. It rotates on its side, with a tilt of about 98 degrees. Methane in the air gives it a pale blue-green color.",
    tests: "William Herschel discovered Uranus in 1781. It has faint rings. A year is about 84 Earth years. It is colder than the gas giants closer to the Sun.",
    cards: [
      ["What kind of planet is Uranus?", "An ice giant."],
      ["How is its spin unusual?", "It rotates on its side, tilted about 98 degrees."],
      ["Why does it look blue-green?", "Methane in the atmosphere."],
      ["Who discovered it, and when?", "William Herschel, in 1781."],
      ["Does Uranus have rings?", "Yes. They are faint."],
      ["How long is a year on Uranus?", "About 84 Earth years."],
    ],
  }),
  page({
    slug: "neptune",
    field: "Planets",
    headline: "Fun facts about Neptune",
    description: "Fun facts about Neptune: the farthest planet, found by math before it was seen. A sample deck and a spaced review schedule.",
    lede: "Neptune is the farthest known planet from the Sun and an ice giant. Methane makes it look blue. Astronomers predicted where it would be before anyone saw it.",
    tests: "Neptune was found in 1846. A year is about 165 Earth years. Its winds are among the fastest in the solar system. Triton, its largest moon, orbits backwards.",
    cards: [
      ["Which planet is farthest from the Sun?", "Neptune."],
      ["Why is Neptune blue?", "Methane in the atmosphere absorbs red light."],
      ["How was Neptune found?", "Math predicted its place. It was seen in 1846."],
      ["How long is a year on Neptune?", "About 165 Earth years."],
      ["What is odd about Triton?", "It orbits backwards. It is Neptune's largest moon."],
      ["Is Pluto farther out?", "Pluto is a dwarf planet, not the ninth planet."],
    ],
  }),
];

const usCapitals = [
  ["montgomery", "Montgomery", "Alabama", "It sits on the Alabama River. The 1955 bus boycott began in this city."],
  ["juneau", "Juneau", "Alaska", "No road connects Juneau to the rest of the state. People arrive by boat or plane."],
  ["phoenix", "Phoenix", "Arizona", "It sits in the Sonoran Desert."],
  ["little-rock", "Little Rock", "Arkansas", "It sits on the Arkansas River. The Little Rock Nine entered Central High School in 1957."],
  ["sacramento", "Sacramento", "California", "The American and Sacramento rivers meet here."],
  ["denver", "Denver", "Colorado", "The city is about a mile above sea level. That is why it is called the Mile High City."],
  ["hartford", "Hartford", "Connecticut", "It sits on the Connecticut River."],
  ["dover", "Dover", "Delaware", "Delaware ratified the Constitution here on December 7, 1787, the first state to do so."],
  ["tallahassee", "Tallahassee", "Florida", "It is in the Florida Panhandle, inland from the Gulf coast."],
  ["atlanta", "Atlanta", "Georgia", "It sits in the Piedmont, the foothills below the Appalachian Mountains."],
  ["honolulu", "Honolulu", "Hawaii", "It is on the island of Oahu. It is the only state capital in the Pacific islands."],
  ["boise", "Boise", "Idaho", "It sits on the Boise River."],
  ["springfield", "Springfield", "Illinois", "Abraham Lincoln lived here. His tomb is here."],
  ["indianapolis", "Indianapolis", "Indiana", "It sits on the White River. The Soldiers and Sailors Monument stands on Monument Circle."],
  ["des-moines", "Des Moines", "Iowa", "The Raccoon River meets the Des Moines River here."],
  ["topeka", "Topeka", "Kansas", "It sits on the Kansas River."],
  ["frankfort", "Frankfort", "Kentucky", "It sits on the Kentucky River, in a bend of the river."],
  ["baton-rouge", "Baton Rouge", "Louisiana", "The name is French for red stick. The city sits on the Mississippi River."],
  ["augusta", "Augusta", "Maine", "It sits on the Kennebec River."],
  ["annapolis", "Annapolis", "Maryland", "It sits on the Severn River near the Chesapeake Bay. The U.S. Naval Academy is here."],
  ["boston", "Boston", "Massachusetts", "It sits on a harbor. The city was founded in 1630."],
  ["lansing", "Lansing", "Michigan", "It sits on the Grand River. Detroit is larger, and Detroit is not the capital."],
  ["saint-paul", "Saint Paul", "Minnesota", "It sits on the Mississippi River, beside Minneapolis."],
  ["jackson", "Jackson", "Mississippi", "It sits on the Pearl River."],
  ["jefferson-city", "Jefferson City", "Missouri", "It sits on the Missouri River and is named for Thomas Jefferson."],
  ["helena", "Helena", "Montana", "It is in the Rocky Mountains. Billings is larger."],
  ["lincoln", "Lincoln", "Nebraska", "Omaha is larger. Lincoln is the capital."],
  ["carson-city", "Carson City", "Nevada", "It is in western Nevada and is named for Kit Carson."],
  ["concord", "Concord", "New Hampshire", "It sits on the Merrimack River."],
  ["trenton", "Trenton", "New Jersey", "It sits on the Delaware River. Washington crossed the river nearby in December 1776."],
  ["santa-fe", "Santa Fe", "New Mexico", "The Spanish made it a capital in 1610. At about 7,000 feet, it is the highest state capital."],
  ["albany", "Albany", "New York", "It sits on the Hudson River. New York City is not the capital."],
  ["raleigh", "Raleigh", "North Carolina", "The city is named for Sir Walter Raleigh."],
  ["bismarck", "Bismarck", "North Dakota", "It sits on the Missouri River."],
  ["columbus", "Columbus", "Ohio", "It sits on the Scioto River and is the state's largest city."],
  ["oklahoma-city", "Oklahoma City", "Oklahoma", "It is both the capital and the largest city in the state."],
  ["salem", "Salem", "Oregon", "It sits on the Willamette River. Portland is larger."],
  ["harrisburg", "Harrisburg", "Pennsylvania", "It sits on the Susquehanna River. Philadelphia is not the capital."],
  ["providence", "Providence", "Rhode Island", "Roger Williams founded it. It sits at the head of Narragansett Bay."],
  ["columbia", "Columbia", "South Carolina", "The Broad and Saluda rivers meet here and form the Congaree River."],
  ["pierre", "Pierre", "South Dakota", "It sits on the Missouri River and is one of the smallest state capitals."],
  ["nashville", "Nashville", "Tennessee", "It sits on the Cumberland River."],
  ["austin", "Austin", "Texas", "It sits on the Colorado River of Texas, not the Colorado River that carved the Grand Canyon."],
  ["salt-lake-city", "Salt Lake City", "Utah", "It sits on the Wasatch Front, next to the Great Salt Lake. The lake is too salty for fish."],
  ["montpelier", "Montpelier", "Vermont", "It is the smallest state capital by population."],
  ["richmond", "Richmond", "Virginia", "It sits on the James River."],
  ["olympia", "Olympia", "Washington", "It sits at the south end of Puget Sound. Seattle is not the capital."],
  ["charleston", "Charleston", "West Virginia", "It sits where the Elk and Kanawha rivers meet. It is not the Charleston in South Carolina."],
  ["madison", "Madison", "Wisconsin", "It sits on an isthmus between Lake Mendota and Lake Monona."],
  ["cheyenne", "Cheyenne", "Wyoming", "It sits on the high plains."],
];

const usPages = usCapitals.map(([slug, city, state, extra]) =>
  page({
    slug,
    field: "US state capitals",
    headline: `Fun facts about ${city}`,
    description: `Fun facts about ${city}, the capital of ${state}. A sample deck and a spaced review schedule.`,
    lede: `${city} is the capital of ${state}. ${extra}`,
    tests: `The state government meets in ${city}. ${extra}`,
    cards: [
      [`What state is ${city} the capital of?`, state + "."],
      [`What is a fact about ${city}?`, extra],
      [`Does the state government meet in the largest city?`, state === "Ohio" || state === "Oklahoma" || state === "Georgia" || state === "Massachusetts" || state === "Indiana" || state === "Hawaii" || state === "Arizona" || state === "Colorado" || state === "Idaho" || state === "Mississippi" || state === "Utah" ? `In ${state}, check the city itself. ${city} is the capital.` : `${city} is the capital. In many states the largest city is a different place.`],
    ],
    scheduleStart: `Start with which state ${city} governs.`,
  }),
);

const animal = (slug, name, cards) =>
  page({
    slug,
    field: "Animals",
    headline: `Fun facts about ${name}`,
    description: `Fun facts about the ${name}. A sample deck and a spaced review schedule.`,
    lede: cards[0][1].replace(/\.$/, "") + ".",
    tests: cards.map((item) => item[1]).slice(0, 3).join(" "),
    cards,
  });

const animals = [
  animal("dog", "dogs", [["What kind of animal is a dog?", "A mammal, in the dog family."], ["How many teeth does an adult dog have?", "42."], ["How does a dog cool off?", "Mostly by panting. It does not sweat through the skin the way a person does."], ["Is a wagging tail always happiness?", "No. A wag can also mean the dog is alert or unsure."]]),
  animal("cat", "cats", [["What kind of animal is a cat?", "A mammal."], ["How many teeth does an adult cat have?", "30."], ["Can a cat see in total darkness?", "No. It sees better than a person in dim light, and it still needs some light."], ["Do all cats have fully retractable claws?", "Most do. A cheetah's claws are only partly retractable."]]),
  animal("horse", "horses", [["What kind of animal is a horse?", "A mammal and a grazer."], ["How is a horse's height measured?", "In hands. One hand is 4 inches."], ["Can a horse sleep standing up?", "Yes. It can lock its legs. It also lies down for deeper sleep."], ["What is a baby horse called?", "A foal."]]),
  animal("rabbit", "rabbits", [["What kind of animal is a rabbit?", "A mammal."], ["Are a rabbit's teeth done growing?", "No. The front teeth keep growing, and chewing wears them down."], ["What is a group of rabbits called?", "A colony, or sometimes a fluffle."], ["Is a rabbit a rodent?", "No. Rabbits are lagomorphs. They have a second pair of small upper front teeth."]]),
  animal("hamster", "hamsters", [["What kind of animal is a hamster?", "A small rodent."], ["When is a hamster most active?", "At night and at dusk."], ["Why do hamsters stuff their cheeks?", "The cheek pouches carry food back to the burrow."], ["Do hamsters live in groups in a cage?", "Many species fight if they share a small cage. Syrian hamsters are kept alone."]]),
  animal("guinea-pig", "guinea pigs", [["What kind of animal is a guinea pig?", "A rodent from South America. It is not a pig, and it is not from Guinea."], ["What do guinea pigs eat?", "Grass and hay, plus vitamin C. They cannot make their own vitamin C."], ["When are they active?", "In the day."], ["What sound do they make when they want food?", "A whistle, often called wheeking."]]),
  animal("ferret", "ferrets", [["What kind of animal is a ferret?", "A mammal in the weasel family."], ["When is a ferret most active?", "At dawn and dusk."], ["Do ferrets sleep a lot?", "Yes. A pet ferret may sleep well over half the day."], ["What is a group of ferrets called?", "A business."]]),
  animal("goldfish", "goldfish", [["What kind of animal is a goldfish?", "A fish, bred from a carp."], ["Does a goldfish have a three-second memory?", "No. Goldfish can remember places and signals for months."], ["Do goldfish have eyelids?", "No."], ["Where were goldfish first kept?", "In China, more than a thousand years ago."]]),
  animal("parrot", "parrots", [["What kind of animal is a parrot?", "A bird."], ["Why can some parrots copy speech?", "They learn sounds. The copy is not the same as understanding every word."], ["How many toes does a parrot have?", "Four. Two point forward and two point back."], ["What do parrots eat?", "Seeds, fruit, nuts, and, for many species, some insects."]]),
  animal("turtle", "turtles", [["What kind of animal is a turtle?", "A reptile with a shell."], ["Is the shell a house it can leave?", "No. The shell is part of the body. The ribs and backbone are fused to it."], ["What is the difference people draw with a tortoise?", "In common speech a tortoise lives on land and a turtle spends time in water. Both are turtles in the wider group."], ["Do turtles have teeth?", "No. They have a beak."]]),
  animal("cow", "cows", [["What kind of animal is a cow?", "A mammal. Cattle are grazers."], ["How many stomach compartments does a cow have?", "Four. Food is chewed, swallowed, brought back up, and chewed again."], ["What is the word for a baby cow?", "A calf."], ["Why do cows stand in a group?", "They are herd animals. A lone cow is the unusual case."]]),
  animal("pig", "pigs", [["What kind of animal is a pig?", "A mammal."], ["Are pigs dirty by nature?", "They roll in mud to cool off. They have few sweat glands. Given room, they keep a toilet area away from the bed."], ["How good is a pig's sense of smell?", "Strong enough that people train pigs to find truffles underground."], ["What is a baby pig called?", "A piglet."]]),
  animal("sheep", "sheep", [["What kind of animal is a sheep?", "A mammal."], ["What is sheep hair called?", "Wool. It keeps growing and is cut as a fleece."], ["What is a baby sheep called?", "A lamb."], ["What is a group of sheep called?", "A flock."]]),
  animal("goat", "goats", [["What kind of animal is a goat?", "A mammal."], ["What is unusual about a goat's eyes?", "The pupils are rectangular, which gives a wide view."], ["Can goats eat anything?", "No. They are browsers and they are curious. Tin cans and paper are not food."], ["What is a baby goat called?", "A kid."]]),
  animal("chicken", "chickens", [["What kind of animal is a chicken?", "A bird."], ["Which came first in the life cycle you can see?", "A hen lays an egg. A chick hatches from a fertilized egg."], ["Do chickens have teeth?", "No. They swallow grit, and the gizzard grinds the food."], ["What is a group of chickens called?", "A flock."]]),
  animal("duck", "ducks", [["What kind of animal is a duck?", "A bird."], ["Why does a duck float?", "Its feathers trap air, and oil from a gland near the tail sheds water."], ["What are the feet like?", "Webbed, for paddling."], ["Do all ducks quack?", "No. Many species whistle, grunt, or peep. The loud quack is the female mallard."]]),
  animal("donkey", "donkeys", [["What kind of animal is a donkey?", "A mammal in the horse family."], ["What is a donkey known for hearing?", "Long ears. Hearing is sharp."], ["What is a baby donkey called?", "A foal."], ["What is a mule?", "The offspring of a male donkey and a female horse. A mule is usually unable to have offspring of its own."]]),
  animal("llama", "llamas", [["What kind of animal is a llama?", "A mammal from South America, in the camel family."], ["What were llamas used for?", "People in the Andes used them to carry packs."], ["Does a llama have a hump?", "No. Camels have humps. Llamas do not."], ["Why does a llama spit?", "Mostly at other llamas, to settle an argument over food or rank."]]),
  animal("alpaca", "alpacas", [["What kind of animal is an alpaca?", "A South American mammal in the camel family, smaller than a llama."], ["What are alpacas kept for?", "Their fleece."], ["Do alpacas carry heavy packs?", "No. Llamas were the pack animals. Alpacas are smaller."], ["What sound do they make?", "A hum."]]),
  animal("turkey", "turkeys", [["What kind of animal is a turkey?", "A bird."], ["Do wild turkeys fly?", "Yes. They roost in trees. The flight is short and strong, not a long migration."], ["What is the flap of skin on the head called?", "A snood, on the beak, and a wattle on the throat."], ["Can a turkey drown by looking up in the rain?", "No. That is a myth."]]),
  animal("lion", "lions", [["What kind of animal is a lion?", "A big cat."], ["Who hunts in a typical pride?", "Lionesses do most of the hunting. Males defend the territory."], ["What is a group of lions called?", "A pride."], ["Where do lions live?", "Mostly in Africa, south of the Sahara. A small population lives in Gir, India."]]),
  animal("tiger", "tigers", [["What kind of animal is a tiger?", "The largest living cat."], ["Are the stripes only in the fur?", "No. The skin is striped too."], ["Do tigers live in groups?", "Adults are mostly solitary, except a mother with cubs."], ["Where do wild tigers live?", "In Asia. They are not native to Africa."]]),
  animal("elephant", "elephants", [["What kind of animal is an elephant?", "The largest living land animal. There are African and Asian elephants."], ["What is a trunk?", "A nose and an upper lip, with tens of thousands of muscles."], ["How can you tell the two elephants apart?", "African elephants have larger ears. Asian elephants have smaller ears."], ["Are elephant tusks teeth?", "Yes. They are incisors."]]),
  animal("giraffe", "giraffes", [["What kind of animal is a giraffe?", "The tallest living land animal."], ["How many neck bones does a giraffe have?", "Seven, the same number as a person. Each bone is much longer."], ["How long does a giraffe sleep?", "Often only a few hours a day, in short naps."], ["What is a group of giraffes called?", "A tower."]]),
  animal("zebra", "zebras", [["What kind of animal is a zebra?", "An African mammal in the horse family."], ["Is each stripe pattern the same?", "No. The pattern is individual, like a fingerprint."], ["Are zebras white with black stripes or black with white?", "The skin is dark. The coat grows black and white stripes."], ["What are the stripes for?", "They break up the outline and also bother biting flies."]]),
  animal("giant-panda", "giant pandas", [["What kind of animal is a giant panda?", "A bear. It lives in mountain forests in China."], ["What does it eat?", "Almost only bamboo, even though its body is built more like a meat-eater."], ["Why is the birth rate low?", "A female is fertile for only a few days a year."], ["Is a red panda the same animal?", "No. A red panda is a different family."]]),
  animal("red-panda", "red pandas", [["What kind of animal is a red panda?", "A small mammal from the Himalayas and southwest China. It is not a bear and not a giant panda."], ["What does it eat?", "Mostly bamboo, plus fruit and insects."], ["When is it active?", "Mostly at dawn, dusk, and night."], ["What is the tail for?", "Balance in trees, and warmth when the animal curls up."]]),
  animal("koala", "koalas", [["What kind of animal is a koala?", "A marsupial from Australia. It is not a bear."], ["What does it eat?", "Eucalyptus leaves, which are low in energy and hard to digest."], ["How much does a koala sleep?", "Often 18 to 20 hours a day."], ["Where does the baby live at first?", "In the mother's pouch."]]),
  animal("kangaroo", "kangaroos", [["What kind of animal is a kangaroo?", "A marsupial from Australia."], ["How does it move fast?", "It hops on the hind legs. The tail helps it balance."], ["Where does a newborn go?", "Into the pouch, where it stays and nurses."], ["Can a kangaroo walk backwards?", "Not in a normal walk. The hop goes forward."]]),
  animal("wolf", "wolves", [["What kind of animal is a wolf?", "A wild dog. The gray wolf is the ancestor of the domestic dog."], ["How do wolves live?", "In a family pack, usually a breeding pair and their offspring."], ["What is a howl for?", "To find the pack and to mark that a place is occupied."], ["Do wolves hunt people as a habit?", "No. Attacks on people are rare. The usual prey is hoofed animals."]]),
  animal("fox", "foxes", [["What kind of animal is a fox?", "A small member of the dog family."], ["When is a red fox most active?", "At night and at dusk."], ["What does a fox eat?", "It is an omnivore: rodents, birds, fruit, and insects."], ["Is a fennec fox the same as a red fox?", "No. The fennec is a desert fox with very large ears."]]),
  animal("brown-bear", "brown bears", [["What kind of animal is a brown bear?", "A large bear. Grizzlies are a kind of brown bear."], ["What does it eat?", "Almost anything: plants, fish, insects, and meat."], ["What is winter sleep called?", "Torpor. It is a long rest, not the deepest kind of hibernation."], ["Where do brown bears live?", "In northern North America, Europe, and Asia."]]),
  animal("polar-bear", "polar bears", [["What kind of animal is a polar bear?", "A bear of the Arctic sea ice."], ["What color is the fur?", "The hairs are clear, and the coat looks white. The skin is black."], ["What does it hunt?", "Mostly seals."], ["Is a polar bear a kind of brown bear?", "They are close relatives and can rarely interbreed. They are still classed as different species."]]),
  animal("gorilla", "gorillas", [["What kind of animal is a gorilla?", "The largest living primate."], ["What does it eat?", "Mostly leaves, stems, and fruit."], ["How does a group work?", "A troop is led by a silverback, an adult male with a gray saddle of hair."], ["Do gorillas beat their chests to attack?", "Chest beats are a display. They can mean a warning, not an automatic charge."]]),
  animal("chimpanzee", "chimpanzees", [["What kind of animal is a chimpanzee?", "An ape. People are its closest living relatives, along with bonobos."], ["Do chimpanzees use tools?", "Yes. They use sticks to fish for termites and stones to crack nuts."], ["What do they eat?", "Fruit, leaves, insects, and sometimes meat."], ["Is a chimpanzee a monkey?", "No. It is an ape. Apes do not have tails."]]),
  animal("hippopotamus", "hippos", [["What kind of animal is a hippo?", "A large African mammal. Its closest living relatives are whales and dolphins, not pigs."], ["Where does it spend the day?", "In water, to keep cool. It grazes on land at night."], ["Can a hippo swim like a fish?", "It cannot float well. It walks and pushes off the bottom."], ["How dangerous is a hippo?", "Very. It defends the river and the calf."]]),
  animal("rhinoceros", "rhinos", [["What kind of animal is a rhino?", "A large mammal. There are species in Africa and Asia."], ["What is the horn made of?", "Keratin, the same protein as hair and fingernails. It is not bone."], ["What does a rhino eat?", "Plants."], ["Why are rhinos endangered?", "People kill them for the horn. The horn has no special medicine in it."]]),
  animal("cheetah", "cheetahs", [["What kind of animal is a cheetah?", "A cat built for a short sprint."], ["How fast can it run?", "About 60 to 70 miles an hour, in a burst, not for a long chase."], ["Why are the claws different?", "They do not pull all the way in, which helps grip the ground."], ["What are the black lines on the face for?", "They cut the glare, a bit like eye black on an athlete."]]),
  animal("leopard", "leopards", [["What kind of animal is a leopard?", "A big cat from Africa and Asia."], ["Where does it put a kill?", "Often up a tree, away from lions and hyenas."], ["What is a black panther?", "Usually a leopard, or in the Americas a jaguar, with extra dark pigment. The spots are still there."], ["Is a leopard the same as a jaguar?", "No. Jaguars are stockier and live in the Americas."]]),
  animal("jaguar", "jaguars", [["What kind of animal is a jaguar?", "The largest cat in the Americas."], ["How do the spots differ from a leopard's?", "A jaguar's rosettes often have a dot in the middle."], ["What does it eat?", "It is a strong hunter. It takes capybara, deer, and caimans, and it can bite through a skull."], ["Where does it live?", "From Mexico through the Amazon. It is rare at the north end of that range."]]),
  animal("deer", "deer", [["What kind of animal is a deer?", "A hoofed mammal."], ["What are antlers?", "Bone. In most deer, males grow and shed them each year."], ["Do females have antlers?", "In caribou, also called reindeer, females grow antlers too. In most other deer, they do not."], ["What do deer eat?", "Leaves, twigs, grass, and fruit."]]),
  animal("moose", "moose", [["What kind of animal is a moose?", "The largest living deer."], ["Who grows the antlers?", "Bulls. The antlers are shed each winter."], ["Where do moose live?", "Northern forests of North America, Europe, and Asia. In Europe the same animal is called an elk."], ["What is confusing about the word elk?", "In North America, elk means a different deer, the wapiti."]]),
  animal("squirrel", "squirrels", [["What kind of animal is a squirrel?", "A rodent."], ["Why does it bury nuts?", "It stores food. It finds many of the caches later and forgets some, which plants trees."], ["Can a squirrel come down a tree headfirst?", "Yes. Its ankles turn so the claws hook the bark."], ["Do squirrels hibernate all winter?", "Tree squirrels do not. They stay active and use their stores."]]),
  animal("raccoon", "raccoons", [["What kind of animal is a raccoon?", "A mammal with a mask of dark fur and a ringed tail."], ["How sensitive are the front paws?", "Very. A raccoon feels food in water with its hands."], ["Is it washing the food?", "The dunking is more about feeling than about cleaning."], ["Where does it live now?", "Native to the Americas, and introduced in parts of Europe and Japan."]]),
  animal("otter", "otters", [["What kind of animal is an otter?", "A mammal in the weasel family, built for water."], ["What keeps it warm?", "Very dense fur, not blubber."], ["Do sea otters use tools?", "Yes. They crack shellfish on a stone held on the chest."], ["Do sea otters hold hands?", "They sometimes raft together and hold on so they do not drift apart."]]),
  animal("dolphin", "dolphins", [["What kind of animal is a dolphin?", "A whale, and a mammal. It is not a fish."], ["How does it breathe?", "Through a blowhole. It must come to the surface."], ["What is echolocation?", "Clicks that bounce back and tell the dolphin where things are."], ["Do dolphins sleep with the whole brain?", "No. One side of the brain rests while the other stays awake enough to breathe and watch."]]),
  animal("blue-whale", "blue whales", [["What kind of animal is a blue whale?", "The largest animal known to have lived."], ["What does it eat?", "Tiny shrimp-like animals called krill, strained through baleen."], ["How big is the heart?", "About the size of a small car."], ["Is it a fish?", "No. It is a mammal and it breathes air."]]),
  animal("orca", "orcas", [["What kind of animal is an orca?", "A dolphin, and the largest one. It is also called a killer whale."], ["What does it eat?", "It depends on the group: fish, seals, or even other whales."], ["How do they hunt?", "In families that teach a local method. The method is learned, not only instinct."], ["Are orcas whales?", "In casual speech yes. In classification they are oceanic dolphins."]]),
  animal("bat", "bats", [["What kind of animal is a bat?", "The only mammal that truly flies."], ["Are bats blind?", "No. Many see well. Many also hunt with echolocation."], ["What do bats eat?", "It depends on the species: insects, fruit, nectar, or, for vampire bats, blood."], ["Why do they hang upside down?", "The feet lock when the body hangs, so sleeping costs little effort."]]),
  animal("hedgehog", "hedgehogs", [["What kind of animal is a hedgehog?", "A small insect-eating mammal."], ["What are the spines?", "Stiff hairs, not poisonous quills."], ["What does it do when it is scared?", "It rolls into a ball."], ["Is a hedgehog a porcupine?", "No. Porcupines are rodents. Hedgehogs are not."]]),
  animal("sloth", "sloths", [["What kind of animal is a sloth?", "A slow tree mammal from Central and South America."], ["Why is it slow?", "Its leaf diet gives little energy."], ["What lives in the fur?", "Algae and moths. The green tint is camouflage."], ["How often does it come down?", "About once a week, often to defecate."]]),
  animal("camel", "camels", [["What kind of animal is a camel?", "A desert mammal. One-humped camels are dromedaries. Two-humped camels are Bactrian."], ["What is in the hump?", "Fat, not a tank of water."], ["How does it go without drinking?", "It stores water in the body, not in the hump, and it can lose a lot of water and recover."], ["What are the feet like?", "Wide pads that do not sink in sand."]]),
  animal("bison", "bison", [["What kind of animal is a bison?", "A large wild bovine of North America and Europe."], ["Is a bison a buffalo?", "In casual American speech yes. True buffalo are the African buffalo and the Asian water buffalo."], ["What nearly happened in the 1800s?", "Hunting drove the American bison close to extinction. Herds have been brought back."], ["What is the hump?", "Muscle and long spines on the shoulders, used to swing the head in snow."]]),
  animal("meerkat", "meerkats", [["What kind of animal is a meerkat?", "A small mongoose from southern Africa."], ["How does a group watch for danger?", "One stands guard while the others forage."], ["Where do they sleep?", "In burrows."], ["What do they eat?", "Insects, scorpions, and small animals. They are immune to some scorpion venom, not to every poison."]]),
  animal("seal", "seals", [["What kind of animal is a seal?", "A marine mammal. It comes ashore to rest and to give birth."], ["How does it stay warm?", "A layer of blubber."], ["What is the difference from a sea lion?", "A true seal has no outer ear flap and it wriggles on land. A sea lion can walk on its flippers."], ["What do seals eat?", "Fish, squid, and shellfish."]]),
  animal("walrus", "walruses", [["What kind of animal is a walrus?", "A large Arctic marine mammal."], ["What are the tusks?", "Long canine teeth. Both males and females grow them."], ["What are tusks used for?", "Hauling out onto ice, and for display."], ["What does a walrus eat?", "Clams and other animals on the sea floor, found with the sensitive whiskers."]]),
  animal("mouse", "mice", [["What kind of animal is a mouse?", "A small rodent."], ["Do a mouse's teeth stop growing?", "No. The incisors grow for life and are worn down by gnawing."], ["How good is its sense of smell?", "Strong. It relies on smell and whiskers more than on color vision."], ["Is a mouse the same as a rat?", "No. Rats are larger, with bigger heads and thicker tails."]]),
  animal("rat", "rats", [["What kind of animal is a rat?", "A rodent, larger than a mouse."], ["Do the front teeth stop growing?", "No. They grow for life."], ["Can rats swim?", "Yes. They are good swimmers."], ["Are rats dirty by nature?", "They groom often. They pick up disease when they live in dirty places, which is not the same as being unclean animals."]]),
  animal("skunk", "skunks", [["What kind of animal is a skunk?", "A mammal in the same broad group as weasels."], ["What is the spray?", "A sulfur smell from glands under the tail. It is a defense, used after a warning."], ["What is the warning?", "Stomping, a raised tail, and sometimes a handstand in the spotted skunk."], ["What does a skunk eat?", "Insects, grubs, eggs, and fruit."]]),
  animal("beaver", "beavers", [["What kind of animal is a beaver?", "A large rodent that builds dams."], ["Why does it build a dam?", "The pond hides the lodge entrance underwater."], ["What are the teeth like?", "The incisors are orange from iron in the enamel, and they never stop growing."], ["Is the tail a fin?", "It is flat and scaly. It steers in water and slaps as an alarm."]]),
  animal("penguin", "penguins", [["What kind of animal is a penguin?", "A bird that does not fly in the air. It flies underwater."], ["Do all penguins live on ice?", "No. Galápagos penguins live at the equator. Many species live in temperate places."], ["What do they eat?", "Fish, krill, and squid."], ["How do emperor penguins keep an egg warm?", "The male balances it on his feet, under a flap of skin, through the Antarctic winter."]]),
  animal("eagle", "eagles", [["What kind of animal is an eagle?", "A bird of prey."], ["How good is the eyesight?", "Much sharper than a person's, so it can see prey from high up."], ["What is a bald eagle's head?", "White feathers, not bare skin. Bald here is an old word for white."], ["What do eagles eat?", "Fish, mammals, and other birds, depending on the species."]]),
  animal("owl", "owls", [["What kind of animal is an owl?", "A bird of prey, mostly active at night."], ["Why is the flight quiet?", "Soft fringe on the feathers breaks up the sound."], ["Can an owl turn its head all the way around?", "No. It turns about 270 degrees, not a full circle."], ["Why are the eyes fixed forward?", "They do not move in the sockets. The neck does the looking."]]),
  animal("flamingo", "flamingos", [["What kind of animal is a flamingo?", "A wading bird."], ["Why is it pink?", "Pigments from the algae and shrimp it eats. A flamingo on a poor diet fades."], ["How does it eat?", "The beak works upside down and filters food from the water."], ["What is a group of flamingos called?", "A flamboyance."]]),
  animal("peacock", "peacocks", [["What is a peacock?", "The male peafowl. The female is a peahen."], ["What is the train?", "Long upper tail coverts, not the true tail. The bird lifts them to display."], ["Why the eyespots?", "A display for a mate."], ["Can peafowl fly?", "Yes, for a short burst, up into a tree to roost."]]),
  animal("hummingbird", "hummingbirds", [["What kind of animal is a hummingbird?", "A very small bird of the Americas."], ["Can it fly backwards?", "Yes. It can also hover."], ["What does it eat?", "Nectar, plus small insects for protein."], ["Why does the heart beat so fast?", "Hovering costs a huge amount of energy. At night many of them drop into a torpor to save fuel."]]),
  animal("crow", "crows", [["What kind of animal is a crow?", "A songbird in the corvid family, with jays and ravens."], ["Are crows intelligent?", "Yes. They use tools and they recognize faces."], ["What is a group of crows called?", "A murder."], ["What is the difference from a raven?", "A raven is larger, with a heavier beak and a wedge-shaped tail."]]),
  animal("swan", "swans", [["What kind of animal is a swan?", "A large water bird, related to ducks and geese."], ["Do swans stay with one mate?", "Many pairs stay together for years. They do not always mate for life if a partner dies."], ["What do they eat?", "Water plants, and some insects."], ["Is a swan song real?", "The idea that a swan sings once, at death, is a myth."]]),
  animal("ostrich", "ostriches", [["What kind of animal is an ostrich?", "The largest living bird. It cannot fly."], ["How fast can it run?", "Faster than a horse over a short distance, about 40 miles an hour."], ["Does an ostrich bury its head in the sand?", "No. That is a myth. It lowers its head to the ground to feed or to hide the outline."], ["How big is the egg?", "The largest of any living bird, about 3 pounds."]]),
  animal("pigeon", "pigeons", [["What kind of animal is a pigeon?", "A bird. The city pigeon is a rock dove."], ["Can pigeons find home from far away?", "Yes. They were used to carry messages."], ["What do city pigeons eat?", "Seeds, and whatever people drop."], ["Do pigeons make milk?", "Both parents make a crop milk to feed the chicks. It is not the milk of a mammal."]]),
  animal("woodpecker", "woodpeckers", [["What kind of animal is a woodpecker?", "A bird that drills into wood for insects."], ["Why doesn't the brain get damaged?", "A small brain, a tight fit in the skull, and a tongue that wraps behind the skull in many species."], ["What is the long tongue for?", "Reaching insects inside the hole."], ["Why the drumming?", "To find food, to dig a nest, and to signal."]]),
  animal("toucan", "toucans", [["What kind of animal is a toucan?", "A bird of tropical American forests."], ["What is the bill for?", "Reaching fruit. It is light, made of bone struts with keratin over them, not solid."], ["Does the bill help with heat?", "Yes. The bird can shed heat through it."], ["What do toucans eat?", "Mostly fruit, plus insects and sometimes eggs."]]),
  animal("snake", "snakes", [["What kind of animal is a snake?", "A reptile with no legs."], ["Do snakes hear like people?", "They have no outer ears. They feel vibrations and hear some low sounds."], ["How do they smell?", "The tongue picks up chemicals and passes them to an organ in the roof of the mouth."], ["Are all snakes venomous?", "No. Most are not."]]),
  animal("crocodile", "crocodiles", [["What kind of animal is a crocodile?", "A large reptile that lives in warm water."], ["How is it different from an alligator?", "A crocodile's snout is narrower, and a tooth on the lower jaw shows when the mouth is shut."], ["What do the teeth do?", "They are replaced throughout life."], ["Does a crocodile cry?", "It sheds tears while eating. The tears are not sadness. They flush the eyes."]]),
  animal("alligator", "alligators", [["What kind of animal is an alligator?", "A reptile. American alligators live in the southeastern United States. Chinese alligators are much rarer."], ["How is the snout different from a crocodile's?", "Broader and more U-shaped."], ["Where does it spend the winter in the north of its range?", "In a burrow, or in a hole in the mud, with the nose at the surface."], ["What does it eat?", "Fish, turtles, birds, and mammals."]]),
  animal("frog", "frogs", [["What kind of animal is a frog?", "An amphibian. The young are usually tadpoles."], ["How does it drink?", "It absorbs water through the skin. It does not sip the way a person does."], ["Can some frogs freeze?", "Wood frogs can freeze and thaw. Ice forms outside the cells, and sugars protect the inside."], ["What is the difference from a toad?", "In common speech a toad has drier, bumpier skin and spends more time on land. Both are frogs in the wider group."]]),
  animal("chameleon", "chameleons", [["What kind of animal is a chameleon?", "A lizard."], ["Why does it change color?", "Mood, temperature, and signaling, more than a perfect match to every background."], ["How do the eyes work?", "Each eye can look in a different direction."], ["How does the tongue catch food?", "It shoots out, longer than the body in some species, and the tip sticks to the insect."]]),
  animal("komodo-dragon", "Komodo dragons", [["What kind of animal is a Komodo dragon?", "The largest living lizard. It lives on a few Indonesian islands."], ["What does it eat?", "Deer, pigs, and carrion. It can take animals as large as a buffalo."], ["Is the bite venomous?", "The bite delivers venom that drops blood pressure and stops clotting. Bacteria were once blamed for the whole effect."], ["How do the young survive?", "They climb trees, away from hungry adults."]]),
  animal("iguana", "iguanas", [["What kind of animal is an iguana?", "A lizard."], ["What does a green iguana eat?", "Mostly leaves, flowers, and fruit."], ["What is the flap under the chin?", "A dewlap, used for display."], ["Where do green iguanas live?", "In tropical America. They are also introduced in southern Florida."]]),
  animal("gecko", "geckos", [["What kind of animal is a gecko?", "A small lizard."], ["How does it walk on a ceiling?", "Toe pads with tiny hairs grip the surface. It is a physical stick, not glue."], ["Can geckos drop the tail?", "Many can. The tail keeps twitching and the gecko grows a new one."], ["Do geckos blink?", "Most have no eyelids. They lick the eye to clean it."]]),
  animal("sea-turtle", "sea turtles", [["What kind of animal is a sea turtle?", "A turtle that lives in the ocean and comes ashore to nest."], ["Where does it lay eggs?", "On a beach, often the region where it hatched."], ["What do the hatchlings use to find the sea?", "They move toward the brighter horizon. Artificial lights can pull them the wrong way."], ["How many species are there?", "Seven."]]),
  animal("toad", "toads", [["What kind of animal is a toad?", "A frog that spends more time on land. The skin is drier and bumpier."], ["What are the bumps?", "Glands. Some produce a mild poison. They are not warts you can catch."], ["Can you get warts from a toad?", "No."], ["What do toads eat?", "Insects, slugs, and worms."]]),
  animal("shark", "sharks", [["What kind of animal is a shark?", "A fish. The skeleton is cartilage, not bone."], ["Do sharks have to keep swimming to breathe?", "Some do. Others can pump water over the gills while they rest."], ["How are the teeth replaced?", "In rows, throughout life."], ["Do sharks get cancer?", "Yes. The claim that they do not is false."]]),
  animal("octopus", "octopuses", [["What kind of animal is an octopus?", "A mollusk, related to snails and clams."], ["How many hearts does it have?", "Three. Two pump blood through the gills."], ["What color is the blood?", "Blue, because it uses copper, not iron, to carry oxygen."], ["Can it solve problems?", "Yes. It can open jars and use coconut shells as shelter."]]),
  animal("jellyfish", "jellyfish", [["What kind of animal is a jellyfish?", "A soft animal with no brain, no heart, and no bones."], ["How does it swim?", "It pulses the bell."], ["What are the stings?", "Cells on the tentacles that fire a tiny barb."], ["Is a box jellyfish the same as a moon jelly?", "No. A box jellyfish can be dangerous to people. A moon jelly's sting is usually mild."]]),
  animal("crab", "crabs", [["What kind of animal is a crab?", "A crustacean, with a hard outside skeleton."], ["How does it grow?", "It molts. It sheds the shell and expands before the new one hardens."], ["How does a crab walk?", "Usually sideways. The leg joints bend that way."], ["Is a hermit crab a true crab?", "No. It has a soft abdomen and borrows a shell."]]),
  animal("seahorse", "seahorses", [["What kind of animal is a seahorse?", "A fish."], ["Who carries the babies?", "The male. The female lays the eggs into his pouch."], ["How does it eat?", "It sucks prey through a snout. It has no teeth."], ["What holds it in a current?", "A tail that curls around seaweed."]]),
  animal("clownfish", "clownfish", [["What kind of animal is a clownfish?", "A small reef fish."], ["Why can it live in an anemone?", "A coat of mucus keeps the stings from firing."], ["What does the anemone get?", "The fish chases off some anemone-eaters, and it drops scraps."], ["Can every clownfish change sex?", "In a group, the largest fish is the female. If she dies, the breeding male can become female."]]),
  animal("starfish", "starfish", [["What kind of animal is a starfish?", "An echinoderm, related to sea urchins. It is not a fish. Sea star is the clearer name."], ["How does it move?", "Hundreds of tube feet, worked by water pressure."], ["Can it regrow an arm?", "Many species can, if part of the central disc remains."], ["How does it eat a clam?", "It pulls the shell open a crack and pushes its stomach outside the body to digest the clam."]]),
  animal("lobster", "lobsters", [["What kind of animal is a lobster?", "A crustacean."], ["What color is it alive?", "Usually dark green, brown, or blue. It turns red when cooked because the heat changes the pigments."], ["Do lobsters scream in the pot?", "No. They have no vocal cords. The sound is steam in the shell."], ["How does it grow?", "By molting."]]),
  animal("snail", "snails", [["What kind of animal is a snail?", "A mollusk with a coiled shell."], ["How does it move?", "On a muscular foot, over a trail of mucus."], ["Where are the eyes?", "On the tips of the longer tentacles, in land snails."], ["Can a snail sleep for a long time?", "Yes. In a dry spell it can seal the shell and rest for months, and some have rested for years."]]),
  animal("bee", "bees", [["What kind of animal is a honeybee?", "An insect."], ["What is the colony?", "One queen, many workers, and, in season, drones."], ["What do workers collect?", "Nectar and pollen. Nectar becomes honey."], ["Does a honeybee die when it stings?", "A worker's barbed sting sticks in mammal skin, and the bee dies. The sting does not stick in every animal."]]),
  animal("butterfly", "butterflies", [["What kind of animal is a butterfly?", "An insect."], ["What are the life stages?", "Egg, caterpillar, chrysalis, and adult."], ["How does it taste?", "With sensors on its feet."], ["What is the difference from a moth?", "Butterflies are usually day fliers with clubbed antennae. Moths are often night fliers with feathery antennae. There are exceptions."]]),
  animal("ant", "ants", [["What kind of animal is an ant?", "An insect that lives in a colony."], ["Who does the work?", "Workers, which are females. The queen lays the eggs."], ["How do they follow a path?", "They leave a scent trail."], ["How much can an ant lift?", "Many times its own weight, because it is small. The feat does not scale up to a person-sized ant."]]),
  animal("ladybug", "ladybugs", [["What kind of animal is a ladybug?", "A beetle. Ladybird is the other common name."], ["What does it eat?", "Aphids, which is why gardeners want them."], ["What is the liquid it leaks?", "A bitter yellow fluid from the leg joints, a defense."], ["Are all of them red?", "No. Some are orange, yellow, or black."]]),
  animal("spider", "spiders", [["What kind of animal is a spider?", "An arachnid, not an insect. It has eight legs and two body parts."], ["Do all spiders spin webs?", "No. Some hunt on foot. Jumping spiders stalk."], ["How many eyes?", "Usually eight. A few groups have six or fewer."], ["Is a daddy longlegs the most venomous spider?", "No. The claim is a myth. Harvestmen are not even spiders, and cellar spiders are not a special danger."]]),
  animal("dragonfly", "dragonflies", [["What kind of animal is a dragonfly?", "A flying insect that hunts other insects."], ["Where does the young live?", "Underwater, as a nymph, sometimes for years."], ["Can it fly backwards?", "Yes, and it can hover."], ["How good are the eyes?", "Huge compound eyes. They see almost all the way around."]]),
  animal("mantis-shrimp", "mantis shrimp", [["What kind of animal is a mantis shrimp?", "A crustacean, not a shrimp you would put on a plate, and not a praying mantis."], ["What is the club for?", "Some species punch prey. The strike is fast enough to boil a tiny bit of water."], ["How is the color vision different?", "They have many more kinds of color-sensing cells than a person, who has three."], ["Where do they live?", "In warm shallow seas, often in a burrow."]]),
  animal("tardigrade", "tardigrades", [["What kind of animal is a tardigrade?", "A tiny animal, also called a water bear. It lives in moss and water."], ["How big is it?", "Usually less than a millimeter."], ["What is the tun?", "A dried-out resting form. In that state it can survive cold, heat, and drying that would kill most animals."], ["Did tardigrades survive space?", "Some survived a short exposure outside a spacecraft. That is not the same as living in space."]]),
  animal("axolotl", "axolotls", [["What kind of animal is an axolotl?", "A salamander from lakes in Mexico City."], ["What is odd about the adult?", "It keeps its gills and stays in the water. It does not transform into a land salamander."], ["Can it regrow parts?", "Yes. It can regrow a limb, and parts of the heart and the spinal cord."], ["Are wild axolotls common?", "No. The wild population is critically endangered. Pets are captive-bred."]]),
];

if (animals.length !== 100) {
  throw new Error(`Expected 100 animals, got ${animals.length}`);
}
if (usPages.length !== 50) {
  throw new Error(`Expected 50 capitals, got ${usPages.length}`);
}
if (countryPages.length !== 193) {
  throw new Error(`Expected 193 countries, got ${countryPages.length}`);
}

const general = [
  page({
    slug: "about-me",
    field: "Fun facts",
    headline: "Fun facts about me",
    description: "Fun facts about me, and fun facts about yourself: prompts you fill in. A sample deck and a spaced review schedule.",
    lede: "A fun fact about you is a true detail you can say in one sentence. This deck is a set of prompts. Replace each answer with your own.",
    tests: "People also search for fun facts about yourself. It is the same task. A card that still has the prompt on the back is not finished.",
    cards: [
      ["What is a food you could eat every week?", "Write the food. This sample answer is a placeholder."],
      ["What is a place you want to see?", "Write the place."],
      ["What is a skill that surprises people?", "Write the skill."],
      ["What is a song you can sing from memory?", "Write the song."],
      ["What did you want to be when you were small?", "Write that job or dream."],
      ["What is a small habit you are proud of?", "Write the habit."],
      ["What is an animal you would be for a day?", "Write the animal, and why."],
      ["What is a fact about your name?", "Write what it means, or who chose it."],
    ],
    scheduleStart: "Edit the answers first.",
  }),
  page({
    slug: "for-kids",
    field: "Fun facts",
    headline: "Fun facts for kids",
    description: "Fun facts for kids: short true facts, one per card. A sample deck and a spaced review schedule.",
    lede: "A fact for a kid should be short, true, and sayable out loud. One card is one fact. A list of ten facts on one card will not stick.",
    tests: "There are eight planets. Pluto is a dwarf planet. Bananas are berries in the botanical sense, and strawberries are not. A lightning channel can be hotter than the surface of the Sun.",
    cards: [
      ["How many planets are there?", "Eight."],
      ["What is Pluto?", "A dwarf planet, not the ninth planet."],
      ["Is a banana a berry?", "Yes, in the botanical sense. A strawberry is not."],
      ["Can lightning be hotter than the Sun?", "The channel of a bolt can be hotter than the Sun's surface. The Sun's core is much hotter than that."],
      ["How many neck bones does a giraffe have?", "Seven, the same number as a person."],
      ["Do goldfish remember for only three seconds?", "No. They can remember for months."],
      ["What is a group of crows called?", "A murder."],
      ["How long is a day on Earth?", "24 hours."],
    ],
  }),
  page({
    slug: "random",
    field: "Fun facts",
    headline: "Random fun facts",
    description: "Random fun facts: a mixed deck of short true facts. A sample deck and a spaced review schedule.",
    lede: "A random fact is only useful if it is true and small enough to say. This deck mixes animals, space, and numbers. Add the next fact you want to keep.",
    tests: "Honey can last for thousands of years if it is sealed. An octopus has three hearts. A day on Venus is longer than its year.",
    cards: [
      ["How many hearts does an octopus have?", "Three."],
      ["How long can sealed honey last?", "Thousands of years. Archaeologists have found edible honey in ancient jars."],
      ["Which planet has a day longer than its year?", "Venus. Mercury's solar day is also longer than its year."],
      ["What is the tallest animal?", "The giraffe."],
      ["What is the largest animal?", "The blue whale."],
      ["How many sides does a hexagon have?", "Six."],
      ["What is a group of flamingos called?", "A flamboyance."],
      ["Are bats blind?", "No."],
    ],
  }),
  page({
    slug: "weird",
    field: "Fun facts",
    headline: "Weird fun facts",
    description: "Weird fun facts that are still true. A sample deck and a spaced review schedule.",
    lede: "A weird fact still has to be true. The odd part is the detail, not a made-up punch line.",
    tests: "Wombat droppings are cube-shaped. A mantis shrimp has far more kinds of color sensors than a person. A woodpecker's tongue can wrap behind the skull. Tardigrades can dry out and wait.",
    cards: [
      ["What shape is wombat poop?", "Roughly a cube."],
      ["Where is a shrimp's heart?", "In its head."],
      ["What is strange about a mantis shrimp's eyes?", "They have many more kinds of color-sensing cells than a person."],
      ["Where does a woodpecker's tongue go?", "In many species it wraps behind the skull."],
      ["What can a tardigrade do when it dries out?", "It curls into a tun and waits. Some have survived a short trip in space."],
      ["Why does a blobfish look like a blob?", "It is built for deep pressure. At the surface the body sags."],
      ["Can a frog freeze and live?", "A wood frog can. Ice forms outside the cells."],
      ["What color is a polar bear's skin?", "Black. The fur looks white."],
    ],
  }),
  page({
    slug: "of-the-day",
    field: "Fun facts",
    headline: "Fun facts of the day",
    description: "Fun facts of the day: the card that is due, not a new list every morning. A sample deck and a spaced review schedule.",
    lede: "The fact of the day is the card that is due. You do not need a new list each morning. A card you know waits. A card you miss comes back sooner.",
    tests: "Start with a small deck. When nothing is due, stop. Adding a fact you will not review is how a list becomes clutter.",
    cards: [
      ["What is the fact of the day?", "The card that is due, not a headline that changes at midnight."],
      ["What do you do when nothing is due?", "Stop for the day."],
      ["How many hearts does an octopus have?", "Three."],
      ["How many planets are there?", "Eight."],
      ["What is the largest animal?", "The blue whale."],
      ["Are bats blind?", "No."],
      ["How long is a day on Earth?", "24 hours."],
      ["What shape is wombat poop?", "Roughly a cube."],
    ],
    scheduleStart: "Review only what is due.",
  }),
];

const write = (file, exportName, items) => {
  fs.writeFileSync(
    new URL(`../src/data/${file}`, import.meta.url),
    emit(exportName, items),
  );
  console.log(file, items.length);
};

write("funFactsPlanets.js", "FUN_FACT_PLANETS", planets);
write("funFactsCountries.js", "FUN_FACT_COUNTRIES", countryPages);
write("funFactsCountryCapitals.js", "FUN_FACT_COUNTRY_CAPITALS", capitalPages);
write("funFactsUsCapitals.js", "FUN_FACT_US_CAPITALS", usPages);
write("funFactsAnimals.js", "FUN_FACT_ANIMALS", animals);
write("funFactsGeneral.js", "FUN_FACT_GENERAL", general);
