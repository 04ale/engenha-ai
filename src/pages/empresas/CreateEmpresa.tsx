import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { empresaService } from "@/services/empresaService"
import { toast } from "sonner"
import { empresaSchema, type EmpresaInput } from "@/lib/validations/empresa"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { IMaskInput } from 'react-imask';


export default function CreateEmpresaPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [loadingCNPJ, setLoadingCNPJ] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        getValues,
    } = useForm<EmpresaInput>({
        resolver: zodResolver(empresaSchema),
        defaultValues: {
            cnpj: "",
            nome: "",
            email: "",
            telefone: "",
            endereco: "",
        }
    })

    const fetchCompanyData = async () => {
        const cnpj = getValues("cnpj")?.replace(/\D/g, "");

        if (!cnpj || cnpj.length !== 14) {
            toast.error("CNPJ inválido. Verifique o número digitado.")
            return
        }

        setLoadingCNPJ(true);

        try {
            const { data, error } = await supabase.functions.invoke('consultar-cnpj', {
                body: { cnpj },
            });

            if (error) {
                console.error('Erro na Edge Function:', error);
                throw error;
            }

            if (data.error) {
                throw new Error(data.error);
            }

            setValue("nome", data.nome || "")
            setValue("email", data.email || "")
            setValue("telefone", data.telefone || "")

            const enderecoCompleto = [
                data.logradouro,
                data.numero,
                data.bairro,
                data.municipio,
                data.uf
            ].filter(Boolean).join(", ")

            setValue("endereco", enderecoCompleto)

            toast.success("Dados da empresa carregados com sucesso!")
        } catch (error) {
            console.error('Erro ao buscar dados da empresa:', error);
            toast.error("Não foi possível carregar os dados da empresa. Tente preencher manualmente.")
        } finally {
            setLoadingCNPJ(false);
        }
    };

    const onSubmit = async (data: EmpresaInput) => {
        if (!user?.workspace_id || !user?.id) {
            toast.error("Você precisa estar autenticado e em um workspace")
            return
        }

        setIsLoading(true)
        try {
            await empresaService.create(data, user.workspace_id, user.id)
            toast.success("Empresa criada com sucesso!")
            navigate("/app/empresas")
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Erro ao criar empresa")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <Button
                    variant="ghost"
                    className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
                    onClick={() => navigate("/app/empresas")}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para Lista
                </Button>
                <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Nova Empresa
                </h2>
                <p className="text-muted-foreground">
                    Cadastre uma nova empresa para gerenciar suas obras
                </p>
            </div>

            <div className=" mx-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados da Empresa</CardTitle>
                            <CardDescription>
                                Preencha os dados abaixo para cadastrar a empresa.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <Controller
                                        control={control}
                                        name="cnpj"
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <IMaskInput
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                mask="00.000.000/0000-00"
                                                placeholder="00.000.000/0000-00"
                                                inputRef={ref}
                                                value={value as string}
                                                onAccept={(value: any) => onChange(value)}
                                                onBlur={onBlur}
                                            />
                                        )}
                                    />

                                    {errors.cnpj && (
                                        <span className="text-xs text-red-500">{errors.cnpj.message}</span>
                                    )}

                                    <Button
                                        type="button"
                                        onClick={fetchCompanyData}
                                        disabled={loadingCNPJ}
                                    >
                                        {loadingCNPJ ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            "Consultar"
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome <span className="text-red-500">*</span></Label>
                                <Input
                                    id="nome"
                                    placeholder="Ex: Construtora Silva"
                                    {...register("nome")}
                                />
                                {errors.nome && (
                                    <span className="text-xs text-red-500">{errors.nome.message}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="contato@empresa.com"
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <span className="text-xs text-red-500">{errors.email.message}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone</Label>
                                    <Input
                                        id="telefone"
                                        placeholder="(00) 00000-0000"
                                        {...register("telefone")}
                                    />
                                    {errors.telefone && (
                                        <span className="text-xs text-red-500">{errors.telefone.message}</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input
                                    id="endereco"
                                    placeholder="Rua, Número, Bairro, Cidade - UF"
                                    {...register("endereco")}
                                />
                                {errors.endereco && (
                                    <span className="text-xs text-red-500">
                                        {errors.endereco.message}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/app/empresas")}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Empresa
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </DashboardLayout>
    )
}