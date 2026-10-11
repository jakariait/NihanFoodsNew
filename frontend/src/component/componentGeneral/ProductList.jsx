import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { Link } from 'react-router-dom';
import { FaEye, FaPlus } from 'react-icons/fa';
import ProductGallery from './ProductGallery.jsx';
import ProductAddToCart from './ProductAddToCart.jsx';
import ImageComponent from './ImageComponent.jsx';
import WishlistButton from './WishlistButton.jsx';
import useCartStore from '../../store/useCartStore.js';

// Memoize the formatted price function
const formatPrice = (price) => {
  if (isNaN(price)) return price;
  return price.toLocaleString();
};

// Helper to get variant display name from attributes
const getVariantDisplayName = (variant) => {
  if (!variant) return 'N/A';
  if (variant.attributes && Array.isArray(variant.attributes)) {
    const attributeValues = variant.attributes
      .map((attr) => attr.value)
      .filter((val) => val);
    if (attributeValues.length > 0) {
      return attributeValues.join(' / ');
    }
  }
  if (variant.size?.name) {
    return variant.size.name;
  }
  return 'N/A';
};

const ProductList = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const addToCart = useCartStore((state) => state.addToCart);
  const handleOpen = (product) => {
    setSelectedProduct(product);
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };
  const calculateDiscountPercentage = (
    priceBeforeDiscount,
    priceAfterDiscount,
  ) => {
    if (
      !priceBeforeDiscount ||
      !priceAfterDiscount ||
      priceBeforeDiscount <= priceAfterDiscount
    )
      return 0;
    const discountAmount = priceBeforeDiscount - priceAfterDiscount;
    return Math.ceil((discountAmount / priceBeforeDiscount) * 100);
  };
  return (
    <div>
      {products.filter((product) => product.isActive).length === 0 ? (
        <Typography
          variant="body1"
          className="text-center text-gray-500 p-20 md:p-70 shadow rounded-lg"
        >
          No products found. Please check back later!
        </Typography>
      ) : (
        <div
          className={
            'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 '
          }
        >
          {/*Product Display Section*/}
          {products.map((product) => {
            const hasVariants = Boolean(product.variants?.length);
            const selectedVariant = hasVariants
              ? (selectedVariants[product.id] ?? product.variants[0])
              : null;

            const price = hasVariants
              ? selectedVariant.price
              : product.finalPrice;
            const discountPrice = hasVariants
              ? selectedVariant.discount
              : product.finalDiscount;
            const stock = hasVariants
              ? selectedVariant.stock
              : product.finalStock;

            const handleVariantSelect = (variant) =>
              setSelectedVariants((prev) => ({
                ...prev,
                [product.id]: variant,
              }));

            return (
              <div
                key={product.slug}
                className="relative p-2 rounded bg-white min-h-[250px]"
              >
                <Link to={`/product/${product.slug}`} className="block">
                  <ImageComponent
                    imageName={product.thumbnailImage}
                    className="w-full aspect-square object-cover"
                    altName={product.name}
                    skeletonHeight={250}
                  />
                  <div className="text-left mt-1 mb-1 hover:underline line-clamp-2 break-words">
                    {product.name}
                  </div>
                </Link>

                {/* Price + Add to Cart */}
                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {discountPrice > 0 ? (
                      <>
                        <span className="text-sm line-through text-gray-400">
                          Tk. {formatPrice(Number(price))}
                        </span>
                        <span className="text-sm font-semibold text-red-800">
                          Tk. {formatPrice(Number(discountPrice))}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">
                        Tk. {formatPrice(Number(price))}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product, 1, selectedVariant)}
                    disabled={stock === 0}
                    className="primaryBgColor accentTextColor shrink-0 flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FaPlus className="text-[10px]" />
                    Add
                  </button>
                </div>

                {/* Variants */}
                {hasVariants && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.variants.map((variant) => {
                      const isSelected = variant._id === selectedVariant._id;
                      return (
                        <button
                          key={variant._id}
                          onClick={() => handleVariantSelect(variant)}
                          className={`px-2 py-0.5 rounded text-xs border cursor-pointer transition-colors ${
                            isSelected
                              ? 'primaryBgColor accentTextColor border-transparent'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {getVariantDisplayName(variant)}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Discount Percentage */}
                <div className="absolute top-2 left-0 z-10 ">
                  {discountPrice > 0 && (
                    <span className="bg-red-400 px-2 py-1 text-white rounded">
                      -{calculateDiscountPercentage(price, discountPrice)}%
                    </span>
                  )}
                </div>

                {/* Quick View Button */}
                <div className="absolute top-1 right-0 z-10 flex gap-1 bg-white rounded-full justify-center items-center">
                  <WishlistButton
                    product={product}
                    size={18}
                    className="!p-1.5"
                  />
                  <button
                    onClick={() => handleOpen(product)}
                    className="p-2 cursor-pointer"
                    aria-label={`Quick view ${product.name}`}
                  >
                    <FaEye aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick View Modal */}
          {selectedProduct && (
            <Dialog
              open={Boolean(selectedProduct)}
              onOpenChange={(open) => !open && handleClose()}
            >
              <DialogContent className="sm:max-w-4xl w-[calc(100%-1.5rem)] p-3 sm:p-6 max-h-[95vh] overflow-y-auto scrollbar-hide">
                <div className="flex flex-col md:grid md:grid-cols-2 gap-2 sm:gap-4">
                  <ProductGallery
                    images={selectedProduct.images}
                    discount={calculateDiscountPercentage(
                      selectedProduct.finalPrice,
                      selectedProduct.finalDiscount,
                    )}
                    zoom={false}
                  />
                  <div>
                    <ProductAddToCart product={selectedProduct} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
