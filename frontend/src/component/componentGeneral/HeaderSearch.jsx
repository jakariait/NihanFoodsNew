import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import { MdClose } from 'react-icons/md';

const useProductSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || '',
  );

  const handleSearch = () => {
    const term = searchInput.trim();
    if (term) {
      navigate(`/shop?search=${encodeURIComponent(term)}&page=1`);
    }
  };

  return { searchInput, setSearchInput, handleSearch };
};

export const SearchField = ({ inputRef, onSearch }) => {
  const { searchInput, setSearchInput, handleSearch } = useProductSearch();

  const submit = () => {
    handleSearch();
    onSearch?.();
  };

  return (
    <div className="group relative flex w-full min-w-0 items-center rounded-full border border-gray-200 bg-gray-50 transition-all duration-300 hover:border-gray-300 hover:bg-white focus-within:bg-white focus-within:border-[var(--primaryColor)] focus-within:ring-4 focus-within:ring-[var(--primaryColor)]/10">
      <CiSearch className="pointer-events-none absolute left-3.5 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-[var(--primaryColor)]" />

      <input
        ref={inputRef}
        type="search"
        placeholder="Search for products..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        aria-label="Search products"
        autoComplete="off"
        className="w-full min-w-0 bg-transparent py-2.5 pl-11 pr-24 text-sm text-gray-800 placeholder:text-gray-400 outline-none [&::-webkit-search-cancel-button]:hidden"
      />

      {searchInput && (
        <button
          onClick={() => setSearchInput('')}
          className="absolute right-[5.5rem] cursor-pointer text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Clear search"
        >
          <MdClose className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={submit}
        className="primaryBgColor accentTextColor absolute right-1 top-1/2 -translate-y-1/2 h-9 px-4 rounded-full text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
        aria-label="Submit search"
      >
        Search
      </button>
    </div>
  );
};

const HeaderSearch = () => (
  <div className="hidden lg:flex w-full max-w-md items-center">
    <SearchField />
  </div>
);

export const MobileSearchSheet = ({ onClose }) => {
  const inputRef = useRef(null);
  const dragStartY = useRef(0);
  const [visible, setVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    // Double rAF: ensure the off-screen position is painted first so the
    // slide-up transition always plays (a single rAF can race the paint)
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true));
    });
    const focusTimer = setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      80,
    );
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setDragY(0);
    setTimeout(onClose, 320);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const handleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    setDragY(dy > 0 ? dy : 0);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    if (dragY > 80) close();
    else setDragY(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
      />

      {/* Sheet */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_40px_rgba(0,0,0,0.18)]"
        style={{
          transform: visible
            ? `translate3d(0, ${dragY}px, 0)`
            : 'translate3d(0, 100%, 0)',
          transition: dragging
            ? 'none'
            : 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Drag handle */}
        <div
          className="touch-none px-4 pt-3 pb-1"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div className="mx-auto h-1.5 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="px-4 pt-2 pb-4">
          <SearchField inputRef={inputRef} onSearch={close} />
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
