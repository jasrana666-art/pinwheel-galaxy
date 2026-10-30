# Pinwheel Galaxy

A cinematic, single-file landing page that presents a stylized spiral galaxy as a real-time animated background. Built with plain HTML, CSS, and JavaScript, it is designed to feel premium, futuristic, and lightweight.

## Overview

This project turns a galaxy concept into a polished marketing-style landing page with:

- animated canvas-based galaxy motion
- layered glassmorphism UI
- live tuning controls for particles, arms, speed, tilt, and palette
- copyable prompt text for AI-assisted recreation
- responsive layout for desktop and mobile

## Live Demo

The site is configured for GitHub Pages and can be served directly from the repository root.

## Project Structure

```text
.
├── index.html
├── README.md
├── DEPLOYMENT.md
└── .gitignore
```

## How to Run Locally

Because this is a static site, you can run it with any simple local web server.

### Option 1: Python

```bash
cd pinwheel-galaxy
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Option 2: VS Code Live Server

Open `index.html` in VS Code and use the Live Server extension.

## Features

- Real-time galaxy animation rendered on canvas
- Dark, premium interface with neon gradients and glass panels
- Live parameter tuning without external dependencies
- AI prompt generator for recreating the scene elsewhere
- Minimal asset footprint for performance and portability

## Customizing the Project

Most visual tuning is controlled in `index.html`:

- theme colors and spacing in the CSS variables section
- galaxy behavior in the `makeGalaxy()` JavaScript function
- UI copy and prompts in the hero and prompt sections
- slider defaults and palette options in the tuner logic

## Performance Notes

This project is intentionally lightweight:

- built as a single HTML file
- no external JS framework or build step
- no heavy image or video assets
- canvas rendering keeps it efficient for a landing-page effect

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub Pages setup steps and production notes.

## Recommended Next Improvements

To take this from a polished demo toward a more portfolio-like product landing page, consider:

1. split the page into reusable sections/components
2. add a dedicated project showcase or case study section
3. add a sticky navigation with animated section progress
4. create stronger typography hierarchy and CTA clarity
5. add subtle scroll-based motion for richer storytelling
6. improve mobile layout spacing and touch targets
7. include metadata, Open Graph tags, and social preview support

## License

This project is published for demo and portfolio use. Add a license if you plan to share or distribute it more broadly.

## Repository Status

This repository currently contains a static front-end experience suitable for a portfolio, landing page, or product teaser.
