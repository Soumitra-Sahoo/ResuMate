import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// value/onChange use "YYYY-MM" format — same as your backend storage
const MonthYearPicker = ({ value, onChange, label, error }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [viewYear, setViewYear] = useState(
        value ? parseInt(value.split('-')[0]) : new Date().getFullYear()
    )
    const ref = useRef(null)

    const selectedYear = value ? parseInt(value.split('-')[0]) : null
    const selectedMonth = value ? parseInt(value.split('-')[1]) - 1 : null

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const displayValue = value
        ? `${MONTHS[selectedMonth]} ${selectedYear}`
        : ''

    const handleSelectMonth = (monthIndex) => {
        const monthStr = String(monthIndex + 1).padStart(2, '0')
        onChange(`${viewYear}-${monthStr}`)
        setIsOpen(false)
    }

    return (
        <div className="relative mb-6" ref={ref}>
            {label && (
                <label className={`block text-sm font-bold mb-3 ${error ? 'text-red-600' : 'text-gray-800'}`}>
                    {label}
                </label>
            )}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center justify-between bg-gray-50 border-2 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                    ${error ? 'border-red-400 ring-4 ring-red-500/10'
                        : isOpen ? 'border-violet-500 ring-4 ring-violet-500/20'
                        : 'border-gray-300 hover:border-gray-400'}`}
            >
                <span className={displayValue ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                    {displayValue || 'Select month & year'}
                </span>
                <Calendar size={18} className="text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
                    {/* Year navigator */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={() => setViewYear(y => y - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="font-bold text-gray-800">{viewYear}</span>
                        <button
                            type="button"
                            onClick={() => setViewYear(y => y + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Month grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {MONTHS.map((month, idx) => {
                            const isSelected = selectedYear === viewYear && selectedMonth === idx
                            return (
                                <button
                                    key={month}
                                    type="button"
                                    onClick={() => handleSelectMonth(idx)}
                                    className={`py-2 rounded-xl text-sm font-medium transition-all
                                        ${isSelected
                                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-violet-50 hover:text-violet-600'}`}
                                >
                                    {month}
                                </button>
                            )
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            const now = new Date()
                            onChange(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
                            setIsOpen(false)
                        }}
                        className="w-full mt-3 py-2 text-xs font-bold text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                    >
                        Set to Present
                    </button>
                </div>
            )}
            {error && <p className="text-xs text-red-500 font-medium mt-1.5">{error}</p>}
        </div>
    )
}

export default MonthYearPicker