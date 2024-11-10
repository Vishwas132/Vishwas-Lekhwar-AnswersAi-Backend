# AnswersAI Backend Service

A secure and scalable backend service built with Node.js, Express.js, and PostgreSQL that handles user authentication and AI-powered question answering.

## Features

- RESTful API endpoints for user and question management
- User authentication and authorization using JWT
- PostgreSQL database with Sequelize ORM
- AI-powered question answering (OpenAI/Anthropic integration)
- Secure user registration and login flow
- Docker containerization
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
│   ├── models/           # Sequelize database models
│   ├── routes/           # API route definitions
│   └── server.js         # Main application entry point
├── tests/                # Unit and integration tests
├── Dockerfile            # Docker configuration
└── docker-compose.yml    # Multi-container Docker setup
```

## Quick Start with Docker

1. Clone the repository
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your Anthropic API key and other configurations

4. Build the Docker image:

   ```bash
   docker-compose build
   ```

5. Start the services:

   ```bash
   docker-compose up --build
   ```

6. Set up your PostgreSQL database

   - Create the database schema:
     ```bash
     docker exec -it answersai-backend-db-1 psql -U postgres -d answersai_dev -c "CREATE SCHEMA IF NOT EXISTS answersai_dev;"
     ```

7. Close the Docker container from terminal and start it again:
   ```bash
   docker-compose up --build
   ```

The API will be available at `http://localhost:3000`

## Manual Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your PostgreSQL database

   - Create the database using pgAdmin:
     - Create a new database with the name `answersai_dev`
     - Create a new schema with the name `answersai_dev` inside the `answersai_dev` database

3. Configure environment variables in `.env`:

   ```
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=answersai_dev
   DB_HOST=localhost

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key

   # AI Service Configuration
   OPENAI_API_KEY=your-openai-api-key
   # Or
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

4. Run database migrations:

   ```bash
   npm run migrate
   ```

5. Start the server:

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
- Containerized deployment

## Testing

Run the comprehensive test suite:

```bash
npm test
```

Tests cover:

- Middleware authentication
- Route handlers

## Deployment Strategies

### Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

### Production Recommendations

- Use managed PostgreSQL service
- Implement robust logging
- Set up monitoring and alerting
- Configure SSL/TLS
- Regular database backups
- Implement CI/CD pipeline

## Troubleshooting

- Ensure all environment variables are correctly set
- Check database connection parameters
- Verify API key for AI service
- Review Docker and docker-compose configurations
