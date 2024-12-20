# Project Setup Instructions

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB Atlas (or a local MongoDB instance)
- Mongoose

## Setting Up the Project

### 1. Clone the Repository

```bash
# Replace <repository-url> with the actual URL of the project repository
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project and add the following configurations:

```env
PORT=5000
DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0&connectTimeoutMS=30000&socketTimeoutMS=30000
JWT_EXPIRATION=1h
JWT_SECRET="your_jwt_secret"
```

Replace `<username>` and `<password>` with your MongoDB credentials.

### 4. Set Up the Database

#### Create Migrations

To create a new migration:

```bash
npx migrate-mongoose create <migration-name> -d "<DB_URI>"
```

Example:

```bash
npx migrate-mongoose create create_blog -d "mongodb+srv://name:pass@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority"
```

#### List Available Migrations

```bash
npx migrate-mongoose -d "<DB_URI>" list
```

#### Run Migrations

To run specific migrations:

```bash
npx migrate-mongoose -d "<DB_URI>" up <migration-name>
```

Example:

```bash
npx migrate-mongoose -d "mongodb+srv://name:pass@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority" up create_blog
```

To run all pending migrations:

```bash
npx migrate-mongoose -d "<DB_URI>" up
```

### 5. Start the Server

```bash
npm start
```

The server will run at `http://localhost:5000` by default.

### 6. Running Tests

Ensure the database is seeded correctly, and test dependencies are installed. Then, run the test scripts:

```bash
npm test
```

## Additional Notes

- Use `nodemon` for development to enable automatic restarts when files change:
  ```bash
  npm install -g nodemon
  nodemon
  ```
- Ensure your MongoDB Atlas cluster is accessible by allowing IP addresses or setting `0.0.0.0/0` for unrestricted access (not recommended for production).
- Refer to the [migrate-mongoose documentation](https://github.com/balmasi/migrate-mongoose) for advanced usage.

---

These steps ensure the project, database, and migrations are set up properly, and tests are running successfully.
