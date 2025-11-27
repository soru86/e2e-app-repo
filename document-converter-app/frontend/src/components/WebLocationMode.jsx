import { useState } from 'react'
import axios from 'axios'

function WebLocationMode() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleConvert = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError('Please enter a valid URL (must start with http:// or https://)')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await axios.post(
        'http://localhost:8000/api/convert/web',
        { url: url.trim() },
        {
          responseType: 'blob',
        }
      )

      // Create download link
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = blobUrl
      
      // Try to get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition']
      let filename = 'converted_document.docx'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)

      setSuccess(true)
      setUrl('')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Failed to convert from URL. Please check the URL and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Convert from Web Location
        </h2>
        <p className="text-gray-600">
          Enter a URL to convert a PDF document or webpage to Word format
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="url-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Web URL
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setError('')
              setSuccess(false)
            }}
            placeholder="https://example.com/document.pdf or https://example.com/page"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can enter either:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>A direct link to a PDF file</li>
              <li>A webpage URL (will be converted to PDF first, then to Word)</li>
            </ul>
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✓ Document converted successfully! Download started.
          </p>
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!url.trim() || loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
          !url.trim() || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Converting...
          </span>
        ) : (
          'Convert to Word'
        )}
      </button>
    </div>
  )
}

export default WebLocationMode


