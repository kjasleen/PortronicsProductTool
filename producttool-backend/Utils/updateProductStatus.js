const Product = require('../Models/product');
const Phase = require('../Models/phase');

async function updateProductStatus(productId) {
  const phases = await Phase.find({ product: productId });
  const allCompleted = phases.length > 0 && phases.every(phase => phase.status === 'Completed');

  await Product.findByIdAndUpdate(productId, {
    status: allCompleted ? 'Completed' : 'Ongoing'
  });
}

module.exports = updateProductStatus;
