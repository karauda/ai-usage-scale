export type Relation = 'interoperates' | 'complements' | 'adjacent' | 'cautioned';

export interface EcoEntry {
  name: string;
  url: string;
  role: string;
  relation: Relation;
  note?: string;
}

export interface EcoCategory {
  key: string;
  title: string;
  blurb: string;
  entries: EcoEntry[];
}

export const ECOSYSTEM: EcoCategory[] = [
  {
    key: 'provenance', title: 'Content provenance',
    blurb: 'A process declaration can accompany provenance data. It does not replace signed assertions or establish that a claim is true.',
    entries: [{
      name: 'C2PA / Content Credentials',
      url: 'https://spec.c2pa.org/',
      role: 'Technical specifications for cryptographically verifiable, tamper-evident provenance.',
      relation: 'complements',
      note: 'This project does not implement a C2PA claim generator or validator. Its level alone is not a Content Credential.',
    }],
  },
  {
    key: 'disclosure', title: 'Disclosure vocabularies',
    blurb: 'Existing vocabularies provide useful publication formats. Mappings have limitations and do not imply institutional approval.',
    entries: [
      {
        name: 'IPTC Digital Source Type',
        url: 'https://cv.iptc.org/newscodes/digitalsourcetype/',
        role: 'A controlled vocabulary describing the source and creation process of digital media.',
        relation: 'adjacent',
        note: 'The scale includes suggested mappings. Choose a term based on the actual asset: one integer cannot establish every IPTC distinction, especially for AI used only during research.',
      },
      {
        name: 'W3C AI Content Disclosure Community Group',
        url: 'https://www.w3.org/groups/cg/ai-content-disclosure/',
        role: 'A community venue for developing AI disclosure proposals.',
        relation: 'adjacent',
        note: 'A Community Group is not a W3C Recommendation. The ai-disclosure HTML examples in this project are experimental; no acceptance or endorsement is claimed.',
      },
      {
        name: 'Schema.org',
        url: 'https://schema.org/DefinedTermSet',
        role: 'A structured-data vocabulary, including DefinedTermSet and DefinedTerm.',
        relation: 'interoperates',
        note: 'Those existing types describe the six terms. A work’s aiUsageLevel is a separately namespaced project extension, not a Schema.org property or a supported Google Search feature.',
      },
    ],
  },
  {
    key: 'watermarking', title: 'Watermarking',
    blurb: 'A signal embedded in generated content can answer a different question from the publisher’s description of contribution and review.',
    entries: [{
      name: 'Google SynthID',
      url: 'https://deepmind.google/models/synthid/',
      role: 'Watermarking technology for AI-generated content.',
      relation: 'complements',
      note: 'The scale does not read, generate or validate SynthID watermarks. A declaration and a watermark can coexist.',
    }],
  },
  {
    key: 'standards-discussion', title: 'Public standards discussion',
    blurb: 'These are venues for feedback and related projects, rather than evidence that the scale has become a recognised standard.',
    entries: [
      {
        name: 'Schema.org issue #3391',
        url: 'https://github.com/schemaorg/schemaorg/issues/3391',
        role: 'An open discussion about expressivity for AI-generated content.',
        relation: 'adjacent',
        note: 'A relevant place to submit concrete use cases. This project has prepared a submission draft; publication and acceptance are separate steps.',
      },
      {
        name: 'CHAOSS AI disclosure',
        url: 'https://github.com/chaoss/disclosure',
        role: 'A community project collecting approaches to AI disclosure.',
        relation: 'adjacent',
        note: 'Its related-tools list references this scale. A reference is not verified deployment or endorsement.',
      },
    ],
  },
];
