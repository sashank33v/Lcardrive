export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-2 mt-1">
            <div className="h-5 bg-gray-200 rounded-full w-16" />
            <div className="h-5 bg-gray-200 rounded-full w-20" />
          </div>
        </div>
        <div className="h-8 bg-gray-200 rounded-xl w-20 self-start" />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-52 md:h-72 bg-gray-200" />
      <div className="px-4 pt-5 space-y-4">
        <div className="flex gap-2">
          {[1,2,3].map(i => <div key={i} className="h-8 bg-gray-200 rounded-full w-24" />)}
        </div>
        <div className="bg-white rounded-2xl p-5 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
          <div className="h-3 bg-gray-200 rounded w-4/6" />
        </div>
        <div className="bg-white rounded-2xl p-5 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SuburbPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-48 mb-6" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="bg-white rounded-2xl p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-3 bg-gray-200 rounded w-2/3" />)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  )
}
