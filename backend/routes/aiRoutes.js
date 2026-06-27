import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { improveBullet, getATSScore } from '../controllers/aiController.js'

const aiRouter = express.Router()

aiRouter.post('/improve-bullet', protect, improveBullet)
aiRouter.post('/ats-score', protect, getATSScore)

export default aiRouter