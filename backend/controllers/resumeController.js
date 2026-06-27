import Resume from '../models/resumeModel.js';
import fs from 'fs'
import path from 'path';
import crypto from 'crypto';

export const createResume = async (req, res) => {
    try {
        const { title } = req.body;
        const defaultResumeData = {
            profileInfo: { profilePreviewUrl: '', fullName: '', designation: '', summary: '' },
            contactInfo: { email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
            workExperience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
            education: [{ degree: '', institution: '', startDate: '', endDate: '' }],
            skills: [{ name: '', progress: 0 }],
            projects: [{ title: '', description: '', github: '', liveDemo: '' }],
            certifications: [{ title: '', issuer: '', year: '' }],
            languages: [{ name: '', progress: 0 }],
            interests: [''],
        };
        const newResume = await Resume.create({ userId: req.user._id, title, ...defaultResumeData, ...req.body })
        res.status(201).json(newResume)
    } catch (error) {
        res.status(500).json({ message: "Failed to create resume", error: error.message })
    }
}

export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json(resumes)
    } catch (error) {
        res.status(500).json({ message: "Failed to get resumes", error: error.message })
    }
}

export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id })
        if (!resume) return res.status(404).json({ message: "Resume not found" })
        res.json(resume)
    } catch (error) {
        res.status(500).json({ message: "Failed to get resume", error: error.message })
    }
}

export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id })
        if (!resume) return res.status(404).json({ message: "Resume not found" })
        Object.assign(resume, req.body)
        const savedResume = await resume.save();
        res.json(savedResume)
    } catch (error) {
        res.status(500).json({ message: "Failed to update resume", error: error.message })
    }
}

export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id })
        if (!resume) return res.status(404).json({ message: "Resume not found or not authorized" })
        const uploadsFolder = path.join(process.cwd(), 'uploads')
        if (resume.thumbnailLink) {
            const oldThumb = path.join(uploadsFolder, path.basename(resume.thumbnailLink))
            if (fs.existsSync(oldThumb)) fs.unlinkSync(oldThumb)
        }
        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl))
            if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile)
        }
        await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
        res.json({ message: "Resume deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete resume", error: error.message })
    }
}

export const duplicateResume = async (req, res) => {
    try {
        const original = await Resume.findOne({ _id: req.params.id, userId: req.user._id })
        if (!original) return res.status(404).json({ message: "Resume not found" })
        const data = original.toObject()
        delete data._id; delete data.createdAt; delete data.updatedAt
        delete data.thumbnailLink; delete data.shareToken
        data.isPublic = false
        data.title = `${original.title} (Copy)`
        const newResume = await Resume.create(data)
        res.status(201).json(newResume)
    } catch (error) {
        res.status(500).json({ message: "Failed to duplicate resume", error: error.message })
    }
}

export const generateShareLink = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id })
        if (!resume) return res.status(404).json({ message: "Resume not found" })
        if (!resume.shareToken) resume.shareToken = crypto.randomBytes(16).toString('hex')
        resume.isPublic = true
        await resume.save()
        const shareUrl = `${process.env.FRONTEND_URL}/resume/view/${resume.shareToken}`
        res.json({ shareUrl, shareToken: resume.shareToken })
    } catch (error) {
        res.status(500).json({ message: "Failed to generate share link", error: error.message })
    }
}

export const revokeShareLink = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id })
        if (!resume) return res.status(404).json({ message: "Resume not found" })
        resume.shareToken = null
        resume.isPublic = false
        await resume.save()
        res.json({ message: "Share link revoked" })
    } catch (error) {
        res.status(500).json({ message: "Failed to revoke share link", error: error.message })
    }
}

export const getPublicResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ shareToken: req.params.token, isPublic: true }).select('-userId -shareToken')
        if (!resume) return res.status(404).json({ message: "Resume not found or link revoked" })
        res.json(resume)
    } catch (error) {
        res.status(500).json({ message: "Failed to get resume", error: error.message })
    }
}