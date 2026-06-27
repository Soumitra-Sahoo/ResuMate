import React, { useCallback, useEffect, useRef, useState } from 'react'
import DashboardLayout from './DashboardLayout'
import { TitleInput } from './Input'
import { useNavigate, useParams } from 'react-router-dom'
import {
    AlertCircle, ArrowLeft, Check, Download, Loader2,
    Palette, Save, Trash2, BarChart2
} from 'lucide-react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import toast from 'react-hot-toast'
import { fixTailwindColors } from '../utils/color'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import { dataURLtoFile } from '../utils/helper'
import StepProgress from './StepProgress'
import {
    ProfileInfoForm, ContactInfoForm, WorkExperienceForm,
    EducationDetailsForm, SkillsInfoForm, ProjectDetailForm,
    CertificationInfoForm, AdditionalInfoForm
} from './Forms'
import RenderResume from './RenderResume'
import Modal from './Modal'
import ThemeSelector from './ThemeSelector'

const useResizeObserver = () => {
    const [size, setSize] = useState({ width: 0, height: 0 })
    const ref = useCallback((node) => {
        if (node) {
            const ro = new ResizeObserver((entries) => {
                const { width, height } = entries[0].contentRect
                setSize({ width, height })
            })
            ro.observe(node)
        }
    }, [])
    return { ...size, ref }
}

