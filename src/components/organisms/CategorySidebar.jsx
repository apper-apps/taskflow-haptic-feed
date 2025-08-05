import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { categoryService } from "@/services/api/categoryService";
import CategoryPill from "@/components/molecules/CategoryPill";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const CategorySidebar = ({ 
  activeCategory = "All", 
  onCategoryChange,
  activeStatus = "all",
  onStatusChange 
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedCategories = await categoryService.getAll();
      setCategories(fetchedCategories);
    } catch (err) {
      setError("Failed to load categories");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusFilters = [
    { key: "all", label: "All Tasks", icon: "List", count: null },
    { key: "today", label: "Today", icon: "Calendar", count: null },
    { key: "upcoming", label: "Upcoming", icon: "Clock", count: null },
    { key: "overdue", label: "Overdue", icon: "AlertCircle", count: null },
    { key: "completed", label: "Completed", icon: "CheckCircle", count: null }
  ];

  if (loading) {
    return (
      <div className="w-64 bg-surface border-r border-gray-200 p-6">
        <Loading type="categories" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 bg-surface border-r border-gray-200 p-6">
        <Error message={error} onRetry={loadCategories} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 bg-surface border-r border-gray-200 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-display text-xl font-bold text-gray-900">TaskFlow</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Status Filters */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Views
          </h3>
          <div className="space-y-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => onStatusChange(filter.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeStatus === filter.key
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <ApperIcon 
                  name={filter.icon} 
                  className="w-4 h-4" 
                />
                <span className="flex-1 text-left">{filter.label}</span>
                {filter.count && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                    activeStatus === filter.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Categories
          </h3>
          <div className="space-y-1">
            {/* All Categories */}
            <button
              onClick={() => onCategoryChange("All")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === "All"
                  ? "bg-gradient-to-r from-secondary-600 to-secondary-700 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full" />
              <span className="flex-1 text-left">All</span>
            </button>

            {/* Category List */}
            {categories.map((category) => (
              <button
                key={category.Id}
                onClick={() => onCategoryChange(category.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.name
                    ? "bg-gradient-to-r from-secondary-600 to-secondary-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="flex-1 text-left">{category.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeCategory === category.name
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {category.taskCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Stay productive with TaskFlow
        </div>
      </div>
    </motion.div>
  );
};

export default CategorySidebar;