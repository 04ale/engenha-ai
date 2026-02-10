import { useEffect, useState } from "react"
import Joyride, { STATUS, type CallBackProps, type Step } from "react-joyride"
import { useTheme } from "@/components/providers/ThemeProvider"

export function TutorialNovoAcervo() {
    const [run, setRun] = useState(false)
    const { theme } = useTheme()

    const steps: Step[] = [
        {
            target: "#novo-acervo-title",
            content: "Bem-vindo ao cadastro de Novo Acervo Técnico. Aqui você registrará seus atestados de capacidade técnica.",
            disableBeacon: true,
        },
        {
            target: "#step-form-progress",
            content: "Acompanhe o progresso do cadastro. O processo é dividido em etapas para organizar as informações.",
        },
        {
            target: "#stepper-step-0",
            content: "Comece vinculando o acervo a uma obra já cadastrada, se houver. Isso facilita o preenchimento dos dados.",
        },
        {
            target: "#stepper-step-1",
            content: "Em Informações Básicas, você descreverá o acervo, seu tipo, nome fantasia e outras observações.",
        },
        {
            target: "#stepper-step-2",
            content: "Na etapa de Localização, confirme ou edite o endereço onde o serviço foi realizado.",
        },
        {
            target: "#stepper-step-3",
            content: "Em Informações da ART, preencha os dados da Anotação de Responsabilidade Técnica vinculada.",
        },
        {
            target: "#stepper-step-4",
            content: "Faça o upload do arquivo CAT (Certidão de Acervo Técnico) digitalizado nesta etapa.",
        },
        {
            target: "#stepper-step-5",
            content: "Adicione os itens que compõem o acervo, detalhando quantidades e serviços executados.",
        },
        {
            target: "#stepper-step-6",
            content: "Por fim, em Datas e Informações Adicionais, registre o período de execução e dados do contratante.",
        },
        {
            target: "#step-form-navigation",
            content: "Use estes botões para avançar ou voltar entre as etapas do cadastro.",
        },
    ]

    useEffect(() => {
        const tutorialCompleted = localStorage.getItem("tutorial_novo_acervo_completed")
        if (!tutorialCompleted) {
            setRun(true)
        }
    }, [])

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

        if (finishedStatuses.includes(status)) {
            setRun(false)
            localStorage.setItem("tutorial_novo_acervo_completed", "true")
        }
    }

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: "#000",
                    zIndex: 1000,
                    arrowColor: isDark ? "#1f2937" : "#fff",
                    backgroundColor: isDark ? "#1f2937" : "#fff",
                    textColor: isDark ? "#f3f4f6" : "#1f2937",
                    overlayColor: "rgba(0, 0, 0, 0.5)",
                },
                buttonNext: {
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 1rem",
                    outline: "none",
                },
                buttonBack: {
                    color: isDark ? "#9ca3af" : "#6b7280",
                    marginRight: "0.5rem",
                },
                buttonSkip: {
                    color: isDark ? "#9ca3af" : "#6b7280",
                },
                tooltip: {
                    borderRadius: "0.5rem",
                },
            }}
            locale={{
                back: "Voltar",
                close: "Fechar",
                last: "Concluir",
                next: "Próximo",
                skip: "Pular",
            }}
        />
    )
}
