import { Loader2 } from 'lucide-react'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      <p className="text-gray-600 font-medium">{message}</p>
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary-600 animate-pulse" style={{ width: '60%' }}></div>
      </div>
    </div>
  )
}

export default LoadingSpinner

