const STATUS_LABEL = { pending: 'Pending', 'in-progress': 'In progress', completed: 'Completed' }

export default function TaskItem({ task, onStatus, onEdit, onDelete }) {
  const done = task.status === 'completed'
  const overdue = task.dueDate && !done && new Date(task.dueDate) < new Date(new Date().toDateString())

  return (
    <li className={`card task ${done ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={done}
        onChange={() => onStatus(task._id, done ? 'pending' : 'completed')}
        aria-label={`Mark "${task.title}" as ${done ? 'pending' : 'completed'}`}
      />
      <div className="task-body">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="meta">
          <span className={`badge ${task.priority}`}>{task.priority}</span>
          {task.dueDate && (
            <span className={overdue ? 'due overdue' : 'due'}>
              Due {new Date(task.dueDate).toLocaleDateString()}{overdue ? ' (overdue)' : ''}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <select value={task.status} onChange={(e) => onStatus(task._id, e.target.value)} aria-label="Task status">
          {Object.entries(STATUS_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button className="btn" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn danger" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </li>
  )
}
