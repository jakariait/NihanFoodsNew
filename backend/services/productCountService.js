const ProductModel = require('../models/ProductModel');

// Attaches a `productsCount` field to each document, counting only active
// products that reference it through the given product field
// ('category' | 'subCategory' | 'childCategory').
const attachProductCounts = async (docs, field) => {
  if (!docs || docs.length === 0) return docs;

  const rows = await ProductModel.aggregate([
    { $match: { isActive: true, [field]: { $in: docs.map((doc) => doc._id) } } },
    { $group: { _id: `$${field}`, productsCount: { $sum: 1 } } },
  ]);

  const counts = new Map(rows.map((row) => [String(row._id), row.productsCount]));
  docs.forEach((doc) => {
    const count = counts.get(String(doc._id)) || 0;
    if (typeof doc.set === 'function') {
      doc.set('productsCount', count, { strict: false });
    } else {
      doc.productsCount = count;
    }
  });

  return docs;
};

module.exports = { attachProductCounts };