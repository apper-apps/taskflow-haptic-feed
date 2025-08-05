import { cn } from "@/utils/cn";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    primary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
    secondary: "bg-secondary-100 text-secondary-800 hover:bg-secondary-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    error: "bg-red-100 text-red-800 hover:bg-red-200",
    high: "bg-red-100 text-red-800 border-l-4 border-red-500",
    medium: "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500",
    low: "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;