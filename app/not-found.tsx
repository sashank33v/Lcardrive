import Link from 'next/link'
import { Search, Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F0F2FF] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Big 404 */}
        <div className="mb-6">
          <p className="text-8xl md:text-9xl font-bold text-[#1A3CFF] opacity-10 leading-none select-none">
            404
          </p>
          <div className="-mt-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
              <Search size={28} className="text-[#1A3CFF]" />
            </div>
          </div>
        </div>

        <h1 className="font-bold text-gray-900 text-2xl mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have moved.
          Try searching for a driving instructor instead.
        </p>

        {/* Search bar */}
        <Link href="/search">
          <div className="bg-white border-2 border-gray-200 rounded-2xl px-4 py-3.5 flex items-center gap-3 mb-4 hover:border-[#1A3CFF] transition-colors cursor-pointer">
            <Search size={18} className="text-gray-400" />
            <span className="text-gray-400 text-sm flex-1 text-left">Search for a driving instructor...</span>
            <ArrowRight size={16} className="text-gray-400" />
          </div>
        </Link>

        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
              <Home size={15} /> Homepage
            </button>
          </Link>
          <Link href="/search" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-[#1A3CFF] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
              <Search size={15} /> Find instructor
            </button>
          </Link>
        </div>

        {/* Suburb suggestions */}
        <div className="mt-8">
          <p className="text-xs text-gray-400 mb-3">Browse popular suburbs</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Footscray', 'Sunshine', 'Coburg', 'Preston', 'Werribee'].map(s => (
              <Link
                key={s}
                href={`/instructors-in/${s.toLowerCase()}`}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-[#1A3CFF] hover:text-[#1A3CFF] transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
