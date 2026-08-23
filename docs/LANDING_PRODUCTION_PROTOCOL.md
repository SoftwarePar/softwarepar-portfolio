# LANDING PRODUCTION PROTOCOL

## Purpose
This document defines the operating protocol for future premium landing pages, portfolio experiences, websites and SaaS frontends built in this repository. It is based on the full PIXZEN production process and exists to avoid repeating the mistakes found during that build.

The rule is simple: treat the user's prompt as a production specification, not as loose inspiration.

---

## 1. Intake: what must be extracted from the prompt

Before coding, convert the prompt into a structured checklist with these blocks:

1. Product / project name.
2. Visual direction.
3. Required stack.
4. Typography.
5. Color system.
6. Global texture and backgrounds.
7. Section-by-section layout.
8. Section-by-section interactions.
9. Motion requirements.
10. Responsive behavior.
11. Required assets: images, videos, icons, 3D, audio.
12. Contact destinations.
13. Deployment target.
14. Strict rules / forbidden patterns.

Do not start implementing until the important requirements are mapped.

If the prompt names a required asset but does not provide it, do not silently replace it with something unrelated. Either create an equivalent original asset or ask the user only when the missing information cannot reasonably be inferred.

---

## 2. Build from the specification, not from a generic template

Never start from a generic startup template when the prompt requests a premium editorial, Awwwards, MotionSites or luxury digital experience.

Every section must be designed around its stated behavior.

Examples:
- If the Hero requires a video background, build the Hero around a real video asset.
- If Services requires sticky media reveal, implement the 5/7 structure and crossfade behavior.
- If Selected Work requires stacking sticky cards, do not replace it with a normal card grid.
- If Insights requires a cursor-follow image reveal, implement the pointer-follow behavior.
- If Contact requires a magnetic button, implement real cursor-based movement.

Do not declare the landing finished just because the static layout resembles the prompt.

---

## 3. Asset production protocol

### 3.1 Asset inventory
Before implementation, create an inventory:

- Hero video / image.
- Service visuals.
- Work / case-study visuals.
- Insight thumbnails.
- Logos / icons.
- Background textures.
- Any 3D or WebGL content.

Every visual slot must have either:
- a real final asset, or
- an explicitly temporary placeholder clearly marked for replacement.

Premium portfolio work must not ship with primitive placeholder SVGs when the surrounding visual quality is cinematic.

### 3.2 When assets do not exist
If a prompt describes the visual sufficiently, create the missing asset direction yourself.

For video generation tasks:
- write a production prompt specific to the section;
- define composition;
- define subject;
- define camera;
- define motion;
- define materials;
- define lighting;
- define palette;
- define negative prompt;
- define exact aspect ratio, duration and fps;
- ensure the generated video leaves negative space where HTML typography will appear.

Do not generate text or logos inside background videos unless specifically required. Website typography must remain HTML whenever possible.

### 3.3 Avoid visual repetition
When multiple videos are required, do not reuse the same art direction with only minor wording changes.

Each project or section should have a distinct visual language.

Example from PIXZEN:
- Expertise: conceptual cinematic motion.
- ORBIT: computational map / network language.
- NEURAL: human behavior / architecture.
- VECTOR: macro engineering / mechanical precision.

If all prompts reuse words like glass, floating objects, particles, chrome and slow camera, video models will converge toward nearly identical outputs.

---

## 4. Binary upload rule: critical lesson from PIXZEN

The most important asset deployment lesson:

### Never assume the uploaded filename.

After a user uploads a binary asset to GitHub:

1. Inspect the actual directory in GitHub.
2. Verify the exact filename.
3. Verify the extension.
4. Verify file size.
5. Verify that no duplicate extension was created.
6. Test the direct public URL before wiring the component.

PIXZEN failure example:
- old file: `hero_bg_animation_hand.mp4`
- new real video: `hero_bg_animation_hand.mp4.mp4`

The component initially referenced the wrong file. Both deployment and code were technically successful, but the browser could not show the intended asset.

### Direct asset test
Before debugging CSS or React, open the raw public asset URL directly.

For GitHub Pages:
`https://<owner>.github.io/<repo>/<asset-path>`

If the video does not play directly, do not keep changing opacity, z-index, blend mode or React logic. First fix the asset itself or its path.

Debugging order:
1. asset exists;
2. correct filename;
3. direct URL works;
4. browser codec works;
5. component path works;
6. autoplay works;
7. only then tune CSS / blend / overlays.

---

## 5. Video rules for web

