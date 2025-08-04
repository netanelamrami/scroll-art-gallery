import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-toast-bg group-[.toaster]:text-toast-foreground group-[.toaster]:border-toast-border group-[.toaster]:shadow-toast group-[.toaster]:backdrop-blur-md group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:min-h-[48px] group-[.toaster]:py-3 group-[.toaster]:px-4",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:leading-relaxed",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-colors group-[.toast]:hover:bg-primary/90",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-colors group-[.toast]:hover:bg-muted/80",
          title: "group-[.toast]:text-toast-foreground group-[.toast]:font-semibold group-[.toast]:text-sm group-[.toast]:leading-none",
          closeButton: "group-[.toast]:bg-transparent group-[.toast]:border-0 group-[.toast]:text-muted-foreground/60 group-[.toast]:hover:text-muted-foreground group-[.toast]:transition-colors",
          success: "group-[.toaster]:bg-toast-success/10 group-[.toaster]:text-toast-success group-[.toaster]:border-toast-success/20 group-[.toaster]:shadow-toast-colored",
          error: "group-[.toaster]:bg-toast-error/10 group-[.toaster]:text-toast-error group-[.toaster]:border-toast-error/20 group-[.toaster]:shadow-toast-colored",
          warning: "group-[.toaster]:bg-toast-warning/10 group-[.toaster]:text-toast-warning group-[.toaster]:border-toast-warning/20 group-[.toaster]:shadow-toast-colored",
          info: "group-[.toaster]:bg-toast-info/10 group-[.toaster]:text-toast-info group-[.toaster]:border-toast-info/20 group-[.toaster]:shadow-toast-colored",
        },
      }}
      position="bottom-right"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      {...props}
    />
  )
}

export { Toaster, toast }
