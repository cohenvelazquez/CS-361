import React, { useState, useEffect } from 'react'
import {
  Folder,
  FileText,
  ImageIcon,
  Music,
  Video,
  Search,
  Eye,
  Trash2,
  Play
} from 'lucide-react'
import AudioPlayer from './AudioPlayer'
import FilePreview from './FilePreview'

export default function FileBrowser() {
  const [files,   setFiles]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')
  const [previewFile, setPreviewFile] = useState(null)
  const [playingAudio, setPlayingAudio] = useState(null)

  // Base URL of your API; make sure you have VITE_API_URL in your .env
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const fetchFiles = () => {
    fetch('/api/files')
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then(data => setFiles(data))
      .catch(err => {
        console.error(err)
        setError('Could not load files. Check your server or proxy.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleDelete = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/files/${file._id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      // Remove file from local state
      setFiles(files.filter(f => f._id !== file._id))
      
      // Close audio player if this file was playing
      if (playingAudio === file._id) {
        setPlayingAudio(null)
      }
    } catch (err) {
      alert('Failed to delete file: ' + err.message)
    }
  }
  const handlePreview = (file) => {
    const previewableTypes = ['image/', 'application/pdf', 'text/']
    const isPreviewable = previewableTypes.some(type => file.type.startsWith(type)) || file.type === 'text/plain'
    
    if (isPreviewable) {
      setPreviewFile(file)
    } else {
      alert('Preview not available for this file type')
    }
  }

  const toggleAudioPlayer = (fileId) => {
    if (playingAudio === fileId) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(fileId)
    }
  }

  if (loading) {
    return <p className="text-center py-10">Loading files…</p>
  }
  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>
  }

  // Group by the first path segment
  const tree = files.reduce((acc, f) => {
    const [folder] = f.path.split('/')
    if (!acc[folder]) acc[folder] = []
    acc[folder].push(f)
    return acc
  }, {})

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Files</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search…"
            className="pl-10 pr-10 py-1 border rounded-lg"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>      {Object.entries(tree).map(([folder, items]) => (
        <div key={folder} className="space-y-6">
          <div className="flex items-center gap-3 text-gray-700 font-medium">
            <Folder className="h-5 w-5 text-yellow-500" />
            <span>{folder}</span>
          </div>
          <div className="pl-6 space-y-6">
          {items
          .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
          .map(f => {            const t = f.type.split('/')[0]
            let Icon = FileText
            if (t === 'image') Icon = ImageIcon
            if (t === 'audio') Icon = Music
            if (t === 'video') Icon = Video

            const isAudio = f.type.startsWith('audio/')
            const isPreviewable = f.type.startsWith('image/') || f.type === 'application/pdf' || f.type.startsWith('text/') || f.type === 'text/plain'

            return (              <div key={f._id} className="space-y-3">
                <div className="flex items-center py-4 hover:bg-gray-50 rounded-lg px-3">
                  <div className="flex-1 flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <a
                      href={`${API}/uploads/${f.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-lg text-blue-600 hover:underline"
                    >
                      {f.name}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-400">
                      {Math.round(f.size / 1024)} KB
                    </div>
                    
                    {/* Preview button for images and PDFs */}
                    {isPreviewable && (
                      <button
                        onClick={() => handlePreview(f)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    
                    {/* Play button for audio files */}
                    {isAudio && (
                      <button
                        onClick={() => toggleAudioPlayer(f._id)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Play audio"
                      >
                        <Play size={16} />
                      </button>
                    )}
                    
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(f)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete file"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Audio player */}
                {isAudio && playingAudio === f._id && (
                  <div className="pl-8 pr-3">
                    <AudioPlayer fileId={f._id} fileName={f.name} />
                  </div>
                )}
              </div>
            )
          })}
          </div>
        </div>
      ))}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  )
}
