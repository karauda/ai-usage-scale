/**
 * The case corpus: real, published works, classified.
 *
 * Rules for an entry:
 *
 *  1. Real work, real sources. Every factual claim here is checkable against the linked
 *     source. No hypotheticals — the level pages already carry those.
 *  2. Show the walk, not just the number. The value of a case is the reasoning: which
 *     question or edge case decided it, and where honest people might diverge.
 *  3. Classification is ours, from public reporting of how the work was made — it is a
 *     reading, not a ruling, and never a judgment of the work's quality. If the makers
 *     declare a level themselves, their declaration wins and we update.
 *
 * The corpus is also the test bed the roadmap promises: when a case will not classify
 * cleanly, that is a finding about the scale, and it belongs in an issue.
 */

export interface CaseEntry {
  slug: string;
  title: string;
  year: string;
  /** null = the work was published with no disclosure at all — the anti-case. */
  level: number | null;
  surfaces?: Record<string, number>;
  /** What verifiably happened, per the sources. */
  what: string;
  /** The walk through the questions — which one decided it. */
  walk: string;
  /** What the case teaches, where that isn't obvious. */
  lesson?: string;
  sources: Array<{ label: string; url: string }>;
}

export const CASES: CaseEntry[] = [
  {
    slug: 'now-and-then',
    title: '"Now and Then" — The Beatles',
    year: '2023',
    level: 0,
    what: 'The final Beatles song was completed using MAL, a neural network built for Peter Jackson\'s "Get Back", to separate John Lennon\'s voice and piano from a 1977 home demo. Paul McCartney: "nothing has been artificially or synthetically created. It\'s all real and we all play on it."',
    walk: 'Question 1: was any generative AI used? No — source separation is trained machine learning that invents nothing, like autofocus or denoise, and the non-generative edge case keeps it at Level 0. Read separation as processing of their own material instead and it is Level 1; either reading is defensible, and both sit strikingly below the "AI Beatles song" headlines of the time.',
    lesson: 'The binary label called this "made with AI" and made it a controversy. The scale calls it what it was: humans playing on a cleaned-up recording.',
    sources: [
      { label: 'Wikipedia — Now and Then (Beatles song)', url: 'https://en.wikipedia.org/wiki/Now_and_Then_(Beatles_song)' },
    ],
  },
  {
    slug: 'zarya-of-the-dawn',
    title: '"Zarya of the Dawn" — Kris Kashtanova',
    year: '2022–23',
    level: 3,
    surfaces: { text: 0, image: 4 },
    what: 'A comic book with a human-written story and arrangement, illustrated entirely with Midjourney. The US Copyright Office ruled in February 2023 that the text and the arrangement of images are protectable human authorship, and the individual Midjourney images are not.',
    walk: 'For the whole work: model-made material survives, most of the pixels are the model\'s, but the story, characters and arrangement — the substance — are the author\'s: Level 3, with Surfaces declared (text 0, image 4). The images alone land at 4, not 3, because prompting Midjourney does not materially determine the output — the same reasoning the Copyright Office used to refuse them.',
    lesson: 'The one number plus a Surfaces breakdown says in a line what took the Copyright Office a nine-page letter — and the two analyses agree.',
    sources: [
      { label: 'Wikipedia — Zarya of the Dawn', url: 'https://en.wikipedia.org/wiki/Zarya_of_the_Dawn' },
      { label: 'US Copyright Office decision (PDF)', url: 'https://www.copyright.gov/docs/zarya-of-the-dawn.pdf' },
    ],
  },
  {
    slug: 'this-manifesto',
    title: 'The AI Usage Manifesto — this site',
    year: '2026',
    level: 3,
    what: 'The diagnosis, the argument, and every design decision in the scale are the author\'s. The research and the prose were produced with a large language model, then read, corrected, and signed line by line.',
    walk: 'Generative AI used; new material survives; most of the final words are the model\'s; the substance — what the document says — is the author\'s: Level 3, declared on every page and in the metadata.',
    sources: [
      { label: 'The declaration, on this site', url: 'https://usagescale.org/3' },
    ],
  },
  {
    slug: 'site-translations',
    title: 'The 21 translations of this site',
    year: '2026',
    level: 3,
    what: 'Every non-English page of this standard is machine-translated from the English source, and says so above the fold, in the reader\'s language.',
    walk: 'The translation edge case: a faithful translation inherits the level of the source — 3 — and adds a translation note. Translating a work does not change whose substance it carries.',
    lesson: 'Twenty-one silent machine translations of a transparency standard would have discredited it on day one. The rule applied to itself is the proof it works.',
    sources: [
      { label: 'The translation rule', url: 'https://usagescale.org/spec#translation' },
    ],
  },
  {
    slug: 'guardian-gpt3',
    title: '"A robot wrote this entire article" — The Guardian',
    year: '2020',
    level: 4,
    what: 'The Guardian assigned GPT-3 an op-ed arguing that humans have nothing to fear from AI, feeding it a prompt and an introduction. The model produced eight essays; editors selected the best parts, merged and edited them into one, and explained the process in an editor\'s note.',
    walk: 'The substance — the assigned argument — and the form both came from the model; the brief carried little work-specific substance of the editors\' own. Humans chose, cut, rearranged, reviewed and published with a full note: Level 4. The editing was real, but editors\' words do not dominate the result, so it is not Level 2.',
    lesson: 'A Level 4 done honestly in 2020, before there was a vocabulary for it: the editor\'s note is everything this scale asks for, in prose form.',
    sources: [
      { label: 'The Guardian, 8 September 2020', url: 'https://www.theguardian.com/commentisfree/2020/sep/08/robot-wrote-this-article-gpt-3' },
      { label: 'Wikipedia — GPT-3 (the op-ed and its assembly)', url: 'https://en.wikipedia.org/wiki/GPT-3' },
    ],
  },
  {
    slug: 'cnet-money',
    title: 'CNET Money explainers',
    year: '2022–23',
    level: 4,
    what: 'From November 2022 CNET published dozens of AI-drafted finance explainers, bylined "CNET Money Staff", each edited by a human before publication — disclosed only behind a byline click, until reporters noticed. A January 2023 audit found serious factual errors and plagiarised passages; corrections and a public accounting followed.',
    walk: 'Model substance, model form, human review before publication: Level 4 as the process was described. What failed was the standard Level 4 sets — review must be meaningful and appropriate to the stakes, and errors that survive "editing" put exactly that in question. Sloppy review does not move a work to Level 5; it makes the Level 4 declaration indefensible, which is the point of making it.',
    lesson: 'The scale does not grade quality. It attaches a name to the review — and CNET\'s episode shows why readers want that name attached.',
    sources: [
      { label: 'Wikipedia — CNET (AI-generated articles)', url: 'https://en.wikipedia.org/wiki/CNET' },
    ],
  },
  {
    slug: 'ap-earnings',
    title: 'Associated Press automated earnings stories',
    year: '2014–',
    level: 5,
    what: 'Since 2014 the AP has published quarterly corporate-earnings stories generated by Automated Insights\' Wordsmith from structured data, expanding coverage roughly tenfold over what reporters wrote by hand. Each story carries a standing note that it was generated by automation.',
    walk: 'Model-produced substance and form, published by a pipeline rather than a reader: Level 5. The template and the data feed were built with care by people — the live-generation edge case says that does not add a human review to each story.',
    lesson: 'Level 5, honest, useful, and a decade old. The level is not an accusation; the AP\'s standing disclosure line is exactly the plain-text declaration this scale standardises.',
    sources: [
      { label: 'Wikipedia — Automated journalism', url: 'https://en.wikipedia.org/wiki/Automated_journalism' },
    ],
  },
  {
    slug: 'heliograf',
    title: 'Heliograf — The Washington Post',
    year: '2016',
    level: 5,
    what: 'The Post\'s in-house bot published around 850 pieces in its first year: roughly 300 Rio Olympics reports and alerts, and coverage of about 500 races on election night 2016, faster than any desk could.',
    walk: 'Automated generation and publication at a volume no newsroom could read first: Level 5, per story. Editors built and supervised the system; nobody reviewed each of 500 election updates before it went out.',
    sources: [
      { label: 'Digiday, September 2017', url: 'https://digiday.com/media/washington-posts-robot-reporter-published-500-articles-last-year/' },
    ],
  },
  {
    slug: 'air-canada-chatbot',
    title: 'Air Canada\'s support chatbot',
    year: '2024',
    level: 5,
    what: 'The airline\'s website chatbot invented a bereavement-fare policy — buy now, claim the discount within 90 days — and a customer booked on it. Air Canada argued it should not be liable for what its chatbot said. The BC Civil Resolution Tribunal disagreed: the company is responsible for everything on its site, chatbot output included, and owed the difference.',
    walk: 'Live generation shown to a user with no review is Level 5, however carefully the system was configured — that is the live-generation edge case verbatim.',
    lesson: 'A declaration describes the process; it never outsources the accountability. Level 5 means "no human read this first", not "no human answers for it" — a tribunal has now said the same.',
    sources: [
      { label: 'The Register, February 2024', url: 'https://www.theregister.com/2024/02/15/air_canada_chatbot_fine/' },
    ],
  },
  {
    slug: 'sports-illustrated',
    title: 'Sports Illustrated product reviews',
    year: '2023',
    level: null,
    what: 'Futurism found product reviews published under authors who did not exist — AI-generated headshots bought from a synthetic-portrait site, invented biographies, no disclosure of AI anywhere. When contacted, the publisher deleted the authors, blamed a contractor, and ended the contract; people involved in the content\'s creation told Futurism it was AI-generated throughout.',
    walk: 'There is no level to walk to, and that is the finding. Had the same pipeline published the same reviews under an honest Level 4 or 5 declaration, there would have been no story — the deception was not the tool, it was the fake bylines standing where a declaration should have been.',
    lesson: 'The one dishonest level is the undeclared one. This is what it looks like, and what it costs.',
    sources: [
      { label: 'Futurism, November 2023', url: 'https://futurism.com/sports-illustrated-ai-generated-writers' },
    ],
  },
];
