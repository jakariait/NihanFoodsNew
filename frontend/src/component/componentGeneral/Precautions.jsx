// import { FaExclamationTriangle } from 'react-icons/fa';
//
// const Precautions = ({ product }) => {
//   const precautions = (product?.precautions || []).filter((p) => p && p.trim());
//
//   if (precautions.length === 0) return null;
//
//   return (
//     <div className="flex flex-col gap-1.5">
//       <h2 className="text-base md:text-xl leading-tight">Precautions</h2>
//       <ul className="flex flex-col gap-1">
//         {precautions.map((precaution, index) => (
//           <li
//             key={index}
//             className="flex items-start gap-2 text-sm md:text-base text-gray-700"
//           >
//             <FaExclamationTriangle className="text-amber-500 mt-1 shrink-0" />
//             <span>{precaution}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
//
// export default Precautions;

import { FaExclamationTriangle } from 'react-icons/fa';

const Precautions = ({ product }) => {
  const raw = product?.precautions;
  const precautions = (Array.isArray(raw) ? raw : String(raw || '').split('\n'))
    .map((p) => String(p).trim())
    .filter(Boolean);

  if (precautions.length === 0) return null;

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3 md:mb-4">
        <span className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
          <FaExclamationTriangle className="text-sm md:text-base" />
        </span>
        <h2 className="text-base md:text-xl font-semibold leading-tight text-gray-900">
          Precautions
        </h2>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-2">
        {precautions.map((precaution, index) => (
          <li
            key={`${index}-${precaution.slice(0, 12)}`}
            className="flex items-start gap-3 rounded-xl border border-amber-200/70 bg-white p-3 md:p-4 shadow-sm"
          >
            <span
              aria-hidden="true"
              className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500"
            />
            <p className="flex-1 text-sm md:text-base leading-relaxed text-gray-700">
              {precaution}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Precautions;
