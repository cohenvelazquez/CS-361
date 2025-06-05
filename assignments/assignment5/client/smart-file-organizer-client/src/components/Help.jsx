import React from 'react'
import { Upload, CheckCircle, FileText, Mail } from 'lucide-react'

export default function Help() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Help & Instructions</h2>
      
      {/* File Upload Instructions */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-700">How to Upload a File</h3>        <div className="grid gap-4">
          <div className="flex items-start space-x-4 p-4 border rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 border-2 border-gray-400 text-gray-700 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Click "Upload File" on the Upload page</h4>
              <p className="text-gray-600">Navigate to the Upload page and click the "Upload File" button or the file upload area.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 border rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 border-2 border-gray-400 text-gray-700 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Use the file picker to choose any file on your device</h4>
              <p className="text-gray-600">Browse your computer and select the file you want to upload. You can also drag and drop files directly into the upload area.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 border rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 border-2 border-gray-400 text-gray-700 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Click "Upload" to upload</h4>
              <p className="text-gray-600">Once you've selected your file, click the "Upload" button to start the upload process.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 border rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 border-2 border-gray-400 text-gray-700 rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">You'll receive a confirmation with file details</h4>
              <p className="text-gray-600">After successful upload, you'll see a confirmation page with file details like name, type, and size.</p>
            </div>
          </div>
        </div>
      </div>

      {/* General Information */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-700">Supported File Types & Requirements</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Supported File Types
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Images: PNG and JPG</li>
              <li>Documents: PDF and TXT</li>
              <li>Audio: MP3 and WAV</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-green-600" />
              File Requirements
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Maximum file size: 5 MB</li>
              <li>Files are automatically organized by type</li>
              <li>Duplicate filenames are handled automatically</li>
              <li>All uploads are confirmed with file details</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-700">Available Features</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">File Preview</h4>
            <p className="text-gray-600 text-sm">Preview images, PDFs, and text files without downloading them.</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Audio Streaming</h4>
            <p className="text-gray-600 text-sm">Play audio files directly in the browser with playback controls.</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">File Management</h4>
            <p className="text-gray-600 text-sm">Delete unwanted files and browse your organized file collection.</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t pt-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
          <Mail className="w-6 h-6 mr-2 text-blue-600" />
          Need More Help?
        </h3>        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700 mb-2">Contact us if you need additional assistance at:</p>
          <a 
            href="mailto:velazquc@oregonstate.edu" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            velazquc@oregonstate.edu
          </a>
        </div>
      </div>
    </div>
  )
}