const ATSPanel = ({ resumeData, onClose }) => {
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axiosInstance.post(API_PATHS.AI.ATS_SCORE, { resumeData })
                setResult(res.data)
            } catch {
                toast.error('Failed to get ATS score')
                onClose()
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    const scoreColor = (s) => s >= 80 ? 'text-emerald-600' : s >= 60 ? 'text-amber-500' : 'text-red-500'
    const barColor = (s) => s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-amber-400' : 'bg-red-400'

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {loading ? (
                <div className="flex flex-col items-center py-12 gap-4">
                    <Loader2 size={36} className="animate-spin text-violet-600" />
                    <p className="text-gray-600 font-medium">Analyzing your resume with AI...</p>
                </div>
            ) : result && (
                <div className="space-y-6">
                    {/* Overall score */}
                    <div className="text-center">
                        <div className={`text-6xl font-black ${scoreColor(result.overallScore)}`}>
                            {result.overallScore}
                            <span className="text-2xl text-gray-400">/100</span>
                        </div>
                        <p className="text-gray-500 mt-1 font-medium">ATS Compatibility Score</p>
                    </div>

                    {/* Section scores */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-800">Section Breakdown</h3>
                        {Object.entries(result.sections || {}).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1')}
                                    </span>
                                    <span className={`font-bold ${scoreColor(val.score)}`}>{val.score}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${barColor(val.score)}`}
                                        style={{ width: `${val.score}%` }} />
                                </div>
                                {val.tip && <p className="text-xs text-gray-500 mt-1">💡 {val.tip}</p>}
                            </div>
                        ))}
                    </div>

                    {/* Issues & Strengths */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                            <h4 className="font-bold text-red-700 mb-2 text-sm">⚠ Top Issues</h4>
                            <ul className="space-y-1">
                                {result.topIssues?.map((issue, i) => (
                                    <li key={i} className="text-xs text-red-600">• {issue}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                            <h4 className="font-bold text-emerald-700 mb-2 text-sm">✓ Strengths</h4>
                            <ul className="space-y-1">
                                {result.topStrengths?.map((s, i) => (
                                    <li key={i} className="text-xs text-emerald-600">• {s}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Keywords */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Keywords Found</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.keywordsFound?.map((k, i) => (
                                <span key={i} className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full font-medium">{k}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Keywords to Add</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.keywordsMissing?.map((k, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{k}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const SaveIndicator = ({ status }) => {
    if (status === 'idle') return null
    return (
        <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200">
            {status === 'saving' && <><Loader2 size={12} className="animate-spin text-violet-500" /><span className="text-gray-500">Saving...</span></>}
            {status === 'saved' && <><Check size={12} className="text-emerald-500" /><span className="text-emerald-600">Saved</span></>}
            {status === 'error' && <><AlertCircle size={12} className="text-red-500" /><span className="text-red-500">Save failed</span></>}
        </div>
    )
}

const EditResume = () => {
    const { resumeId } = useParams()
    const navigate = useNavigate()
    const resumeDownloadRef = useRef(null)
    const thumbnailRef = useRef(null)
    const autoSaveTimerRef = useRef(null)

    const [openThemeSelector, setOpenThemeSelector] = useState(false)
    const [openPreviewModal, setOpenPreviewModal] = useState(false)
    const [openATSModal, setOpenATSModal] = useState(false)
    const [currentPage, setCurrentPage] = useState('profile-info')
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadSuccess, setDownloadSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [completionPercentage, setCompletionPercentage] = useState(0)
    const [saveStatus, setSaveStatus] = useState('idle')
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const { width: previewWidth, ref: previewContainerRef } = useResizeObserver()

    const [resumeData, setResumeData] = useState({
        title: 'Professional Resume',
        thumbnailLink: '',
        profileInfo: { fullName: '', designation: '', summary: '' },
        template: { theme: 'modern', colorPalette: [] },
        contactInfo: { email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
        workExperience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
        education: [{ degree: '', institution: '', startDate: '', endDate: '' }],
        skills: [{ name: '', progress: 0 }],
        projects: [{ title: '', description: '', github: '', liveDemo: '' }],
        certifications: [{ title: '', issuer: '', year: '' }],
        languages: [{ name: '', progress: 0 }],
        interests: [''],
    })

    const calculateCompletion = useCallback(() => {
        let done = 0, total = 0
        total += 3
        if (resumeData.profileInfo.fullName) done++
        if (resumeData.profileInfo.designation) done++
        if (resumeData.profileInfo.summary) done++
        total += 2
        if (resumeData.contactInfo.email) done++
        if (resumeData.contactInfo.phone) done++
        resumeData.workExperience.forEach(e => {
            total += 5
            if (e.company) done++; if (e.role) done++
            if (e.startDate) done++; if (e.endDate) done++; if (e.description) done++
        })
        resumeData.education.forEach(e => {
            total += 4
            if (e.degree) done++; if (e.institution) done++
            if (e.startDate) done++; if (e.endDate) done++
        })
        resumeData.skills.forEach(s => { total += 2; if (s.name) done++; if (s.progress > 0) done++ })
        resumeData.projects.forEach(p => {
            total += 4
            if (p.title) done++; if (p.description) done++
            if (p.github) done++; if (p.liveDemo) done++
        })
        resumeData.certifications.forEach(c => { total += 3; if (c.title) done++; if (c.issuer) done++; if (c.year) done++ })
        resumeData.languages.forEach(l => { total += 2; if (l.name) done++; if (l.progress > 0) done++ })
        total += resumeData.interests.length
        done += resumeData.interests.filter(i => i.trim() !== '').length
        const pct = Math.round((done / total) * 100)
        setCompletionPercentage(pct)
        return pct
    }, [resumeData])

    useEffect(() => { calculateCompletion() }, [resumeData])

    useEffect(() => {
        if (!resumeId || !hasUnsavedChanges) return
        clearTimeout(autoSaveTimerRef.current)
        setSaveStatus('saving')
        autoSaveTimerRef.current = setTimeout(async () => {
            try {
                await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
                    ...resumeData,
                    completion: completionPercentage,
                })
                setSaveStatus('saved')
                setHasUnsavedChanges(false)
                setTimeout(() => setSaveStatus('idle'), 2000)
            } catch {
                setSaveStatus('error')
            }
        }, 2500)
        return () => clearTimeout(autoSaveTimerRef.current)
    }, [resumeData, hasUnsavedChanges])

    const updateSection = (section, key, value) => {
        setHasUnsavedChanges(true)
        setResumeData(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }))
    }
    const updateArrayItem = (section, index, key, value) => {
        setHasUnsavedChanges(true)
        setResumeData(prev => {
            const arr = [...prev[section]]
            arr[index] = key === null ? value : { ...arr[index], [key]: value }
            return { ...prev, [section]: arr }
        })
    }
    const addArrayItem = (section, newItem) => {
        setHasUnsavedChanges(true)
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], newItem] }))
    }
    const removeArrayItem = (section, index) => {
        setHasUnsavedChanges(true)
        setResumeData(prev => {
            const arr = [...prev[section]]
            arr.splice(index, 1)
            return { ...prev, [section]: arr }
        })
    }

    const fetchResumeDetailsById = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId))
            if (response.data && response.data.profileInfo) {
                const d = response.data
                setResumeData(prev => ({
                    ...prev,
                    title: d.title || 'Untitled',
                    template: d.template || prev.template,
                    profileInfo: d.profileInfo || prev.profileInfo,
                    contactInfo: d.contactInfo || prev.contactInfo,
                    workExperience: d.workExperience || prev.workExperience,
                    education: d.education || prev.education,
                    skills: d.skills || prev.skills,
                    projects: d.projects || prev.projects,
                    certifications: d.certifications || prev.certifications,
                    languages: d.languages || prev.languages,
                    interests: d.interests || prev.interests,
                }))
            }
        } catch {
            toast.error('Failed to load resume data')
        }
    }

    useEffect(() => { if (resumeId) fetchResumeDetailsById() }, [resumeId])

    const pages = [
        'profile-info', 'contact-info', 'work-experience',
        'education-info', 'skills', 'projects', 'certifications', 'additionalInfo'
    ]

    const validateAndNext = () => {
        const errors = []
        switch (currentPage) {
            case 'profile-info':
                if (!resumeData.profileInfo.fullName?.trim()) errors.push('Full Name is required')
                if (!resumeData.profileInfo.designation?.trim()) errors.push('Designation is required')
                if (!resumeData.profileInfo.summary?.trim()) errors.push('Summary is required')
                break
            case 'contact-info':
                if (!resumeData.contactInfo.email?.trim()) errors.push('Email is required')
                if (!resumeData.contactInfo.phone?.trim()) errors.push('Phone is required')
                break
        }
        if (errors.length) { setErrorMsg(errors.join(', ')); return }
        setErrorMsg('')
        if (currentPage === 'additionalInfo') { setOpenPreviewModal(true); return }
        const idx = pages.indexOf(currentPage)
        if (idx < pages.length - 1) {
            setCurrentPage(pages[idx + 1])
            setProgress(Math.round(((idx + 1) / (pages.length - 1)) * 100))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const goBack = () => {
        const idx = pages.indexOf(currentPage)
        if (idx === 0) { navigate('/dashboard'); return }
        setCurrentPage(pages[idx - 1])
        setProgress(Math.round(((idx - 1) / (pages.length - 1)) * 100))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const uploadResumeImages = async () => {
        try {
            setIsLoading(true)
            const thumbnailElement = thumbnailRef.current
            if (!thumbnailElement) throw new Error('Thumbnail element not found')
            const fixedThumbnail = fixTailwindColors(thumbnailElement)
            const canvas = await html2canvas(fixedThumbnail, {
                scale: 0.3, backgroundColor: '#FFFFFF', logging: false, useCORS: true
            })
            document.body.removeChild(fixedThumbnail)
            const dataUrl = canvas.toDataURL('image/png')
            const file = dataURLtoFile(dataUrl, `thumbnail-${resumeId}.png`)
            const formData = new FormData()
            formData.append('thumbnail', file)
            const uploadRes = await axiosInstance.post(
                API_PATHS.RESUME.UPLOAD_IMAGES(resumeId), formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            )
            await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), {
                ...resumeData,
                thumbnailLink: uploadRes.data.thumbnailLink || '',
                completion: completionPercentage,
            })
            toast.success('Resume saved successfully')
            navigate('/dashboard')
        } catch (error) {
            toast.error(error.message || 'Failed to save resume')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteResume = async () => {
        try {
            setIsLoading(true)
            await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId))
            toast.success('Resume deleted')
            navigate('/dashboard')
        } catch {
            toast.error('Failed to delete resume')
        } finally {
            setIsLoading(false)
        }
    }

    const downloadPDF = async () => {
        const element = resumeDownloadRef.current
        if (!element) { toast.error('Failed to generate PDF'); return }
        setIsDownloading(true)
        setDownloadSuccess(false)
        const toastId = toast.loading('Generating PDF…')
        const override = document.createElement('style')
        override.id = '__pdf_override__'
        override.textContent = '* { color: #000 !important; background-color: #fff !important; border-color: #000 !important; }'
        document.head.appendChild(override)
        try {
            await html2pdf().set({
                margin: 0,
                filename: `${resumeData.title.replace(/[^a-z0-9]/gi, '_')}.pdf`,
                image: { type: 'png', quality: 1.0 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: '#FFFFFF', logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            }).from(element).save()
            toast.success('PDF downloaded!', { id: toastId })
            setDownloadSuccess(true)
            setTimeout(() => setDownloadSuccess(false), 3000)
        } catch (err) {
            toast.error(`Failed: ${err.message}`, { id: toastId })
        } finally {
            document.getElementById('__pdf_override__')?.remove()
            setIsDownloading(false)
        }
    }

    const updateTheme = (theme) => {
        setHasUnsavedChanges(true)
        setResumeData(prev => ({ ...prev, template: { theme, colorPalette: [] } }))
    }

    const renderForm = () => {
        switch (currentPage) {
            case 'profile-info':
                return <ProfileInfoForm profileData={resumeData.profileInfo} updateSection={(k, v) => updateSection('profileInfo', k, v)} />
            case 'contact-info':
                return <ContactInfoForm contactInfo={resumeData.contactInfo} updateSection={(k, v) => updateSection('contactInfo', k, v)} />
            case 'work-experience':
                return <WorkExperienceForm
                    workExperience={resumeData.workExperience}
                    updateArrayItem={(i, k, v) => updateArrayItem('workExperience', i, k, v)}
                    addArrayItem={(item) => addArrayItem('workExperience', item)}
                    removeArrayItem={(i) => removeArrayItem('workExperience', i)}
                />
            case 'education-info':
                return <EducationDetailsForm
                    educationInfo={resumeData.education}
                    updateArrayItem={(i, k, v) => updateArrayItem('education', i, k, v)}
                    addArrayItem={(item) => addArrayItem('education', item)}
                    removeArrayItem={(i) => removeArrayItem('education', i)}
                />
            case 'skills':
                return <SkillsInfoForm
                    skillsInfo={resumeData.skills}
                    updateArrayItem={(i, k, v) => updateArrayItem('skills', i, k, v)}
                    addArrayItem={(item) => addArrayItem('skills', item)}
                    removeArrayItem={(i) => removeArrayItem('skills', i)}
                />
            case 'projects':
                return <ProjectDetailForm
                    projectInfo={resumeData.projects}
                    updateArrayItem={(i, k, v) => updateArrayItem('projects', i, k, v)}
                    addArrayItem={(item) => addArrayItem('projects', item)}
                    removeArrayItem={(i) => removeArrayItem('projects', i)}
                />
            case 'certifications':
                return <CertificationInfoForm
                    certifications={resumeData.certifications}
                    updateArrayItem={(i, k, v) => updateArrayItem('certifications', i, k, v)}
                    addArrayItem={(item) => addArrayItem('certifications', item)}
                    removeArrayItem={(i) => removeArrayItem('certifications', i)}
                />
            case 'additionalInfo':
                return <AdditionalInfoForm
                    languages={resumeData.languages}
                    interests={resumeData.interests}
                    updateArrayItem={(sec, i, k, v) => updateArrayItem(sec, i, k, v)}
                    addArrayItem={(sec, item) => addArrayItem(sec, item)}
                    removeArrayItem={(sec, i) => removeArrayItem(sec, i)}
                />
            default: return null
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-white to-violet-50 border border-violet-100 rounded-2xl py-4 px-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <TitleInput
                            title={resumeData.title}
                            setTitle={(v) => {
                                setHasUnsavedChanges(true)
                                setResumeData(prev => ({ ...prev, title: v }))
                            }}
                        />
                        <SaveIndicator status={saveStatus} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button onClick={() => setOpenATSModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 font-bold rounded-xl hover:bg-amber-200 transition-all">
                            <BarChart2 size={16} /><span className="text-sm">ATS Score</span>
                        </button>
                        <button onClick={() => setOpenThemeSelector(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 font-bold rounded-xl hover:bg-violet-200 transition-all">
                            <Palette size={16} /><span className="text-sm">Theme</span>
                        </button>
                        <button onClick={handleDeleteResume} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 transition-all">
                            <Trash2 size={16} /><span className="text-sm">Delete</span>
                        </button>
                        <button onClick={() => setOpenPreviewModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-xl hover:bg-emerald-200 transition-all">
                            <Download size={16} /><span className="text-sm">Download</span>
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* Form Side */}
                    <div className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-sm">
                        <StepProgress progress={progress} />
                        {renderForm()}
                        <div className="p-4 sm:p-6">
                            {errorMsg && (
                                <div className="flex items-center gap-3 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl mb-4">
                                    <AlertCircle size={16} />{errorMsg}
                                </div>
                            )}
                            <div className="flex flex-wrap items-center justify-end gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm" onClick={goBack} disabled={isLoading}>
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200 transition-all text-sm" onClick={uploadResumeImages} disabled={isLoading}>
                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isLoading ? 'Saving...' : 'Save & Exit'}
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg text-sm" onClick={validateAndNext} disabled={isLoading}>
                                    {currentPage === 'additionalInfo' ? 'Preview & Download' : 'Next'}
                                    {currentPage !== 'additionalInfo' && <ArrowLeft size={16} className="rotate-180" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Side */}
                    <div className="hidden lg:block">
                        <div className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-sm p-4">
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Live Preview — {completionPercentage}% Complete
                                </div>
                            </div>
                            <div ref={previewContainerRef} className="w-full">
                                <RenderResume
                                    key={`preview-${resumeData?.template?.theme}`}
                                    templateId={resumeData?.template?.theme || ''}
                                    resumeData={resumeData}
                                    containerWidth={previewWidth}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Theme Modal */}
            <Modal isOpen={openThemeSelector} onClose={() => setOpenThemeSelector(false)} title="Change Theme">
                <div className="w-[90vw] h-[80vh]">
                    <ThemeSelector
                        selectedTheme={resumeData?.template?.theme}
                        setSelectedTheme={updateTheme}
                        resumeData={resumeData}
                        onClose={() => setOpenThemeSelector(false)}
                    />
                </div>
            </Modal>

            {/* Preview/Download Modal */}
            <Modal isOpen={openPreviewModal} onClose={() => setOpenPreviewModal(false)}
                title={resumeData.title} showActionBtn
                actionBtnText={isDownloading ? 'Generating...' : downloadSuccess ? 'Downloaded ✓' : 'Download PDF'}
                actionBtnIcon={isDownloading ? <Loader2 size={16} className="animate-spin" /> : downloadSuccess ? <Check size={16} /> : <Download size={16} />}
                onActionClick={downloadPDF}
            >
                <div className="relative">
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-violet-100 px-3 py-1 rounded-full text-sm font-medium text-violet-700">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Completion: {completionPercentage}%
                        </div>
                    </div>
                    <div className="w-full p-4 flex justify-center">
                        <div ref={resumeDownloadRef} className="a4-wrapper">
                            <RenderResume
                                key={`pdf-${resumeData?.template?.theme}`}
                                templateId={resumeData?.template?.theme || ''}
                                resumeData={resumeData}
                                containerWidth={null}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* ATS Modal */}
            <Modal isOpen={openATSModal} onClose={() => setOpenATSModal(false)} title="ATS Score Checker">
                <ATSPanel resumeData={resumeData} onClose={() => setOpenATSModal(false)} />
            </Modal>

            {/* Hidden thumbnail */}
            <div style={{ display: 'none' }} ref={thumbnailRef}>
                <div className="bg-white max-w-[400px] mx-auto">
                    <RenderResume
                        key={`thumb-${resumeData?.template?.theme}`}
                        templateId={resumeData?.template?.theme || ''}
                        resumeData={resumeData}
                    />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default EditResume