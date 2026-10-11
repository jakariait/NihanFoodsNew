import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { CiShoppingCart, CiHeart } from 'react-icons/ci';
import { IoPersonOutline } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoIosLogOut } from 'react-icons/io';
import Skeleton from 'react-loading-skeleton';

import GeneralInfoStore from '../../store/GeneralInfoStore';
import useCartStore from '../../store/useCartStore';
import useAuthUserStore from '../../store/AuthUserStore';
import useWishlistStore from '../../store/useWishlistStore';

import ImageComponent from './ImageComponent';
import MenuBar from './MenuBar';
import MobileMenu from './MobileMenu';
import Cart from './Cart';
import HeaderSearch, { MobileSearchSheet } from './HeaderSearch.jsx';
import MobileBottomNav from './MobileBottomNav';

const iconBtn =
  'relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400';

const badge =
  'absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ring-2 ring-white primaryBgColor accentTextColor';

const avatarBase =
  'h-10 w-10 rounded-full object-cover flex items-center justify-center ring-2 ring-white shadow-sm transition-transform duration-200 hover:scale-105';

const Headers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { GeneralInfoList, GeneralInfoListLoading, GeneralInfoListError } =
    GeneralInfoStore();
  const { cart } = useCartStore();
  const { user, logout } = useAuthUserStore();
  const { wishlist } = useWishlistStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const cartButtonRef = useRef(null);
  const cartMenuRef = useRef(null);
  const headerMainRef = useRef(null);

  const prevCartCount = useRef(
    cart.reduce((total, item) => total + item.quantity, 0),
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop only: while the bar is fixed, keep the spacer in sync with the
  // real height (logo skeleton -> image load, font load, zoom, etc.)
  useEffect(() => {
    if (!isSticky || !headerMainRef.current) return;
    if (window.innerWidth < 1024) return;
    const el = headerMainRef.current;
    const measure = () => setHeaderHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isSticky]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      if (
        cartMenuRef.current &&
        !cartMenuRef.current.contains(event.target) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target)
      ) {
        setIsCartMenuOpen(false);
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isMenuOpen || isCartMenuOpen || isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isCartMenuOpen, isDropdownOpen]);

  useEffect(() => {
    const currentCartCount = cart.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    if (
      currentCartCount > prevCartCount.current &&
      !window.location.pathname.includes('/checkout')
    ) {
      setIsCartMenuOpen(true);
    }
    prevCartCount.current = currentCartCount;
  }, [cart]);

  // Close drawers on Escape (mobile search sheet handles its own Escape)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsCartMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The mobile panel has no place once the desktop search is visible
  useEffect(() => {
    if (!isMobileSearchOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMobileSearchOpen]);

  // Navigating away should not leave the panel hanging open
  useEffect(() => {
    setIsMobileSearchOpen(false);
  }, [location.pathname, location.search]);

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      {GeneralInfoListError ? (
        <div className="primaryTextColor container md:mx-auto text-center p-3">
          <h1>Something went wrong! Please try again later.</h1>
        </div>
      ) : GeneralInfoListLoading ? (
        <div className="xl:container xl:mx-auto p-3">
          <Skeleton height={56} borderRadius={16} />
        </div>
      ) : (
        <>
          {/* Sticky top bar — on mobile the parent is the whole page column,
              so it pins for the full scroll (marquee above scrolls away
              first). On desktop it stays in flow until scrolled, then fixed.
              Only the bar lives here: position:sticky creates a stacking
              context, and the drawers below need their z-50 free. */}
          <div className="sticky top-0 z-40 lg:static lg:z-auto">
            {/* Desktop: spacer keeps layout steady while the bar is fixed on scroll */}
            {isSticky && (
              <div
                className="hidden lg:block"
                style={{ height: headerHeight }}
                aria-hidden="true"
              />
            )}

            {/* Header main — sticky comes from the wrapper on mobile;
                fixed on desktop only after scrolling */}
            <div
              ref={headerMainRef}
              className={`relative z-40 w-full ${
                isSticky ? 'lg:fixed lg:top-0 lg:left-0 lg:right-0' : ''
              }`}
            >
              <div
                className={`flex w-full items-center gap-2 md:gap-4 border-b border-gray-200 bg-white/90 px-3 py-3 md:px-6 lg:px-10 backdrop-blur-md transition-shadow duration-300 ${
                  isSticky ? 'shadow-md' : ''
                }`}
              >
                {/* Hamburger */}
                <button
                  ref={hamburgerRef}
                  onClick={() => {
                    setIsMenuOpen((p) => !p);
                    setIsMobileSearchOpen(false);
                  }}
                  className={`${iconBtn} lg:hidden`}
                  aria-label="Toggle menu"
                  aria-expanded={isMenuOpen}
                >
                  <GiHamburgerMenu className="text-xl" />
                </button>

                {/* Logo */}
                <Link to="/" className="shrink-0" aria-label="Home">
                  <ImageComponent
                    imageName={GeneralInfoList?.PrimaryLogo}
                    className="w-30 h-10"
                    altName={GeneralInfoList?.CompanyName}
                    skeletonHeight={'10'}
                  />
                </Link>

                {/* Search — desktop only, mobile uses the bottom bar trigger */}
                <div className="flex min-w-0 flex-1 items-center md:mx-4 lg:mx-8">
                  <HeaderSearch />
                </div>

                {/* Actions */}
                <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-2">
                  <Link
                    to="/user/wishlist"
                    className={`${iconBtn} hidden lg:flex`}
                    aria-label="Wishlist"
                  >
                    <CiHeart className="h-7 w-7" />
                    {wishlist.length > 0 && (
                      <span className={badge}>{wishlist.length}</span>
                    )}
                  </Link>

                  <button
                    ref={cartButtonRef}
                    onClick={() => {
                      setIsCartMenuOpen((p) => !p);
                      setIsMobileSearchOpen(false);
                    }}
                    className={iconBtn}
                    aria-label="Shopping cart"
                    aria-expanded={isCartMenuOpen}
                  >
                    <CiShoppingCart className="h-7 w-7" />
                    {totalQuantity > 0 && (
                      <span className={badge}>{totalQuantity}</span>
                    )}
                  </button>

                  {user ? (
                    <div className="relative ml-1 hidden lg:block">
                      <button
                        ref={buttonRef}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                        aria-label="User menu"
                        aria-expanded={isDropdownOpen}
                      >
                        {user?.userImage &&
                        typeof user.userImage === 'string' &&
                        user.userImage.trim() !== '' ? (
                          <ImageComponent
                            imageName={user.userImage}
                            className={`${avatarBase} primaryBgColor accentTextColor`}
                          />
                        ) : (
                          <span
                            className={`${avatarBase} primaryBgColor accentTextColor text-base font-semibold`}
                          >
                            {(user?.fullName &&
                              user.fullName.trim().charAt(0).toUpperCase()) ||
                              'U'}
                          </span>
                        )}
                      </button>

                      {isDropdownOpen && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 animate-fadeIn"
                        >
                          <div className="border-b border-gray-100 px-4 py-3">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {user?.fullName || 'My account'}
                            </p>
                            {user?.email && (
                              <p className="truncate text-xs text-gray-500">
                                {user.email}
                              </p>
                            )}
                          </div>
                          <div className="p-2">
                            <Link
                              to="/user/home"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                            >
                              <IoPersonOutline className="h-5 w-5" />
                              My Account
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                              aria-label="Log out"
                            >
                              <IoIosLogOut
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              Log Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      aria-label="Login or register"
                      className="ml-1 hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-medium primaryBgColor accentTextColor transition-opacity hover:opacity-90 lg:flex"
                    >
                      <IoPersonOutline className="h-5 w-5" aria-hidden="true" />
                      <span className="hidden md:inline">Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu — sibling of the sticky wrapper so its z-50 wins */}
          <div
            className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
              isMenuOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <div
              ref={menuRef}
              className="relative flex h-full w-72 max-w-[85%] flex-col rounded-r-md bg-white shadow-2xl transition-transform duration-300 ease-out"
              style={{
                transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
              }}
            >
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <Link
                  to="/"
                  aria-label="Home"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ImageComponent
                    imageName={GeneralInfoList?.PrimaryLogo}
                    className="w-30"
                    altName={GeneralInfoList?.CompanyName}
                  />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={iconBtn}
                  aria-label="Close menu"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                <MobileMenu />
              </div>

              <div className="border-t border-gray-100 p-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 primaryBgColor accentTextColor"
                    aria-label="Log out"
                  >
                    <IoIosLogOut className="text-xl" aria-hidden="true" />
                    Log Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Login or register"
                    className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 primaryBgColor accentTextColor"
                  >
                    <IoPersonOutline className="h-5 w-5" aria-hidden="true" />
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Cart Drawer */}
          <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
              isCartMenuOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsCartMenuOpen(false)}
            />
            <div
              ref={cartMenuRef}
              className="fixed right-0 top-0 flex h-full w-[360px] max-w-full flex-col rounded-l-md bg-white shadow-2xl transition-transform duration-300 ease-out"
              style={{
                transform: isCartMenuOpen
                  ? 'translateX(0)'
                  : 'translateX(100%)',
              }}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your cart
                  </h2>
                  <span className="text-sm text-gray-500">
                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartMenuOpen(false)}
                  className={iconBtn}
                  aria-label="Close cart"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                <Cart onCloseCartMenu={() => setIsCartMenuOpen(false)} />
              </div>
            </div>
          </div>

          {/* MenuBar (Desktop) */}
          <div className="hidden lg:block">
            <MenuBar />
          </div>
        </>
      )}

      {/* Bottom navigation (Mobile) — always available */}
      <MobileBottomNav
        user={user}
        wishlistCount={wishlist.length}
        onOpenSearch={() => {
          setIsMenuOpen(false);
          setIsCartMenuOpen(false);
          setIsDropdownOpen(false);
          setIsMobileSearchOpen(true);
        }}
      />

      {/* Mobile search: modern bottom sheet */}
      {isMobileSearchOpen && (
        <MobileSearchSheet onClose={() => setIsMobileSearchOpen(false)} />
      )}
    </>
  );
};

export default Headers;
