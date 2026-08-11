import React from 'react'
import { X } from 'lucide-react'

const Modal = ({
    children, isOpen, onClose, title, hideHeader,
    showActionBtn, actionBtnIcon = null, actionBtnText, onActionClick = () => { },
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm z-50">
            <div className="relative flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-violet-100 dark:border-violet-500/20 max-w-[95vw] max-h-[95vh]">
                {!hideHeader && (
                    <div className="flex items-center justify-between p-6 border-b border-violet-100 dark:border-gray-800 bg-gradient-to-r from-white to-violet-50 dark:from-gray-900 dark:to-violet-950/30">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">{title}</h3>
                        {showActionBtn && (
                            <button
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg mr-12"
                                onClick={onActionClick}
                            >
                                {actionBtnIcon} {actionBtnText}
                            </button>
                        )}
                    </div>
                )}
                <button
                    type="button"
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 dark:text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-lg hover:scale-110 z-10"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    )
}

export default Modal