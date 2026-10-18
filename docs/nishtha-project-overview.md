# Nishtha — Evidence Before Trust

## What we built

Nishtha is a cinematic, evidence-first opportunity research workspace for the moment before someone commits to an opportunity.

People regularly receive job offers, fellowships, grants, internships, courses, residencies, and investment opportunities that look promising but contain unclear claims, urgency, payment requests, or incomplete information. Instead of immediately labeling something “safe” or “unsafe,” Nishtha helps users understand:

```text
what was actually said → what the text supports → what remains unknown → what to ask next
```

The product combines an editorial landing page, a real-time 3D evidence desk, a contextual guide called Nishi, a local investigation flow, explainable reports, source provenance, saved cases, a next-action checklist, light/dark themes, and Vercel deployment support.

### Product highlights

#### Cinematic landing page

The landing page uses a warm paper, ink, muted olive, and signal rust design system. It includes editorial typography, responsive navigation, scroll-based reveals, a process timeline, evidence philosophy sections, a safety interlude, and a clear investigation CTA.

The landing page is intentionally different from a generic futuristic AI dashboard. It feels more like a considered research room or independent editorial studio.

#### Real-time 3D evidence desk

The hero contains a procedural React Three Fiber / Three.js scene with:

- A floating opportunity document
- A magnifying glass
- Source and claim markers
- A paper-inspired Nishi character
- Soft lighting and shadows
- A continuous animated loop
- A scan sweep across the document
- Ambient orbit lines
- Pointer-based parallax
- Clickable evidence markers
- Contextual hotspot explanations

The scene is lazy-loaded and does not require a hosted video, paid 3D model, external texture, API key, or external service. WebGL detection, a motion-safe fallback, reduced-motion support, viewport pausing, and a Canvas error boundary keep the rest of the application usable if rendering fails.

#### Nishi, the guide

Nishi is a custom paper-evidence companion, not a fake chatbot. Nishi provides contextual help on the landing page, investigation workspace, report, sources, and saved cases.

Nishi supports start-investigation navigation, evidence explanations, unresolved-question guidance, saved-case access, open/close/minimize/reopen behavior, keyboard focus handling, Escape-to-close, reduced-motion preferences, and a dismissible first-visit introduction.

Nishi never decides whether an opportunity is legitimate. It helps users navigate and understand evidence.

#### Input-responsive investigations

Users can paste their own opportunity text or select a fictional sample case:

- Fee request
- Promising, incomplete
- More specific, still open

The local deterministic analyzer detects visible signals such as fee language, urgency, strong promises, contacts, organization details, and missing refund terms. It preserves exact excerpts from the supplied text and generates follow-up questions.

The analyzer is intentionally transparent. It does not browse the web, call an AI API, or claim to perform independent verification.

#### Explainable reports

Each investigation produces an evidence report with:

- Evidence coverage
- Coverage breakdown
- Observed signals
- Unverified claims
- Source-aligned details
- Exact evidence quotes
- `CAN SUPPORT` boundaries
- `CANNOT SUPPORT` boundaries
- Open questions
- A next-action checklist
- Progress tracking
- Save case and copy summary actions

The coverage number is clearly presented as an evidence-availability measure, not a fraud probability, legitimacy verdict, guarantee, or external verification result.

#### Saved cases and provenance

Cases are saved locally in the browser. Users can save a report, reopen it from Cases, preserve checklist progress, review the original evidence trail, and open a provenance view showing what the supplied material can and cannot support.

No user case data is sent to an external service in this prototype.

## Who it is for

### Students and early-career applicants

Students often receive internship, fellowship, scholarship, training, and placement offers. Nishtha helps them examine registration fees, urgency pressure, guaranteed-placement claims, unclear organizations, unfamiliar domains, and requests for documents or money.

### Job seekers and freelancers

People searching for jobs, gigs, contracts, and remote work can use Nishtha to examine payment requests, vague employers, unrealistic claims, missing contracts, unclear ownership, and pressure to act quickly.

### First-generation opportunity seekers

Users unfamiliar with professional, academic, or grant processes may not know which signals deserve attention. Nishtha presents evidence in a friendly, non-judgmental way without assuming prior expertise.

### Advisors, mentors, and support organizations

Career counselors, mentors, student-support teams, and community organizations can use Nishtha as a conversation tool. Instead of simply saying “this looks suspicious,” they can walk through what the message says, what is missing, and which questions should be asked.

### Careful decision-makers

Nishtha is for anyone who prefers a considered next step over an instant answer.

## How we used OmniRush

OmniRush was used as the primary software engineering partner throughout development.

### Workspace and setup

OmniRush inspected the workspace, dependencies, routes, build system, and design requirements. The workspace was initially empty, so OmniRush established a clean React/Vite foundation with React Three Fiber, Three.js, Drei, Node version pinning, an npm lockfile, Docker support, a Makefile, README documentation, tests, and deployment configuration.

### Product and visual direction

OmniRush translated the evidence-first concept into a distinct visual language instead of producing a generic AI interface. It helped define the color tokens, editorial typography, evidence-state vocabulary, landing page structure, report flow, Nishi behavior, motion rules, responsive breakpoints, accessibility requirements, and WebGL fallback strategy.

### Implementation

OmniRush implemented:

- Landing page and responsive navigation
- Hash-based routed views
- Investigation workspace
- Local heuristic analyzer
- Evidence report
- Provenance view
- Saved cases
- Nishi guide
- Light/dark theme switching
- Three.js evidence scene
- WebGL fallback and error recovery
- Responsive UI
- Vercel deployment configuration

### Review and debugging

Focused reviews were used to inspect the UI, hackathon differentiation, 3D performance, accessibility, runtime behavior, and deployment requirements.

One review identified the key 3D failure: the scene referenced an undefined `progress` variable during its initial render. That caused the Canvas to fail and display only the fallback. OmniRush fixed the root cause and added a scene-level error boundary so future rendering failures cannot crash the whole page.

### Verification

The following checks pass:

```bash
npm test
npm run build
```

The tests cover guide routing, input-responsive evidence extraction, quote preservation, different reports for different input, and honest uncertainty behavior. The production build completes successfully. The only remaining build notice is a non-blocking warning about the size of the lazily loaded Three.js chunk.

The app was also served locally and verified with an HTTP `200 OK` response.

## Deployment

The project is configured for Vercel using `vercel.json`, Node.js `22.14.0`, `npm ci`, `npm run build`, the `dist` output directory, and SPA rewrites for routes such as `/#investigate` and `/#report`.

No backend, secret, external model, or API key is required for the core experience.

## Core promise

> Before you trust it, trace the claim.

Nishtha does not try to make decisions for people. It makes the evidence, uncertainty, and next question easier to see.
