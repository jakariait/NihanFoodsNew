import { Link, useLocation } from 'react-router-dom';
import { CiSearch, CiHeart } from 'react-icons/ci';
import { MdHome } from 'react-icons/md';
import { IoPersonOutline } from 'react-icons/io5';

const itemBase =
  'relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors';

const badgeCls =
  'absolute -top-0.5 right-1/2 translate-x-4 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ring-2 ring-white primaryBgColor accentTextColor';

const MobileBottomNav = ({ wishlistCount = 0, user, onOpenSearch }) => {
  const { pathname } = useLocation();

  const renderItem = ({ key, label, icon, to, onClick, active, badge }) => {
    const content = (
      <>
        {icon}
        <span>{label}</span>
        {badge > 0 && <span className={badgeCls}>{badge}</span>}
      </>
    );

    const className = `${itemBase} ${
      active ? 'primaryTextColor' : 'text-gray-500 hover:text-gray-800'
    }`;

    if (onClick) {
      return (
        <button
          key={key}
          onClick={onClick}
          className={`${className} cursor-pointer`}
          aria-label={label}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={key}
        to={to}
        className={className}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </Link>
    );
  };

  const items = [
    {
      key: 'search',
      label: 'Search',
      icon: <CiSearch className="h-6 w-6" />,
      onClick: onOpenSearch,
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      icon: <CiHeart className="h-6 w-6" />,
      to: '/user/wishlist',
      badge: wishlistCount,
      active: pathname.startsWith('/user/wishlist'),
    },
    {
      key: 'home',
      label: 'Home',
      icon: <MdHome className="h-6 w-6" />,
      to: '/',
      active: pathname === '/',
    },
    user
      ? {
          key: 'account',
          label: 'Account',
          icon: <IoPersonOutline className="h-6 w-6" />,
          to: '/user/home',
          active: pathname.startsWith('/user'),
        }
      : {
          key: 'login',
          label: 'Login',
          icon: <IoPersonOutline className="h-6 w-6" />,
          to: '/login',
          active: pathname === '/login',
        },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 z-40 w-screen lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch border-t border-gray-200 bg-white/95 px-1 backdrop-blur-md shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.25)] pb-[env(safe-area-inset-bottom)]">
        {items.map(renderItem)}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
