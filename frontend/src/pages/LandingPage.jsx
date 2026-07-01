import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileUser, X, Menu, ArrowRight, Zap, LayoutTemplate, Download, Star, Users, Clock, CheckCircle } from 'lucide-react'
import { ProfileInfoCard } from '../components/Cards.jsx'
import { UserContext } from '../context/UserContext.jsx'
import Modal from '../components/Modal.jsx'
import Login from '../components/Login.jsx'
import SignUp from '../components/SignUp.jsx'

// ─── Feature card ──────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, description, iconGradient, cardGradient, delay }) => (
    <div className="group relative" style={{ animationDelay: delay }}>
        <div className={`absolute -inset-2 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl rounded-3xl ${cardGradient}`} />
        <div className={`relative bg-gradient-to-br ${cardGradient} border border-white/50 p-6 sm:p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 h-full`}>
            <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-white shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 sm:mb-4">{title}</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">{description}</p>
        </div>
    </div>
)

// ─── Resume SVG illustration ───────────────────────────────────────────────────
const ResumeIllustration = () => (
    <svg viewBox="0 0 400 500" className="w-full h-auto max-w-md mx-auto drop-shadow-2xl">
        <defs>
            <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f8f4ff" />
            </linearGradient>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
            <filter id="shadow">
                <feDropShadow dx="0" dy="8" stdDeviation="16" floodOpacity="0.15" />
            </filter>
        </defs>
        {/* Card background */}
        <rect x="20" y="20" width="360" height="460" rx="20" fill="url(#cardGradient)" stroke="#e2e8f0" strokeWidth="2" filter="url(#shadow)" />
        {/* Header bar */}
        <rect x="20" y="20" width="360" height="90" rx="20" fill="url(#bgGradient)" />
        <rect x="20" y="80" width="360" height="30" fill="url(#bgGradient)" />
        {/* Avatar circle */}
        <circle cx="80" cy="65" r="28" fill="white" opacity="0.3" />
        <circle cx="80" cy="65" r="22" fill="white" opacity="0.5" />
        {/* Name lines */}
        <rect x="120" y="48" width="120" height="10" rx="5" fill="white" opacity="0.9" />
        <rect x="120" y="68" width="80" height="7" rx="3" fill="white" opacity="0.6" />
        {/* Contact row */}
        <rect x="50" y="115" width="90" height="6" rx="3" fill="#8b5cf6" />
        <rect x="150" y="115" width="70" height="6" rx="3" fill="#e2e8f0" />
        <rect x="230" y="115" width="80" height="6" rx="3" fill="#e2e8f0" />
        {/* Summary */}
        <rect x="50" y="145" width="60" height="7" rx="3" fill="#7c3aed" />
        <rect x="50" y="162" width="300" height="4" rx="2" fill="#e2e8f0" />
        <rect x="50" y="174" width="260" height="4" rx="2" fill="#e2e8f0" />
        <rect x="50" y="186" width="280" height="4" rx="2" fill="#e2e8f0" />
        {/* Experience */}
        <rect x="50" y="215" width="80" height="7" rx="3" fill="#d946ef" />
        <rect x="50" y="232" width="150" height="5" rx="2" fill="#374151" />
        <rect x="50" y="246" width="300" height="4" rx="2" fill="#e2e8f0" />
        <rect x="50" y="258" width="240" height="4" rx="2" fill="#e2e8f0" />
        {/* Skills */}
        <rect x="50" y="290" width="55" height="7" rx="3" fill="#7c3aed" />
        <rect x="50" y="308" width="55" height="18" rx="9" fill="#ddd6fe" />
        <rect x="115" y="308" width="65" height="18" rx="9" fill="#ddd6fe" />
        <rect x="190" y="308" width="50" height="18" rx="9" fill="#ddd6fe" />
        <rect x="250" y="308" width="60" height="18" rx="9" fill="#ddd6fe" />
        {/* Education */}
        <rect x="50" y="345" width="75" height="7" rx="3" fill="#d946ef" />
        <rect x="50" y="362" width="180" height="5" rx="2" fill="#374151" />
        <rect x="50" y="376" width="300" height="4" rx="2" fill="#e2e8f0" />
        <rect x="50" y="388" width="220" height="4" rx="2" fill="#e2e8f0" />
        {/* Floating badges */}
        <g>
            <rect x="300" y="160" width="70" height="28" rx="14" fill="#8b5cf6" opacity="0.9">
                <animate attributeName="y" values="160;150;160" dur="3s" repeatCount="indefinite" />
            </rect>
            <text x="335" y="179" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ATS ✓</text>
        </g>
        <g>
            <circle cx="340" cy="380" r="18" fill="#f97316" opacity="0.85">
                <animate attributeName="cy" values="380;370;380" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <text x="340" y="385" textAnchor="middle" fill="white" fontSize="10">★</text>
        </g>
        <g>
            <rect x="22" y="270" width="16" height="16" rx="8" fill="#10b981" opacity="0.8">
                <animateTransform attributeName="transform" type="translate" values="0,0;5,0;0,0" dur="2s" repeatCount="indefinite" />
            </rect>
        </g>
    </svg>
)

