# AnswersAI Backend Service

A secure and scalable backend service built with Node.js, Express.js, and PostgreSQL that handles user authentication and AI-powered question answering.

## Features

- RESTful API endpoints for user and question management
- User authentication and authorization using JWT
- PostgreSQL database with Sequelize ORM
- AI-powered question answering (Anthropic integration)
- Secure user registration and login flow
- Docker containerization with separate dev/prod configurations
- Comprehensive error handling
- Unit testing with Jest

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker and Docker Compose (optional)
- Anthropic API key

## Project Structure

```
answersai-backend/
├── src/
│   ├── config/           # Database and configuration files
│   ├── middleware/       # Authentication and request middleware
│   ├── migrations/       # Database migration scripts
│   ├── models/          # Sequelize database models
│   ├── routes/          # API route definitions
│   └── server.js        # Main application entry point
├── tests/
│   ├── middleware/      # Middleware tests
│   ├── routes/         # Route tests
│   └── test-utils.js   # Test utilities
├── .dockerignore       # Docker ignore patterns
├── .env.example        # Example environment variables
├── .gitignore         # Git ignore patterns
├── .sequelizerc       # Sequelize configuration
├── docker-compose.dev.yml  # Development Docker configuration
├── docker-compose.prod.yml # Production Docker configuration
├── Dockerfile.dev      # Development Dockerfile
├── Dockerfile.prod     # Production Dockerfile
├── jest.config.js     # Jest test configuration
├── package.json       # Project dependencies and scripts
└── README.md          # Project documentation
```

## Quick Start with Docker

### Development Environment

1. Clone the repository
2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Configure environment variables in `.env`:

   ```
   NODE_ENV=development

   # Database Configuration
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=answersai_dev
   DB_HOST=db
   DB_PORT=5432
   DB_SCHEMA=answersai_dev

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key

   # AI Service Configuration
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

4. Start the development environment:

   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

5. Run command in new terminal to create schema:

   ```bash
   docker exec -it answersai-backend-db-1 psql -U postgres -d answersai_dev -c "CREATE SCHEMA IF NOT EXISTS answersai_dev;"
   ```

6. Close and Restart the development environment to apply schema changes:
   ```bash
   docker-compose -f docke-compose.dev.yml up --build
   ```

The development API will be available at `http://localhost:3000`

### Production Environment

1. Ensure environment variables are properly configured
2. Build and start the production environment:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

The production API will be available at `http://localhost:8080`

## Manual Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your PostgreSQL database:

   - Create a new database with the name `answersai_dev`
   - Create a new schema with the name `answersai_dev` inside the database

3. Configure environment variables in `.env`:

   ```
   NODE_ENV=development

   # Database Configuration
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=answersai_dev
   DB_HOST=localhost
   DB_PORT=5432
   DB_SCHEMA=answersai_dev

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key

   # AI Service Configuration
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

4. Start the server:

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication Flow

1. Register a user: `POST /api/users`
2. Login: `POST /api/auth/login`
3. Ask a question: `POST /api/questions` (with JWT token)

### Detailed Endpoint Documentation

#### Authentication Endpoints

- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout
- `POST /api/auth/refresh`: Refresh access token

#### User Endpoints

- `POST /api/users`: Create new user
- `GET /api/users/:userId`: Get user profile
- `GET /api/users/:userId/questions`: Get user's questions

#### Question Endpoints

- `POST /api/questions`: Create question and get AI answer
- `GET /api/questions/:questionId`: Retrieve specific question

## Security Measures

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- Protection against common web vulnerabilities
- Secure environment configuration
- Multi-stage Docker builds for production

## Docker Configuration

### Development Environment

The development environment (`docker-compose.dev.yml` and `Dockerfile.dev`) includes:

- Hot reloading with volume mounts
- Full development dependencies
- Exposed ports for debugging
- PostgreSQL with persistent volume

### Production Environment

The production environment (`docker-compose.prod.yml` and `Dockerfile.prod`) includes:

- Multi-stage builds for smaller image size
- Production-only dependencies
- Enhanced security configurations
- Optimized PostgreSQL settings
- Automatic restart policies

## Scalability Considerations

### Database

- PostgreSQL with connection pooling
- Efficient indexing
- Potential for read replicas
- Table partitioning support

### AI Integration

- Asynchronous processing
- Request queuing
- Response caching
- Rate limiting
- Retry mechanism with exponential backoff

### Infrastructure

- Stateless JWT authentication
- Horizontal scaling capability
- Load balancer compatibility
- Containerized deployment with Docker

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:

- Authentication middleware
- Route handlers
- User operations
- Question operations

## Deployment Strategies

### Development Deployment

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Run in detached mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production Deployment

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up --build

# Run in detached mode
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Production Recommendations

- Use managed PostgreSQL service
- Implement robust logging
- Set up monitoring and alerting
- Configure SSL/TLS
- Regular database backups
- Implement CI/CD pipeline
- Use container orchestration (e.g., Kubernetes)
- Implement health checks
- Set up proper monitoring and logging

## Troubleshooting

Common issues and solutions:

1. Database Connection Issues

   - Verify database credentials in .env
   - Ensure PostgreSQL service is running
   - Check database host and port settings
   - Verify schema exists

2. Docker Issues

   - Ensure Docker daemon is running
   - Check Docker logs for detailed errors
   - Verify port availability
   - Check volume permissions

3. API Key Issues

   - Verify Anthropic API key is valid
   - Check API key permissions
   - Ensure environment variables are loaded

4. Development Environment
   - Clear node_modules and reinstall
   - Rebuild Docker containers
   - Check for port conflicts
   - Verify file permissions

For any other issues, check the application logs and Docker container logs for detailed error messages.
