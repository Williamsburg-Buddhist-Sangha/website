# Designs

> The build currently uses the **Classic** layout (`params.layout = "classic"`), which
> ignores everything about designs below. See [Layout switch](#layout-switch).

The site has one set of templates and several switchable **designs**. A design is one CSS
file that restyles the shared markup. The active design is the `data-design="<id>"`
attribute on `<html>`.

```
assets/css/base.css          structural base: layout, grid, spacing, component structure,
                             neutral fallback tokens, preview switcher
assets/css/designs/<id>.css  one file per design, everything scoped to [data-design="<id>"]
hugo.toml [[params.designs]] registry: id, name, fonts (switcher order = file order)
```

Hugo Pipes concatenates `base.css` + every `assets/css/designs/*.css` (alphabetical) into
one minified, fingerprinted `css/main.css` (see `layouts/_partials/head.html`).

## Add a design

1. Pick a lowercase id (`[a-z0-9-]`, e.g. `c`).
2. Create `assets/css/designs/c.css`. Start with the token blocks (copy the list below),
   then add component overrides. Light palette first, then the dark palette:

   ```css
   [data-design="c"] { --bg: #fff; --text: #222; /* ...all tokens... */ }
   @media (prefers-color-scheme: dark) {
     [data-design="c"] { color-scheme: dark; --bg: #111; /* ... */ }
   }
   [data-design="c"] .hero { /* layout changes */ }
   ```
3. Add a registry entry to `hugo.toml` (the switcher shows entries in this order):

   ```toml
   [[params.designs]]
     id = 'c'
     name = 'Editorial'
     fonts = 'https://fonts.googleapis.com/css2?family=...&display=swap'   # or ''
   ```
4. Preview: `hugo server --port 1320` then open `/website/?design=c`.
   Check light and dark at 1280 px and 400 px.
5. Build: `hugo --gc --minify` must exit 0 with no warnings.

`params.defaultDesign` picks the design for first-time visitors (and for the `<noscript>`
font fallback). Without `[[params.designs]]` the theme falls back to a single design,
`defaultDesign` (switcher hidden).

## Rules for a design file

- **Every selector in `designs/<id>.css` starts with `[data-design="<id>"]`** — also inside
  `@media` blocks. No bare element/class selectors, no `:root`, no other design's id.
  Selector lists count too: `[data-design="c"] h2, h3 {}` leaks `h3` to every design —
  write `[data-design="c"] :is(h2, h3)`.
- Do not edit `base.css`, templates, or other designs' files. If a layout needs markup
  that does not exist, ask for a new hook instead.
- Define the **dark palette** under `@media (prefers-color-scheme: dark)`, with
  `color-scheme: dark`.
- Keep WCAG AA: body text ≥ 4.5:1, large text and focus rings ≥ 3:1 against their ground.
  Keep a visible `:focus-visible` style (base gives `outline: 3px solid var(--focus)`).
- Fonts only via the registry `fonts` URL (Google Fonts). Always give a full system
  fallback stack in `--font-body` / `--font-heading`.
- No JS. CSS only. Layout changes (grid → list, split hero, sidebar, etc.) are fine.
- Local images (`/images/...` in content, front matter or data) get `width`/`height` attributes
  from the file (`layouts/_partials/img-size.html`), so the browser reserves their box before
  they load and lazy images no longer change the page height. Base sets `height: auto`; a
  design that crops an image should set `aspect-ratio` or an explicit height.
- Images may be missing (`hero_image`, event `image`, card `image`, person `photo` are all
  optional); designs must look complete without them.
- The page must not scroll horizontally at 400 px.

## How selection works

- `<html data-design="<defaultDesign>">` is rendered server-side.
- An inline script in `<head>` (before CSS) runs `window.wbsSetDesign(id)`:
  default → stored choice (`localStorage["wbs-design"]`) → `?design=<id>` URL query
  (preview builds only). It validates the id against the registry, sets `data-design`,
  and injects that design's `fonts` stylesheet once (`<link id="wbs-font-<id>">`).
- The preview switcher (bottom-right; buttons ≥ 56em, `<select>` below) calls
  `wbsSetDesign(id, true)` and rewrites `?design=` so links can be shared.

## Tokens

Defined with neutral values in `base.css` `:root` (light + dark). A design should set all
of them. Shared, non-design tokens (do not override unless needed): spacing
`--s-3 .25rem, --s-2 .5rem, --s-1 .75rem, --s0 1rem, --s1 1.5rem, --s2 2rem, --s3 3rem,
--s4 4rem, --s5 6rem`, `--gutter`, `--measure` (65ch prose width), `--wide` (72rem content
width), `--font-system`, `--font-serif-system`.

| Group | Tokens |
|---|---|
| Ground | `--bg`, `--surface`, `--surface-2` (tinted band), `--surface-3` (badges), `--border` |
| Text | `--text`, `--muted`, `--heading`, `--heading-2` (section/h2), `--eyebrow` (small caps labels) |
| Links / actions | `--link`, `--link-hover`, `--primary`, `--primary-hover`, `--on-primary`, `--accent`, `--accent-hover`, `--on-accent` (Donate, Subscribe), `--focus` |
| Header | `--header-bg`, `--header-fg`, `--header-rule` |
| Footer | `--footer-bg`, `--footer-fg`, `--footer-muted`, `--footer-link`, `--footer-rule` |
| Hero | `--hero-bg`, `--hero-fg`, `--hero-overlay` (gradient or `none`) |
| Logo | `--logo-chip` (background behind the logo image; logo PNG has an opaque white ground — light mode blends it with `mix-blend-mode: multiply`, dark mode needs a light chip) |
| Tags / avatars | `--tag-bg`, `--tag-fg`, `--avatar-0`, `--avatar-1`, `--avatar-2`, `--avatar-fg` |
| Type | `--font-body`, `--font-heading`, `--body-size`, `--line`, `--heading-weight`, `--heading-tracking`, `--heading-line` |
| Labels | `--eyebrow-transform`, `--eyebrow-tracking`, `--eyebrow-size`, `--eyebrow-weight` |
| Shape | `--radius`, `--radius-lg`, `--btn-radius`, `--shadow`, `--shadow-hover` |
| Rhythm | `--section-pad` (vertical padding of homepage sections) |
| Nav | `--nav-weight`, `--nav-size`, `--nav-transform`, `--nav-tracking` |

## Markup hooks (stable class names)

Block__element--modifier naming. Restyle freely; do not rely on element order beyond what
is listed. `.container` = centred box `max-width: var(--wide)` with side gutters.

### Every page

| Hook | Element / notes |
|---|---|
| `body.is-home` / `body.is-page` / `body.is-section` / `body.is-404` | page kind |
| `body.section-<section>` (e.g. `section-events`), `body.page-<file-name>` (e.g. `page-meditation-groups`) | per-page targeting |
| `.skip-link` | skip to `#main` |
| `.site-header` > `.site-header__inner.container` | sticky header; JS adds `.is-open` on `.site-header` when the mobile menu is open |
| `.brand` > `img.brand__logo` (or `svg.brand__mark` + `.brand__text` > `.brand__line1`, `.brand__line2` when no logo) | `.brand--footer` in the footer |
| `.nav-toggle` > `.nav-toggle__bars`, `.nav-toggle__label` | mobile menu button (hidden ≥ 62em) |
| `nav.site-nav` > `ul.menu` > `li.menu__item` (`.has-sub`, `.is-active`, `.is-open`) > `a.menu__link` (`[aria-current=page]`) | main menu; desktop breakpoint 62em |
| `button.sub-toggle`, `ul.submenu` > `li` > `a` | About Us dropdown |
| `a.site-nav__cta.btn.btn--accent.btn--small` | Donate button |
| `main#main` | |
| `footer.site-footer` > `.site-footer__grid.container` > `.site-footer__col` ×4: `.site-footer__about`, `.site-footer__visit` (`address.site-footer__address`), `.site-footer__contact`, `nav.site-footer__explore` | headings `h2.site-footer__heading`, lists `ul.site-footer__list` |
| `.site-footer__bottom.container` | copyright + support link |
| `.design-switcher` | preview pill — base styles it; designs should leave it alone |

### Shared components

| Hook | Notes |
|---|---|
| `.btn` + `.btn--primary` / `.btn--accent` / `.btn--ghost`, sizes `.btn--small` / `.btn--large` / `.btn--block`; `.btn-row` | buttons. In page bodies a link alone in its own paragraph renders as a bare `a.btn.btn--primary` child of `.prose` (no `<p>`), the same markup as the legacy `button` shortcode |
| `.eyebrow` | small label above titles |
| `.section` > `.container`; `.section-head` > `.eyebrow`, `h2.section-title`, `p.section-lede`; `.section-title--small` | homepage sections |
| `.page-header` > `.page-header__inner.container` > `p.eyebrow` (parent menu link, optional), `h1.page-title`, `p.page-lede` (description, optional), `span.ornament` (hidden in base; decorative) | inner-page title band |
| `.page-banner-wrap.container` > `figure.page-banner` > `img` | page `hero_image` (optional) |
| `.page-body.prose` | Markdown body; children limited to `--measure` |
| `.wide` | groups and people blocks (and legacy shortcode output) that break out of the prose column to `--wide` (left-aligned by default; centre it if your prose column is centred) |
| `.prose > figure` > `img` | an image alone in its own paragraph of a page body (no caption) |
| `aside.callout` > `p.callout__title` (optional) | legacy callout shortcode (not used in content) |
| `.date-badge` > `.date-badge__month`, `.date-badge__day`, `.date-badge__year` (compact only) | event date chip |
| `.facts` > `div` > `dt` + `dd`; `.facts--inline` | label/value lists (groups, event sidebar) |
| `.tag` | small pill (roster "Next") |
| `.notice`, `.empty-note`, `.back-link` | |
| `.avatar-initials[data-tone=0|1|2]` | initials fallback when a person has no photo |

### Homepage (`layouts/home.html`)

| Hook | Notes |
|---|---|
| `section.hero` + `.hero--image` or `.hero--no-image` | hero |
| `.hero__media` > `img` | only with `hero_image` |
| `.hero__content.container` > `p.eyebrow.hero__eyebrow`, `h1.hero__title`, `p.hero__tagline`, `.btn-row` > `.btn--primary` ("Join us for meditation"), `.btn--ghost.hero__secondary` ("Upcoming events") | |
| `section.section.welcome` > `.welcome__grid.container` (+ `.welcome__grid--single` when no featured event) | |
| `.welcome__text.prose` | optional `h2.section-title` "Welcome" (omitted when content starts with a heading) + body |
| `aside.featured-event` > `p.eyebrow`, `img.featured-event__img` (optional), `.featured-event__body` > `.featured-event__head` (`.date-badge` + `h3.featured-event__title`), `p.featured-event__meta`, `p.featured-event__summary`, `.btn-row` | only when a `featured: true` event is upcoming |
| `section.section.practice` > `.container` > `.section-head`, `ul.practice-list` > `li.practice-item` > `p.practice-item__day`, `h3.practice-item__name` > `a` (whole item clickable), `p.practice-item__meta`; `p.practice__more` | groups from `data/groups.yaml` |
| `section.section.cards` > `.container` > `ul.card-grid` > `li.card` (`.card--image` when it has an image) > `img.card__img`, `.card__body` > `h3.card__title` > `a.card__link` (stretched link), `p`, `span.card__arrow` | `data/home.yaml` cards |
| `section.section.newsletter` > `.container` > `.newsletter__inner` > `div` (`h2.section-title`, `p`) + `a.btn.btn--accent` | when `params.newsletterURL` is set |

### Meditation groups (page `/meditation-groups/`, front matter `show_groups: true`)

Rendered by `layouts/page.html` inside `.prose.page-body`, after the body text
(`layouts/_partials/groups.html`; the legacy `{{< groups >}}` shortcode calls the same partial).

| Hook | Notes |
|---|---|
| `.wide.groups` > `article.group#<anchor>` | one per group; `.group` has two children |
| `.group__info` > `p.group__day`, `h2.group__name`, `dl.facts.facts--inline` (When/Where), `.group__desc` (Markdown), `p.group__zoom` > `a.btn` (optional) | |
| `.group__roster` > `table.roster` > `caption`, `thead`, `tbody` > `tr` (`.is-past`, `.is-next`) > `td` (date `time` + optional `.tag`), `td` (teacher) | only when the group has a roster |

### Events (`/events/`, single event, legacy `{{< events >}}`)

| Hook | Notes |
|---|---|
| `section.events-block` > `h2.section-title` + list | upcoming |
| `ul.event-list` > `li.event-item` > `.date-badge`, `.event-item__body` > `h3.event-item__title` > `a` (stretched), `p.event-item__meta` > `span`×(1–3), `p.event-item__summary`, `p.event-item__actions` > `a.event-item__register.btn.btn--primary.btn--small` | `.event-list--compact` / `.event-item--compact` for past events (no summary, no Register, badge shows year). The Register link renders only when the event has `register_url`; it carries a visually hidden "for <title>". The title link is stretched over the whole item, so give `.event-item__register` `position: relative; z-index: 1` (every design does) or it cannot be clicked. |
| `section.events-block--past` > `details.past-events` > `summary` > `h2.section-title.section-title--small` > `span.count` | collapsed past events |
| `.wide.events-embed` | wrapper when the list comes from the legacy `events` shortcode (not used in content) |
| `article.event` > `header.page-header` (`p.eyebrow` link, `h1.page-title`, `p.page-lede.event__when`) | single event |
| `.event__layout.container` > `.event__main` (`p.notice` if past, `figure.event__image`, `p.event__summary`, `.prose`) + `aside.event__facts` (`dl.facts`, Register `a.btn--primary.btn--block`) | |

### People (front matter `people: teachers` or `people: board`)

Rendered by `layouts/page.html` inside `.prose.page-body`, after the body text
(`layouts/_partials/people.html`; the legacy `{{< people "key" >}}` shortcode calls the same partial).

| Hook | Notes |
|---|---|
| `ul.wide.people` > `li.person` > `img.person__photo` or `span.person__photo.avatar-initials`, `.person__body` > `h3.person__name`, `p.person__role`, `.person__bio` | photo/role/bio optional |

### Other pages

| Page | Hooks |
|---|---|
| Plain pages (`page.html`) | `.page-header`, optional `.page-banner`, `.container` > `.page-body.prose` |
| Sections (`section.html`) | as above + `ul.card-grid.section-list` > `li.card` |
| 404 | `section.notfound` > `.notfound__inner.container` > `p.eyebrow`, `h1.page-title`, `p.page-lede`, `.btn-row` |

### Which page has what

| Page | Components |
|---|---|
| `/` | hero, welcome (+ featured event), practice, cards, newsletter |
| `/meditation-groups/` | page-header, page-banner (if image), prose, groups (after the prose text) |
| `/events/` | page-header, prose (intro text, optional), events-block (upcoming), past-events |
| `/events/<slug>/` | event single |
| `/meet-our-teachers/`, `/board-of-directors/` | page-header, prose, people |
| other pages | page-header, prose (lists, tables, figures, buttons) |

## Layout switch

`hugo.toml` `[params] layout` picks one of two template sets at build time:

| `layout` | What renders | Loads |
|---|---|---|
| `"classic"` (current) | a reproduction of the production WordPress site (Charitas Lite theme + Divi Builder page bodies) | `css/classic.css` (Hugo Pipes: `assets/css/classic/*.css` in file-name order → concat → fingerprint; not minified, because the minifier lowercases font-family names), `js/classic.js` (defer), Google Fonts Arimo + Archivo Narrow 400/700 and Lato (the same families and weights production loads) |
| `"modern"` (or the key missing) | designs A–F, everything above this section | `css/main.css`, `js/site.js`, the active design's fonts |

- `layouts/baseof.html` dispatches: classic → `partial "classic/document.html"` (not
  `classic/baseof.html`: Hugo treats any file named `baseof.html` as a base template). The
  modern branch is the old `baseof.html`, unchanged. With `layout = "modern"` the build is
  byte-identical to commit 924e5fd (same content; minified and unminified; also with
  `switcher = true`). Modern templates and CSS are frozen; do not edit them for Classic.
- Classic templates: `layouts/_partials/classic/`. `document.html` renders head, `#toolbar`,
  `header#branding` > `#sticky_navigation` (`#site-navigation`), the home `#teaser` or the inner-page
  title band `.teaser-page-list` (h1 title + `#rootline` breadcrumbs),
  `#main` > (home | `#primary` events | event | 404 | page), `#colophon`. It dispatches by page
  kind. Page bodies go through `classic/content.html`: a **bold** link alone in its paragraph →
  `a.btn.btn--primary` (styled as the Divi button), a plain link alone stays a paragraph
  (modern's `content.html` turns any link alone into a button), image alone → `<figure>`.
  It re-uses `url.html`, `img-size.html`, `site-info.html`, `events-split.html`, `menu-href.html`.
- Classic markup copies production's ids and Divi class names (`.et-l`, `.et_pb_section`,
  `.et_pb_row`, `.et_pb_column_3_5` …, `.et_pb_text`, `.et_pb_divider`, `.et_pb_button`), so the
  CSS follows production's numbers. Body `<hr>` → Divi divider between text modules.
  Per-page module design (production's `et-builder-module-design-deferred` CSS) lives in
  `assets/css/classic/30-pages.css`, keyed by `body.page-<file-name>` / `body.is-home` / `body.is-events`.
- Classic uses the Classic-only fields of `CONTENT-MODEL.md` (`hero_image_classic`, home
  `days`/`days_outro`/`boxes`, group `heading`/`leader`/`image`/`image_link`/`more`, event
  `register_label`) and ignores modern-only content (tagline, cards, "Sit with us", design E data).
  It has no dark mode (production has none) and no design switcher.
- JS off: the About Us dropdown works with `:hover`/`:focus-within`, the mobile menu (≤ 768 px) is a
  `<details>` disclosure with sub-menus open, and the header is static instead of sticky.
- Switch back: set `layout = "modern"` (or delete the key) and rebuild. Nothing else changes.

## Regression testing

Screenshots were compared before/after the refactor with a CDP screenshot script and a
pixel diff (scratch tools, not in the repo). When editing a design, compare at least
home, meditation-groups, events and meet-our-teachers at 1280 and 400 px, light and dark.
