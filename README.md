# Todo List REST API

This is a Todo List REST API built with Node.js, Express, TypeScript, and PostgreSQL. It provides CRUD (Create, Read, Update, Delete) operations for managing Todo items. Knex is used for database migrations and seeding, and Jest is used for unit testing.

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (https://nodejs.org)
- PostgreSQL (https://www.postgresql.org/)

### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/your-username/todo-list-api.git
cd todo-list-api
```

2. Install the dependencies:

```bash
yarn install
```

3. Set up the database:

Create a new PostgreSQL database with the provided credentials in your .env file. Replace <DB_USER>, <DB_PW>, and <DB_DB> with your actual database credentials.

4. Run the database migrations:

```bash
yarn migration:run
```

5. Seed the database with some initial data (optional):

```bash
yarn seed:run
```

### Configuration

Copy the .env example file to `.env` and update the variables with your specific configuration:

```
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PW=postgres
DB_DB=todo-db
PORT=3030

JWT_SECRET=RANDOM_KEY
SALT_ROUNDS=5
```

### Running the server

To start the server in development mode (with nodemon):

```
yarn dev
```

To start the server in production mode:

```
yarn start
```

### Testing

To run the unit tests, use the following command:

```
yarn test
```