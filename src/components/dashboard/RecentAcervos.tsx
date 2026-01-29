import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { RecentAcervo } from "@/services/dashboardService"

interface RecentAcervosProps {
  acervos: RecentAcervo[]
  loading: boolean
}

export function RecentAcervos({ acervos, loading }: RecentAcervosProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acervos Recentes</CardTitle>
          <CardDescription>Últimos acervos técnicos cadastrados</CardDescription>
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

  if (acervos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acervos Recentes</CardTitle>
          <CardDescription>Últimos acervos técnicos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum acervo cadastrado ainda.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">Acervos Recentes</CardTitle>
        <CardDescription>Últimos acervos técnicos cadastrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {acervos.map((acervo) => (
            <div 
              key={acervo.id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{acervo.descricao_obra}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {acervo.acervo_tipo}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {acervo.cidade}, {acervo.estado}
                  </Badge>
                  {acervo.numero_art && (
                    <span className="text-xs text-muted-foreground font-mono">
                      ART: {acervo.numero_art}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground ml-4 whitespace-nowrap">
                {format(new Date(acervo.created_at), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
