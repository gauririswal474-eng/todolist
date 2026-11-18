import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

// Turns any Axios error into a message that is safe to show to the user.
export function getErrorMessage(err) {
  if (err.response) return err.response.data?.message || `Request failed (${err.response.status})`
  if (err.request) return 'Cannot reach the server. Please check your connection and try again.'
  return err.message
}

export const fetchTasks = (params) => api.get('/tasks', { params }).then((r) => r.data.data)
export const createTask = (task) => api.post('/tasks', task).then((r) => r.data.data)
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task).then((r) => r.data.data)
export const updateTaskStatus = (id, status) => api.patch(`/tasks/${id}/status`, { status }).then((r) => r.data.data)
export const deleteTask = (id) => api.delete(`/tasks/${id}`)
