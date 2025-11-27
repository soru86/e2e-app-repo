import { useState } from 'react'
import UploadMode from './components/UploadMode'
import WebLocationMode from './components/WebLocationMode'

function App() {
  const [mode, setMode] = useState('upload') // 'upload' or 'web'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Document Converter
            </h1>
            <p className="text-gray-600">
              Convert PDF files to Word documents with preserved formatting
            </p>
          </div>

          {/* Mode Selector */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setMode('upload')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'upload'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upload PDF
              </button>
              <button
                onClick={() => setMode('web')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  mode === 'web'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Convert from Web Location
              </button>
            </div>
          </div>

          {/* Mode Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {mode === 'upload' ? <UploadMode /> : <WebLocationMode />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App


