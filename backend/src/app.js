import express from 'express'
import cors from 'cors'
import taskRoutes from './routes/taskRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || true }))
app.use(express.json())

app.get('/', (req, res) => res.json({ success: true, message: 'To-Do API is running' }))
app.use('/api/tasks', taskRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
