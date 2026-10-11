import { useState, memo, useRef, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaAngleDown } from 'react-icons/fa6';
import useCategoryStore from '../../store/useCategoryStore.js';
import useSubCategoryStore from '../../store/useSubCategoryStore.js';
import useChildCategoryStore from '../../store/useChildCategoryStore.js';

const MenuBar = () => {
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();
  const location = useLocation();

  // Build query string helper
  const buildQueryString = useCallback((params) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    return urlParams.toString();
  }, []);

  // Check if current route matches to prevent unnecessary navigation
  const isCurrentRoute = useCallback(
    (queryParams) => {
      const currentParams = new URLSearchParams(location.search);
      const newParams = new URLSearchParams(queryParams);

      // Compare relevant parameters
      return (
        currentParams.get('category') === newParams.get('category') &&
        currentParams.get('subcategory') === newParams.get('subcategory') &&
        currentParams.get('childCategory') === newParams.get('childCategory')
      );
    },
    [location.search],
  );

  const navCategories = (categories || []).filter(
    (category) => category.showOnNavbar,
  );

  return (
    <div className="lg:bg-white">
      <nav className="xl:container xl:mx-auto">
        <div className="lg:flex items-center justify-between px-2">
          {/* Left — Shop by Category (hover to open) */}
          <ul className="lg:flex items-center">
            {navCategories.length ? (
              <MenuItem
                label={
                  <div className="flex items-center gap-1 cursor-pointer">
                    <FaBars />
                    Shop by Category
                  </div>
                }
              >
                <ul className="text-black p-2">
                  {navCategories.map((category) => {
                    const categoryQuery = buildQueryString({
                      category: category.name,
                    });
                    const categoryPath = `/shop?${categoryQuery}`;
                    const hasSubCategories =
                      Array.isArray(subCategories) &&
                      subCategories.some(
                        (subCat) =>
                          subCat?.category?._id === category._id &&
                          subCat.isActive,
                      );

                    return (
                      <MenuItem
                        key={category._id}
                        panelClass="lg:left-full lg:top-0 lg:mt-0 lg:ml-1"
                        label={
                          <Link
                            to={categoryPath}
                            className="-mx-2 -my-2 flex items-center justify-between gap-2 rounded p-2 text-left transition-colors duration-150 hover:bg-gray-100"
                            onClick={(e) => {
                              // Prevent navigation if already on this category
                              if (isCurrentRoute(categoryQuery)) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <span className="min-w-0 truncate">
                              {category.name}
                            </span>
                            {hasSubCategories && (
                              <FaAngleDown className="-rotate-90 shrink-0" />
                            )}
                          </Link>
                        }
                      >
                        {hasSubCategories && (
                          <SubMenu
                            subCategories={subCategories}
                            categoryId={category._id}
                            childCategories={childCategories}
                            buildQueryString={buildQueryString}
                            isCurrentRoute={isCurrentRoute}
                          />
                        )}
                      </MenuItem>
                    );
                  })}
                </ul>
              </MenuItem>
            ) : (
              <MenuItem
                label={
                  <Link to="/shop" className="block">
                    Shop by Category
                  </Link>
                }
              />
            )}
          </ul>

          {/* Right — Blog & Contact Us */}
          <ul className="lg:flex items-center">
            <MenuItem
              label={
                <Link to="/blog" className="block">
                  Blog
                </Link>
              }
            />
            <MenuItem
              label={
                <Link to="/contact-us" className="block">
                  Contact Us
                </Link>
              }
            />
          </ul>
        </div>
      </nav>
    </div>
  );
};

// ✅ Optimized MenuItem Component with better hover handling
const MenuItem = memo(function MenuItem({ label, children, panelClass = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (children) {
      openMenu();
    }
  }, [children, openMenu]);

  const handleMouseLeave = useCallback(() => {
    if (children) {
      timerRef.current = setTimeout(closeMenu, 300);
    }
  }, [children, closeMenu]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeMenu]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <li
      ref={menuRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="px-2 py-2 text-gray-800 font-semibold cursor-pointer">
        {label}
      </div>

      {/* Use CSS transition for smoother animation */}
      <div
        className={`absolute left-0 mt-2 bg-white shadow-lg rounded-md w-56 z-50 transition-all duration-200 ${panelClass} ${
          isOpen
            ? 'opacity-100 visible transform translate-y-0'
            : 'opacity-0 invisible transform -translate-y-2'
        }`}
        onMouseEnter={openMenu}
        onMouseLeave={handleMouseLeave}
        onClick={closeMenu}
      >
        {children}
      </div>
    </li>
  );
});

// ✅ Optimized SubMenu Component using Links instead of navigate
const SubMenu = memo(function SubMenu({
  subCategories,
  categoryId,
  childCategories,
  buildQueryString,
  isCurrentRoute,
}) {
  const filteredSubCategories = Array.isArray(subCategories)
    ? subCategories.filter(
        (subCategory) => subCategory?.category?._id === categoryId,
      )
    : [];

  return (
    <ul className="text-black p-2">
      {filteredSubCategories
        .filter((subCategory) => subCategory.isActive)
        .map((subCategory) => {
          const subCategoryQuery = buildQueryString({
            subcategory: subCategory.slug,
          });
          const subCategoryPath = `/shop?${subCategoryQuery}`;

          return (
            <li key={subCategory._id} className="px-4 py-2">
              <Link
                to={subCategoryPath}
                className="block w-full text-left hover:bg-gray-100 p-1 rounded transition-colors duration-150"
                onClick={(e) => {
                  if (isCurrentRoute && isCurrentRoute(subCategoryQuery)) {
                    e.preventDefault();
                  }
                }}
              >
                {subCategory.name}
              </Link>
              <ChildSubMenu
                subCategoryId={subCategory._id}
                childCategories={childCategories}
                buildQueryString={buildQueryString}
                isCurrentRoute={isCurrentRoute}
              />
            </li>
          );
        })}
    </ul>
  );
});

// ✅ Optimized ChildSubMenu Component using Links
const ChildSubMenu = memo(function ChildSubMenu({
  childCategories,
  subCategoryId,
  buildQueryString,
  isCurrentRoute,
}) {
  const filteredChildCategories = Array.isArray(childCategories)
    ? childCategories.filter(
        (childCategory) =>
          String(
            childCategory?.subCategory?._id || childCategory?.subCategory,
          ) === String(subCategoryId),
      )
    : [];

  if (filteredChildCategories.length === 0) return null;

  return (
    <ul className="ml-4">
      {filteredChildCategories
        .filter((childCategory) => childCategory.isActive)
        .map((childCategory) => {
          const childCategoryQuery = buildQueryString({
            childCategory: childCategory.slug,
          });
          const childCategoryPath = `/shop?${childCategoryQuery}`;

          return (
            <li key={childCategory._id} className="px-4 py-2">
              <Link
                to={childCategoryPath}
                className="text-left w-full hover:bg-gray-100 p-1 rounded text-sm block transition-colors duration-150"
                onClick={(e) => {
                  if (isCurrentRoute && isCurrentRoute(childCategoryQuery)) {
                    e.preventDefault();
                  }
                }}
              >
                {childCategory.name}
              </Link>
            </li>
          );
        })}
    </ul>
  );
});

export default MenuBar;
