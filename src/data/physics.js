const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const PHYSICS = [
  {
    slug: "velocity",
    fieldLabel: "Velocity",
    headline: "What is velocity",
    description:
      "What is velocity: speed in a stated direction. How it differs from speed, a sample deck, and a spaced review schedule.",
    lede: "Velocity is how fast something moves, and which way. Speed leaves out the direction. People also ask what velocity is, with a question mark, and it is this same idea.",
    testsHeading: "The short answer",
    tests:
      "Velocity is a vector. Average velocity is displacement divided by time. Displacement is the straight change in position, from where you started to where you finished, with a direction. Walk a loop back to the start and the displacement is zero, so the average velocity is zero, even though you were moving the whole time.",
    cardRule:
      "One distinction per card. Speed, displacement, and distance do not share an answer.",
    schedule: schedule("Start with direction, then displacement."),
    cards: [
      card(
        "What is velocity?",
        "Speed in a stated direction.",
      ),
      card(
        "What is speed?",
        "How fast something moves, with no direction.",
      ),
      card(
        "What is displacement?",
        "The change in position, from the start to the end, with a direction.",
      ),
      card(
        "What is average velocity?",
        "Displacement divided by the time that passed.",
      ),
      card(
        "You run one lap and stop where you started. What is your average velocity?",
        "Zero. The displacement is zero.",
      ),
      card(
        "Does that lap have zero speed?",
        "No. Speed uses the distance you actually traveled.",
      ),
      card(
        "What units does velocity use?",
        "A speed unit plus a direction, such as meters per second north.",
      ),
      card(
        "Can velocity change while the speed stays the same?",
        "Yes. A turn changes the direction, so it changes the velocity.",
      ),
    ],
  },
  {
    slug: "velocity-formula",
    fieldLabel: "Formula",
    headline: "What is the formula for velocity",
    description:
      "What is the formula for velocity: displacement divided by time, and why distance over time is speed instead. A sample deck and a spaced review schedule.",
    lede: "The formula for average velocity is displacement divided by time. In symbols, v = Δx / Δt. The triangle means “change in.” x is position. t is time.",
    testsHeading: "The short answer",
    tests:
      "If the top of the fraction is the distance along the path, you have calculated average speed, not velocity. Displacement is shorter than the path whenever the route bends. The slope of a position-time graph is velocity. Instantaneous velocity is the velocity at one moment, the value the average approaches as the time interval shrinks toward zero.",
    cardRule:
      "One symbol or one trap per card. Do not write “distance over time” on the velocity card.",
    schedule: schedule("Start with displacement over time, then the distance trap."),
    cards: [
      card(
        "What is the formula for average velocity?",
        "Displacement divided by time. v = Δx / Δt.",
      ),
      card(
        "What does Δ mean?",
        "A change. Δx is the final position minus the starting position.",
      ),
      card(
        "Why is distance divided by time the wrong formula here?",
        "That quotient is average speed. It has no direction.",
      ),
      card(
        "What is the slope of a position-time graph?",
        "Velocity.",
      ),
      card(
        "What is instantaneous velocity?",
        "The velocity at one moment.",
      ),
      card(
        "How do you get instantaneous velocity from the average?",
        "Shrink the time interval toward zero. The average approaches the value at that instant.",
      ),
      card(
        "What unit does Δx / Δt have?",
        "A length unit per time unit, such as meters per second, plus the direction of Δx.",
      ),
      card(
        "A car drives 100 meters east in 10 seconds. What is its average velocity?",
        "10 meters per second east.",
      ),
    ],
  },
  {
    slug: "speed-and-velocity",
    fieldLabel: "Speed and velocity",
    headline: "What is the difference between speed and velocity",
    description:
      "What is the difference between speed and velocity: speed has no direction, velocity does. A sample deck and a spaced review schedule.",
    lede: "Speed is how fast. Velocity is how fast and which way. The question with a question mark at the end is the same question.",
    testsHeading: "The short answer",
    tests:
      "Speed is a scalar. It is never negative. Velocity is a vector, so a chosen direction can make it positive or negative. Both can use meters per second. A speedometer shows speed. It does not show velocity, because it does not show which way the car points. Average speed divides distance by time. Average velocity divides displacement by time.",
    cardRule:
      "One contrast per card. Keep the scalar, the sign, and the average on separate cards.",
    schedule: schedule("Start with direction, then the two averages."),
    cards: [
      card(
        "What is the difference between speed and velocity?",
        "Speed has no direction. Velocity does.",
      ),
      card(
        "Is speed a vector?",
        "No. Speed is a scalar. Velocity is the vector.",
      ),
      card(
        "Can speed be negative?",
        "No. A negative sign would be a direction, and that belongs to velocity.",
      ),
      card(
        "A car goes 20 meters per second south. What is the speed?",
        "20 meters per second.",
      ),
      card(
        "What is the velocity of that car?",
        "20 meters per second south.",
      ),
      card(
        "What does a speedometer show?",
        "Speed. It does not record the direction.",
      ),
      card(
        "What is average speed?",
        "Distance traveled divided by time.",
      ),
      card(
        "What is average velocity?",
        "Displacement divided by time.",
      ),
    ],
  },
  {
    slug: "terminal-velocity",
    fieldLabel: "Terminal velocity",
    headline: "What is terminal velocity",
    description:
      "What is terminal velocity: the steady fall reached when drag balances weight. A sample deck and a spaced review schedule.",
    lede: "Terminal velocity is the constant velocity a falling object approaches when the upward force of air resistance balances its weight. The net force is then zero, so it stops speeding up.",
    testsHeading: "The short answer",
    tests:
      "A heavier or more compact object reaches a higher terminal velocity. A parachute lowers it by catching more air. In a vacuum there is no drag, so there is no terminal velocity. A person falling flat and face-down is often near 120 miles per hour. A head-down fall is faster. The number changes with body position, mass, and the air.",
    cardRule:
      "One cause per card. Drag, weight, and the vacuum case stay separate.",
    schedule: schedule("Start with the balance of forces, then what changes the number."),
    cards: [
      card(
        "What is terminal velocity?",
        "The steady velocity of a fall once drag balances weight.",
      ),
      card(
        "What is drag here?",
        "The upward force of air resistance on the falling object.",
      ),
      card(
        "Why does the object stop accelerating?",
        "The net force becomes zero, so the acceleration becomes zero.",
      ),
      card(
        "Does a higher mass raise terminal velocity?",
        "Yes, if the shape and the air stay the same. The weight is larger, so a faster fall is needed before drag catches up.",
      ),
      card(
        "How does a parachute change terminal velocity?",
        "It increases drag, so the balance arrives at a slower fall.",
      ),
      card(
        "Is there a terminal velocity in a vacuum?",
        "No. With no air, there is no drag to balance the weight.",
      ),
      card(
        "About how fast is a person falling face-down?",
        "Often near 120 miles per hour. Position and mass change it.",
      ),
      card(
        "Is terminal velocity a speed or a velocity?",
        "The fall has a direction, toward the ground, so the full description is a velocity. People often quote only the speed.",
      ),
    ],
  },
  {
    slug: "unladen-swallow",
    fieldLabel: "Swallow",
    headline: "What is the airspeed velocity of an unladen swallow",
    description:
      "What is the airspeed velocity of an unladen swallow: the Monty Python question, why it has no single number, and a spaced review schedule.",
    lede: "The line is a riddle from Monty Python and the Holy Grail. An unladen swallow is one that is not carrying a load. The film never states a speed. The reply that matters is that it depends which swallow.",
    testsHeading: "The short answer",
    tests:
      "Airspeed is speed through the air, not speed over the ground. Velocity would also need a direction. A European barn swallow in level flight is commonly estimated near 11 meters per second, about 24 miles per hour. “African swallow” is not one species, so that half of the question has no single number. The joke is that the question was incomplete.",
    cardRule:
      "One fact per card. The film, the bird, and the word airspeed do not belong in one answer.",
    schedule: schedule("Start with what the question leaves out."),
    cards: [
      card(
        "Where does the question come from?",
        "Monty Python and the Holy Grail. A bridgekeeper asks it.",
      ),
      card(
        "What does unladen mean?",
        "Not carrying a load.",
      ),
      card(
        "Does the film give a number?",
        "No.",
      ),
      card(
        "What has to be specified before there is an answer?",
        "Which swallow. The scene splits them into African and European.",
      ),
      card(
        "What is airspeed?",
        "Speed relative to the air, not relative to the ground.",
      ),
      card(
        "Why is “airspeed velocity” an odd phrase in physics?",
        "Airspeed is a speed. Velocity also needs a direction.",
      ),
      card(
        "What estimate is often cited for a European barn swallow?",
        "About 11 meters per second in level flight, roughly 24 miles per hour.",
      ),
      card(
        "Why is there no single African answer?",
        "More than one species of swallow lives in Africa.",
      ),
    ],
  },
  {
    slug: "gravity",
    fieldLabel: "Gravity",
    headline: "What is gravity",
    description:
      "What is gravity: the attraction between masses, and the 9.8 meters per second squared near Earth. A sample deck and a spaced review schedule.",
    lede: "Gravity is the attraction between things that have mass. Near Earth it pulls objects toward the planet. People also ask what gravity is, with a question mark, and it is this same attraction.",
    testsHeading: "The short answer",
    tests:
      "At Earth’s surface the acceleration from gravity is about 9.8 meters per second squared, written g. Weight is mass times g. Mass stays the same if you change planets. Weight does not. You still have gravity in free fall. You feel weightless because nothing is pushing back on you. Farther from a mass, the pull weakens with the square of the distance.",
    cardRule:
      "One idea per card. Mass, weight, and g do not share an answer.",
    schedule: schedule("Start with the attraction, then g, then weight."),
    cards: [
      card(
        "What is gravity?",
        "The attraction between masses.",
      ),
      card(
        "What is g near Earth’s surface?",
        "About 9.8 meters per second squared.",
      ),
      card(
        "What is weight?",
        "The gravitational force on a mass. Near Earth, mass times g.",
      ),
      card(
        "Does mass change on the Moon?",
        "No. Weight changes, because the pull is weaker.",
      ),
      card(
        "Is there gravity in free fall?",
        "Yes. Gravity is what makes you fall. You feel weightless because no surface pushes up.",
      ),
      card(
        "How does the pull change with distance?",
        "It weakens with the square of the distance. Twice as far means a quarter of the force.",
      ),
      card(
        "What is the formula for the force between two masses?",
        "F = G m1 m2 / r². G is the gravitational constant, and r is the distance between the centers.",
      ),
      card(
        "Do a feather and a hammer fall together in a vacuum?",
        "Yes. With no air resistance, they have the same acceleration, g.",
      ),
    ],
  },
  {
    slug: "specific-gravity",
    fieldLabel: "Specific gravity",
    headline: "What is specific gravity",
    description:
      "What is specific gravity: the density of a material divided by the density of water. A sample deck and a spaced review schedule.",
    lede: "Specific gravity is the density of a substance divided by the density of a reference, almost always water. The result has no units. A specific gravity of 1 means the same density as water.",
    testsHeading: "The short answer",
    tests:
      "Density needs a unit, such as grams per cubic centimeter. Specific gravity does not, because the units cancel. A value above 1 is denser than water and sinks, if it does not dissolve. A value below 1 floats. Ice is near 0.92, which is why it floats. This number is not g, the acceleration from gravity, and it is not “how hard gravity pulls.”",
    cardRule:
      "One comparison per card. Density, water, and g stay separate.",
    schedule: schedule("Start with the ratio, then what 1 means."),
    cards: [
      card(
        "What is specific gravity?",
        "Density of a substance divided by the density of water.",
      ),
      card(
        "Does specific gravity have units?",
        "No. The units cancel in the ratio.",
      ),
      card(
        "What does a specific gravity of 1 mean?",
        "The substance is as dense as water.",
      ),
      card(
        "What does a specific gravity above 1 mean for a solid that does not dissolve?",
        "It sinks in water.",
      ),
      card(
        "Why does ice float?",
        "Its specific gravity is below 1, near 0.92.",
      ),
      card(
        "How is specific gravity different from density?",
        "Density has units. Specific gravity is a ratio against water.",
      ),
      card(
        "Is specific gravity the same as g?",
        "No. g is the acceleration from gravity, about 9.8 meters per second squared.",
      ),
      card(
        "What reference is used for liquids and solids?",
        "Water, usually at its densest, near 4 degrees Celsius.",
      ),
    ],
  },
  {
    slug: "urine-specific-gravity",
    fieldLabel: "Urine",
    headline: "What is specific gravity of urine",
    description:
      "What is the specific gravity of urine: how concentrated the urine is compared with water. A sample deck and a spaced review schedule.",
    lede: "The specific gravity of urine compares the urine with water. Water is 1.000. Urine is higher because it carries dissolved salts and wastes. A higher number means more concentrated urine.",
    testsHeading: "The short answer",
    tests:
      "A typical result on a random sample falls from about 1.005 to about 1.030. Closer to 1.000 means dilute urine, more water. A first morning sample is usually more concentrated than one taken after drinking a lot. The number is a clue to hydration and to how the kidneys are concentrating urine. It is not a diagnosis by itself. Labs print their own reference range on the report.",
    cardRule:
      "One reading per card. The range, a dilute result, and a diagnosis do not share an answer.",
    schedule: schedule("Start with water at 1.000, then what a higher number means."),
    cards: [
      card(
        "What is the specific gravity of urine?",
        "The density of the urine compared with water. It shows how concentrated the urine is.",
      ),
      card(
        "What is the specific gravity of pure water?",
        "1.000.",
      ),
      card(
        "What range is typical for a random urine sample?",
        "About 1.005 to 1.030. The report lists the lab’s own range.",
      ),
      card(
        "What does a higher specific gravity mean?",
        "The urine is more concentrated. Less water, more dissolved material.",
      ),
      card(
        "What does a result near 1.000 mean?",
        "The urine is very dilute.",
      ),
      card(
        "Why is a first morning sample often higher?",
        "You have gone longer without drinking, so the urine is more concentrated.",
      ),
      card(
        "Does the number diagnose a disease?",
        "No. It is one measurement. A clinician reads it with the rest of the tests.",
      ),
      card(
        "Is this the same number as g, the pull of gravity?",
        "No. It is a density ratio. It happens to use the word gravity.",
      ),
    ],
  },
  {
    slug: "zero-gravity-chair",
    fieldLabel: "Chair",
    headline: "What is a zero-gravity chair",
    description:
      "What is a zero-gravity chair: a recliner that holds a neutral posture. It does not remove gravity. A sample deck and a spaced review schedule.",
    lede: "A zero-gravity chair is a recliner that tips you back and lifts your legs until your knees, hips, and torso sit in a neutral pose. The name comes from the posture, not from a room without gravity.",
    testsHeading: "The short answer",
    tests:
      "In orbit, astronauts settle into a partly curled posture because nothing pulls their limbs “down.” Chair makers copy that pose on Earth: torso reclined, thighs and lower legs raised, weight spread across the back and legs instead of piled on the lower spine. You still weigh the same. The chair changes how that weight is supported.",
    cardRule:
      "One claim per card. The posture and the physics of gravity do not share an answer.",
    schedule: schedule("Start with what the chair changes, then what it does not change."),
    cards: [
      card(
        "What is a zero-gravity chair?",
        "A recliner built to hold the body in a neutral, partly curled posture.",
      ),
      card(
        "Does the chair remove gravity?",
        "No. Your weight stays the same.",
      ),
      card(
        "What posture does it copy?",
        "The neutral body posture astronauts take when they are weightless.",
      ),
      card(
        "Where are your legs in that pose?",
        "Raised, often so the feet are near the height of the heart or above it.",
      ),
      card(
        "What does the recline change?",
        "How your weight is spread. More of it rests on the back and the legs, less on the base of the spine.",
      ),
      card(
        "Is “zero gravity” a physics description of the chair?",
        "No. It is a product name for the posture.",
      ),
      card(
        "Are you weightless in the chair?",
        "No. Weightless means nothing is pushing back on you, as in free fall or in orbit.",
      ),
      card(
        "What is still pulling you into the cushions?",
        "Earth’s gravity. The cushions are the surface pushing back.",
      ),
    ],
  },
];

export function physicsBySlug(slug) {
  return PHYSICS.find((item) => item.slug === slug) ?? null;
}
