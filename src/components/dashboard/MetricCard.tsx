import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  description?: string
  value: string | number | null
  icon?: LucideIcon
  loading?: boolean
  trend?: "up" | "down" | "neutral"
  trendValue?: string | number
  trendLabel?: string
  onClick?: () => void
}

export function MetricCard({
  title,
  description,
  value,
  icon: Icon,
  loading = false,
  trend = "neutral",
  trendValue,
  trendLabel,
  onClick,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600 dark:text-green-400"
    if (trend === "down") return "text-red-600 dark:text-red-400"
    return "text-muted-foreground"
  }

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-3xl font-bold tracking-tight mb-1">{value ?? 0}</div>
            {trendValue !== undefined ? (
              <CardDescription className="text-xs flex items-center gap-1">
                <span className={cn("flex items-center gap-1", getTrendColor())}>
                  {getTrendIcon()}
                  {trendValue} {trendLabel}
                </span>
              </CardDescription>
            ) : (
              <CardDescription className="text-xs">{description}</CardDescription>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
