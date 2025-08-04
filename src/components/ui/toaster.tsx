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
    <div dir={language === 'he' ? 'rtl' : 'ltr'}>
      <ToastProvider>
        {toasts.map(function ({ id, title, description, action, open, ...props }) {
          return (
            <Toast 
              key={id} 
              open={open ?? true} 
              {...props}
              className="bg-toast-bg border-toast-border shadow-toast backdrop-blur-md rounded-xl min-h-[48px] py-3 px-4 border data-[state=open]:animate-slide-in-from-bottom data-[state=closed]:animate-fade-out data-[swipe=end]:animate-slide-out-right"
            >
              <div className="grid gap-1.5">
                {title && (
                  <ToastTitle className="text-toast-foreground font-semibold text-sm leading-none">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-muted-foreground text-sm leading-relaxed">
                    {description}
                  </ToastDescription>
                )}
              </div>
              {action}
              <ToastClose className="bg-transparent border-0 text-muted-foreground/60 hover:text-muted-foreground transition-colors rounded-md" />
            </Toast>
          )
        })}
        <ToastViewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
      </ToastProvider>
    </div>
  )
}
