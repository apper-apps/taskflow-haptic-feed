import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";

const ProgressStats = ({ isCollapsed, onToggle }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    todayCompleted: 0,
    weekCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const allTasks = await taskService.getAll();
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      
      const completed = allTasks.filter(task => task.completed);
      const pending = allTasks.filter(task => !task.completed);
      const overdue = allTasks.filter(task => {
        if (!task.dueDate || task.completed) return false;
        return new Date(task.dueDate) < now;
      });
      
      const todayCompleted = completed.filter(task => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        const completedDay = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate());
        return completedDay.getTime() === today.getTime();
      });
      
      const weekCompleted = completed.filter(task => {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        return isWithinInterval(completedDate, { start: weekStart, end: weekEnd });
      });

      setStats({
        total: allTasks.length,
        completed: completed.length,
        pending: pending.length,
        overdue: overdue.length,
        todayCompleted: todayCompleted.length,
        weekCompleted: weekCompleted.length
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-between text-left hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-700">
                  {stats.pending} pending tasks
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                <span className="text-sm font-medium text-gray-700">
                  {completionRate}% complete
                </span>
              </div>
            </div>
            <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="ChevronUp" className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/50 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2" />
                <div className="h-8 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Completed</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="Clock" className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-gray-600">Pending</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="AlertCircle" className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-600">Overdue</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.overdue}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="Target" className="w-4 h-4 text-accent-600" />
                  <span className="text-sm font-medium text-gray-600">Completion</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
              </motion.div>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                <span className="text-sm font-bold text-primary-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 h-3 rounded-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </motion.div>
              </div>
            </motion.div>

            {/* Achievement Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 mt-4"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-green-600">{stats.todayCompleted}</span> completed today
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-primary-600">{stats.weekCompleted}</span> this week
                </span>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProgressStats;