const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const SPACE = [
  {
    slug: "stars",
    fieldLabel: "Stars",
    headline: "What are the types of stars?",
    description:
      "What are the types of stars: temperature classes, and the life stages those classes sit in. A sample deck and a spaced review schedule.",
    lede: "A star type can mean its temperature class or its stage of life. The temperature classes run O, B, A, F, G, K, M, from hottest to coolest. The Sun is a G-type star on the main sequence.",
    testsHeading: "The short answer",
    tests:
      "O stars are the hottest and bluest. M stars are the coolest and reddest. The main sequence is the long stretch where a star fuses hydrogen in its core. A red giant has left that stretch and swollen. A white dwarf is the dense core left after a sun-like star sheds its outer layers. A neutron star is the collapsed core of a much heavier star. A black hole is not a star type. It is what can remain when the core collapses further.",
    cardRule:
      "One class or one stage per card. Temperature and life stage stay separate.",
    schedule: schedule("Start with O through M, then the Sun."),
    cards: [
      card("What are the temperature classes, hottest to coolest?", "O, B, A, F, G, K, M."),
      card("What type is the Sun?", "A G-type main-sequence star."),
      card("Which class is hottest?", "O."),
      card("Which class is coolest and reddest?", "M."),
      card("What is the main sequence?", "The long stage when a star fuses hydrogen in its core."),
      card("What is a red giant?", "A star that has left the main sequence and swollen."),
      card("What is a white dwarf?", "The dense core left after a sun-like star sheds its outer layers."),
      card("Is a black hole a type of star?", "No. It can be what remains after a massive core collapses."),
    ],
  },
  {
    slug: "galaxies",
    fieldLabel: "Galaxies",
    headline: "What are the types of galaxies?",
    description:
      "What are the types of galaxies: spiral, elliptical, lenticular, and irregular. A sample deck and a spaced review schedule.",
    lede: "Galaxies are grouped by shape. The usual four are spiral, barred spiral as a kind of spiral, elliptical, lenticular, and irregular. The Milky Way is a barred spiral.",
    testsHeading: "The short answer",
    tests:
      "A spiral has a disk and arms. A barred spiral has a bar of stars across the center, with arms coming off the bar. An elliptical is a smooth oval, with little gas and little new star formation. A lenticular has a disk and a central bulge, and no clear arms. An irregular galaxy has no tidy shape. Shape is not size. A dwarf galaxy can be any of these tendencies and is small.",
    cardRule:
      "One shape per card. The Milky Way gets its own card.",
    schedule: schedule("Start with spiral, elliptical, and irregular."),
    cards: [
      card("What is a spiral galaxy?", "A galaxy with a disk and spiral arms."),
      card("What is a barred spiral?", "A spiral with a bar of stars through the center."),
      card("What type is the Milky Way?", "A barred spiral."),
      card("What is an elliptical galaxy?", "A smooth oval galaxy with little gas for new stars."),
      card("What is a lenticular galaxy?", "A disk and a bulge, without clear spiral arms."),
      card("What is an irregular galaxy?", "A galaxy with no tidy spiral or ellipse."),
      card("Does the shape tell you the size?", "No. Dwarf galaxies are small. The shape label is separate."),
      card("Is the solar system a galaxy?", "No. The solar system is inside the Milky Way."),
    ],
  },
];

export function spaceBySlug(slug) {
  return SPACE.find((item) => item.slug === slug) ?? null;
}
