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
  {
    slug: "russian",
    fieldLabel: "Russian",
    headline: "How to learn Russian fast",
    description:
      "How to learn Russian fast: polite phrases in Cyrillic, a sample deck, and a spaced review schedule.",
    lede: "Russian moves faster once the letters are familiar. Learn a short Cyrillic deck, then the polite phrases you will actually say. Slang can wait.",
    testsHeading: "What to memorize first",
    tests:
      "The alphabet, then hello, thank you, and the questions that buy you a minute: I don’t understand, where is the bathroom, how much. Use the formal hello with strangers.",
    cardRule:
      "One phrase per card, in Cyrillic, with the pronunciation on the answer until you can read it. A handwritten letter you mix up gets its own card.",
    schedule: schedule(
      "Learn the letters first. Then say the sample phrases until the stress falls in the right place.",
    ),
    cards: [
      card("How do you say hello, formally?", "Здравствуйте (zdravstvuyte)."),
      card("How do you say thank you?", "Спасибо (spasibo)."),
      card("How do you say please, or you’re welcome?", "Пожалуйста (pozhaluysta)."),
      card("How do you say good morning?", "Доброе утро (dobroye utro)."),
      card("How do you say water?", "Вода (voda)."),
      card("How do you say I don’t understand?", "Я не понимаю (ya ne ponimayu)."),
      card("How do you ask where the bathroom is?", "Где туалет? (gde tualet?)"),
      card("How do you ask how much it costs?", "Сколько это стоит? (skolko eto stoit?)"),
    ],
  },
  {
    slug: "hindi",
    fieldLabel: "Hindi",
    headline: "How to learn Hindi fast",
    description:
      "How to learn Hindi fast: everyday phrases in Devanagari, a sample deck, and a spaced review schedule.",
    lede: "Hindi is spoken as much as it is read. Start with the phrases you will say this week, and keep the script on the card so the letters are not a separate project.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, yes and no, water, and the questions that get you through a market or a station. The polite forms are enough. Film slang is a later deck.",
    cardRule:
      "One phrase per card, in Devanagari, with a pronunciation guide on the answer. Say it out loud. A word you only recognize in Latin letters is not learned yet.",
    schedule: schedule(
      "Say the sample deck daily, then add a word the first time you have to point at it.",
    ),
    cards: [
      card("How do you say hello?", "नमस्ते (namaste)."),
      card("How do you say thank you?", "धन्यवाद (dhanyavaad)."),
      card("How do you say please?", "कृपया (kripaya)."),
      card("How do you say yes?", "हाँ (haan)."),
      card("How do you say water?", "पानी (paani)."),
      card("How do you say I don’t understand?", "मुझे समझ नहीं आया (mujhe samajh nahin aaya)."),
      card("How do you ask where the bathroom is?", "बाथरूम कहाँ है? (bathroom kahaan hai?)"),
      card("How do you ask how much this costs?", "यह कितने का है? (yah kitne ka hai?)"),
    ],
  },
  {
    slug: "latin",
    fieldLabel: "Latin",
    headline: "How to learn Latin fast",
    description:
      "How to learn Latin fast: the words and short sentences to put on cards first, a sample deck, and a spaced review schedule.",
    lede: "Latin is for reading, not for ordering coffee. The fast path is the words that show up in every textbook sentence, said aloud so the endings start to stick.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, the question words, and a small set of nouns you will meet immediately: water, this, where. Full declension tables come after you can produce one form without looking.",
    cardRule:
      "One word or one short sentence per card. Put the dictionary form on a noun card. A verb card is one form, such as intellego, not the whole conjugation.",
    schedule: schedule(
      "Start with the sample sentences. Add a new word only when it blocks you in the line you are reading.",
    ),
    cards: [
      card("How do you say hello?", "Salve."),
      card("How do you say goodbye?", "Vale."),
      card("How do you say thank you?", "Gratias tibi ago."),
      card("How do you say please?", "Quaeso."),
      card("How do you say water?", "Aqua."),
      card("How do you say I don’t understand?", "Non intellego."),
      card("How do you ask what this is?", "Quid est hoc?"),
      card("How do you say yes?", "Ita."),
    ],
  },
  {
    slug: "greek",
    fieldLabel: "Greek",
    headline: "How to learn Greek fast",
    description:
      "How to learn modern Greek fast: the phrases to say first, a sample deck in Greek script, and a spaced review schedule.",
    lede: "This deck is modern Greek, the language spoken in Greece today. Ancient Greek is a different course. Learn the letters, then the phrases you need in a shop or on the street.",
    testsHeading: "What to memorize first",
    tests:
      "The alphabet, good morning, thank you, and the questions that unblock a conversation. One accent mark in the wrong place can be a different word, so the accent stays on the card.",
    cardRule:
      "One phrase per card, in Greek letters, with a pronunciation guide until reading is easy. Do not mix ancient and modern forms on the same card.",
    schedule: schedule(
      "Read every card in Greek letters. Add a new word after the sample phrases still come out with the accent in the right place.",
    ),
    cards: [
      card("How do you say good morning?", "Καλημέρα (kalimera)."),
      card("How do you say hello, to one person?", "Γεια σου (ya sou)."),
      card("How do you say thank you?", "Ευχαριστώ (efharisto)."),
      card("How do you say please, or you’re welcome?", "Παρακαλώ (parakalo)."),
      card("How do you say water?", "Νερό (nero)."),
      card("How do you say I don’t understand?", "Δεν καταλαβαίνω (den katalaveno)."),
      card("How do you ask where the bathroom is?", "Πού είναι η τουαλέτα; (pou einai i toualeta?)"),
      card("How do you ask how much it costs?", "Πόσο κάνει; (poso kani?)"),
    ],
  },
  {
    slug: "hebrew",
    fieldLabel: "Hebrew",
    headline: "How to learn Hebrew fast",
    description:
      "How to learn Hebrew fast: a few spoken phrases, the letters on the card, and a spaced review schedule.",
    lede: "Spoken Hebrew drops most vowels from the writing. Start with phrases you can say, and read the letters right to left every time you review.",
    testsHeading: "What to memorize first",
    tests:
      "Hello, thank you, yes and no, water, and where the bathroom is. Some words change with the speaker’s gender. Put the form you will actually say on the card.",
    cardRule:
      "One phrase per card, in Hebrew script, right to left, with a transliteration on the answer until the letters are reliable. Vowels you must hear and cannot see still belong in the pronunciation.",
    schedule: schedule(
      "Read the Hebrew on every review. Keep the transliteration only while the letters are still slow.",
    ),
    cards: [
      card("How do you say hello?", "שלום (shalom)."),
      card("How do you say thank you?", "תודה (toda)."),
      card("How do you say please, or you’re welcome?", "בבקשה (bevakasha)."),
      card("How do you say yes?", "כן (ken)."),
      card("How do you say water?", "מים (mayim)."),
      card(
        "How do you say I don’t understand?",
        "אני לא מבין (ani lo mevin) if you are a man. אני לא מבינה (ani lo mevina) if you are a woman.",
      ),
      card("How do you ask where the bathroom is?", "איפה השירותים? (eifo ha-sherutim?)"),
      card("How do you ask how much it costs?", "כמה זה עולה? (kama ze ole?)"),
    ],
  },
  {
    slug: "vietnamese",
    fieldLabel: "Vietnamese",
    headline: "How to learn Vietnamese fast",
    description:
      "How to learn Vietnamese fast: tones on the same card as the word, a sample deck, and a spaced review schedule.",
    lede: "The tone is the word. A card that drops the accent marks is a different Vietnamese word, or not a word at all. Say the mark every time.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, thank you, and the questions you need in a shop. Northern and southern accents differ. Pick one, write it on the card, and do not mix them in the first deck.",
    cardRule:
      "One word or one short phrase. Keep every tone mark. If two phrases differ only by tone, they are two cards.",
    schedule: schedule(
      "Say the tone out loud on every review. Add a new word only when yesterday’s tones are still right.",
    ),
    cards: [
      card("How do you say hello?", "Xin chào."),
      card("How do you say thank you?", "Cảm ơn."),
      card("How do you say please?", "Làm ơn."),
      card("How do you say yes, in the north?", "Vâng."),
      card("How do you say water?", "Nước."),
      card("How do you say I don’t understand?", "Tôi không hiểu."),
      card("How do you ask where the bathroom is?", "Nhà vệ sinh ở đâu?"),
      card("How do you ask how much this costs?", "Cái này bao nhiêu tiền?"),
    ],
  },
  {
    slug: "turkish",
    fieldLabel: "Turkish",
    headline: "How to learn Turkish fast",
    description:
      "How to learn Turkish fast: everyday phrases, a sample deck, and a spaced review schedule.",
    lede: "Turkish adds meaning to the end of a word. Learn the whole phrase you will say, not a pile of bare stems. The vowel in the ending has to match the word.",
    testsHeading: "What to memorize first",
    tests:
      "Hello, thank you, please, and the questions that get you through a day. One suffix you actually use, such as the question nerede, is worth more than a suffix chart.",
    cardRule:
      "One full phrase per card, with the suffix already attached. Do not put a grammar table on the answer. If you cannot say it as one piece, it is not ready.",
    schedule: schedule(
      "Start with the sample phrases. When you add a word, add it inside the sentence you needed.",
    ),
    cards: [
      card("How do you say hello?", "Merhaba."),
      card("How do you say thank you?", "Teşekkürler."),
      card("How do you say please?", "Lütfen."),
      card("How do you say good morning?", "Günaydın."),
      card("How do you say water?", "Su."),
      card("How do you say I don’t understand?", "Anlamıyorum."),
      card("How do you ask where the bathroom is?", "Tuvalet nerede?"),
      card("How do you ask how much this costs?", "Bu ne kadar?"),
    ],
  },
  {
    slug: "dutch",
    fieldLabel: "Dutch",
    headline: "How to learn Dutch fast",
    description:
      "How to learn Dutch fast: the phrases to say first, a sample deck, and a spaced review schedule.",
    lede: "Dutch looks like English and then does not sound like it. Say every card. Reading a cognate silently will not get you through a sentence.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, please and thank you, and the questions you ask in a shop. The g and the ui sounds are worth a card of their own the first time you miss them.",
    cardRule:
      "One phrase per card, said aloud. A cognate still gets a card if the pronunciation is not the English one.",
    schedule: schedule(
      "Say the sample deck out loud. Add a word when a conversation stalls on the sound, not only the meaning.",
    ),
    cards: [
      card("How do you say hello?", "Hallo."),
      card("How do you say good morning?", "Goedemorgen."),
      card("How do you say thank you?", "Dank je."),
      card("How do you say please, informally?", "Alsjeblieft. Alstublieft is the formal one."),
      card("How do you say water?", "Water."),
      card("How do you say I don’t understand?", "Ik begrijp het niet."),
      card("How do you ask where the bathroom is?", "Waar is het toilet?"),
      card("How do you ask how much this costs?", "Hoeveel kost dit?"),
    ],
  },
  {
    slug: "swedish",
    fieldLabel: "Swedish",
    headline: "How to learn Swedish fast",
    description:
      "How to learn Swedish fast: everyday phrases, a sample deck, and a spaced review schedule.",
    lede: "Swedish pitches some words like a little song. The melody is part of the word. Say the card. A flat reading will sound like a different accent, or a different word.",
    testsHeading: "What to memorize first",
    tests:
      "Hej, tack, and the questions you need in a café or a station. En and ett, the two genders, go on the noun the first time you write it.",
    cardRule:
      "One phrase per card. A noun card includes en or ett. Say the pitch, not just the consonants.",
    schedule: schedule(
      "Start with the sample phrases. Each new noun enters the deck with en or ett already on it.",
    ),
    cards: [
      card("How do you say hello?", "Hej."),
      card("How do you say thank you?", "Tack."),
      card("How do you say please?", "Snälla."),
      card("How do you say good morning?", "God morgon."),
      card("How do you say water, with its article?", "Vatten, which takes ett."),
      card("How do you say I don’t understand?", "Jag förstår inte."),
      card("How do you ask where the bathroom is?", "Var är toaletten?"),
      card("How do you ask how much it costs?", "Hur mycket kostar det?"),
    ],
  },
  {
    slug: "polish",
    fieldLabel: "Polish",
    headline: "How to learn Polish fast",
    description:
      "How to learn Polish fast: the phrases to say first, a sample deck, and a spaced review schedule.",
    lede: "Polish spelling is reliable once you know what the clusters sound like. Learn the sounds of cz, sz, and ś, then put whole phrases on cards and say them.",
    testsHeading: "What to memorize first",
    tests:
      "Dzień dobry, dziękuję, proszę, and the questions that get you through a shop. Cases matter, so the first deck is fixed phrases, not bare dictionary forms you try to assemble.",
    cardRule:
      "One full phrase per card. Do not split a cluster like szcz into separate cards. If you miss the sound, the whole word comes back sooner.",
    schedule: schedule(
      "Say the sample phrases until the clusters are one sound. Then add a sentence you needed, already in the form you will say.",
    ),
    cards: [
      card("How do you say hello, in the daytime?", "Dzień dobry."),
      card("How do you say thank you?", "Dziękuję."),
      card("How do you say please, or you’re welcome?", "Proszę."),
      card("How do you say hi, with a friend?", "Cześć."),
      card("How do you say water?", "Woda."),
      card("How do you say I don’t understand?", "Nie rozumiem."),
      card("How do you ask where the bathroom is?", "Gdzie jest toaleta?"),
      card("How do you ask how much it costs?", "Ile to kosztuje?"),
    ],
  },
  {
    slug: "thai",
    fieldLabel: "Thai",
    headline: "How to learn Thai fast",
    description:
      "How to learn Thai fast: tones and the polite particle, a sample deck, and a spaced review schedule.",
    lede: "Thai tones change the word, and a polite particle closes the sentence. Men say khrap. Women say kha. Leave it off and the phrase sounds unfinished.",
    testsHeading: "What to memorize first",
    tests:
      "Hello, thank you, yes, water, and how much. Put the tone and the polite particle on the card from the start. The script can join the card once the sound is steady.",
    cardRule:
      "One phrase per card, with the tone marks and khrap or kha. Two words that differ only by tone are two cards. Use the particle that matches the person speaking.",
    schedule: schedule(
      "Say the sample deck with the particle every time. Add a new word only when the tone is still right the next day.",
    ),
    cards: [
      card(
        "How do you say hello?",
        "สวัสดีครับ (sawatdee khrap) if you are a man. สวัสดีค่ะ (sawatdee kha) if you are a woman.",
      ),
      card(
        "How do you say thank you?",
        "ขอบคุณครับ (khop khun khrap) if you are a man. ขอบคุณค่ะ (khop khun kha) if you are a woman.",
      ),
      card("How do you say yes?", "ใช่ (chai)."),
      card("How do you say water?", "น้ำ (nam)."),
      card("How do you say I don’t understand?", "ไม่เข้าใจ (mai khao jai)."),
      card("How do you ask where the bathroom is?", "ห้องน้ำอยู่ที่ไหน (hong nam yuu tee nai?)"),
      card("How do you ask how much it costs?", "เท่าไหร่ (tao rai?)"),
      card("How do you say goodbye?", "ลาก่อน (la gon)."),
    ],
  },
  {
    slug: "indonesian",
    fieldLabel: "Indonesian",
    headline: "How to learn Indonesian fast",
    description:
      "How to learn Indonesian fast: everyday phrases, a sample deck, and a spaced review schedule.",
    lede: "Indonesian does not change words for gender or for a pile of verb endings. The fast part is the phrases themselves, said often enough that they come out without translating.",
    testsHeading: "What to memorize first",
    tests:
      "Greetings, thank you, and the questions you ask on the street: where, how much, I don’t understand. Formal and informal you can wait until these are automatic.",
    cardRule:
      "One phrase per card. Indonesian spelling is close to the sound, so say it anyway. A word you have only read is not in the deck yet.",
    schedule: schedule(
      "Start with the sample phrases. Add a word the first time you needed it and did not have it.",
    ),
    cards: [
      card("How do you say hello?", "Halo."),
      card("How do you say good morning?", "Selamat pagi."),
      card("How do you say thank you?", "Terima kasih."),
      card("How do you say please, when asking for help?", "Tolong."),
      card("How do you say water?", "Air."),
      card("How do you say I don’t understand?", "Saya tidak mengerti."),
      card("How do you ask where the bathroom is?", "Di mana toiletnya?"),
      card("How do you ask how much it costs?", "Berapa harganya?"),
    ],
  },
  {
    slug: "tagalog",
    fieldLabel: "Tagalog",
    headline: "How to learn Tagalog fast",
    description:
      "How to learn Tagalog fast: everyday phrases, a sample deck, and a spaced review schedule.",
    lede: "Tagalog, the basis of Filipino, mixes in English words and still has its own grammar. Learn the whole question you will ask. Translating word by word from English produces a sentence nobody says.",
    testsHeading: "What to memorize first",
    tests:
      "Kumusta, salamat, and the questions that get you through a day in Manila: where is the bathroom, how much, I don’t understand. Focus markers can wait until these phrases are easy.",
    cardRule:
      "One full phrase per card, the way it is actually said. Do not build a card out of an English word order with Tagalog vocabulary pasted on.",
    schedule: schedule(
      "Say the sample deck out loud. Add a sentence you heard twice and could not answer.",
    ),
    cards: [
      card("How do you say hello, or how are you?", "Kumusta."),
      card("How do you say thank you?", "Salamat."),
      card("How do you say please?", "Paki, in front of the request."),
      card("How do you say yes?", "Oo."),
      card("How do you say water?", "Tubig."),
      card("How do you say I don’t understand?", "Hindi ko maintindihan."),
      card("How do you ask where the bathroom is?", "Nasaan ang banyo?"),
      card("How do you ask how much this costs?", "Magkano ito?"),
    ],
  },
  {
    slug: "ukrainian",
    fieldLabel: "Ukrainian",
    headline: "How to learn Ukrainian fast",
    description:
      "How to learn Ukrainian fast: polite phrases in Cyrillic, a sample deck, and a spaced review schedule.",
    lede: "Ukrainian is not Russian with a different accent. The letters overlap and the words do not. Learn the Ukrainian phrase on its own card, and do not fill the deck with Russian lookalikes.",
    testsHeading: "What to memorize first",
    tests:
      "The letters that Ukrainian does not share with Russian, especially ї, є, і, and ґ, then hello, thank you, and the questions you need in a shop.",
    cardRule:
      "One Ukrainian phrase per card, in Cyrillic, with the pronunciation on the answer. If a Russian word is trying to substitute, that is a miss.",
    schedule: schedule(
      "Read the letters that differ first. Then say the sample phrases until they stop sliding into Russian.",
    ),
    cards: [
      card("How do you say hello, in the daytime?", "Добрий день (dobryy den)."),
      card("How do you say good morning?", "Доброго ранку (dobroho ranku)."),
      card("How do you say thank you?", "Дякую (dyakuyu)."),
      card("How do you say please?", "Будь ласка (bud laska)."),
      card("How do you say water?", "Вода (voda)."),
      card("How do you say I don’t understand?", "Я не розумію (ya ne rozumiyu)."),
      card("How do you ask where the bathroom is?", "Де туалет? (de tualet?)"),
      card("How do you ask how much it costs?", "Скільки це коштує? (skilky tse koshtuye?)"),
    ],
  },
  {
    slug: "norwegian",
    fieldLabel: "Norwegian",
    headline: "How to learn Norwegian fast",
    description:
      "How to learn Norwegian fast: Bokmål phrases, a sample deck, and a spaced review schedule.",
    lede: "Norway has two written standards. This deck is Bokmål, the one most learners meet first. Nynorsk can be a second deck. The spoken melody still has to be on the card.",
    testsHeading: "What to memorize first",
    tests:
      "Hei, takk, and the questions you ask in a café or a station. En and et go on the noun. Pitch, the little rise and fall, is part of saying it right.",
    cardRule:
      "One Bokmål phrase per card. A noun includes en or et. Say it. A silent reading will not catch the pitch.",
    schedule: schedule(
      "Start with the sample phrases in Bokmål. Each new noun enters with en or et already chosen.",
    ),
    cards: [
      card("How do you say hello?", "Hei."),
      card("How do you say thank you?", "Takk."),
      card("How do you say please?", "Vær så snill."),
      card("How do you say good morning?", "God morgen."),
      card("How do you say water, with its article?", "Vann, which takes et."),
      card("How do you say I don’t understand?", "Jeg forstår ikke."),
      card("How do you ask where the bathroom is?", "Hvor er toalettet?"),
      card("How do you ask how much it costs?", "Hvor mye koster det?"),
    ],
  },
];

export function languageBySlug(slug) {
  return LANGUAGES.find((language) => language.slug === slug) ?? null;
}
