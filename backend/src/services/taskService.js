// Service layer: all database logic lives here, controllers only handle HTTP.
import Task from '../models/Task.js'
import AppError from '../utils/AppError.js'

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const notFoundError = () => new AppError('Task not found', 404)

export async function getTasks({ search, status } = {}) {
  const query = {}
  if (status) query.status = status
  if (search) {
    const rx = new RegExp(escapeRegex(String(search)), 'i')
    query.$or = [{ title: rx }, { description: rx }]
  }
  return Task.find(query).sort({ createdAt: -1 })
}

export async function getTaskById(id) {
  const task = await Task.findById(id)
  if (!task) throw notFoundError()
  return task
}

export const createTask = (data) => Task.create(data)

export async function updateTask(id, data) {
  const task = await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  if (!task) throw notFoundError()
  return task
}

export const updateTaskStatus = (id, status) => updateTask(id, { status })

export async function deleteTask(id) {
  const task = await Task.findByIdAndDelete(id)
  if (!task) throw notFoundError()
  return task
}
