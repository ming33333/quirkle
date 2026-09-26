const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const GEMSTONES = [
  {
    slug: "blue",
    fieldLabel: "Blue",
    headline: "Blue gemstones",
    description:
      "Blue gemstones to learn by heart: sapphire, tanzanite, aquamarine, and the facts that tell them apart, plus a spaced review schedule.",
    lede: "Blue is a crowded color. Sapphire, tanzanite, aquamarine, and lapis can all look blue in a photo. The deck is the hardness and the mineral, so you can tell them apart without the picture.",
    testsHeading: "Stones in this color",
    tests:
      "Start with the ones people actually buy: sapphire, aquamarine, tanzanite, turquoise, and lapis lazuli. A treated blue topaz is common in shops and softer in price than it looks.",
    cardRule:
      "One stone per card. The answer is the mineral and the Mohs hardness, not a paragraph about meaning. If two stones share a color, the hardness is the fact that separates them.",
    schedule: schedule("Start with sapphire and tanzanite, the pair people mix up."),
    cards: [
      card("What mineral is a blue sapphire, and how hard is it?", "Corundum. Mohs 9."),
      card("What makes a sapphire blue?", "Iron and titanium in the corundum."),
      card("What is tanzanite?", "Blue to violet zoisite, mostly from Tanzania. About Mohs 6 to 6.5."),
      card("What mineral is aquamarine?", "Beryl. Mohs about 7.5 to 8."),
      card("Is lapis lazuli one mineral?", "No. It is a rock, mostly lazurite. About Mohs 5 to 5.5."),
      card("How hard is turquoise?", "About Mohs 5 to 6. Its color comes from copper."),
      card("How hard is blue topaz, and what should you know about the color?", "Mohs 8. A lot of the bright blue in shops is treated."),
      card("What is iolite?", "A violet-blue stone, about Mohs 7 to 7.5. It can look a different color from another angle."),
    ],
  },
  {
    slug: "green",
    fieldLabel: "Green",
    headline: "Green gemstones",
    description:
      "Green gemstones to learn by heart: emerald, jade, peridot, and the facts that tell them apart, plus a spaced review schedule.",
    lede: "Green covers emerald, two different jades, and a pile of softer stones that only look similar in a photo. Learn the mineral first. The color name is not the identification.",
    testsHeading: "Stones in this color",
    tests:
      "Emerald, jadeite, nephrite, peridot, and tsavorite are the ones worth knowing before the rare collectors’ stones. Malachite is green and banded, and too soft for a ring you wear every day.",
    cardRule:
      "One stone per card. Say the mineral and the hardness. Jade is two minerals, so jadeite and nephrite are two cards.",
    schedule: schedule("Start with emerald and the two jades."),
    cards: [
      card("What mineral is emerald?", "Green beryl, colored by chromium or vanadium. Mohs about 7.5 to 8."),
      card("Why do emeralds usually show inclusions?", "The crystals grow with internal marks. A flawless emerald is unusual."),
      card("What are the two minerals called jade?", "Jadeite and nephrite. They are not the same mineral."),
      card("How hard is jadeite?", "About Mohs 6.5 to 7. It is the jade more often used as a gem."),
      card("What is peridot?", "Olive-green olivine. About Mohs 6.5 to 7."),
      card("What is tsavorite?", "A green garnet. About Mohs 7 to 7.5."),
      card("How hard is malachite, and what does it look like?", "About Mohs 3.5 to 4. It is banded green and too soft for daily wear."),
      card("What is chrome diopside?", "A vivid green stone. About Mohs 5.5 to 6."),
    ],
  },
  {
    slug: "black",
    fieldLabel: "Black",
    headline: "Black gemstones",
    description:
      "Black gemstones to learn by heart: onyx, spinel, obsidian, jet, and the facts that tell them apart, plus a spaced review schedule.",
    lede: "Black stones get lumped together in jewelry photos. Some are glass, some are fossil wood, and some are dyed chalcedony. The deck is what the material actually is.",
    testsHeading: "Stones in this color",
    tests:
      "Onyx, black spinel, obsidian, jet, and schorl cover most of what shops call a black gemstone. Hematite is the metallic gray-black one. A solid black “onyx” in a cheap setting is often dyed.",
    cardRule:
      "One material per card. Say whether it is a mineral, a glass, or organic. Hardness is the second fact.",
    schedule: schedule("Start with onyx, jet, and obsidian, the three people confuse."),
    cards: [
      card("What is onyx?", "Chalcedony, a type of quartz. Solid black beads are often dyed. About Mohs 6.5 to 7."),
      card("What is black spinel?", "A natural black mineral. Mohs 8."),
      card("What is obsidian?", "Volcanic glass, not a crystal. About Mohs 5 to 5.5."),
      card("What is jet?", "Fossilized wood, so it is organic. About Mohs 2.5 to 4."),
      card("What is schorl?", "Black tourmaline. About Mohs 7 to 7.5."),
      card("What is hematite?", "A metallic gray-black iron mineral. About Mohs 5.5 to 6.5."),
      card("How hard is a black diamond?", "Mohs 10, the same as any diamond. Some black diamonds are treated."),
      card("What is a black sapphire?", "Corundum, like a blue sapphire. Mohs 9."),
    ],
  },
  {
    slug: "purple",
    fieldLabel: "Purple",
    headline: "Purple gemstones",
    description:
      "Purple gemstones to learn by heart: amethyst, tanzanite, sapphire, and the facts that tell them apart, plus a spaced review schedule.",
    lede: "Amethyst is the purple stone people mean first, and it is ordinary quartz. Tanzanite, purple sapphire, and fluorite can share the color and not the hardness.",
    testsHeading: "Stones in this color",
    tests:
      "Amethyst, tanzanite, purple sapphire, and fluorite are enough to sort most purple stones. Sugilite and charoite are the less common ones with their own look.",
    cardRule:
      "One stone per card. The answer names the mineral and the hardness. Amethyst and fluorite are the pair to keep straight, because one is durable and one is not.",
    schedule: schedule("Start with amethyst and fluorite."),
    cards: [
      card("What is amethyst?", "Purple quartz, colored by iron. Mohs 7."),
      card("Can tanzanite be purple?", "Yes. It runs from blue to violet. About Mohs 6 to 6.5."),
      card("How hard is a purple sapphire?", "Mohs 9. It is corundum, the same mineral as a blue sapphire."),
      card("How hard is purple fluorite?", "Mohs 4. It scratches easily."),
      card("What is sugilite?", "A purple stone, about Mohs 5.5 to 6.5."),
      card("What is charoite?", "A swirling purple stone from Russia. About Mohs 5 to 6."),
      card("What is kunzite?", "Pink to violet spodumene. About Mohs 6.5 to 7."),
      card("What is iolite known for, besides the color?", "It can look violet from one angle and a different color from another. About Mohs 7 to 7.5."),
    ],
  },
  {
    slug: "pink",
    fieldLabel: "Pink",
    headline: "Pink gemstones",
    description:
      "Pink gemstones to learn by heart: sapphire, morganite, rose quartz, and the facts that tell them apart, plus a spaced review schedule.",
    lede: "Pink sapphire and rose quartz can look alike in a listing photo. One is corundum and hard. The other is quartz. Morganite is the pink member of the beryl family, with emerald and aquamarine.",
    testsHeading: "Stones in this color",
    tests:
      "Pink sapphire, morganite, rose quartz, rubellite, and kunzite cover the usual pink stones. Rhodochrosite is the banded pink one, and it is soft. A pink diamond is a different material entirely.",
    cardRule:
      "One stone per card. Name the mineral family and the hardness. Sapphire, morganite, and rose quartz are the three to separate first.",
    schedule: schedule("Start with pink sapphire, morganite, and rose quartz."),
    cards: [
      card("What is a pink sapphire?", "Corundum. Mohs 9."),
      card("What is morganite?", "Pink beryl, the same family as emerald and aquamarine. About Mohs 7.5 to 8."),
      card("What is rose quartz?", "Pink quartz. Mohs 7."),
      card("What is rubellite?", "Pink to red tourmaline. About Mohs 7 to 7.5."),
      card("What is kunzite?", "Pink to violet spodumene. About Mohs 6.5 to 7."),
      card("How hard is rhodochrosite?", "About Mohs 3.5 to 4. It often shows pink and white bands."),
      card("How hard is a pink diamond?", "Mohs 10."),
      card("What is pezzottaite?", "A rare pink stone related to beryl. Mohs 8."),
    ],
  },
  {
    slug: "red",
    fieldLabel: "Red",
    headline: "Red gemstones",
    description:
      "Red gemstones to learn by heart: ruby, spinel, garnet, and the facts that tell them apart, plus a spaced review schedule.",
    lede: "Ruby and red spinel were mixed up for centuries, including in famous jewels. Garnet is the common dark red. The color is not enough. The mineral is the card.",
    testsHeading: "Stones in this color",
    tests:
      "Ruby, red spinel, and the red garnets are the core. Rubellite is a red tourmaline. Carnelian and jasper are the opaque chalcedony side. Coral is organic, not a mineral.",
    cardRule:
      "One stone per card. Say the mineral and the hardness. Ruby and spinel stay as a pair until you can separate them without looking.",
    schedule: schedule("Start with ruby and red spinel."),
    cards: [
      card("What is a ruby?", "Red corundum, colored by chromium. Mohs 9."),
      card("How is red spinel different from ruby?", "Spinel is a different mineral. Mohs 8. Famous “rubies” have turned out to be spinel."),
      card("What is pyrope?", "A dark red garnet. About Mohs 7 to 7.5."),
      card("What is rubellite?", "Red to pink tourmaline. About Mohs 7 to 7.5."),
      card("What is carnelian?", "Orange-red chalcedony, a type of quartz. About Mohs 6.5 to 7."),
      card("What is red jasper?", "Opaque red quartz. About Mohs 6.5 to 7."),
      card("What is red coral?", "An organic gem from the sea, not a mineral. About Mohs 3 to 4."),
      card("What do ruby and sapphire share?", "Both are corundum. The color is the difference. Both are Mohs 9."),
    ],
  },
  {
    slug: "yellow",
    fieldLabel: "Yellow",
    headline: "Yellow gemstones",
    description:
      "Yellow gemstones to learn by heart: sapphire, citrine, heliodor, and the facts that tell them apart, plus a spaced review schedule.",
    lede: "Yellow sapphire, citrine, and yellow topaz get sold side by side. Citrine is quartz, and a lot of it started as amethyst that was heated. Amber looks golden and is not a mineral at all.",
    testsHeading: "Stones in this color",
    tests:
      "Yellow sapphire, citrine, heliodor, and yellow topaz are the usual transparent stones. Amber is the soft organic one. A yellow diamond is the hard one, Mohs 10.",
    cardRule:
      "One stone per card. Mineral and hardness. Citrine and yellow sapphire are the pair to drill, because the price and the durability are far apart.",
    schedule: schedule("Start with citrine and yellow sapphire."),
    cards: [
      card("What is a yellow sapphire?", "Corundum. Mohs 9."),
      card("What is citrine?", "Yellow quartz. Mohs 7. A lot of commercial citrine is heat-treated amethyst."),
      card("What is heliodor?", "Yellow beryl. About Mohs 7.5 to 8."),
      card("How hard is yellow topaz?", "Mohs 8."),
      card("How hard is a yellow diamond?", "Mohs 10."),
      card("What is amber?", "Fossilized tree resin, so it is organic. About Mohs 2 to 2.5. It feels warm."),
      card("What is chrysoberyl?", "A yellow to green mineral. Mohs 8.5."),
      card("What do yellow sapphire and citrine not share?", "The mineral. Sapphire is corundum, Mohs 9. Citrine is quartz, Mohs 7."),
    ],
  },
];

export function gemstoneBySlug(slug) {
  return GEMSTONES.find((stone) => stone.slug === slug) ?? null;
}
