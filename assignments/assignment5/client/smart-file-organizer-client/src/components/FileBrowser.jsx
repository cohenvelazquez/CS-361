import React, { useState, useEffect } from 'react'
import {
  Folder,
  FileText,
  ImageIcon,
  Music,
  Video,
  Search
} from 'lucide-react'

export default function FileBrowser() {
  const [files,   setFiles]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')

  // Base URL of your API; make sure you have VITE_API_URL in your .env
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  useEffect(() => {
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
  }, [])

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
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto space-y-6">
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
      </div>

      {Object.entries(tree).map(([folder, items]) => (
        <div key={folder} className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700 font-medium">
            <Folder className="h-5 w-5 text-yellow-500" />
            <span>{folder}</span>
          </div>
          <div className="pl-6 space-y-2">
          {items
          .filter(f => f.name.toLowerCase().includes(search))
          .map(f => {
            const t = f.type.split('/')[0]
            let Icon = FileText
            if (t === 'image') Icon = ImageIcon
            if (t === 'audio') Icon = Music
            if (t === 'video') Icon = Video

            return (
              <div
                key={f._id}
                className="flex items-center py-3 hover:bg-gray-50 rounded-lg px-3"
              >
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
                <div className="flex-shrink-0 text-sm text-gray-400">
                  {Math.round(f.size / 1024)} KB
                </div>
              </div>
            )
          })}
          </div>
        </div>
      ))}
    </div>
  )
}
