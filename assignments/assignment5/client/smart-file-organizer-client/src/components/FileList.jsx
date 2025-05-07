// src/components/FileList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FileList() {
  const [files, setFiles]     = useState([]);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/files`)
      .then(res => {
        setFiles(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not fetch files');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading your files…</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;
  if (!files.length) return <p>No files uploaded yet.</p>;

  return (
    <div>
      <h2>Your Uploaded Files</h2>
      <ul>
        {files.map(f => (
          <li key={f._id}>
            <a
              href={`${import.meta.env.VITE_API_URL}/uploads/${f.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {f.name}
            </a>
            {' '}
            ({Math.round(f.size/1024)} KB, {f.type})
          </li>
        ))}
      </ul>
    </div>
  );
}
