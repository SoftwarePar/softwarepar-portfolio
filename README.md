# SoftwarePar Portfolio

Public showcase for SoftwarePar digital experiences, interactive landing pages and product demonstrations.

## PIXZEN — deployment and asset protocol

This repository is deployed to GitHub Pages through GitHub Actions and Next.js static export.

### Binary asset rule

For videos and other binary assets, verify the **exact filename and actual file size in `public/` before wiring the component**. Do not assume the browser or GitHub upload UI preserved the intended name.

The PIXZEN hero issue exposed the failure mode clearly:

- `public/hero_bg_animation_hand.mp4` was an old 7.8 KB placeholder.
- the real uploaded video was stored as `public/hero_bg_animation_hand.mp4.mp4` and was ~2.7 MB.
- the component was technically correct but referenced the wrong binary.

### Required workflow for future assets

1. Upload or create the binary asset in `public/`.
2. Inspect the `public/` directory in GitHub and confirm **exact path, extension and size**.
3. If a same-name placeholder already exists, delete or rename it before wiring the component.
4. Reference the verified asset path from the component.
5. Let GitHub Actions finish successfully.
6. Test the asset URL directly in the browser before debugging CSS or React.
7. Only after the direct asset works, apply presentation effects such as opacity, blend modes, filters, halftone, crop and overlays.
8. Keep one canonical production file per asset to avoid ambiguous names such as `.mp4.mp4`.

### PIXZEN hero treatment

The current hero uses a monochrome human/robot hand video with editorial treatment: warm-white background, grayscale/luminosity blending, halftone overlay, centered oversized typography and animated typing phrases.

### Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Framer Motion
- Lenis
- Lucide React

This repository is exclusively for public portfolio work. Private operational systems are intentionally kept outside this repository.