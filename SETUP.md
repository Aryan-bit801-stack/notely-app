# Notely Pro — setup guide

Notely Pro is a full-stack MERN notes workspace. It includes JWT authentication, notes, favorites, categories and tags, a Markdown-assisted editor, print-to-PDF export, read-only share links, dashboard activity, archive, and a recycle bin.

## Requirements
- Node.js 18.18+ (Node 20 LTS recommended)
- MongoDB local instance or a MongoDB Atlas connection string
- npm

## 1. Configure the backend
From the project root:

```bash
npm install
```

Copy `.env.example` to `.env` and set:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/notely
JWT_SECRET=use-a-long-random-secret
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string. Never commit `.env` or share your JWT secret.

## 2. Install frontend dependencies

```bash
npm install --prefix frontend
```

## 3. Run locally
Open two terminals in the project root.

Terminal 1 — API:

```bash
npm run dev:server
```

Terminal 2 — React/Vite:

```bash
npm run dev:client
```

Open the local URL printed by Vite (normally http://localhost:5173). The Vite development server proxies `/api` requests to `http://localhost:5000`.

Register an account, then create notes and test the features.

## 4. Production build

```bash
npm run build
```

Then set `NODE_ENV=production` and start the Express server:

```bash
npm start
```

The Express server serves the built frontend from `frontend/dist`.

## Feature notes
- **Favorites:** use the star control on a note card.
- **Categories and tags:** enter a category and comma-separated tags in the editor; categories appear in the sidebar and filter.
- **Editor:** the toolbar inserts Markdown syntax for bold, italic, headings, lists, and inline code.
- **PDF:** choose PDF on a note card, then select “Save as PDF” in the browser print dialog.
- **Sharing:** Share creates a random, read-only URL. Unshare immediately disables the public URL. Anyone with the active link can view the note, so do not share confidential content.
- **Dashboard:** activity is calculated from note update timestamps in the last seven days.
- **Archive:** archived notes are hidden from All notes and available under Archived.
- **Recycle bin:** Delete moves notes to the bin. Restore recovers them; Delete forever permanently removes them.

## Existing data
The new schema fields have defaults, so existing MongoDB note documents continue to work without a manual migration.

## Security and deployment
- The original uploaded `.env` file was deliberately excluded from this upgraded package. Create a fresh `.env` locally.
- Use a unique, long `JWT_SECRET`.
- Configure MongoDB Atlas network access and credentials securely.
- Share links are bearer links: anyone possessing one can read the shared note.
