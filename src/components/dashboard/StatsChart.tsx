import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartData {
  name: string
  obras: number
  acervos: number
  valor: number
}

interface StatsChartProps {
  data: ChartData[]
  loading?: boolean
  type?: "line" | "bar"
  title: string
  description: string
}

export function StatsChart({
  data,
  loading = false,
  type = "line",
  title,
  description,
}: StatsChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const ChartComponent = type === "line" ? LineChart : BarChart
  const DataComponent = type === "line" ? Line : Bar

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <DataComponent
              type="monotone"
              dataKey="obras"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              name="Obras"
            />
            <DataComponent
              type="monotone"
              dataKey="acervos"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              name="Acervos"
            />
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface ValueChartProps {
  data: Array<{ name: string; valor: number }>
  loading?: boolean
  title: string
  description: string
}

export function ValueChart({
  data,
  loading = false,
  title,
  description,
}: ValueChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) =>
                `R$ ${(value / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              formatter={(value: number | undefined) => [value?.toString() || "0", "Valor"]}
            />
            <Bar
              dataKey="valor"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
