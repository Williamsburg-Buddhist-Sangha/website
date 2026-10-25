# Content model

The contract between content files and the theme. Editors (people, Pages CMS, agents) change
`content/`, `data/` and `static/images/`. The theme lives in `layouts/` and `assets/`.

Two layouts read the same content (`hugo.toml [params] layout`):

- **classic** — a copy of the WordPress site (Charitas Lite theme + Divi). Templates in
  `layouts/_partials/classic/`. It uses the keys marked *(classic)* below.
- **modern** — designs A–F (`layouts/*.html`, frozen). It ignores the *(classic)* keys.

Body text is shared. It follows the production WordPress text word for word (typos included),
so both layouts show the same words.

## Pages — `content/<slug>.md`

```yaml
---
title: "Meditation groups"
description: "One-sentence summary (used for meta description and cards)."
slug: meditation-groups
aliases: ["/regular-meditation-groups/"]   # old WordPress URL, if different
menu:
  main:
    weight: 20
    parent: "About Us"          # only for sub-pages
hero_image: /images/foo.jpg      # optional
show_groups: true                # optional: list all groups + rosters after the body
people: teachers                 # optional: list data/people.yaml "teachers" or "board" after the body
---
Markdown body.
```

`show_groups` and `people` are structural keys, like `menu`, `aliases` and `slug`. They are not in
the Pages CMS forms; `settings.content.merge: true` in `.pages.yml` keeps them on save.
`show_groups: true` is set on `meditation-groups.md`, `people: teachers` on `meet-our-teachers.md`
and `people: board` on `board-of-directors.md`. The blocks render after the body text
(`layouts/page.html`, regular pages only).

Main menu order (weights) and labels (`menu.main.name`, the production WordPress labels):
Meditation groups 10, Events 20, Resources 30, Membership 40, About Us 50 (children: Vision,
Mission, and Values; Meet Our Teachers; Teacher Code of Ethics; Board of Directors; Bylaws &
Annual Report; Support), Contact Us 60. Page `title`s follow production too ("Meditation groups",
"Sangha Membership", "Contact Us", "Vision, Mission, and Values"); slugs and aliases do not change.
Support also appears top-level: modern shows a "Donate"/"Support" call-to-action button
(`params.donateURL` or `/support/`); classic prepends a "Support" menu item (→ `/support/`),
as production does. Menus are not edited in Pages CMS.

`About Us` is a real page (`content/about-us.md`) and also the parent menu entry
(`menu.main.identifier: "About Us"`).

## Markdown bodies

Page, event, events-intro and homepage bodies are edited in Pages CMS with the WYSIWYG
`rich-text` editor (TipTap). On every save of an edited body it re-writes the whole body as
Markdown. Keep bodies to what that editor can hold, so a save does not change the page:

- Paragraphs, headings (`#` to `####`), **bold**, *italic*, ~~strike~~, links, bulleted
  and numbered lists, block quotes, horizontal rules, images.
- Heading levels copy production: a WordPress `h1` in the page text is `#` (inner pages show
  no page title in classic, so the body `#` is the visible title line). Bold inside a heading
  (`# **Text**`) is kept where production has it.
- A horizontal rule (`---`) stands for a Divi divider line between two production text blocks. The editor writes underline as
  `++text++`; Hugo renders it as `<ins>` (`hugo.toml` goldmark extras `insert`).
