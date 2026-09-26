const card = (question, answer) => ({ question, answer });

export const STAR_SIGNS = {
  slug: "dates",
  fieldLabel: "Star signs",
  headline: "Star signs dates",
  description:
    "Star signs dates for the twelve Western signs, as flashcards, with a spaced review schedule. The sun can cross a sign a day to either side.",
  lede: "These are the usual calendar dates for the twelve Western star signs. The sun does not change sign on the same minute every year, so a birthday on the first or last day can fall either way.",
  testsHeading: "The twelve signs",
  tests:
    "Each sign is a block of the year, in order from Aries in March through Pisces in March. Learn them as a loop. Capricorn is the one that crosses New Year’s Day.",
  cardRule:
    "One sign per card. The answer is the start date and the end date. If you miss the boundary, the next sign’s card comes back too.",
  schedule:
    "Go in calendar order until the loop closes. A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.",
  cards: [
    card("When is Aries?", "March 21 to April 19."),
    card("When is Taurus?", "April 20 to May 20."),
    card("When is Gemini?", "May 21 to June 20."),
    card("When is Cancer?", "June 21 to July 22."),
    card("When is Leo?", "July 23 to August 22."),
    card("When is Virgo?", "August 23 to September 22."),
    card("When is Libra?", "September 23 to October 22."),
    card("When is Scorpio?", "October 23 to November 21."),
    card("When is Sagittarius?", "November 22 to December 21."),
    card("When is Capricorn?", "December 22 to January 19."),
    card("When is Aquarius?", "January 20 to February 18."),
    card("When is Pisces?", "February 19 to March 20."),
  ],
};
