import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const QuickAddTask = ({ onAdd, categories = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      description: "",
      category,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    };

    onAdd(newTask);
    
    // Reset form
    setTitle("");
    setCategory("Work");
    setPriority("medium");
    setDueDate("");
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle("");
    setCategory("Work");
    setPriority("medium");
    setDueDate("");
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(true)}
        className="w-full p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-dashed border-primary-300 rounded-lg text-primary-700 hover:from-primary-100 hover:to-primary-200 hover:border-primary-400 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <ApperIcon name="Plus" className="w-5 h-5" />
        <span className="font-medium">Add new task</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="bg-white border-2 border-primary-200 rounded-lg p-4 shadow-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="text-lg font-medium"
            autoFocus
          />
        </div>

        {/* Quick Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.Id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" className="flex-1">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default QuickAddTask;