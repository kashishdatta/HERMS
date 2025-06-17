import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case "available":
        return {
          variant: "default" as const,
          className: "bg-success/10 text-success border-success/20",
          text: "Available",
        };
      case "rented":
        return {
          variant: "default" as const,
          className: "bg-warning/10 text-warning border-warning/20",
          text: "Rented",
        };
      case "under maintenance":
        return {
          variant: "default" as const,
          className: "bg-error/10 text-error border-error/20",
          text: "Under Maintenance",
        };
      case "active":
        return {
          variant: "default" as const,
          className: "bg-success/10 text-success border-success/20",
          text: "Active",
        };
      case "pending":
        return {
          variant: "default" as const,
          className: "bg-warning/10 text-warning border-warning/20",
          text: "Pending",
        };
      case "in progress":
        return {
          variant: "default" as const,
          className: "bg-blue-100 text-blue-800 border-blue-200",
          text: "In Progress",
        };
      case "completed":
        return {
          variant: "default" as const,
          className: "bg-success/10 text-success border-success/20",
          text: "Completed",
        };
      case "returned":
        return {
          variant: "default" as const,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          text: "Returned",
        };
      case "overdue":
        return {
          variant: "default" as const,
          className: "bg-red-100 text-red-800 border-red-200",
          text: "Overdue",
        };
      case "due today":
        return {
          variant: "default" as const,
          className: "bg-orange-100 text-orange-800 border-orange-200",
          text: "Due Today",
        };
      default:
        return {
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          text: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.text}
    </Badge>
  );
}
