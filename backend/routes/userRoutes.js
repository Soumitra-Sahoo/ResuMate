import express from "express"
import {
    getUserProfile, loginUser, registerUser, uploadUserImage,
    updateUserProfile, changePassword, deleteAccount,
} from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/profile", protect, getUserProfile)
userRouter.put("/profile", protect, updateUserProfile)
userRouter.put("/change-password", protect, changePassword)
userRouter.delete("/account", protect, deleteAccount)

userRouter.post("/upload-image", protect, uploadUserImage)

export default userRouter