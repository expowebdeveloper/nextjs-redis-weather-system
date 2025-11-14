# Weather System - Full Stack Application

A dockerized full-stack weather system demonstrating Redis-based job queuing, automated scheduling, and real-time weather data fetching.

## Architecture

- **Next.js App** - Frontend + API routes (port 3000)
- **Producer Service** - TypeScript scheduler that enqueues jobs every 60 seconds
- **Worker Service** - TypeScript consumer that processes jobs and fetches weather data
- **Redis** - Job queue for producer-consumer communication
- **PostgreSQL** - Database for storing weather data

## Features

- ✅ Manual job triggering via dashboard
- ✅ Automated job scheduling (every 60 seconds)
- ✅ Real-time weather data fetching from Open-Meteo API
- ✅ Weather data display for 4 cities (London, New York, Tokyo, Cairo)
- ✅ Job history tracking
- ✅ Full Docker Compose orchestration

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- No other setup required!

### Running the System

```bash
docker compose up --build
```

This will:
1. Start PostgreSQL and initialize the database schema
2. Start Redis server
3. Build and start the Next.js app
4. Build and start the worker service
5. Build and start the producer service

### Accessing the Application

- **Dashboard**: http://localhost:3000
- **Weather Page**: http://localhost:3000/weather

## Project Structure

```
weather-system/
├── app/                    # Next.js frontend + API routes
│   ├── api/
│   │   ├── job/           # Job enqueueing endpoint
│   │   └── weather/       # Weather data endpoint
│   ├── weather/           # Weather display page
│   └── page.tsx           # Dashboard page
├── worker/                # Worker service (consumer)
│   ├── src/
│   │   ├── index.ts       # Main worker logic
│   │   ├── database.ts    # PostgreSQL connection
│   │   └── weather-api.ts  # Open-Meteo API client
│   └── Dockerfile
├── producer/              # Producer service (scheduler)
│   ├── src/
│   │   └── index.ts       # Scheduler logic
│   └── Dockerfile
├── init.sql               # PostgreSQL schema
├── docker-compose.yml     # Container orchestration
└── Dockerfile             # Next.js app Dockerfile
```

## Environment Variables

All services use environment variables configured in `docker-compose.yml`:

- `POSTGRES_USER` - PostgreSQL username (default: weather_user)
- `POSTGRES_PASSWORD` - PostgreSQL password (default: weather_pass)
- `POSTGRES_DB` - Database name (default: weather_db)
- `REDIS_HOST` - Redis host (default: redis)
- `REDIS_PORT` - Redis port (default: 6379)
- `REDIS_QUEUE_NAME` - Queue name (default: weather-jobs)
- `JOB_INTERVAL_MS` - Producer interval in milliseconds (default: 60000)

## API Endpoints

### POST /api/job
Enqueues a new weather-fetching job to Redis.

**Response:**
```json
{
  "success": true,
  "message": "Job enqueued successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET /api/weather
Returns all stored weather data from PostgreSQL.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "city": "London",
      "temperature": 15.5,
      "windSpeed": 12.3,
      "lastUpdated": "2024-01-01T12:00:00.000Z"
    }
  ],
  "lastSync": "2024-01-01T12:00:00.000Z"
}
```

### GET /api/job/history
Returns recent job history.

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "timestamp": "2024-01-01T12:00:00.000Z",
      "triggeredBy": "Manual"
    }
  ]
}
```

## Database Schema

The system uses a single table `weather_data`:

```sql
CREATE TABLE weather_data (
    city VARCHAR(100) PRIMARY KEY,
    temperature DECIMAL(5, 2) NOT NULL,
    wind_speed DECIMAL(5, 2) NOT NULL,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Data is upserted (insert or update) for each city, ensuring only the latest data is stored.

## How It Works

1. **Producer Service**: Automatically enqueues a job every 60 seconds containing the list of 4 standard cities
2. **Manual Trigger**: User can click "Fetch Weather Now" on the dashboard to manually enqueue a job
3. **Worker Service**: Consumes jobs from Redis, fetches weather data from Open-Meteo API for each city, and stores results in PostgreSQL
4. **Frontend**: Displays weather data and job history in real-time

## Development

### Running Services Individually

You can also run services individually for development:

```bash
# Install dependencies
npm install
cd worker && npm install
cd ../producer && npm install

# Run Next.js app
npm run dev

# Run worker (requires Redis and PostgreSQL)
cd worker && npm run dev

# Run producer (requires Redis)
cd producer && npm run dev
```

## Testing

1. Start the system: `docker compose up --build`
2. Wait for all services to be healthy
3. Visit http://localhost:3000
4. Click "Fetch Weather Now" to trigger a manual job
5. Check http://localhost:3000/weather to see weather data
6. Wait 60 seconds to see automated jobs being processed

## Troubleshooting

- **Services not starting**: Check Docker logs with `docker compose logs`
- **Database connection errors**: Ensure PostgreSQL is healthy before starting app/worker
- **Redis connection errors**: Ensure Redis is healthy before starting app/worker/producer
- **No weather data**: Trigger a manual job or wait for the scheduler

## License

MIT
