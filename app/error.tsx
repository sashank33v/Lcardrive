'use client'
import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#F0F2FF] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h1 className="font-bold text-gray-900 text-xl mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          An unexpected error occurred. Our team has been notified. Please try again or go back to the homepage.
        </p>
        {error?.digest && (
          <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-50 px-3 py-2 rounded-lg">
            Error: {error.digest}
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw size={15} /> Try again
          </button>
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-[#1A3CFF] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
              <Home size={15} /> Go home
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
