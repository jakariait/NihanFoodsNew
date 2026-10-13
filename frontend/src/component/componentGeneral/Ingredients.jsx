// import { FaCheck } from 'react-icons/fa';
//
// const Ingredients = ({ product }) => {
//   const ingredients = (product?.ingredients || []).filter((i) => i && i.trim());
//
//   if (ingredients.length === 0) return null;
//
//   return (
//     <div className="flex flex-col gap-1.5">
//       <h2 className="text-base md:text-xl leading-tight">Ingredients</h2>
//       <ul className="flex flex-col gap-1">
//         {ingredients.map((ingredient, index) => (
//           <li
//             key={index}
//             className="flex items-start gap-2 text-sm md:text-base text-gray-700"
//           >
//             <FaCheck className="text-[#2E7D31] mt-1 shrink-0" />
//             <span>{ingredient}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
//
// export default Ingredients;

import { useState } from 'react';
import { FaLeaf, FaCheck } from 'react-icons/fa';

const VISIBLE_COUNT = 8;

const Ingredients = ({ product }) => {
  const raw = product?.ingredients;
  const ingredients = (Array.isArray(raw) ? raw : String(raw || '').split(','))
    .map((i) => String(i).trim())
    .filter(Boolean);

  const [showAll, setShowAll] = useState(false);

  if (ingredients.length === 0) return null;

  const hasMore = ingredients.length > VISIBLE_COUNT;
  const visible = showAll ? ingredients : ingredients.slice(0, VISIBLE_COUNT);

  return (
    <section className="rounded-2xl border border-[#2E7D31]/15 bg-[#F4FAF4] p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 md:mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-[#2E7D31] text-white">
            <FaLeaf className="text-sm md:text-base" />
          </span>
          <h2 className="text-base md:text-xl font-semibold leading-tight text-gray-900">
            Ingredients
          </h2>
        </div>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs md:text-sm font-medium text-[#2E7D31] border border-[#2E7D31]/20">
          {ingredients.length} {ingredients.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Chips */}
      <ul className="flex flex-wrap gap-2">
        {visible.map((ingredient, index) => (
          <li
            key={`${ingredient}-${index}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#2E7D31]/20 bg-white px-3 py-1.5 text-sm md:text-base text-gray-700 shadow-sm transition hover:border-[#2E7D31]/50 hover:shadow"
          >
            <FaCheck className="shrink-0 text-[10px] md:text-xs text-[#2E7D31]" />
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>

      {/* Toggle */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 text-sm font-medium text-[#2E7D31] hover:underline"
        >
          {showAll
            ? 'Show less'
            : `Show ${ingredients.length - VISIBLE_COUNT} more`}
        </button>
      )}
    </section>
  );
};

export default Ingredients;
