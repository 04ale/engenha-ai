import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Building2, Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      title: "Nova Obra",
      description: "Cadastrar nova obra",
      icon: Building2,
      onClick: () => navigate("/app/obras/novo"),
      variant: "default" as const,
    },
    {
      title: "Novo Acervo",
      description: "Cadastrar novo acervo técnico",
      icon: FileText,
      onClick: () => navigate("/app/acervos/novo"),
      variant: "default" as const,
    },
    {
      title: "Importar Itens",
      description: "Importar itens via planilha",
      icon: Upload,
      onClick: () => navigate("/app/acervos"),
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>Atalhos para tarefas frequentes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant={action.variant}
                className="w-full justify-start h-auto py-3"
                onClick={action.onClick}
              >
                <Icon className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
