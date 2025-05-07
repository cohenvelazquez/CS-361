// src/components/Confirmation.jsx
import React from 'react'

export default function Confirmation({ metadata, onUploadAnother, onViewFiles }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Upload Complete!</h2>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Name:</strong> {metadata.name}</li>
        <li><strong>Size:</strong> {Math.round(metadata.size / 1024)} KB</li>
        <li><strong>Type:</strong> {metadata.type}</li>
        <li><strong>Path:</strong> {metadata.path}</li>
      </ul>
      <div className="flex justify-between">
        <button
          onClick={onUploadAnother}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Upload Another
        </button>
        <button
          onClick={onViewFiles}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Files
        </button>
      </div>
    </div>
  )
}
