import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { RecentObra } from "@/services/dashboardService"

interface RecentObrasProps {
  obras: RecentObra[]
  loading: boolean
}

export function RecentObras({ obras, loading }: RecentObrasProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Obras Recentes</CardTitle>
          <CardDescription>Últimas obras cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (obras.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Obras Recentes</CardTitle>
          <CardDescription>Últimas obras cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma obra cadastrada ainda.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">Obras Recentes</CardTitle>
        <CardDescription>Últimas obras cadastradas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {obras.map((obra) => (
            <div 
              key={obra.id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{obra.descricao_obra}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {obra.cidade}, {obra.estado}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(obra.data_inicio), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
              {obra.valor_total && (
                <p className="text-sm font-bold text-primary ml-4">
                  R$ {obra.valor_total.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
