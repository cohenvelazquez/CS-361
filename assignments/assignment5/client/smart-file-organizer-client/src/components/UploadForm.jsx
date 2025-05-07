import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { UploadCloud } from 'lucide-react'

export default function UploadForm({ onSuccess }) {
  const [file, setFile]       = useState(null)
  const [error, setError]     = useState('')
  const [hover, setHover]     = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrop = useCallback(e => {
    e.preventDefault()
    setHover(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }, [])

  const handleDragOver  = useCallback(e => e.preventDefault(), [])
  const handleDragEnter = () => setHover(true)
  const handleDragLeave = () => setHover(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!file) {
      setError('Please select or drop a file.')
      return
    }
    setError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onSuccess(data.metadata)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-10 text-center ${
          hover ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'
        }`}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
        <h2 className="mt-4 text-lg font-medium text-gray-800">
          {file ? file.name : 'Choose a file or drag & drop it here'}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
        PNG, JPG, TXT, MP3 & PDF, up to 5MB
        </p>

        <input
          type="file"
          id="file-input"
          className="hidden"
          onChange={e => setFile(e.target.files[0])}
        />
        <label
          htmlFor="file-input"
          className="mt-6 inline-block px-6 py-2 border rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          Browse File
        </label>
      </div>

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={uploading}
        className={`w-full py-2 rounded-lg text-lg font-medium transition ${
          uploading
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
    </form>
  )
}