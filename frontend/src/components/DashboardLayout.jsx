import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import Sidebar from './Sidebar'
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

export const DashboardSearchContext = createContext({ query: '', setQuery: () => {} })
export const useDashboardSearch = () => useContext(DashboardSearchContext)

const ProfileDropdown = () => {
    const { user, clearUser } = useContext(UserContext)
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    if (!user) return null

    const handleLogout = () => {
        localStorage.clear()
        clearUser()
        window.location.href = '/'
    }

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-black text-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : ''}
                    </span>
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">{user.name}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">Free Plan</p>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl py-1.5 z-50">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

const TopBar = ({ onOpenMobileSidebar }) => {
    const { query, setQuery } = useDashboardSearch()

    return (
        <div className="h-16 flex items-center gap-4 px-4 sm:px-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-40">
            <button
                type="button"
                className="lg:hidden p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900"
                onClick={onOpenMobileSidebar}
            >
                <Menu size={20} className="text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex-1 max-w-md relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your resumes..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:border-violet-300 dark:focus:border-violet-500 transition-all text-gray-700 dark:text-gray-200 placeholder-gray-400"
                />
            </div>

            <div className="flex-1" />

            <button
                type="button"
                onClick={() => toast('No new notifications')}
                className="relative p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
                <Bell size={18} className="text-gray-500 dark:text-gray-400" />
            </button>

            <ProfileDropdown />
        </div>
    )
}

const DashboardLayout = ({ children }) => {
    const { user, loading } = useContext(UserContext)
    const [query, setQuery] = useState('')
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <DashboardSearchContext.Provider value={{ query, setQuery }}>
            <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
                {/* Desktop sidebar */}
                <div className="hidden lg:block sticky top-0 h-screen">
                    <Sidebar />
                </div>

                {/* Mobile sidebar drawer */}
                {mobileSidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
                        <div className="absolute left-0 top-0 h-full">
                            <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
                        </div>
                        <button
                            type="button"
                            className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-xl"
                            onClick={() => setMobileSidebarOpen(false)}
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className="flex-1 min-w-0 flex flex-col">
                    <TopBar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
                    {user && <div className="flex-1">{children}</div>}
                </div>
            </div>
        </DashboardSearchContext.Provider>
    )
}

export default DashboardLayout