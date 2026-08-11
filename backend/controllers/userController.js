import User from "../models/userModel.js";
import Resume from "../models/resumeModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "fs/promises"
import path from "path"
import upload from "../middleware/uploadMiddleware.js"

//Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({id : userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
}
export const registerUser = async (req, res) => {
    try {
        const {name , email , password} = req.body;
        //Check if user already exists
        const UserExists = await User.findOne({email});
        if(UserExists){
            return res.status(400).json({message: "User already exists"})
        }
        if(password.length < 6){
            return res.status(400).json({success: false ,message: "Password must be at least 6 characters"})
        }

        //Hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        res.status(201).json({
            _id : user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message:"Server error", error:error.message})
    }
}
//Login Function
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid email or password"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"})
        }
            res.status(200).json({
            _id : user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message:"Server error", error:error.message})
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message:"Server error", error:error.message})
    }
}

export const uploadUserImage = (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err.message })
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' })
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`
        res.status(200).json({ imageUrl })
    })
}

export const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body
        const user = await User.findById(req.user._id)
        if (!user) return res.status(404).json({ message: "User not found" })

        if (typeof email === 'string' && email.trim() && email.trim() !== user.email) {
            const emailTaken = await User.findOne({ email: email.trim(), _id: { $ne: user._id } })
            if (emailTaken) return res.status(400).json({ message: "That email is already in use" })
            user.email = email.trim()
        }

        if (typeof name === 'string' && name.trim()) {
            user.name = name.trim()
        }

        await user.save()
        res.json({ _id: user._id, name: user.name, email: user.email })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" })
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" })
        }

        const user = await User.findById(req.user._id)
        if (!user) return res.status(404).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()

        res.json({ message: "Password updated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const safeUnlink = async (filePath) => {
    try {
        await fs.unlink(filePath)
    } catch (err) {
        if (err.code !== 'ENOENT') console.warn('Failed to delete file:', err.message)
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id
        const resumes = await Resume.find({ userId })
        const uploadsFolder = path.join(process.cwd(), 'uploads')

        for (const resume of resumes) {
            if (resume.thumbnailLink) {
                await safeUnlink(path.join(uploadsFolder, path.basename(resume.thumbnailLink)))
            }
            if (resume.profileInfo?.profilePreviewUrl) {
                await safeUnlink(path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl)))
            }
        }

        await Resume.deleteMany({ userId })
        await User.findByIdAndDelete(userId)

        res.json({ message: "Account deleted" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}