import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Camera, Mail, User, FileBadge, Phone, ArrowLeftRight } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { authService } from "@/services/authService"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ibgeService, type IBGEUF, type IBGEMunicipio } from "@/services/ibgeService"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Trash2, Plus, MapPin } from "lucide-react"
import { cpf as cpfValidator } from "cpf-cnpj-validator"
import ChangePasswordForm from "@/components/forms/ChangePasswordForm"
import { Skeleton } from "@/components/ui/skeleton"

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
            cpf: "",
            endereco: "",
            avatar_url: "",
            avatar_nome: "",
        },
    })

    // Manage email separately since it's not in profileSchema
    const [emailInput, setEmailInput] = useState("")

    // Carregar dados iniciais
    useEffect(() => {
        if (user) {
            form.reset({
                nome_completo: user.nome_completo || "",
                crea: user.crea || "",
                telefone: user.telefone || "",
                cpf: user.cpf || "",
                endereco: user.endereco || "",
                avatar_url: user.avatar_url || "",
                avatar_nome: user.avatar_nome || "",
            })
            setEmailInput(user.email)
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
            // 1. Update Profile
            const { user: updatedUser, error } = await authService.updateProfile(user.id, data)

            if (error) {
                throw new Error(error)
            }

            // 2. Check if email changed
            if (emailInput && emailInput !== user.email) {
                const { error: emailError } = await authService.updateEmail(emailInput)
                if (emailError) {
                    toast.error(`Perfil salvo, mas erro ao atualizar email: ${emailError}`)
                } else {
                    toast.success("Perfil salvo! Verifique seu novo email para confirmar a alteração.")
                }
            } else if (updatedUser) {
                toast.success("Perfil atualizado com sucesso!")
            }

            if (updatedUser) {
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
            <DashboardLayout>
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Skeleton className="h-9 w-48 mb-2" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-9 w-32" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center mb-8 gap-4">
                                <Skeleton className="w-32 h-32 rounded-full" />
                                <div className="space-y-2 flex flex-col items-center w-full">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-24 bg-muted/20 rounded-lg" />
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
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

    // --- MFA STATES ---
    const [isMfaModalOpen, setIsMfaModalOpen] = useState(false)
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
    const [mfaData, setMfaData] = useState<{ id: string, secret: string, qr_code: string } | null>(null)
    const [mfaCode, setMfaCode] = useState("")
    const [isMfaEnabled, setIsMfaEnabled] = useState(false)
    const [mfaFactors, setMfaFactors] = useState<any[]>([])

    // Check MFA Status on Load
    useEffect(() => {
        const checkMfa = async () => {
            if (!user) return
            const { isEnabled, factors } = await authService.getMFAStatus()
            setIsMfaEnabled(isEnabled)
            setMfaFactors(factors)
        }
        checkMfa()
    }, [user])

    // --- LOCATION STATES ---
    const [locaisAtuacao, setLocaisAtuacao] = useState<{ uf: string, cidades: string[] }[]>([])
    const [estados, setEstados] = useState<IBGEUF[]>([])
    const [municipios, setMunicipios] = useState<IBGEMunicipio[]>([])
    const [selectedUF, setSelectedUF] = useState<string>("")
    const [selectedCidade, setSelectedCidade] = useState<string>("")
    const [loadingLocations, setLoadingLocations] = useState(false)

    // Load Initial Data
    useEffect(() => {
        ibgeService.getEstados().then(setEstados)
    }, [])

    useEffect(() => {
        if (user) {
            authService.getEngineerLocations(user.id).then(({ locais }) => {
                // Ensure data structure is correct (array of { uf, cidades })
                if (Array.isArray(locais)) {
                    setLocaisAtuacao(locais)
                }
            })
        }
    }, [user])

    useEffect(() => {
        if (selectedUF) {
            setMunicipios([])
            ibgeService.getMunicipios(selectedUF).then(setMunicipios)
        } else {
            setMunicipios([])
        }
    }, [selectedUF])

    const handleAddLocation = () => {
        if (!selectedUF) return

        setLocaisAtuacao(prev => {
            const newLocais = [...prev]
            const existingUFIndex = newLocais.findIndex(l => l.uf === selectedUF)

            if (existingUFIndex >= 0) {
                // State already exists
                if (selectedCidade) {
                    // Check if city exists
                    if (!newLocais[existingUFIndex].cidades.includes(selectedCidade)) {
                        newLocais[existingUFIndex].cidades.push(selectedCidade)
                    } else {
                        toast.warning("Cidade já adicionada.")
                    }
                } else {
                    // Maybe user wants to add 'All State'? For now let's just ignore empty city selection 
                    // unless we implement "Whole State" logic. 
                    // Let's assume selecting just UF means nothing for now or handle explicitly.
                    // If user selects specific cities, they select city.
                }
            } else {
                // New State
                if (selectedCidade) {
                    newLocais.push({ uf: selectedUF, cidades: [selectedCidade] })
                }
            }
            return newLocais
        })
        setSelectedCidade("") // Reset city but keep state for faster addition
    }

    const handleRemoveCity = (uf: string, cidade: string) => {
        setLocaisAtuacao(prev => {
            return prev.map(item => {
                if (item.uf === uf) {
                    return { ...item, cidades: item.cidades.filter(c => c !== cidade) }
                }
                return item
            }).filter(item => item.cidades.length > 0) // Remove entry if no cities left
        })
    }

    const handleRemoveState = (uf: string) => {
        setLocaisAtuacao(prev => prev.filter(item => item.uf !== uf))
    }

    const handleSaveLocations = async () => {
        if (!user) return
        setLoadingLocations(true)
        try {
            const { error } = await authService.updateEngineerLocations(user.id, locaisAtuacao)
            if (error) throw new Error(error)
            toast.success("Locais de atuação atualizados!")
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar locais.")
        } finally {
            setLoadingLocations(false)
        }
    }

    const handleEnableMfa = async () => {
        setIsLoading(true)
        try {
            const { id, totp, error } = await authService.mfaEnroll()
            if (error) throw new Error(error)

            setMfaData({ id, secret: totp.secret, qr_code: totp.qr_code })
            setIsMfaModalOpen(true)
        } catch (error: any) {
            toast.error(error.message || "Erro ao iniciar configuração de 2FA")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyMfaDetails = async () => {
        if (!mfaData || !mfaCode) return

        setIsLoading(true)
        try {
            const { error } = await authService.mfaChallengeAndVerify(mfaData.id, mfaCode)
            if (error) throw new Error(error)

            toast.success("Autenticação de dois fatores ativada com sucesso!")
            setIsMfaModalOpen(false)
            setMfaData(null)
            setMfaCode("")
            setIsMfaEnabled(true)
            // Refresh factors
            const { factors } = await authService.getMFAStatus()
            setMfaFactors(factors)
        } catch (error: any) {
            toast.error(error.message || "Código inválido. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    const [isMfaVerificationOpen, setIsMfaVerificationOpen] = useState(false)

    const handleMfaVerification = async () => {
        setIsLoading(true)
        try {
            // Get verified factors first, or just list all
            const { factors } = await authService.getMFAStatus()
            const factor = factors.find(f => f.status === 'verified')

            if (!factor) {
                throw new Error("Nenhum fator MFA encontrado.")
            }

            const { error } = await authService.mfaChallengeAndVerify(factor.id, mfaCode)

            if (error) throw new Error(error)

            toast.success("Verificação concluída! Você pode alterar sua senha agora.")
            setIsMfaVerificationOpen(false)
            setMfaCode("")
            setIsChangePasswordOpen(true)
        } catch (error: any) {
            toast.error(error.message || "Código incorreto.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisableMfa = async () => {
        // Should ideally ask for confirmation
        toast("Desativar 2FA?", {
            description: "Sua conta ficará menos segura.",
            action: {
                label: "Desativar",
                onClick: async () => {
                    setIsLoading(true)
                    try {
                        // Unenroll all TOTP factors for now to be safe, or just the first one
                        // Usually we iterate or unenroll the verified one.
                        const factorToUnenroll = mfaFactors.find(f => f.status === 'verified')
                        if (!factorToUnenroll) return

                        const { error } = await authService.mfaUnenroll(factorToUnenroll.id)
                        if (error) throw new Error(error)

                        toast.success("2FA desativado.")
                        setIsMfaEnabled(false)
                        setMfaFactors([])
                    } catch (err: any) {
                        toast.error(err.message || "Erro ao desativar 2FA")
                    } finally {
                        setIsLoading(false)
                    }
                }
            }
        })
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
            <div className="space-y-6">
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
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="focus-visible:ring-primary"
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Ao alterar, você precisará confirmar o novo email.
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

                                <div className="space-y-2">
                                    <Label htmlFor="cpf" className="flex items-center gap-2">
                                        <FileBadge className="w-4 h-4 text-muted-foreground" />
                                        CPF
                                    </Label>
                                    <Input
                                        id="cpf"
                                        {...form.register("cpf", {
                                            onChange: (e) => {
                                                const formatted = cpfValidator.format(e.target.value);
                                                e.target.value = formatted;
                                                form.setValue("cpf", formatted);
                                            }
                                        })}
                                        placeholder="000.000.000-00"
                                        className="focus-visible:ring-primary"
                                        maxLength={14}
                                    />
                                    {form.formState.errors.cpf && (
                                        <p className="text-sm text-destructive">
                                            {form.formState.errors.cpf.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endereco" className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        Endereço
                                    </Label>
                                    <Input
                                        id="endereco"
                                        {...form.register("endereco")}
                                        placeholder="Seu endereço completo"
                                        className="focus-visible:ring-primary"
                                    />
                                    {form.formState.errors.endereco && (
                                        <p className="text-sm text-destructive">
                                            {form.formState.errors.endereco.message}
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

                                    <div className="space-y-2">
                                        <Label htmlFor="cpf-view" className="flex items-center gap-2">
                                            <FileBadge className="w-4 h-4 text-muted-foreground" />
                                            CPF
                                        </Label>
                                        <Input
                                            id="cpf-view"
                                            value={user.cpf || "CPF não informado"}
                                            disabled
                                            className="bg-muted/50 opacity-100 cursor-default text-foreground border-transparent shadow-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="endereco-view" className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            Endereço
                                        </Label>
                                        <Input
                                            id="endereco-view"
                                            value={user.endereco || "Endereço não informado"}
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

                {/* SECTION LOCATIONS */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Locais de Atuação
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 items-end bg-muted/20 p-4 rounded-lg">
                            <div className="space-y-2 w-full md:w-1/3">
                                <Label>Estado (UF)</Label>
                                <Select
                                    value={selectedUF}
                                    onChange={(e) => { setSelectedUF(e.target.value); setSelectedCidade("") }}
                                >
                                    <option value="" disabled>Selecione o Estado</option>
                                    {estados.map(uf => (
                                        <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
                                    ))}
                                </Select>
                            </div>
                            <div className="space-y-2 w-full md:w-1/3">
                                <Label>Cidade</Label>
                                <Select
                                    value={selectedCidade}
                                    onChange={(e) => setSelectedCidade(e.target.value)}
                                    disabled={!selectedUF}
                                >
                                    <option value="" disabled>Selecione a Cidade</option>
                                    {municipios.map(mun => (
                                        <option key={mun.id} value={mun.nome}>{mun.nome}</option>
                                    ))}
                                </Select>
                            </div>
                            <Button onClick={handleAddLocation} disabled={!selectedCidade} className="w-full md:w-auto">
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <Label>Locais Selecionados</Label>
                            {locaisAtuacao.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">Nenhum local adicionado.</p>
                            )}
                            <div className="grid gap-4">
                                {locaisAtuacao.map((local) => (
                                    <div key={local.uf} className="border rounded-lg p-3 relative bg-card">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-lg">{local.uf}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveState(local.uf)}
                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {local.cidades.map(cidade => (
                                                <Badge key={cidade} variant="secondary" className="flex items-center gap-1">
                                                    {cidade}
                                                    <button
                                                        onClick={() => handleRemoveCity(local.uf, cidade)}
                                                        className="ml-1 hover:text-destructive focus:outline-none"
                                                    >
                                                        &times;
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button onClick={handleSaveLocations} disabled={loadingLocations} className="bg-primary shadow-lg shadow-primary/20">
                                {loadingLocations && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Salvar Locais
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION CHANGE PASSWORD */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Segurança da Conta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                            <div className="space-y-1">
                                <h3 className="font-medium">Autenticação de Dois Fatores (2FA)</h3>
                                <p className="text-sm text-muted-foreground">
                                    Adicione uma camada extra de segurança à sua conta.
                                </p>
                            </div>
                            <Button
                                variant={isMfaEnabled ? "destructive" : "default"}
                                onClick={isMfaEnabled ? handleDisableMfa : handleEnableMfa}
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isMfaEnabled ? "Desativar" : "Ativar"}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                            <div className="space-y-1">
                                <h3 className="font-medium">Alterar Senha</h3>
                                <p className="text-sm text-muted-foreground">
                                    Atualize sua senha de acesso.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setIsChangePasswordOpen(true)}
                                disabled={isLoading}
                            >
                                Alterar Senha
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* DIALOG MFA ENROLLMENT */}
            {isMfaModalOpen && mfaData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-primary/20">
                        <CardHeader>
                            <CardTitle>Configurar 2FA</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
                                {mfaData.qr_code.startsWith('data:') ? (
                                    <img src={mfaData.qr_code} alt="QR Code" className="w-48 h-48 rounded-md border bg-white p-2" />
                                ) : (
                                    <div
                                        className="w-48 h-48 rounded-md border bg-white p-2 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                                        dangerouslySetInnerHTML={{ __html: mfaData.qr_code }}
                                    />
                                )}
                                <div className="text-center space-y-1">
                                    <p className="text-xs text-muted-foreground font-mono bg-muted p-1 rounded">
                                        Secret: {mfaData.secret}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Escaneie com seu app autenticador (Google Authenticator, Authy, etc)
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Código de Verificação</Label>
                                <Input
                                    value={mfaCode}
                                    onChange={(e) => setMfaCode(e.target.value)}
                                    placeholder="000000"
                                    className="text-center text-lg tracking-widest"
                                    maxLength={6}
                                />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={() => setIsMfaModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleVerifyMfaDetails} disabled={mfaCode.length < 6 || isLoading}>
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Verificar e Ativar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* DIALOG CHANGE PASSWORD */}
            {isChangePasswordOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-primary/20">
                        <CardHeader>
                            <CardTitle>Alterar Senha</CardTitle>
                            <CardDescription>Digite sua nova senha abaixo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChangePasswordForm
                                onSuccess={() => setIsChangePasswordOpen(false)}
                                onCancel={() => setIsChangePasswordOpen(false)}
                                onMfaRequired={() => {
                                    setIsChangePasswordOpen(false)
                                    setIsMfaVerificationOpen(true)
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* DIALOG MFA VERIFICATION (For AAL2 Upgrade) */}
            {isMfaVerificationOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-primary/20">
                        <CardHeader>
                            <CardTitle>Verificação de Segurança</CardTitle>
                            <CardDescription>Digite o código do seu autenticador para continuar.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Código de 6 dígitos</Label>
                                <Input
                                    value={mfaCode}
                                    onChange={(e) => setMfaCode(e.target.value)}
                                    placeholder="000000"
                                    className="text-center text-lg tracking-widest"
                                    maxLength={6}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={() => {
                                    setIsMfaVerificationOpen(false)
                                    setMfaCode("")
                                }}>Cancelar</Button>
                                <Button onClick={handleMfaVerification} disabled={mfaCode.length < 6 || isLoading}>
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Verificar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

        </DashboardLayout >
    )
}

