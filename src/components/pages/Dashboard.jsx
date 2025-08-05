import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import ProgressStats from "@/components/organisms/ProgressStats";
import TaskList from "@/components/organisms/TaskList";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("all");
  const [categories, setCategories] = useState([]);
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await categoryService.getAll();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await taskService.create(taskData);
      toast.success("Task created successfully! 🎉");
      setRefreshTrigger(prev => prev + 1);
      loadCategories(); // Refresh category counts
    } catch (err) {
      toast.error("Failed to create task");
      console.error("Error creating task:", err);
    }
  };

  const handleTaskUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    loadCategories(); // Refresh category counts
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveCategory("All");
      setActiveStatus("all");
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchQuery("");
  };

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setSearchQuery("");
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <CategorySidebar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        activeStatus={activeStatus}
        onStatusChange={handleStatusChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Progress Stats */}
        <ProgressStats
          isCollapsed={isStatsCollapsed}
          onToggle={() => setIsStatsCollapsed(!isStatsCollapsed)}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-4xl mx-auto p-6 overflow-y-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                    {activeStatus === "all" 
                      ? `${activeCategory} Tasks`
                      : `${activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)} Tasks`
                    }
                  </h1>
                  <p className="text-gray-600">
                    {searchQuery 
                      ? `Search results for "${searchQuery}"`
                      : "Stay organized and productive"
                    }
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <SearchBar 
                    onSearch={handleSearch}
                    placeholder="Search tasks..."
                  />
                </div>
              </div>

              {/* Quick Add Task */}
              <QuickAddTask 
                onAdd={handleAddTask}
                categories={categories}
              />
            </motion.div>

            {/* Task List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TaskList
                key={refreshTrigger}
                searchQuery={searchQuery}
                categoryFilter={activeCategory}
                statusFilter={activeStatus}
                categories={categories}
                onTaskUpdate={handleTaskUpdate}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;