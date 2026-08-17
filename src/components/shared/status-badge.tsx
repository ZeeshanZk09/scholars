import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

const STATUS_VARIANTS: Record<
  string,
  "success" | "warning" | "info" | "secondary" | "destructive"
> = {
  OPEN: "success",
  PUBLISHED: "success",
  ACTIVE: "success",
  SUCCESS: "success",
  COMPLETED: "success",
  CLOSED: "secondary",
  DRAFT: "secondary",
  INACTIVE: "secondary",
  ARCHIVED: "secondary",
  COMING_SOON: "warning",
  PENDING: "warning",
  SCHEDULED: "warning",
  NEW: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  CONTACTED: "info",
  SUSPENDED: "destructive",
};

function toLabel(status: string): string {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function StatusBadge({ status, className }: Readonly<StatusBadgeProps>) {
  const variant = STATUS_VARIANTS[status.toUpperCase()] ?? "secondary";

  return (
    <Badge variant={variant} className={className}>
      {toLabel(status)}
    </Badge>
  );
}
