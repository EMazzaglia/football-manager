# Football Reservation System

A node.js application for managing football match reservations built with Express, TypeScript, MongoDB, and containerized with Docker.

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v18+) and npm (for local development)
- [Git](https://git-scm.com/)

## 🚀Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd football-manager
```

### Environment Configuration

The application uses environment variables for configuration, which are defined in the `.env` file. A sample configuration is already provided, but you may need to adjust it for your environment:

```bash
# App
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_DATABASE=myapi
MONGO_AUTH_SOURCE=admin
MONGO_URI=mongodb://admin:password@mongodb:27017/myapi?authSource=admin

# Email service (using Ethereal for testing)
TEST_EMAIL=your-email@example.com
```

### Starting the Application with Docker

The easiest way to run the application is using Docker Compose:

```bash
# Build and start the containers
npm run docker:build

# Or if you've already built the images before
npm run docker:start
```

This will start both the Node.js application and MongoDB containers. The API will be available at http://localhost:3000.

### Seeding the Database

The application comes with a seeding script that populates the database with sample football matches. Useful to run before starting the FE.
The fastest way of doing it without bothering is with docker-compose.

```bash
# Move to backend folder
cd backend

# Build and start your service
npm run docker:build

# In a separate terminal execute the seed
npm run docker:seed
```

### Stopping the Application
```bash
npm run docker:down
```

## Email Notification Feature

The application includes an automated email notification system for:
- Sending reminders to users 2 days before their reserved matches
- Sending follow-up emails the day after attended matches

### Testing Email Notifications

Created a test script with Ethereal (a fake SMTP service):

```bash
# Move to backend folder
cd backend

# Test both direct emails and scheduler
npm run docker:test:email

# Test only direct email sending
npm run docker:test:email:direct

# Test only the scheduler
npm run docker:test:email:scheduler
```

After running the test, you'll receive credentials to view the sent emails in Ethereal's web interface.

## API Documentation

### Events Endpoints

- `GET /events` - List all events with pagination and filtering options
  - Query parameters: `country`, `date`, `homeTeam`, `awayTeam`, `team`, `page`, `limit`
- `GET /events/:id` - Get details for a specific event

### Reservations Endpoints

- `POST /reservations` - Create a new reservation
  - Body: `{ "userId": "string", "eventId": "string", "spots": number }`
- `GET /reservations/user/:userId` - Get all reservations for a specific user
  - Query parameters: `status`, `page`, `limit`

Postman collection to test these endpoints inside backend folder, file `Football app.postman_collection.json`
To use it, import in in Postman and execute the different endpoints

## Running Tests
```bash
# Move to backend folder
cd backend

# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only e2e tests
npm run test:e2e
```

## Improvements if I have time
1. Logger
2. Authentication
3. Transactions for reservations?
4. Write more e2e and unit tests
5. API DOCS probably swagger
6. Caching. There are ton of events and a lot of users.
