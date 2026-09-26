const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const CHEMISTRY = [
  {
    slug: "chemical-bonds",
    fieldLabel: "Bonds",
    headline: "What are the types of chemical bonds",
    description:
      "What are the types of chemical bonds: ionic, covalent, and metallic, and what is not a bond inside a molecule. A sample deck and a spaced review schedule.",
    lede: "The three bonds that hold atoms into substances are ionic, covalent, and metallic. Hydrogen bonds and van der Waals forces are attractions between molecules. They are not a fourth way atoms share or transfer electrons inside one substance in that same sense.",
    testsHeading: "The short answer",
    tests:
      "An ionic bond is the attraction between positive and negative ions after electrons have transferred, as in table salt. A covalent bond is a shared pair of electrons, as in a water molecule. A nonpolar covalent bond shares evenly. A polar covalent bond shares unevenly, so one atom pulls the electrons more. A metallic bond is metal atoms sharing a sea of electrons, which is why metals conduct. A hydrogen bond is an attraction between molecules, strong for an intermolecular force and still not a covalent bond.",
    cardRule:
      "One bond per card. Intermolecular forces get their own cards.",
    schedule: schedule("Start with ionic, covalent, and metallic."),
    cards: [
      card("What is an ionic bond?", "The attraction between positive and negative ions after electrons transfer."),
      card("What is a covalent bond?", "A shared pair of electrons between atoms."),
      card("What is a polar covalent bond?", "A covalent bond where one atom pulls the shared electrons more than the other."),
      card("What is a metallic bond?", "Metal atoms sharing a sea of electrons."),
      card("Why do metals conduct electricity?", "The shared electrons can move."),
      card("Name an ionic compound people already know.", "Table salt, sodium chloride."),
      card("Is a hydrogen bond a covalent bond?", "No. It is an attraction between molecules."),
      card("Are van der Waals forces chemical bonds inside a molecule?", "No. They are weak attractions between molecules."),
    ],
  },
];

export function chemistryBySlug(slug) {
  return CHEMISTRY.find((item) => item.slug === slug) ?? null;
}
