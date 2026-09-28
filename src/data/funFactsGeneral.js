const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const FUN_FACT_GENERAL = [
  {
    slug: "about-me",
    fieldLabel: "Fun facts",
    headline: "Fun facts about me",
    description: "Fun facts about me, and fun facts about yourself: prompts you fill in. A sample deck and a spaced review schedule.",
    lede: "A fun fact about you is a true detail you can say in one sentence. This deck is a set of prompts. Replace each answer with your own.",
    testsHeading: "A few facts",
    tests: "People also search for fun facts about yourself. It is the same task. A card that still has the prompt on the back is not finished.",
    cardRule: "One fact per card.",
    schedule: schedule("Edit the answers first."),
    cards: [
      card("What is a food you could eat every week?", "Write the food. This sample answer is a placeholder."),
      card("What is a place you want to see?", "Write the place."),
      card("What is a skill that surprises people?", "Write the skill."),
      card("What is a song you can sing from memory?", "Write the song."),
      card("What did you want to be when you were small?", "Write that job or dream."),
      card("What is a small habit you are proud of?", "Write the habit."),
      card("What is an animal you would be for a day?", "Write the animal, and why."),
      card("What is a fact about your name?", "Write what it means, or who chose it.")
    ],
  },
  {
    slug: "for-kids",
    fieldLabel: "Fun facts",
    headline: "Fun facts for kids",
    description: "Fun facts for kids: short true facts, one per card. A sample deck and a spaced review schedule.",
    lede: "A fact for a kid should be short, true, and sayable out loud. One card is one fact. A list of ten facts on one card will not stick.",
    testsHeading: "A few facts",
    tests: "There are eight planets. Pluto is a dwarf planet. Bananas are berries in the botanical sense, and strawberries are not. A lightning channel can be hotter than the surface of the Sun.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("How many planets are there?", "Eight."),
      card("What is Pluto?", "A dwarf planet, not the ninth planet."),
      card("Is a banana a berry?", "Yes, in the botanical sense. A strawberry is not."),
      card("Can lightning be hotter than the Sun?", "The channel of a bolt can be hotter than the Sun's surface. The Sun's core is much hotter than that."),
      card("How many neck bones does a giraffe have?", "Seven, the same number as a person."),
      card("Do goldfish remember for only three seconds?", "No. They can remember for months."),
      card("What is a group of crows called?", "A murder."),
      card("How long is a day on Earth?", "24 hours.")
    ],
  },
  {
    slug: "random",
    fieldLabel: "Fun facts",
    headline: "Random fun facts",
    description: "Random fun facts: a mixed deck of short true facts. A sample deck and a spaced review schedule.",
    lede: "A random fact is only useful if it is true and small enough to say. This deck mixes animals, space, and numbers. Add the next fact you want to keep.",
    testsHeading: "A few facts",
    tests: "Honey can last for thousands of years if it is sealed. An octopus has three hearts. A day on Venus is longer than its year.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("How many hearts does an octopus have?", "Three."),
      card("How long can sealed honey last?", "Thousands of years. Archaeologists have found edible honey in ancient jars."),
      card("Which planet has a day longer than its year?", "Venus. Mercury's solar day is also longer than its year."),
      card("What is the tallest animal?", "The giraffe."),
      card("What is the largest animal?", "The blue whale."),
      card("How many sides does a hexagon have?", "Six."),
      card("What is a group of flamingos called?", "A flamboyance."),
      card("Are bats blind?", "No.")
    ],
  },
  {
    slug: "weird",
    fieldLabel: "Fun facts",
    headline: "Weird fun facts",
    description: "Weird fun facts that are still true. A sample deck and a spaced review schedule.",
    lede: "A weird fact still has to be true. The odd part is the detail, not a made-up punch line.",
    testsHeading: "A few facts",
    tests: "Wombat droppings are cube-shaped. A mantis shrimp has far more kinds of color sensors than a person. A woodpecker's tongue can wrap behind the skull. Tardigrades can dry out and wait.",
    cardRule: "One fact per card.",
    schedule: schedule("Start with the sample cards."),
    cards: [
      card("What shape is wombat poop?", "Roughly a cube."),
      card("Where is a shrimp's heart?", "In its head."),
      card("What is strange about a mantis shrimp's eyes?", "They have many more kinds of color-sensing cells than a person."),
      card("Where does a woodpecker's tongue go?", "In many species it wraps behind the skull."),
      card("What can a tardigrade do when it dries out?", "It curls into a tun and waits. Some have survived a short trip in space."),
      card("Why does a blobfish look like a blob?", "It is built for deep pressure. At the surface the body sags."),
      card("Can a frog freeze and live?", "A wood frog can. Ice forms outside the cells."),
      card("What color is a polar bear's skin?", "Black. The fur looks white.")
    ],
  },
  {
    slug: "of-the-day",
    fieldLabel: "Fun facts",
    headline: "Fun facts of the day",
    description: "Fun facts of the day: the card that is due, not a new list every morning. A sample deck and a spaced review schedule.",
    lede: "The fact of the day is the card that is due. You do not need a new list each morning. A card you know waits. A card you miss comes back sooner.",
    testsHeading: "A few facts",
    tests: "Start with a small deck. When nothing is due, stop. Adding a fact you will not review is how a list becomes clutter.",
    cardRule: "One fact per card.",
    schedule: schedule("Review only what is due."),
    cards: [
      card("What is the fact of the day?", "The card that is due, not a headline that changes at midnight."),
      card("What do you do when nothing is due?", "Stop for the day."),
      card("How many hearts does an octopus have?", "Three."),
      card("How many planets are there?", "Eight."),
      card("What is the largest animal?", "The blue whale."),
      card("Are bats blind?", "No."),
      card("How long is a day on Earth?", "24 hours."),
      card("What shape is wombat poop?", "Roughly a cube.")
    ],
  }
];
