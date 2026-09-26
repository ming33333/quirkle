const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const BUSINESS = [
  {
    slug: "llc",
    fieldLabel: "LLC",
    headline: "What is an LLC",
    description:
      "What is an LLC: a limited liability company, a business owned by members. A sample deck and a spaced review schedule.",
    lede: "An LLC is a limited liability company. In the United States a state creates it. The owners are called members. The company is a legal person separate from them, which is what the “limited liability” is about.",
    testsHeading: "The short answer",
    tests:
      "Company debts are the company’s, in the ordinary case, not the members’ personal debts. That shield fails if a member guarantees a loan, mixes personal and company money, or commits a wrongful act. An LLC is not a corporation. By default the IRS taxes a one-member LLC as if it were the owner, and a multi-member LLC as a partnership, unless the LLC elects to be taxed as a corporation. The rules of a particular state, and a member’s own contracts, decide the rest.",
    cardRule:
      "One fact per card. The company, the tax default, and the shield stay separate.",
    schedule: schedule("Start with the name, then who owns it, then the shield."),
    cards: [
      card("What is an LLC?", "A limited liability company."),
      card("Who creates an LLC in the United States?", "A state."),
      card("What are the owners called?", "Members."),
      card(
        "What does limited liability mean here?",
        "Company debts are the company’s, in the ordinary case, not the members’ personal debts.",
      ),
      card(
        "When does that shield fail?",
        "A personal guarantee, mixed personal and company money, or a wrongful act by the member.",
      ),
      card("Is an LLC a corporation?", "No."),
      card(
        "How is a one-member LLC taxed by default?",
        "As if the business were the owner. The IRS calls that a disregarded entity.",
      ),
      card(
        "How is a multi-member LLC taxed by default?",
        "As a partnership, unless it elects corporate tax treatment.",
      ),
    ],
  },
  {
    slug: "s-corp",
    fieldLabel: "S corp",
    headline: "What is an S corp",
    description:
      "What is an S corp: a federal tax election, not a separate kind of company most states form. A sample deck and a spaced review schedule.",
    lede: "An S corp is a tax status with the IRS. It is not, in most states, a kind of company you form at the state office. An eligible corporation, or an LLC that has elected to be taxed as a corporation, files to be taxed under Subchapter S.",
    testsHeading: "The short answer",
    tests:
      "Profits and losses pass through to the owners’ personal tax returns. The company itself generally does not pay federal income tax. The election has gates: one class of stock, no more than 100 shareholders, and shareholders who are allowed, generally individuals who are US citizens or residents. A partnership or a corporation cannot be a shareholder. A C corp is the contrast. It pays tax at the company, and shareholders can be taxed again when they receive dividends.",
    cardRule:
      "One gate or one contrast per card. The election, the shareholder rules, and the C corp stay separate.",
    schedule: schedule("Start with the tax election, then who may own shares."),
    cards: [
      card(
        "What is an S corp?",
        "A federal tax election. Profits pass through to the owners’ personal returns.",
      ),
      card(
        "Do you form an S corp at the state office?",
        "Usually no. You form a corporation or an LLC, then file the tax election.",
      ),
      card(
        "Does the S corp itself generally pay federal income tax?",
        "No. The owners report the profit on their own returns.",
      ),
      card("How many classes of stock may it have?", "One."),
      card("How many shareholders may it have?", "No more than 100."),
      card(
        "Who may be a shareholder?",
        "Generally an individual who is a US citizen or resident. A partnership or a corporation may not.",
      ),
      card(
        "What is a C corp, next to this?",
        "A corporation that pays federal income tax itself. Dividends can be taxed again at the shareholder.",
      ),
      card(
        "Can an LLC be an S corp?",
        "It can elect to be taxed as a corporation and then elect S status, if it meets the gates.",
      ),
    ],
  },
  {
    slug: "ipo",
    fieldLabel: "IPO",
    headline: "What is an IPO",
    description:
      "What is an IPO: a company’s first sale of shares to the public. A sample deck and a spaced review schedule.",
    lede: "An IPO is an initial public offering. It is the first time a company sells its shares to the public. Before that sale, the shares are privately held.",
    testsHeading: "The short answer",
    tests:
      "In the United States the company registers the sale with the Securities and Exchange Commission. Banks often underwrite the deal, buying the shares and selling them on. Money from that first sale goes to the company, after fees, or to early holders who sell in the offering. Trading on the exchange after the IPO is a different market. Those later trades are between investors. The company does not receive the price you pay on the exchange the next day.",
    cardRule:
      "One step per card. The first sale, the filing, and later trading stay separate.",
    schedule: schedule("Start with the first public sale, then what happens the next day."),
    cards: [
      card("What is an IPO?", "A company’s first sale of shares to the public."),
      card("What do the letters stand for?", "Initial public offering."),
      card("Who owns the shares before the IPO?", "Private holders."),
      card(
        "Who must the company register the US sale with?",
        "The Securities and Exchange Commission.",
      ),
      card(
        "What does an underwriter do?",
        "Often buys the new shares from the company and sells them to investors.",
      ),
      card(
        "Who receives the money from the IPO sale?",
        "The company, or early holders selling in the offering, after fees.",
      ),
      card(
        "What is trading the day after the IPO?",
        "Investors buying and selling with each other. That price does not go to the company.",
      ),
      card(
        "Is buying in the IPO the same as buying on the exchange later?",
        "No. The IPO is the first sale. Later trades are a separate market.",
      ),
    ],
  },
  {
    slug: "index-fund",
    fieldLabel: "Index fund",
    headline: "What is an index fund",
    description:
      "What is an index fund: a fund that tries to match a market index instead of picking winners. A sample deck and a spaced review schedule.",
    lede: "An index fund is a fund that tries to match a published list of investments, called an index. The S&P 500 is one such list. The fund does not try to pick the winners inside it.",
    testsHeading: "The short answer",
    tests:
      "The fund holds the investments in the index, or a sample that behaves like the index. An actively managed fund pays people to choose investments. An index fund skips that choice, so its fee is usually lower. Matching the index means the fund also falls when the index falls. The fee comes out either way. The index is the list. The fund is the product you can buy. Owning the fund is not a promise of profit.",
    cardRule:
      "One contrast per card. The index, the fund, and an active fund stay separate.",
    schedule: schedule("Start with the list, then what the fund refuses to do."),
    cards: [
      card(
        "What is an index fund?",
        "A fund that tries to match an index, instead of picking investments one by one.",
      ),
      card("What is an index?", "A published list of investments, such as the S&P 500."),
      card(
        "What does the fund hold?",
        "The investments in the index, or a sample meant to behave like them.",
      ),
      card(
        "How is that different from an actively managed fund?",
        "An active fund pays managers to choose. An index fund follows the list.",
      ),
      card(
        "Why is the fee usually lower?",
        "The fund is not paying a staff to pick winners.",
      ),
      card(
        "Can an index fund beat the index?",
        "Not by design. It aims to match the index, minus its fee.",
      ),
      card(
        "What happens when the index falls?",
        "The fund falls with it.",
      ),
      card(
        "Is the index the same thing as the fund?",
        "No. The index is the list. The fund is the product that tracks the list.",
      ),
    ],
  },
  {
    slug: "mortgages",
    fieldLabel: "Mortgages",
    headline: "What are the types of mortgages?",
    description:
      "What are the types of mortgages: fixed and adjustable rates, and the labels that are not a rate. A sample deck and a spaced review schedule.",
    lede: "Mortgage types in the United States split first by how the interest rate behaves. Fixed and adjustable are that split. Conventional, FHA, and VA describe who backs the loan. They are not a third kind of interest math.",
    testsHeading: "The short answer",
    tests:
      "A fixed-rate mortgage keeps the same interest rate for the term. An adjustable-rate mortgage keeps a rate for an initial period, then the rate can change on a schedule. A conventional loan is not backed by the FHA or the VA. An FHA loan is insured by the Federal Housing Administration. A VA loan is guaranteed for eligible service members and veterans. A jumbo loan is larger than the limit that ordinary investors will buy. An interest-only loan asks for interest and no principal for a period. The type does not tell you whether you should borrow.",
    cardRule:
      "One label per card. The rate and the backing stay separate.",
    schedule: schedule("Start with fixed and adjustable, then conventional."),
    cards: [
      card("What is a fixed-rate mortgage?", "The interest rate stays the same for the term."),
      card("What is an adjustable-rate mortgage?", "The rate can change after an initial period."),
      card("What is a conventional mortgage?", "A loan that is not backed by the FHA or the VA."),
      card("What is an FHA loan?", "A mortgage insured by the Federal Housing Administration."),
      card("What is a VA loan?", "A mortgage guaranteed for eligible service members and veterans."),
      card("What is a jumbo mortgage?", "A loan larger than the limit ordinary investors will buy."),
      card("What is an interest-only period?", "A stretch when the payment covers interest and none of the principal."),
      card("Does the type tell you whether to borrow?", "No. It describes the contract."),
    ],
  },
];

export function businessBySlug(slug) {
  return BUSINESS.find((item) => item.slug === slug) ?? null;
}
