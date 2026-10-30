# Deployment Guide

This project is a static HTML/CSS/JavaScript site and works well with GitHub Pages.

## 1) Push the project to GitHub

Make sure your repository is connected and the branch is pushed to GitHub.

```bash
git add .
git commit -m "Refactor Pinwheel Galaxy into cleaner multi-file structure"
git push origin main
```

If your default branch is not `main`, replace it with the branch you are using.

## 2) Enable GitHub Pages

In your GitHub repository:

1. Open the repository settings.
2. Go to Pages.
3. Under Source, select the branch to deploy from.
4. Choose the root folder (`/`) or `/docs` if you prefer a docs-based structure.
5. Save the settings.

GitHub will provide a live Pages URL once the site has built successfully.

## 3) Optional: serve locally

To preview before deployment:

```bash
cd pinwheel-galaxy
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## 4) Recommended production tweaks

Before shipping publicly, consider:

- adding a favicon
- setting a proper `<title>` and meta description
- adding Open Graph tags
- replacing external Google Fonts with local or fallback options if you want less dependence on third-party requests
- testing the page on mobile and tablet breakpoints

## 5) Future upgrade path

This project is ready for a cleaner product/portfolio evolution:

- add sections for About, Process, and Showcase
- integrate portfolio-style case studies
- add contact CTA and social links
- improve section animation and narrative pacing

## Notes

Since this project is static and dependency-free, deployment is straightforward and dependable. The page should work on GitHub Pages without a build pipeline.
