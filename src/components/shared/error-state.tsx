import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content right now. Please try again in a moment.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50/50 px-6 py-16 text-center ${className ?? ""}`}
    >
      <AlertCircle className="h-10 w-10 text-red-600" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}