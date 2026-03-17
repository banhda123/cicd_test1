# LMS Backend

Quick setup for local development:

## Prerequisites
- Node.js (>=16)
- Docker & Docker Compose (for containerized deployment)

## Local Development

### Traditional Setup

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
copy .env.example .env
# then edit .env to set real DB credentials and JWT secret
```

Run in development:

```bash
npm run dev
```

### Docker Development

Start all services with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- LMS Backend (port 3000)
- MySQL Database (port 3306)
- Redis (port 6379)
- Nginx Reverse Proxy (port 80)

Stop services:

```bash
docker-compose down
```

## Production Deployment

### Using GitHub Actions

1. Set up GitHub repository secrets
2. Push to main branch to trigger deployment
3. Docker image will be built and pushed to GitHub Container Registry

### Manual Docker Deployment

Create production environment file:

```bash
copy .env.production.example .env.production
# Edit with your production values
```

Deploy with production compose:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables

See `.env.example` for development variables and `.env.production.example` for production variables.

## API Endpoints

- Health check: `GET /api/health`
- Application runs on port 3000 (default)

## CI/CD Pipeline

The GitHub Actions workflow includes:
- Automated testing
- Docker image building
- Container registry publishing
- Automated deployment to production

## Monitoring

- Container health checks enabled
- Nginx reverse proxy with SSL termination
- Rate limiting and security headers in production
