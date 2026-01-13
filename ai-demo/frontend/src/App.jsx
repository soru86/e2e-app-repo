import { useState } from 'react'
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import ResultsSection from './components/ResultsSection'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result)
    setIsLoading(false)
    setError(null)
  }

  const handleAnalysisStart = () => {
    setIsLoading(true)
    setError(null)
    setAnalysisResult(null)
  }

  const handleError = (errorMessage) => {
    setError(errorMessage)
    setIsLoading(false)
    setAnalysisResult(null)
  }

  const handleReset = () => {
    setAnalysisResult(null)
    setError(null)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!analysisResult && !isLoading && (
          <UploadSection
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
          />
        )}

        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner message="Analyzing your code... This may take a few minutes." />
          </div>
        )}

        {error && (
          <div className="card bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <div className="text-red-600 text-xl">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="btn btn-secondary mt-4"
            >
              Try Again
            </button>
          </div>
        )}

        {analysisResult && (
          <ResultsSection
            result={analysisResult}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

export default App

