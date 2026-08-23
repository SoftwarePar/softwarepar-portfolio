# SoftwarePar — Agent Skills Playbook

## Purpose
This document defines how to leverage external AI-agent skills, coding methodologies, design systems, browser automation, motion tooling, marketing frameworks, research resources, and external AI production tools when building future landing pages, websites, SaaS products, demos, and portfolio experiences.

The goal is not to blindly install every repository or sign up for every AI tool. The goal is to extract the best operating principles from each source, decide which ones belong in the default workflow, which should be optional, and which are redundant, expensive, or risky.

## Operating model
For future projects, treat the incoming user prompt as a production specification. Before implementation:
1. Parse the brief into product, UX, visual, content, motion, technical, deployment, and QA requirements.
2. Select the relevant skill layers and external-tool capabilities from this playbook.
3. Create a concrete implementation checklist.
4. Identify missing assets or external dependencies before coding.
5. Decide whether each missing asset is better created with code, procedural motion, image generation, video generation, 3D, presentation tooling, or research tooling.
6. Build in isolated, verifiable increments.
7. Validate the actual deployed output, not only the source code.

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

# External AI Production Tool Registry

The following tools are capabilities, not mandatory dependencies. Their job is to fill gaps the coding agent cannot efficiently solve itself. The agent should route each need to the cheapest and most controllable method first.

## Routing priority
For any missing asset or deliverable, use this order:
1. native code / CSS / SVG
2. GSAP / Framer Motion / Three.js / WebGL
3. Remotion / Hyperframes for deterministic video
4. image generation or image editing
5. generative video
6. 3D generation
7. external research/content tools

Do not use an external AI service simply because it exists.

## Sales / outbound

### Explee
Category: AI outbound / AutoGTM.
Useful for:
- ICP research
- company/person discovery
- personalized outbound
- cold-email automation
- lead generation experiments

SoftwarePar use:
- optional commercial acquisition layer, not part of frontend development
- potentially useful when the portfolio is ready to sell services
- never connect outbound automation before reviewing compliance, sender reputation, domain setup, targeting quality, and cost

## Documents, research and knowledge transformation

### NoteGPT
Category: document-to-summary / podcast-style transformation.
Use when a client supplies long documentation and wants consumable summaries or audio-oriented derivatives.
Not needed for ordinary code analysis when the agent can read the source directly.

### Napkin AI
Category: text-to-diagram.
Useful for:
- architecture visuals
- process diagrams
- client-facing flows
- presentation graphics

Prefer programmatic diagrams when exact structure/versioning matters.

### Perplexity
Category: sourced web research.
Useful as an external research alternative when current information and references matter.

### Consensus
Category: research/scientific evidence discovery.
Use for projects where claims should be grounded in published scientific literature.

### SciSpace
Category: paper comprehension/research assistance.
Use when working with complex academic PDFs, research-heavy products, or scientific client domains.

## Image / visual generation

### Ideogram
Strength: image generation where typography inside the image matters.
Use for posters, campaign key visuals, branded compositions, and concepts requiring accurate text rendering.
Do not bake UI copy into landing-page background assets when HTML should render the text.

### Krea AI
Strength: rapid visual iteration / real-time generation.
Use for art-direction exploration and fast mood/visual development.

### Leonardo AI
Strength: general image generation and asset iteration.
Useful as an alternative generator when another model fails to follow style or composition.

### Magnific
Strength: enhancement/upscaling.
Use only after the composition itself is approved. Upscaling cannot rescue weak art direction.

### Photoroom
Strength: product imagery, cutouts, backgrounds, commercial product presentation.
Useful for e-commerce, catalogs, product flyers, Marketplace assets, and product landing pages.

### Vizcom
Strength: sketch/concept to rendered visualization.
Useful for industrial design, physical product concepts, automotive/product visualization, or spatial ideation.

## Generative video / motion

### Kling AI
Category: generative video.
Use for cinematic or photoreal motion assets that cannot reasonably be produced procedurally.
Always specify aspect ratio, duration, camera motion, subject motion, negative prompt, safe text area, and loop behavior where available.

### Runway
Category: generative cinematic video and video transformation.
Use for premium visual sequences, image-to-video, or compositing-style experiments when procedural motion is insufficient.

### Pika
Category: fast image-to-video / animation.
Use for small visual loops and simple motion experiments rather than core deterministic UI animation.

### Viggle
Category: character motion.
Use when character/body movement is the central need.

### HeyGen
Category: avatar/presenter video and localized/AI-presenter production.
Use for marketing demos, spokesperson videos, training content, and personalized sales media, subject to consent and likeness rules.

### Synthesia
Category: AI presenter / corporate avatar video.
Useful for explainers, onboarding, internal training, and client demo content.

### Fliki
Category: text-to-video/content video.
Useful for fast informational videos; not preferred for hero-quality art direction.

### InVideo AI
Category: prompt-to-video assembly.
Useful for marketing/content workflows where speed matters more than bespoke motion design.

### Descript
Category: transcript-based audio/video editing.
Useful for editing interviews, demos, presentations, podcasts, or client recordings.

### Opus Clip
Category: long-form to shorts.
Use for distribution after long-form content exists; not a primary creation tool.

## Audio / voice / music

### ElevenLabs
Category: voice synthesis and voice cloning.
Use for narration, multilingual demos, prototypes, and audio experiences where the user has appropriate rights/consent.
Never assume permission to clone a real person's voice.

