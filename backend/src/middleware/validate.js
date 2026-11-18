import mongoose from 'mongoose'
import AppError from '../utils/AppError.js'
import { STATUSES, PRIORITIES } from '../models/Task.js'

export function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(new AppError('Invalid task id', 400))
  next()
}

// Validates and whitelists the body for create (POST) and update (PUT).
export function validateTask(req, res, next) {
  const { title, description, status, priority, dueDate } = req.body || {}
  const errors = []
  const clean = {}

  if (req.method === 'POST' || title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) errors.push('Title is required')
    else if (title.trim().length > 100) errors.push('Title cannot exceed 100 characters')
    else clean.title = title.trim()
  }
  if (description !== undefined) {
    if (typeof description !== 'string') errors.push('Description must be text')
    else if (description.length > 500) errors.push('Description cannot exceed 500 characters')
    else clean.description = description.trim()
  }
  if (status !== undefined) {
    if (!STATUSES.includes(status)) errors.push(`Status must be one of: ${STATUSES.join(', ')}`)
    else clean.status = status
  }
  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) errors.push(`Priority must be one of: ${PRIORITIES.join(', ')}`)
    else clean.priority = priority
  }
  if (dueDate !== undefined) {
    if (dueDate === null || dueDate === '') clean.dueDate = null
    else if (Number.isNaN(Date.parse(dueDate))) errors.push('Due date is not a valid date')
    else clean.dueDate = dueDate
  }

  if (errors.length) return next(new AppError(errors.join(', '), 400))
  req.body = clean
  next()
}

export function validateStatus(req, res, next) {
  const status = req.body?.status
  if (!STATUSES.includes(status)) return next(new AppError(`Status must be one of: ${STATUSES.join(', ')}`, 400))
  req.body = { status }
  next()
}
