import { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function DocumentationViewer({ documentation }) {
  const [copied, setCopied] = useState(false)

  if (!documentation || documentation.trim() === '') {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No documentation generated</p>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(documentation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Header with Copy Button */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          Technical Documentation
        </h3>
        <button
          onClick={handleCopy}
          className="btn btn-secondary flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Documentation Content */}
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900">{children}</h3>
            ),
            p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
            ),
            li: ({ children }) => <li className="ml-4">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary-500 pl-4 italic my-4 text-gray-600">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-50">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-300">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">
                {children}
              </td>
            ),
          }}
        >
          {documentation}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default DocumentationViewer

