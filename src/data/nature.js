const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const NATURE = [
  {
    slug: "roses",
    fieldLabel: "Roses",
    headline: "What are the types of roses?",
    description:
      "What are the types of roses: the growth classes, from hybrid tea to climber. A sample deck and a spaced review schedule.",
    lede: "Rose types in a nursery are growth classes, not colors. A red rose can be a hybrid tea or a shrub. The class tells you the plant’s shape and how it flowers.",
    testsHeading: "The short answer",
    tests:
      "Hybrid teas carry large flowers, often one to a stem. Floribundas carry clusters of smaller flowers. Grandifloras sit between those two. Shrub roses are broader bushes. Climbers have long canes you train on a support. Miniatures are small plants with small flowers. Old garden roses are the classes grown before the modern hybrids. A species rose is a wild rose, not a garden hybrid.",
    cardRule:
      "One class per card. Color is not a class.",
    schedule: schedule("Start with hybrid tea, floribunda, and climber."),
    cards: [
      card("What is a hybrid tea?", "A rose with large flowers, often one bloom on a long stem."),
      card("What is a floribunda?", "A rose that flowers in clusters."),
      card("What is a grandiflora?", "A class between hybrid teas and floribundas."),
      card("What is a shrub rose?", "A broad bush, rather than a tall single-stem plant."),
      card("What is a climbing rose?", "A rose with long canes trained on a support. It does not cling by itself."),
      card("What is a miniature rose?", "A small plant with small flowers."),
      card("What is an old garden rose?", "A class grown before the modern hybrid teas."),
      card("Is “red” a type of rose?", "No. Red is a color. The type is the growth class."),
    ],
  },
  {
    slug: "trees",
    fieldLabel: "Trees",
    headline: "What are the most common types of trees?",
    description:
      "What are the most common types of trees: the first split is deciduous or evergreen, and common depends on the region. A sample deck and a spaced review schedule.",
    lede: "There is no single most common tree for the whole planet. The useful first split is deciduous or evergreen. After that, “common” means common where you are.",
    testsHeading: "The short answer",
    tests:
      "Deciduous trees drop their leaves for part of the year. Evergreens keep a canopy, and many of those are conifers with needles or scales. In temperate North America the trees people mean are oak, maple, pine, spruce, and birch. In many tropical places the common shapes are palm, fig, and acacia. A pine is a conifer. An oak is a broadleaf deciduous tree. Palm is a different growth form again.",
    cardRule:
      "One group per card. A regional example does not become the world champion.",
    schedule: schedule("Start with deciduous versus evergreen."),
    cards: [
      card("What is a deciduous tree?", "A tree that drops its leaves for part of the year."),
      card("What is an evergreen?", "A tree that keeps a canopy through the year."),
      card("What is a conifer?", "Usually an evergreen with cones and needles or scales, such as pine or spruce."),
      card("Name a broadleaf deciduous tree common in temperate forests.", "Oak, or maple."),
      card("Name a conifer common in temperate forests.", "Pine, or spruce."),
      card("Is there one most common tree species on Earth?", "No. Common depends on the region."),
      card("Name a growth form people call a tree in the tropics.", "Palm."),
      card("Is birch deciduous?", "Yes."),
    ],
  },
  {
    slug: "saltwater-fish",
    fieldLabel: "Saltwater fish",
    headline: "What are the types of saltwater fish?",
    description:
      "What are the types of saltwater fish: where they live in the sea, not a species catalog. A sample deck and a spaced review schedule.",
    lede: "Saltwater fish are grouped by where they live and by the skeleton, not by a single official list of types. Reef, open ocean, and the bottom are the places. Bony fish and cartilaginous fish are the two skeletons.",
    testsHeading: "The short answer",
    tests:
      "Reef fish stay near coral or rock. Pelagic fish live in open water. Bottom fish, or demersal fish, live on or near the sea floor. Most familiar fish are bony fish. Sharks and rays are cartilaginous fish. Their skeletons are cartilage. A freshwater fish is not a saltwater type. Brackish water, where river and sea mix, is a third habitat.",
    cardRule:
      "One habitat or one skeleton per card. A species name is an example, not a type.",
    schedule: schedule("Start with reef, open ocean, and the bottom."),
    cards: [
      card("What is a reef fish?", "A saltwater fish that stays near coral or rock."),
      card("What is a pelagic fish?", "A fish of the open water, away from the bottom."),
      card("What is a demersal fish?", "A fish that lives on or near the sea floor."),
      card("What is a bony fish?", "A fish whose skeleton is bone. Most familiar fish are bony."),
      card("What is a cartilaginous fish?", "A fish whose skeleton is cartilage, such as a shark or a ray."),
      card("Is a shark a bony fish?", "No. A shark is cartilaginous."),
      card("Is a trout a saltwater type?", "No. Trout are freshwater fish. Some move to sea, and the type people mean is still freshwater."),
      card("What is brackish water?", "A mix of river water and seawater. It is not the open ocean."),
    ],
  },
  {
    slug: "water",
    fieldLabel: "Water",
    headline: "What are the types of water?",
    description:
      "What are the types of water: fresh, salt, and brackish, and the drinking-water labels. A sample deck and a spaced review schedule.",
    lede: "Two different questions hide in the phrase. One is the water in the world: fresh, salt, and brackish. The other is the label on a bottle or a tap: spring, mineral, distilled, purified.",
    testsHeading: "The short answer",
    tests:
      "Fresh water has little dissolved salt. Salt water is the ocean. Brackish water is the mix, as in an estuary. Hard water has more dissolved minerals, often calcium and magnesium. Soft water has less. Distilled water was boiled and the steam collected, so most minerals are gone. Purified water was treated to remove impurities. Spring water is groundwater that came out at a spring. Mineral water carries a mineral content from its source. Tap water is whatever the local supply delivers.",
    cardRule:
      "One label per card. The world’s water and a bottle label do not share an answer.",
    schedule: schedule("Start with fresh, salt, and brackish."),
    cards: [
      card("What is fresh water?", "Water with little dissolved salt."),
      card("What is salt water?", "Ocean water, with a high dissolved-salt content."),
      card("What is brackish water?", "A mix of fresh water and seawater, as in an estuary."),
      card("What is hard water?", "Water with more dissolved minerals, often calcium and magnesium."),
      card("What is distilled water?", "Water collected from steam, with most minerals left behind."),
      card("What is spring water?", "Groundwater that reached the surface at a spring."),
      card("What is purified water?", "Water treated to remove impurities. The word does not name the source."),
      card("Is mineral water the same as distilled water?", "No. Mineral water keeps minerals from its source. Distilled water has had them removed."),
    ],
  },
];

export function natureBySlug(slug) {
  return NATURE.find((item) => item.slug === slug) ?? null;
}