// ─── Main Component ────────────────────────────────────────────────────────────
const LandingPage = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [openAuthModal, setOpenAuthModal] = useState(false)
    const [currentPage, setCurrentPage] = useState("login")
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleCTA = () => {
        if (!user) setOpenAuthModal(true)
        else navigate('/dashboard')
    }

    const features = [
        {
            icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10" />,
            title: "Lightning Fast",
            description: "Create professional resumes in under 5 minutes with our streamlined, intuitive process.",
            iconGradient: "from-violet-500 to-purple-600",
            cardGradient: "from-violet-50 to-purple-50",
            delay: "0ms"
        },
        {
            icon: <LayoutTemplate className="w-8 h-8 sm:w-10 sm:h-10" />,
            title: "7 Pro Templates",
            description: "Choose from recruiter-approved, industry-specific templates for every career level.",
            iconGradient: "from-fuchsia-500 to-pink-600",
            cardGradient: "from-fuchsia-50 to-pink-50",
            delay: "100ms"
        },
        {
            icon: <Download className="w-8 h-8 sm:w-10 sm:h-10" />,
            title: "Instant PDF Export",
            description: "Download high-quality PDFs instantly with perfect formatting every time.",
            iconGradient: "from-orange-500 to-red-600",
            cardGradient: "from-orange-50 to-red-50",
            delay: "200ms"
        },
        {
            icon: <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />,
            title: "ATS Optimized",
            description: "Our AI checker ensures your resume passes Applicant Tracking Systems every time.",
            iconGradient: "from-emerald-500 to-teal-600",
            cardGradient: "from-emerald-50 to-teal-50",
            delay: "300ms"
        },
        {
            icon: <Star className="w-8 h-8 sm:w-10 sm:h-10" />,
            title: "AI Powered",
            description: "Improve your bullet points with Gemini AI to make them impactful and recruiter-ready.",
            iconGradient: "from-amber-500 to-orange-600",
            cardGradient: "from-amber-50 to-orange-50",
            delay: "400ms"
        },
        {
            icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />,
            title: "Share Instantly",
            description: "Generate a public read-only link and share your resume with recruiters in one click.",
            iconGradient: "from-blue-500 to-cyan-600",
            cardGradient: "from-blue-50 to-cyan-50",
            delay: "500ms"
        },
    ]

    const stats = [
        { value: '10K+', label: 'Resumes Created', gradient: 'from-violet-600 to-fuchsia-600' },
        { value: '4.9★', label: 'User Rating', gradient: 'from-orange-500 to-red-500' },
        { value: '2 Min', label: 'Avg Build Time', gradient: 'from-emerald-500 to-teal-500' },
        { value: '7', label: 'Pro Templates', gradient: 'from-blue-500 to-cyan-500' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-violet-100/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                            <FileUser className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                            ResuMate
                        </span>
                    </div>

                    {/* Mobile menu button */}
                    <button className="md:hidden p-2 rounded-xl hover:bg-violet-50 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen
                            ? <X size={24} className="text-violet-600" />
                            : <Menu size={24} className="text-violet-600" />}
                    </button>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-6 py-2 text-violet-700 font-bold hover:bg-violet-50 rounded-xl transition-all"
                                >
                                    Dashboard
                                </button>
                                <ProfileInfoCard />
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { setCurrentPage('login'); setOpenAuthModal(true) }}
                                    className="px-6 py-2 text-violet-700 font-bold hover:bg-violet-50 rounded-xl transition-all"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => { setCurrentPage('signup'); setOpenAuthModal(true) }}
                                    className="relative group px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-200"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative">Get Started</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-lg w-full border-b border-violet-100/50 shadow-lg">
                        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <p className="text-violet-700 font-medium text-center py-2">
                                        Welcome back, {user.name}!
                                    </p>
                                    <button
                                        className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl"
                                        onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false) }}
                                    >
                                        Go to Dashboard
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="w-full px-6 py-3 border-2 border-violet-200 text-violet-700 font-bold rounded-xl"
                                        onClick={() => { setCurrentPage('login'); setOpenAuthModal(true); setMobileMenuOpen(false) }}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl"
                                        onClick={() => { setCurrentPage('signup'); setOpenAuthModal(true); setMobileMenuOpen(false) }}
                                    >
                                        Get Started Free
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main className="pt-24">
                {/* ── Hero Section ───────────────────────────────────────────── */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="flex flex-wrap justify-between gap-10 lg:gap-12 items-center">
                        {/* Left */}
                        <div className={`space-y-8 flex-1 min-w-[280px] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 border border-violet-200 text-violet-700 rounded-full font-bold text-xs sm:text-sm">
                                <Zap size={14} className="text-violet-500" />
                                AI-Powered Professional Resume Builder
                            </div>

                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight">
                                <span className="block text-slate-900">Craft</span>
                                <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent">
                                    Professional
                                </span>
                                <span className="block text-slate-900">Resumes</span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg font-medium">
                                Create job-winning resumes with AI-powered templates.
                                ATS-friendly, recruiter-approved, and tailored to your career goals.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    className="group relative px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-200"
                                    onClick={handleCTA}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative flex items-center gap-3">
                                        Start Building Free
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                    </span>
                                </button>
                                <button
                                    className="px-8 sm:px-10 py-3 sm:py-4 border-2 border-violet-200 text-violet-700 font-bold rounded-2xl hover:border-violet-400 hover:bg-violet-50 transition-all"
                                    onClick={handleCTA}
                                >
                                    View Templates →
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 sm:gap-8 pt-4">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="text-center">
                                        <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — animated illustration */}
                        <div className={`relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto flex-1 min-w-[280px] transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="absolute -inset-8 bg-gradient-to-r from-violet-200/50 to-fuchsia-200/50 rounded-3xl blur-3xl" />
                            <div className="relative">
                                <ResumeIllustration />
                                {/* Floating info cards */}
                                <div className="absolute -left-4 top-1/4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-violet-100 animate-bounce">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                                        <CheckCircle size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-800">ATS Score</p>
                                        <p className="text-xs text-emerald-600 font-bold">92/100</p>
                                    </div>
                                </div>
                                <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-fuchsia-100">
                                    <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
                                        <Zap size={16} className="text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-800">AI Improved</p>
                                        <p className="text-xs text-violet-600 font-bold">Just now ✨</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Features Section ────────────────────────────────────────── */}
                <section className="bg-gradient-to-br from-violet-50 to-fuchsia-50 py-16 sm:py-24">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-violet-200 text-violet-700 rounded-full font-bold text-sm mb-6">
                                <Star size={14} className="text-amber-500" /> Why 10,000+ professionals choose us
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6">
                                Why Choose{' '}
                                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    ResuMate?
                                </span>
                            </h2>
                            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                                Everything you need to create a professional resume that stands out
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── How It Works ────────────────────────────────────────────── */}
                <section className="py-16 sm:py-24">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                                Ready in{' '}
                                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    3 Simple Steps
                                </span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { step: '01', title: 'Fill Your Details', desc: 'Enter your experience, skills, education and projects using our guided forms.', color: 'violet' },
                                { step: '02', title: 'Pick a Template', desc: 'Choose from 7 professional templates and customize with AI-powered suggestions.', color: 'fuchsia' },
                                { step: '03', title: 'Download & Share', desc: 'Export as PDF, share with a public link, or check your ATS compatibility score.', color: 'orange' },
                            ].map((item, i) => (
                                <div key={i} className="relative text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                    <div className={`text-6xl font-black bg-gradient-to-r ${i === 0 ? 'from-violet-200 to-violet-300' : i === 1 ? 'from-fuchsia-200 to-fuchsia-300' : 'from-orange-200 to-orange-300'} bg-clip-text text-transparent mb-4`}>
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                                    {i < 2 && (
                                        <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-2xl text-gray-300">→</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA Section ─────────────────────────────────────────────── */}
                <section className="py-16 sm:py-24 bg-gradient-to-br from-violet-50 to-fuchsia-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="relative">
                            <div className="absolute -inset-6 sm:-inset-8 bg-gradient-to-r from-violet-200/50 to-fuchsia-200/50 rounded-3xl blur-3xl" />
                            <div className="relative bg-gradient-to-br from-white to-violet-50 border border-violet-100 rounded-3xl p-8 sm:p-16">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 sm:mb-6">
                                    Ready to Build Your{' '}
                                    <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                        Standout Resume?
                                    </span>
                                </h2>
                                <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-10 max-w-2xl mx-auto font-medium">
                                    Join thousands of professionals who landed their dream jobs with ResuMate
                                </p>
                                <button
                                    className="group relative px-8 sm:px-12 py-3 sm:py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-200"
                                    onClick={handleCTA}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative flex items-center gap-3">
                                        Start Building Now — It's Free
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── Footer ─────────────────────────────────────────────────────── */}
            <footer className="border-t border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 py-6 sm:py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm sm:text-base text-slate-500 font-medium">
                        Crafted with{' '}
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">❤️</span>
                        {' '}by{' '}
                        <a href="https://www.linkedin.com/in/soumitrasahoo" target="_blank" rel="noreferrer"
                            className="hover:text-purple-400 underline">
                            Soumitra Sahoo
                        </a>
                    </p>
                </div>
            </footer>

            {/* ── Auth Modal ──────────────────────────────────────────────────── */}
            <Modal isOpen={openAuthModal} onClose={() => { setOpenAuthModal(false); setCurrentPage("login") }} hideHeader>
                <div>
                    {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
                    {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
                </div>
            </Modal>
        </div>
    )
}

export default LandingPage