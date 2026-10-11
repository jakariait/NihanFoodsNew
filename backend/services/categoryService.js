const CategoryModel = require('../models/CategoryModel');
const { attachProductCounts } = require('./productCountService');

const createCategory = async (categoryData) => {
  const category = new CategoryModel(categoryData);
  return await category.save();
};

const getCategories = async (filter = {}) => {
  const categories = await CategoryModel.find(filter);
  return await attachProductCounts(categories, 'category');
};

const getCategoryById = async (id) => {
  return await CategoryModel.findById(id);
};

const updateCategory = async (id, categoryData) => {
  return await CategoryModel.findByIdAndUpdate(id, categoryData, { new: true });
};

const deleteCategory = async (id) => {
  return await CategoryModel.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
