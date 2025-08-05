import tasksData from "../mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay();
    return [...tasks];
  },

  async getById(id) {
    await delay();
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

async create(taskData) {
    await delay();
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      timeEntries: taskData.timeEntries || [],
      totalTimeSpent: taskData.totalTimeSpent || 0
    };
    tasks.push(newTask);
    return { ...newTask };
  },

async update(id, taskData) {
    await delay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { 
        ...tasks[index], 
        ...taskData,
        timeEntries: taskData.timeEntries || tasks[index].timeEntries || [],
        totalTimeSpent: taskData.totalTimeSpent || tasks[index].totalTimeSpent || 0
      };
      return { ...tasks[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      const deletedTask = { ...tasks[index] };
      tasks.splice(index, 1);
      return deletedTask;
    }
    return null;
  },

  async toggleComplete(id) {
    await delay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      const task = tasks[index];
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      return { ...task };
    }
    return null;
  },

  async getByCategory(category) {
    await delay();
    if (category === "All") {
      return [...tasks];
    }
    return tasks.filter(t => t.category === category);
  },

  async getByStatus(status) {
    await delay();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (status) {
      case "today":
        return tasks.filter(t => {
          if (!t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
          return taskDate.getTime() === today.getTime() && !t.completed;
        });
      case "upcoming":
        return tasks.filter(t => {
          if (!t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          return dueDate > now && !t.completed;
        });
      case "overdue":
        return tasks.filter(t => {
          if (!t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          return dueDate < now && !t.completed;
        });
      case "completed":
        return tasks.filter(t => t.completed);
      default:
        return [...tasks];
    }
  },

  async search(query) {
    await delay();
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [...tasks];
    
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm) ||
      task.category.toLowerCase().includes(searchTerm)
    );
  }
};