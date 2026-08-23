# SoftwarePar — Agent Skills Playbook

## Purpose
This document defines how to leverage external AI-agent skills, coding methodologies, design systems, browser automation, motion tooling, marketing frameworks, and research resources when building future landing pages, websites, SaaS products, demos, and portfolio experiences.

The goal is not to blindly install every repository. The goal is to extract the best operating principles from each source, decide which ones belong in the default workflow, which should be optional, and which are redundant or risky.

## Operating model
For future projects, treat the incoming user prompt as a production specification. Before implementation:
1. Parse the brief into product, UX, visual, content, motion, technical, deployment, and QA requirements.
2. Select the relevant skill layers from this playbook.
3. Create a concrete implementation checklist.
4. Identify missing assets or external dependencies before coding.
5. Build in isolated, verifiable increments.
6. Validate the actual deployed output, not only the source code.

---

## Tier 1 — Default methodology layer

### obra/superpowers
Use as the primary process model.
Key principles to adopt:
- brainstorm before coding
- turn conversation into an approved specification
- create an implementation plan with exact tasks and verification steps
- use systematic debugging instead of trial-and-error changes
- verify before declaring completion
- perform explicit code review / spec compliance review
- keep implementation simple and reduce unnecessary complexity

Recommended use:
- Claude Code: direct plugin installation is supported by the repo
- Codex: plugin/skills support is documented by the repo
- other agents: reuse the methodology even when the exact plugin cannot be installed

### garrytan/gstack
Use as an orchestration/reference layer for role-based thinking: CEO/product, designer, engineering manager, QA, release, and documentation.
Do not duplicate roles mechanically. Extract the useful role-switching discipline:
- strategy before feature work
- design review separate from implementation review
- release readiness separate from coding completion
- documentation as a deliverable

### DietrichGebert/ponytail
Adopt its simplicity bias: the best code is often code not written.
Use it as a counterweight to overengineering:
- prefer platform capabilities and CSS before dependencies
- remove unnecessary abstractions
- avoid adding infrastructure that the project does not need
- keep demos portable and cheap to host

### JuliusBrussee/caveman
Optional communication optimization only.
Useful for reducing token-heavy agent chatter, but do NOT apply to user-facing explanations when precision or design reasoning is required.
Best used for internal agent-to-agent or repetitive implementation communication.

### ayghri/i-have-adhd
Adopt the output principle: do not bury the important answer.
For SoftwarePar workflows:
- current status first
- blocking issue second
- exact next action third
- details after that

---

## Tier 2 — Visual design and frontend quality

### nextlevelbuilder/ui-ux-pro-max-skill
Use as a broad UI/UX intelligence layer for:
- hierarchy
- layout systems
- spacing
- responsive design
- accessibility
- platform patterns
- component quality

### leonxlnx/taste-skill
Use as anti-generic visual direction.
Before accepting any design, ask:
- does it look like a template?
- does every section have a distinct purpose?
- is the composition memorable?
- are references being transformed rather than copied mechanically?

### pbakaus/impeccable
Use as the finishing/polish layer.
Apply after architecture is correct:
- refine typography
- spacing
- hierarchy
- alignment
- visual rhythm
- interaction detail
- remove weak decorative cards and generic AI visual clichés

### greensock/gsap-skills
Use whenever GSAP is part of the stack.
Required discipline:
- use GSAP for timeline-heavy or scroll-linked animation
- use ScrollTrigger for scroll choreography
- preserve cleanup and lifecycle correctness in React
- avoid duplicating animation responsibility between CSS, Framer Motion and GSAP

Recommended division:
- CSS: simple loops, marquee, hover, blinking, low-cost ambient motion
- Framer Motion: component transitions, overlays, cards, local state transitions
- GSAP: cursor physics, magnetic interactions, timelines, complex scroll narratives

### heygen-com/hyperframes
Use when an experience benefits from rendered motion/video generated from HTML/CSS rather than AI video.
Good for:
- branded explainer sequences
- UI motion films
- deterministic motion assets
- videos that need exact typography/layout

### remotion-dev/skills
Use for programmatic videos requiring React-based composition and deterministic rendering.
Preferred over generative video when:
- the content is UI-heavy
- exact text matters
- brand consistency matters
- video must be reproducible/editable

---

## Tier 3 — Browser QA and deployment verification

### vercel-labs/agent-browser
Use as a model for browser-driven QA whenever the development environment supports it.
Critical uses:
- open the deployed URL
- inspect actual layout
- click every CTA
- test mobile menu
- test modal open/close
- test scroll behavior
- test video playback
- verify links and routes
- compare expected vs rendered state

This formalizes a core rule learned during PIXZEN: a green build is not proof the experience works.

### vercel-labs/skills
Use as a skill discovery/installation mechanism where supported. Prefer selectively adding only relevant skills rather than bloating every agent environment.

---

## Tier 4 — Codebase understanding and multi-agent collaboration

### Graphify-Labs/graphify
Use for larger SaaS/codebases where architectural understanding becomes difficult.
Useful when:
- many modules/routes/tables exist
- docs and code have drifted
- an agent needs to answer dependency questions
- refactors require understanding cross-module relationships

Not necessary for small landing pages.

### openai/codex-plugin-cc
Use when Claude Code is the primary coding agent and Codex can serve as a second reviewer or delegated implementation agent.
Recommended pattern:
- Claude: primary implementation/context holder
- Codex: independent code review, bug investigation, or bounded task delegation

