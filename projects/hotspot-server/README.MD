# hotspot-server

Lightweight backend service for managing hotspots, users, and sessions. Provides a simple REST API to create, list, and manage hotspot locations and related access tokens. Designed for local development and containerized deployment.

## Features
- CRUD for hotspots
- User authentication (token-based)
- Session logging and basic analytics
- Configurable via environment variables
- Docker-friendly

## Prerequisites
- Git
- Docker & Docker Compose (recommended) or
- Supported runtime (Node 18+/Deno/Go) depending on implementation

## Quick start (Docker)
1. Clone the repo:
```bash
git clone https://example.com/your-org/hotspot-server.git
cd hotspot-server
```
2. Copy environment file and customize:
```bash
cp .env.example .env
# edit .env as needed
```
3. Start services:
```bash
docker compose up --build
```
4. API available at http://localhost:8080 (or as configured)

## Local development (non-container)
1. Install dependencies (example for Node.js):
```bash
npm install
npm run dev
```
2. Open http://localhost:8080

## Configuration
Typical environment variables (.env):
```env
PORT=8080
DATABASE_URL=postgres://user:pass@db:5432/hotspot
JWT_SECRET=replace_me_with_secure_key
LOG_LEVEL=info
```

## API (example)
- GET /health — service status
- POST /auth/login — obtain token
- GET /hotspots — list hotspots
- POST /hotspots — create hotspot
- GET /hotspots/:id — hotspot details

Refer to the OpenAPI/Swagger file in /docs for full API specification.

## Testing
Run unit and integration tests:
```bash
npm test
# or
docker compose -f docker-compose.test.yml up --build
```

## Contributing
- Fork the repo, create a feature branch, open a PR
- Follow the coding style and include tests for new features

## License
Specify a license in LICENSE file (e.g., MIT).

For project-specific setup details, check docs/ or contact the maintainer.