import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createResume, deleteResume, getResumeById, getUserResumes,
    updateResume, duplicateResume, generateShareLink,
    revokeShareLink, getPublicResume,
} from "../controllers/resumeController.js";
import { uploadResumeImages } from "../controllers/uploadImages.js";

const resumeRouter = express.Router()

resumeRouter.get('/view/:token', getPublicResume)
resumeRouter.post('/', protect, createResume)
resumeRouter.get('/', protect, getUserResumes)
resumeRouter.get('/:id', protect, getResumeById)
resumeRouter.put('/:id', protect, updateResume)
resumeRouter.delete('/:id', protect, deleteResume)
resumeRouter.post('/:id/upload-images', protect, uploadResumeImages)
resumeRouter.post('/:id/duplicate', protect, duplicateResume)
resumeRouter.post('/:id/share', protect, generateShareLink)
resumeRouter.delete('/:id/share', protect, revokeShareLink)

export default resumeRouter;