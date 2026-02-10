import { useEffect, useState } from "react"
import Joyride, { STATUS, type CallBackProps, type Step } from "react-joyride"
import { useTheme } from "@/components/providers/ThemeProvider"

export function TutorialObra() {
    const [run, setRun] = useState(false)
    const { theme } = useTheme()

    const steps: Step[] = [
        {
            target: "#obra",
            content: "Aqui você gerencia todas as suas obras. Visualize, edite e acompanhe o progresso de cada projeto.",
            disableBeacon: true,
        },
        {
            target: "#nova-obra",
            content: "Clique aqui para cadastrar uma nova obra. Você precisará preencher as informações básicas do projeto.",
        },
        {
            target: "#obras-filters",
            content: "Use os filtros para encontrar obras específicas por nome, status ou data de criação.",
        },
        {
            target: "#obras-table",
            content: "Nesta tabela você vê a lista completa de suas obras. Clique em uma obra para ver mais detalhes ou use as ações para editar/excluir.",
        },
    ]

    useEffect(() => {
        const tutorialCompleted = localStorage.getItem("tutorial_obras_completed")
        if (!tutorialCompleted) {
            setRun(true)
        }
    }, [])

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

        if (finishedStatuses.includes(status)) {
            setRun(false)
            localStorage.setItem("tutorial_obras_completed", "true")
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
