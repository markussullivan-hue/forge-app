import { Card, CardContent } from '../../lib/shadcn/card'
import { Skeleton } from '../../lib/shadcn/skeleton'

type KpiCardProps = {
  label: string
  value: number | null | undefined
  loading?: boolean
}

const NUMBER_FORMAT = new Intl.NumberFormat()

/**
 * Compact statistic card: large number on top, label below.
 * Mirrors the `<Statistic>` widgets used on the classic dashboard.
 */
export default function KpiCard({ label, value, loading }: KpiCardProps) {
  return (
    <Card className="rounded-lg">
      <CardContent className="p-4">
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-3xl font-semibold tracking-tight text-foreground">
            {NUMBER_FORMAT.format(value ?? 0)}
          </div>
        )}
        <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
      </CardContent>
    </Card>
  )
}