### Suno
Category: generative music.
Use for prototype background music or creative concepts only after considering licensing/usage terms for the intended commercial context.

## Presentations

### Gamma
Category: AI presentation/document generation.
Useful for rapid client decks, proposals, product stories, and strategy documents.

### Beautiful.ai
Category: presentation design with guided layouts, brand controls, collaboration, and analytics.
Useful when presentation consistency and business-ready formatting matter.

### Tome
Category: presentation/storytelling tool when available and appropriate.
Treat availability/features as time-sensitive and verify before relying on it for a production workflow.

## Meetings / repurposing

### tl;dv
Category: meeting recording and summarization.
Useful for discovery calls, requirements gathering, and extracting action items.

### Fireflies
Category: automated meeting notes and summaries.
Useful for client requirements, sales calls, and keeping searchable meeting history.

### Castmagic
Category: audio/video repurposing into written content.
Useful for turning calls, podcasts, or videos into posts, summaries, newsletters, and derivative assets.

## Coding / app-generation agents

### Cursor
Category: AI-native coding IDE.
Use when a local repo-based workflow and deep interactive editing are preferred.

### v0
Category: AI UI generation.
Best used for rapid component/layout exploration, not as final authority for unique art direction.

### Lovable
Category: prompt-to-app generation.
Useful for fast MVPs and CRUD/product prototypes. Requires the same post-generation QA and visual review as every other agent.

### Replit
Category: browser-based agentic development + preview/deployment.
Use only when specifically chosen for the project or budget allows. Do not rely on Replit by default when GitHub Pages/static hosting can satisfy the requirement at zero cost.

## 3D

### Meshy
Category: text/image-to-3D asset generation.
Useful for:
- hero objects
- product visualization
- Three.js experiences
- spatial/interactive portfolios

Before using generated 3D assets on the web, optimize polygon count, texture resolution, formats, compression, and mobile performance.

---

## External-tool selection by deliverable

### Premium landing page hero
Preferred order:
- CSS/SVG/Three.js if abstract
- Remotion/Hyperframes if deterministic motion
- Kling/Runway if photoreal/cinematic scene required
- Ideogram/Krea/Leonardo for static key visuals

### SaaS demo
Preferred order:
- code the real interactive interface
- v0 only for layout ideation
- Remotion/Hyperframes for demo films
- Gamma/Beautiful.ai only for sales presentation around the SaaS

### Product/catalog landing
Preferred:
- Photoroom for cleanup/backgrounds
- Ideogram/Krea/Leonardo for campaign visuals
- Magnific only for approved assets needing resolution enhancement

### 3D experience
Preferred:
- native Three.js/R3F architecture
- Meshy for selected 3D asset generation
- optimize before deployment

### Client discovery / requirements
Preferred:
- meeting recording/notes with tl;dv or Fireflies when available and consented
- extract requirements into a written specification
- do not treat summaries as authoritative without checking source statements

### Research-heavy product
Preferred:
- web research with primary sources
- Consensus/SciSpace when scientific literature matters
- Perplexity as supplementary sourced discovery

### Service acquisition
Preferred:
- portfolio + real contact channels first
- outbound tooling such as Explee only after ICP, domain reputation, compliance, and campaign economics are defined

---

## Claims and tool-list hygiene
Social-media lists often use exaggerated wording such as “best”, “perfectly”, “instantly”, or “Google doesn't want you to know”. Do not copy these claims into client-facing recommendations as facts.

For every external service used in production:
- verify the service still exists
- verify current plan/free-tier restrictions
- verify output licensing and commercial-use terms
- verify export resolution/formats
- verify watermark limitations
- verify privacy/data handling when client data is involved
- verify whether API access is needed or available

Capabilities and pricing can change. Tool selection must be treated as time-sensitive.

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
9. External generative media only for assets not better created procedurally

### SaaS / operational system
Default stack:
1. Superpowers
2. UI/UX Pro Max
3. Ponytail simplicity bias
4. Graphify when codebase becomes large
5. Agent Browser QA
6. Marketing Skills only for onboarding/pricing/site surfaces
7. External AI media tools only when they support the product rather than replace real functionality

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
- use external tools for media only when Replit cannot generate the required asset itself

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
11. convenience of external AI tools

Never let visual polish or an external AI service break usability, performance, budget, privacy, or the user's explicit specification.

---

## Asset-generation protocol

Before requesting a user-generated image/video:
1. determine whether it can be built better with CSS/GSAP/Three.js/Remotion/Hyperframes
2. if generative media is actually needed, define a unique art direction for that specific section
3. avoid repeating the same visual vocabulary across assets
4. specify aspect ratio, duration, resolution and whether audio is required
5. select the best generator for the asset type rather than defaulting to one tool
6. ask for a canonical filename
7. verify uploaded filename and actual byte size in GitHub before wiring it
8. test the direct public asset URL before debugging React/CSS
9. optimize file weight/performance before final release

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
- any external AI-created asset has been checked for format, quality, rights/terms, and performance

## SoftwarePar principle
Use external skills and AI tools as specialized capabilities and reviewers, not as a pile of conflicting instructions. The agent should synthesize them into one coherent production workflow and only ask the user for information, accounts, permissions, or assets that cannot be reliably inferred, generated internally, or produced with available zero-cost tooling.