Preferred web video:
- H.264 MP4.
- 16:9 for large horizontal cards / hero unless design says otherwise.
- 1280x720 minimum; 1920x1080 preferred when available.
- 24 or 30 fps.
- muted.
- loop.
- playsInline.
- no unnecessary audio track.
- short seamless loops, usually 8-16 seconds.

Use:
`autoPlay muted loop playsInline`

Use `object-cover` when crop is acceptable, but validate the subject on mobile.

Do not assume desktop framing works on phones. Adjust object position, scale or provide a mobile-specific media behavior.

---

## 6. Responsive protocol

Responsive must be treated as a separate production phase, not as a side effect of Tailwind breakpoints.

Minimum target widths to check:
- 320px.
- 360-375px.
- 390-430px.
- 768px.
- 1024px.
- 1440px+.

Check every section for:
- horizontal overflow;
- huge typography clipping;
- buttons exceeding viewport;
- media crop;
- sticky behavior;
- hover-only interactions that do not work on touch;
- modal width and height;
- nav collisions;
- safe-area / viewport-height behavior;
- text line length;
- scroll-jank.

### Touch adaptation
Desktop hover interactions must have a mobile equivalent.

Examples:
- Services hover reveal -> mobile inline media per service or tap-to-select.
- Cursor reveal -> disabled on touch, while rows remain useful without it.
- Magnetic buttons -> disable or simplify on coarse pointers.
- Sticky stacking -> reduce or disable when it harms mobile usability.

Use `100svh` when appropriate instead of relying only on `100vh` on mobile.

---

## 7. Motion protocol

Use motion intentionally.

Preferred stack where required:
- GSAP + ScrollTrigger for scroll-linked sequences.
- Framer Motion for React state transitions, modals, stacking and presence.
- Lenis for smooth scrolling.
- CSS keyframes for simple marquee, pulse, cursor blink and micro-motion.

Motion rules:
- premium easing such as `power4.out` or equivalent cubic-bezier;
- no random animation just to make the page feel active;
- preserve content legibility;
- respect `prefers-reduced-motion`;
- do not run cursor physics on coarse touch devices;
- avoid excessive simultaneous heavy animations.

After fonts or large media load, refresh ScrollTrigger where needed.

---

## 8. Media + text composition rules

For cinematic cards and hero sections:

1. Keep the media as the visual layer.
2. Use HTML for titles, labels and CTAs.
3. Add overlays only as much as needed for readability.
4. Avoid crushing the video under heavy gradients.
5. Preserve strong contrast for CTA text.
6. Test the title at the worst frame of the video, not only the best frame.

A video should not contain copy that duplicates website copy.

---

## 9. Contact and conversion protocol

A portfolio demo is also a commercial asset.

Before final QA, ask for or resolve:
- WhatsApp.
- LinkedIn.
- Email.
- Optional calendar / booking link.

All contact CTAs must use real destinations.

Current PIXZEN contact implementation:
- WhatsApp: `https://wa.me/5491161396633`
- LinkedIn: `https://www.linkedin.com/in/pablo-solla-sdr`
- Email: `mailto:softwarepardeve@gmail.com`

Use prefilled WhatsApp text where appropriate.

Do not leave fictional addresses such as `hello@brand.ai` in a production portfolio unless the user explicitly wants a fictional brand identity.

---

## 10. GitHub Pages deployment protocol

For this portfolio repository, GitHub is both source control and free public hosting.

Deployment checklist:

1. Confirm the correct repository.
2. Keep private operational systems out of the public portfolio repository.
3. Confirm Next.js static export compatibility.
4. Confirm `basePath` / asset paths for project Pages hosting.
5. Verify `package-lock.json` exists when workflow uses npm install / npm ci.
6. Verify GitHub Actions completes successfully.
7. Do not assume green build means visual correctness.
8. Test published URL after each asset-sensitive change.
9. Use hard refresh after deployment when needed.
10. Test direct asset URLs when media fails.

If multiple commits trigger multiple Actions runs, wait for the latest commit / latest workflow before evaluating the site.

---

## 11. Debugging protocol

Never debug by changing multiple unrelated variables at once.

For a missing video:
1. inspect repo directory;
2. confirm exact filename;
3. confirm file size;
4. open public media URL;
5. confirm codec/browser playback;
6. inspect component src;
7. inspect z-index;
8. inspect opacity;
9. inspect blend mode;
10. inspect overlays.

For responsive overflow:
1. find the element with minimum width / large vw text / fixed width;
2. remove accidental `min-width` that exceeds viewport;
3. use max-width + width:100%;
4. retest 320px;
5. then retest intermediate widths.

