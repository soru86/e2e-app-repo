import { useState } from 'react'
import { RotateCcw, FileText, Image, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react'
import DocumentationViewer from './DocumentationViewer'
import CodeReviewViewer from './CodeReviewViewer'
import DiagramViewer from './DiagramViewer'

function ResultsSection({ result, onReset }) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!result || result.status !== 'SUCCESS') {
    return (
      <div className="card max-w-2xl mx-auto">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analysis Incomplete</h3>
          <p className="text-gray-600 mb-4">{result?.message || 'Unable to complete analysis'}</p>
          <button onClick={onReset} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
            </div>
            <p className="text-gray-600">Analysis ID: {result.analysisId}</p>
          </div>
          <button onClick={onReset} className="btn btn-secondary">
            <RotateCcw className="w-4 h-4 mr-2" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            icon={<TrendingUp className="w-4 h-4" />}
            label="Overview"
          />
          <TabButton
            active={activeTab === 'diagrams'}
            onClick={() => setActiveTab('diagrams')}
            icon={<Image className="w-4 h-4" />}
            label="Diagrams"
            badge={result.generatedImages?.length || 0}
          />
          <TabButton
            active={activeTab === 'documentation'}
            onClick={() => setActiveTab('documentation')}
            icon={<FileText className="w-4 h-4" />}
            label="Documentation"
          />
          <TabButton
            active={activeTab === 'review'}
            onClick={() => setActiveTab('review')}
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Code Review"
          />
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && <OverviewTab result={result} />}
          {activeTab === 'diagrams' && <DiagramViewer images={result.generatedImages || []} />}
          {activeTab === 'documentation' && (
            <DocumentationViewer documentation={result.documentation || ''} />
          )}
          {activeTab === 'review' && <CodeReviewViewer review={result.codeReview} />}
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
        active
          ? 'text-primary-600 border-primary-600'
          : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  )
}

function OverviewTab({ result }) {
  const review = result.codeReview

  return (
    <div className="space-y-6">
      {/* Score Card */}
      {review?.overallScore && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="text-3xl font-bold text-green-700 mb-1">
              {review.overallScore}
            </div>
            <div className="text-sm text-green-600 font-medium">Overall Score</div>
          </div>
          <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="text-3xl font-bold text-blue-700 mb-1">
              {review.issues?.length || 0}
            </div>
            <div className="text-sm text-blue-600 font-medium">Issues Found</div>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="text-3xl font-bold text-purple-700 mb-1">
              {review.suggestions?.length || 0}
            </div>
            <div className="text-sm text-purple-600 font-medium">Suggestions</div>
          </div>
        </div>
      )}

      {/* Summary */}
      {review?.summary && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            Summary
          </h3>
          <p className="text-gray-700 leading-relaxed">{review.summary}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {review?.strengths && review.strengths.length > 0 && (
          <div className="card bg-green-50 border-green-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-800">
              <CheckCircle2 className="w-5 h-5" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {review.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-green-700">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {review?.issues && review.issues.length > 0 && (
          <div className="card bg-red-50 border-red-200">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Critical Issues
            </h3>
            <ul className="space-y-2">
              {review.issues
                .filter((issue) => issue.severity === 'CRITICAL' || issue.severity === 'HIGH')
                .slice(0, 5)
                .map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-red-700">
                    <span className="text-red-600 mt-1">⚠</span>
                    <span className="text-sm">{issue.description}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsSection

