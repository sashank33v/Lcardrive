export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FACC15] rounded-2xl mb-4">
          <div className="w-6 h-6 border-3 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  )
}
