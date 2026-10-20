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
---
Markdown body.
```

Main menu order (weights): Meditation Groups 10, Events 20, Resources 30, Membership 40,
About Us 50 (children: Vision, Mission & Values; Meet Our Teachers; Teacher Code of Ethics;
Board of Directors; Bylaws & Annual Report; Support), Contact 60. Support also appears top-level
as a "Donate"/"Support" call-to-action button (`params.donateURL` or `/support/`).

`About Us` is a real page (`content/about-us.md`) and also the parent menu entry
(`menu.main.identifier: "About Us"`).

## Shortcodes available in Markdown bodies

| Shortcode | Use |
|---|---|
| `{{< button href="URL" >}}Label{{< /button >}}` | Call-to-action button |
| `{{< callout >}}Markdown{{< /callout >}}` | Highlighted note box |
| `{{< groups >}}` | Renders all meditation groups + rosters from `data/groups.yaml` |
| `{{< events >}}` | Renders upcoming events list from `content/events/` |
| `{{< people "board" >}}` | Renders a people list from `data/people.yaml` key `board` (or `teachers`) |
| `{{< figure src="/images/x.jpg" alt="..." caption="..." >}}` | Hugo built-in |

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
