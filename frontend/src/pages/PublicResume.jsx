import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LayoutTemplate, Loader2, AlertCircle } from 'lucide-react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import RenderResume from '../components/RenderResume'

const PublicResume = () => {
    const { token } = useParams()
    const [resumeData, setResumeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await axiosInstance.get(API_PATHS.RESUME.GET_PUBLIC(token))
                setResumeData(res.data)
            } catch {
                setError('This resume link is invalid or has been revoked.')
            } finally {
                setLoading(false)
            }
        }
        fetchResume()
    }, [token])

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">

            {/* Top bar */}
            <div className="h-14 bg-white/80 backdrop-blur-xl border-b border-violet-100 flex items-center justify-between px-6 sticky top-0 z-10">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-md">
                        <LayoutTemplate className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        ResuMate
                    </span>
                </Link>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    Read-only view
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-10">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 size={36} className="animate-spin text-violet-600" />
                        <p className="text-gray-500 font-medium">Loading resume…</p>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Resume Not Found</h2>
                        <p className="text-gray-500 max-w-md">{error}</p>
                        <Link to="/" className="mt-2 px-6 py-2 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all">
                            Go to ResuMate
                        </Link>
                    </div>
                )}

                {!loading && !error && resumeData && (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-black text-gray-900 mb-1">{resumeData.title}</h1>
                            <p className="text-gray-500 text-sm">Shared via ResuMate · Read-only</p>
                        </div>
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            <RenderResume
                                templateId={resumeData?.template?.theme || '01'}
                                resumeData={resumeData}
                                containerWidth={null}
                            />
                        </div>
                        <div className="text-center mt-8">
                            <p className="text-gray-400 text-sm mb-3">Want to build your own resume?</p>
                            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg">
                                <LayoutTemplate size={18} />
                                Create your resume on ResuMate
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default PublicResume