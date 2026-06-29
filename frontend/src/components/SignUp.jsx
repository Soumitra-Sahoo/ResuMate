import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../utils/helper'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { Input } from '../components/Input.jsx'

const SignUp = ({ setCurrentPage }) => {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const { updateUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()
        if (!fullName) { setError('Please enter Full Name'); return }
        if (!validateEmail(email)) { setError('Please enter a valid email address'); return }
        if (!password) { setError('Please enter password'); return }
        setError('')
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { name: fullName, email, password })
            const { token } = response.data
            if (token) {
                localStorage.setItem('token', token)
                updateUser(response.data)
                navigate('/dashboard')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred')
        }
    }

    return (
        <div className="w-[90vw] md:w-[400px] p-8 bg-gradient-to-br from-white to-rose-50 rounded-3xl border border-rose-100 shadow-2xl overflow-hidden">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Create Account</h3>
                <p className="text-slate-600 font-medium">Join thousands of professionals today</p>
            </div>
            <form onSubmit={handleSignUp} className="space-y-4">
                <Input value={fullName} onChange={({ target }) => setFullName(target.value)}
                    label="Full Name" placeholder="Your Name" type="text" />
                <Input value={email} onChange={({ target }) => setEmail(target.value)}
                    label="Email" placeholder="email@example.com" type="email" />
                <Input value={password} onChange={({ target }) => setPassword(target.value)}
                    label="Password" placeholder="Min 6 characters" type="password" />
                {error && (
                    <div className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}
                <button type="submit"
                    className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all text-lg">
                    Create Account
                </button>
                <p className="text-center text-sm text-slate-600 font-medium">
                    Already have an account?{' '}
                    <button onClick={() => setCurrentPage('login')} type="button"
                        className="font-black text-rose-600 hover:text-pink-600 transition-colors">
                        Sign In
                    </button>
                </p>
            </form>
        </div>
    )
}

export default SignUp