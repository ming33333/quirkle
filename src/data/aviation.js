const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const AVIATION = [
  {
    slug: "aircraft",
    fieldLabel: "Aircraft",
    headline: "What are the different types of aircraft?",
    description:
      "What are the different types of aircraft: airplane, helicopter, glider, and lighter-than-air. A sample deck and a spaced review schedule.",
    lede: "Aircraft is the wide word. An airplane is one type. A helicopter, a glider, and a balloon are aircraft and are not airplanes.",
    testsHeading: "The short answer",
    tests:
      "An airplane has fixed wings and an engine. A glider has fixed wings and no engine. A helicopter, and other rotorcraft, get lift from spinning blades. A balloon or an airship is lighter than air. A tiltrotor lifts with rotors and flies forward with those rotors tilted. A drone is a pilotless aircraft. It can be any of those shapes.",
    cardRule:
      "One kind of aircraft per card. Airplane and aircraft do not share an answer.",
    schedule: schedule("Start with airplane, helicopter, and glider."),
    cards: [
      card("What is an airplane?", "A fixed-wing aircraft with an engine."),
      card("What is a glider?", "A fixed-wing aircraft with no engine."),
      card("What is a helicopter?", "A rotorcraft. Spinning blades supply the lift."),
      card("What is a balloon?", "A lighter-than-air aircraft."),
      card("What is an airship?", "A powered lighter-than-air aircraft that can be steered."),
      card("What is a tiltrotor?", "An aircraft that lifts with rotors and tilts them forward to cruise."),
      card("Is a helicopter an airplane?", "No. Both are aircraft."),
      card("Is a drone a separate shape?", "No. A drone is an aircraft flown without a person on board. The shape can still be a plane or a rotorcraft."),
    ],
  },
  {
    slug: "airplanes",
    fieldLabel: "Airplanes",
    headline: "What are the different types of airplanes?",
    description:
      "What are the different types of airplanes: jet, turboprop, and piston, plus the job the plane is built for. A sample deck and a spaced review schedule.",
    lede: "Airplane types follow the engine and the job. Jet, turboprop, and piston are engines. Airliner, cargo, and private are jobs. A jet can be any of those jobs.",
    testsHeading: "The short answer",
    tests:
      "A jet airplane is pushed by jet engines. A turboprop uses a turbine to turn a propeller. A piston airplane uses a piston engine and a propeller, the usual small private plane. An airliner carries passengers on a schedule. A cargo plane carries freight. A seaplane can take off from water. A fighter is a military airplane built for air combat. Those job names are not engine types.",
    cardRule:
      "One engine or one job per card. Do not call every airplane a jet.",
    schedule: schedule("Start with jet, turboprop, and piston."),
    cards: [
      card("What is a jet airplane?", "An airplane pushed by jet engines."),
      card("What is a turboprop?", "An airplane whose turbine engine turns a propeller."),
      card("What is a piston airplane?", "An airplane with a piston engine and a propeller."),
      card("What is an airliner?", "An airplane that carries passengers on a scheduled route."),
      card("What is a cargo plane?", "An airplane built to carry freight."),
      card("What is a seaplane?", "An airplane that can take off from and land on water."),
      card("Is every airliner a jet?", "No. Some regional airliners are turboprops."),
      card("Is a helicopter an airplane type?", "No. A helicopter is a different kind of aircraft."),
    ],
  },
];

export function aviationBySlug(slug) {
  return AVIATION.find((item) => item.slug === slug) ?? null;
}
