import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CategoryPill = ({ 
  category, 
  isActive = false, 
  onClick, 
  showCount = false,
  className 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category.name);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={cn(
        "category-pill flex items-center gap-2 transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm",
        className
      )}
    >
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: isActive ? "white" : category.color }}
      />
      <span className="font-medium">{category.name}</span>
      {showCount && (
        <span className={cn(
          "px-1.5 py-0.5 rounded-full text-xs font-semibold min-w-[20px] text-center",
          isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
        )}>
          {category.taskCount}
        </span>
      )}
    </motion.button>
  );
};

export default CategoryPill;