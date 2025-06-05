import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

export default function FilePreview({ file, onClose }) {
  const [loading, setLoading] = useState(true);
  const [textContent, setTextContent] = useState('');
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  if (!file) return null;  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const isText = file.type.startsWith('text/') || file.type === 'text/plain';
  const isPreviewable = isImage || isPDF || isText;

  // Fetch text content for text files
  useEffect(() => {
    if (isText && file) {
      fetch(`${API}/uploads/${file.path}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch text content');
          return response.text();
        })
        .then(content => {
          setTextContent(content);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching text content:', error);
          setTextContent('Error loading text content');
          setLoading(false);
        });
    }
  }, [isText, file, API]);if (!isPreviewable) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full mx-4 shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold">File Preview</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="mb-6">
              <FileText size={64} className="mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">{file.name}</h4>
              <p className="text-gray-600 text-lg">
                Preview not available for this file type.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {Math.round(file.size / 1024)} KB • {file.type}
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href={`${API}/uploads/${file.path}`}
                download
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-lg transition-colors"
              >
                <Download size={18} />
                <span>Download File</span>
              </a>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2 text-lg transition-colors"
              >
                <X size={18} />
                <span>Back to Files</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b shadow-sm flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <X size={18} />
            <span className="font-medium">Back to Files</span>
          </button>
          <h3 className="text-lg font-semibold text-gray-800 truncate max-w-md">{file.name}</h3>
        </div>
          <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {Math.round(file.size / 1024)} KB • {file.type}
          </span>
          {!isPDF && (
            <a
              href={`${API}/uploads/${file.path}`}
              download
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="Download"
            >
              <Download size={18} />
            </a>
          )}
          <a
            href={`${API}/uploads/${file.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Open in new tab"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Fullscreen Content */}
      <div className="flex-1 bg-gray-100 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-gray-500 text-lg">Loading preview...</div>
          </div>
        )}

        {isImage && (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={`${API}/api/preview/${file._id}`}
              alt={file.name}
              className="max-w-full max-h-full object-contain"
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
              style={{ display: loading ? 'none' : 'block' }}
            />
          </div>
        )}        {isPDF && (
          <div className="w-full h-full">
            <iframe
              src={`${API}/api/preview/${file._id}`}
              className="w-full h-full border-0"
              title={file.name}
              onLoad={() => setLoading(false)}
              style={{ display: loading ? 'none' : 'block' }}
            />
          </div>
        )}

        {isText && (
          <div className="w-full h-full p-6 overflow-auto bg-white">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800 max-w-none">
              {textContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
