import mongoose from 'mongoose'

export const STATUSES = ['pending', 'in-progress', 'completed']
export const PRIORITIES = ['low', 'medium', 'high']

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: [100, 'Title cannot exceed 100 characters'] },
    description: { type: String, trim: true, maxlength: [500, 'Description cannot exceed 500 characters'], default: '' },
    status: { type: String, enum: { values: STATUSES, message: 'Status must be pending, in-progress or completed' }, default: 'pending' },
    priority: { type: String, enum: { values: PRIORITIES, message: 'Priority must be low, medium or high' }, default: 'medium' },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
