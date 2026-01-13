import { useState } from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Code,
  FileCode,
} from 'lucide-react'

function CodeReviewViewer({ review }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL')
  const [filterCategory, setFilterCategory] = useState('ALL')

  if (!review) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No code review data available</p>
      </div>
    )
  }

  const issues = review.issues || []
  const suggestions = review.suggestions || []
  const strengths = review.strengths || []

  const filteredIssues = issues.filter((issue) => {
    const severityMatch = filterSeverity === 'ALL' || issue.severity === filterSeverity
    const categoryMatch = filterCategory === 'ALL' || issue.category === filterCategory
    return severityMatch && categoryMatch
  })

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'MEDIUM':
        return <Info className="w-5 h-5 text-yellow-600" />
      case 'LOW':
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getSeverityBadge = (severity) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      LOW: 'bg-blue-100 text-blue-800 border-blue-200',
    }
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium border ${colors[severity] || colors.MEDIUM}`}
      >
        {severity}
      </span>
    )
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'SECURITY':
        return <Shield className="w-4 h-4" />
      case 'PERFORMANCE':
        return <Zap className="w-4 h-4" />
      case 'MAINTAINABILITY':
        return <Code className="w-4 h-4" />
      case 'BUG':
        return <XCircle className="w-4 h-4" />
      default:
        return <FileCode className="w-4 h-4" />
    }
  }

  const getAreaIcon = (area) => {
    switch (area) {
      case 'CODE_QUALITY':
        return <Code className="w-4 h-4" />
      case 'ARCHITECTURE':
        return <TrendingUp className="w-4 h-4" />
      case 'PERFORMANCE':
        return <Zap className="w-4 h-4" />
      case 'SECURITY':
        return <Shield className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const severities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
  const categories = ['ALL', 'SECURITY', 'PERFORMANCE', 'MAINTAINABILITY', 'BUG']

  return (
    <div className="space-y-6">
      {/* Filters */}
      {issues.length > 0 && (
        <div className="card bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Filter by Severity</label>
              <select
                className="input"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                {severities.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Filter by Category</label>
              <select
                className="input"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Issues */}
      {filteredIssues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Issues ({filteredIssues.length})
          </h3>
          <div className="space-y-4">
            {filteredIssues.map((issue, idx) => (
              <div key={idx} className="card border-l-4 border-orange-500">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{getSeverityIcon(issue.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityBadge(issue.severity)}
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        {getCategoryIcon(issue.category)}
                        {issue.category}
                      </span>
                      {issue.filePath && (
                        <span className="text-xs text-gray-500 font-mono ml-auto">
                          {issue.filePath}
                          {issue.lineNumber && `:${issue.lineNumber}`}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{issue.description}</p>
                    {issue.recommendation && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Recommendation:</span>{' '}
                          {issue.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Improvement Suggestions ({suggestions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="card border-l-4 border-yellow-500 bg-yellow-50">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 text-yellow-600">
                    {getAreaIcon(suggestion.area)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-yellow-800 bg-yellow-200 px-2 py-1 rounded">
                        {suggestion.area.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2 text-sm">{suggestion.description}</p>
                    {suggestion.suggestedChange && (
                      <div className="bg-white border border-yellow-200 rounded p-2 mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Suggested Change:</p>
                        <p className="text-xs text-gray-600">{suggestion.suggestedChange}</p>
                      </div>
                    )}
                    {suggestion.impact && (
                      <p className="text-xs text-gray-600 mt-2">
                        <span className="font-medium">Impact:</span> {suggestion.impact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Strengths ({strengths.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strengths.map((strength, idx) => (
              <div key={idx} className="card bg-green-50 border-green-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{strength}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {issues.length === 0 && suggestions.length === 0 && strengths.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No review data available</p>
        </div>
      )}
    </div>
  )
}

export default CodeReviewViewer

