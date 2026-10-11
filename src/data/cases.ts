export interface CaseEntry {
  slug: string;
  title: string;
  level: number;
  process: string;
  reasoning: string;
}

export const CASES: CaseEntry[] = [
  {
    slug: 'human-report', title: 'A report written from interviews', level: 0,
    process: 'A reporter conducts interviews, writes the article and edits it without generative AI. Conventional search and a non-generative spelling checker are used.',
    reasoning: 'No generative AI was involved. Conventional software does not move the work above Level 0.',
  },
  {
    slug: 'mechanical-help', title: 'A human draft with grammar corrections', level: 1,
    process: 'The author writes the complete article. A generative tool fixes grammar and formatting without adding an argument, passage or other original material.',
    reasoning: 'AI mechanically processed human material; no new model-originated content remains.',
  },
  {
    slug: 'mixed-draft', title: 'An article with two AI-drafted paragraphs', level: 2,
    process: 'The author writes most of the final article. Two paragraphs drafted by AI survive, after editing and review.',
    reasoning: 'New AI material remains, but the human made most of the final form. The definition concerns the finished work, rather than the volume of generated drafts.',
  },
  {
    slug: 'human-substance', title: 'An explanation from original expert notes', level: 3,
    process: 'An expert supplies original observations, data and a work-specific argument. AI writes most of the prose. The expert checks the claims, corrects the draft and approves the final publication.',
    reasoning: 'The human materially determines the substance; AI supplies most of the form. Meaningful review satisfies the full Level 3 definition.',
  },
  {
    slug: 'reviewed-generation', title: 'A generated article reviewed before publication', level: 4,
    process: 'A publisher gives AI a topic and style brief. AI develops the argument and most of the final text. An editor checks facts and reviews the complete article before publishing.',
    reasoning: 'The brief does not supply original, work-specific substance. AI provides substance and form, with meaningful human review.',
  },
  {
    slug: 'unreviewed-generation', title: 'A generated update published automatically', level: 5,
    process: 'A generative model writes an update and a pipeline publishes it without a person reviewing that particular output.',
    reasoning: 'AI provides substance and form, without pre-publication review. Human design of the pipeline is distinct from review of each output.',
  },
];
