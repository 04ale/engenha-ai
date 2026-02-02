import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { ObrasFilters } from "@/services/obraService"

interface ObrasFiltersProps {
  filters: ObrasFilters
  onFiltersChange: (filters: ObrasFilters) => void
}

export function ObrasFiltersComponent({
  filters,
  onFiltersChange,
}: ObrasFiltersProps) {
  const hasFilters = filters.search || filters.cidade || filters.estado

  const clearFilters = () => {
    onFiltersChange({})
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por descrição ou número de contrato"
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              placeholder="Filtrar por cidade"
              value={filters.cidade || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, cidade: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Input
              id="estado"
              placeholder="Filtrar por estado"
              value={filters.estado || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, estado: e.target.value })
              }
              maxLength={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
