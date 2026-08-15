import React from 'react'
import { X } from 'lucide-react'

const Modal = ({
    children, isOpen, onClose, title, hideHeader,
    showActionBtn, actionBtnIcon = null, actionBtnText, onActionClick = () => { },
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="relative flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-violet-100 dark:border-violet-500/20 w-full min-w-[320px] sm:min-w-[420px] max-w-[95vw] max-h-[95vh]">
                {!hideHeader && (
                    <div className="flex items-center justify-between gap-3 p-5 sm:p-6 pr-16 border-b border-violet-100 dark:border-gray-800 bg-gradient-to-r from-white to-violet-50 dark:from-gray-900 dark:to-violet-950/30">
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate min-w-0">
                            {title}
                        </h3>
                        {showActionBtn && (
                            <button
                                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-lg shrink-0"
                                onClick={onActionClick}
                            >
                                {actionBtnIcon} {actionBtnText}
                            </button>
                        )}
                    </div>
                )}
                <button
                    type="button"
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 dark:text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-lg hover:scale-110 z-20"
                    onClick={onClose}
                >
                    <X size={18} />
                </button>
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    )
}

export default Modal