For a failed GitHub build:
1. open latest workflow;
2. read the exact failed build step;
3. fix the root cause;
4. do not change unrelated frontend code;
5. rerun / trigger deployment;
6. verify latest run, not an older green run.

---

## 12. Quality gate by section

Before declaring a landing complete, audit each section:

### Navbar
- correct transparency / blur behavior;
- desktop nav;
- mobile fullscreen menu;
- contact CTA;
- no collisions at 320px.

### Hero
- final asset, not placeholder;
- correct framing desktop and mobile;
- typography matches prompt;
- typing / interaction works;
- contrast and overlays tuned;
- scroll indicator works.

### Brand / trust strip
- loop works;
- no visible seam;
- responsive spacing;
- hover behavior only where useful.

### Services
- exact requested layout on desktop;
- touch equivalent on mobile;
- every service has a final visual;
- transitions are smooth.

### Selected Work
- each project has a distinct visual identity;
- sticky stacking behaves correctly on desktop;
- mobile fallback is usable;
- CTA opens correct modal;
- modal uses final media, not old placeholder.

### About
- scroll text reveal works;
- typography does not clip;
- marquee works across viewports.

### Insights
- rows remain readable on mobile;
- cursor reveal stays inside viewport;
- touch devices do not depend on hover;
- thumbnails are portfolio quality.

### Contact
- CTA visible in all states;
- magnetic effect does not harm touch;
- real contact destination;
- secondary contact channels visible.

### Footer
- real links;
- responsive columns;
- no fictional email;
- no obsolete project information.

---

## 13. What to ask the user for

Ask only for information that cannot be inferred or created reliably.

Usually ask for:
- real contact details if not already known;
- a required real logo if brand-specific;
- copyrighted / proprietary assets the user owns and wants used;
- final business copy when accuracy matters;
- external credentials only when integration truly requires them.

Do not ask the user to create assets when the brief is sufficient and the asset can be generated or designed from the specification.

If the environment cannot directly generate a specific kind of asset, provide a precise generation prompt and exact upload instructions, then integrate it after upload.

---

## 14. What NOT to do again

- Do not say a section is complete while it still contains primitive placeholders.
- Do not invent an unrelated Hero visual when the prompt describes a specific media concept.
- Do not repeatedly change CSS when the asset itself has not been verified.
- Do not assume an uploaded binary kept the expected filename.
- Do not leave `.mp4.mp4` or duplicated assets unexplained.
- Do not evaluate a site before the latest workflow is deployed.
- Do not treat desktop responsive classes as sufficient mobile QA.
- Do not make all generated videos look like the same glass-and-particle AI aesthetic.
- Do not keep fake contact data in a portfolio intended to generate leads.
- Do not use Replit unless the user explicitly asks for it in this portfolio workflow.

---

## 15. Standard future workflow

For every new premium landing / web experience:

### Phase A — Brief
1. Parse prompt.
2. Build requirement checklist.
3. Identify unknowns.
4. Identify assets.
5. Define visual languages by section.

### Phase B — Architecture
6. Set stack.
7. Set design tokens.
8. Set component map.
9. Set animation map.
10. Set responsive strategy.

### Phase C — Asset production
11. Generate / source final visuals.
12. Verify dimensions and format.
13. Upload assets.
14. Verify exact filenames and sizes.
15. Test public asset URLs.

### Phase D — Implementation
16. Build section-by-section.
17. Wire real media.
18. Add interactions.
19. Add contact conversion paths.
20. Remove all placeholders.

### Phase E — Responsive QA
21. Test 320 / 375 / 430 / 768 / 1024 / 1440+.
22. Replace hover-only UX on mobile.
23. Fix typography and overflow.
24. Fix media framing.
25. Fix sticky and modal behavior.

### Phase F — Deployment QA
26. Build.
27. Validate latest GitHub Action.
28. Test production URL.
29. Test direct media URLs.
30. Hard-refresh production.

### Phase G — Final quality gate
31. Compare section-by-section with original prompt.
32. Mark each requirement PASS / FAIL.
33. Fix every FAIL.
34. Only then declare the landing complete.

---

## 16. Definition of done

A landing is done only when:

- every explicit prompt requirement is implemented or deliberately substituted with an equivalent approved solution;
- no obvious placeholder remains;
- all final media loads in production;
- all contact links are real;
- no broken routes / assets;
- desktop and mobile both feel designed, not merely compatible;
- animation behaves correctly;
- latest GitHub Actions deployment is green;
- production URL matches the current code;
- the experience is strong enough to be shown publicly as portfolio work.

This protocol should be reused for future SoftwarePar portfolio builds and updated whenever a new production lesson is discovered.
