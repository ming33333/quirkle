const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const LANGUAGE_COURSES = [
  {
    slug: "spanish",
    fieldLabel: "Spanish",
    headline: "How to learn Spanish",
    description:
      "How to learn Spanish: the sounds, the everyday words with their gender, a sample deck, and a spaced review schedule.",
    lede: "Learn the sounds English does not have, then the words you will say every day, then short questions. Gender belongs on the noun the first time you meet it.",
    testsHeading: "Where to start",
    tests:
      "The rolled r, the ñ, greetings, and nouns with el or la. Ser and estar are a later deck, after these words come out without a pause.",
    cardRule:
      "One word or one short question. A noun card includes its gender. A cognate still gets a card, because recognizing hospital is not the same as saying it.",
    schedule: schedule(
      "Start with the sounds you miss, then the sample words, then a question you needed and did not have.",
    ),
    cards: [
      card("What sound does ñ stand for?", "The ny in canyon."),
      card("Where does a noun’s gender go?", "On the same card as the noun."),
      card("How do you say hello?", "Hola."),
      card("How do you say thank you?", "Gracias."),
      card("How do you say I don’t understand?", "No entiendo."),
      card("How do you ask where the bathroom is?", "¿Dónde está el baño?"),
      card(
        "When do ser and estar get their own deck?",
        "After the everyday words come out without a pause.",
      ),
      card(
        "Does recognizing a cognate mean you can say it?",
        "No. It still gets a card.",
      ),
    ],
  },
  {
    slug: "french",
    fieldLabel: "French",
    headline: "How to learn French",
    description:
      "How to learn French: the sounds the spelling hides, articles with the noun, a sample deck, and a spaced review schedule.",
    lede: "French spelling hides the sound. Learn to hear and say a phrase before you trust the letters, and put le, la, or l’ on the noun from the start.",
    testsHeading: "Where to start",
    tests:
      "Nasal vowels, the silent letters at the ends of words, greetings, and the polite vous form. A full verb table waits until je suis, j’ai, and je veux are easy.",
    cardRule:
      "One phrase per card, said aloud. A noun includes its article. One verb card is one form, not the conjugation.",
    schedule: schedule(
      "Say the sample phrases until the silent letters stop tricking you. Then add a noun with its article.",
    ),
    cards: [
      card("Why say a French card out loud?", "The spelling hides the sound."),
      card("Which article goes on a noun card?", "Le, la, or l’."),
      card("How do you say hello during the day?", "Bonjour."),
      card("How do you say thank you?", "Merci."),
      card("How do you say please, politely?", "S’il vous plaît."),
      card("How do you say I don’t understand?", "Je ne comprends pas."),
      card("How do you ask how much it costs?", "C’est combien ?"),
      card(
        "What verb forms come before a full table?",
        "The je form of to be, to have, and to want.",
      ),
    ],
  },
  {
    slug: "japanese",
    fieldLabel: "Japanese",
    headline: "How to learn Japanese",
    description:
      "How to learn Japanese: hiragana first, then phrases, then kanji for words you can already say. A sample deck and a spaced review schedule.",
    lede: "Learn hiragana until a word’s sound is automatic. Then learn the phrases you will say. Kanji comes after, and only for a word already in your mouth.",
    testsHeading: "Where to start",
    tests:
      "Hiragana, then greetings and the questions that get you through a day. One card is one word with its reading. Particles stay attached to the phrase you will say.",
    cardRule:
      "Japanese on one side. Reading and meaning on the other. Do not put a sentence’s worth of grammar on the answer.",
    schedule: schedule(
      "Finish a small hiragana deck. Then the sample phrases. A kanji card waits until you can say the word.",
    ),
    cards: [
      card("What do you learn before kanji?", "Hiragana, then the spoken word."),
      card("What goes on a word card?", "The word, its reading, and its meaning."),
      card("How do you say hello in the afternoon?", "こんにちは (konnichiwa)."),
      card("How do you say thank you?", "ありがとう (arigatou)."),
      card("How do you say water?", "水 (mizu)."),
      card("How do you say I don’t understand?", "わかりません (wakarimasen)."),
      card(
        "When does a kanji card belong in the deck?",
        "After you can already say the word.",
      ),
      card(
        "Where does a particle go at the start?",
        "On the phrase you will say, not on its own card.",
      ),
    ],
  },
  {
    slug: "chinese",
    fieldLabel: "Chinese",
    headline: "How to learn Chinese",
    description:
      "How to learn Chinese: the tone with the word, then short phrases, then characters. A sample deck and a spaced review schedule.",
    lede: "Mandarin is a small set of syllables said at different tones. Learn the sound and the tone together. The character comes after you can say the word.",
    testsHeading: "Where to start",
    tests:
      "The four tones plus the neutral tone, greetings, numbers for paying, and a handful of nouns. Pinyin with tone marks stays on the card until you can say the tone without looking. Simplified characters are enough to start.",
    cardRule:
      "One word or one short phrase. The answer includes the characters, the pinyin, and the tone. Two words that differ only by tone are two cards.",
    schedule: schedule(
      "Say the tone on every review. Add a character only for a word you can already pronounce.",
    ),
    cards: [
      card(
        "How many tones do textbooks usually teach?",
        "Four, plus a neutral tone.",
      ),
      card(
        "What belongs on a word card?",
        "The characters, the pinyin, and the tone.",
      ),
      card("How do you say hello?", "你好 (nǐ hǎo)."),
      card("How do you say thank you?", "谢谢 (xièxie)."),
      card("How do you say water?", "水 (shuǐ)."),
      card("How do you say I don’t understand?", "我听不懂 (wǒ tīng bu dǒng)."),
      card("How do you ask how much it costs?", "多少钱？ (duōshao qián?)"),
      card(
        "When do you add the character?",
        "After you can say the word with the right tone.",
      ),
    ],
  },
  {
    slug: "korean",
    fieldLabel: "Korean",
    headline: "How to learn Korean",
    description:
      "How to learn Korean: hangul, then polite phrases, a sample deck, and a spaced review schedule.",
    lede: "Hangul is a small alphabet. Learn the letters until you can read a sign, then learn the polite phrases you will use with strangers. Casual speech can wait.",
    testsHeading: "Where to start",
    tests:
      "Hangul, then hello, thank you, and where is. Banmal, the casual speech, is a later deck. A particle stays on the phrase you will say.",
    cardRule:
      "One phrase per card, in hangul, with the pronunciation on the answer until reading is easy.",
    schedule: schedule(
      "Learn hangul as its own short deck. Then the polite phrases. Casual endings come later.",
    ),
    cards: [
      card("What do you learn before phrases?", "Hangul."),
      card("Which speech level comes first?", "The polite forms used with strangers."),
      card("How do you say hello, politely?", "안녕하세요 (annyeonghaseyo)."),
      card("How do you say thank you, politely?", "감사합니다 (gamsahamnida)."),
      card("How do you say water?", "물 (mul)."),
      card("How do you say I don’t know?", "모르겠어요 (moreugesseoyo)."),
      card("How do you ask where the bathroom is?", "화장실이 어디예요? (hwajangsil-i eodieyo?)"),
      card("What is banmal?", "Casual speech. It waits until the polite phrases are easy."),
    ],
  },
  {
    slug: "german",
    fieldLabel: "German",
    headline: "How to learn German",
    description:
      "How to learn German: nouns with der, die, or das, a sample deck, and a spaced review schedule.",
    lede: "Learn greetings and the questions you ask in a shop, and treat the article as part of the noun. Cases and verb-second word order come after the phrases are steady.",
    testsHeading: "Where to start",
    tests:
      "Guten Tag, danke, and nouns with der, die, or das. A case ending is a later card, attached to a phrase you already say.",
    cardRule:
      "A noun card includes the article. A phrase card is one sentence. A grammar rule is one example sentence, not a chart.",
    schedule: schedule(
      "Start with the sample phrases. Each new noun enters with der, die, or das already on it.",
    ),
    cards: [
      card("What goes on a noun card?", "The noun and der, die, or das."),
      card("What waits until the phrases are steady?", "Cases and verb-second word order."),
      card("How do you say hello, in the daytime?", "Guten Tag."),
      card("How do you say thank you?", "Danke."),
      card("How do you say water, with its article?", "Das Wasser."),
      card("How do you say I don’t understand?", "Ich verstehe nicht."),
      card("How do you ask where the bathroom is?", "Wo ist die Toilette?"),
      card("How do you ask how much that costs?", "Wie viel kostet das?"),
    ],
  },
  {
    slug: "italian",
    fieldLabel: "Italian",
    headline: "How to learn Italian",
    description:
      "How to learn Italian: everyday phrases, nouns with their article, a sample deck, and a spaced review schedule.",
    lede: "Italian shares a lot of words with English, then asks for the right ending. Learn greetings and shop phrases, and say the card. Guessing a cognate on the page is a different skill.",
    testsHeading: "Where to start",
    tests:
      "Greetings, food and shop phrases, and the gender of the nouns you use. The present of essere and avere is enough verb work for the first deck.",
    cardRule:
      "One phrase per card. A noun includes il, lo, la, or l’. A cognate with a different spelling still gets a card.",
    schedule: schedule(
      "Say the sample deck out loud. Then add a word you reached for and could not find.",
    ),
    cards: [
      card("What article goes on a noun card?", "Il, lo, la, or l’."),
      card("Which verbs are enough at the start?", "Essere and avere, in the present."),
      card("How do you say hello, in the daytime?", "Buongiorno."),
      card("How do you say thank you?", "Grazie."),
      card("How do you say water, with its article?", "L’acqua."),
      card("How do you say I don’t understand?", "Non capisco."),
      card("How do you ask where the bathroom is?", "Dov’è il bagno?"),
      card("How do you ask how much it costs?", "Quanto costa?"),
    ],
  },
  {
    slug: "american-sign-language",
    fieldLabel: "American Sign Language",
    headline: "How to learn American Sign Language",
    description:
      "How to learn American Sign Language: handshape, place, and movement, a sample deck, and a spaced review schedule.",
    lede: "A sign is a handshape, a place, and a movement. Learn the signs you will use with a stranger, and review by making the sign. Fingerspelling is its own deck after these are comfortable.",
    testsHeading: "Where to start",
    tests:
      "Hello, please, thank you, yes, no, help, water, and bathroom. English word order will not remind your hands.",
    cardRule:
      "The prompt is the meaning. You produce the sign. Write the handshape, the location, and the movement only as a reminder when you miss it.",
    schedule: schedule(
      "Make every sign in the sample deck. Add a new sign when these still come out cleanly.",
    ),
    cards: [
      card(
        "What are the three parts of a sign?",
        "Handshape, place, and movement.",
      ),
      card(
        "How do you review a sign card?",
        "By making the sign, not by reading a description.",
      ),
      card(
        "How do you sign hello?",
        "Open hand, palm out, starting at the forehead and moving outward.",
      ),
      card(
        "How do you sign thank you?",
        "Flat hand, fingertips at the chin, then move the hand forward.",
      ),
      card("How do you sign water?", "The W handshape taps the chin."),
      card("How do you sign bathroom?", "The T handshape shakes side to side."),
      card(
        "How do you sign help?",
        "A thumbs-up fist rests on the other open palm, and both hands lift.",
      ),
      card(
        "When does fingerspelling get a deck?",
        "After the first signs are comfortable.",
      ),
    ],
  },
  {
    slug: "portuguese",
    fieldLabel: "Portuguese",
    headline: "How to learn Portuguese",
    description:
      "How to learn Portuguese: Brazilian phrases first, a sample deck, and a spaced review schedule.",
    lede: "Start with Brazilian Portuguese, the variety most learners in the Americas hear. Learn greetings and the questions that buy you time. European Portuguese can be a later deck.",
    testsHeading: "Where to start",
    tests:
      "Olá, bom dia, thank you, and where the bathroom is. Nasal vowels have to be said. Obrigado and obrigada depend on who is speaking.",
    cardRule:
      "One phrase per card, in Brazilian Portuguese. Use obrigado if you are a man and obrigada if you are a woman.",
    schedule: schedule(
      "Say the nasal sounds on every review. Add a European Portuguese card only after these phrases are steady.",
    ),
    cards: [
      card(
        "Which Portuguese comes first for most learners in the Americas?",
        "Brazilian Portuguese.",
      ),
      card(
        "How do you say thank you?",
        "Obrigado if you are a man. Obrigada if you are a woman.",
      ),
      card("How do you say hello?", "Olá."),
      card("How do you say good morning?", "Bom dia."),
      card("How do you say water?", "Água."),
      card("How do you say I don’t understand?", "Não entendo."),
      card("How do you ask where the bathroom is?", "Onde fica o banheiro?"),
      card(
        "When does European Portuguese get a deck?",
        "After the Brazilian phrases are steady.",
      ),
    ],
  },
  {
    slug: "arabic",
    fieldLabel: "Arabic",
    headline: "How to learn Arabic",
    description:
      "How to learn Arabic: Modern Standard phrases and the letters, a sample deck, and a spaced review schedule.",
    lede: "Start with Modern Standard Arabic, which travels across countries, and learn the letters at the same time. A spoken dialect is a second deck once these phrases are steady.",
    testsHeading: "Where to start",
    tests:
      "The alphabet, right to left, then greetings, yes and no, and the questions that get you through a day. Transliteration stays on the answer until you can read the letters.",
    cardRule:
      "One short phrase per card. The Arabic script is on the card. The Latin spelling is a temporary aid, not a replacement.",
    schedule: schedule(
      "Read the Arabic on every review. Drop the Latin spelling after the letters are reliable.",
    ),
    cards: [
      card("Which Arabic comes first?", "Modern Standard Arabic."),
      card("Which direction do you read?", "Right to left."),
      card("How do you say hello?", "مرحبا (marhaban)."),
      card("How do you say thank you?", "شكرا (shukran)."),
      card("How do you say yes?", "نعم (na‘am)."),
      card("How do you say water?", "ماء (maa’)."),
      card("How do you say I don’t understand?", "لا أفهم (la afham)."),
      card(
        "When does a dialect get its own deck?",
        "After the Modern Standard phrases are steady.",
      ),
    ],
  },
  {
    slug: "russian",
    fieldLabel: "Russian",
    headline: "How to learn Russian",
    description:
      "How to learn Russian: Cyrillic, then polite phrases, a sample deck, and a spaced review schedule.",
    lede: "Learn the letters first, then the polite phrases you will say. The formal hello is the one for strangers. Slang waits.",
    testsHeading: "Where to start",
    tests:
      "Cyrillic, including the letters people mix up, then hello, thank you, and how much. Stress belongs in the pronunciation on the card.",
    cardRule:
      "One phrase per card, in Cyrillic, with the pronunciation on the answer until you can read it. A letter you mix up gets its own card.",
    schedule: schedule(
      "Learn the letters. Then say the sample phrases until the stress falls in the right place.",
    ),
    cards: [
      card("What comes before the phrases?", "Cyrillic."),
      card("Which hello do you use with strangers?", "Здравствуйте (zdravstvuyte)."),
      card("How do you say thank you?", "Спасибо (spasibo)."),
      card("How do you say please, or you’re welcome?", "Пожалуйста (pozhaluysta)."),
      card("How do you say water?", "Вода (voda)."),
      card("How do you say I don’t understand?", "Я не понимаю (ya ne ponimayu)."),
      card("How do you ask how much it costs?", "Сколько это стоит? (skolko eto stoit?)"),
      card(
        "What gets its own card when you mix it up?",
        "The letter, not a longer grammar note.",
      ),
    ],
  },
  {
    slug: "hindi",
    fieldLabel: "Hindi",
    headline: "How to learn Hindi",
    description:
      "How to learn Hindi: phrases in Devanagari, a sample deck, and a spaced review schedule.",
    lede: "Learn the phrases you will say, and keep Devanagari on the card so the letters are not a separate project. Polite everyday speech comes before film slang.",
    testsHeading: "Where to start",
    tests:
      "Greetings, yes and no, water, and the questions you ask in a market. A word you only recognize in Latin letters is not learned yet.",
    cardRule:
      "One phrase per card, in Devanagari, with a pronunciation guide on the answer. Say it out loud.",
    schedule: schedule(
      "Read the Devanagari on every review. Add a word the first time you have to point at it.",
    ),
    cards: [
      card("What script goes on the card?", "Devanagari."),
      card("What kind of speech comes first?", "Polite everyday phrases."),
      card("How do you say hello?", "नमस्ते (namaste)."),
      card("How do you say thank you?", "धन्यवाद (dhanyavaad)."),
      card("How do you say yes?", "हाँ (haan)."),
      card("How do you say water?", "पानी (paani)."),
      card("How do you say I don’t understand?", "मुझे समझ नहीं आया (mujhe samajh nahin aaya)."),
      card("How do you ask how much this costs?", "यह कितने का है? (yah kitne ka hai?)"),
    ],
  },
  {
    slug: "latin",
    fieldLabel: "Latin",
    headline: "How to learn Latin",
    description:
      "How to learn Latin for reading: the words in textbook sentences, a sample deck, and a spaced review schedule.",
    lede: "Latin is for reading. Learn the words that show up in every textbook sentence, and say them so the endings start to stick. A full declension table comes after you can produce one form.",
    testsHeading: "Where to start",
    tests:
      "Greetings, the question words, and a small set of nouns you will meet immediately. One verb card is one form.",
    cardRule:
      "One word or one short sentence. A noun card uses the dictionary form. A verb card is one form, such as intellego, not the whole conjugation.",
    schedule: schedule(
      "Start with the sample sentences. Add a word when it blocks the line you are reading.",
    ),
    cards: [
      card("What is the first use of this Latin?", "Reading, not ordering coffee."),
      card("What form goes on a noun card?", "The dictionary form."),
      card("How do you say hello?", "Salve."),
      card("How do you say thank you?", "Gratias tibi ago."),
      card("How do you say water?", "Aqua."),
      card("How do you say I don’t understand?", "Non intellego."),
      card("How do you ask what this is?", "Quid est hoc?"),
      card(
        "When does a declension table earn a place?",
        "After you can produce one form without looking.",
      ),
    ],
  },
  {
    slug: "greek",
    fieldLabel: "Greek",
    headline: "How to learn Greek",
    description:
      "How to learn modern Greek: the alphabet, then street phrases, a sample deck, and a spaced review schedule.",
    lede: "This is modern Greek, the language spoken in Greece today. Learn the letters, then the phrases you need in a shop. Ancient Greek is a different course.",
    testsHeading: "Where to start",
    tests:
      "The alphabet, good morning, thank you, and the questions that unblock a conversation. The accent mark stays on the card.",
    cardRule:
      "One phrase per card, in Greek letters, with a pronunciation guide until reading is easy. Do not mix ancient and modern forms on the same card.",
    schedule: schedule(
      "Read every card in Greek letters. Add a word after the accent still lands in the right place.",
    ),
    cards: [
      card("Which Greek is this?", "Modern Greek, not ancient Greek."),
      card("What stays on the card besides the letters?", "The accent mark."),
      card("How do you say good morning?", "Καλημέρα (kalimera)."),
      card("How do you say thank you?", "Ευχαριστώ (efharisto)."),
      card("How do you say water?", "Νερό (nero)."),
      card("How do you say I don’t understand?", "Δεν καταλαβαίνω (den katalaveno)."),
      card("How do you ask where the bathroom is?", "Πού είναι η τουαλέτα; (pou einai i toualeta?)"),
      card("How do you ask how much it costs?", "Πόσο κάνει; (poso kani?)"),
    ],
  },
  {
    slug: "hebrew",
    fieldLabel: "Hebrew",
    headline: "How to learn Hebrew",
    description:
      "How to learn Hebrew: spoken phrases and the letters, right to left, a sample deck, and a spaced review schedule.",
    lede: "Spoken Hebrew leaves most vowels out of the writing. Learn phrases you can say, and read the letters right to left every time you review.",
    testsHeading: "Where to start",
    tests:
      "Hello, thank you, yes and no, water, and where the bathroom is. Some words change with the speaker’s gender. Put the form you will say on the card.",
    cardRule:
      "One phrase per card, in Hebrew script. The transliteration stays on the answer until the letters are reliable.",
    schedule: schedule(
      "Read the Hebrew on every review. Keep the transliteration only while the letters are still slow.",
    ),
    cards: [
      card("Which direction do you read?", "Right to left."),
      card(
        "What does the writing often leave out?",
        "The vowels you still have to say.",
      ),
      card("How do you say hello?", "שלום (shalom)."),
      card("How do you say thank you?", "תודה (toda)."),
      card("How do you say yes?", "כן (ken)."),
      card("How do you say water?", "מים (mayim)."),
      card(
        "How do you say I don’t understand?",
        "אני לא מבין (ani lo mevin) if you are a man. אני לא מבינה (ani lo mevina) if you are a woman.",
      ),
      card("How do you ask where the bathroom is?", "איפה השירותים? (eifo ha-sherutim?)"),
    ],
  },
  {
    slug: "vietnamese",
    fieldLabel: "Vietnamese",
    headline: "How to learn Vietnamese",
    description:
      "How to learn Vietnamese: one accent, tones on the card, a sample deck, and a spaced review schedule.",
    lede: "The tone is the word. Pick a northern or a southern accent, write that choice on the card, and keep every tone mark.",
    testsHeading: "Where to start",
    tests:
      "Greetings, thank you, and the questions you need in a shop. Do not mix northern and southern yes-words in the first deck.",
    cardRule:
      "One word or one short phrase. Keep every tone mark. Two phrases that differ only by tone are two cards.",
    schedule: schedule(
      "Say the tone out loud on every review. Add a word only when yesterday’s tones are still right.",
    ),
    cards: [
      card(
        "What do you choose before the first deck?",
        "A northern accent or a southern accent, and then you stay with it.",
      ),
      card("What has to stay on the card?", "Every tone mark."),
      card("How do you say hello?", "Xin chào."),
      card("How do you say thank you?", "Cảm ơn."),
      card("How do you say yes, in the north?", "Vâng."),
      card("How do you say water?", "Nước."),
      card("How do you say I don’t understand?", "Tôi không hiểu."),
      card("How do you ask how much this costs?", "Cái này bao nhiêu tiền?"),
    ],
  },
  {
    slug: "turkish",
    fieldLabel: "Turkish",
    headline: "How to learn Turkish",
    description:
      "How to learn Turkish: whole phrases with the ending attached, a sample deck, and a spaced review schedule.",
    lede: "Turkish adds meaning at the end of a word. Learn the phrase you will say, ending included. The vowel in that ending has to match the word.",
    testsHeading: "Where to start",
    tests:
      "Hello, thank you, please, and the questions that get you through a day. One suffix you use, such as nerede, is worth more than a suffix chart.",
    cardRule:
      "One full phrase per card, with the suffix already attached. A grammar table is not an answer.",
    schedule: schedule(
      "Start with the sample phrases. When you add a word, add it inside the sentence you needed.",
    ),
    cards: [
      card(
        "Where does Turkish add meaning?",
        "At the end of the word.",
      ),
      card(
        "What has to match between a word and its ending?",
        "The vowel.",
      ),
      card("How do you say hello?", "Merhaba."),
      card("How do you say thank you?", "Teşekkürler."),
      card("How do you say water?", "Su."),
      card("How do you say I don’t understand?", "Anlamıyorum."),
      card("How do you ask where the bathroom is?", "Tuvalet nerede?"),
      card("How do you ask how much this costs?", "Bu ne kadar?"),
    ],
  },
  {
    slug: "dutch",
    fieldLabel: "Dutch",
    headline: "How to learn Dutch",
    description:
      "How to learn Dutch: the sounds the spelling suggests and then withholds, a sample deck, and a spaced review schedule.",
    lede: "Dutch looks like English and then does not sound like it. Learn greetings and shop questions, and say every card. A cognate you only read will not get you through a sentence.",
    testsHeading: "Where to start",
    tests:
      "Hallo, goedemorgen, dank je, and the g and ui sounds the first time you miss them. Formal and informal please are two cards.",
    cardRule:
      "One phrase per card, said aloud. A cognate still gets a card when the pronunciation is not the English one.",
    schedule: schedule(
      "Say the sample deck out loud. Add a word when the sound is what stalled you.",
    ),
    cards: [
      card(
        "Why say a Dutch cognate out loud?",
        "It often does not sound like the English word it resembles.",
      ),
      card("How do you say hello?", "Hallo."),
      card("How do you say good morning?", "Goedemorgen."),
      card("How do you say thank you?", "Dank je."),
      card(
        "How do you say please, informally?",
        "Alsjeblieft. Alstublieft is the formal one.",
      ),
      card("How do you say water?", "Water."),
      card("How do you say I don’t understand?", "Ik begrijp het niet."),
      card("How do you ask where the bathroom is?", "Waar is het toilet?"),
    ],
  },
  {
    slug: "swedish",
    fieldLabel: "Swedish",
    headline: "How to learn Swedish",
    description:
      "How to learn Swedish: the pitch of the word, en or ett on the noun, a sample deck, and a spaced review schedule.",
    lede: "Swedish pitches some words like a small melody, and that melody is part of the word. Learn hej and tack, and put en or ett on the noun the first time you write it.",
    testsHeading: "Where to start",
    tests:
      "Greetings and the questions you need in a café or a station. A flat reading is not the same as saying the word.",
    cardRule:
      "One phrase per card. A noun card includes en or ett. Say the pitch, not just the consonants.",
    schedule: schedule(
      "Start with the sample phrases. Each new noun enters with en or ett already on it.",
    ),
    cards: [
      card("What is part of a Swedish word besides the consonants?", "The pitch."),
      card("What goes on a noun card?", "En or ett, with the noun."),
      card("How do you say hello?", "Hej."),
      card("How do you say thank you?", "Tack."),
      card("How do you say water, with its article?", "Vatten, which takes ett."),
      card("How do you say I don’t understand?", "Jag förstår inte."),
      card("How do you ask where the bathroom is?", "Var är toaletten?"),
      card("How do you ask how much it costs?", "Hur mycket kostar det?"),
    ],
  },
  {
    slug: "polish",
    fieldLabel: "Polish",
    headline: "How to learn Polish",
    description:
      "How to learn Polish: the consonant clusters, then full phrases, a sample deck, and a spaced review schedule.",
    lede: "Polish spelling is reliable once cz, sz, and ś are one sound each. Learn those, then fixed phrases. Cases matter, so the first deck is sentences you will say, not bare dictionary forms.",
    testsHeading: "Where to start",
    tests:
      "Dzień dobry, dziękuję, proszę, and the questions that get you through a shop. A cluster like szcz stays inside the word.",
    cardRule:
      "One full phrase per card. Do not split a consonant cluster into separate cards.",
    schedule: schedule(
      "Say the sample phrases until the clusters are one sound. Then add a sentence already in the form you will say.",
    ),
    cards: [
      card("What do cz, sz, and ś need before the phrases?", "To be one sound each."),
      card(
        "Why start with full phrases?",
        "Cases change the word, so a bare dictionary form is not what you will say.",
      ),
      card("How do you say hello, in the daytime?", "Dzień dobry."),
      card("How do you say thank you?", "Dziękuję."),
      card("How do you say please, or you’re welcome?", "Proszę."),
      card("How do you say water?", "Woda."),
      card("How do you say I don’t understand?", "Nie rozumiem."),
      card("How do you ask how much it costs?", "Ile to kosztuje?"),
    ],
  },
  {
    slug: "thai",
    fieldLabel: "Thai",
    headline: "How to learn Thai",
    description:
      "How to learn Thai: tones and the polite particle, a sample deck, and a spaced review schedule.",
    lede: "Thai tones change the word, and a polite particle closes the sentence. Men say khrap. Women say kha. Learn the sound first. The script can join once the tone is steady.",
    testsHeading: "Where to start",
    tests:
      "Hello, thank you, yes, water, and how much, each with its tone and its particle. Two words that differ only by tone are two cards.",
    cardRule:
      "One phrase per card, with the tone marks and khrap or kha. Use the particle that matches the person speaking.",
    schedule: schedule(
      "Say the particle every time. Add the script after the tone is still right the next day.",
    ),
    cards: [
      card(
        "What closes a polite sentence?",
        "ครับ (khrap) if you are a man. ค่ะ (kha) if you are a woman.",
      ),
      card("What comes before the script?", "The sound and the tone."),
      card(
        "How do you say hello?",
        "สวัสดีครับ (sawatdee khrap) if you are a man. สวัสดีค่ะ (sawatdee kha) if you are a woman.",
      ),
      card(
        "How do you say thank you?",
        "ขอบคุณครับ (khop khun khrap) if you are a man. ขอบคุณค่ะ (khop khun kha) if you are a woman.",
      ),
      card("How do you say water?", "น้ำ (nam)."),
      card("How do you say I don’t understand?", "ไม่เข้าใจ (mai khao jai)."),
      card("How do you ask how much it costs?", "เท่าไหร่ (tao rai?)"),
      card(
        "When does the script join the card?",
        "After the tone is steady.",
      ),
    ],
  },
  {
    slug: "indonesian",
    fieldLabel: "Indonesian",
    headline: "How to learn Indonesian",
    description:
      "How to learn Indonesian: everyday phrases, a sample deck, and a spaced review schedule.",
    lede: "Indonesian does not change words for gender or for a stack of verb endings. Learn the phrases you will ask on the street, and say them until they come out without translating.",
    testsHeading: "Where to start",
    tests:
      "Greetings, thank you, where, how much, and I don’t understand. Formal and informal you, and the affixes, can wait until these are automatic.",
    cardRule:
      "One phrase per card. The spelling is close to the sound, and you still say it.",
    schedule: schedule(
      "Start with the sample phrases. Add a word the first time you needed it and did not have it.",
    ),
    cards: [
      card(
        "What does the first deck skip?",
        "Gender endings and a pile of verb endings. Indonesian does not use them that way.",
      ),
      card("How do you say hello?", "Halo."),
      card("How do you say good morning?", "Selamat pagi."),
      card("How do you say thank you?", "Terima kasih."),
      card("How do you say water?", "Air."),
      card("How do you say I don’t understand?", "Saya tidak mengerti."),
      card("How do you ask where the bathroom is?", "Di mana toiletnya?"),
      card("How do you ask how much it costs?", "Berapa harganya?"),
    ],
  },
  {
    slug: "tagalog",
    fieldLabel: "Tagalog",
    headline: "How to learn Tagalog",
    description:
      "How to learn Tagalog: the phrases people actually say, a sample deck, and a spaced review schedule.",
    lede: "Tagalog is the basis of Filipino. Learn the whole question you will ask. Translating word by word from English produces a sentence nobody says. Focus markers come later.",
    testsHeading: "Where to start",
    tests:
      "Kumusta, salamat, and the questions that get you through a day: where is the bathroom, how much, I don’t understand.",
    cardRule:
      "One full phrase per card, the way it is said. Do not paste Tagalog words into English word order.",
    schedule: schedule(
      "Say the sample deck out loud. Add a sentence you heard twice and could not answer.",
    ),
    cards: [
      card("What language is Tagalog the basis of?", "Filipino."),
      card(
        "What comes before focus markers?",
        "The full questions you will actually ask.",
      ),
      card("How do you say hello, or how are you?", "Kumusta."),
      card("How do you say thank you?", "Salamat."),
      card("How do you say yes?", "Oo."),
      card("How do you say water?", "Tubig."),
      card("How do you say I don’t understand?", "Hindi ko maintindihan."),
      card("How do you ask how much this costs?", "Magkano ito?"),
    ],
  },
  {
    slug: "ukrainian",
    fieldLabel: "Ukrainian",
    headline: "How to learn Ukrainian",
    description:
      "How to learn Ukrainian: the letters it does not share with Russian, then polite phrases, a sample deck, and a spaced review schedule.",
    lede: "Ukrainian is not Russian with a different accent. The letters overlap and the words do not. Learn the Ukrainian phrase on its own card.",
    testsHeading: "Where to start",
    tests:
      "The letters ї, є, і, and ґ, then hello, thank you, and the questions you need in a shop.",
    cardRule:
      "One Ukrainian phrase per card, in Cyrillic, with the pronunciation on the answer. A Russian substitute is a miss.",
    schedule: schedule(
      "Read the letters that differ first. Then say the sample phrases until they stop sliding into Russian.",
    ),
    cards: [
      card(
        "Which letters are worth their own attention?",
        "ї, є, і, and ґ.",
      ),
      card(
        "Is a Russian lookalike the same word?",
        "No. It does not fill a Ukrainian card.",
      ),
      card("How do you say hello, in the daytime?", "Добрий день (dobryy den)."),
      card("How do you say thank you?", "Дякую (dyakuyu)."),
      card("How do you say please?", "Будь ласка (bud laska)."),
      card("How do you say water?", "Вода (voda)."),
      card("How do you say I don’t understand?", "Я не розумію (ya ne rozumiyu)."),
      card("How do you ask how much it costs?", "Скільки це коштує? (skilky tse koshtuye?)"),
    ],
  },
  {
    slug: "norwegian",
    fieldLabel: "Norwegian",
    headline: "How to learn Norwegian",
    description:
      "How to learn Norwegian in Bokmål: greetings, en or et on the noun, a sample deck, and a spaced review schedule.",
    lede: "Norway has two written standards. Start with Bokmål, the one most learners meet first. Nynorsk can be a second deck. The spoken pitch still belongs on the card.",
    testsHeading: "Where to start",
    tests:
      "Hei, takk, and the questions you ask in a café or a station. En and et go on the noun.",
    cardRule:
      "One Bokmål phrase per card. A noun includes en or et. Say it, so the pitch is part of the review.",
    schedule: schedule(
      "Start with the sample phrases in Bokmål. Each new noun enters with en or et already chosen.",
    ),
    cards: [
      card("Which written standard comes first?", "Bokmål."),
      card("What can be a second deck?", "Nynorsk."),
      card("How do you say hello?", "Hei."),
      card("How do you say thank you?", "Takk."),
      card("How do you say water, with its article?", "Vann, which takes et."),
      card("How do you say I don’t understand?", "Jeg forstår ikke."),
      card("How do you ask where the bathroom is?", "Hvor er toalettet?"),
      card("How do you ask how much it costs?", "Hvor mye koster det?"),
    ],
  },
];
