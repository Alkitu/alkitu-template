# 🛠️ Scripts Guide

This directory contains essential scripts for managing the Alkitu Template development environment.

## 📋 Available Scripts

### **Development Scripts**

#### `dev.sh`

**Main development script** - Sets up the complete Docker development environment

```bash
./scripts/dev.sh
```

- Starts all services (API, Web, MongoDB, Redis)
- Builds containers if needed
- Shows service URLs and useful commands
- Auto-reloads on code changes

### **Docker Management Scripts**

#### `stop.sh`

Stops all running development containers

```bash
./scripts/stop.sh
```

#### `restart.sh`

Restarts services (all or specific service)

```bash
./scripts/restart.sh          # Restart all services
./scripts/restart.sh api      # Restart specific service
```

#### `logs.sh`

View container logs (all or specific service)

```bash
./scripts/logs.sh             # View all logs
./scripts/logs.sh api         # View API logs
./scripts/logs.sh web         # View Web logs
```

#### `db-shell.sh`

Connect to MongoDB shell

```bash
./scripts/db-shell.sh
```

## 🚀 Quick Start

1. **Start development environment:**

   ```bash
   ./scripts/dev.sh
   ```

2. **View logs:**

   ```bash
   ./scripts/logs.sh
   ```

3. **Stop when done:**
   ```bash
   ./scripts/stop.sh
   ```

## 🔧 NPM Scripts Integration

These scripts are also available through npm:

```bash
# Development
npm run dev:docker              # Same as ./scripts/dev.sh

# Docker management
npm run docker:stop             # Same as ./scripts/stop.sh
npm run docker:logs             # Same as ./scripts/logs.sh
npm run docker:restart          # Same as ./scripts/restart.sh

# Database
npm run db:shell               # Same as ./scripts/db-shell.sh
```

## 📊 Service URLs

After running `./scripts/dev.sh`, these services will be available:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/health
- **MongoDB**: mongodb://localhost:27017/alkitu
- **Redis**: redis://localhost:6379

## 🐛 Troubleshooting

### Docker not running

```bash
# Make sure Docker Desktop is running
docker info
```

### Port conflicts

```bash
# Stop all containers first
./scripts/stop.sh

# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
```

### Database connection issues

```bash
# Check MongoDB container
docker ps | grep mongo

# View MongoDB logs
./scripts/logs.sh mongodb
```

## 🧹 Clean Up

To completely clean up Docker resources:

```bash
./scripts/stop.sh
docker system prune -a
```

---

**Note**: These scripts are optimized for development. For production deployment, use the appropriate CI/CD configurations.
