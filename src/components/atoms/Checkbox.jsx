import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ className, checked, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        ref={ref}
        {...props}
      />
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200",
          checked
            ? "bg-gradient-to-br from-primary-600 to-primary-700 border-primary-600 shadow-sm"
            : "border-gray-300 hover:border-gray-400 bg-white",
          className
        )}
        onClick={() => props.onChange && props.onChange({ target: { checked: !checked } })}
      >
        {checked && (
          <ApperIcon 
            name="Check" 
            className="w-3 h-3 text-white animate-checkmark" 
          />
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;