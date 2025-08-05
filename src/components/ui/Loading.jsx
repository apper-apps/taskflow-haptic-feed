import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "tasks") {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface border border-gray-200 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 bg-gray-300 rounded mt-1"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex items-center gap-4">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "categories") {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg animate-pulse"
          >
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded flex-1"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full"
      />
    </div>
  );
};

export default Loading;