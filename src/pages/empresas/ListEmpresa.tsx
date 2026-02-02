import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEmpresas } from "@/hooks/useEmpresas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Empresa } from "@/types/empresa";

export default function ListEmpresasPage() {
    const { empresas, loading, deleteEmpresa } = useEmpresas()
    const nav = useNavigate()
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = (empresa: Empresa) => {
        setSelectedEmpresa(empresa)
        setShowDeleteDialog(true)
    }

    const confirmDelete = async () => {
        if (!selectedEmpresa) return

        setIsDeleting(true)
        try {
            await deleteEmpresa(selectedEmpresa.id)
            toast.success("Empresa excluída com sucesso")
            setShowDeleteDialog(false)
            setSelectedEmpresa(null)
        } catch (error) {
            toast.error("Erro ao excluir empresa")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Empresas
                    </h2>
                    <p className="text-muted-foreground">
                        Gerencie suas empresas cadastradas
                    </p>
                </div>
                <Button onClick={() => nav("/app/empresas/novo")} className="shadow-md">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Empresa
                </Button>
            </div>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-40 w-full" />
                    ))}
                </div>
            ) : empresas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-muted-foreground">Nenhuma empresa cadastrada</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {empresas.map((empresa) => (
                        <Card key={empresa.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                            <CardHeader>
                                <CardTitle className="truncate" title={empresa.nome}>{empresa.nome}</CardTitle>
                                <CardDescription>{empresa.cnpj}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    <p>Telefone: {empresa.telefone}</p>
                                    <p>Email: {empresa.email}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 border-t pt-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    title="Editar"
                                    onClick={() => nav(`/app/empresas/${empresa.id}/editar`)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    title="Excluir"
                                    onClick={() => handleDelete(empresa)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {showDeleteDialog && selectedEmpresa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-md shadow-lg animation-in fade-in zoom-in-95 duration-200">
                        <CardHeader>
                            <CardTitle>Excluir Empresa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Tem certeza que deseja excluir a empresa "{selectedEmpresa.nome}"?
                                Esta ação não pode ser desfeita e pode afetar obras vinculadas.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowDeleteDialog(false)
                                        setSelectedEmpresa(null)
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Excluindo..." : "Excluir"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </DashboardLayout >
    )
}