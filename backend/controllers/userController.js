import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
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

//Get user profile function
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