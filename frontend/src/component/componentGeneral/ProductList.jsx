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
import { flyToCart } from '../../utils/flyToCart.js';

const formatPrice = (price) => {
  if (isNaN(price)) return price;
  return price.toLocaleString();
};

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
          className="text-center text-gray-500 py-16 px-4 rounded-xl border border-dashed border-gray-300 bg-gray-50"
        >
          No products found. Please check back later!
        </Typography>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
          {/* Product Display Section */}
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

            const outOfStock = stock === 0;
            const discountPercent = calculateDiscountPercentage(
              price,
              discountPrice,
            );

            return (
              <div
                key={product.slug}
                className="group relative flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-lg"
              >
                {/* Image area */}
                <div className="relative">
                  <Link
                    to={`/product/${product.slug}`}
                    className="block overflow-hidden bg-gray-100"
                    aria-label={product.name}
                  >
                    <ImageComponent
                      imageName={product.thumbnailImage}
                      className={`w-full aspect-square object-cover transition-transform duration-300 ease-out group-hover:scale-105 ${
                        outOfStock ? 'opacity-60' : ''
                      }`}
                      altName={product.name}
                      skeletonHeight={250}
                    />
                  </Link>

                  {/* Discount badge */}
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 z-10 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                      -{discountPercent}%
                    </span>
                  )}

                  {/* Out of stock tag */}
                  {outOfStock && (
                    <span className="absolute bottom-2 left-2 z-10 rounded-full bg-gray-900/80 px-2.5 py-0.5 text-[11px] font-medium text-white">
                      Out of stock
                    </span>
                  )}

                  {/* Wishlist + Quick view */}
                  <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm ring-1 ring-black/5">
                      <WishlistButton
                        product={product}
                        size={16}
                        className="!p-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                  <Link to={`/product/${product.slug}`} className="block">
                    <h3 className="text-sm font-medium leading-snug text-gray-800 line-clamp-2 break-words min-h-[2.5rem] transition-colors hover:text-black hover:underline">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Variants */}
                  {hasVariants && (
                    <div
                      className="mt-2 flex flex-wrap gap-1.5"
                      role="group"
                      aria-label="Select variant"
                    >
                      {product.variants.map((variant) => {
                        const isSelected = variant._id === selectedVariant._id;
                        return (
                          <button
                            key={variant._id}
                            onClick={() => handleVariantSelect(variant)}
                            aria-pressed={isSelected}
                            className={`min-w-[2rem] px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gray-900 ${
                              isSelected
                                ? 'primaryBgColor accentTextColor border-transparent'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                            }`}
                          >
                            {getVariantDisplayName(variant)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Add to cart pinned to bottom */}
                  <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                    {/* Price (left) */}
                    <div className="flex min-w-0 items-baseline gap-1.5 whitespace-nowrap">
                      {discountPrice > 0 ? (
                        <>
                          <span className="text-sm font-bold text-red-700">
                            Tk. {formatPrice(Number(discountPrice))}
                          </span>
                          <span className="text-[11px] line-through text-gray-400">
                            {formatPrice(Number(price))}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-gray-900">
                          Tk. {formatPrice(Number(price))}
                        </span>
                      )}
                    </div>

                    {/* +Add (right) */}
                    <button
                      onClick={(e) => {
                        addToCart(product, 1, selectedVariant);
                        const cardImg = e.currentTarget
                          .closest('.group')
                          ?.querySelector('img');
                        flyToCart(cardImg, cardImg?.src || product.thumbnailImage);
                      }}
                      disabled={outOfStock}
                      aria-label={`Add ${product.name} to cart`}
                      className="primaryBgColor accentTextColor shrink-0 flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                    >
                      <FaPlus className="text-[10px]" aria-hidden="true" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
