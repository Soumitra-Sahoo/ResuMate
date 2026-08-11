import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutTemplate, Home, FileText, LayoutGrid, Rocket, Settings, Crown, Moon, Sun } from 'lucide-react'
import { UserContext } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: Home, end: true },
    { to: '/dashboard', label: 'My Resumes', icon: FileText },
    { to: '/templates', label: 'Templates', icon: LayoutGrid },
    { to: '/ai-assistant', label: 'AI Assistant', icon: Rocket, badge: 'New' },
    { to: '/settings', label: 'Settings', icon: Settings },
]

const Sidebar = ({ onNavigate }) => {
    const { clearUser } = useContext(UserContext)
    const { isDark, toggleTheme } = useTheme()
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.clear()
        clearUser()
        navigate('/')
    }

    return (
        <aside className="flex flex-col h-full w-64 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 px-4 py-5">
            {/* Logo */}
            <NavLink to="/dashboard" className="flex items-center gap-2.5 px-2 mb-8" onClick={onNavigate}>
                <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-200 dark:shadow-none">
                    <LayoutTemplate className="w-4.5 h-4.5 text-white" size={18} />
                </div>
                <span className="text-lg font-black text-gray-900 dark:text-white">
                    Resu<span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Mate</span>
                </span>
            </NavLink>

            {/* Nav */}
            <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
                    <NavLink
                        key={label}
                        to={to}
                        end={end}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                isActive
                                    ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-800 dark:hover:text-gray-200'
                            }`
                        }
                    >
                        <Icon size={18} />
                        <span className="flex-1">{label}</span>
                        {badge && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
                                {badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="flex-1" />

            <div className="rounded-2xl border border-violet-100 dark:border-violet-500/20 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-500/10 dark:to-fuchsia-500/10 p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <Crown size={16} className="text-amber-500" />
                    <span className="text-sm font-black text-gray-900 dark:text-white">Upgrade to Pro</span>
                </div>
                <ul className="space-y-1.5 mb-4">
                    {['Unlimited templates', 'AI suggestions', 'Export to PDF', 'Priority support'].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                            <span className="w-1 h-1 rounded-full bg-violet-500" /> {f}
                        </li>
                    ))}
                </ul>
                <button
                    type="button"
                    className="w-full py-2 text-xs font-black text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:scale-105 transition-all"
                    onClick={() => toast('Pro plans are coming soon! 🚀')}
                >
                    Upgrade Now →
                </button>
            </div>

            {/* Theme toggle */}
            <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
                <span className="flex items-center gap-3">
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
                <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${isDark ? 'bg-violet-600 justify-end' : 'bg-gray-200 justify-start'}`}>
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
            </button>

            <button
                type="button"
                onClick={handleLogout}
                className="mt-2 text-xs font-bold text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-3 text-left"
            >
                Log out
            </button>
        </aside>
    )
}

export default Sidebar