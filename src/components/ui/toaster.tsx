import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useLanguage } from "@/hooks/useLanguage";

export function Toaster() {
  const { toasts } = useToast()
  const { t, language } = useLanguage();

  return (
    <div   dir={language === 'he' ? 'rtl' : 'ltr'}>

    <ToastProvider >
      {toasts.map(function ({ id, title, description, action,open, ...props }) {
        return (
          <Toast key={id} open={open ?? true} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
      </div>
  )
}
