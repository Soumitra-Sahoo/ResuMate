import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import UserProvider from './context/UserContext.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditResume from './components/EditResume.jsx'
import PublicResume from './pages/PublicResume.jsx'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/resume/:resumeId' element={<EditResume />} />
        <Route path='/resume/view/:token' element={<PublicResume />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: '13px', borderRadius: '12px', padding: '12px 16px' },
          success: { iconTheme: { primary: '#8b5cf6', secondary: '#fff' } },
        }}
      />
    </UserProvider>
  )
}

export default App