- Line break inside a paragraph: two spaces at the end of the line (the editor writes this form;
  `\` at the end of a line also works in Hugo but the editor converts it).
- Links as `[text](url)`. Put bold/italic outside the link: `***[Title](url)***`, not
  `[***Title***](url)`. The editor writes autolinks `<https://…>` as `[https://…](https://…)`.
- No raw HTML, no Hugo shortcodes, no link around an image: the editor drops or breaks them.

Two block rules (`layouts/_partials/content.html`) replace the old shortcodes:

| Write in the body | Renders as |
|---|---|
| a link alone in its own paragraph: `[Donate Now](https://…)` (bold/italic allowed) | a primary button (`a.btn.btn--primary`), where the paragraph was |
| an image alone in its own paragraph: `![Alt text](/images/x.jpg)` | `<figure><img alt="Alt text" …></figure>` (no caption) |

A link with other text in the same paragraph stays a normal link. Where production shows a
column of plain links (About Us, Resources "Information about Buddhism – Online"), the links
share one paragraph with line breaks (two trailing spaces), so they do not turn into buttons. Links in list items, quotes
and tables stay normal links. Image captions are not supported: the editor keeps an image title
(`![alt](src "title")`) but has no field for it, so put the description in the alt text.

Legacy shortcodes (`button`, `callout`, `events`, `figure`, `groups`, `people` in
`layouts/_shortcodes/`) still render, but no content uses them and the rich-text editor breaks
them (it turns the URL in `href="…"` into a Markdown link). Do not add them to bodies.

## Meditation groups — `data/groups.yaml`

```yaml
groups:                          # in production page order
  - name: "Monday Evening Meditation"     # modern title
    heading: "Monday evenings at 7:00 pm" # (classic) production h1 line
    leader: "Led by Ben Thacker-Gwaltney" # (classic) optional h4 line
    day: Monday
    time: "7:00–8:30 pm"
    location: "Where (in person / Zoom / hybrid)"
    zoom_url: ""                 # optional (modern "Join on Zoom" button)
    description: "Markdown text before the roster table."
    roster:                      # monthly teacher schedule
      - date: 2026-10-05
        teacher: "Name"
    image: /images/open-heart-open-mind.jpg   # (classic) optional, after the roster
    image_link: https://a.co/d/iWCQNIM        # (classic) optional link around the image
    more: "Markdown after the roster/image (Zoom details, map links)."   # (classic)
```

Classic order per group: `heading` (h1) → `leader` (h4) → `description` → roster table →
`image` (linked when `image_link` is set) → `more`. The groups page closing paragraphs ("If you
haven't used Zoom before…") are the last group's `more`. In `description` and `more` a link
alone in its paragraph stays a plain link (production has no buttons there). `more` is a
rich-text field in Pages CMS; the other Markdown fields are plain text fields.
Modern shows `name`, `day`, `time`, `location`, `zoom_url`, `description`, `roster` only.

## People — `data/people.yaml`

```yaml
teachers:
  - name: "Name"
    role: ""
    photo: /images/people/name.jpg   # optional
    bio: "Markdown text."
board:
  - name: "Name"
    role: "President"
    photo: ""
    bio: ""
```

Order = production page order. Classic renders per person: photo (150 px wide) →
**Name** / role (one paragraph, line break) → bio → divider. Modern renders the same keys as cards.

## Events — `content/events/<yyyy-mm-dd>-<slug>.md`

```yaml
---
title: "Day-long Retreat"
date: 2026-11-08            # event start date (drives upcoming/past sorting)
end_date: 2026-11-08        # optional
time: "9:00 am – 4:00 pm"
location: "Parker House, ..."
map_url: ""                  # optional
teachers: ["Name", "Name"]
register_url: ""             # optional
register_label: ""           # optional button text (default "Register")
image: /images/events/x.jpg  # optional
featured: true               # show in homepage "upcoming" box
summary: "One or two sentences."
---
Markdown details.
```

`register_label` (optional, default "Register") is the text of the registration button, for
example "Join Waiting LIst" (production spelling).

The body is the production event text without the title and without the button.
`content/events/_index.md` holds the Events page intro text. Past events stay in the folder
and are shown under "Past events" (or hidden), never deleted.

Classic events page: one row, `featured: true` upcoming events (by date) in the 2/3 column,
the other upcoming events in the 1/3 column. Each event: title (h1) → body → button
(`register_url`, `register_label`). Classic does not show past events.

## Homepage — `content/_index.md` + `data/home.yaml`

```yaml
# content/_index.md front matter
title: "Williamsburg Buddhist Sangha"
tagline: "Short line under the site name"          # modern
hero_image: /images/hero.jpg                        # modern banner
hero_image_classic: /images/hero-classic.jpg        # (classic) 1920x714 photo, text baked in
# body = production left column, up to and including the "What to Expect at the WBS"
#        heading and paragraph
```

```yaml
# data/home.yaml
cards:            # 3–4 feature cards under the welcome text
  - title: "Meditation Groups"
    text: "Short text."
    link: /meditation-groups/
    image: /images/x.jpg     # optional
days:             # (classic) per-day summary under the body (production h2 / h4 / p / p)
  - heading: "Monday evenings"
    leader: "Rotating group leaders"     # optional (h4)
    where: "At the Wesley Foundation at 7:00 pm"   # optional plain line
    text: "Markdown."
days_outro: "See the [Meditation Groups page](/meditation-groups/) for …"   # (classic) h5 line
boxes:            # (classic) right column, top to bottom, with a divider before each
  - title: "Introduction to Buddhism"
    title_url: /events/      # optional: the title is a link
    small_title: false       # true → smaller title (h2, the newsletter boxes); else h1
    text: "Markdown."        # a link alone in its paragraph renders as a button
    embed: /meditation-groups/     # optional: WordPress-embed-style card of that page
    box_link: /meditation-groups/  # optional: whole box clickable (new tab)
    button_label: "Subscribe"      # optional button under the text
    button_url: "https://…"
```

Modern homepage: banner, body, `cards`, and the next `featured: true` event (date >= today).
Classic homepage: `hero_image_classic` → one row: left column (3/5) = body, `days`,
`days_outro`; right column (2/5) = `boxes`. In production the whole left text block (the
"What to Expect" heading, paragraph, days and outro) is one clickable module → /meditation-groups/
(new tab), like the yoga box.

## Site settings — `hugo.toml` `[params]`

`preview`, `defaultDesign`, `description`, `logo`, `email`, `address`, `donateURL`, `newsletterURL`.

## Images — `static/images/`

Subfolders: `people/`, `events/`, root for page images. Max width 1600 px, JPEG/WebP/PNG.
Exception: `hero-classic.jpg` is the unchanged 1920×714 production banner.
