const schedule = (start) =>
  `${start} A card you know comes back in 1 day, then 2, then 4, then 8. Miss it and it returns sooner. When nothing in the deck is due, stop for the day.`;

const card = (question, answer) => ({ question, answer });

export const COMPUTING = [
  {
    slug: "artificial-intelligence",
    fieldLabel: "Artificial intelligence",
    headline: "What is artificial intelligence",
    description:
      "What is artificial intelligence: software that does a task by finding patterns in examples. A sample deck and a spaced review schedule.",
    lede: "Artificial intelligence is software that carries out a task people usually do by recognizing, choosing, or producing something. A photo label, a translation, a move in a game, a written reply. It is a kind of work, not a single product. People also ask for the definition, or add a question mark, and it is this same idea.",
    testsHeading: "The short answer",
    tests:
      "Most of what people call AI today is machine learning. The program is adjusted on examples until it does the task, instead of following a rule someone wrote for every case. The result of that adjustment is a model. A system built for one kind of task is narrow. A system that could take on unfamiliar tasks the way a person can is still a research aim, not a switch you can flip. The word intelligence names the task. It does not mean the program has a mind.",
    cardRule:
      "One term per card. Model, training, and a product name do not belong in the same answer.",
    schedule: schedule("Start with the task, then machine learning, then the model."),
    cards: [
      card(
        "What is artificial intelligence?",
        "Software that does a task people usually do by recognizing, choosing, or producing something.",
      ),
      card(
        "What is machine learning?",
        "A way to build that software by adjusting it on examples, instead of writing a rule for every case.",
      ),
      card(
        "What is a model?",
        "The result of that adjustment. It takes a new input and produces an output.",
      ),
      card(
        "What is training?",
        "Showing the model examples so its internal numbers get better at the task.",
      ),
      card(
        "What is inference?",
        "Using a trained model on something new, such as a question it has not seen.",
      ),
      card(
        "What is narrow AI?",
        "A system built for one kind of task, such as translating or labeling photos.",
      ),
      card(
        "What is artificial general intelligence?",
        "A research aim: a system that could handle unfamiliar tasks the way a person can. It is not a product you can turn on.",
      ),
      card(
        "Does “intelligent” mean the program understands?",
        "No. The word describes the task the software performs.",
      ),
    ],
  },
  {
    slug: "api",
    fieldLabel: "API",
    headline: "What is an API",
    description:
      "What is an API: the requests one program may make of another, and the answers that come back. A sample deck and a spaced review schedule.",
    lede: "An API is an application programming interface. It is the list of requests one program is allowed to make of another, and the shape of the answers that come back. You use the list. You do not open the other program and rummage inside it. People also ask what an API is, with a question mark, and it is this same contract.",
    testsHeading: "The short answer",
    tests:
      "On the web, a request is usually an HTTP call to a URL. GET asks for something. POST sends something to be created or handled. The answer is often JSON, a text format for structured data. An API key tells the service who is calling. The API is the contract. The code behind it can change, as long as the requests and the answers stay the same.",
    cardRule:
      "One piece of the contract per card. The request, the answer, and the key stay separate.",
    schedule: schedule("Start with the contract, then GET and POST."),
    cards: [
      card(
        "What is an API?",
        "The set of requests one program may make of another, and the shape of the answers.",
      ),
      card(
        "What do the letters stand for?",
        "Application programming interface.",
      ),
      card(
        "Why call an API instead of reading the other program’s files?",
        "The API is the allowed door. The files and the inner code can change without notice.",
      ),
      card(
        "What is a typical web request?",
        "An HTTP call to a URL.",
      ),
      card(
        "What is GET for?",
        "Asking for something, such as a user’s profile.",
      ),
      card(
        "What is POST for?",
        "Sending something to be created or handled, such as a new order.",
      ),
      card(
        "What is JSON?",
        "A text format programs use to send structured data back and forth.",
      ),
      card(
        "What is an API key?",
        "A secret the caller sends so the service knows which account is making the request.",
      ),
    ],
  },
  {
    slug: "artificial-intelligence-examples",
    fieldLabel: "Examples",
    headline: "What is artificial intelligence with examples",
    description:
      "What is artificial intelligence with examples: photo labels, translation, spam, speech, and a drafted reply. A sample deck and a spaced review schedule.",
    lede: "Artificial intelligence, in the examples people meet, is a program that learned a task from examples and then does that task on something new. The example is the job, not the brand name on the box.",
    testsHeading: "The short answer",
    tests:
      "A photo tool that names the objects in a picture, a translator, a spam filter, a transcript of speech, a game that picks a move, and a draft of an email reply are the same kind of system. Each one was adjusted on past cases. A calculator that only applies the rules of arithmetic is not one of these. It follows steps a person wrote for every case.",
    cardRule:
      "One example per card, stated as the task. Leave the product name off.",
    schedule: schedule("Start with the photo, the translation, and the spam filter."),
    cards: [
      card(
        "What is an example of artificial intelligence?",
        "A program that names the objects in a photo it has not seen before.",
      ),
      card(
        "What is a translation example?",
        "A program that turns a sentence into another language after training on paired sentences.",
      ),
      card(
        "What is a spam example?",
        "A filter that marks a new message as junk because it resembles messages people already marked as junk.",
      ),
      card(
        "What is a speech example?",
        "A program that writes down the words in a recording.",
      ),
      card(
        "What is a game example?",
        "A program that chooses a legal move from the current board.",
      ),
      card(
        "What is a writing example?",
        "A program that drafts a reply from the message you paste in.",
      ),
      card(
        "Is a calculator an example?",
        "No. It applies arithmetic rules. It was not adjusted on examples.",
      ),
      card(
        "What do these examples share?",
        "Each one handles a new case by using patterns from earlier cases.",
      ),
    ],
  },
  {
    slug: "artificial-intelligence-software",
    fieldLabel: "Software",
    headline: "What is artificial intelligence software",
    description:
      "What is artificial intelligence software: a program whose useful behavior comes from a trained model. A sample deck and a spaced review schedule.",
    lede: "Artificial intelligence software is a program you run whose useful behavior comes from a trained model. The model was adjusted on examples. Ordinary software follows rules a person wrote for each case.",
    testsHeading: "The short answer",
    tests:
      "The software is the thing you open. The model is the trained part inside it, or behind it on a server. A photo app that only crops and saves is ordinary software. The same app, once it can name the objects in the picture, has an AI piece. A spreadsheet formula is ordinary software. A box that drafts a paragraph from a sentence you type is AI software. The label on the box is not the test. The test is whether the behavior came from training.",
    cardRule:
      "One contrast per card. The program, the model, and a rule-based tool stay separate.",
    schedule: schedule("Start with the model inside the program."),
    cards: [
      card(
        "What is artificial intelligence software?",
        "A program whose useful behavior comes from a model trained on examples.",
      ),
      card(
        "What is the model in that software?",
        "The trained part. It takes an input and produces an output.",
      ),
      card(
        "Where does the model have to live?",
        "In the program, or on a server the program calls.",
      ),
      card(
        "Is a crop-and-save photo tool AI software?",
        "No. It follows steps a person wrote.",
      ),
      card(
        "When does that photo tool become AI software?",
        "When it names objects, or does another job, because a model was trained to do it.",
      ),
      card(
        "Is a spreadsheet formula AI software?",
        "No. It calculates the rule you typed.",
      ),
      card(
        "Does the word AI on a package decide it?",
        "No. Check whether the behavior came from training.",
      ),
      card(
        "Can ordinary software call AI software?",
        "Yes. It can send a request to a model and show the answer.",
      ),
    ],
  },
  {
    slug: "artificial-general-intelligence",
    fieldLabel: "General intelligence",
    headline: "What is artificial general intelligence",
    description:
      "What is artificial general intelligence: a system that could take on unfamiliar tasks, not one job it was built for. A sample deck and a spaced review schedule.",
    lede: "Artificial general intelligence is the aim of a system that could learn unfamiliar tasks across many kinds of work, the way a person can move from one job to another. It is not the name of a product you can switch on.",
    testsHeading: "The short answer",
    tests:
      "A system built for one kind of task is narrow. Translation, photo labels, and a board game are narrow even when they are very good. General, in this phrase, means the system can take up a new kind of task without being rebuilt for that task. People do not agree on the test that would settle it. What is settled is the contrast: today’s systems are built and trained for particular jobs.",
    cardRule:
      "One contrast per card. Narrow, general, and a product name do not share an answer.",
    schedule: schedule("Start with narrow versus general."),
    cards: [
      card(
        "What is artificial general intelligence?",
        "The aim of a system that could learn unfamiliar tasks across many kinds of work.",
      ),
      card(
        "What does general mean here?",
        "The system is not limited to the one job it was built for.",
      ),
      card(
        "What is narrow AI?",
        "A system built for one kind of task, such as translation or a board game.",
      ),
      card(
        "Is a strong translator general intelligence?",
        "No. Being very good at one job is still narrow.",
      ),
      card(
        "What would count as general?",
        "Taking up a new kind of task without being rebuilt for that task.",
      ),
      card(
        "Is there an agreed test for it?",
        "No. People argue about what demonstration would settle the question.",
      ),
      card(
        "Can you buy it as a setting in a product?",
        "No. The phrase names an aim, not a switch.",
      ),
      card(
        "How do today’s systems fail the phrase?",
        "They are trained for particular jobs, and they get worse outside those jobs.",
      ),
    ],
  },
  {
    slug: "url",
    fieldLabel: "URL",
    headline: "What is a URL",
    description:
      "What is a URL: the address of a page or file on the web, piece by piece. A sample deck and a spaced review schedule.",
    lede: "A URL is a Uniform Resource Locator. It is the address of a resource, usually a page or a file, so a program knows where to ask for it.",
    testsHeading: "The short answer",
    tests:
      "https://example.com/guide?q=rain#start has five pieces. https is the scheme, the rule for the conversation. example.com is the host. /guide is the path. q=rain is the query. #start is the fragment, a place on the page, and it usually stays in the browser. The host is not the whole URL. The blue words you click are the link. The URL is the address behind them.",
    cardRule:
      "One piece per card. Scheme, host, path, query, and fragment do not share an answer.",
    schedule: schedule("Start with the address, then the five pieces."),
    cards: [
      card("What is a URL?", "The address of a resource, so a program knows where to ask for it."),
      card("What do the letters stand for?", "Uniform Resource Locator."),
      card("What is the scheme?", "The rule for the conversation, such as https."),
      card("What is the host?", "The name of the machine, such as example.com."),
      card("What is the path?", "The location on that machine, such as /guide."),
      card("What is the query?", "Extra details after the question mark, such as q=rain."),
      card("What is the fragment?", "A place on the page, after the #. The server usually never sees it."),
      card("Is the link the same thing as the URL?", "No. The link is the thing you click. The URL is the address."),
    ],
  },
  {
    slug: "checksum-error",
    fieldLabel: "Checksum",
    headline: "What is a checksum error",
    description:
      "What is a checksum error: the file or message no longer matches the short check value. A sample deck and a spaced review schedule.",
    lede: "A checksum is a short value computed from a block of data. A checksum error means the value you just computed does not match the value that was saved with the data. The copy changed.",
    testsHeading: "The short answer",
    tests:
      "Whoever published the file also published the checksum. Your computer runs the same calculation on the copy you have. If the two values differ, at least one bit is different. The error does not say which bit, and it does not say why. A cut-off download, a bad disk, and a damaged transfer are ordinary causes. The error is a mismatch. It is not, by itself, a virus. Throw out the damaged copy and get another one.",
    cardRule:
      "One fact per card. The check value, the mismatch, and the cause stay separate.",
    schedule: schedule("Start with what a checksum is, then what the error means."),
    cards: [
      card(
        "What is a checksum?",
        "A short value computed from a block of data.",
      ),
      card(
        "What is a checksum error?",
        "The value computed from your copy does not match the value that was published with the data.",
      ),
      card(
        "What does the mismatch prove?",
        "The copy is not the same as the original. At least one bit differs.",
      ),
      card(
        "Does the error name the damaged byte?",
        "No. It only says the whole check failed.",
      ),
      card(
        "What often causes it?",
        "A download that stopped early, a bad disk, or a transfer that altered the file.",
      ),
      card(
        "Is a checksum error a virus?",
        "No. It is a mismatch. Malware is a separate question.",
      ),
      card(
        "What should you do with the file?",
        "Do not use the damaged copy. Get a fresh one and check it again.",
      ),
      card(
        "Why publish the checksum next to the download?",
        "So anyone can test whether their copy still matches.",
      ),
    ],
  },
  {
    slug: "ssl-certificate-chain",
    fieldLabel: "Certificate chain",
    headline: "What is an SSL certificate chain",
    description:
      "What is an SSL certificate chain: the links from a site’s certificate up to a root the browser already trusts. A sample deck and a spaced review schedule.",
    lede: "An SSL certificate chain is the list of certificates that connects a site’s certificate to a root certificate your device already trusts. The protocol in use is TLS. SSL is the older name people still type.",
    testsHeading: "The short answer",
    tests:
      "A certificate ties a public key to a name, such as a website. Browsers trust a small set of roots, not every certificate on its own. The site sends its own certificate and the intermediate certificates that sign the path up toward a root. If one intermediate is missing, the browser cannot finish the path, and it reports that the certificate is not trusted. A self-signed certificate has no path to a public root. The chain is about who signed whom. It is not the encryption of the page by itself.",
    cardRule:
      "One link in the chain per card. The site certificate, the intermediate, and the root stay separate.",
    schedule: schedule("Start with the site certificate, then the path to the root."),
    cards: [
      card(
        "What is an SSL certificate chain?",
        "The certificates that link a site’s certificate to a root the device already trusts.",
      ),
      card(
        "Why do people say SSL if the protocol is TLS?",
        "SSL is the older name. TLS replaced it. The certificate idea stayed.",
      ),
      card(
        "What does a certificate tie together?",
        "A public key and a name, such as a website.",
      ),
      card(
        "What is the site certificate?",
        "The certificate for the name you asked for. It is the start of the chain.",
      ),
      card(
        "What is an intermediate certificate?",
        "A certificate that signs the next one down, between the site and the root.",
      ),
      card(
        "What is a root certificate?",
        "A certificate the device already trusts. The chain has to reach one of these.",
      ),
      card(
        "What happens if an intermediate is missing?",
        "The browser cannot complete the path, so it treats the site certificate as untrusted.",
      ),
      card(
        "What is a self-signed certificate?",
        "A certificate that signs itself. It has no path to a public root.",
      ),
    ],
  },
  {
    slug: "api-key",
    fieldLabel: "API key",
    headline: "What is an API key",
    description:
      "What is an API key: a secret a program sends so the service knows which account is calling. A sample deck and a spaced review schedule.",
    lede: "An API key is a secret string a program sends with a request so the service can tell which account is calling. It is not the API. The API is the list of requests. The key is the proof of who is making one.",
    testsHeading: "The short answer",
    tests:
      "The service issues the key. Your program puts it in the request, often in a header. Treat it like a password. A key in a public repository, a screenshot, or a chat is a leaked key. Revoke that one and issue another. A key can identify the caller and decide what that caller is allowed to do. It is not the login box a person types into on a website, though the secrecy is the same.",
    cardRule:
      "One fact per card. The key, the API, and a leaked key stay separate.",
    schedule: schedule("Start with what the key proves, then what to do if it leaks."),
    cards: [
      card(
        "What is an API key?",
        "A secret a program sends so the service knows which account is calling.",
      ),
      card(
        "Is the key the same thing as the API?",
        "No. The API is the contract. The key identifies the caller.",
      ),
      card(
        "Who creates the key?",
        "The service that receives the calls. You copy it into your program.",
      ),
      card(
        "Where does the key go in a request?",
        "Often in a header, a labeled line sent with the call.",
      ),
      card(
        "How should you treat a key?",
        "Like a password. Anyone who has it can call the service as you.",
      ),
      card(
        "What counts as leaking a key?",
        "Putting it where strangers can read it: a public repository, a screenshot, a chat.",
      ),
      card(
        "What do you do after a leak?",
        "Revoke that key so it stops working, and issue a new one.",
      ),
      card(
        "Is an API key a person’s website password?",
        "No. A person types a password into a login form. A program sends a key with a request.",
      ),
    ],
  },
  {
    slug: "api-call",
    fieldLabel: "API call",
    headline: "What is an API call",
    description:
      "What is an API call: one request a program sends to an API, and the answer that comes back. A sample deck and a spaced review schedule.",
    lede: "An API call is one request a program sends to an API, together with the answer that comes back. The API is the whole menu of allowed requests. A call is a single order from that menu.",
    testsHeading: "The short answer",
    tests:
      "A call names a URL, a method such as GET or POST, and often headers. A header can carry the API key. POST may also send a body, the data the request is about. The answer has a status code and a body, often JSON. One call is one round trip. Opening one screen can fire many calls.",
    cardRule:
      "One part of the round trip per card. The call, the method, and the answer stay separate.",
    schedule: schedule("Start with one request, then the pieces it carries."),
    cards: [
      card(
        "What is an API call?",
        "One request sent to an API, and the answer that comes back.",
      ),
      card(
        "How is a call different from the API?",
        "The API is the list of allowed requests. A call is one use of that list.",
      ),
      card(
        "What does a call name?",
        "A URL and a method, such as GET or POST.",
      ),
      card(
        "What is a header on a call?",
        "A labeled line sent with the request. The API key often rides in one.",
      ),
      card(
        "What is the body of a call?",
        "Data sent with the request, common on POST.",
      ),
      card(
        "What comes back?",
        "A status code and a body. The body is often JSON.",
      ),
      card(
        "What does status code 200 usually mean?",
        "The call succeeded.",
      ),
      card(
        "Can one screen make many calls?",
        "Yes. Each call is its own round trip.",
      ),
    ],
  },
  {
    slug: "cloud-computing",
    fieldLabel: "Cloud",
    headline: "What are the types of cloud computing services?",
    description:
      "What are the types of cloud computing services: IaaS, PaaS, and SaaS. A sample deck and a spaced review schedule.",
    lede: "Cloud services are typed by how much of the stack you rent. Infrastructure, platform, and software are the three service types. Public, private, and hybrid describe where that service runs, which is a different split.",
    testsHeading: "The short answer",
    tests:
      "IaaS rents machines, storage, and networks. You manage the operating system and the app. PaaS rents a place to run an app. The provider manages the operating system. SaaS rents the finished application. You use it. You do not run the servers. A function service, sometimes called serverless, runs a small piece of code on demand. It sits near PaaS and is not a fourth copy of SaaS. Public cloud is a provider’s shared data centers. Private cloud is infrastructure reserved for one organization. Hybrid uses both.",
    cardRule:
      "One service type per card. Where it runs is a separate card.",
    schedule: schedule("Start with IaaS, PaaS, and SaaS."),
    cards: [
      card("What is IaaS?", "Rented machines, storage, and networks. You still manage the operating system."),
      card("What is PaaS?", "A rented place to run an app. The provider manages the operating system."),
      card("What is SaaS?", "A finished application you use. You do not run its servers."),
      card("What is a serverless function?", "A small piece of code the provider runs when it is called."),
      card("What is public cloud?", "Services in a provider’s data centers, shared as a product."),
      card("What is private cloud?", "Cloud-style infrastructure reserved for one organization."),
      card("What is hybrid cloud?", "A mix of public cloud and private infrastructure."),
      card("Is “public” a service type like SaaS?", "No. Public, private, and hybrid say where it runs. IaaS, PaaS, and SaaS say what you rent."),
    ],
  },
  {
    slug: "software-bugs",
    fieldLabel: "Bugs",
    headline: "What are the types of software bugs",
    description:
      "What are the types of software bugs: syntax, runtime, logic, and integration. A sample deck and a spaced review schedule.",
    lede: "A software bug is a mismatch between what the program does and what it was supposed to do. The types say when that mismatch shows up. Severity, how bad it is, is a separate scale.",
    testsHeading: "The short answer",
    tests:
      "A syntax bug means the program does not parse. The tools reject it before it runs. A runtime bug starts, then fails on a case, such as dividing by zero or reading a missing file. A logic bug runs and returns the wrong answer. An off-by-one error is a logic bug. An integration bug is two parts that each seem fine and fail together. A performance problem can be called a bug when the program is too slow or too hungry for memory to meet its requirement. It is not automatically a logic bug.",
    cardRule:
      "One type per card. Severity does not belong on the type card.",
    schedule: schedule("Start with syntax, runtime, and logic."),
    cards: [
      card("What is a software bug?", "The program does something other than what it was supposed to do."),
      card("What is a syntax bug?", "The code does not parse, so it does not run."),
      card("What is a runtime bug?", "The program starts, then fails on a particular case."),
      card("What is a logic bug?", "The program runs and gives the wrong answer."),
      card("What is an off-by-one error?", "A logic bug where a count or a loop is off by one."),
      card("What is an integration bug?", "Parts that work alone fail when they are connected."),
      card("Is a slow program always a logic bug?", "No. Speed is a performance failure when a speed requirement exists."),
      card("Is severity the same as type?", "No. Severity says how bad the failure is. Type says what kind of failure it is."),
    ],
  },
];

export function computingBySlug(slug) {
  return COMPUTING.find((item) => item.slug === slug) ?? null;
}
