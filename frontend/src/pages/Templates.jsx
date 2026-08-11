import React, { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { resumeTemplates, DUMMY_RESUME_DATA } from '../utils/data'
import { TemplateCard } from '../components/Cards'
import RenderResume from '../components/RenderResume'
import { Input } from '../components/Input'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Check, FileText, Loader2, Sparkles } from 'lucide-react'

const Templates = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(resumeTemplates[0]?.id || '01')
  const [mode, setMode] = useState('new')
  const previewRef = useRef(null)
  const [previewWidth, setPreviewWidth] = useState(600)
  useEffect(() => {
    const updateWidth = () => {
      if (previewRef.current) setPreviewWidth(previewRef.current.offsetWidth)
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const [title, setTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const [myResumes, setMyResumes] = useState([])
  const [loadingResumes, setLoadingResumes] = useState(false)
  const [targetResumeId, setTargetResumeId] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (mode !== 'existing') return
    const fetchResumes = async () => {
      try {
        setLoadingResumes(true)
        const res = await axiosInstance.get(API_PATHS.RESUME.GET_ALL)
        setMyResumes(res.data)
        if (res.data[0]) setTargetResumeId(res.data[0]._id)
      } catch {
        toast.error('Failed to load your resumes')
      } finally {
        setLoadingResumes(false)
      }
    }
    fetchResumes()
  }, [mode])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }
    setCreating(true)
    try {
      const res = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
        template: { theme: selected },
      })
      toast.success('Resume created!')
      navigate(`/resume/${res.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create resume')
    } finally {
      setCreating(false)
    }
  }

  const handleApply = async () => {
    if (!targetResumeId) {
      toast.error('Select a resume first')
      return
    }
    setApplying(true)
    try {
      await axiosInstance.put(API_PATHS.RESUME.UPDATE(targetResumeId), {
        template: { theme: selected },
      })
      toast.success('Template applied!')
      navigate(`/resume/${targetResumeId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply template')
    } finally {
      setApplying(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Templates</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Pick a template, then start a new resume or apply it to one you already have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Template gallery */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-auto p-1 custom-scrollbar">
              {resumeTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  thumbnailImg={template.thumbnailImg}
                  isSelected={selected === template.id}
                  onSelect={() => setSelected(template.id)}
                />
              ))}
            </div>
          </div>

          {/* Preview + actions */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-gray-900 dark:text-white">Live Preview</h2>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-2.5 py-1 rounded-full">
                  Template {selected}
                </span>
              </div>
              <div
                ref={previewRef}
                className="max-h-[50vh] overflow-auto rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <RenderResume templateId={selected} resumeData={DUMMY_RESUME_DATA} containerWidth={previewWidth} />
              </div>
            </div>

            {/* New vs Existing */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6">
              <div className="flex bg-gray-50 dark:bg-gray-950 p-1 rounded-xl mb-5 w-fit">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    mode === 'new' ? 'bg-white dark:bg-gray-800 text-violet-700 dark:text-violet-300 shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => setMode('new')}
                >
                  Start New Resume
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    mode === 'existing' ? 'bg-white dark:bg-gray-800 text-violet-700 dark:text-violet-300 shadow-sm' : 'text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => setMode('existing')}
                >
                  Apply to Existing Resume
                </button>
              </div>

              {mode === 'new' ? (
                <form onSubmit={handleCreate} className="space-y-2">
                  <Input
                    label="Resume Title"
                    placeholder="e.g. Product Manager Resume"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                  />
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl hover:scale-[1.01] transition-all disabled:opacity-60"
                  >
                    {creating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {creating ? 'Creating...' : 'Create Resume with this Template'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {loadingResumes ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : myResumes.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You don't have any resumes yet — switch to "Start New Resume" instead.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-auto custom-scrollbar">
                      {myResumes.map((r) => (
                        <button
                          type="button"
                          key={r._id}
                          onClick={() => setTargetResumeId(r._id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                            targetResumeId === r._id
                              ? 'border-violet-400 bg-violet-50 dark:bg-violet-500/10'
                              : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
                            <FileText size={16} className="text-violet-600 dark:text-violet-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{r.title}</p>
                            <p className="text-xs text-gray-400">Current template: {r.template?.theme || '01'}</p>
                          </div>
                          {targetResumeId === r._id && <Check size={16} className="text-violet-600 dark:text-violet-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={applying || myResumes.length === 0}
                    onClick={handleApply}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl hover:scale-[1.01] transition-all disabled:opacity-60"
                  >
                    {applying ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {applying ? 'Applying...' : 'Apply Template'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Templates