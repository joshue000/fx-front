# fx-front

Angular 20 frontend for **FXReplayChallenge** — a trade order management interface backed by a REST API.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22 LTS |
| npm | 10+ |
| Angular CLI | 20 |
| Docker | 24+ (for containerised run) |

---

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server (hot reload on `http://localhost:4200`):

```bash
npm start
```

The app expects the backend API at `http://localhost:3000/api/v1/`.

---

## Running with Docker

### Start

Make the scripts executable (only needed once, run from the project root directory):

```bash
chmod +x ./start.sh ./stop.sh
```

Builds the production image and starts the container on port **4200**:

```bash
./start.sh
```

Open `http://localhost:4200` in your browser.

To use a different host port:

```bash
PORT=8080 ./start.sh
```

### Stop

```bash
./stop.sh
```

---

## How the Docker setup works

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build — Node 22 builds the app, nginx 1.27 serves the static output |
| `nginx.conf` | Serves `dist/fx-front/browser`; all unknown routes fall back to `index.html` for Angular client-side routing |
| `.dockerignore` | Excludes `node_modules`, `dist`, and `.angular` cache from the build context |

---

## Running tests

```bash
npm test
```

Unit tests run with Karma and Jasmine in a headless Chrome browser.

---

## Building for production (without Docker)

```bash
npm run build
```

Output is written to `dist/fx-front/browser/`.
