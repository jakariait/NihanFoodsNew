import { FaCheck, FaLeaf } from 'react-icons/fa';

const ProductBenefits = ({ product }) => {
  const benefits = (product?.benefits || []).filter((b) => b && b.trim());

  if (benefits.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#2E7D31]/15 bg-gradient-to-br from-[#F3FAF3] to-white p-4 md:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-[#2E7D31]/10">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E7D31] text-white">
          <FaLeaf className="text-sm" />
        </span>
        <h2 className="text-base md:text-xl font-semibold leading-tight text-gray-900">
          {product.name} এর উপকারিতা
        </h2>
      </div>

      {/* List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 text-sm md:text-base text-gray-700"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2E7D31]/10">
              <FaCheck className="text-[#2E7D31] text-[10px]" />
            </span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductBenefits;
