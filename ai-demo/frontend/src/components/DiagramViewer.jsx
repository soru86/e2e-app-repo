import { useState } from 'react'
import { Image, Download, ExternalLink, FileImage } from 'lucide-react'

function DiagramViewer({ images }) {
  const [selectedImage, setSelectedImage] = useState(null)

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No diagrams generated</p>
      </div>
    )
  }

  const diagramTypes = {
    flowchart: 'Flowchart',
    sequence: 'Sequence Diagram',
    architecture: 'Architecture Diagram',
  }

  const getDiagramType = (path) => {
    const lowerPath = path.toLowerCase()
    if (lowerPath.includes('flowchart')) return 'flowchart'
    if (lowerPath.includes('sequence')) return 'sequence'
    if (lowerPath.includes('architecture')) return 'architecture'
    return 'diagram'
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((imagePath, idx) => {
          const type = getDiagramType(imagePath)
          const isUrl = imagePath.startsWith('http')

          return (
            <div
              key={idx}
              className="card cursor-pointer hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-primary-300"
              onClick={() => setSelectedImage(imagePath)}
            >
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {isUrl ? (
                  <img
                    src={imagePath}
                    alt={diagramTypes[type] || 'Diagram'}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : (
                  <div className="text-center p-4">
                    <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Mermaid file</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {imagePath.split('/').pop()}
                    </p>
                  </div>
                )}
                <div className="hidden items-center justify-center w-full h-full">
                  <div className="text-center">
                    <ExternalLink className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">View online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {diagramTypes[type] || 'Diagram'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {isUrl ? 'Online image' : 'Mermaid source'}
                  </p>
                </div>
                {isUrl && (
                  <a
                    href={imagePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal for full-size view */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {diagramTypes[getDiagramType(selectedImage)] || 'Diagram'}
              </h3>
              <div className="flex gap-2">
                {selectedImage.startsWith('http') && (
                  <a
                    href={selectedImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </a>
                )}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-4">
              {selectedImage.startsWith('http') ? (
                <img
                  src={selectedImage}
                  alt="Diagram"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Mermaid Diagram Source</p>
                  <p className="text-sm text-gray-500 font-mono break-all">{selectedImage}</p>
                  <p className="text-xs text-gray-400 mt-4">
                    Install mermaid-cli to convert to image: npm install -g @mermaid-js/mermaid-cli
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Image className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About the Diagrams</p>
            <p className="text-blue-700">
              Diagrams are generated in Mermaid format. To convert them to images, install{' '}
              <code className="bg-blue-100 px-1 rounded">mermaid-cli</code> or use the online
              viewer if available.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiagramViewer

