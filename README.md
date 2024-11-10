# AnswersAI Backend Service

A secure and scalable backend service built with Node.js, Express.js, and PostgreSQL that handles user authentication and AI-powered question answering.

## Features

- RESTful API with Express.js
- PostgreSQL database with Sequelize ORM
- JWT-based authentication
- OpenAI integration via Langchain
- Docker containerization
- Rate limiting
- Error handling
- API documentation

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker and Docker Compose (optional)
- OpenAI API key

## Quick Start with Docker

1. Clone the repository
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your OpenAI API key and other configurations
4. Start the services:
   ```bash
   docker-compose up
   ```

The API will be available at `http://localhost:3000`

## Manual Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your PostgreSQL database

3. Configure environment variables in `.env`:

   ```
   PORT=3000
   NODE_ENV=development

   # Database
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=answersai_dev
   DB_HOST=localhost

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key

   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
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

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login

Login with email and password

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/auth/refresh

Refresh access token

```json
{
  "refreshToken": "your-refresh-token"
}
```

#### POST /api/auth/logout

Logout (client-side token removal)

### User Endpoints

#### POST /api/users

Create new user

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/users/:userId

Get user profile (requires authentication)

#### GET /api/users/:userId/questions

Get user's questions (requires authentication)

### Question Endpoints

#### POST /api/questions

Create question and get AI answer (requires authentication)

```json
{
  "content": "What is the capital of France?"
}
```

#### GET /api/questions/:questionId

Get specific question (requires authentication)

## Architecture Design

### Database Design

- PostgreSQL for ACID compliance and data integrity
- Efficient indexing on frequently queried fields
- Connection pooling for optimal resource utilization
- Foreign key constraints for data relationships

### Authentication

- JWT-based stateless authentication
- Access tokens (1h expiry) and refresh tokens (7d expiry)
- Secure password hashing with bcrypt

### Scalability Solution

To handle hundreds of thousands of concurrent users:

1. **Load Balancing**

   - Multiple application instances behind a load balancer
   - Sticky sessions not required due to stateless JWT auth

2. **Database Scaling**

   - Read replicas for distributing read operations
   - Connection pooling to manage database connections
   - Table partitioning for large datasets
   - Proper indexing for query optimization

3. **AI Service Integration**

   - Asynchronous processing
   - Request queuing for high load periods
   - Caching common responses
   - Rate limiting per user
   - Retry mechanism with exponential backoff

4. **Caching Strategy**

   - Redis for caching frequent queries
   - Cache invalidation on data updates
   - Distributed caching for scalability

5. **High Availability**
   - Multiple availability zones
   - Automated failover
   - Health checks and auto-recovery

### Security Measures

- Rate limiting to prevent abuse
- Input validation and sanitization
- SQL injection prevention through ORM
- XSS protection
- CORS configuration
- Secure headers

## Error Handling

The application implements centralized error handling with:

- Appropriate HTTP status codes
- Consistent error response format
- Detailed logging for debugging
- Graceful error recovery

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

### Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

### Production Considerations

- Use production-grade PostgreSQL instance
- Configure proper logging
- Set up monitoring and alerting
- Use SSL/TLS
- Regular database backups
- CI/CD pipeline integration

## License

ISC
