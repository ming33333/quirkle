const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const ECONOMICS = [
  {
    slug: "what-is-economics",
    fieldLabel: "Economics",
    headline: "What is economics",
    description:
      "What is economics, and what is economics with a question mark: how people choose when they cannot have everything. A sample deck and a spaced review schedule.",
    lede: "Economics is the study of how people choose when they cannot have everything they want. Scarcity forces the choice. The cost of the choice is whatever you give up to make it. “What is economics?” is this same question.",
    testsHeading: "The short answer",
    tests:
      "Microeconomics looks at households and firms. Macroeconomics looks at the whole economy: output, prices, and jobs. A positive statement says what is. A normative statement says what ought to be. Economics is not a list of stock tips.",
    cardRule:
      "One distinction per card. Scarcity, opportunity cost, and micro versus macro unlock the rest of the list.",
    schedule: schedule("Start with scarcity and opportunity cost."),
    cards: [
      card(
        "What is economics?",
        "The study of how people choose when they cannot have everything they want.",
      ),
      card(
        "What is scarcity?",
        "Wants exceed the resources available to satisfy them.",
      ),
      card(
        "What is opportunity cost?",
        "The next-best alternative you give up when you choose.",
      ),
      card(
        "What is microeconomics?",
        "Choices of households and firms.",
      ),
      card(
        "What is macroeconomics?",
        "The whole economy: output, prices, and jobs.",
      ),
      card(
        "What is a positive statement?",
        "A claim about what is, which evidence can check.",
      ),
      card(
        "What is a normative statement?",
        "A claim about what ought to be.",
      ),
      card(
        "Is economics the same as personal finance?",
        "No. Personal finance is one set of choices. Economics is the study of choice under scarcity.",
      ),
    ],
  },
  {
    slug: "capital",
    fieldLabel: "Capital",
    headline: "What is capital in economics",
    description:
      "What is capital in economics: produced goods used to make other goods, not the cash in an account. A sample deck and a spaced review schedule.",
    lede: "Capital is a produced means of production. Machines, tools, and buildings used to make other goods are capital. In everyday speech the word means money. In economics, money that buys those goods is financial capital, not the capital good itself.",
    testsHeading: "The short answer",
    tests:
      "Capital is a factor of production, along with labor and land. Physical capital is the equipment. Human capital is the skill of the people using it. Physical capital wears out, which is depreciation.",
    cardRule:
      "One kind of capital per card. Physical, human, and financial do not share an answer.",
    schedule: schedule("Start with the produced means of production, then money."),
    cards: [
      card(
        "What is capital in economics?",
        "A produced good used to make other goods, such as a machine or a building.",
      ),
      card(
        "Is the cash in a bank account capital?",
        "It is financial capital. It is a claim you can use to buy capital goods. It is not itself a machine.",
      ),
      card(
        "What is physical capital?",
        "Tools, machines, and buildings used in production.",
      ),
      card(
        "What is human capital?",
        "The skills and knowledge a person uses in production.",
      ),
      card(
        "What are the factors of production?",
        "Land, labor, and capital. Some lists add entrepreneurship.",
      ),
      card(
        "What is depreciation?",
        "The wearing out of physical capital.",
      ),
      card(
        "Is a factory building capital?",
        "Yes. It was produced, and it is used to produce other goods.",
      ),
      card(
        "Is a loaf of bread capital?",
        "No, if it is eaten. A good used up in consumption is not capital.",
      ),
    ],
  },
  {
    slug: "scarcity",
    fieldLabel: "Scarcity",
    headline: "What is scarcity in economics",
    description:
      "What is scarcity in economics: wants exceed resources, and how that differs from a shortage. A sample deck and a spaced review schedule.",
    lede: "Scarcity means wants exceed the resources available to meet them. It is why a choice has a cost. A rich person still faces scarcity, because time and goods are finite.",
    testsHeading: "The short answer",
    tests:
      "Scarcity is not poverty, and it is not a shortage. Poverty is a lack of means. A shortage is what happens when a price is held below the market price, so quantity demanded exceeds quantity supplied. Scarcity is the condition that makes economics necessary. It does not go away when a particular shelf is restocked.",
    cardRule:
      "One contrast per card. Scarcity, shortage, and poverty are three different words.",
    schedule: schedule("Start with the definition, then shortage."),
    cards: [
      card(
        "What is scarcity?",
        "Wants exceed the resources available to satisfy them.",
      ),
      card(
        "Does a wealthy person face scarcity?",
        "Yes. Time and goods are still finite.",
      ),
      card(
        "What is a shortage?",
        "Quantity demanded exceeds quantity supplied because the price is held below the market price.",
      ),
      card(
        "Is scarcity the same as a shortage?",
        "No. A shortage is a price problem. Scarcity is the permanent gap between wants and resources.",
      ),
      card(
        "Is scarcity the same as poverty?",
        "No. Poverty is a lack of means. Scarcity is the reason every choice has a cost.",
      ),
      card(
        "Why does scarcity create opportunity cost?",
        "Choosing one use of a resource means giving up the next-best use.",
      ),
      card(
        "What is a free good?",
        "A good so abundant that using more of it costs nothing. Most goods are not free.",
      ),
      card(
        "Does restocking a store end scarcity?",
        "No. It can end a shortage of that item. Wants still exceed resources.",
      ),
    ],
  },
  {
    slug: "elasticity",
    fieldLabel: "Elasticity",
    headline: "What is elasticity in economics",
    description:
      "What is elasticity in economics: how much quantity responds to a price change, in percent. A sample deck and a spaced review schedule.",
    lede: "Elasticity measures how much one variable responds to a change in another. Price elasticity of demand is the percent change in quantity demanded divided by the percent change in price.",
    testsHeading: "The short answer",
    tests:
      "Ignore the minus sign and compare the result with 1. Greater than 1 means elastic: quantity moves by a larger percent than price. Less than 1 means inelastic. Equal to 1 means unit elastic. Elasticity is not the slope of the curve. Slope depends on the units. A ratio of percents does not.",
    cardRule:
      "One cutoff or one contrast per card. Elastic, inelastic, and slope stay separate.",
    schedule: schedule("Start with the ratio, then the comparison with 1."),
    cards: [
      card(
        "What is price elasticity of demand?",
        "The percent change in quantity demanded divided by the percent change in price.",
      ),
      card(
        "When is demand elastic?",
        "When the absolute value of that ratio is greater than 1.",
      ),
      card(
        "When is demand inelastic?",
        "When the absolute value is less than 1.",
      ),
      card(
        "What is unit elastic?",
        "The absolute value equals 1. Quantity and price change by the same percent.",
      ),
      card(
        "Why talk about the absolute value?",
        "The raw ratio for demand is negative, because a higher price means a lower quantity.",
      ),
      card(
        "Is elasticity the same as slope?",
        "No. Slope depends on units. Elasticity is a ratio of percent changes.",
      ),
      card(
        "Which goods tend to have less elastic demand?",
        "Necessities, and goods with few substitutes.",
      ),
      card(
        "When is demand usually more elastic?",
        "In the long run, and when buyers have many substitutes.",
      ),
    ],
  },
  {
    slug: "demand",
    fieldLabel: "Demand",
    headline: "What is demand in economics",
    description:
      "What is demand in economics: the relationship between price and quantity buyers will purchase. A sample deck and a spaced review schedule.",
    lede: "Demand is the relationship between the price of a good and the quantity buyers are willing and able to purchase, other things held equal. A wish without the ability to pay is not demand.",
    testsHeading: "The short answer",
    tests:
      "Quantity demanded is one point on that relationship. Demand is the whole curve. A higher price, by itself, moves you along the curve. It does not shift demand. The curve shifts when income, tastes, the prices of related goods, expectations, or the number of buyers change.",
    cardRule:
      "One movement per card. A slide along the curve and a shift of the curve are different events.",
    schedule: schedule("Start with demand versus quantity demanded."),
    cards: [
      card(
        "What is demand?",
        "The relationship between price and the quantity buyers are willing and able to buy, other things equal.",
      ),
      card(
        "What is quantity demanded?",
        "The amount buyers will purchase at one price. One point on the demand curve.",
      ),
      card(
        "What does the law of demand say?",
        "Other things equal, a higher price means a lower quantity demanded.",
      ),
      card(
        "Does a price change shift the demand curve?",
        "No. It moves quantity demanded along the curve.",
      ),
      card(
        "What shifts demand?",
        "Income, tastes, prices of related goods, expectations, or the number of buyers.",
      ),
      card(
        "Is wanting a good the same as demanding it?",
        "No. Demand requires the willingness and the ability to pay.",
      ),
      card(
        "What is a substitute?",
        "A good buyers use instead. A higher price for the substitute can raise demand for this good.",
      ),
      card(
        "What is a complement?",
        "A good buyers use together with this one. A higher price for the complement can lower demand.",
      ),
    ],
  },
  {
    slug: "bubble",
    fieldLabel: "Bubble",
    headline: "What is a bubble in economics",
    description:
      "What is a bubble in economics: a price driven by the hope of selling higher, not by the asset’s income. A sample deck and a spaced review schedule.",
    lede: "A bubble is a price pushed up because buyers expect to sell to someone else at a still higher price, rather than because of the asset’s income or use. When that expectation breaks, the price can fall fast.",
    testsHeading: "The short answer",
    tests:
      "A high price is not automatically a bubble. An asset can be expensive because its earnings are high. Credit often feeds a bubble, because buyers bid with borrowed money. You can usually name a bubble only after it pops. Two cases people study are dot-com stocks around 2000 and United States housing before 2008.",
    cardRule:
      "One check per card. A high price, borrowed money, and the reason for buying do not collapse into one slogan.",
    schedule: schedule("Start with why the buyer is paying, then what a high price does not prove."),
    cards: [
      card(
        "What is a bubble?",
        "A price driven by the belief that someone else will pay still more, rather than by the asset’s income or use.",
      ),
      card(
        "Does a high price prove a bubble?",
        "No. The price may match high earnings or high usefulness.",
      ),
      card(
        "What belief holds a bubble up?",
        "That a later buyer will pay more than today’s price.",
      ),
      card(
        "What often feeds a bubble?",
        "Easy credit. Buyers can bid with borrowed money.",
      ),
      card(
        "When is a bubble usually clear?",
        "After it pops, when buyers no longer expect a further rise.",
      ),
      card(
        "Name a commonly studied stock bubble.",
        "Dot-com stocks around 2000.",
      ),
      card(
        "Name a commonly studied housing bubble.",
        "United States housing before 2008.",
      ),
      card(
        "Is a bubble the same as a rise in demand?",
        "No. Demand can raise a price because the good became more useful. A bubble raises it because of the resale bet.",
      ),
    ],
  },
  {
    slug: "technology-distribution",
    fieldLabel: "Distribution",
    headline: "What is one way that technology can improve the distribution of goods?",
    description:
      "One way technology improves distribution: it shows where goods are and where buyers want them, so the trip is shorter. A sample deck and a spaced review schedule.",
    lede: "One way is tracking. A scanner, a map, or an order on a screen shows where the goods are and where a buyer wants them. The goods can then take a shorter path, and less of them sit in the wrong warehouse.",
    testsHeading: "The short answer",
    tests:
      "Distribution is the work of getting a finished good from the maker to the buyer. Technology improves that work when it cuts the time or the waste in the trip. A barcode tells a warehouse what is on the shelf. A route planned from live traffic shortens the drive. An online order lets the good go to the buyer’s door instead of waiting in a shop the buyer may never visit. None of this removes scarcity. It changes the cost of matching a good to a person who will buy it.",
    cardRule:
      "One way per card. Tracking, routing, and the online order stay separate.",
    schedule: schedule("Start with the one-way answer, then two more ways."),
    cards: [
      card(
        "What is one way that technology can improve the distribution of goods?",
        "By tracking where the goods are and where buyers want them, so the goods take a shorter path.",
      ),
      card(
        "What is distribution?",
        "Getting a finished good from the maker to the buyer.",
      ),
      card(
        "How does a barcode help?",
        "The warehouse can see what is on the shelf instead of guessing.",
      ),
      card(
        "How does a live map help?",
        "The delivery can take a shorter road.",
      ),
      card(
        "How does an online order help?",
        "The good can go to the buyer instead of waiting in a shop the buyer may never visit.",
      ),
      card(
        "What waste does better tracking cut?",
        "Goods sitting in a warehouse where nobody nearby wants them, while another place has run out.",
      ),
      card(
        "Does this end scarcity?",
        "No. It lowers the cost of matching goods to buyers. Wants can still exceed resources.",
      ),
      card(
        "Is an advertisement the same as distribution?",
        "No. An ad can tell someone the good exists. Distribution is moving the good to them.",
      ),
    ],
  },
];

export function economicBySlug(slug) {
  return ECONOMICS.find((item) => item.slug === slug) ?? null;
}
