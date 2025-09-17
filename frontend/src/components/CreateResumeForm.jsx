import React, { useState } from 'react'
import { Input } from './Input'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'

const CreateResumeForm = () => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleCreateResume = async (e) => {
    e.preventDefault()
    if (!title) {
      setError('Please enter a title')
      return
    }
    setError('')
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
      })
      if (response.data?._id) {
        navigate(`/resume/${response.data._id}`)
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Resume</h3>
      <p className="text-gray-600 mb-2">
        Give your resume a title to get started. You can always edit it later.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          label="Resume Title"
          placeholder="Enter Resume Title"
          type="text"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Create Resume
        </button>
      </form>
    </div>
  )
}

export default CreateResumeForm
