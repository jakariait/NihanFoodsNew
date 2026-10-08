import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CircularProgress } from '@/components/ui/circular-progress';
import { cn } from '@/lib/utils';
import useNewsletterStore from '../../store/useNewsletterStore.js'; // Adjust the path as needed

const tones = {
  onPrimary: {
    wrap: 'accentBgColor',
    icon: 'secondaryTextMuted',
    input:
      'h-10 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0 secondaryTextColor secondaryPlaceholder',
    button:
      'primaryBgColor accentTextColor h-10 cursor-pointer hover:opacity-90',
    success: 'accentTextColor',
    error: 'accentTextAlert',
  },
  plain: {
    wrap: '',
    icon: 'text-muted-foreground',
    input: 'h-10 pl-9',
    button: 'h-10 cursor-pointer',
    success: 'text-primary',
    error: 'text-destructive',
  },
};

export default function NewsletterForm({
  tone = 'plain',
  className,
  onSuccess,
}) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const { subscribe, isLoading, error } = useNewsletterStore();

  const styles = tones[tone] ?? tones.plain;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setStatus('idle');

    if (!email.trim()) {
      setMessage('Please enter an email.');
      setStatus('error');
      return;
    }

    // Await the subscribe call and get a success boolean
    const success = await subscribe(email);

    if (success) {
      setMessage('You are on the list!');
      setStatus('success');
      setEmail('');
      onSuccess?.();
    } else {
      // Use the updated error from the store if available
      setMessage(error || 'Subscription failed');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className={cn('relative flex-1', styles.wrap)}>
          <Mail
            className={cn(
              'pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2',
              styles.icon,
            )}
          />
          <Input
            type="email"
            aria-label="Email address"
            placeholder="you@example.com"
            className={cn(styles.input)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className={cn('shrink-0', styles.button)}
        >
          {isLoading ? (
            <>
              <CircularProgress color="inherit" size={16} />
              Subscribing
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={cn(
            'mt-3 inline-flex items-center gap-1.5 text-xs',
            status === 'success' ? styles.success : styles.error,
          )}
        >
          {status === 'success' ? (
            <CheckCircle2 className="size-3.5" />
          ) : (
            <CircleAlert className="size-3.5" />
          )}
          {message}
        </p>
      )}
    </form>
  );
}
