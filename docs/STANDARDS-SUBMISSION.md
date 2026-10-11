# Standards submissions — v1.3.0

Prepared 10 October 2026; publication and public submissions requested by the maintainer on 11 October. The [live submission and pilot record](https://github.com/karauda/ai-usage-scale/issues/11) tracks publication results and links to the actual submissions. This document describes an independent proposal, with limited implementation evidence and an unresolved review boundary.

## Suggested first venue

[Schema.org issue #3391](https://github.com/schemaorg/schemaorg/issues/3391) already discusses expressivity for AI-generated content. Contribute a concrete use case there before requesting a dedicated numeric property. The [W3C AI Content Disclosure Community Group](https://www.w3.org/groups/cg/ai-content-disclosure/) is a parallel venue for disclosure requirements.

Schema.org acceptance and Google Search feature support are separate processes. A valid JSON-LD extension is neither acceptance nor a rich-result feature.

## Proposed comment

> I maintain the AI Usage Scale, an independent CC0 vocabulary for describing generative AI contribution and pre-publication review: https://usagescale.org.
>
> A use case that seems relevant to this discussion is the distinction between:
>
> 1. An expert supplying original, work-specific observations and an argument, with a model expressing them in prose and the expert meaningfully reviewing the result.
> 2. A model supplying both the argument and prose from a general brief, with an editor reviewing the result.
> 3. The same generated output being published without review.
>
> A binary AI-generated flag collapses these workflows. The scale currently describes them as Directed, Prompted and Automated, but a numeric level need not be the final representation. Human contribution and review may be clearer as separate, composable properties of CreativeWork.
>
> Our vocabulary is published using the existing DefinedTermSet and DefinedTerm types. Work declarations use an explicitly namespaced project extension; aiUsageLevel is not represented as an existing Schema.org property. We also removed a CreativeWork.additionalProperty example because that property’s published domain does not cover CreativeWork.
>
> Current evidence is modest: two related-tools references within CHAOSS and deferred integration interest in diarie. We have not verified an independent production deployment. There is also an unresolved decision-tree shortcut: the Level 3 definition requires meaningful human review, while its path does not ask about review. That boundary must be settled before claiming consistent automated classification.
>
> Would contributions describing original human substance and meaningful human review help the vocabulary work already underway? I can provide the definitions, mixed-surface examples, JSON Schemas and conformance cases for discussion.

The public submission should link to release v1.3.0 and reflect the surrounding discussion at the time of posting. The website revision itself awaits human editorial review; publication does not change that status.

The W3C group's [contribution rules](https://github.com/w3c-cg/ai-content-disclosure/blob/main/CONTRIBUTING.md) require Community Group membership for substantive specification contributions. The initial submission is a related-work listing request through its public issue tracker. A normative contribution or participation agreement requires a separate maintainer decision.

## Technical starting point

The existing vocabulary representation uses [DefinedTermSet](https://schema.org/DefinedTermSet) and [DefinedTerm](https://schema.org/DefinedTerm). A custom work declaration must identify its own term IRI:

```json
{
  "@context": {
    "@vocab": "https://schema.org/",
    "aiUsageLevel": "https://usagescale.org/spec#aiUsageLevel"
  },
  "@type": "CreativeWork",
  "aiUsageLevel": 3
}
```

This is a project extension. Do not describe it as a supported Google property. [additionalProperty](https://schema.org/additionalProperty) is not a general extension mechanism for every Schema.org type.

A standards proposal should address:

- Original human contribution, retained AI material and meaningful review as distinct dimensions.
- The declarer, scope of the work and date/version of a declaration.
- Composite works with text, image, audio, video, code and data surfaces.
- Source provenance and translation review without assuming a source level.
- Missing information: absence of a claim is not a claim of human authorship.
- Historical version resolution and interoperability tests.
- The difference between declaring a process and proving it.

## Evidence needed next

1. Resolve the review boundary and test consistent classification on real workflows.
2. Recruit at least three independent pilots and record public deployments.
3. Have named reviewers approve core translations and technical mappings.
4. Submit the use cases to #3391 and the W3C group; revise against public feedback.
5. Discuss asset-specific mappings with IPTC and provenance practitioners.
6. After evidence improves, request platform feedback through the relevant Google documentation/product channel.

The three-pilot target is this project’s proposed evidence threshold, not a Schema.org or Google requirement.

Google’s [Search feature gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) lists supported structured-data features. Its [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) distinguish vocabulary use from eligibility and presentation. Its [AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) does not require a special AI file or schema.

There is no verified public route that guarantees acceptance of this scale by Google. The practical first step is an interoperable disclosure proposal with real implementations, rather than a promise that adding a schema field will cause support.
