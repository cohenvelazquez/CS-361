import React from 'react'

export default function Help() {
  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Help Information</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Supported types: PNG, JPG, TXT, MP3, PDF</li>
        <li>Max size: 5 MB</li>
        <li>Select a file and click “Upload”</li>
        <li>You’ll see a confirmation with file details.</li>
      </ul>
    </div>
  )
}