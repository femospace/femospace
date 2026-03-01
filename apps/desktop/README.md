PC app wrapper for the existing web-app

Commands
- Install dev dependencies (from pc-app):

  npm install

- Run in development (starts web-app dev server and Electron):

  npm run dev

- Build web assets and run Electron in production mode:

  npm run build:web
  npm run start

Notes
- This project wraps the existing `web-app` located at the repository root; it does not change the backend.
- `dev` script starts the `web-app` dev server and opens Electron at http://localhost:5173.
