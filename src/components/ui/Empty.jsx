import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  type = "tasks", 
  message = "No items found", 
  description = "Get started by creating your first item",
  actionLabel = "Add New",
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case "tasks":
        return "CheckSquare";
      case "search":
        return "Search";
      case "filter":
        return "Filter";
      default:
        return "Inbox";
    }
  };

  const getEmptyMessage = () => {
    switch (type) {
      case "tasks":
        return "No tasks yet";
      case "search":
        return "No tasks found";
      case "filter":
        return "No tasks match your filter";
      case "completed":
        return "No completed tasks";
      case "overdue":
        return "No overdue tasks";
      default:
        return message;
    }
  };

  const getEmptyDescription = () => {
    switch (type) {
      case "tasks":
        return "Start organizing your day by creating your first task";
      case "search":
        return "Try adjusting your search terms or browse all tasks";
      case "filter":
        return "Try selecting a different category or time period";
      case "completed":
        return "Completed tasks will appear here once you finish them";
      case "overdue":
        return "Great! You're staying on top of your deadlines";
      default:
        return description;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={getIcon()} className="w-10 h-10 text-primary-600" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{getEmptyMessage()}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{getEmptyDescription()}</p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;