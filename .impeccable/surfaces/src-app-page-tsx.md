---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Home (src/app/page.tsx)

Scope: header (avatar, name, role), hero bio, projects list. Visitor mode: Experience, read-like: the text and the work lead, the interface recedes.

Audience: engineers, founders, recruiters arriving from GitHub/X/LinkedIn. Job: learn who Luan is and open a project or profile. Proof: echo and better-intl, real links. Constraints: English and Portuguese, dark, light and dawn themes (system light or dark by default) picked in the dock, Central Icons, coss tokens.

## Direction contract

THESIS: A single quiet column where the copy and two real projects carry the page; it refuses the hero-headline, CTA-button, skills-grid portfolio.

OWN-WORLD: Near-black neutral ground (coss dark tokens), three text tiers (foreground, foreground/70, muted), Inter at 16px, hairline underlines on links, 1.5px Central Icons in currentColor, 44px rounded project tiles with a faint ring. No accent color.

STORY: Visitor sees a face and a name, reads two short paragraphs about what Luan builds and where, then picks echo or better-intl, or follows GitHub/X/LinkedIn inline links.

FIRST VIEWPORT: 576px column, top-left aligned, ~112px from top on desktop. Avatar 40px beside name/role, bio 32px below, Projects heading ~80px below the bio, two project rows visible without scrolling.

FORM: Brief-pinned reference form (Krehel / Robinson / Kowalski / interfaces.dev text portfolio). No concept roll: precisely specified narrow request with pinned references. Seed key: none (pinned). Signature interaction: one staggered blur-up entrance (header, bio, projects, 100ms apart); project row hover reveals an arrow and brightens the underline.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
