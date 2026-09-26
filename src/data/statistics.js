const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const STATISTICS = [
  {
    slug: "what-is-statistics",
    fieldLabel: "Statistics",
    headline: "What is statistics",
    description:
      "What is statistics: collecting and reading data so a claim can be checked, a sample deck, and a spaced review schedule.",
    lede: "Statistics is the work of turning observations into a claim you can check. The numbers are the material. The subject is what you are allowed to say about them. People also ask what are statistics, and it is this same subject.",
    testsHeading: "The short answer",
    tests:
      "You collect data, summarize it, and then decide whether that summary says something about a larger group. Describing the pile in front of you is one job. Using a sample to talk about a population is the next one.",
    cardRule:
      "One distinction per card. Population versus sample, and parameter versus statistic, are the two that unlock the rest of the list.",
    schedule: schedule("Start with population, sample, and parameter."),
    cards: [
      card(
        "What is a population?",
        "The whole group you want to say something about.",
      ),
      card(
        "What is a sample?",
        "The observations you actually have, taken from that group.",
      ),
      card(
        "What is a parameter?",
        "A number that describes the population, such as the population mean.",
      ),
      card(
        "What is a statistic?",
        "A number computed from the sample, such as the sample mean.",
      ),
      card(
        "What is descriptive statistics?",
        "Summaries of the data you have: center, spread, and shape.",
      ),
      card(
        "What is inferential statistics?",
        "Using a sample to say something about the population it came from.",
      ),
      card("What does n stand for?", "The number of observations in the sample."),
      card(
        "What is variance?",
        "The average squared distance of the observations from their mean.",
      ),
    ],
  },
  {
    slug: "variance",
    fieldLabel: "Variance",
    headline: "What is variance in statistics",
    description:
      "What is variance in statistics: the average squared distance from the mean, why the sample divides by n minus 1, and a spaced review schedule.",
    lede: "Variance measures spread. It is the average of the squared distances from the mean. Squaring keeps a point below the mean from canceling a point above it.",
    testsHeading: "The short answer",
    tests:
      "For a population, you divide the sum of squared distances by N. For a sample, you divide by n − 1. The square root of the variance is the standard deviation, which is back in the original units.",
    cardRule:
      "One formula or one reason per card. If the card says “divide by n,” it is the wrong card for a sample.",
    schedule: schedule("Start with why you square, then n versus n − 1."),
    cards: [
      card(
        "What is variance?",
        "The average squared distance of the values from their mean.",
      ),
      card(
        "Why square the distances?",
        "So values below the mean do not cancel values above it.",
      ),
      card(
        "What do you divide by for a population variance?",
        "N, the number of values in the population.",
      ),
      card(
        "What do you divide by for a sample variance?",
        "n − 1, not n.",
      ),
      card(
        "What is the symbol for a sample variance?",
        "s².",
      ),
      card(
        "What is the symbol for a population variance?",
        "σ².",
      ),
      card(
        "How do you get the standard deviation from the variance?",
        "Take the square root.",
      ),
      card(
        "Why is the variance awkward to talk about?",
        "Its units are squared. A variance of inches is in inches squared.",
      ),
    ],
  },
  {
    slug: "n",
    fieldLabel: "n",
    headline: "What is n in statistics",
    description:
      "What is n in statistics, and what does n mean: the sample size, not the population size. A sample deck and a spaced review schedule.",
    lede: "n is the sample size. It is how many observations you have. People also ask what n means in statistics, and it is this same number. A capital N is often the size of the population instead.",
    testsHeading: "The short answer",
    tests:
      "Count the rows you analyzed. That count is n. It shows up in the mean, in the sample variance as n − 1, and in any claim about how much the sample can tell you. A bigger n is not a better sample if you measured the wrong group.",
    cardRule:
      "One symbol per card. Keep n, N, and n − 1 on separate cards so they do not collapse into one vague “sample size.”",
    schedule: schedule("Start with n, then N, then n − 1."),
    cards: [
      card("What does n mean in statistics?", "The number of observations in the sample."),
      card("What is N, written as a capital?", "Usually the number of individuals in the population."),
      card("Where does n − 1 appear?", "As the divisor in the sample variance and the sample standard deviation."),
      card("Does a larger n fix a biased sample?", "No. A large sample of the wrong group is still the wrong group."),
      card("Is n the number of variables?", "No. n counts observations. The number of variables is separate."),
      card("If you drop two incomplete rows, what happens to n?", "n gets smaller by two."),
      card("What is a statistic computed from?", "The n observations in the sample."),
      card("What is a parameter computed from?", "The population, whose size is often written N."),
    ],
  },
  {
    slug: "parameter",
    fieldLabel: "Parameter",
    headline: "What is a parameter in statistics",
    description:
      "What is a parameter in statistics: a number that describes a population, as opposed to a statistic from a sample. A sample deck and a spaced review schedule.",
    lede: "A parameter is a number that describes the whole population. You rarely know it. You compute a statistic from the sample and use that to estimate the parameter.",
    testsHeading: "The short answer",
    tests:
      "The population mean μ and the population standard deviation σ are parameters. The sample mean x̄ and the sample standard deviation s are statistics. The word parameter inside a software model is a different use. Here it means a population number.",
    cardRule:
      "One pair per card: the parameter on one side, the matching statistic on the other. Do not define parameter as “a variable.”",
    schedule: schedule("Start with parameter versus statistic, then μ versus x̄."),
    cards: [
      card("What is a parameter?", "A number that describes a population."),
      card("What is a statistic?", "A number computed from a sample."),
      card("What is μ?", "The population mean, a parameter."),
      card("What is x̄?", "The sample mean, a statistic. It estimates μ."),
      card("What is σ?", "The population standard deviation, a parameter."),
      card("What is s?", "The sample standard deviation, a statistic. It estimates σ."),
      card("Do you usually know the parameter?", "No. You estimate it from the sample."),
      card("Is a model weight a statistical parameter?", "Not in this sense. Here a parameter describes a population, not a fitted model."),
    ],
  },
  {
    slug: "s",
    fieldLabel: "s",
    headline: "What is s in statistics",
    description:
      "What is s in statistics: the sample standard deviation. How it differs from σ and from s², plus a spaced review schedule.",
    lede: "s is the sample standard deviation. It is the typical distance of the observations from the sample mean, in the original units. s² is the variance. σ is the population version of s.",
    testsHeading: "The short answer",
    tests:
      "You compute s from the sample, dividing the squared distances by n − 1 and then taking the square root. σ uses the population and divides by N before the square root. If a formula prints s, it is talking about the sample.",
    cardRule:
      "One symbol per card. s, s², σ, and σ² do not belong in a single answer.",
    schedule: schedule("Start with s, then s², then σ."),
    cards: [
      card("What is s?", "The sample standard deviation."),
      card("What is s²?", "The sample variance. s is its square root."),
      card("What is σ?", "The population standard deviation."),
      card("What is σ²?", "The population variance."),
      card("What do you divide by when computing s?", "n − 1, inside the variance, before you take the square root."),
      card("Why report s instead of s²?", "s is in the same units as the data. s² is in squared units."),
      card("Does s describe the population?", "No. s describes the sample. It estimates σ."),
      card("What does a larger s mean?", "The observations are more spread out around the mean."),
    ],
  },
  {
    slug: "how-to-lie-with-statistics",
    fieldLabel: "Misleading numbers",
    headline: "How to lie with statistics",
    description:
      "How to lie with statistics: the tricks that make a true number say the wrong thing, a sample deck, and a spaced review schedule.",
    lede: "The phrase is the title of Darrell Huff’s 1954 book. The trick is rarely a fake number. It is a true number shown so that a reader walks away with the wrong claim.",
    testsHeading: "The short answer",
    tests:
      "A chart that does not start at zero, a mean where the median is the honest center, a percentage with no base, and a short slice of time can all be technically correct and still mislead. Correlation shown as a cause is the same family of move.",
    cardRule:
      "One trick per card, stated as the question you should ask of a chart. Do not memorize a slogan in place of the check.",
    schedule: schedule("Start with the axis, the average, and the missing base."),
    cards: [
      card(
        "What is wrong with a bar chart that starts at 90 instead of 0?",
        "Small differences look huge. Ask where the axis starts.",
      ),
      card(
        "When is the mean a misleading center?",
        "When a few extreme values pull it. The median resists that pull.",
      ),
      card(
        "What is missing from “sales rose 200 percent”?",
        "The base. 200 percent of a tiny number can still be tiny.",
      ),
      card(
        "How does a short time window mislead?",
        "It can hide a longer rise or fall outside the slice you were shown.",
      ),
      card(
        "Does a correlation show that one thing caused the other?",
        "No. Two things can move together for a third reason, or by chance.",
      ),
      card(
        "What is a biased sample?",
        "A sample that does not represent the group the claim is about.",
      ),
      card(
        "Why can a true average still be a bad summary?",
        "The average does not show the spread. The same mean can hide very different shapes.",
      ),
      card(
        "What should you ask of a percentage?",
        "Percentage of what, and how many cases is that.",
      ),
    ],
  },
  {
    slug: "descriptive-statistics",
    fieldLabel: "Descriptive",
    headline: "What is descriptive statistics",
    description:
      "What is descriptive statistics: summaries of the data you have, how that differs from inference, a sample deck, and a spaced review schedule.",
    lede: "Descriptive statistics summarize the observations in front of you. They do not, by themselves, prove anything about a group you did not measure. That next step is inference. People also ask what are descriptive statistics, and it is this same idea.",
    testsHeading: "The short answer",
    tests:
      "Center, spread, and shape are the descriptive jobs. The mean, median, and mode locate the center. The range, variance, and standard deviation describe spread. A bar chart or a histogram shows shape. A confidence interval is not descriptive. It is a claim about a population.",
    cardRule:
      "One summary per card, and label it descriptive or inferential. Mixing those two is the usual mistake.",
    schedule: schedule("Start with center and spread, then the line between descriptive and inferential."),
    cards: [
      card(
        "What is descriptive statistics?",
        "Summaries and displays of the data you have.",
      ),
      card(
        "What is inferential statistics?",
        "Using a sample to say something about a population.",
      ),
      card("Name three measures of center.", "Mean, median, and mode."),
      card(
        "Name three measures of spread.",
        "Range, variance, and standard deviation.",
      ),
      card(
        "Is a histogram descriptive?",
        "Yes. It shows the shape of the data you have.",
      ),
      card(
        "Is a confidence interval descriptive?",
        "No. It is an inference about a population parameter.",
      ),
      card(
        "Does a sample mean describe the sample or the population?",
        "It describes the sample. It estimates the population mean.",
      ),
      card(
        "What is the range?",
        "The largest observation minus the smallest.",
      ),
    ],
  },
  {
    slug: "p-value",
    fieldLabel: "p-value",
    headline: "What is p value in statistics",
    description:
      "What is a p-value in statistics, and what is the p-value: how surprising the data are if the null were true. A sample deck and a spaced review schedule.",
    lede: "A p-value is the probability of a result at least as extreme as the one you got, if the null hypothesis were true. People also ask what the p-value is, and it is this same number. It is not the probability that the null hypothesis is true.",
    testsHeading: "The short answer",
    tests:
      "You choose a cutoff, often 0.05, before you look. If the p-value falls below that cutoff, the result is called statistically significant. That word does not say the effect is large, and a p-value above the cutoff does not prove the null.",
    cardRule:
      "One claim per card. The p-value, the cutoff, and the size of the effect do not belong in the same answer.",
    schedule: schedule("Start with what the p-value is, then what it is not."),
    cards: [
      card(
        "What is a p-value?",
        "The probability of a result at least as extreme as yours, if the null hypothesis were true.",
      ),
      card(
        "Is the p-value the probability that the null is true?",
        "No. It assumes the null is true, then asks how surprising the data are.",
      ),
      card(
        "What does a small p-value mean?",
        "The data would be unusual if the null hypothesis were true.",
      ),
      card(
        "What is 0.05?",
        "A common cutoff chosen in advance. It is a convention, not a law.",
      ),
      card(
        "What does statistically significant mean?",
        "The p-value fell below the cutoff you set.",
      ),
      card(
        "Does a significant result mean the effect is large?",
        "No. A tiny effect can have a small p-value in a large sample.",
      ),
      card(
        "Does a large p-value prove the null hypothesis?",
        "No. It means the data are not surprising under the null. The effect may still be real.",
      ),
      card(
        "What is the p-value a measure of?",
        "Surprise under the null. It is not the size of the effect.",
      ),
    ],
  },
  {
    slug: "p",
    fieldLabel: "p",
    headline: "What is p in statistics",
    description:
      "What is p in statistics: the letter can mean a p-value or a population proportion. How to tell them apart, plus a spaced review schedule.",
    lede: "The letter p is not one number. In a hypothesis test it usually means the p-value. In a proportion problem it is the share of the population with some trait. Read the sentence before you decide which p you have.",
    testsHeading: "The short answer",
    tests:
      "A p-value is a result you compute from a test. A population proportion is a parameter you are trying to learn. The sample proportion is written p̂. Capital P, as in P(A), is the probability of an event, which is a third use.",
    cardRule:
      "One meaning per card. Do not define p as “probability” and stop there.",
    schedule: schedule("Start with the p-value, then the proportion, then P(A)."),
    cards: [
      card(
        "What does p mean in a hypothesis test?",
        "The p-value.",
      ),
      card(
        "What does p mean in a proportion problem?",
        "The population proportion, a parameter.",
      ),
      card(
        "What is p̂?",
        "The sample proportion. It estimates p.",
      ),
      card(
        "What is P(A)?",
        "The probability that event A happens.",
      ),
      card(
        "Is a population proportion a p-value?",
        "No. The proportion is a parameter. The p-value is a test result.",
      ),
      card(
        "Which p is between 0 and 1 either way?",
        "Both a proportion and a p-value. The range alone does not tell you which one you have.",
      ),
      card(
        "What should you read before translating p?",
        "The sentence it sits in. Test, proportion, or probability.",
      ),
      card(
        "Does a small p always mean a small proportion?",
        "No. A small p-value is about surprise under the null, not about a small share of a population.",
      ),
    ],
  },
  {
    slug: "standard-deviation",
    fieldLabel: "Standard deviation",
    headline: "What is standard deviation in statistics",
    description:
      "What is standard deviation in statistics: the typical distance from the mean, in the original units. A sample deck and a spaced review schedule.",
    lede: "The standard deviation is the typical distance of the observations from their mean. It is the square root of the variance, so it is back in the same units as the data.",
    testsHeading: "The short answer",
    tests:
      "The population standard deviation is σ. The sample standard deviation is s, and its variance divides by n − 1 before the square root. A larger standard deviation means the values are more spread out. For a roughly bell-shaped distribution, about 68 percent of the values sit within one standard deviation of the mean.",
    cardRule:
      "One symbol or one reading per card. σ, s, and the variance stay on their own cards.",
    schedule: schedule("Start with the meaning, then σ versus s."),
    cards: [
      card(
        "What is the standard deviation?",
        "The typical distance of the values from their mean.",
      ),
      card(
        "How is it related to the variance?",
        "It is the square root of the variance.",
      ),
      card(
        "Why take the square root?",
        "So the spread is in the original units, not squared units.",
      ),
      card(
        "What is σ?",
        "The population standard deviation.",
      ),
      card(
        "What is s?",
        "The sample standard deviation.",
      ),
      card(
        "What do you divide by when computing s?",
        "n − 1, inside the variance, before the square root.",
      ),
      card(
        "What does a larger standard deviation mean?",
        "The observations are more spread out around the mean.",
      ),
      card(
        "About how many values fall within one standard deviation of the mean, in a bell-shaped distribution?",
        "About 68 percent.",
      ),
    ],
  },
  {
    slug: "power",
    fieldLabel: "Power",
    headline: "What is power in statistics",
    description:
      "What is power in statistics: the chance a study detects a real effect. How it differs from a p-value, plus a spaced review schedule.",
    lede: "Power is the probability that a study rejects the null hypothesis when that hypothesis is false. It is the chance of detecting a real effect. It is not the p-value, and it is not how large the effect is.",
    testsHeading: "The short answer",
    tests:
      "Power equals 1 − β. Beta is the probability of missing a real effect. Power is higher when the effect is larger, the sample is larger, the cutoff is looser, or the noise is smaller. A common planning target is 80 percent. That target is a convention, like 0.05.",
    cardRule:
      "One piece per card. Power, beta, and the p-value are three different numbers.",
    schedule: schedule("Start with the definition, then what raises power."),
    cards: [
      card(
        "What is statistical power?",
        "The probability of rejecting the null hypothesis when it is false.",
      ),
      card(
        "What is β?",
        "The probability of missing a real effect. A Type II error.",
      ),
      card(
        "How are power and β related?",
        "Power = 1 − β.",
      ),
      card(
        "Is power a p-value?",
        "No. Power is about the study’s chance of detecting an effect. The p-value comes from the data you already have.",
      ),
      card(
        "What raises power?",
        "A larger effect, a larger sample, a looser cutoff, or less noise.",
      ),
      card(
        "What is a common power target when planning a study?",
        "80 percent. It is a convention, not a requirement.",
      ),
      card(
        "Can a real effect produce a large p-value?",
        "Yes, if the study has low power.",
      ),
      card(
        "Does high power mean the effect is important?",
        "No. Power is about detecting an effect, not about whether the effect matters.",
      ),
    ],
  },
  {
    slug: "r",
    fieldLabel: "r",
    headline: "What is r in statistics",
    description:
      "What is r in statistics: the correlation coefficient, from −1 to 1. What it does not say about cause, plus a spaced review schedule.",
    lede: "r is the correlation coefficient. In a first course it means Pearson’s r, the strength and direction of a straight-line relationship between two variables. It runs from −1 to 1.",
    testsHeading: "The short answer",
    tests:
      "The sign of r is the direction. The absolute value is the strength. r = 0 means no straight-line relationship, not that the variables are unrelated in every way. A curved relationship can have r near 0. r does not say that one variable causes the other. r² is the share of the variation in one variable that a straight line through the other accounts for.",
    cardRule:
      "One fact per card. Direction, strength, cause, and r² stay separate.",
    schedule: schedule("Start with the range, then what r = 0 does not mean."),
    cards: [
      card(
        "What is r?",
        "Pearson’s correlation. The straight-line association between two variables.",
      ),
      card(
        "What values can r take?",
        "From −1 to 1.",
      ),
      card(
        "What does the sign of r tell you?",
        "The direction. Positive means the variables rise together. Negative means one falls as the other rises.",
      ),
      card(
        "What does r = 0 mean?",
        "No straight-line relationship. A curve is still possible.",
      ),
      card(
        "Does r show that one variable caused the other?",
        "No. They can move together for a third reason.",
      ),
      card(
        "What is r²?",
        "The share of variation in one variable that a straight line through the other accounts for.",
      ),
      card(
        "Is r the slope of the line?",
        "No. The slope is in the units of the two variables. r is not.",
      ),
      card(
        "What does r = −1 mean?",
        "A perfect negative straight line. Every point sits on that line.",
      ),
    ],
  },
  {
    slug: "mode",
    fieldLabel: "Mode",
    headline: "What is mode in statistics",
    description:
      "What is the mode in statistics: the most frequent value, including when a set has more than one. A sample deck and a spaced review schedule.",
    lede: "The mode is the value that appears most often. A set can have two modes, or none, if every value appears once. It is the measure of center that still works when the data are categories rather than numbers.",
    testsHeading: "The short answer",
    tests:
      "Mean and median need numbers you can order or add. The mode only needs a count. In a histogram the mode is the tallest bar. Two tall peaks make the distribution bimodal. The mode, the mean, and the median can be three different numbers.",
    cardRule:
      "One comparison per card. Mode, mean, and median do not share an answer.",
    schedule: schedule("Start with the definition, then bimodal, then categories."),
    cards: [
      card(
        "What is the mode?",
        "The value that appears most often.",
      ),
      card(
        "Can a data set have two modes?",
        "Yes. It is bimodal when two values tie for most frequent.",
      ),
      card(
        "What if every value appears once?",
        "There is no mode.",
      ),
      card(
        "Which measure of center works for categories, such as colors?",
        "The mode. The mean and the median need numbers.",
      ),
      card(
        "Where is the mode on a histogram?",
        "The tallest bar.",
      ),
      card(
        "Do the mode and the mean have to match?",
        "No. A few extreme values can pull the mean away from the mode.",
      ),
      card(
        "What is the median?",
        "The middle value once the observations are ordered.",
      ),
      card(
        "Is the mode a measure of spread?",
        "No. It is a measure of center.",
      ),
    ],
  },
];

export function statisticBySlug(slug) {
  return STATISTICS.find((item) => item.slug === slug) ?? null;
}
