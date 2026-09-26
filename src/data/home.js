const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const HOME = [
  {
    slug: "knives",
    fieldLabel: "Knives",
    headline: "What are the types of knives?",
    description:
      "What are the types of knives: kitchen knives named by the job on a board. A sample deck and a spaced review schedule.",
    lede: "In a kitchen, knife types are jobs. A chef’s knife, a paring knife, and a bread knife are three jobs. A pocket knife is a different set, carried folded, and it is not one of those kitchen types.",
    testsHeading: "The short answer",
    tests:
      "A chef’s knife is the wide all-purpose blade. A santoku is a similar Japanese all-purpose blade, often with a flatter edge. A paring knife is small, for peeling and trimming in the hand. A utility knife sits between paring and chef’s in length. A bread knife is serrated so it saws a crust. A boning knife is narrow, for separating meat from bone. A cleaver is heavy, for chopping through bone or dense vegetables. Serrated and plain are edges, not those jobs.",
    cardRule:
      "One kitchen job per card. The edge and the pocket knife stay separate.",
    schedule: schedule("Start with chef’s, paring, and bread."),
    cards: [
      card("What is a chef’s knife for?", "The wide all-purpose blade on a board."),
      card("What is a santoku?", "A Japanese all-purpose knife, often with a flatter edge than a chef’s knife."),
      card("What is a paring knife for?", "Small cuts in the hand, such as peeling."),
      card("What is a bread knife?", "A serrated knife that saws through crust."),
      card("What is a boning knife?", "A narrow knife for separating meat from bone."),
      card("What is a cleaver for?", "Heavy chopping."),
      card("Is serrated a type of knife?", "It is an edge. A bread knife is the kitchen type that uses it."),
      card("Is a pocket knife a kitchen type?", "No. It is a folding knife made to be carried."),
    ],
  },
  {
    slug: "water-filters",
    fieldLabel: "Filters",
    headline: "What are the types of water filters?",
    description:
      "What are the types of water filters: sediment, carbon, reverse osmosis, and ultraviolet, and where they are installed. A sample deck and a spaced review schedule.",
    lede: "A water filter is named by what it removes, and separately by where it sits. A pitcher and a whole-house unit can use the same kind of filter. The location is not the method.",
    testsHeading: "The short answer",
    tests:
      "A sediment filter catches particles. Activated carbon catches many tastes, odors, and some chemicals. Reverse osmosis pushes water through a membrane and catches dissolved salts that carbon misses. Ultraviolet light kills or inactivates microbes. It does not remove dirt. An ion-exchange softener swaps calcium and magnesium for sodium or potassium. It is a treatment, and people still call it a filter in conversation. A pitcher is a place to put a carbon cartridge. It is not itself a method.",
    cardRule:
      "One method per card. The place it is installed gets its own card.",
    schedule: schedule("Start with sediment, carbon, and reverse osmosis."),
    cards: [
      card("What does a sediment filter remove?", "Particles such as sand and rust."),
      card("What does activated carbon remove?", "Many tastes, odors, and some chemicals."),
      card("What does reverse osmosis remove that carbon often misses?", "Dissolved salts, by pushing water through a membrane."),
      card("What does ultraviolet treatment do?", "It inactivates microbes. It does not catch dirt."),
      card("What does a water softener change?", "It swaps calcium and magnesium for sodium or potassium."),
      card("Is a pitcher a filter method?", "No. A pitcher is where a cartridge, often carbon, sits."),
      card("Is a faucet-mounted unit a different method?", "No. It is a location. The cartridge inside has the method."),
      card("Does one filter do every job?", "No. Sediment, carbon, membranes, and ultraviolet each miss something the others catch."),
    ],
  },
  {
    slug: "coffee",
    fieldLabel: "Coffee",
    headline: "What are the types of coffee?",
    description:
      "What are the types of coffee: the two bean species, and the drinks people mean by the same question. A sample deck and a spaced review schedule.",
    lede: "“Type of coffee” means two different lists. One is the bean: arabica or robusta. The other is the drink: espresso, drip, and the milk drinks built on espresso. A roast level is a third list.",
    testsHeading: "The short answer",
    tests:
      "Arabica is the species in most specialty cups. Robusta has more caffeine and a harsher taste, and it shows up in many blends and instant coffees. Espresso is a small drink made by forcing hot water through fine grounds under pressure. Drip, pour-over, and French press are brewed cups, not espresso. An americano is espresso lengthened with hot water. A latte is espresso with a larger amount of steamed milk. A cappuccino is espresso, steamed milk, and a thick foam cap. Light, medium, and dark are roast levels of the same bean.",
    cardRule:
      "One list per card. Bean, drink, and roast do not share an answer.",
    schedule: schedule("Start with arabica and robusta, then espresso."),
    cards: [
      card("What are the two main coffee species?", "Arabica and robusta."),
      card("Which species is in most specialty coffee?", "Arabica."),
      card("How is robusta different?", "More caffeine and a harsher taste. It is common in blends and instant coffee."),
      card("What is espresso?", "A small drink made by forcing hot water through fine grounds under pressure."),
      card("What is an americano?", "Espresso lengthened with hot water."),
      card("What is a latte?", "Espresso with a larger amount of steamed milk."),
      card("What is a cappuccino?", "Espresso, steamed milk, and a thick layer of foam."),
      card("Is dark roast a species?", "No. Light, medium, and dark are roast levels."),
    ],
  },
];

export function homeBySlug(slug) {
  return HOME.find((item) => item.slug === slug) ?? null;
}
