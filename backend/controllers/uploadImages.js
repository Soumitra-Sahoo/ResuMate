import fs from 'fs'
import path from 'path'
import Resume from '../models/resumeModel.js'
import upload from '../middleware/uploadMiddleware.js'

export const uploadResumeImages = async (req, res) => {
    try {
        upload.fields([
            { name: 'thumbnail', maxCount: 1 },
            { name: 'profileImage', maxCount: 1 }
        ])(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'File upload failed', error: err.message })
            }

            const resumeId = req.params.id
            const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })

            if (!resume) {
                return res.status(404).json({ message: 'Resume not found' })
            }

            const uploadsFolder = path.join(process.cwd(), 'uploads')
            const baseUrl = `${req.protocol}://${req.get('host')}`

            const newThumbnail = req.files?.thumbnail?.[0]
            const newProfileImage = req.files?.profileImage?.[0]

            if (newThumbnail) {
                if (resume.thumbnailLink) {
                    const oldPath = path.join(uploadsFolder, path.basename(resume.thumbnailLink))
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`
            }

            if (newProfileImage) {
                if (resume.profileInfo?.profilePreviewUrl) {
                    const oldPath = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl))
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
                }
                resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`
            }

            await resume.save()

            res.status(200).json({
                message: 'Images uploaded successfully',
                thumbnailLink: resume.thumbnailLink,
                profilePreviewUrl: resume.profileInfo?.profilePreviewUrl
            })
        })
    } catch (err) {
        console.error('Error uploading images:', err)
        res.status(500).json({ message: 'Failed to upload images', error: err.message })
    }
}