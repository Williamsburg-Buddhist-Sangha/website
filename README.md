# Williamsburg Buddhist Sangha website

Static website for the Williamsburg Buddhist Sangha, built with [Hugo](https://gohugo.io/).

This is a preview build (set to `noindex`) of a proposed replacement for the
current WordPress site. It is not the live site.

## Run locally

Install Hugo extended v0.154.3 or later, then run:

    hugo server

The site is served at http://localhost:1313/website/.

## Content

- `CONTENT-MODEL.md` describes the content types, front matter and data files.
- `DESIGNS.md` describes the design variants and their layouts.

## Editing

Content can be edited through [Pages CMS](https://pagescms.org/). The
configuration is in `.pages.yml`.

## Deploys

The GitHub Actions workflow `.github/workflows/pages.yml` builds the site and
publishes it to GitHub Pages. It runs on every push to `main`, on manual
dispatch, and once a day at 09:00 UTC. The daily rebuild moves events from
"upcoming" to "past" because that decision is made at build time.
