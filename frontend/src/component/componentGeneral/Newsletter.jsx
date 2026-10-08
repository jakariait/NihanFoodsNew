import { motion } from 'framer-motion';
import { Mail, Sparkles, ShieldCheck, BellRing } from 'lucide-react';
import NewsletterForm from './NewsletterForm.jsx';

const perks = [
  { icon: BellRing, label: 'Fresh offers first' },
  { icon: ShieldCheck, label: 'No spam, ever' },
];

const Newsletter = ({ variant = 'desktop' }) => {
  if (variant === 'mobile') {
    return (
      <div className="primaryBgGradient accentTextColor relative overflow-hidden rounded-2xl p-5 shadow-sm">
        <div className="accentBgFaint pointer-events-none absolute -top-10 -right-8 size-32 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-3">
          <span className="accentBgSoft accentRingSoft inline-flex size-9 shrink-0 items-center justify-center rounded-xl ring-1">
            <Mail className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Newsletter</h3>
            <p className="accentTextMuted text-xs">
              Offers &amp; updates, no spam
            </p>
          </div>
        </div>
        <p className="accentTextSoft relative mt-4 text-sm">
          Get early access to seasonal deals and new arrivals.
        </p>
        <NewsletterForm tone="onPrimary" className="mt-4" />
      </div>
    );
  }

  return (
    <section className="primaryBgGradient accentTextColor relative overflow-hidden  shadow-sm">
      <div className="accentBgFaint pointer-events-none absolute -top-24 -right-16 size-72 rounded-full blur-3xl" />
      <div className="secondaryBgFaint pointer-events-none absolute -bottom-24 -left-10 size-64 rounded-full blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 p-6 md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <span className="accentBgSoft accentRingSoft inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1">
            <Sparkles className="size-3.5" />
            Join the list
          </span>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
            Stay in the loop, taste the best deals
          </h2>
          <p className="accentTextMuted mt-2 max-w-md text-sm leading-relaxed">
            Be the first to know about new arrivals, seasonal offers and
            insider-only discounts. Unsubscribe whenever you want.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {perks.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="accentTextSoft inline-flex items-center gap-2 text-xs"
              >
                <Icon className="size-3.5" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
          className="accentBgSoft accentRingSoft rounded-xl p-4 ring-1 backdrop-blur-sm md:p-5"
        >
          <NewsletterForm tone="onPrimary" className="mt-3" />
          <p className="accentTextFaint mt-3 text-xs">
            We only send the good stuff. No spam, ever.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
