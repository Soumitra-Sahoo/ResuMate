import React from 'react'

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className='w-full my-2'>
      <div className='flex flex-wrap bg-violet-50 dark:bg-gray-800 p-1 rounded-2xl border border-violet-100 dark:border-gray-700'>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`relative flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm
              font-bold rounded-xl transition-all
              ${activeTab === tab.label
                ? 'bg-white dark:bg-gray-900 text-violet-700 dark:text-violet-300 shadow-lg'
                : 'text-slate-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-white/50 dark:hover:bg-gray-900/50'
              }`}
            onClick={() => setActiveTab(tab.label)}
          >
            <span className='relative z-10'>{tab.label}</span>
            {activeTab === tab.label && (
              <div className='absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-xl' />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Tabs