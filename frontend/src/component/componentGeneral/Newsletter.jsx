import { Mail } from 'lucide-react';
import NewsletterForm from './NewsletterForm.jsx';

const Newsletter = ({ variant = 'desktop' }) => {
  if (variant === 'mobile') {
    return (
      <div className="overflow-hidden rounded-2xl border primaryBorderColor bg-white/5">
        <div className="primaryBgColor accentTextColor flex items-center gap-3 px-4 py-3">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Mail className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold leading-tight">Newsletter</h2>
            <p className="text-xs text-white/70">Offers &amp; updates, no spam</p>
          </div>
        </div>
        <div className="p-4">
          <p className="mb-1 text-sm text-white/70">
            Take advantage of our special offer. Do not worry, we would not
            spam you.
          </p>
          <NewsletterForm />
        </div>
      </div>
    );
  }

  return (
    <div className={'col-span-3 relative '}>
      <div className="overflow-hidden rounded-2xl border primaryBorderColor bg-white/5">
        <div className="primaryBgColor accentTextColor flex items-center gap-3 px-6 py-4">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Mail className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold leading-tight">Newsletters</h2>
            <p className="text-xs text-white/70">
              Get offers &amp; updates first
            </p>
          </div>
        </div>
        <div className="p-6">
          <p className="mb-1 text-sm text-white/70">
            Take advantage of our special offer. Do not worry, we would not
            spam you
          </p>
          {/*Newsletters Form*/}
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
