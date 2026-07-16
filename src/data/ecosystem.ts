/**
 * The AI-provenance ecosystem, mapped honestly.
 *
 * This is a reference, not an endorsement list. The `relation` field states our actual stance:
 * what we interoperate with, what we complement, what is adjacent, and — for detection — what
 * we deliberately do NOT rely on, with the evidence why. A standard about honesty does not get
 * to quietly omit the tools it disagrees with; it names them and shows its reasoning.
 *
 * Single source of truth for /ecosystem (the page) and /ecosystem.json (the machine map).
 */

export type Relation =
  | 'interoperates' // a declaration maps into it losslessly, or emits its vocabulary
  | 'complements' //   answers a different question (provenance / watermark); pairs with us
  | 'adjacent' //      related prior art or a neighbouring signal (licensing, consent)
  | 'cautioned'; //    the reader will meet it; we list the evidence rather than the sales page

export interface EcoEntry {
  name: string;
  url: string;
  role: string; // what it actually does, in one line
  relation: Relation;
  note?: string; // our honest stance / caveat
}

export interface EcoCategory {
  key: string;
  title: string;
  blurb: string;
  entries: EcoEntry[];
}

export const ECOSYSTEM: EcoCategory[] = [
  {
    key: 'provenance',
    title: 'Cryptographic provenance',
    blurb:
      'Proves which tools and edits touched a file. Answers "what happened to this asset", not "whose thinking is inside it" — the two are complementary, not competing.',
    entries: [
      {
        name: 'C2PA (Content Credentials)',
        url: 'https://c2pa.org',
        role: 'An open technical standard for tamper-evident, cryptographically signed content provenance.',
        relation: 'complements',
        note: 'Its own FAQ states the core spec "does not support attribution of content to individuals or organizations." Provenance can be proven; contribution can only be declared. Both belong on a work.',
      },
      {
        name: 'Content Authenticity Initiative',
        url: 'https://contentauthenticity.org',
        role: 'A cross-industry initiative implementing C2PA Content Credentials across cameras, editors and platforms.',
        relation: 'complements',
        note: 'Free to join. We present the AI Usage level as a contribution/review signal that sits alongside a Content Credential, never as a replacement for it.',
      },
    ],
  },
  {
    key: 'disclosure',
    title: 'Disclosure vocabularies',
    blurb:
      'Machine-readable statements about how a work was made. This is the layer the AI Usage Scale lives in, and every level emits into the established ones.',
    entries: [
      {
        name: 'IPTC Digital Source Type',
        url: 'https://cv.iptc.org/newscodes/digitalsourcetype/',
        role: 'An established controlled vocabulary for how media was created (human, AI-generated, composite…).',
        relation: 'interoperates',
        note: 'Every level maps to a valid IPTC term. The mapping is lossy in one direction on purpose: IPTC cannot tell Levels 3, 4 and 5 apart, because it has no term for whose substance a work carries or whether a person reviewed it.',
      },
      {
        name: 'W3C AI Content Disclosure CG',
        url: 'https://www.w3.org/groups/cg/ai-content-disclosure/',
        role: 'A W3C Community Group incubating syntax for AI content disclosure states.',
        relation: 'interoperates',
        note: 'Community Group work is incubation, not a W3C standard. Our emitted `ai-disclosure` metadata is experimental and aligned with this discussion; we contribute use cases and tests, and do not claim endorsement.',
      },
      {
        name: 'schema.org',
        url: 'https://schema.org',
        role: 'The shared vocabulary search engines read for structured data.',
        relation: 'interoperates',
        note: 'The six levels are published as a schema.org DefinedTermSet (CC0), so a level is citable by machines as a term, not just a page.',
      },
    ],
  },
  {
    key: 'watermarking',
    title: 'Watermarking',
    blurb:
      'Embeds a signal inside generated pixels or tokens. A useful provenance hint for detecting a specific model’s output — orthogonal to a maker’s honest declaration of contribution.',
    entries: [
      {
        name: 'Google SynthID',
        url: 'https://deepmind.google/technologies/synthid/',
        role: 'Imperceptible watermarking for AI-generated image, audio, text and video.',
        relation: 'complements',
        note: 'Answers "did this specific model generate this?" A declaration answers "what role did a human play, and who is accountable?" A work can carry both.',
      },
    ],
  },
  {
    key: 'consent',
    title: 'Consent & licensing signals',
    blurb:
      'Whether a work may be used for training. A different question from disclosure — a declaration describes how a work was made and does not grant or deny any training right.',
    entries: [
      {
        name: 'Spawning / Do Not Train',
        url: 'https://spawning.ai',
        role: 'Opt-out registries and signals (ai.txt, Do Not Train) letting creators refuse AI training use.',
        relation: 'adjacent',
        note: 'Consent, not disclosure. Licences, terms, robots.txt and access controls remain authoritative over training; nothing in this standard overrides them.',
      },
      {
        name: 'Not By AI',
        url: 'https://notbyai.fyi',
        role: 'A badge asserting content was made without generative AI.',
        relation: 'adjacent',
        note: 'A binary human/AI mark that charges for commercial use. The AI Usage Scale is a gradient, is CC0, and starts at Level 0 for exactly the human-made case — no fee, no permission.',
      },
    ],
  },
  {
    key: 'detection',
    title: 'Detection',
    blurb:
      'Tools that guess whether text was machine-written. This standard does not rely on detection, and lists it here with the evidence rather than the sales pitch — so the reader can weigh it honestly.',
    entries: [
      {
        name: 'AI text detectors (GPTZero, Turnitin, Originality.ai, …)',
        url: 'https://arxiv.org/abs/2304.02819',
        role: 'Classifiers that estimate the probability a passage was AI-generated.',
        relation: 'cautioned',
        note: 'In a Stanford study, seven detectors flagged 61% of genuine TOEFL essays by non-native English speakers as AI-generated; 97.8% were flagged by at least one. A standard enforced by detection is a machine for accusing the innocent — which is why this one is enforced by public, falsifiable self-declaration instead.',
      },
    ],
  },
];
