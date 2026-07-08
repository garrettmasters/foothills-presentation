# Foothills Leadership Deck

A leadership presentation for Foothills Church covering findings from the communication survey, current process, and technology at the church.

**Live deck:** https://garrettmasters.github.io/foothills-presentation/

## Controls

- `→` / `Space` — advance to the next slide
- `←` — go back
- `N` — toggle speaker notes
- `H` — hide the notes UI entirely (the "Notes" button and panel) so nothing shows when presenting on a shared screen; press `H` again or `N` to bring it back

## Development

Requires Node.js 18+.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static site to `dist/`, which is deployed automatically to GitHub Pages on every push to `main` via [GitHub Actions](.github/workflows/deploy.yml).
