const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const GEOGRAPHY = [
  {
    slug: "how-many-countries",
    fieldLabel: "Count",
    headline: "How many countries are there",
    description:
      "How many countries are there: 193 United Nations members, and why some counts say 195. A sample deck and a spaced review schedule.",
    lede: "The United Nations has 193 member states. People also ask how many countries are in the world, and what the countries of the world are. Those are this same counting question. The number moves when the list adds places that are not UN members.",
    testsHeading: "The short answer",
    tests:
      "193 is the count of UN members. Vatican City and Palestine are non-member observer states. Adding those two is how many lists reach 195. Kosovo and Taiwan are the cases that push some lists higher, because recognition is split. A “country” here means a sovereign state, not a territory such as Puerto Rico or Greenland.",
    cardRule:
      "One count per card. UN members, observers, and disputed states do not share an answer.",
    schedule: schedule("Start with 193, then the two observers."),
    cards: [
      card("How many countries are in the United Nations?", "193 member states."),
      card("What number do people get by adding the UN observers?", "195. The observers are Vatican City and Palestine."),
      card("Is Puerto Rico a country in this count?", "No. It is a United States territory."),
      card("Is Greenland a country in this count?", "No. It is part of Denmark."),
      card("Why do some lists pass 195?", "They add states whose recognition is split, such as Kosovo or Taiwan."),
      card("Does “countries of the world” use a different number?", "No. It is the same question: which sovereign states you are counting."),
      card("Who sits in the UN but is not a member?", "Vatican City and Palestine. They are observer states."),
      card("Does a new UN member change the 193?", "Yes. The member count is a membership list, not a fact of nature."),
    ],
  },
  {
    slug: "north-america",
    fieldLabel: "North America",
    headline: "What countries are in North America",
    description:
      "What countries are in North America: Canada, the United States, Mexico, Central America, and the Caribbean. A sample deck and a spaced review schedule.",
    lede: "North America is the continent, not a club of three. Canada, the United States, and Mexico are the large mainland countries. Central America and the Caribbean are on the same continent.",
    testsHeading: "The short answer",
    tests:
      "Count sovereign states and you get 23: Canada, the United States, Mexico, seven in Central America, and 13 in the Caribbean. Central America is Belize, Costa Rica, El Salvador, Guatemala, Honduras, Nicaragua, and Panama. The independent Caribbean states are Antigua and Barbuda, the Bahamas, Barbados, Cuba, Dominica, the Dominican Republic, Grenada, Haiti, Jamaica, Saint Kitts and Nevis, Saint Lucia, Saint Vincent and the Grenadines, and Trinidad and Tobago. Greenland is part of Denmark. Puerto Rico is part of the United States.",
    cardRule:
      "One region per card. The three large countries, Central America, and the Caribbean stay separate.",
    schedule: schedule("Start with the three large countries, then the rest of the continent."),
    cards: [
      card("Name the three largest mainland countries.", "Canada, the United States, and Mexico."),
      card("How many sovereign states are usually counted on the continent?", "23, once Central America and the Caribbean are included."),
      card("Name the seven Central American countries.", "Belize, Costa Rica, El Salvador, Guatemala, Honduras, Nicaragua, and Panama."),
      card("Is Belize in Central America?", "Yes."),
      card("Is Greenland a country?", "No. It is part of Denmark."),
      card("Is Puerto Rico a country?", "No. It is a United States territory."),
      card("Is Cuba in North America?", "Yes. It is a Caribbean country on that continent."),
      card("Is Colombia in North America?", "No. Colombia is in South America."),
    ],
  },
  {
    slug: "south-america",
    fieldLabel: "South America",
    headline: "What countries are in South America",
    description:
      "What countries are in South America: the 12 sovereign states, including Guyana and Suriname. A sample deck and a spaced review schedule.",
    lede: "South America has 12 sovereign states. People also say “countries in South America,” and it is this same list. French Guiana is on the continent and is part of France, so it is not a 13th country.",
    testsHeading: "The short answer",
    tests:
      "The 12 are Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, Guyana, Paraguay, Peru, Suriname, Uruguay, and Venezuela. Brazil is the only one whose main language is Portuguese. Guyana’s main language is English. Suriname’s is Dutch. The other nine use Spanish as an official language.",
    cardRule:
      "One country or one language fact per card. Do not fold French Guiana into the 12.",
    schedule: schedule("Start with the 12, then the three that are not Spanish-speaking."),
    cards: [
      card("How many sovereign states are in South America?", "12."),
      card("Which one has Portuguese as its main language?", "Brazil."),
      card("Which one has English as its main language?", "Guyana."),
      card("Which one has Dutch as its main language?", "Suriname."),
      card("Is French Guiana a country?", "No. It is part of France."),
      card("Is Panama in South America?", "No. Panama is in Central America."),
      card("Is Bolivia landlocked?", "Yes. Paraguay is landlocked too."),
      card("Name the countries that touch the Caribbean coast of South America.", "Colombia and Venezuela."),
    ],
  },
  {
    slug: "europe",
    fieldLabel: "Europe",
    headline: "What countries are in Europe",
    description:
      "What countries are in Europe: the sovereign states on the continent, and why the count is not the EU. A sample deck and a spaced review schedule.",
    lede: "Europe is a continent, not the European Union. A usual list of sovereign states in Europe lands in the mid-40s. The edges move because Russia and Turkey cross into Asia, and because Kosovo’s recognition is split.",
    testsHeading: "The short answer",
    tests:
      "The United Kingdom is in Europe and is not in the EU. Norway, Switzerland, and Iceland are in Europe and are not EU members. Russia is a European country in this usual list even though most of its land is in Asia. Turkey is often left off a strict European list because most of its land is in Asia, while part of Istanbul is in Europe. Vatican City is in Europe and is not a UN member. The EU has 27 members. That number is not the number of European countries.",
    cardRule:
      "One edge case per card. Europe, the EU, and a transcontinental country stay separate.",
    schedule: schedule("Start with Europe versus the EU."),
    cards: [
      card("Is the European Union the same as Europe?", "No. The EU is a membership club. Europe is the continent."),
      card("How many countries are in the EU?", "27."),
      card("Is the United Kingdom in Europe?", "Yes. It left the EU. It did not leave the continent."),
      card("Is Norway in the EU?", "No. Norway is in Europe."),
      card("Is Switzerland in the EU?", "No. Switzerland is in Europe."),
      card("Why is Russia counted in Europe?", "Its capital and much of its population are in Europe, even though most of its land is in Asia."),
      card("Why is Turkey often left off a strict European list?", "Most of its land is in Asia."),
      card("Is Vatican City a UN member?", "No. It is in Europe, and it is a UN observer."),
    ],
  },
  {
    slug: "asia",
    fieldLabel: "Asia",
    headline: "What countries are in Asia",
    description:
      "What countries are in Asia: the regions of the continent, and the states that sit on an edge. A sample deck and a spaced review schedule.",
    lede: "Asia is the largest continent. People also ask for Asian countries, and for countries in Asia, and those are this same map. There is no single official membership list, because Russia, Turkey, and Egypt sit on the edges.",
    testsHeading: "The short answer",
    tests:
      "A practical split is East Asia, Southeast Asia, South Asia, Central Asia, and West Asia. East Asia includes China, Japan, Mongolia, North Korea, South Korea, and Taiwan’s disputed status. Southeast Asia is the ten ASEAN countries plus Timor-Leste. South Asia includes India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, and the Maldives. Central Asia is Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, and Uzbekistan. West Asia is the Middle East core, including Iran and the Arabian Peninsula. Russia is usually counted in Europe for its capital and also has most of its land in Asia.",
    cardRule:
      "One region per card. Do not answer “Asia” with only China, India, and Japan.",
    schedule: schedule("Start with the five regions, then one edge case."),
    cards: [
      card("Name six places usually grouped as East Asia.", "China, Japan, Mongolia, North Korea, South Korea, and Taiwan."),
      card("How many countries are in ASEAN?", "10. Timor-Leste is in Southeast Asia and is not one of those 10."),
      card("Name the South Asian countries people usually group together.", "India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, and the Maldives."),
      card("Name the five Central Asian countries.", "Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, and Uzbekistan."),
      card("Is Russia only a European country?", "No. Most of its land is in Asia. Its capital is in Europe."),
      card("Is Egypt in Asia?", "Most lists put Egypt in Africa. The Sinai Peninsula is in Asia."),
      card("Is Australia in Asia?", "No. Australia is its own continent."),
      card("Is the Middle East inside Asia?", "The usual core is in West Asia. Egypt is the overlap with Africa."),
    ],
  },
  {
    slug: "middle-east",
    fieldLabel: "Middle East",
    headline: "What countries are in the Middle East",
    description:
      "What countries are in the Middle East: the usual core, and the states lists argue about. A sample deck and a spaced review schedule.",
    lede: "The Middle East is a regional name, not a continent and not a treaty. Lists disagree at the edges. The core is stable.",
    testsHeading: "The short answer",
    tests:
      "A usual core is Bahrain, Iran, Iraq, Israel, Jordan, Kuwait, Lebanon, Oman, Palestine, Qatar, Saudi Arabia, Syria, the United Arab Emirates, and Yemen. Egypt and Turkey are often added. Cyprus is sometimes added and often left off. Iran is in the Middle East and is not an Arab country. Israel is in the Middle East. Palestine appears on political lists and is not a UN member.",
    cardRule:
      "One membership question per card. The core and the edge stay separate.",
    schedule: schedule("Start with the core, then Egypt and Turkey."),
    cards: [
      card("Is the Middle East a continent?", "No. It is a regional name, mostly in West Asia."),
      card("Is Iran in the Middle East?", "Yes. It is not an Arab country."),
      card("Is Israel in the Middle East?", "Yes."),
      card("Is Saudi Arabia in the Middle East?", "Yes."),
      card("Why do lists add Egypt?", "The Sinai Peninsula is in Asia, and Egypt is part of the region’s politics. Most of Egypt is in Africa."),
      card("Why do lists add Turkey?", "Part of Turkey is in Europe, and the country is part of the region’s politics."),
      card("Is Cyprus always included?", "No. Some lists add it. Many leave it off."),
      card("Is Palestine a UN member?", "No. It is a UN observer. Political lists of the region still name it."),
    ],
  },
  {
    slug: "slavic-countries",
    fieldLabel: "Slavic",
    headline: "What are Slavic countries",
    description:
      "What are Slavic countries: states where a Slavic language is the main language, in three branches. A sample deck and a spaced review schedule.",
    lede: "Slavic countries are states where a Slavic language is the main language. They are a language family, not a political union. The usual split is East, West, and South.",
    testsHeading: "The short answer",
    tests:
      "East Slavic is Russia, Ukraine, and Belarus. West Slavic is Poland, Czechia, and Slovakia. South Slavic is Slovenia, Croatia, Bosnia and Herzegovina, Serbia, Montenegro, North Macedonia, and Bulgaria. Kosovo’s main language is Albanian, so it is not in this set. Romanian is a Romance language, so Romania is not Slavic.",
    cardRule:
      "One branch per card. Language family and a political alliance do not share an answer.",
    schedule: schedule("Start with the three branches."),
    cards: [
      card("What makes a country Slavic in this list?", "A Slavic language is the main language."),
      card("Name the East Slavic countries.", "Russia, Ukraine, and Belarus."),
      card("Name the West Slavic countries.", "Poland, Czechia, and Slovakia."),
      card("Name the South Slavic countries.", "Slovenia, Croatia, Bosnia and Herzegovina, Serbia, Montenegro, North Macedonia, and Bulgaria."),
      card("Is Romania Slavic?", "No. Romanian is a Romance language."),
      card("Is Kosovo Slavic by this test?", "No. Albanian is the main language."),
      card("Is North Macedonia Slavic by this test?", "Yes. Macedonian is a South Slavic language."),
      card("Are Slavic countries one alliance?", "No. The word names a language family."),
    ],
  },
  {
    slug: "spanish-speaking",
    fieldLabel: "Spanish",
    headline: "What are the Spanish speaking countries",
    description:
      "Spanish speaking countries: the 20 sovereign states where Spanish is an official language. A sample deck and a spaced review schedule.",
    lede: "Twenty sovereign states name Spanish as an official language. Spain and Equatorial Guinea are the two outside the Americas. The other 18 are in the Americas.",
    testsHeading: "The short answer",
    tests:
      "The Americas list is Mexico, Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica, Panama, Cuba, the Dominican Republic, Colombia, Venezuela, Ecuador, Peru, Bolivia, Paraguay, Chile, Argentina, and Uruguay. Belize is not on it. Brazil is not on it. Puerto Rico uses Spanish and is a United States territory, not a country. Equatorial Guinea is in Africa.",
    cardRule:
      "One exclusion per card. Official language is the test, not “Spanish is spoken there.”",
    schedule: schedule("Start with 20, then the two that are not in the Americas."),
    cards: [
      card("How many sovereign states have Spanish as an official language?", "20."),
      card("Which one is in Europe?", "Spain."),
      card("Which one is in Africa?", "Equatorial Guinea."),
      card("Is Brazil a Spanish-speaking country?", "No. Portuguese is the official language."),
      card("Is Belize a Spanish-speaking country?", "No. English is the official language."),
      card("Is Puerto Rico on this country list?", "No. Spanish is used there, and it is a United States territory."),
      card("Is the United States on this list?", "No. Spanish is widely spoken. It is not an official language of the country."),
      card("How many of the 20 are in the Americas?", "18."),
    ],
  },
  {
    slug: "left-side-driving",
    fieldLabel: "Left side",
    headline: "What countries drive on the left side of the road",
    description:
      "What countries drive on the left: about 75 countries and territories, and the pattern behind the list. A sample deck and a spaced review schedule.",
    lede: "About 75 countries and territories keep left-hand traffic. The largest share are places that kept a British rule. Japan, Indonesia, and Thailand are the famous exceptions to that story.",
    testsHeading: "The short answer",
    tests:
      "The United Kingdom, Ireland, Cyprus, Malta, India, Pakistan, Bangladesh, Sri Lanka, Nepal, Japan, Thailand, Malaysia, Singapore, Indonesia, Australia, New Zealand, South Africa, Kenya, and many Caribbean states drive on the left. The United States, Canada, China, and most of Europe drive on the right. Hong Kong and Macau drive on the left even though mainland China drives on the right. The rule is the country’s law. A whole continent does not share one side.",
    cardRule:
      "One country or one exception per card. Left-hand traffic and a former empire do not share an answer.",
    schedule: schedule("Start with the pattern, then Japan."),
    cards: [
      card("About how many countries and territories drive on the left?", "About 75."),
      card("What is the usual historical pattern?", "A place kept the British rule of the road."),
      card("Does Japan fit that pattern?", "No. Japan drives on the left and was not a British colony."),
      card("Do Indonesia and Thailand fit that pattern?", "No. Both drive on the left."),
      card("Does Australia drive on the left?", "Yes."),
      card("Does India drive on the left?", "Yes."),
      card("Does mainland China drive on the left?", "No. China drives on the right. Hong Kong and Macau drive on the left."),
      card("Does the United States drive on the left?", "No. It drives on the right."),
    ],
  },
  {
    slug: "nato",
    fieldLabel: "NATO",
    headline: "What countries are part of NATO",
    description:
      "What countries are part of NATO: the 32 members after Sweden joined in 2024. A sample deck and a spaced review schedule.",
    lede: "NATO has 32 members. Sweden joined in 2024, after Finland in 2023. An attack on one member is treated as an attack on all of them. That promise is Article 5.",
    testsHeading: "The short answer",
    tests:
      "The members are Albania, Belgium, Bulgaria, Canada, Croatia, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Lithuania, Luxembourg, Montenegro, the Netherlands, North Macedonia, Norway, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, Turkey, the United Kingdom, and the United States. Ukraine is not a member. Mexico is not a member. Iceland is a member and has no standing army.",
    cardRule:
      "One membership fact per card. A neighbor of NATO is not a member.",
    schedule: schedule("Start with 32 and Article 5, then the newest members."),
    cards: [
      card("How many countries are in NATO?", "32."),
      card("What is Article 5?", "An attack on one member is treated as an attack on all of them."),
      card("Who joined in 2023?", "Finland."),
      card("Who joined in 2024?", "Sweden."),
      card("Is Ukraine a member?", "No."),
      card("Is Mexico a member?", "No."),
      card("Is Iceland a member?", "Yes. It has no standing army."),
      card("Are Canada and the United States members?", "Yes. Both."),
    ],
  },
  {
    slug: "nuclear-weapons",
    fieldLabel: "Nuclear weapons",
    headline: "What countries have nuclear weapons",
    description:
      "What countries have nuclear weapons: the five treaty states, plus the states outside that treaty. A sample deck and a spaced review schedule.",
    lede: "Nine countries are the usual public count. Five of them are named in the Nuclear Non-Proliferation Treaty. The other four are outside that treaty, and one of those four does not confirm that it has the weapons.",
    testsHeading: "The short answer",
    tests:
      "The treaty’s five nuclear-weapon states are China, France, Russia, the United Kingdom, and the United States. India, Pakistan, and North Korea have tested nuclear weapons and are not those five. Israel does not confirm a nuclear arsenal. Public estimates still count Israel, which is how the list becomes nine. A country that hosts another country’s weapons is not the same as a country that has its own.",
    cardRule:
      "One group per card. Treaty status and a public estimate stay separate.",
    schedule: schedule("Start with the five, then the four outside the treaty."),
    cards: [
      card("How many countries are in the usual public count?", "Nine."),
      card("Name the five treaty nuclear-weapon states.", "China, France, Russia, the United Kingdom, and the United States."),
      card("Which three have tested weapons outside that group?", "India, Pakistan, and North Korea."),
      card("Why is Israel on the list of nine?", "Public estimates count an arsenal. Israel does not confirm one."),
      card("Is Iran in the usual count of nine?", "No."),
      card("Does hosting another country’s bomb make you a nuclear-weapon state?", "No. The count is about a country’s own weapons."),
      card("What treaty names the five?", "The Nuclear Non-Proliferation Treaty."),
      card("Did North Korea sign and stay in that treaty as a nuclear state?", "No. It is outside the treaty’s five."),
    ],
  },
  {
    slug: "cheapest-to-visit",
    fieldLabel: "Travel cost",
    headline: "What are the cheapest countries to visit",
    description:
      "What are the cheapest countries to visit: what “cheap” compares, and why a ranking goes stale. A sample deck and a spaced review schedule.",
    lede: "A cheap country is a comparison with the prices you left at home. Lodging, food, and local buses do the work. The ranking changes, and a capital or a resort can be expensive inside a country that is cheap everywhere else.",
    testsHeading: "The short answer",
    tests:
      "Travelers from high-cost countries often find lower day-to-day prices in Vietnam, India, Indonesia, Nepal, Egypt, Mexico, Colombia, Bolivia, and Georgia. That is a pattern, not a live price list. A country is not cheap in every city, in every season, or for every passport. The expensive pieces are usually the flight in and the neighborhood you sleep in, not the plate of food.",
    cardRule:
      "One cost fact per card. Do not memorize a ranked top ten.",
    schedule: schedule("Start with what the word cheap is comparing."),
    cards: [
      card("What does “a cheap country” compare?", "Day-to-day prices against the prices in the traveler’s home country."),
      card("Which costs decide the comparison?", "Lodging, food, and local transport."),
      card("Why does a published ranking go stale?", "Prices and exchange rates move."),
      card("Can a cheap country have an expensive city?", "Yes. The capital or the resort can cost more than the rest of the country."),
      card("Name a Southeast Asian country that often prices lower for visitors.", "Vietnam, or Indonesia."),
      card("Name a South Asian country that often prices lower for visitors.", "India, or Nepal."),
      card("Name a Latin American country that often prices lower for visitors.", "Mexico, Colombia, or Bolivia."),
      card("What cost is often left out of the “cheap country” claim?", "The flight to get there."),
    ],
  },
];

export function geographyBySlug(slug) {
  return GEOGRAPHY.find((item) => item.slug === slug) ?? null;
}
