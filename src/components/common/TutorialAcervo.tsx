import { useEffect, useState } from "react"
import Joyride, { STATUS, type CallBackProps, type Step } from "react-joyride"
import { useTheme } from "@/components/providers/ThemeProvider"

export function TutorialAcervo() {
    const [run, setRun] = useState(false)
    const { theme } = useTheme()

    const steps: Step[] = [
        {
            target: "#acervos-header",
            content: "Gerencie seus Acervos Técnicos. Aqui você tem o controle de todos os seus registros de responsabilidade técnica.",
            disableBeacon: true,
        },
        {
            target: "#new-acervo-btn",
            content: "Clique aqui para registrar um novo Acervo Técnico. Mantenha seu portfólio sempre atualizado.",
        },
        {
            target: "#acervos-filters",
            content: "Utilize os filtros para localizar rapidamente um acervo específico pelo número da ART, contrato ou descrição.",
        },
        {
            target: "#acervos-table",
            content: "Visualize seus acervos, acesse os detalhes, edite informações ou visualize o arquivo CAT quando disponível.",
        },
    ]

    useEffect(() => {
        const tutorialCompleted = localStorage.getItem("tutorial_acervos_completed")
        if (!tutorialCompleted) {
            setRun(true)
        }
    }, [])

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

        if (finishedStatuses.includes(status)) {
            setRun(false)
            localStorage.setItem("tutorial_acervos_completed", "true")
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
