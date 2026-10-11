import { useEffect } from 'react';
import CarouselStore from '../store/CarouselStore.js';
import useProductStore from '../store/useProductStore.js';
import ProductCarousel from '../component/componentGeneral/ProductCarousel.jsx';
import ProductByFlag from '../component/componentGeneral/ProductByFlag.jsx';
import FeatureCategory from '#component/componentGeneral/FeatureCategory.jsx';

const HomePage = () => {
  const { CarouselStoreListRequest } = CarouselStore();
  const { fetchHomeProducts } = useProductStore();

  useEffect(() => {
    CarouselStoreListRequest();
    fetchHomeProducts();
  }, []);

  return (
    <>
      <h1 className="sr-only">Welcome to Our Store</h1>
      <ProductCarousel />
      <FeatureCategory />
      <ProductByFlag />
    </>
  );
};

export default HomePage;