Avoid having two agents edit the same files concurrently without branch/worktree isolation.

### anthropics/skills
Treat as a canonical reference for the Agent Skills format and reusable skills design.
Use to structure future SoftwarePar skills so they remain portable across compatible agent environments.

---

## Tier 5 — Research, marketing and copy quality

### mvanhorn/last30days-skill
Use for time-sensitive research, trend validation, current community sentiment, tools, frameworks, and emerging design patterns.
Not required for evergreen implementation questions.

### coreyhaines31/marketingskills
Use for commercial-facing projects:
- landing page CRO
- positioning
- value proposition
- copywriting
- SEO
- analytics
- growth loops

Important rule: visual excellence does not replace conversion architecture.

### blader/humanizer
Use only as a final copy pass when text sounds overly synthetic or repetitive.
Do not let it alter technical accuracy, legal language, or essential product claims.

---

## Reference-site library: how to use the 50-site list

The supplied sites are not a generic inspiration dump. They form a practical reference bank for interactive experiences, maps, real-time data, data storytelling, archives, science visuals, cultural assets, and generative/data interfaces.

### Real-time maps / global systems
Examples: Zoom Earth, Flightradar24, MarineTraffic, Windy, LightningMaps, USGS, Submarine Cable Map, Global Forest Watch, OpenStreetMap.
Use as references for:
- map-heavy products
- live telemetry
- logistics systems
- fleet tracking
- environmental dashboards
- operations SaaS

### Exploratory / immersive UX
Examples: WindowSwap, Virtual Vacation, MapCrunch, Neal.fun, Scale of the Universe, NASA Eyes, Stellarium.
Use as references for:
- scroll storytelling
- interactive portfolio pieces
- educational experiences
- playful exploration
- spatial transitions

### Data storytelling
Examples: The Pudding, Our World in Data, Gapminder, Information is Beautiful, Observable.
Use as references for:
- narrative data visualization
- executive dashboards
- interactive reports
- complex information made understandable

### Cultural / visual archives
Examples: Internet Archive, Library of Congress, Europeana, Google Arts & Culture, Rijksmuseum, WikiArt, Public Domain Review, The Met.
Use as asset/reference sources only after checking each asset's actual usage rights/licensing.

### Scientific/current knowledge
Examples: ScienceDaily, arXiv, NASA APOD/images.
Use for scientific visual references and current research context, with proper source validation.

---

## Recommended agent stack by project type

### Premium landing page / scrolling portfolio
Default stack:
1. Superpowers methodology
2. Taste Skill
3. UI/UX Pro Max
4. Impeccable
5. GSAP Skills
6. Agent Browser QA
7. Marketing Skills
8. Humanizer for final copy if needed

### SaaS / operational system
Default stack:
1. Superpowers
2. UI/UX Pro Max
3. Ponytail simplicity bias
4. Graphify when codebase becomes large
5. Agent Browser QA
6. Marketing Skills only for onboarding/pricing/site surfaces

### Motion-heavy experience
Default stack:
1. Taste Skill
2. Impeccable
3. GSAP Skills
4. Remotion or Hyperframes for deterministic video
5. Generative video only when photoreal/cinematic content cannot be efficiently produced procedurally

### Claude Code environment
Recommended:
- Superpowers
- UI/UX Pro Max
- Taste
- Impeccable
- GSAP Skills
- Codex Plugin CC for independent review/delegation
- Graphify for large projects
- Marketing Skills as needed

### Replit environment
Replit may not support every Claude/Codex plugin format directly. Therefore:
- copy the underlying methodology into the project instructions / AGENTS.md / equivalent agent rules
- install compatible skills only when Replit supports the mechanism
- do not assume a GitHub skill automatically works in Replit
- preserve the same workflow: spec → plan → build → browser QA → deployed verification

---

## Conflict resolution between skills

When skills disagree, use this precedence:
1. user specification
2. functional correctness and security
3. project constraints (budget, hosting, stack)
4. accessibility and responsive behavior
5. Superpowers systematic workflow
6. Ponytail simplicity
7. UI/UX Pro Max usability
8. Taste / Impeccable visual quality
9. animation sophistication
10. marketing optimization

Never let visual polish break usability, performance or the user's explicit specification.

---

## Asset-generation protocol

Before requesting a user-generated image/video:
1. determine whether it can be built better with CSS/GSAP/Three.js/Remotion/Hyperframes
2. if generative media is actually needed, define a unique art direction for that specific section
3. avoid repeating the same visual vocabulary across assets
4. specify aspect ratio, duration, resolution and whether audio is required
5. ask for a canonical filename
6. verify uploaded filename and actual byte size in GitHub before wiring it
7. test the direct public asset URL before debugging React/CSS

---

## Definition of done
A development is not finished until:
- every explicit prompt requirement is accounted for
- no placeholder-quality visual remains in a high-impact section
- all CTAs point to real destinations
- mobile behavior is designed, not merely stacked
- hover-only interactions have touch alternatives
- videos actually play from the deployed URL
- links and modal interactions are tested
- reduced-motion behavior is acceptable
- no unexpected horizontal overflow exists at 320px
- deployed GitHub Pages/hosting output matches source intent
- final visual QA has been performed section by section

## SoftwarePar principle
Use external skills as specialized reviewers and operating frameworks, not as a pile of conflicting instructions. The agent should synthesize them into one coherent production workflow and only ask the user for information or assets that cannot be reliably inferred or generated internally.
