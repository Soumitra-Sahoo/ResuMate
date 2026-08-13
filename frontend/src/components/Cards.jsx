import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import { Award, Check, Clock, Edit, Trash2, TrendingUp, Zap, FileText } from "lucide-react"
import { resolveAssetUrl } from "../utils/apiPaths"

// ─── ProfileInfoCard ───────────────────────────────────────────────────────────
export const ProfileInfoCard = () => {
    const navigate = useNavigate()
    const { user, clearUser } = useContext(UserContext)

    const handleLogout = () => {
        localStorage.clear()
        clearUser()
        navigate('/')
    }

    return (
        user && (
            <div className="flex items-center gap-3 p-2 sm:p-3 bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-md">
                    <span className="text-base sm:text-lg font-black text-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : ""}
                    </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100">
                    {user.name || ""}
                </div>
                <button
                    className="text-violet-600 dark:text-violet-400 text-[10px] sm:text-xs font-bold cursor-pointer hover:text-fuchsia-600 transition-colors"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        )
    )
}

// ─── ResumeSummaryCard ─────────────────────────────────────────────────────────
export const ResumeSummaryCard = ({
    title = "Untitled Resume",
    createdAt = null,
    updatedAt = null,
    thumbnailLink = null,
    onSelect,
    onDelete,
    completion = 85,
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [thumbFailed, setThumbFailed] = useState(false)

    const formattedCreatedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "—"

    const formattedUpdatedDate = updatedAt
        ? new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "—"

    const getCompletionColor = () => {
        if (completion >= 90) return "from-emerald-500 to-green-600"
        if (completion >= 70) return "from-yellow-500 to-orange-500"
        return "from-red-500 to-pink-600"
    }

    const getCompletionIcon = () => {
        if (completion >= 90) return <Award size={12} />
        if (completion >= 70) return <TrendingUp size={12} />
        return <Zap size={12} />
    }

    const handleDeleteClick = (e) => {
        e.stopPropagation()
        if (onDelete) onDelete()
    }

    const generateDesign = () => {
        const colors = [
            "from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5",
            "from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-500/5",
            "from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-500/5",
            "from-amber-50 to-amber-100 dark:from-amber-500/10 dark:to-amber-500/5",
            "from-rose-50 to-rose-100 dark:from-rose-500/10 dark:to-rose-500/5"
        ]
        return colors[title.length % colors.length]
    }

    const designColor = generateDesign()
    const showRealThumbnail = thumbnailLink && !thumbFailed

    return (
        <div
            className="group relative h-[360px] sm:h-[380px] lg:h-[400px] flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-500/40"
            onClick={onSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Hover background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-100 dark:from-violet-500/10 via-transparent to-fuchsia-100 dark:to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Completion indicator */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 rounded-full shadow-sm backdrop-blur-sm">
                <div className={`w-3 h-3 rounded-full flex items-center justify-center bg-gradient-to-r ${getCompletionColor()}`}>
                    <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{completion}%</span>
                {getCompletionIcon()}
            </div>

            <div className={`relative flex-1 overflow-hidden ${showRealThumbnail ? 'bg-gray-100 dark:bg-gray-950' : `p-4 sm:p-6 bg-gradient-to-br ${designColor}`}`}>
                {showRealThumbnail ? (
                    <img
                        src={resolveAssetUrl(thumbnailLink)}
                        alt={`${title} preview`}
                        className="w-full h-full object-cover object-top"
                        onError={() => setThumbFailed(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 dark:bg-gray-900/90 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                            <FileText size={28} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-gray-800 dark:text-gray-100 text-sm font-bold">{title}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            {completion === 0 ? "Start building" : `${completion}% completed`}
                        </span>
                        <div className="mt-4 flex gap-2">
                            {['Profile', 'Work', 'Skills', 'Edu'].map((section, i) => (
                                <div key={i}
                                    className={`px-2 py-1 text-xs rounded-md ${i < Math.floor(completion / 25)
                                        ? 'bg-white/90 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'bg-white/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-500'}`}
                                >
                                    {section}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hover action buttons */}
                {isHovered && (
                    <div className="absolute inset-4 sm:inset-6 bg-gradient-to-t from-white/80 dark:from-black/80 via-white/20 dark:via-black/20 to-transparent flex items-end justify-center p-6 rounded-2xl">
                        <div className="flex gap-3">
                            <button
                                onClick={(e) => { e.stopPropagation(); if (onSelect) onSelect() }}
                                className="group/btn w-12 h-12 flex items-center justify-center bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl shadow-md hover:scale-110 transition-all duration-300"
                                title="Edit"
                            >
                                <Edit size={18} className="text-white group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="group/btn w-12 h-12 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-md hover:scale-110 transition-all duration-300"
                                title="Delete"
                            >
                                <Trash2 size={18} className="text-white group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Info area */}
            <div className="bg-gray-50 dark:bg-gray-950/50 border-t border-gray-200 dark:border-gray-800 p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h5 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 truncate mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {title}
                        </h5>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock size={12} />
                            <span>Created: {formattedCreatedDate}</span>
                            <span className="ml-2">Updated: {formattedUpdatedDate}</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getCompletionColor()} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                        style={{ width: `${completion}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {completion < 50 ? "Getting Started" : completion < 80 ? "Almost There" : "Ready to Go!"}
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{completion}% Complete</span>
                </div>
            </div>
        </div>
    )
}

export const TemplateCard = ({ thumbnailImg, isSelected, onSelect }) => {
    return (
        <div
            className={`group h-auto md:h-[300px] lg:h-[320px] flex flex-col bg-white dark:bg-gray-900 border-2 overflow-hidden
                cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-lg rounded-3xl
                ${isSelected
                    ? "border-violet-500 shadow-lg shadow-violet-500/20 bg-violet-50 dark:bg-violet-500/10"
                    : "border-gray-200 dark:border-gray-800 hover:border-violet-300"}`}
            onClick={onSelect}
        >
            {thumbnailImg ? (
                <div className="relative w-full h-full overflow-hidden">
                    <img
                        src={thumbnailImg || "/placeholder.svg"}
                        alt="Template Preview"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {isSelected && (
                            <div className="absolute inset-0 bg-violet-500/10 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white dark:bg-gray-900 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                    <Check size={24} className="text-violet-600 dark:text-violet-400" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            ) : (
                <div className="w-full h-[200px] flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-violet-600 to-fuchsia-50 dark:from-violet-500/20 dark:via-violet-700 dark:to-fuchsia-500/20 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-3">
                        <Edit className="text-white" size={20} />
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-bold">No Preview</span>
                </div>
            )}
        </div>
    )
}