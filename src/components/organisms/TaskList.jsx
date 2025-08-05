import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import TaskCard from "@/components/molecules/TaskCard";
import TaskEditModal from "@/components/molecules/TaskEditModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TaskList = ({ 
  searchQuery = "", 
  categoryFilter = "All", 
  statusFilter = "all",
  categories = [],
  onTaskUpdate
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      loadTasks();
    }
  }, [searchQuery]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      
      let fetchedTasks = [];
      
      if (categoryFilter === "All") {
        if (statusFilter === "all") {
          fetchedTasks = await taskService.getAll();
        } else {
          fetchedTasks = await taskService.getByStatus(statusFilter);
        }
      } else {
        fetchedTasks = await taskService.getByCategory(categoryFilter);
        if (statusFilter !== "all") {
          fetchedTasks = fetchedTasks.filter(task => {
            const now = new Date();
            switch (statusFilter) {
              case "today":
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
                return taskDate.getTime() === today.getTime() && !task.completed;
              case "upcoming":
                return task.dueDate && new Date(task.dueDate) > now && !task.completed;
              case "overdue":
                return task.dueDate && new Date(task.dueDate) < now && !task.completed;
              case "completed":
                return task.completed;
              default:
                return true;
            }
          });
        }
      }
      
      setTasks(fetchedTasks);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const searchResults = await taskService.search(searchQuery);
      setTasks(searchResults);
    } catch (err) {
      setError("Failed to search tasks. Please try again.");
      console.error("Error searching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.Id === taskId ? updatedTask : task
        ));
        
        toast.success(
          updatedTask.completed ? "Task completed! 🎉" : "Task reopened",
          { className: "animate-bounce-in" }
        );
        
        if (onTaskUpdate) {
          onTaskUpdate();
        }
      }
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error toggling task:", err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSaveTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.update(taskId, taskData);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.Id === taskId ? updatedTask : task
        ));
        toast.success("Task updated successfully");
        
        if (onTaskUpdate) {
          onTaskUpdate();
        }
      }
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully");
      
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  if (loading) {
    return <Loading type="tasks" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />;
  }

  if (tasks.length === 0) {
    if (searchQuery.trim()) {
      return <Empty type="search" />;
    } else if (categoryFilter !== "All") {
      return <Empty type="filter" />;
    } else if (statusFilter === "completed") {
      return <Empty type="completed" />;
    } else if (statusFilter === "overdue") {
      return <Empty type="overdue" />;
    } else {
      return <Empty type="tasks" />;
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <TaskCard
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <TaskEditModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveTask}
        categories={categories}
      />
    </div>
  );
};

export default TaskList;