import { useState } from 'react'
import { Upload, Github, FileArchive, AlertCircle } from 'lucide-react'
import { analyzeZipFile, analyzeGitHubUrl } from '../services/api'

function UploadSection({ onAnalysisStart, onAnalysisComplete, onError }) {
  const [activeTab, setActiveTab] = useState('zip')
  const [file, setFile] = useState(null)
  const [githubUrl, setGithubUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/zip' || selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile)
      } else {
        onError('Please upload a ZIP file')
      }
    }
  }

  const handleZipUpload = async () => {
    if (!file) {
      onError('Please select a ZIP file to upload')
      return
    }

    try {
      onAnalysisStart()
      setIsUploading(true)
      const result = await analyzeZipFile(file)
      onAnalysisComplete(result)
    } catch (error) {
      onError(error.response?.data?.message || error.message || 'Failed to analyze ZIP file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleGitHubAnalyze = async () => {
    if (!githubUrl.trim()) {
      onError('Please enter a GitHub repository URL')
      return
    }

    // Basic URL validation
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w\-\.]+\/[\w\-\.]+/
    if (!githubUrlPattern.test(githubUrl)) {
      onError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)')
      return
    }

    try {
      onAnalysisStart()
      setIsUploading(true)
      const result = await analyzeGitHubUrl(githubUrl)
      onAnalysisComplete(result)
    } catch (error) {
      onError(error.response?.data?.message || error.message || 'Failed to analyze GitHub repository')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyze Your Code</h2>
        <p className="text-gray-600">
          Upload a ZIP file or provide a GitHub repository URL to get comprehensive code analysis,
          documentation, and review suggestions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('zip')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'zip'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileArchive className="w-4 h-4" />
            Upload ZIP
          </div>
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'github'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub Repository
          </div>
        </button>
      </div>

      {/* ZIP Upload Tab */}
      {activeTab === 'zip' && (
        <div className="space-y-4">
          <div>
            <label className="label">Select ZIP File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".zip,application/zip"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">ZIP files up to 100MB</p>
                {file && (
                  <p className="text-sm text-primary-600 font-medium mt-2">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleZipUpload}
            disabled={!file || isUploading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>
      )}

      {/* GitHub Tab */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <div>
            <label className="label">GitHub Repository URL</label>
            <input
              type="text"
              className="input"
              placeholder="https://github.com/username/repository"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGitHubAnalyze()}
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter the full URL of a public GitHub repository
            </p>
          </div>
          <button
            onClick={handleGitHubAnalyze}
            disabled={!githubUrl.trim() || isUploading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Analyzing...' : 'Analyze Repository'}
          </button>
        </div>
      )}

      {/* Info Alert */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">What you'll get:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Flowcharts, sequence diagrams, and architecture diagrams</li>
              <li>Comprehensive technical documentation</li>
              <li>Detailed code review with improvement suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadSection

