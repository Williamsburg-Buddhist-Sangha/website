# Content model

The contract between content files and the theme. Editors (people, Pages CMS, agents) change
`content/`, `data/` and `static/images/`. The theme lives in `layouts/` and `assets/`.

## Pages — `content/<slug>.md`

```yaml
---
title: "Meditation Groups"
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

Main menu order (weights): Meditation Groups 10, Events 20, Resources 30, Membership 40,
About Us 50 (children: Vision, Mission & Values; Meet Our Teachers; Teacher Code of Ethics;
Board of Directors; Bylaws & Annual Report; Support), Contact 60. Support also appears top-level
as a "Donate"/"Support" call-to-action button (`params.donateURL` or `/support/`).

`About Us` is a real page (`content/about-us.md`) and also the parent menu entry
(`menu.main.identifier: "About Us"`).

## Markdown bodies

Page, event, events-intro and homepage bodies are edited in Pages CMS with the WYSIWYG
`rich-text` editor (TipTap). On every save of an edited body it re-writes the whole body as
Markdown. Keep bodies to what that editor can hold, so a save does not change the page:

- Paragraphs, headings (`##`, `###`, `####`), **bold**, *italic*, ~~strike~~, links, bulleted
  and numbered lists, block quotes, horizontal rules, images. The editor writes underline as
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

A link with other text in the same paragraph stays a normal link. Links in list items, quotes
and tables stay normal links. Image captions are not supported: the editor keeps an image title
(`![alt](src "title")`) but has no field for it, so put the description in the alt text.

Legacy shortcodes (`button`, `callout`, `events`, `figure`, `groups`, `people` in
`layouts/_shortcodes/`) still render, but no content uses them and the rich-text editor breaks
them (it turns the URL in `href="…"` into a Markdown link). Do not add them to bodies.

## Meditation groups — `data/groups.yaml`

```yaml
groups:
  - name: "Monday Evening Meditation"
    day: Monday
    time: "7:00–8:30 pm"
    location: "Where (in person / Zoom / hybrid)"
    zoom_url: ""                 # optional
    description: "Markdown text."
    roster:                      # monthly teacher schedule
      - date: 2026-10-05
        teacher: "Name"
```

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
image: /images/events/x.jpg  # optional
featured: true               # show in homepage "upcoming" box
summary: "One or two sentences."
---
Markdown details.
```

`content/events/_index.md` holds the Events page intro text. Past events stay in the folder
and are shown under "Past events" (or hidden), never deleted.

## Homepage — `content/_index.md` + `data/home.yaml`

```yaml
# content/_index.md front matter
title: "Williamsburg Buddhist Sangha"
tagline: "Short line under the site name"
hero_image: /images/hero.jpg
# body = welcome text (Markdown)
```

```yaml
# data/home.yaml
cards:            # 3–4 feature cards under the welcome text
  - title: "Meditation Groups"
    text: "Short text."
    link: /meditation-groups/
    image: /images/x.jpg     # optional
```

The homepage also shows the next `featured: true` event (date >= today) automatically.

## Site settings — `hugo.toml` `[params]`

`preview`, `defaultDesign`, `description`, `logo`, `email`, `address`, `donateURL`, `newsletterURL`.

## Images — `static/images/`

Subfolders: `people/`, `events/`, root for page images. Max width 1600 px, JPEG/WebP/PNG.
