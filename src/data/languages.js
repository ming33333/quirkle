const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const LANGUAGES = [
  {
    slug: "spanish",
    fieldLabel: "Spanish",
    headline: "How to learn Spanish fast",
    description:
      "How to learn Spanish fast: the words and short phrases to put on flashcards first, a sample deck, and a spaced review schedule.",
    lede: "Spanish shares hundreds of words with English, and the rest is a few thousand words you will actually say. Learn those out loud, on a schedule, before you collect grammar books.",
    testsHeading: "What to memorize first",
    tests:
      "Start with greetings, the questions you ask every day, and the most common nouns with their gender. A cognate such as hospital still gets a card, because you need to produce it, not just recognize it.",
    cardRule:
      "One word or one short phrase per card. Put the gender on the noun. Put the question mark sentence on its own card, not buried in a list.",
    schedule: schedule(
      "Start with the sample phrases, then add the next words you needed and did not have.",
    ),
    cards: [
      card("How do you say hello?", "Hola."),
      card("How do you say thank you?", "Gracias."),
      card("How do you say please?", "Por favor."),
      card("How do you say good morning?", "Buenos días."),
      card(
        "How do you say water, and what gender is it?",
        "Agua is feminine. You say el agua because the word starts with a stressed a.",
      ),
      card("How do you say I don’t understand?", "No entiendo."),
      card("How do you ask where the bathroom is?", "¿Dónde está el baño?"),
      card("How do you ask how much something costs?", "¿Cuánto cuesta?"),
    ],
  },
  {
    slug: "french",
    fieldLabel: "French",
    headline: "How to learn French fast",
    description:
      "How to learn French fast: the phrases to say out loud, a sample deck with gender, and a spaced review schedule.",
    lede: "French is learned by mouth. The spelling hides sounds, so a card you only read will not help you in a conversation. Say the answer every time you flip it.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, the polite forms, and everyday nouns with le or la. The highest-frequency verbs — to be, to have, to want — get their own cards in the je form before you memorize a full table.",
    cardRule:
      "One phrase per card, and say it aloud. A noun card includes le, la, or l’. A verb card is one form, not the whole conjugation.",
    schedule: schedule(
      "Start with the polite phrases, then add a noun each time you have to point at something.",
    ),
    cards: [
      card("How do you say hello during the day?", "Bonjour."),
      card("How do you say thank you?", "Merci."),
      card("How do you say please, politely?", "S’il vous plaît."),
      card("How do you say good evening?", "Bonsoir."),
      card("How do you say water, with its article?", "L’eau."),
      card("How do you say I don’t understand?", "Je ne comprends pas."),
      card("How do you ask where the bathroom is?", "Où sont les toilettes ?"),
      card("How do you ask how much it costs?", "C’est combien ?"),
    ],
  },
  {
    slug: "japanese",
    fieldLabel: "Japanese",
    headline: "How to learn Japanese fast",
    description:
      "How to learn Japanese fast: kana, a few survival phrases, a sample deck with readings, and a spaced review schedule.",
    lede: "Japanese gets fast only after the sounds are automatic. Learn hiragana, then the phrases you will say this week. Kanji can wait until a word is already in your mouth.",
    testsHeading: "What to memorize first",
    tests:
      "Hiragana, then greetings and the questions that get you through a day: where, how much, and I don’t understand. One card is one word with its reading. A kanji card comes later, and only for a word you already know how to say.",
    cardRule:
      "Put the Japanese on one side and the reading with the meaning on the other. One word per card. Do not put a whole sentence’s worth of grammar on the answer.",
    schedule: schedule(
      "Finish a small hiragana deck first. Then add the sample phrases, and only then a word you met today.",
    ),
    cards: [
      card("How do you say hello in the afternoon?", "こんにちは (konnichiwa)."),
      card("How do you say thank you?", "ありがとう (arigatou)."),
      card("How do you say excuse me?", "すみません (sumimasen)."),
      card("How do you say yes?", "はい (hai)."),
      card("How do you say water?", "水 (mizu)."),
      card("How do you say I don’t understand?", "わかりません (wakarimasen)."),
      card(
        "How do you ask where the bathroom is?",
        "トイレはどこですか (toire wa doko desu ka).",
      ),
      card("How do you say please, when asking a favor?", "お願いします (onegaishimasu)."),
    ],
  },
  {
    slug: "chinese",
    fieldLabel: "Chinese",
    headline: "How to learn Chinese fast",
    description:
      "How to learn Mandarin Chinese fast: tones on the same card as the word, a sample deck, and a spaced review schedule.",
    lede: "Mandarin is a small set of syllables said at different tones. A card without the tone is the wrong word. Learn the sound and the tone together, then the character.",
    testsHeading: "What to memorize first",
    tests:
      "Survival phrases, the numbers you need to pay, and a handful of nouns. Pinyin with tone marks stays on the card until you can say the tone without looking. Simplified characters are enough to start.",
    cardRule:
      "One word or one short phrase. The answer includes the characters, the pinyin, and the tone. Two words that differ only by tone are two cards.",
    schedule: schedule(
      "Start with the sample phrases and say the tone out loud. Add a new word only after yesterday’s cards are still right.",
    ),
    cards: [
      card("How do you say hello?", "你好 (nǐ hǎo)."),
      card("How do you say thank you?", "谢谢 (xièxie)."),
      card("How do you say goodbye?", "再见 (zàijiàn)."),
      card("How do you say water?", "水 (shuǐ)."),
      card("How do you say I don’t understand?", "我听不懂 (wǒ tīng bu dǒng)."),
      card("How do you ask where the bathroom is?", "洗手间在哪里？ (xǐshǒujiān zài nǎlǐ?)"),
      card("How do you ask how much it costs?", "多少钱？ (duōshao qián?)"),
      card("How do you say please, when making a request?", "请 (qǐng)."),
    ],
  },
  {
    slug: "korean",
    fieldLabel: "Korean",
    headline: "How to learn Korean fast",
    description:
      "How to learn Korean fast: hangul, polite phrases, a sample deck, and a spaced review schedule.",
    lede: "Hangul is a small alphabet, and it is the reason Korean can move quickly. Learn the letters until you can read a sign, then put polite phrases on cards and say them.",
    testsHeading: "What to memorize first",
    tests:
      "Hangul, then the polite endings you will actually use with strangers: hello, thank you, please give me, and where is. Banmal, the casual speech, can wait.",
    cardRule:
      "One phrase per card, in hangul, with the pronunciation on the answer until reading is easy. A particle is not its own first card. Attach it to the phrase you will say.",
    schedule: schedule(
      "Learn hangul as its own short deck. Then review the sample phrases before you add drama vocabulary.",
    ),
    cards: [
      card("How do you say hello, politely?", "안녕하세요 (annyeonghaseyo)."),
      card("How do you say thank you, politely?", "감사합니다 (gamsahamnida)."),
      card("How do you say yes, politely?", "네 (ne)."),
      card("How do you say water?", "물 (mul)."),
      card("How do you say excuse me?", "실례합니다 (sillyehamnida)."),
      card("How do you say I don’t know?", "모르겠어요 (moreugesseoyo)."),
      card("How do you ask where the bathroom is?", "화장실이 어디예요? (hwajangsil-i eodieyo?)"),
      card("How do you say please give me, after a noun?", "주세요 (juseyo)."),
    ],
  },
  {
    slug: "german",
    fieldLabel: "German",
    headline: "How to learn German fast",
    description:
      "How to learn German fast: nouns with their articles, a sample phrase deck, and a spaced review schedule.",
    lede: "German vocabulary sticks when the article is part of the word. Der, die, and das are not a detail you add later. They go on the card the first time you meet the noun.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, the questions you ask in a shop or a station, and nouns with der, die, or das. Verb-second word order can wait until these phrases come out without a pause.",
    cardRule:
      "A noun card includes the article. A phrase card is one sentence you might say today. Do not put a grammar rule on a card unless the answer is a single example sentence.",
    schedule: schedule(
      "Start with the sample phrases. Each new noun enters the deck with its article already on it.",
    ),
    cards: [
      card("How do you say hello, in the daytime?", "Guten Tag."),
      card("How do you say thank you?", "Danke."),
      card("How do you say please?", "Bitte."),
      card("How do you say good morning?", "Guten Morgen."),
      card("How do you say water, with its article?", "Das Wasser."),
      card("How do you say I don’t understand?", "Ich verstehe nicht."),
      card("How do you ask where the bathroom is?", "Wo ist die Toilette?"),
      card("How do you ask how much that costs?", "Wie viel kostet das?"),
    ],
  },
  {
    slug: "italian",
    fieldLabel: "Italian",
    headline: "How to learn Italian fast",
    description:
      "How to learn Italian fast: everyday phrases, nouns with gender, a sample deck, and a spaced review schedule.",
    lede: "Italian gives you a lot of words you can already guess, and then it asks you to say them with the right ending. Speak the card. Guessing on the page is not the same skill.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, food and shop phrases, and the gender of the nouns you use. The present tense of essere and avere is enough verb work for the first deck.",
    cardRule:
      "One phrase per card. A noun includes il, lo, la, or l’. If a cognate is spelled differently from English, it still gets a card.",
    schedule: schedule(
      "Say the sample deck out loud for a few days, then add the words you reached for and could not find.",
    ),
    cards: [
      card("How do you say hello, in the daytime?", "Buongiorno."),
      card("How do you say thank you?", "Grazie."),
      card("How do you say please?", "Per favore."),
      card("How do you say good evening?", "Buonasera."),
      card("How do you say water, with its article?", "L’acqua."),
      card("How do you say I don’t understand?", "Non capisco."),
      card("How do you ask where the bathroom is?", "Dov’è il bagno?"),
      card("How do you ask how much it costs?", "Quanto costa?"),
    ],
  },
  {
    slug: "american-sign-language",
    fieldLabel: "American Sign Language",
    headline: "How to learn American Sign Language fast",
    description:
      "How to learn American Sign Language fast: the first signs, what to put on a card, a sample deck, and a spaced review schedule.",
    lede: "A sign is a handshape, a place, and a movement. English words will not remind your hands. Review by making the sign, not by reading a description and nodding.",
    testsHeading: "What to memorize first",
    tests:
      "The signs you will use with a stranger in the first week: hello, please, thank you, yes, no, help, water, and bathroom. Fingerspelling is its own short deck, after these signs are comfortable.",
    cardRule:
      "The prompt is the meaning. The answer is the sign, and you produce it with your hands. Write the handshape, the location, and the movement only as a reminder when you miss it.",
    schedule: schedule(
      "Make every sign in the sample deck, in a mirror if you need one. Add a new sign only when these still come out cleanly.",
    ),
    cards: [
      card(
        "How do you sign hello?",
        "Open hand, palm out, starting at the forehead and moving outward, like a small salute.",
      ),
      card(
        "How do you sign thank you?",
        "Flat hand, fingertips at the chin, then move the hand forward.",
      ),
      card(
        "How do you sign please?",
        "Open hand circles on the chest.",
      ),
      card(
        "How do you sign yes?",
        "A fist nods at the wrist, like a head nodding.",
      ),
      card(
        "How do you sign no?",
        "The index and middle fingers tap down onto the thumb, and can repeat.",
      ),
      card(
        "How do you sign water?",
        "The W handshape taps the chin.",
      ),
      card(
        "How do you sign bathroom?",
        "The T handshape shakes side to side.",
      ),
      card(
        "How do you sign help?",
        "A thumbs-up fist rests on the other open palm, and both hands lift.",
      ),
    ],
  },
  {
    slug: "portuguese",
    fieldLabel: "Portuguese",
    headline: "How to learn Portuguese fast",
    description:
      "How to learn Brazilian Portuguese fast: everyday phrases, a sample deck, and a spaced review schedule.",
    lede: "In the United States, the Portuguese people mean is Brazilian. The phrases below are the ones you will hear in Brazil. European Portuguese can be a later deck, not this one.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, please and thank you, and the questions that buy you time: I don’t understand, where is the bathroom, how much. Nasal vowels need to be said, not just spelled.",
    cardRule:
      "One phrase per card, in Brazilian Portuguese. Obrigado and obrigada depend on who is speaking: use obrigado if you are a man, obrigada if you are a woman.",
    schedule: schedule(
      "Start with the sample phrases and say the nasal sounds out loud. Add a word when a conversation stalls on it.",
    ),
    cards: [
      card("How do you say hello?", "Olá."),
      card("How do you say good morning?", "Bom dia."),
      card(
        "How do you say thank you?",
        "Obrigado if you are a man. Obrigada if you are a woman.",
      ),
      card("How do you say please?", "Por favor."),
      card("How do you say water?", "Água."),
      card("How do you say I don’t understand?", "Não entendo."),
      card("How do you ask where the bathroom is?", "Onde fica o banheiro?"),
      card("How do you ask how much it costs?", "Quanto custa?"),
    ],
  },
  {
    slug: "arabic",
    fieldLabel: "Arabic",
    headline: "How to learn Arabic fast",
    description:
      "How to learn Arabic fast: a few Modern Standard phrases, the script on the card, and a spaced review schedule.",
    lede: "Start with Modern Standard Arabic phrases you can use across countries, and learn the letters alongside them. A spoken dialect is a second deck once these phrases are steady.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, thank you, yes and no, and the questions that get you through a day. Each card shows the Arabic and a transliteration until you can read the letters without the Latin spelling.",
    cardRule:
      "One short phrase per card. Keep the transliteration on the answer, not instead of the Arabic. Right-to-left reading is part of the card, so look at the script every time.",
    schedule: schedule(
      "Read the Arabic on every review, even when the transliteration is still there. Drop the Latin spelling only after the letters are reliable.",
    ),
    cards: [
      card("How do you say hello?", "مرحبا (marhaban)."),
      card("How do you say thank you?", "شكرا (shukran)."),
      card("How do you say please?", "من فضلك (min fadlik)."),
      card("How do you say yes?", "نعم (na‘am)."),
      card("How do you say water?", "ماء (maa’)."),
      card("How do you say I don’t understand?", "لا أفهم (la afham)."),
      card("How do you ask where the bathroom is?", "أين الحمام؟ (ayna al-hammam?)"),
      card("How do you say goodbye?", "مع السلامة (ma‘a as-salama)."),
    ],
  },
];

export function languageBySlug(slug) {
  return LANGUAGES.find((language) => language.slug === slug) ?? null;
}
