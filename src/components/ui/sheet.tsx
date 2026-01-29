import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const Sheet = ({
  open,
  onOpenChange,
  children,
}: SheetProps) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={() => onOpenChange?.(false)}
    >
      <div className="fixed inset-0 bg-black/50" />
      {children}
    </div>
  )
}

// Criamos uma interface para o Content aceitar o 'side'
export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right" | "top" | "bottom"
  onClose?: () => void
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, children, onClose, side = "left", ...props }, ref) => {

    // As classes de posicionamento agora ficam aqui dentro
    const sideClasses = {
      left: "left-0 top-0 h-full border-r w-64",
      right: "right-0 top-0 h-full border-l w-64",
      top: "top-0 left-0 w-full border-b h-64",
      bottom: "bottom-0 left-0 w-full border-t h-64",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-50 bg-background p-6 shadow-lg transition-transform",
          sideClasses[side],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    )
  }
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = "SheetTitle"

export { Sheet, SheetContent, SheetHeader, SheetTitle }
