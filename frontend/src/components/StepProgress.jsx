import React from 'react'
import { Check } from 'lucide-react'

const StepProgress = ({ progress }) => {
    return (
        <>
            <div className="relative w-full h-4 bg-white/5 backdrop-blur-2xl overflow-hidden rounded-full border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 animate-pulse" />
                <div
                    className="relative h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-600 transition-all duration-700 ease-out rounded-full overflow-hidden animate-flow bg-[length:200%_100%]"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                    <div className="absolute inset-0 opacity-80">
                        {[...Array(8)].map((_, i) => (
                            <div key={i}
                                className="absolute top-1/2 w-2 h-2 bg-white rounded-full animate-bubble shadow-lg"
                                style={{ left: `${(i + 1) * 12}%`, animationDelay: `${i * 0.25}s`, transform: 'translateY(-50%)' }}
                            />
                        ))}
                    </div>
                </div>
                {progress > 0 && (
                    <div className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/60 to-white/30 blur-sm"
                        style={{ left: `${Math.max(0, progress - 4)}%` }} />
                )}
            </div>
            <div className="flex justify-between items-center mt-3">
                <div className="text-xs font-bold text-white/60">
                    {progress < 25 ? 'Getting Started' : progress < 50 ? 'Making Progress' : progress < 75 ? 'Almost There' : 'Ready to Go!'}
                </div>
                {progress >= 100 && (
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Check size={10} className="text-white" />
                    </div>
                )}
            </div>
        </>
    )
}

export default StepProgress