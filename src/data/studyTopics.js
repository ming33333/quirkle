export const STUDY_TOPICS = [
  {
    slug: "medical-school",
    fieldLabel: "Medical school",
    title: "medical school",
    description:
      "How to study for medical school: one fact per card, a sample deck of first-year facts, and a spaced review schedule so the pile does not evaporate.",
    lede: "The exams come every few weeks, and the pile is larger than the time you have. Rereading the slides feels like work. The facts that are still there on test day are the ones you can say with the notes closed.",
    tests:
      "Preclinical blocks ask for names, numbers, and pathways: what a structure is, which enzyme runs the step, which organism fits the picture. Later, the shelves ask for the next step in a case. Both reward an answer you can give in one breath.",
    cardRule:
      "One fact from the lecture objectives per card. A whole slide is not a card. If you cannot say the answer aloud, split it until you can.",
    schedule:
      "Start with the names and numbers in the sample deck, then add cards from the block you are in now. A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.",
    cards: [
      {
        question: "How many chambers does the heart have?",
        answer: "Four.",
      },
      {
        question: "Which organelle makes most of the cell’s ATP?",
        answer: "The mitochondrion.",
      },
      {
        question: "About what is the resting membrane potential of a neuron?",
        answer: "−70 mV.",
      },
      {
        question: "How many pairs of cranial nerves are there?",
        answer: "Twelve.",
      },
      {
        question: "Which cranial nerve is the vagus nerve?",
        answer: "Cranial nerve X.",
      },
      {
        question: "What is the functional unit of the kidney?",
        answer: "The nephron.",
      },
      {
        question: "Which hormone lowers blood glucose?",
        answer: "Insulin.",
      },
      {
        question: "What does the glomerulus filter?",
        answer: "Blood plasma.",
      },
    ],
  },
  {
    slug: "internal-medicine",
    fieldLabel: "Medical school",
    title: "internal medicine",
    description:
      "How to study for internal medicine: the cutoffs, formulas, and common causes to put on flashcards, plus a sample deck and a spaced review schedule.",
    lede: "The shelf rewards the number, the formula, and the most common cause. Write those. Review them on a schedule. Leave the textbook chapter closed.",
    tests:
      "The clerkship and the shelf ask you to recognize a common presentation, name the cutoff that makes the diagnosis, and pick the most likely cause. The facts that come back are numbers and formulas, not the paragraph you highlighted.",
    cardRule:
      "One cutoff, one formula, or one most-common cause per card. Keep the long explanation in your notes. A card that needs a paragraph is two cards, or it is not a card yet.",
    schedule:
      "Start with the cutoffs and formulas in the sample deck. A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.",
    cards: [
      {
        question: "What ejection fraction defines HFrEF?",
        answer: "40% or less.",
      },
      {
        question: "What A1c diagnoses diabetes?",
        answer: "6.5% or higher.",
      },
      {
        question: "What fasting plasma glucose diagnoses diabetes?",
        answer: "126 mg/dL or higher.",
      },
      {
        question: "What is the anion gap formula?",
        answer: "Sodium minus (chloride plus bicarbonate).",
      },
      {
        question:
          "What is the most common bacterial cause of community-acquired pneumonia?",
        answer: "Streptococcus pneumoniae.",
      },
      {
        question: "ST elevation in how many leads defines a STEMI?",
        answer: "Two or more contiguous leads.",
      },
      {
        question:
          "How much urine protein defines nephrotic-range proteinuria?",
        answer: "3.5 grams per day or more.",
      },
      {
        question: "What is a normal serum sodium?",
        answer: "135 to 145 mEq/L.",
      },
    ],
  },
  {
    slug: "far-leases",
    fieldLabel: "CPA · FAR",
    title: "FAR leases",
    description:
      "How to study for FAR leases: the five finance-lease criteria, the opening measurement, and a sample deck on a spaced review schedule.",
    lede: "FAR tests whether you can classify a lease and measure it on day one. The five criteria and the two opening amounts are the deck.",
    tests:
      "The exam asks you to decide finance or operating, then to measure the liability and the right-of-use asset. Points sit on the five classification criteria, the discount rate, and the difference between front-loaded finance expense and straight-line operating expense.",
    cardRule:
      "One criterion or one measurement rule per card. Do not paste the whole standard. If a card lists all five criteria, split them only after you can say the set from memory.",
    schedule:
      "Start with classification and the opening measurement. A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.",
    cards: [
      {
        question:
          "What does a lessee recognize at lease commencement?",
        answer: "A right-of-use asset and a lease liability.",
      },
      {
        question: "How is the lease liability first measured?",
        answer: "The present value of unpaid lease payments.",
      },
      {
        question:
          "Which discount rate does the lessee use when the rate implicit in the lease is not readily determinable?",
        answer: "The incremental borrowing rate.",
      },
      {
        question: "When is a lease a finance lease?",
        answer: "When it meets any one of the five classification criteria.",
      },
      {
        question: "What are the five finance-lease criteria?",
        answer:
          "Ownership transfers; a purchase option the lessee is reasonably certain to exercise; the lease term is a major part of the remaining economic life; the present value of the lease payments is substantially all of the fair value; or the asset is specialized and has no alternative use to the lessor.",
      },
      {
        question: "How long is a short-term lease?",
        answer:
          "12 months or less, and no purchase option the lessee is reasonably certain to exercise.",
      },
      {
        question: "What may a lessee skip recognizing on a short-term lease?",
        answer: "The right-of-use asset and the lease liability.",
      },
      {
        question:
          "How does finance-lease expense differ from operating-lease expense?",
        answer:
          "Finance-lease expense is front-loaded: interest plus amortization. Operating-lease expense is generally straight-line.",
      },
    ],
  },
];

export function studyTopicBySlug(slug) {
  return STUDY_TOPICS.find((topic) => topic.slug === slug) ?? null;
}
