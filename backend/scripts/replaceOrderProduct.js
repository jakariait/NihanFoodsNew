require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/OrderModel');
const Product = require('./models/ProductModel');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not defined in .env');
  process.exit(1);
}

const [orderId, oldProductId, newProductId] = process.argv.slice(2);

if (!orderId || !oldProductId || !newProductId) {
  console.error('Usage: node replaceOrderProduct.js <orderId> <oldProductId> <newProductId>');
  process.exit(1);
}

(async () => {
  await mongoose.connect(MONGO_URI);
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      process.exit(1);
    }

    const itemIndex = order.items.findIndex(
      (i) => i.productId.toString() === oldProductId
    );
    if (itemIndex === -1) {
      console.error(`Product ${oldProductId} not found in order ${orderId}`);
      process.exit(1);
    }

    const newProduct = await Product.findById(newProductId);
    if (!newProduct) {
      console.error(`New product ${newProductId} not found`);
      process.exit(1);
    }

    const item = order.items[itemIndex];
    const oldPrice = item.price;

    // Replace product id, reset variant (new product may have different variants),
    // and update unit price to the new product's price.
    item.productId = newProductId;
    item.variantId = null;
    item.price = newProduct.finalDiscount > 0 ? newProduct.finalDiscount : newProduct.finalPrice;

    order.markModified('items');

    // Recalculate subtotal; pre('save') hook recomputes totalAmount & dueAmount.
    order.subtotalAmount = order.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await order.save();

    console.log(
      `Order ${orderId}: replaced product ${oldProductId} (price ${oldPrice}) with ${newProductId} (price ${item.price}). Subtotal now ${order.subtotalAmount}.`
    );
  } finally {
    await mongoose.disconnect();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
