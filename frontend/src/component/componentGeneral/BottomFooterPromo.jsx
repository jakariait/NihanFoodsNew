// import { motion } from 'framer-motion';
// import { Banknote, Headset, ShieldCheck, Truck } from 'lucide-react';
//
// const PROMOS = [
//   {
//     icon: Banknote,
//     title: 'Cash On Delivery — Pay When You Receive',
//     description: 'Cash On Delivery — fully encrypted checkout',
//   },
//   {
//     icon: Truck,
//     title: 'Fast Delivery with Pathao',
//     description:
//       'Get your order within 3 to 5 business days, anywhere in Bangladesh',
//   },
//   {
//     icon: Headset,
//     title: '24/7 Customer Support',
//     description: 'Real people ready to help — call, chat, or message anytime',
//   },
// ];
//
// const BottomFooterPromo = () => {
//   return (
//     <section className="border-y border-border/60 bg-muted/30">
//       <div className="xl:container xl:mx-auto px-4 py-8 md:py-10">
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
//           {PROMOS.map(({ icon: Icon, title, description }, index) => (
//             <motion.div
//               key={title}
//               initial={{ opacity: 0, y: 12 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.3 }}
//               transition={{
//                 duration: 0.4,
//                 delay: index * 0.07,
//                 ease: 'easeOut',
//               }}
//               className="group flex items-start gap-3.5 rounded-xl border border-border/60 bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md"
//             >
//               <span className="primaryBgColor accentTextColor inline-flex size-10 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105">
//                 <Icon className="size-5" />
//               </span>
//               <div className="min-w-0">
//                 <h3 className="text-sm font-semibold tracking-tight">
//                   {title}
//                 </h3>
//                 <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
//                   {description}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
//
// export default BottomFooterPromo;
//
// import { motion } from 'framer-motion';
// import { Banknote, Headset, Truck } from 'lucide-react';
//
// const PROMOS = [
//   {
//     icon: Banknote,
//     title: 'Cash On Delivery',
//     description:
//       'Check your order at the door, then pay in cash. No advance needed.',
//   },
//   {
//     icon: Truck,
//     title: 'Fast Delivery with Pathao',
//     description:
//       'Get your order within 3 to 5 business days, anywhere in Bangladesh.',
//   },
//   {
//     icon: Headset,
//     title: '24/7 Customer Support',
//     description: 'Real people ready to help. Call, chat, or message anytime.',
//   },
// ];
//
// const BottomFooterPromo = () => {
//   return (
//     <section className="bg-muted/30 py-8 md:py-12">
//       <div className="px-4 xl:container xl:mx-auto">
//         <div className="border-border/60 bg-card divide-border/60 grid divide-y overflow-hidden rounded-2xl border shadow-xs md:grid-cols-3 md:divide-x md:divide-y-0">
//           {PROMOS.map(({ icon: Icon, title, description }, index) => (
//             <motion.div
//               key={title}
//               initial={{ opacity: 0, y: 16 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true, amount: 0.3 }}
//               transition={{
//                 duration: 0.45,
//                 delay: index * 0.08,
//                 ease: 'easeOut',
//               }}
//               className="group hover:bg-muted/40 relative flex flex-col items-center gap-3 px-6 py-6 text-center transition-colors duration-200 md:py-8 lg:flex-row lg:items-center lg:gap-4 lg:text-left"
//             >
//               <span className="relative shrink-0">
//                 <span className="primaryBgColor absolute inset-0 rounded-full opacity-20 blur-md transition-opacity duration-300 group-hover:opacity-40" />
//                 <span className="primaryBgColor accentTextColor relative inline-flex size-12 items-center justify-center rounded-full shadow-sm ring-4 ring-white/60 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 dark:ring-white/10">
//                   <Icon className="size-5" strokeWidth={2} />
//                 </span>
//               </span>
//
//               <div className="min-w-0">
//                 <h3 className="text-sm font-semibold tracking-tight md:text-[15px]">
//                   {title}
//                 </h3>
//                 <p className="text-muted-foreground mt-1 text-xs leading-relaxed md:text-[13px]">
//                   {description}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
//
// export default BottomFooterPromo;

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote, Headset, Truck } from 'lucide-react';

const PROMOS = [
  {
    icon: Banknote,
    title: 'Cash On Delivery',
    description:
      'Check your order at the door, then pay in cash. No advance needed.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery with Pathao',
    description:
      'Get your order within 3 to 5 business days, anywhere in Bangladesh.',
  },
  {
    icon: Headset,
    title: '24/7 Customer Support',
    description: 'Real people ready to help. Call, chat, or message anytime.',
  },
];

const AUTOPLAY_MS = 3500;
const SWIPE_THRESHOLD = 50;

const PromoContent = ({ icon: Icon, title, description }) => (
  <>
    <span className="relative shrink-0">
      <span className="primaryBgColor absolute inset-0 rounded-full opacity-20 blur-md transition-opacity duration-300 group-hover:opacity-40" />
      <span className="primaryBgColor accentTextColor relative inline-flex size-12 items-center justify-center rounded-full shadow-sm ring-4 ring-white/60 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 dark:ring-white/10">
        <Icon className="size-5" strokeWidth={2} />
      </span>
    </span>

    <div className="min-w-0">
      <h3 className="text-sm font-semibold tracking-tight md:text-[15px]">
        {title}
      </h3>
      <p className="text-muted-foreground mt-1 text-xs leading-relaxed md:text-[13px]">
        {description}
      </p>
    </div>
  </>
);

const MobileSlider = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PROMOS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, index]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      setIndex((i) => (i + 1) % PROMOS.length);
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      setIndex((i) => (i - 1 + PROMOS.length) % PROMOS.length);
    }
  };

  return (
    <div
      className="md:hidden"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 32 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
        >
          {PROMOS.map((promo) => (
            <div
              key={promo.title}
              className="group flex w-full shrink-0 flex-col items-center gap-3 px-8 py-6 text-center"
            >
              <PromoContent {...promo} />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center gap-1.5 pb-4">
        {PROMOS.map((promo, i) => (
          <button
            key={promo.title}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'primaryBgColor w-6' : 'bg-border w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const BottomFooterPromo = () => {
  return (
    <section className="bg-muted/30 py-6 md:py-6">
      <div className="px-4 xl:container xl:mx-auto">
        <div className="border-border/60 bg-card overflow-hidden rounded-2xl border shadow-xs">
          {/* Mobile: auto-sliding carousel */}
          <MobileSlider />

          {/* Tablet / Desktop: 3-column strip */}
          <div className="divide-border/60 hidden divide-x md:grid md:grid-cols-3">
            {PROMOS.map((promo, index) => (
              <motion.div
                key={promo.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: 'easeOut',
                }}
                className="group hover:bg-muted/40 flex flex-col items-center gap-3 px-6 py-8 text-center transition-colors duration-200 lg:flex-row lg:gap-4 lg:text-left"
              >
                <PromoContent {...promo} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomFooterPromo;
