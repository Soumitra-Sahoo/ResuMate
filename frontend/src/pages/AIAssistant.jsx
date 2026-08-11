import React, { useState, useEffect, useRef, useCallback } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import toast from 'react-hot-toast'
import { Rocket, Send, Loader2, FileText, X, Sparkles } from 'lucide-react'

const SUGGESTIONS = [
    "How can I make my professional summary punchier?",
    "What skills should I highlight for a software engineering role?",
    "Rewrite this bullet point: \"Worked on the backend team\"",
    "What's missing from a strong resume in tech?",
]

const AIAssistant = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)

    const [myResumes, setMyResumes] = useState([])
    const [loadingResumes, setLoadingResumes] = useState(true)
    const [selectedResumeId, setSelectedResumeId] = useState('')

    const scrollRef = useRef(null)
    const textareaRef = useRef(null)

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await axiosInstance.get(API_PATHS.RESUME.GET_ALL)
                setMyResumes(res.data)
            } catch {
                // Non-fatal — chat still works without resume context
            } finally {
                setLoadingResumes(false)
            }
        }
        fetchResumes()
    }, [])

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, [messages, sending])

    const selectedResume = myResumes.find((r) => r._id === selectedResumeId) || null

    const sendMessage = useCallback(async (text) => {
        const trimmed = text.trim()
        if (!trimmed || sending) return

        const userMsg = { role: 'user', text: trimmed }
        const nextMessages = [...messages, userMsg]
        setMessages(nextMessages)
        setInput('')
        setSending(true)

        try {
            const res = await axiosInstance.post(API_PATHS.AI.CHAT, {
                messages: nextMessages,
                resumeContext: selectedResume || undefined,
            })
            setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }])
        } catch (err) {
            toast.error(err.response?.data?.message || 'AI request failed. Try again.')
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', text: "Sorry, I couldn't process that — please try again.", isError: true },
            ])
        } finally {
            setSending(false)
        }
    }, [messages, sending, selectedResume])

    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage(input)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(input)
        }
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-4rem)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md">
                            <Rocket size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                                AI Assistant
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">Beta</span>
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">This chat resets when you leave the page.</p>
                        </div>
                    </div>

                    {/* Resume context picker */}
                    <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-400" />
                        <select
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            disabled={loadingResumes}
                            className="text-xs font-bold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 outline-none text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        >
                            <option value="">General chat (no resume context)</option>
                            {myResumes.map((r) => (
                                <option key={r._id} value={r._id}>{r.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedResume && (
                    <div className="flex items-center gap-2 mb-4 text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 px-3 py-2 rounded-xl w-fit">
                        <Sparkles size={12} />
                        Chatting with context from "{selectedResume.title}"
                        <button type="button" onClick={() => setSelectedResumeId('')} className="hover:text-violet-900 dark:hover:text-white">
                            <X size={12} />
                        </button>
                    </div>
                )}

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6 mb-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-8">
                            <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mb-4">
                                <Rocket size={24} className="text-violet-600 dark:text-violet-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm">
                                Ask me anything about writing, improving, or tailoring your resume.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => sendMessage(s)}
                                        className="text-left text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2.5 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                                            m.role === 'user'
                                                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-br-sm'
                                                : m.isError
                                                    ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-bl-sm'
                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-bl-sm'
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {sending && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your resume... (Shift+Enter for a new line)"
                        rows={1}
                        className="flex-1 resize-none text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-all text-gray-700 dark:text-gray-200 placeholder-gray-400 max-h-32"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="w-12 h-12 shrink-0 flex items-center justify-center bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100"
                    >
                        {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default AIAssistant