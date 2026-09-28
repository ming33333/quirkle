const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const FUN_FACT_PLANETS = [
  {
    slug: "mercury",
    fieldLabel: "Planets",
    headline: "Fun facts about Mercury",
    description: "Fun facts about Mercury: the smallest planet, a short year, and a very long day. A sample deck and a spaced review schedule.",
    lede: "Mercury is the closest planet to the Sun and the smallest planet. A year there is about 88 Earth days. One solar day, from noon to noon, is about 176 Earth days, so a day lasts longer than a year.",
    testsHeading: "A few facts",
    tests: "Mercury has almost no atmosphere, so the temperature swings from very hot in the sun to very cold in the dark. The surface is covered with craters. It has no moons.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("Which planet is closest to the Sun?", "Mercury."),
      card("Which planet is the smallest?", "Mercury."),
      card("How long is a year on Mercury?", "About 88 Earth days."),
      card("How long is a solar day on Mercury?", "About 176 Earth days, longer than its year."),
      card("Does Mercury have a moon?", "No."),
      card("Why do temperatures swing so much?", "It has almost no atmosphere to hold the heat.")
    ],
  },
  {
    slug: "venus",
    fieldLabel: "Planets",
    headline: "Fun facts about Venus",
    description: "Fun facts about Venus: the hottest planet, a backwards spin, and a day longer than its year. A sample deck and a spaced review schedule.",
    lede: "Venus is the second planet from the Sun. A thick carbon-dioxide atmosphere makes it the hottest planet, hotter than Mercury. It spins backwards, and one day is longer than one year.",
    testsHeading: "A few facts",
    tests: "A year on Venus is about 225 Earth days. A day is about 243 Earth days. Clouds of sulfuric acid hide the surface. Venus has no moon. It is close to Earth in size.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("Which planet is the hottest?", "Venus, because of a runaway greenhouse atmosphere."),
      card("Which way does Venus spin?", "Backwards compared with most planets."),
      card("How long is a day on Venus?", "About 243 Earth days, longer than its year of about 225 Earth days."),
      card("What are the clouds made of?", "Sulfuric acid, over a carbon-dioxide atmosphere."),
      card("Does Venus have a moon?", "No."),
      card("Is Venus much smaller than Earth?", "No. It is close to Earth in size.")
    ],
  },
  {
    slug: "earth",
    fieldLabel: "Planets",
    headline: "Fun facts about Earth",
    description: "Fun facts about Earth: liquid water, one moon, and a day of 24 hours. A sample deck and a spaced review schedule.",
    lede: "Earth is the third planet from the Sun and the only planet known to have liquid water on the surface and life. It has one moon.",
    testsHeading: "A few facts",
    tests: "About 71 percent of the surface is water. The air is mostly nitrogen, then oxygen. A day is 24 hours. A year is about 365.25 days, which is why a leap day is added.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("Where is Earth?", "The third planet from the Sun."),
      card("How many moons does Earth have?", "One."),
      card("About how much of the surface is water?", "About 71 percent."),
      card("What is the air mostly made of?", "Nitrogen, then oxygen."),
      card("How long is a day?", "24 hours."),
      card("Why is there a leap day?", "A year is about 365.25 days.")
    ],
  },
  {
    slug: "mars",
    fieldLabel: "Planets",
    headline: "Fun facts about Mars",
    description: "Fun facts about Mars: the red planet, two moons, and Olympus Mons. A sample deck and a spaced review schedule.",
    lede: "Mars is the fourth planet from the Sun. Iron oxide makes the surface red. It has two small moons, Phobos and Deimos.",
    testsHeading: "A few facts",
    tests: "A day on Mars, called a sol, is about 24 hours and 37 minutes. The atmosphere is thin and mostly carbon dioxide. Olympus Mons is the tallest volcano in the solar system. Ice caps sit at the poles.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("Why is Mars red?", "Iron oxide on the surface."),
      card("What are the moons of Mars?", "Phobos and Deimos."),
      card("How long is a day on Mars?", "About 24 hours and 37 minutes."),
      card("What is Olympus Mons?", "The tallest volcano in the solar system."),
      card("What is the atmosphere mostly?", "Carbon dioxide, and it is thin."),
      card("What is at the poles?", "Ice caps.")
    ],
  },
  {
    slug: "jupiter",
    fieldLabel: "Planets",
    headline: "Fun facts about Jupiter",
    description: "Fun facts about Jupiter: the largest planet, the Great Red Spot, and a short day. A sample deck and a spaced review schedule.",
    lede: "Jupiter is the largest planet. It is a gas giant made mostly of hydrogen and helium. The Great Red Spot is a storm that has lasted for centuries.",
    testsHeading: "A few facts",
    tests: "A day on Jupiter is about 10 hours. It has faint rings. Ganymede, one of its moons, is the largest moon in the solar system. The moon count is over 90 and still changes as new ones are confirmed.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("Which planet is the largest?", "Jupiter."),
      card("What is Jupiter mostly made of?", "Hydrogen and helium."),
      card("What is the Great Red Spot?", "A giant storm."),
      card("How long is a day on Jupiter?", "About 10 hours."),
      card("What is Ganymede?", "Jupiter's largest moon, and the largest moon in the solar system."),
      card("How many moons does Jupiter have?", "More than 90. The count still changes.")
    ],
  },
  {
    slug: "saturn",
    fieldLabel: "Planets",
    headline: "Fun facts about Saturn",
    description: "Fun facts about Saturn: the rings, a density lower than water, and the moon Titan. A sample deck and a spaced review schedule.",
    lede: "Saturn is the sixth planet from the Sun. Its rings are made of ice and rock. It is a gas giant, and it is the least dense planet.",
    testsHeading: "A few facts",
    tests: "Saturn's average density is lower than water. Titan, its largest moon, has a thick atmosphere. A day is about 10.7 hours. Like Jupiter, the moon count keeps changing.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("What are Saturn's rings made of?", "Pieces of ice and rock."),
      card("How dense is Saturn?", "Less dense than water. It is the least dense planet."),
      card("What is Titan?", "Saturn's largest moon. It has a thick atmosphere."),
      card("How long is a day on Saturn?", "About 10.7 hours."),
      card("Is Saturn a gas giant?", "Yes. It is mostly hydrogen and helium."),
      card("Is the moon count finished?", "No. New moons are still confirmed.")
    ],
  },
  {
    slug: "uranus",
    fieldLabel: "Planets",
    headline: "Fun facts about Uranus",
    description: "Fun facts about Uranus: an ice giant that spins on its side. A sample deck and a spaced review schedule.",
    lede: "Uranus is an ice giant and the seventh planet from the Sun. It rotates on its side, with a tilt of about 98 degrees. Methane in the air gives it a pale blue-green color.",
    testsHeading: "A few facts",
    tests: "William Herschel discovered Uranus in 1781. It has faint rings. A year is about 84 Earth years. It is colder than the gas giants closer to the Sun.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("What kind of planet is Uranus?", "An ice giant."),
      card("How is its spin unusual?", "It rotates on its side, tilted about 98 degrees."),
      card("Why does it look blue-green?", "Methane in the atmosphere."),
      card("Who discovered it, and when?", "William Herschel, in 1781."),
      card("Does Uranus have rings?", "Yes. They are faint."),
      card("How long is a year on Uranus?", "About 84 Earth years.")
    ],
  },
  {
    slug: "neptune",
    fieldLabel: "Planets",
    headline: "Fun facts about Neptune",
    description: "Fun facts about Neptune: the farthest planet, found by math before it was seen. A sample deck and a spaced review schedule.",
    lede: "Neptune is the farthest known planet from the Sun and an ice giant. Methane makes it look blue. Astronomers predicted where it would be before anyone saw it.",
    testsHeading: "A few facts",
    tests: "Neptune was found in 1846. A year is about 165 Earth years. Its winds are among the fastest in the solar system. Triton, its largest moon, orbits backwards.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("Which planet is farthest from the Sun?", "Neptune."),
      card("Why is Neptune blue?", "Methane in the atmosphere absorbs red light."),
      card("How was Neptune found?", "Math predicted its place. It was seen in 1846."),
      card("How long is a year on Neptune?", "About 165 Earth years."),
      card("What is odd about Triton?", "It orbits backwards. It is Neptune's largest moon."),
      card("Is Pluto farther out?", "Pluto is a dwarf planet, not the ninth planet.")
    ],
  }
];
