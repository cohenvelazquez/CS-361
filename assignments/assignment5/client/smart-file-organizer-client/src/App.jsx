import React, { useState } from 'react'
import UploadForm   from './components/UploadForm'
import Confirmation from './components/Confirmation'
import Help         from './components/Help'
import FileBrowser  from './components/FileBrowser'

export default function App() {
  const [metadata, setMetadata] = useState(null)
  const [view, setView]         = useState('upload')

  const handleSuccess = data => {
    setMetadata(data)
    setView('confirm')
  }

  const handleUploadAnother = () => {
    setMetadata(null)
    setView('upload')
  }

  const handleViewFiles = () => {
    setMetadata(null)
    setView('files')
  }

  // called by UploadForm after 2 failed attempts
  const handleHelpRequest = () => {
    setView('help')
  }

  // Pick which “page” to render in the <main> area
  const renderMain = () => {
    switch (view) {
      case 'upload':
        return (
          <UploadForm
            onSuccess={handleSuccess}
            onHelpRequest={handleHelpRequest}  // ← passes the help callback in
          />
        )
      case 'confirm':
        return (
          <Confirmation
            metadata={metadata}
            onUploadAnother={handleUploadAnother}
            onViewFiles={handleViewFiles}
          />
        )
      case 'files':
        return <FileBrowser />
      case 'help':
        return <Help />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* HEADER / NAV — always visible */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">Smart File Organizer</h1>
            <p className="text-gray-800 mt-1 italic">Clean Folders. Clear Mind.</p>
          </div>
          <nav className="space-x-4">
            <button
              onClick={() => setView('upload')}
              className={`px-4 py-2 rounded-lg ${
                view === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setView('files')}
              className={`px-4 py-2 rounded-lg ${
                view === 'files'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setView('help')}
              className={`px-4 py-2 rounded-lg ${
                view === 'help'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Help
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-5xl mx-auto px-8 py-10">
        {renderMain()}
      </main>
    </div>
  )
}