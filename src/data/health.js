const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const HEALTH = [
  {
    slug: "psoriatic-arthritis",
    fieldLabel: "Psoriatic arthritis",
    headline: "What are the 5 types of psoriatic arthritis?",
    description:
      "What are the 5 types of psoriatic arthritis: the classic five patterns, and why they can overlap. A sample deck and a spaced review schedule.",
    lede: "The five names are a classic way to describe the pattern of the joints. They are not five separate diseases, and they are not a test you run on yourself. A person can show more than one pattern.",
    testsHeading: "The short answer",
    tests:
      "The five are asymmetric oligoarthritis, symmetric polyarthritis, distal interphalangeal predominant disease, spondylitis, and arthritis mutilans. Oligoarthritis means a few joints, not the same joints on both sides. Symmetric polyarthritis hits many joints on both sides and can look like rheumatoid arthritis. Distal disease hits the joints next to the nails. Spondylitis hits the spine and the sacroiliac joints. Arthritis mutilans is the rare, destructive form. Psoriasis of the skin may come before, with, or after the joints.",
    cardRule:
      "One pattern per card. The pattern is a description, not a diagnosis you assign from a list.",
    schedule: schedule("Start with the five names, then which joints each one picks."),
    cards: [
      card("What is asymmetric oligoarthritis here?", "A few joints, not matching sides."),
      card("What is symmetric polyarthritis here?", "Many joints on both sides. It can resemble rheumatoid arthritis."),
      card("What does distal interphalangeal predominant mean?", "The joints closest to the fingernails and toenails."),
      card("What does spondylitis affect?", "The spine and the sacroiliac joints."),
      card("What is arthritis mutilans?", "The rare, severe form that destroys joints."),
      card("Can one person fit more than one pattern?", "Yes."),
      card("Does the skin rash have to come first?", "No. The skin and the joints can start in either order."),
      card("Does naming the pattern diagnose you?", "No. A clinician uses the exam, the history, and tests."),
    ],
  },
  {
    slug: "ocd-types",
    fieldLabel: "OCD",
    headline: "What are the 4 types of OCD",
    description:
      "What are the 4 types of OCD: four common symptom themes, and why they are not four diagnoses. A sample deck and a spaced review schedule.",
    lede: "People use “four types” for four themes of obsessive-compulsive disorder. The diagnosis is still one disorder. A person can have more than one theme. These names are not four official diseases.",
    testsHeading: "The short answer",
    tests:
      "The four themes are contamination and cleaning, harm and checking, symmetry and ordering, and unwanted taboo thoughts. Contamination is the fear of germs or dirt and the washing that answers it. Harm is the fear of causing damage, and the checking that answers it. Symmetry is the “just right” feeling. Taboo thoughts are unwanted violent, sexual, or religious ideas. Having the thought is not the same as wanting to act. Hoarding is its own diagnosis now, not a fifth type of OCD.",
    cardRule:
      "One theme per card. The theme and the diagnosis stay separate.",
    schedule: schedule("Start with the four themes, then what they are not."),
    cards: [
      card("Are there four official OCD diagnoses?", "No. These are four common themes inside one disorder."),
      card("What is the contamination theme?", "Fear of germs or dirt, often answered by washing or avoiding."),
      card("What is the harm theme?", "Fear of causing damage, often answered by checking."),
      card("What is the symmetry theme?", "A need for order, balance, or a “just right” feeling."),
      card("What is the taboo-thought theme?", "Unwanted violent, sexual, or religious thoughts."),
      card("Does having an unwanted thought mean you want to act on it?", "No. The thought is unwanted."),
      card("Can one person have more than one theme?", "Yes."),
      card("Is hoarding one of these four?", "No. Hoarding is its own diagnosis."),
    ],
  },
  {
    slug: "blood-types",
    fieldLabel: "Blood types",
    headline: "What are the blood types",
    description:
      "What are the blood types: the eight ABO and Rh labels used for transfusion. A sample deck and a spaced review schedule.",
    lede: "The blood types people mean are the ABO letter plus the Rh sign. That gives eight labels. A hospital match uses more antigens than those eight.",
    testsHeading: "The short answer",
    tests:
      "The letters are A, B, AB, and O. Each can be Rh positive or Rh negative: A+, A−, B+, B−, AB+, AB−, O+, and O−. Type A red cells carry the A antigen. Type O red cells carry neither A nor B. In an emergency, O negative red cells are the ones given when the recipient’s type is unknown, because those cells lack A, B, and Rh antigens. AB positive patients can receive red cells of the other ABO and Rh types in that emergency shorthand. Plasma runs the other way: AB plasma is the one that lacks anti-A and anti-B antibodies.",
    cardRule:
      "One type fact per card. Red cells and plasma do not share an answer.",
    schedule: schedule("Start with the eight labels, then O negative red cells."),
    cards: [
      card("What are the four ABO letters?", "A, B, AB, and O."),
      card("What does the plus or minus mean?", "Rh positive or Rh negative."),
      card("How many labels does that make?", "Eight."),
      card("What antigens are on type O red cells?", "Neither A nor B."),
      card("What antigens are on type AB red cells?", "Both A and B."),
      card("Which red cells are used in an emergency when the type is unknown?", "O negative."),
      card("Which patients can receive the other red-cell types in that shorthand?", "AB positive."),
      card("Which plasma lacks both anti-A and anti-B antibodies?", "AB plasma."),
    ],
  },
  {
    slug: "dental-fillings",
    fieldLabel: "Fillings",
    headline: "What are the types of dental fillings",
    description:
      "What are the types of dental fillings: amalgam, composite, glass ionomer, ceramic, and gold. A sample deck and a spaced review schedule.",
    lede: "A filling replaces tooth lost to decay or a break. The types are materials. The dentist picks from the tooth, the bite, and how long the repair should last. The list is not a ranking of a best filling.",
    testsHeading: "The short answer",
    tests:
      "Amalgam is the silver-colored mix of metals. Composite is tooth-colored resin with glass. Glass ionomer is another tooth-colored material, often used where fluoride release and less biting force matter. Ceramic, including porcelain, is a harder tooth-colored piece, sometimes made outside the mouth. Gold is a metal filling or inlay. A temporary filling is a placeholder, not one of those lasting materials.",
    cardRule:
      "One material per card. Color and strength stay on that material’s card.",
    schedule: schedule("Start with amalgam and composite."),
    cards: [
      card("What is amalgam?", "A silver-colored mix of metals."),
      card("What is composite?", "A tooth-colored resin mixed with glass particles."),
      card("What is glass ionomer used for?", "Tooth-colored repairs, often where the bite is lighter and fluoride release is useful."),
      card("What is a ceramic filling?", "A harder tooth-colored piece, sometimes made outside the mouth."),
      card("What is a gold filling?", "A gold alloy formed to the cavity, often as an inlay."),
      card("Is a temporary filling a type of its own?", "It is a placeholder until a lasting material goes in."),
      card("Does tooth-colored mean one material?", "No. Composite, glass ionomer, and ceramic can all match the tooth."),
      card("Who chooses the material?", "The dentist, from the tooth and the bite. The list is not a ranking."),
    ],
  },
  {
    slug: "cigarettes",
    fieldLabel: "Cigarettes",
    headline: "What are the different types of cigarettes?",
    description:
      "What are the different types of cigarettes: filters, menthol, and the products that are not cigarettes. A sample deck and a spaced review schedule.",
    lede: "The types are product categories. A filter, a menthol flavor, and the word “light” are labels on a cigarette. They are not a scale of safety. Cigars and vapes are different products.",
    testsHeading: "The short answer",
    tests:
      "A filtered cigarette has a filter tip. An unfiltered cigarette does not. Menthol is a flavor added to the tobacco, not a different plant. “Light” and “low tar” were marketing words. They were not a safer type, and many countries stopped those words on packs. A clove cigarette, or kretek, mixes tobacco with ground clove. A cigar is rolled tobacco and is not a cigarette. An e-cigarette heats a liquid. It is not a cigarette.",
    cardRule:
      "One product label per card. Do not treat a label as a health ranking.",
    schedule: schedule("Start with filter and menthol, then what is not a cigarette."),
    cards: [
      card("What is a filtered cigarette?", "A cigarette with a filter tip."),
      card("What is menthol on a cigarette?", "A flavor added to the tobacco. It is not a different plant."),
      card("What was a “light” cigarette?", "A marketing label. It was not a safer type."),
      card("What is a kretek?", "A cigarette that mixes tobacco with ground clove."),
      card("Is a cigar a cigarette?", "No. A cigar is rolled tobacco leaf, in a different size and wrap."),
      card("Is an e-cigarette a cigarette?", "No. It heats a liquid. It does not burn cut tobacco in paper."),
      card("Does a filter make the product safe?", "No. A filter is a product feature, not a safety rating."),
      card("What are these types for on a card?", "Telling the products apart. They are not advice to use them."),
    ],
  },
];

export function healthBySlug(slug) {
  return HEALTH.find((item) => item.slug === slug) ?? null;
}
