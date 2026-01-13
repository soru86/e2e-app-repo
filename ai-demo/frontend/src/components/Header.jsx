import { Code2, Sparkles } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Code Analyzer AI</h1>
            <p className="text-sm text-gray-600">AI-powered code analysis, documentation & review</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-primary-600">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Powered by Local LLM</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

