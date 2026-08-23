# NEXORA build recovery

The repeated GitHub Pages failures were caused by keeping multiple experimental NEXORA TSX versions inside `components/nexora` while `tsconfig.json` includes every `**/*.tsx` file. Unreferenced experimental files are still type-checked by Next.js/TypeScript during `npm run build`.

Recovery procedure:
1. Remove obsolete experimental TSX versions that are not part of the current route.
2. Keep one active production component plus known-good reusable components.
3. Type-check new components before routing them publicly.
4. Only switch `app/nexora/page.tsx` after the component is build-safe.
5. Confirm GitHub Actions is green before continuing visual iterations.

V12 follows this procedure and targets the supplied high-density enterprise AI command-center reference.
