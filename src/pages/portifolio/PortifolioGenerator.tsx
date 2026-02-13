import { useState, useEffect } from "react"
import { useForm, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Download, Loader2, CheckCircle2, TrendingUp, Briefcase, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useAuth } from "@/contexts/AuthContext"
import { acervoService } from "@/services/acervoService"
import { obraService } from "@/services/obraService"
import { generatePortfolioPDF, type PortfolioWork } from "@/services/pdfService"
import { toast } from "sonner"

const portfolioSchema = z.object({
    periodoInicio: z.date().optional().nullable(),
    periodoFim: z.date().optional().nullable(),
    areas: z.array(z.string()).optional(),
    comprovacao: z.boolean().default(false),
    qtdObrasPorArea: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number().min(1).optional()
    ),
    mostrarValores: z.boolean().default(false),
    bio: z.string().optional(),
    especialidades: z.string().optional(),
    tipoListagemGeral: z.enum(["todas", "selecionadas"]).default("todas"),
})

type PortfolioFormValues = z.infer<typeof portfolioSchema>

export default function PortfolioGenerator() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [availableCategories, setAvailableCategories] = useState<string[]>([])
    const [works, setWorks] = useState<PortfolioWork[]>([])
    const [loadingData, setLoadingData] = useState(true)

    const form = useForm<PortfolioFormValues>({
        resolver: zodResolver(portfolioSchema) as Resolver<PortfolioFormValues>,
        defaultValues: {
            comprovacao: false,
            mostrarValores: false,
            areas: [],
            bio: "",
            especialidades: ""
        },
    })

    // Watch for changes to update preview
    const watchAllFields = useWatch({ control: form.control });

    useEffect(() => {
        async function loadData() {
            if (!user?.workspace_id) return
            try {
                // Fetch both Obras and Acervos
                const [obrasData, acervosData] = await Promise.all([
                    obraService.list(user.workspace_id),
                    acervoService.list(user.workspace_id)
                ])

                // Map Acervos to Obras to create PortfolioWorks
                const mappedWorks: PortfolioWork[] = obrasData.map(obra => {
                    const relatedAcervos = acervosData.filter(a => a.obra_id === obra.id)
                    return {
                        ...obra,
                        acervos: relatedAcervos,
                        primaryAcervo: relatedAcervos[0] // Simple pick for now
                    }
                })

                setWorks(mappedWorks)

                // Extract unique categories from Obras AND their Acervo items
                const cats = new Set<string>()
                mappedWorks.forEach((w) => {
                    // From Obra
                    w.categorias?.forEach(c => cats.add(c))

                    // From Acervo Items (fallback or additive)
                    w.acervos.forEach(a => {
                        a.itens?.forEach((i) => {
                            if (i.categoria) cats.add(i.categoria)
                        })
                    })
                })
                setAvailableCategories(Array.from(cats).sort())

            } catch (error) {
                console.error("Erro ao carregar dados:", error)
                toast.error("Erro ao carregar obras e acervos")
            } finally {
                setLoadingData(false)
            }
        }
        loadData()
    }, [user?.workspace_id])

    // --- Preview Logic ---
    const filteredWorks = works.filter(w => {
        // Date Filter (using Obra dates)
        if (watchAllFields.periodoInicio && new Date(w.data_inicio) < watchAllFields.periodoInicio) return false;
        if (watchAllFields.periodoFim) {
            const dt = w.data_conclusao ? new Date(w.data_conclusao) : new Date();
            if (dt > watchAllFields.periodoFim) return false;
        }

        // Proof Filter (check if ANY linked acervo has proof)
        if (watchAllFields.comprovacao) {
            const hasProof = w.acervos.some(a => !!a.arquivo_cat_url || !!a.numero_art);
            if (!hasProof) return false;
        }

        // Area Filter
        if (watchAllFields.areas && watchAllFields.areas.length > 0) {
            // Check Obra categories
            const hasObraCat = w.categorias?.some(c => watchAllFields.areas?.includes(c));
            // Check Acervo Item categories
            const hasItemCat = w.acervos.some(a => a.itens?.some(i => i.categoria && watchAllFields.areas?.includes(i.categoria)));

            if (!hasObraCat && !hasItemCat) return false;
        }

        return true;
    });

    const totalWorks = filteredWorks.length;

    // Calculate breakdown for preview.
    const categoriesPreview: Record<string, number> = {};
    filteredWorks.forEach(w => {
        const cats = new Set<string>();

        // Collect all categories for this work
        w.categorias?.forEach(c => cats.add(c));
        w.acervos.forEach(a => {
            a.itens?.forEach(i => i.categoria && cats.add(i.categoria));
        });

        if (cats.size === 0) cats.add("Geral");

        cats.forEach(c => {
            categoriesPreview[c] = (categoriesPreview[c] || 0) + 1;
        })
    });

    const topCategories = Object.entries(categoriesPreview)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);


    async function onSubmit(data: PortfolioFormValues) {
        if (!user) return
        setLoading(true)

        try {
            if (filteredWorks.length === 0) {
                toast.warning("Nenhuma obra encontrada com os filtros selecionados.")
                setLoading(false)
                return
            }

            // Gerar PDF
            generatePortfolioPDF({
                engenheiro: {
                    nome: user.nome_completo,
                    crea: user.crea || "Não informado",
                    email: user.email || "",
                    telefone: user.telefone || "",
                    cidade: user.endereco?.split("-")?.[0]?.trim(), // Attempt to parse city if in address
                    estado: user.endereco?.slice(-2) // Attempt to parse state
                },
                obras: works, // Pass ALL works, service handles filtering consistent with preview/config
                config: {
                    ...data,
                }
            })

            toast.success("Portfólio gerado com sucesso!")
        } catch (error) {
            console.error("Erro ao gerar portfólio:", error)
            toast.error("Erro ao gerar o arquivo PDF")
        } finally {
            setLoading(false)
        }
    }

    const selectedAreas = form.watch("areas") || []

    const toggleArea = (area: string) => {
        const current = form.getValues("areas") || []
        if (current.includes(area)) {
            form.setValue("areas", current.filter(c => c !== area))
        } else {
            form.setValue("areas", [...current, area])
        }
    }

    const [searchTerm, setSearchTerm] = useState("")

    // Filter categories based on search
    const filteredCategories = availableCategories.filter(cat =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectAllFiltered = () => {
        const current = form.getValues("areas") || []
        const newSet = new Set([...current, ...filteredCategories])
        form.setValue("areas", Array.from(newSet))
    }

    const deselectAll = () => {
        form.setValue("areas", [])
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Gerador de Portfólio Técnico
                </h2>
                <p className="text-muted-foreground">
                    Crie um documento profissional que destaca sua experiência técnica e capacidade de execução.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Coluna Esquerda: Configuração */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Filtros e Conteúdo</CardTitle>
                                <CardDescription>
                                    Defina o que será incluído no seu portfólio
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                {/* Período */}
                                <div className="space-y-2">
                                    <Label>Período das Obras</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Input
                                                type="date"
                                                {...form.register("periodoInicio", { valueAsDate: true })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                type="date"
                                                {...form.register("periodoFim", { valueAsDate: true })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Textos de Apresentação */}
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="space-y-2">
                                        <Label>Mini Bio (Resumo Profissional)</Label>
                                        <Textarea
                                            placeholder="Engenheiro Civil com 10 anos de experiência em obras de infraestrutura..."
                                            maxLength={500}
                                            {...form.register("bio")}
                                        />
                                        <p className="text-xs text-muted-foreground">Aparecerá na segunda página do portfólio.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Especialidades (Tags)</Label>
                                        <Input
                                            placeholder="Ex: Pavimentação, Drenagem, Estruturas de Concreto"
                                            {...form.register("especialidades")}
                                        />
                                    </div>
                                </div>

                                {/* Áreas de Atuação */}
                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <Label>Áreas / Categorias (Opcional)</Label>
                                        {availableCategories.length > 5 && (
                                            <div className="relative w-48">
                                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Buscar categoria..."
                                                    className="pl-8 h-9 text-xs"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-3 text-xs text-muted-foreground w-full">
                                        <button
                                            type="button"
                                            onClick={selectAllFiltered}
                                            className="hover:text-primary transition-colors hover:underline flex items-center gap-1"
                                        >
                                            Selecionar Visíveis ({filteredCategories.length})
                                        </button>
                                        <span>|</span>
                                        <button
                                            type="button"
                                            onClick={deselectAll}
                                            className="hover:text-primary transition-colors hover:underline"
                                        >
                                            Limpar Seleção
                                        </button>
                                    </div>
                                    <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2 bg-muted/20">
                                        {loadingData ? (
                                            <div className="flex items-center justify-center p-4">
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : availableCategories.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center">Nenhuma categoria encontrada nas suas obras ou acervos.</p>
                                        ) : filteredCategories.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center">Nenhuma categoria encontrada para "{searchTerm}".</p>
                                        ) : (
                                            filteredCategories.map((area) => (
                                                <div key={area} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`area-${area}`}
                                                        checked={selectedAreas.includes(area)}
                                                        onChange={() => toggleArea(area)}
                                                    />
                                                    <Label htmlFor={`area-${area}`} className="font-normal cursor-pointer text-sm">
                                                        {area}
                                                    </Label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Selecione as áreas que deseja destacar. Se nenhuma for selecionada, todas serão processadas.</p>
                                </div>

                                {/* Opções Gerais */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-background">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Comprovação</Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Somente obras com CAT/ART anexo
                                                </p>
                                            </div>
                                            <Switch
                                                checked={form.watch("comprovacao")}
                                                onCheckedChange={(checked) => form.setValue("comprovacao", checked)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Listagem Final de Obras</Label>
                                            <Select
                                                value={form.watch("tipoListagemGeral")}
                                                onChange={(e) => form.setValue("tipoListagemGeral", e.target.value as "todas" | "selecionadas")}
                                            >
                                                <option value="todas">Todas as obras do período</option>
                                                <option value="selecionadas">Apenas obras das áreas selecionadas</option>
                                            </Select>
                                            <p className="text-xs text-muted-foreground">Define quais obras aparecem na tabela final do PDF.</p>
                                        </div>


                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-background">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Mostrar Valores</Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Exibir somatório financeiro
                                                </p>
                                            </div>
                                            <Switch
                                                checked={form.watch("mostrarValores")}
                                                onCheckedChange={(checked) => form.setValue("mostrarValores", checked)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="qtdObrasPorArea">Limite de Obras por Área</Label>
                                            <Input
                                                id="qtdObrasPorArea"
                                                type="number"
                                                placeholder="Ex: 5 (Top 5 mais relevantes)"
                                                min="1"
                                                {...form.register("qtdObrasPorArea")}
                                            />
                                            <p className="text-xs text-muted-foreground">O sistema prioriza obras com CAT/ART e mais recentes.</p>
                                        </div>


                                    </div>
                                </div>

                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-muted/10">
                                <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto font-semibold shadow-md">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Gerando PDF...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-4 w-4" />
                                            Baixar Portfólio PDF
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>

                {/* Coluna Direita: Preview Live */}
                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20 shadow-xs sticky top-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Preview do Conteúdo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="text-center p-4 bg-background rounded-lg border">
                                <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Total de Obras Selecionadas</span>
                                <div className="text-4xl font-bold text-primary mt-1">{totalWorks}</div>
                            </div>

                            <div>
                                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    Distribuição por Área (Top 5)
                                </h4>
                                {topCategories.length > 0 ? (
                                    <div className="space-y-2">
                                        {topCategories.map(([cat, count]) => (
                                            <div key={cat} className="flex justify-between items-center text-sm border-b border-dashed pb-1">
                                                <span className="truncate max-w-[180px]" title={cat}>{cat}</span>
                                                <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Nenhuma obra selecionada.</p>
                                )}
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                                <h5 className="font-semibold mb-1 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Inteligência Artificial
                                </h5>
                                <p className="text-xs opacity-90">
                                    O gerador irá selecionar automaticamente as <strong>{form.watch("qtdObrasPorArea") || "todas"}</strong> melhores obras de cada área, baseando-se na existência de CAT/ART e completude do cadastro.
                                </p>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}