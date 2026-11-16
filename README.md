# Notely Pro

A MERN-stack student notes and productivity application built with MongoDB, Express, React, Vite and Node.js.

## Highlights
- Secure account registration and JWT login
- Create, edit, search and organize personal notes
- Favorites, categories and tags
- Markdown-assisted editor toolbar
- Browser print-to-PDF export
- Random-token, read-only note sharing with revocation
- Dashboard cards and seven-day activity visualization
- Archive, restore and recycle-bin workflows
- Responsive layout and light/dark theme

## Run locally
See [SETUP.md](./SETUP.md) for prerequisites, environment configuration, development commands, and production deployment.

## Security
The `.env` file is intentionally not included. Copy `.env.example` to `.env`, then configure your own MongoDB URI and a strong JWT secret. Share URLs grant read-only access to anyone who possesses the link.
