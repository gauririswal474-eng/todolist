# Part 2: To-Do List Frontend (React + Axios)

React frontend (Vite) that talks to the To-Do backend API.

## Set up and run
```
cd frontend
npm install
cp .env.example .env     # on Windows: copy .env.example .env
npm run dev
```
Open `http://localhost:5173`. The backend must be running (see `../backend/Readme.md`).

## Environment variable
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API, including `/api` | `http://localhost:5000/api` |

## Features
- Axios used for all HTTP requests (`src/api/taskApi.js`)
- Get tasks, create, update details, delete, update status (checkbox or dropdown) and search by text
- Filter by status
- UI refreshes after each action, so it always matches the database
- Loading spinner, empty-state message and error banner with Retry/Dismiss
- Responsive layout for phones and desktops
- State managed with `useState`, `useEffect` and `useCallback`

## Folder structure
```
src/
  api/taskApi.js           Axios instance and API functions
  components/TaskForm.jsx  add / edit form
  components/TaskItem.jsx  one task row
  App.jsx                  state, API calls, search and filter
```

## Deploy on Netlify
New site from the GitHub repo, **Base directory** `frontend`, **Build command** `npm run build`, **Publish directory** `frontend/dist`. Add the environment variable `VITE_API_URL` = your Render backend URL + `/api`, then redeploy.

## Challenges and how I addressed them
- **Too many API calls while typing:** search is debounced by 400 ms.
- **Showing useful errors:** one helper turns Axios errors into friendly messages (server message, or "cannot reach the server").
- **Keeping UI and database in sync:** after each create, update or delete the list is re-fetched, so filters and search stay correct.
- **CORS:** the backend allows the frontend URL through the `CLIENT_URL` variable.
- **Free hosting sleeps:** Render's free tier can take about a minute to wake up, so the first request may be slow and the loading state and Retry button cover that.
