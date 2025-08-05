import categoriesData from "../mockData/categories.json";

let categories = [...categoriesData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay();
    return [...categories];
  },

  async getById(id) {
    await delay();
    const category = categories.find(c => c.Id === parseInt(id));
    return category ? { ...category } : null;
  },

  async create(categoryData) {
    await delay();
    const newCategory = {
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      ...categoryData,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay();
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      categories[index] = { ...categories[index], ...categoryData };
      return { ...categories[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      const deletedCategory = { ...categories[index] };
      categories.splice(index, 1);
      return deletedCategory;
    }
    return null;
  },

  async updateTaskCount(categoryName, increment) {
    await delay();
    const category = categories.find(c => c.name === categoryName);
    if (category) {
      category.taskCount = Math.max(0, category.taskCount + increment);
      return { ...category };
    }
    return null;
  }
};