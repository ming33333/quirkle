const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const ARTS = [
  {
    slug: "modeling",
    fieldLabel: "Modeling",
    headline: "What are the types of modeling?",
    description:
      "What are the types of modeling: fashion jobs, and the other meanings of the word. A sample deck and a spaced review schedule.",
    lede: "Modeling is three different jobs that share a word. Fashion modeling is a person in photographs or on a runway. 3D modeling builds a shape on a computer. A scientific or financial model is a set of numbers that stands in for a real system.",
    testsHeading: "The short answer",
    tests:
      "In fashion, runway is live walking, editorial is magazine-style photographs, commercial is advertising, and parts modeling is only hands, feet, or another body part. Fit modeling tries clothes for a brand’s size, not for a campaign. Fitness modeling photographs an athletic body for that market. None of those is 3D modeling, which is a mesh of points in software. None of them is a climate model or a pricing model.",
    cardRule:
      "One meaning per card. Fashion subtypes stay on their own cards.",
    schedule: schedule("Start with the three meanings of the word."),
    cards: [
      card("What are the three meanings of modeling?", "A person posed for images, a 3D shape on a computer, and a numerical stand-in for a real system."),
      card("What is runway modeling?", "Walking clothes in a live show."),
      card("What is editorial modeling?", "Photographs in the style of a magazine story, not a product ad."),
      card("What is commercial modeling?", "Photographs or video made to sell a product."),
      card("What is parts modeling?", "Photographs of one body part, such as hands."),
      card("What is fit modeling?", "Trying clothes so a brand can check a size. The pictures are not the point."),
      card("What is 3D modeling?", "Building a shape from points and surfaces in software."),
      card("Is a climate model fashion modeling?", "No. It is a numerical stand-in for the climate."),
    ],
  },
  {
    slug: "camera-shots",
    fieldLabel: "Camera shots",
    headline: "What are the types of camera shots?",
    description:
      "What are the types of camera shots: the frame sizes, from wide to extreme close-up. A sample deck and a spaced review schedule.",
    lede: "A shot type is how much of the person or the place is in the frame. Wide, medium, and close-up are sizes. The angle and the point of view are separate choices.",
    testsHeading: "The short answer",
    tests:
      "An extreme wide shot shows a landscape or a building, and people are small. A wide shot shows the whole person. A medium shot shows them from about the waist up. A close-up fills the frame with the face. An extreme close-up fills it with an eye, a mouth, or an object. An over-the-shoulder shot looks past one person at the other. A point-of-view shot is what a character sees. High and low angles tip the camera. They are not sizes.",
    cardRule:
      "One shot per card. Size and angle stay separate.",
    schedule: schedule("Start with wide, medium, and close-up."),
    cards: [
      card("What is an extreme wide shot?", "A frame of the place. People, if any, are small in it."),
      card("What is a wide shot?", "A frame that shows the whole person."),
      card("What is a medium shot?", "A frame from about the waist up."),
      card("What is a close-up?", "A frame filled by the face."),
      card("What is an extreme close-up?", "A frame filled by a detail, such as an eye or a hand."),
      card("What is an over-the-shoulder shot?", "The camera looks past one person’s shoulder at the other person."),
      card("What is a point-of-view shot?", "The frame shows what a character sees."),
      card("Is a low angle a shot size?", "No. It is the camera tilted up. The size can still be wide or close."),
    ],
  },
];

export function artsBySlug(slug) {
  return ARTS.find((item) => item.slug === slug) ?? null;
}
