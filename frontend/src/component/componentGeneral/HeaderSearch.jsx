import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import { MdClose } from 'react-icons/md';

const HeaderSearch = () => {
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="hidden lg:flex items-center w-full max-w-md">
      <div className="group relative flex items-center w-full rounded-full border border-gray-200 bg-gray-50 transition-all duration-300 hover:border-gray-300 hover:bg-white focus-within:bg-white focus-within:border-[var(--primaryColor)] focus-within:ring-4 focus-within:ring-[var(--primaryColor)]/10">
        <CiSearch className="absolute left-4 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-[var(--primaryColor)]" />

        <input
          type="text"
          placeholder="Search for products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
          className="w-full bg-transparent py-2.5 pl-11 pr-24 text-sm text-gray-800 placeholder:text-gray-400 outline-none"
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
          onClick={handleSearch}
          className="primaryBgColor accentTextColor absolute right-1 top-1/2 -translate-y-1/2 h-9 px-4 rounded-full text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default HeaderSearch;
