const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const BUILDING = [
  {
    slug: "construction-materials",
    fieldLabel: "Materials",
    headline: "What are the types of construction materials?",
    description:
      "What are the types of construction materials: the structural materials, and the ones that only finish a surface. A sample deck and a spaced review schedule.",
    lede: "Construction materials split into what holds the building up and what covers it. Concrete, steel, wood, and masonry carry loads. Glass, gypsum board, and paint usually do not.",
    testsHeading: "The short answer",
    tests:
      "Concrete is strong in compression and weak in tension, so reinforced concrete adds steel bars. Structural steel is strong in both and is shaped into beams and columns. Wood is the light structural material of houses, as lumber or as engineered sheets. Masonry is brick, block, or stone, stacked and mortared. Glass fills openings. Asphalt is the usual road surface, not a wall. A finish material can look structural and still be only a skin.",
    cardRule:
      "One material per card. Structure and finish stay separate.",
    schedule: schedule("Start with concrete, steel, and wood."),
    cards: [
      card("What is concrete good at?", "Compression. It is weak in tension unless steel reinforces it."),
      card("What is reinforced concrete?", "Concrete with steel bars that take the tension."),
      card("What is structural steel used for?", "Beams and columns that carry loads."),
      card("What is masonry?", "Brick, concrete block, or stone, laid with mortar."),
      card("Is wood only a finish?", "No. Lumber and engineered wood carry loads in many houses."),
      card("Is glass a structural material in an ordinary window?", "No. The frame carries the load. The glass fills the opening."),
      card("What is asphalt used for in construction?", "Road and roof surfaces, not a building’s frame."),
      card("What is a finish material?", "A skin such as paint or gypsum board. It is not what holds the building up."),
    ],
  },
  {
    slug: "construction-sites",
    fieldLabel: "Sites",
    headline: "What are the types of construction sites",
    description:
      "What are the types of construction sites: residential, commercial, industrial, civil, and renovation. A sample deck and a spaced review schedule.",
    lede: "A construction site is typed by what is being built, not by the brand of the crane. The usual split is residential, commercial, industrial, civil, and renovation.",
    testsHeading: "The short answer",
    tests:
      "Residential is houses and apartments. Commercial is offices, shops, and other buildings the public uses for business. Industrial is factories, plants, and warehouses built for a process. Civil, or infrastructure, is roads, bridges, tunnels, and utilities. Renovation changes a building that already stands. A site can be more than one of these if the project mixes them.",
    cardRule:
      "One site type per card. The building’s use is the test.",
    schedule: schedule("Start with residential, commercial, and civil."),
    cards: [
      card("What is a residential site?", "A site building houses or apartments."),
      card("What is a commercial site?", "A site building offices, shops, or other business space."),
      card("What is an industrial site?", "A site building a factory, plant, or process warehouse."),
      card("What is a civil site?", "A site building infrastructure: a road, bridge, tunnel, or utility."),
      card("What is a renovation site?", "A site changing a building that already exists."),
      card("Is a bridge a residential project?", "No. A bridge is civil construction."),
      card("Is an office tower commercial?", "Yes."),
      card("Can one project be two types?", "Yes. A warehouse with offices mixes industrial and commercial work."),
    ],
  },
  {
    slug: "construction-equipment",
    fieldLabel: "Equipment",
    headline: "What are the types of construction equipment",
    description:
      "What are the types of construction equipment: machines grouped by the job they do. A sample deck and a spaced review schedule.",
    lede: "Construction equipment is grouped by the job: digging, pushing, lifting, hauling, and placing concrete. The brand name is not the type.",
    testsHeading: "The short answer",
    tests:
      "An excavator digs with a bucket on an arm. A bulldozer pushes soil with a blade. A loader scoops and carries loose material a short distance. A crane lifts. A dump truck hauls. A concrete mixer and a concrete pump place concrete. A grader shapes a surface, often a road. A compactor packs soil or asphalt. Hand tools are equipment too, and they are not these machines.",
    cardRule:
      "One machine per card, named by the job it does.",
    schedule: schedule("Start with excavator, bulldozer, and crane."),
    cards: [
      card("What does an excavator do?", "It digs with a bucket on an arm."),
      card("What does a bulldozer do?", "It pushes soil with a blade."),
      card("What does a loader do?", "It scoops loose material and carries it a short way."),
      card("What does a crane do?", "It lifts loads."),
      card("What does a dump truck do?", "It hauls material off the site or across it."),
      card("What places concrete?", "A mixer holds it. A pump can push it to the forms."),
      card("What does a grader do?", "It shapes a flat surface, often for a road."),
      card("What does a compactor do?", "It packs soil or asphalt so the surface holds."),
    ],
  },
  {
    slug: "furniture",
    fieldLabel: "Furniture",
    headline: "What are the types of furniture?",
    description:
      "What are the types of furniture: pieces grouped by the job they do in a room. A sample deck and a spaced review schedule.",
    lede: "Furniture types follow the job: seating, a surface, storage, or a place to sleep. A style name such as mid-century is not a type. It is a look that any of those jobs can wear.",
    testsHeading: "The short answer",
    tests:
      "Seating is chairs, stools, sofas, and benches. Tables and desks are surfaces. Storage is shelves, dressers, cabinets, and wardrobes. Beds are for sleep. Freestanding furniture can be moved. Built-in furniture is fixed to the room. Outdoor furniture is made to sit outside, which is a setting, not a fifth job.",
    cardRule:
      "One job per card. A style name does not count as a type.",
    schedule: schedule("Start with seating, surfaces, and storage."),
    cards: [
      card("What counts as seating?", "Chairs, stools, sofas, and benches."),
      card("What is a table in this grouping?", "A surface. A desk is a surface for work."),
      card("What counts as storage?", "Shelves, dressers, cabinets, and wardrobes."),
      card("What is a bed’s job?", "Sleep."),
      card("What is freestanding furniture?", "A piece you can move without tearing it out of the room."),
      card("What is built-in furniture?", "A piece fixed to the wall or the floor."),
      card("Is “mid-century” a type?", "No. It is a style. The type is the job, such as a chair or a table."),
      card("Is outdoor furniture a different job?", "No. It is seating or a table made for weather."),
    ],
  },
];

export function buildingBySlug(slug) {
  return BUILDING.find((item) => item.slug === slug) ?? null;
}
