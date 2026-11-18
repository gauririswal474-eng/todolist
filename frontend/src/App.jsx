import { useState, useEffect, useCallback } from 'react'
import * as api from './api/taskApi.js'
import TaskForm from './components/TaskForm.jsx'
import TaskItem from './components/TaskItem.jsx'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editing, setEditing] = useState(null)

  // wait until the user stops typing before calling the search API
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 400)
    return () => clearTimeout(id)
  }, [search])

  const loadTasks = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true)
    try {
      setTasks(await api.fetchTasks({ search: debounced || undefined, status: statusFilter || undefined }))
      setError('')
    } catch (err) {
      setError(api.getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [debounced, statusFilter])

  useEffect(() => { loadTasks() }, [loadTasks])

  // Runs an API call, then re-fetches so the list always matches the database.
  const run = async (action) => {
    try {
      await action()
      setError('')
      await loadTasks(false)
      return true
    } catch (err) {
      setError(api.getErrorMessage(err))
      return false
    }
  }

  const handleSubmit = async (data) => {
    setSaving(true)
    const ok = await run(() => (editing ? api.updateTask(editing._id, data) : api.createTask(data)))
    setSaving(false)
    if (ok) setEditing(null)
    return ok
  }

  const handleStatus = (id, status) => run(() => api.updateTaskStatus(id, status))
  const handleDelete = (task) => {
    if (window.confirm(`Delete "${task.title}"?`)) run(() => api.deleteTask(task._id))
  }

  const counts = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  return (
    <div className="container">
      <h1>📝 To-Do List</h1>

      <TaskForm key={editing ? editing._id : 'new'} task={editing} saving={saving} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />

      <div className="toolbar">
        <input type="search" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {error && (
        <div className="error" role="alert">
          <span>{error}</span>
          <span>
            <button className="btn" onClick={() => loadTasks()}>Retry</button>
            <button className="btn" onClick={() => setError('')}>Dismiss</button>
          </span>
        </div>
      )}

      {loading ? (
        <div className="loading"><span className="spinner" /> Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <p className="empty">{debounced || statusFilter ? 'No tasks match your search.' : 'No tasks yet. Add your first one above!'}</p>
      ) : (
        <>
          <p className="count">{counts.completed} of {counts.total} completed</p>
          <ul className="list">
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} onStatus={handleStatus} onEdit={setEditing} onDelete={handleDelete} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
