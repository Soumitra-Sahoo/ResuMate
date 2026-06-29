import React, { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { Input } from '../components/Input.jsx'
import { validateEmail } from '../utils/helper.js'

const Login = ({ setCurrentPage }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const { updateUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!validateEmail(email)) { setError('Please enter a valid email address'); return }
        if (!password) { setError('Please enter password'); return }
        setError('')
        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password })
            const { token } = response.data
            if (token) {
                localStorage.setItem('token', token)
                updateUser(response.data)
                navigate('/dashboard')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="w-[90vw] md:w-[400px] p-8 bg-gradient-to-br from-white to-violet-50 rounded-3xl border border-violet-100 shadow-2xl">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Welcome Back</h3>
                <p className="text-slate-600 font-medium">Sign in to continue building amazing resumes</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
                <Input value={email} onChange={({ target }) => setEmail(target.value)}
                    label="Email" placeholder="resumate@example.com" type="email" />
                <Input value={password} onChange={({ target }) => setPassword(target.value)}
                    label="Password" placeholder="Min 6 characters" type="password" />
                {error && (
                    <div className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}
                <button type="submit"
                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-violet-200 transition-all text-lg">
                    Sign In
                </button>
                <p className="text-center text-sm text-slate-600 font-medium">
                    Don't have an account?{' '}
                    <button onClick={() => setCurrentPage('signup')} type="button"
                        className="font-black text-violet-600 hover:text-fuchsia-600 transition-colors">
                        Sign Up
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Login