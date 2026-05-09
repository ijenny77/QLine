import clsx from 'clsx'

export function Skeleton({ className }) {
  return (
    <div className={clsx('skeleton rounded-lg', className)} />
  )
}

export function CardSkeleton() {
  return (
    <div className="glass p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export function TableRowSkeleton({ rows = 5 }) {
  return Array.from({ length: rows }).map((_, i) => (
    <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  ))
}
