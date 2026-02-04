import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Camera, Mail, User, FileBadge, Phone, ArrowLeftRight } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { authService } from "@/services/authService"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserProfilePage() {
    const { user, refreshUser } = useAuth() // Podemos usar login ou checkUser se expormos algo para recarregar o usuario
    const [isLoading, setIsLoading] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nome_completo: "",
            crea: "",
            telefone: "",
            avatar_url: "",
            avatar_nome: "",
        },
    })

    // Carregar dados iniciais
    useEffect(() => {
        if (user) {
            form.reset({
                nome_completo: user.nome_completo || "",
                crea: user.crea || "",
                telefone: user.telefone || "",
                avatar_url: user.avatar_url || "",
                avatar_nome: user.avatar_nome || "",
            })
            if (user.avatar_url) {
                setAvatarPreview(user.avatar_url)
            }
        }
    }, [user, form])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        setUploadingAvatar(true)
        try {
            const { url, nome, error } = await authService.uploadAvatar(user.id, file)

            if (error) throw new Error(error)

            if (url && nome) {
                setAvatarPreview(url)
                form.setValue("avatar_url", url)
                form.setValue("avatar_nome", nome)
                toast.success("Imagem carregada! Clique em Salvar para persistir as alterações.")
            }
        } catch (error: any) {
            toast.error("Erro ao fazer upload da imagem.")
        } finally {
            setUploadingAvatar(false)
        }
    }

    const onSubmit = async (data: ProfileInput) => {
        if (!user) return

        setIsLoading(true)
        try {
            const { user: updatedUser, error } = await authService.updateProfile(user.id, data)

            if (error) {
                throw new Error(error)
            }

            if (updatedUser) {
                toast.success("Perfil atualizado com sucesso!")
                // Aqui seria ideal atualizar o contexto com o novo usuário.
                // Como o AuthContext não expõe um setUser publico, podemos forçar um reload ou esperar que a navegação cuide disso.
                // Mas o ideal é que o authService.updateProfile já atualize o localStorage
                // E podemos recarregar a pagina para refletir em todo o app se necessário, ou melhor, o AuthContext deveria ter um metodo updateLocalUser.
                // Por hora, vamos recarregar a página para garantir.
                await refreshUser() // Atualiza o contexto sem reload
                setIsEditing(false) // Sai do modo de edição
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao atualizar perfil")
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const handleDeleteAvatar = async () => {
        if (!user) return

        toast("Remover foto de perfil?", {
            description: "Tem certeza que deseja remover sua foto? Essa ação não pode ser desfeita.",
            position: "top-center",
            action: {
                label: "Excluir",
                onClick: async () => {
                    setIsLoading(true)
                    try {
                        // Se tiver um nome de arquivo salvo, passamos ele. Se não, passamos string vazia (o serviço lida)
                        const { error } = await authService.deleteAvatar(user.id, user.avatar_nome || "")

                        if (error) throw new Error(error)

                        toast.success("Foto removida com sucesso!")
                        setAvatarPreview(null)
                        form.setValue("avatar_url", "")
                        form.setValue("avatar_nome", "")
                        await refreshUser()
                    } catch (error) {
                        toast.error("Erro ao remover foto.")
                    } finally {
                        setIsLoading(false)
                    }
                }
            },
            cancel: {
                label: "Cancelar",
                onClick: () => { }
            },
        })
    }

    const handleSaveAvatar = async () => {
        if (!user) return

        setIsLoading(true)
        try {
            const currentData = form.getValues()
            const { user: updatedUser, error } = await authService.updateProfile(user.id, {
                ...currentData,
                avatar_url: avatarPreview || "", // Use the preview URL which is the new one
                avatar_nome: form.getValues("avatar_nome")
            })

            if (error) throw new Error(error)

            if (updatedUser) {
                toast.success("Foto de perfil atualizada!")
                await refreshUser()
            }
        } catch (error) {
            toast.error("Erro ao salvar foto.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleTogglePublic = async () => {
        if (!user) return

        setIsLoading(true)
        try {
            const newStatus = !user.is_public
            const { error } = await authService.updatePublicStatus(user.id, newStatus)

            if (error) throw new Error(error)

            toast.success(newStatus ? "Perfil agora é público!" : "Perfil agora é privado!")
            await refreshUser()
        } catch (error) {
            toast.error("Erro ao atualizar visibilidade.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Meu perfil
                    </h2>
                    <p className="text-muted-foreground">
                        Visualize e atualize suas informações pessoais.
                    </p>
                </div>
                <Button
                    className="shadow-md"
                    variant={user.is_public ? "outline" : "default"}
                    onClick={handleTogglePublic}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <ArrowLeftRight className="h-4 w-4 mr-2" />
                    )}
                    {user.is_public ? "Tornar privado" : "Tornar público"}
                </Button>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{user.nome_completo}</CardTitle>
                    <div className="flex flex-row items-center gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteAvatar}
                            disabled={isLoading || (!user.avatar_url && !avatarPreview)}
                            className="mt-2 animate-in fade-in slide-in-from-top-2 max-w-[200px]"
                        >
                            Excluir foto
                        </Button>
                        {avatarPreview && avatarPreview !== user.avatar_url && (
                            <Button
                                onClick={handleSaveAvatar}
                                disabled={isLoading || uploadingAvatar}
                                size="sm"
                                className="mt-2 animate-in fade-in slide-in-from-top-2 max-w-[200px]"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Salvar foto nova
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center mb-8 gap-4">
                        <div className="relative group">
                            <Avatar className="w-32 h-32 border-4 border-background shadow-xl ring-2 ring-muted transition-all duration-300 group-hover:ring-primary">
                                {user.avatar_url || avatarPreview ?
                                    (<AvatarImage
                                        src={avatarPreview || undefined}
                                        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                                    />)
                                    : <AvatarFallback className="text-4xl bg-muted">
                                        {user.nome_completo?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                }</Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-1 right-1 p-2.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-lg hover:scale-110 active:scale-95"
                            >
                                {uploadingAvatar ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Camera className="w-5 h-5" />
                                )}
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploadingAvatar}
                                />
                            </label>
                        </div>
                        <div className="text-center space-y-1 flex flex-col items-center">
                            <h3 className="font-semibold text-lg">{user.nome_completo || "Usuário"}</h3>
                            <p className="text-sm text-muted-foreground">
                                Clique na câmera para alterar sua foto
                            </p>

                        </div>
                    </div>

                    {isEditing ? (<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Campo Email (Somente Leitura) */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted/50"
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Somente leitura
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nome_completo" className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    Nome Completo
                                </Label>
                                <Input
                                    id="nome_completo"
                                    {...form.register("nome_completo")}
                                    placeholder="Seu nome completo"
                                    className="focus-visible:ring-primary"
                                />
                                {form.formState.errors.nome_completo && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.nome_completo.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="crea" className="flex items-center gap-2">
                                    <FileBadge className="w-4 h-4 text-muted-foreground" />
                                    CREA
                                </Label>
                                <Input
                                    id="crea"
                                    {...form.register("crea")}
                                    placeholder="Seu número do CREA"
                                    className="focus-visible:ring-primary"
                                />
                                {form.formState.errors.crea && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.crea.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telefone" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    Telefone
                                </Label>
                                <Input
                                    id="telefone"
                                    {...form.register("telefone")}
                                    placeholder="(00) 00000-0000"
                                    className="focus-visible:ring-primary"
                                />
                                {form.formState.errors.telefone && (
                                    <p className="text-sm text-destructive">
                                        {form.formState.errors.telefone.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <Button variant="outline" type="button" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                Voltar
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Alterações
                            </Button>

                        </div>
                    </form>) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email-view" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        Email
                                    </Label>
                                    <Input
                                        id="email-view"
                                        value={user.email}
                                        disabled
                                        className="bg-muted/50 opacity-100 cursor-default text-foreground border-transparent shadow-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="crea-view" className="flex items-center gap-2">
                                        <FileBadge className="w-4 h-4 text-muted-foreground" />
                                        CREA
                                    </Label>
                                    <Input
                                        id="crea-view"
                                        value={user.crea || ""}
                                        disabled
                                        className="bg-muted/50 opacity-100 cursor-default text-foreground border-transparent shadow-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nome-view" className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        Privacidade
                                    </Label>
                                    <Input
                                        id="nome-view"
                                        value={user.is_public ? "Público" : "Privado"}
                                        disabled
                                        className="bg-muted/50 opacity-100 cursor-default text-foreground border-transparent shadow-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefone-view" className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        Telefone
                                    </Label>

                                    <Input
                                        id="telefone-view"
                                        value={user.telefone || "Telefone não informado"}
                                        disabled
                                        className="bg-muted/50 opacity-100 cursor-default text-foreground border-transparent shadow-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t">
                                <Button type="button" onClick={() => setIsEditing(true)} disabled={isLoading} className="w-full sm:w-auto">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Editar Perfil
                                </Button>
                            </div>
                        </div>
                    )}


                </CardContent>
            </Card>
        </DashboardLayout >
    )
}
