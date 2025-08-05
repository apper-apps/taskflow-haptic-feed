import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";

const TaskEditModal = ({ task, isOpen, onClose, onSave, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Work",
    priority: "medium",
    dueDate: "",
    timeEntries: [],
    totalTimeSpent: 0
  });

  const [activeTimer, setActiveTimer] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "Work",
        priority: task.priority || "medium",  
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        timeEntries: task.timeEntries || [],
        totalTimeSpent: task.totalTimeSpent || 0
      });
    }
  }, [task]);

  // Timer effect for real-time updates
  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const startTimer = () => {
    const startTime = Date.now();
    setActiveTimer({ startTime });
  };

  const stopTimer = () => {
    if (activeTimer) {
      const endTime = Date.now();
      const duration = endTime - activeTimer.startTime;
      
      const newEntry = {
        id: Date.now(),
        startTime: activeTimer.startTime,
        endTime: endTime,
        duration: duration
      };

      setFormData(prev => ({
        ...prev,
        timeEntries: [...prev.timeEntries, newEntry],
        totalTimeSpent: prev.totalTimeSpent + duration
      }));

      setActiveTimer(null);
    }
  };

  const removeTimeEntry = (entryId) => {
    setFormData(prev => {
      const entryToRemove = prev.timeEntries.find(entry => entry.id === entryId);
      const newEntries = prev.timeEntries.filter(entry => entry.id !== entryId);
      const newTotal = prev.totalTimeSpent - (entryToRemove?.duration || 0);
      
      return {
        ...prev,
        timeEntries: newEntries,
        totalTimeSpent: Math.max(0, newTotal)
      };
    });
  };

  const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const updatedTask = {
      ...formData,
      title: formData.title.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };

    onSave(task.Id, updatedTask);
    onClose();
  };

const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
            <h2 className="text-xl font-semibold text-gray-900">Edit Task</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
<form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter task title..."
                className="text-lg"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Add task description..."
                rows={4}
              />
            </div>

            {/* Category, Priority, Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.Id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <Select
                  value={formData.priority}
                  onChange={(e) => handleInputChange("priority", e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                />
              </div>
            </div>

            {/* Time Tracking */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="Clock" className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Time Tracking</h3>
              </div>

              {/* Timer Controls */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    {activeTimer ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-700">Timer Running</span>
                        </div>
                        <div className="text-xl font-mono font-bold text-gray-900">
                          {formatDuration(currentTime - activeTimer.startTime)}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-600">Ready to start timing</div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {!activeTimer ? (
                      <Button
                        type="button"
                        onClick={startTimer}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ApperIcon name="Play" className="w-4 h-4 mr-2" />
                        Start Timer
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={stopTimer}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <ApperIcon name="Square" className="w-4 h-4 mr-2" />
                        Stop Timer
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Time Display */}
              <div className="bg-primary-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-800">Total Time Spent</span>
                  <span className="text-2xl font-bold text-primary-900">
                    {formatDuration(formData.totalTimeSpent)}
                  </span>
                </div>
              </div>

              {/* Time Entries History */}
              {formData.timeEntries.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Sessions</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {formData.timeEntries.slice(-5).reverse().map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {formatDuration(entry.duration)}
                            </div>
                            <div className="text-gray-500">
                              {new Date(entry.startTime).toLocaleTimeString()} - {new Date(entry.endTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeTimeEntry(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <Button type="submit" className="flex-1">
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskEditModal;