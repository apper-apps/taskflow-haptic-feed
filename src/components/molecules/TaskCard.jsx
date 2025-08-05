import { useState } from "react";
import { motion } from "framer-motion";
import { format, isToday, isPast, isFuture } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    await onToggleComplete(task.Id);
    setTimeout(() => setIsCompleting(false), 600);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#3b82f6";
      default: return "#6b7280";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Work": "#5b21b6",
      "Personal": "#059669",
      "Learning": "#dc2626",
      "Health": "#ea580c",
      "Finance": "#0891b2",
      "Shopping": "#7c2d12"
    };
    return colors[category] || "#6b7280";
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    
    if (isToday(date)) {
      return { text: "Today", urgent: true };
    } else if (isPast(date)) {
      return { text: "Overdue", urgent: true, overdue: true };
    } else if (isFuture(date)) {
      return { text: format(date, "MMM d"), urgent: false };
    }
    
    return null;
  };

  const dueDateInfo = formatDueDate(task.dueDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: task.completed ? 0.7 : 1, 
        y: 0,
        scale: isCompleting ? 0.98 : 1
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "task-card relative overflow-hidden",
        task.completed && "opacity-75",
        className
      )}
    >
      {/* Priority Indicator */}
      <div 
        className="priority-indicator absolute left-0 top-0"
        style={{ backgroundColor: getPriorityColor(task.priority) }}
      />
      
      <div className="flex items-start gap-4 pl-3">
        {/* Checkbox */}
        <div className="mt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            className={isCompleting ? "animate-pulse-success" : ""}
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-gray-900 transition-all duration-200",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mt-1 line-clamp-2",
                  task.completed && "text-gray-400"
                )}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors duration-200"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.Id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Task Meta */}
          <div className="flex items-center gap-3 mt-3">
            {/* Category */}
            <div 
              className="category-pill text-xs px-2 py-1"
              style={{ 
                backgroundColor: `${getCategoryColor(task.category)}20`,
                color: getCategoryColor(task.category)
              }}
            >
              {task.category}
            </div>

            {/* Priority */}
            <Badge variant={task.priority} className="text-xs">
              {task.priority}
            </Badge>

            {/* Due Date */}
            {dueDateInfo && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                dueDateInfo.overdue && "text-red-600",
                dueDateInfo.urgent && !dueDateInfo.overdue && "text-amber-600",
                !dueDateInfo.urgent && "text-gray-500"
              )}>
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>{dueDateInfo.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Animation Overlay */}
      {isCompleting && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center bg-green-500/10 rounded-lg"
        >
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <ApperIcon name="Check" className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskCard;