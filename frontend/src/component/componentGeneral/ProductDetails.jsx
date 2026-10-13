import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useProductStore from '../../store/useProductStore.js';
import GeneralInfoStore from '../../store/GeneralInfoStore.js';
import Skeleton from 'react-loading-skeleton';
import LazySocialShareButtons from './LazySocialShareButtons.jsx';
import ProductGallery from './ProductGallery.jsx';
import ProductAddToCart from './ProductAddToCart.jsx';
import ProductBreadcrumbs from './ProductBreadcrumbs.jsx';
import ProductBenefits from '../componentGeneral/ProductBenefits.jsx';
import HowToUse from '../componentGeneral/HowToUse.jsx';
import Ingredients from '../componentGeneral/Ingredients.jsx';
import Precautions from '../componentGeneral/Precautions.jsx';
import ShortDescription from '../componentGeneral/ShortDescription.jsx';

import ProductDetailsSkeleton from '../skeleton/ProductDetailsSkeleton.jsx';
import sanitizeHtml from '../../utils/sanitizeHtml.js';
import { FaLeaf } from 'react-icons/fa';
const SimilarProducts = lazy(() => import('./SimilarProducts.jsx'));
const YouTubeEmbed = lazy(() => import('./YouTubeEmbed.jsx'));
const RecentlyViewedProducts = lazy(
  () => import('./RecentlyViewedProducts.jsx'),
);

const ProductDetails = () => {
  const hasPushedRef = useRef(false);

  const { fetchProductBySlug, product, loading, error, resetProduct } =
    useProductStore();

  const { GeneralInfoList } = GeneralInfoStore();
  const { slug } = useParams();

  const [currentProductSlug, setCurrentProductSlug] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (slug !== currentProductSlug) {
      // Reset product state and show loading
      resetProduct(); // Clear previous product data
      setCurrentProductSlug(slug);
      fetchProductBySlug(slug);
    }
  }, [slug, currentProductSlug, fetchProductBySlug, resetProduct]);

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

  const location = useLocation();
  const url = `${window.location.origin}${location.pathname}`;
  const title = product?.name;

  const discountPercentage =
    product?.finalPrice && product?.finalDiscount
      ? calculateDiscountPercentage(product.finalPrice, product.finalDiscount)
      : 0;

  const cleanHtml = (html) => sanitizeHtml(html);

  // Data layer for View Content

  useEffect(() => {
    if (!product || hasPushedRef.current) return;

    const price =
      (product?.finalDiscount ?? 0) > 0
        ? (product?.finalDiscount ?? 0)
        : (product?.finalPrice ?? 0);

    const discount =
      (product?.finalDiscount ?? 0) > 0
        ? (product?.finalPrice ?? 0) - (product?.finalDiscount ?? 0)
        : 0;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        currency: 'BDT',
        value: price,
        items: [
          {
            item_id: product.productId,
            item_name: product.name,
            currency: 'BDT',
            discount,
            item_variant: 'Default',
            price,
            quantity: 1,
          },
        ],
      },
    });

    hasPushedRef.current = true;
  }, [product]);

  useEffect(() => {
    if (!product?._id) return;

    // Get existing list or empty array
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

    // Remove if already exists (avoid duplicates)
    viewed = viewed.filter((item) => item._id !== product._id);

    // Add new one at beginning
    viewed.unshift({
      _id: product._id,
      name: product.name,
      isActive: product.isActive,
      category: product.category,
      finalDiscount: product.finalDiscount,
      finalPrice: product.finalPrice,
      productId: product.productId,
      slug: product.slug,
      variants: product.variants,
      finalStock: product.finalStock,
      flags: product.flags,
      images: product.images,
      thumbnailImage: product.thumbnailImage,
    });

    // Limit to 5 items
    viewed = viewed.slice(0, 5);

    // Save back
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
    setRecentlyViewed(viewed);
  }, [product]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="xl:container xl:mx-auto p-3">
        <div className="flex flex-col items-center justify-center pt-40 text-gray-500">
          <h1 className="text-2xl font-semibold mb-2">Product Not Found</h1>
          <p>
            The product you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (product.slug !== slug) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <div className="xl:container xl:mx-auto p-3">
      {error && (
        <div className="text-red-500 flex items-center justify-center pt-40">
          Error: {error}
        </div>
      )}

      {product && (
        <div>
          {/*Seo Meta Data*/}
          <title>{`${product?.name || product?.metaTitle} | ${GeneralInfoList?.CompanyName}`}</title>
          <meta name="description" content={product?.metaDescription} />
          <meta
            name="keywords"
            content={product?.metaKeywords?.join(', ') ?? ''}
          />
          <meta
            property="og:title"
            content={`${product?.name || product?.metaTitle} | ${GeneralInfoList?.CompanyName}`}
          />
          <meta property="og:description" content={product?.metaDescription} />
          <meta property="og:image" content={product?.thumbnailImage} />
          <meta property="og:url" content={window.location.href} />
          <link
            rel="canonical"
            href={`https://ecommerce.digiwebdigital.com/product/${slug}`}
          />

          {/*BreadCrumbs*/}
          <ProductBreadcrumbs product={product} />

          <div className="md:grid md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-9 gap-8">
            <div className="md:col-span-3 lg:col-span-5 xl:col-span-4 relative">
              <ProductGallery
                images={product.images}
                discount={discountPercentage}
                productName={product.name}
              />
            </div>
            <div className="flex flex-col gap-3 md:col-span-5 lg:col-span-4 xl:col-span-5 pt-4 md:pt-0">
              <ProductAddToCart product={product} />

              {/*Short Description*/}
              {product.shortDesc && (
                <section className="rounded-2xl border border-[#2E7D31]/15 bg-[#F4FAF4] p-4 md:p-5">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 mb-3 md:mb-4">
                    <span className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-[#2E7D31] text-white">
                      <FaLeaf className="text-sm md:text-base" />
                    </span>
                    <h2 className="text-base md:text-xl font-semibold leading-tight text-gray-900">
                      About this product
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="rounded-xl border border-[#2E7D31]/15 bg-white p-3 md:p-4 shadow-sm">
                    <div
                      className="rendered-html prose prose-sm md:prose-base max-w-none text-gray-700
          prose-p:my-1.5 prose-p:leading-relaxed
          prose-strong:text-gray-900
          prose-ul:my-1.5 prose-ul:pl-5 prose-li:my-0.5
          prose-li:marker:text-[#2E7D31]
          prose-a:text-[#2E7D31] prose-a:underline prose-a:underline-offset-2"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtml(product.shortDesc),
                      }}
                    />
                  </div>
                </section>
              )}

              <ProductBenefits product={product} />
              <HowToUse product={product} />

              <Ingredients product={product} />
              <Precautions product={product} />

              {/*Social Share Buttons*/}
              <div className="flex items-center gap-2">
                <h1>Social Share:</h1>
                <LazySocialShareButtons url={url} title={title} />
              </div>
            </div>
          </div>

          {/*YoutubeEmbed*/}
          {product.videoUrl && (
            <div className={'flex items-center justify-center pt-10 pb-10'}>
              <Suspense
                fallback={
                  <div className="w-full sm:w-[560px]">
                    <div className="aspect-video">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </div>
                }
              >
                <YouTubeEmbed videoId={product.videoUrl} />
              </Suspense>
            </div>
          )}

          <div>
            <Suspense fallback={<Skeleton height={200} width={'100%'} />}>
              <RecentlyViewedProducts
                currentProductId={product._id}
                products={recentlyViewed}
              />
            </Suspense>
            <Suspense fallback={<Skeleton height={200} width={'100%'} />}>
              <SimilarProducts
                categoryId={product?.category?._id}
                productId={product?._id}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
