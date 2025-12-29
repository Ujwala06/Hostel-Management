/**
 * Comprehensive Skeleton Loading Components
 * Used for displaying loading states while data is being fetched
 * Compatible with Tailwind CSS
 */

// ============ TABLE SKELETON ============
export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-3 text-left">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-gray-200">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============ CARD SKELETON ============
export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>

      {/* Content lines */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Footer action */}
      <div className="mt-6 flex gap-2">
        <div className="h-10 bg-gray-300 rounded w-24"></div>
        <div className="h-10 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  );
}

// ============ ROOM CARD SKELETON ============
export function RoomCardSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-gray-200 p-4">
        <div className="h-5 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* Footer buttons */}
      <div className="bg-gray-100 p-3 flex gap-2">
        <div className="h-9 bg-gray-300 rounded flex-1"></div>
        <div className="h-9 bg-gray-300 rounded flex-1"></div>
      </div>
    </div>
  );
}

// ============ FORM SKELETON ============
export function FormSkeleton({ fields = 4 }) {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>

      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i}>
            {/* Label */}
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
            {/* Input */}
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>

      {/* Submit button */}
      <div className="mt-6 h-10 bg-gray-300 rounded w-full"></div>
    </div>
  );
}

// ============ LIST SKELETON ============
export function ListSkeleton({ items = 8 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white border border-gray-200 rounded p-4 flex justify-between items-center">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-9 bg-gray-300 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}

// ============ DETAIL VIEW SKELETON ============
export function DetailViewSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Content section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ GRID SKELETON ============
export function GridSkeleton({ cols = 3, items = 6 }) {
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============ DASHBOARD SKELETON ============
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-lg p-6">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large section */}
        <div className="lg:col-span-2">
          <TableSkeleton rows={5} columns={4} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

// ============ AVATAR SKELETON ============
export function AvatarSkeleton({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`animate-pulse ${sizeClasses[size]} bg-gray-300 rounded-full`}></div>
  );
}

// ============ BADGE SKELETON ============
export function BadgeSkeleton() {
  return (
    <div className="animate-pulse h-6 bg-gray-300 rounded-full w-16"></div>
  );
}

// ============ PROGRESS BAR SKELETON ============
export function ProgressBarSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-2 bg-gray-200 rounded w-full"></div>
    </div>
  );
}

// ============ PAGE SKELETON ============
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page header */}
      <div className="animate-pulse mb-8">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Content */}
      <DashboardSkeleton />
    </div>
  );
}

// ============ FALLBACK COMPONENT ============
/**
 * Generic skeleton fallback for any loading state
 * @param {number} height - Height in pixels
 * @param {string} width - Width as CSS value (default '100%')
 * @param {boolean} rounded - Add border radius
 */
export function SkeletonBox({ height = 100, width = '100%', rounded = false }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${rounded ? 'rounded-lg' : ''}`}
      style={{ height: `${height}px`, width }}
    ></div>
  );
}
