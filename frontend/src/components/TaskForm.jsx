import { useState } from 'react'

const EMPTY = { title: '', description: '', priority: 'medium', dueDate: '' }

// Used for both adding a new task and editing an existing one.
export default function TaskForm({ task, saving, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    task ? { title: task.title, description: task.description || '', priority: task.priority, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '' } : EMPTY
  )
  const [formError, setFormError] = useState('')

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setFormError('Please enter a title.')
    setFormError('')
    const ok = await onSubmit({ ...form, dueDate: form.dueDate || null })
    if (ok && !task) setForm(EMPTY)
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h2>{task ? 'Edit task' : 'Add a new task'}</h2>
      <input name="title" placeholder="Task title" value={form.title} onChange={change} maxLength={100} />
      <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={change} rows={2} maxLength={500} />
      <div className="row">
        <select name="priority" value={form.priority} onChange={change}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input type="date" name="dueDate" value={form.dueDate} onChange={change} />
      </div>
      {formError && <p className="field-error">{formError}</p>}
      <div className="row">
        <button className="btn primary" disabled={saving}>{saving ? 'Saving...' : task ? 'Save changes' : 'Add task'}</button>
        {task && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
