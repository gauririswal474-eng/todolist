# Part 1: To-Do List Backend (Node.js, Express.js, MongoDB)

REST API for a To-Do List app using Express, Mongoose and MongoDB, organised as **routes → controllers → services → model**.

## 1. Set up the project
```
cd backend
npm install
```

## 2. Configure MongoDB and environment variables
Copy `.env.example` to `.env` and fill it in:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string (local or MongoDB Atlas) | `mongodb://127.0.0.1:27017/todo-app` |
| `CLIENT_URL` | Allowed frontend origin for CORS (empty = allow all) | `http://localhost:5173` |

For MongoDB Atlas, create a free cluster, add a database user, allow your IP (or `0.0.0.0/0` for hosting), and paste the `mongodb+srv://...` string into `MONGO_URI`.

## 3. Run
```
npm run dev     # with nodemon
npm start       # plain node
```

## API endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List tasks. Optional query: `?search=text&status=pending` |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task (`title` required) |
| PUT | `/api/tasks/:id` | Update task details |
| PATCH | `/api/tasks/:id/status` | Update status only (`pending`, `in-progress`, `completed`) |
| DELETE | `/api/tasks/:id` | Delete a task |

Task fields: `title` (required, max 100), `description` (max 500), `status`, `priority` (`low`/`medium`/`high`), `dueDate`.
Responses look like `{ "success": true, "data": ... }`, errors like `{ "success": false, "message": "..." }`.

## Folder structure
```
src/
  config/db.js              MongoDB connection
  models/Task.js            Mongoose schema
  services/taskService.js   database logic
  controllers/              request/response handling
  routes/taskRoutes.js      URL → controller mapping
  middleware/               validation and error handling
  utils/                    AppError, asyncHandler
server.js                   starts DB connection and server
```

## Error handling and validation
- `validate.js` checks ids, required fields, lengths, allowed status/priority values and dates, and strips unknown fields.
- `errorHandler.js` returns clean JSON for validation errors (400), invalid ids (400), bad JSON (400), unknown routes and missing tasks (404), and hides internal details in production (500).

## Testing with Postman
Import `postman_collection.json` (set the `baseUrl` variable, default `http://localhost:5000`). Run **Create task** first, because it saves the new id into `taskId` for the other requests. The collection also has error cases (empty title, invalid status, invalid id, not found).

## Deploy on Render
Create a **Web Service** from the GitHub repo, set **Root Directory** to `backend`, **Build Command** `npm install`, **Start Command** `npm start`, and add the environment variables above (`MONGO_URI` from Atlas, `CLIENT_URL` = your Netlify URL).

## Challenges and how I addressed them
- **Keeping code organised:** split into routes, controllers and services so each file has one job.
- **Async errors:** an `asyncHandler` wrapper sends rejected promises to one central error handler instead of repeating try/catch.
- **Safe search:** user text is escaped before building the regex, so special characters cannot break the query.
- **Invalid ids:** checked before querying, so a bad id returns a clear 400 instead of a database error.
