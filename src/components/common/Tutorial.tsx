import { useEffect, useState } from "react"
import Joyride, { STATUS, type CallBackProps, type Step } from "react-joyride"
import { useTheme } from "@/components/providers/ThemeProvider"

export function Tutorial() {
  const [run, setRun] = useState(false)
  const { theme } = useTheme()

  const steps: Step[] = [
    {
      target: "#dashboard-title",
      content: "Bem-vindo ao Dashboard! Aqui você tem uma visão geral de todas as suas obras e acervos.",
      disableBeacon: true,
    },
    {
      target: "#metric-obras",
      content: "Acompanhe o total de obras cadastradas e a evolução em relação ao mês anterior.",
    },
    {
      target: "#metric-acervos",
      content: "Gerencie seus acervos técnicos e fique de olho no crescimento do seu portfólio.",
    },
    {
      target: "#metric-cats",
      content: "Monitore quantos acervos já possuem a Certidão de Acervo Técnico (CAT) registrada.",
    },
    {
      target: "#metric-valor",
      content: "Visualize o valor total executado em suas obras e o desempenho financeiro.",
    },
    {
      target: "#recent-obras",
      content: "Acesse rapidamente suas obras mais recentes para continuar trabalhando de onde parou.",
    },
    {
      target: "#recent-acervos",
      content: "Veja seus últimos acervos técnicos atualizados.",
    },
    {
      target: "#quick-actions",
      content: "Use as ações rápidas para cadastrar novas obras, acervos ou empresas com um clique.",
    },
  ]

  useEffect(() => {
    const tutorialCompleted = localStorage.getItem("tutorial_completed")
    if (!tutorialCompleted) {
      setRun(true)
    }
  }, [])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      setRun(false)
      localStorage.setItem("tutorial_completed", "true")
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
          primaryColor: "#000", // Will be overridden by style prop below for dynamic colors
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
