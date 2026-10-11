# Translation policy

English is the normative source. Core pages are available in 22 languages. Developer and policy references that have not been translated remain labelled as English.

## Review states

- **Machine · unreviewed (MT):** produced or materially revised by a model; no fluent human has approved the current full text.
- **Human-reviewed (HR):** compared with the current English source by a named fluent reviewer.
- **Community-verified (CV):** publicly reviewed by at least two independent fluent reviewers, with disagreements resolved and recorded.

MT, HR and CV describe translation review, not the source work’s AI Usage level. Do not assume a source level or human approval. Model review and back-translation are diagnostics, not human review.

The October 2026 upgrade retains MT status for all 21 translations. Changes to machine output must not silently retain an approval from an earlier revision.

## Review process

1. Compare the entire current source and translation, including UI, metadata, definitions and examples.
2. Preserve negation, exceptions, must/should/may, “most”, original substance and meaningful review.
3. Check level IDs, decision branches, names, links and interpolation placeholders.
4. Read the rendered desktop and mobile page; check script coverage and Arabic/Persian directionality.
5. Record the reviewer, date, source commit and reviewed content scope.
6. Update the locale review state only after those checks are complete.

A normative source change makes affected translations pending again. Automated checks enforce structure and matching decision branches; they cannot certify semantic equivalence.

Machine translations may remain available for access when prominently labelled. Describe them according to their recorded review state.
