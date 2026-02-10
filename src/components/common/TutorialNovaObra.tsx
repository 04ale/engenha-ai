import { useEffect, useState } from "react"
import Joyride, { STATUS, type CallBackProps, type Step } from "react-joyride"
import { useTheme } from "@/components/providers/ThemeProvider"

export function TutorialNovaObra() {
    const [run, setRun] = useState(false)
    const { theme } = useTheme()

    const steps: Step[] = [
        {
            target: "#nova-obra-title",
            content: "Bem-vindo ao cadastro de Nova Obra. Aqui você iniciará o processo de registro de um novo projeto.",
            disableBeacon: true,
        },
        {
            target: "#step-form-progress",
            content: "Acompanhe o progresso do cadastro através desta barra. O formulário é dividido em etapas para facilitar o preenchimento.",
        },

        {
            target: "#stepper-step-0",
            content: "Nesta etapa inicial, preencha as informações básicas como descrição, finalidade e observações importantes.",
        },
        {
            target: "#stepper-step-1",
            content: "Na etapa de Localização, você informará o endereço completo, cidade e estado onde a obra será realizada.",
        },
        {
            target: "#stepper-step-2",
            content: "Em Datas, defina o cronograma previsto, informando a data de início e a previsão de conclusão.",
        },
        {
            target: "#stepper-step-3",
            content: "Na etapa de Contratante, vincule a empresa ou pessoa responsável pela contratação da obra.",
        },
        {
            target: "#stepper-step-4",
            content: "Por fim, em Valores e Contrato, registre o número do contrato e o valor total do orçamento.",
        },
        {
            target: "#step-form-navigation",
            content: "Utilize estes botões para navegar entre as etapas. Você pode voltar para corrigir informações anteriores antes de finalizar.",
        },
    ]

    useEffect(() => {
        const tutorialCompleted = localStorage.getItem("tutorial_nova_obra_completed")
        if (!tutorialCompleted) {
            setRun(true)
        }
    }, [])

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

        if (finishedStatuses.includes(status)) {
            setRun(false)
            localStorage.setItem("tutorial_nova_obra_completed", "true")
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
