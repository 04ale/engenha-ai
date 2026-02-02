import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownMenuProps {
  children: React.ReactNode
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DropdownMenu = ({
  children,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest("[data-dropdown-menu]")) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  return (
    <div className="relative" data-dropdown-menu>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        // O alinhamento real acontece aqui na div que envolve o children
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border border-border z-50">
          {children}
        </div>
      )}
    </div>
  )
}

// 1. Criamos a interface para aceitar 'align'
export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = "start", ...props }, ref) => (
    <div
      ref={ref}
      // 2. Você pode usar a prop 'align' para aplicar classes de CSS se desejar
      className={cn("py-1", className)}
      {...props}
    />
  )
)
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem }