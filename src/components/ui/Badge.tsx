import { cn } from "../../utils/cn";

const styles: Record<string, string> = {
  funded: "bg-emerald-100 text-emerald-700",
  in_progress: "bg-blue-100 text-blue-700",
  open: "bg-amber-100 text-amber-700",
  completed: "bg-gray-100 text-gray-600",
  disputed: "bg-red-100 text-red-700",
  pending: "bg-orange-100 text-orange-700",
  accepted: "bg-teal-100 text-teal-700",
  rejected: "bg-gray-100 text-gray-400",
  draft: "bg-gray-100 text-gray-500",
  complete_requested: "bg-purple-100 text-purple-700",
  withdrawn: "bg-gray-100 text-gray-400",
  paid: "bg-emerald-100 text-emerald-700",
  held: "bg-blue-100 text-blue-700",
};

const labels: Record<string, string> = {
  in_progress: "In Progress",
  open: "Open for Quotes",
  funded: "Funded",
  completed: "Completed",
  disputed: "Disputed",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Not Selected",
  draft: "Draft",
  complete_requested: "Completion Requested",
  withdrawn: "Withdrawn",
  paid: "Paid",
  held: "In Escrow",
};

interface Props {
  status: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const sizes = {
  xs: "px-2 py-0.5 text-[10px]",
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export default function Badge({ status, size = "sm", className }: Props) {
  const style = styles[status] ?? "bg-gray-100 text-gray-500";
  return (
    <span
      className={cn(
        "rounded-full font-semibold inline-flex items-center",
        style,
        sizes[size],
        className
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
