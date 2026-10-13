// const HowToUse = ({ product }) => {
//   const steps = (product?.howToUse || []).filter((s) => s && s.trim());
//
//   if (steps.length === 0) return null;
//
//   return (
//     <section className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
//       <h2 className="text-base md:text-xl font-semibold leading-tight text-gray-900">
//         {product.name} ব্যাবহারের নিয়ম
//       </h2>
//
//       <ol className="flex flex-col">
//         {steps.map((step, index) => {
//           const isLast = index === steps.length - 1;
//
//           return (
//             <li key={index} className="relative flex gap-3 md:gap-4">
//               {/* Number + connecting line */}
//               <div className="flex flex-col items-center">
//                 <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold primaryBgColor accentTextColor ring-4 ring-white">
//                   {index + 1}
//                 </span>
//                 {!isLast && (
//                   <span
//                     aria-hidden="true"
//                     className="my-1 w-px flex-1 border-l-2 border-dashed border-gray-200"
//                   />
//                 )}
//               </div>
//
//               {/* Step text */}
//               <p
//                 className={`flex-1 text-sm md:text-base leading-relaxed text-gray-700 pt-0.5 ${
//                   isLast ? 'pb-0' : 'pb-4'
//                 }`}
//               >
//                 {step}
//               </p>
//             </li>
//           );
//         })}
//       </ol>
//     </section>
//   );
// };
//
// export default HowToUse;

import { useState } from 'react';
import { FaListOl } from 'react-icons/fa';

const VISIBLE_COUNT = 4;

const HowToUse = ({ product }) => {
  const raw = product?.howToUse;
  const steps = (Array.isArray(raw) ? raw : String(raw || '').split('\n'))
    .map((s) => String(s).trim())
    .filter(Boolean);

  const [showAll, setShowAll] = useState(false);

  if (steps.length === 0) return null;

  const hasMore = steps.length > VISIBLE_COUNT;
  const visible = showAll ? steps : steps.slice(0, VISIBLE_COUNT);

  return (
    <section className="rounded-2xl border border-[#2E7D31]/15 bg-[#F4FAF4] p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-[#2E7D31] text-white">
          <FaListOl className="text-sm md:text-base" />
        </span>
        <h2 className="text-base md:text-xl font-semibold leading-tight text-gray-900">
          {product?.name} ব্যবহারের নিয়ম
        </h2>
      </div>

      {/* Steps */}
      <ol className="flex flex-col gap-2.5">
        {visible.map((step, index) => (
          <li
            key={`${index}-${step.slice(0, 12)}`}
            className="flex items-start gap-3 rounded-xl border border-[#2E7D31]/15 bg-white p-3 md:p-4 shadow-sm"
          >
            <span className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-[#2E7D31]/10 text-xs md:text-sm font-bold text-[#2E7D31]">
              {index + 1}
            </span>
            <p className="flex-1 pt-0.5 text-sm md:text-base leading-relaxed text-gray-700">
              {step}
            </p>
          </li>
        ))}
      </ol>

      {/* Toggle */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 text-sm font-medium text-[#2E7D31] hover:underline"
        >
          {showAll
            ? 'কম দেখুন'
            : `আরও ${steps.length - VISIBLE_COUNT}টি ধাপ দেখুন`}
        </button>
      )}
    </section>
  );
};

export default HowToUse;
