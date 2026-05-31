export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F0F2FF] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1A3CFF] rounded-2xl mb-4">
          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  )
}
