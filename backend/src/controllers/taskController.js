// Controllers: read the request, call the service, send the response.
import * as taskService from '../services/taskService.js'
import asyncHandler from '../utils/asyncHandler.js'

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasks(req.query)
  res.json({ success: true, count: tasks.length, data: tasks })
})

export const getTask = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await taskService.getTaskById(req.params.id) })
})

export const createTask = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await taskService.createTask(req.body) })
})

export const updateTask = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await taskService.updateTask(req.params.id, req.body) })
})

export const updateStatus = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await taskService.updateTaskStatus(req.params.id, req.body.status) })
})

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id)
  res.json({ success: true, message: 'Task deleted' })
})
