const resolveUploadUrl = (imageName) => {
  if (!imageName) return '';
  if (/^(https?:|blob:|data:)/.test(imageName)) {
    return imageName;
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  return `${apiUrl.replace('/api', '')}/uploads/${imageName}`;
};

const pulseCart = (cartBtn) => {
  cartBtn.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.3)', offset: 0.4 },
      { transform: 'scale(1)' },
    ],
    { duration: 400, easing: 'ease-out' },
  );
};

/**
 * Animates a product image flying from `sourceEl` into the header cart icon.
 * Falls back to a cart-icon pulse when the source or image is unavailable.
 */
export function flyToCart(sourceEl, imageUrl) {
  const cartBtn = document.getElementById('header-cart-button');
  if (!cartBtn) return;

  const src = sourceEl?.src || resolveUploadUrl(imageUrl);

  if (
    !src ||
    !sourceEl ||
    typeof sourceEl.getBoundingClientRect !== 'function'
  ) {
    pulseCart(cartBtn);
    return;
  }

  if (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    pulseCart(cartBtn);
    return;
  }

  const from = sourceEl.getBoundingClientRect();
  const to = cartBtn.getBoundingClientRect();

  const size = Math.min(Math.min(from.width, from.height) || 80, 96);
  const startX = from.left + from.width / 2 - size / 2;
  const startY = from.top + from.height / 2 - size / 2;

  const fly = document.createElement('img');
  fly.src = src;
  fly.alt = '';
  fly.setAttribute('aria-hidden', 'true');
  fly.style.cssText = [
    'position:fixed',
    `left:${startX}px`,
    `top:${startY}px`,
    `width:${size}px`,
    `height:${size}px`,
    'object-fit:cover',
    'border-radius:12px',
    'z-index:9999',
    'pointer-events:none',
    'box-shadow:0 10px 28px rgba(0,0,0,0.28)',
    'will-change:transform,opacity',
  ].join(';');

  document.body.appendChild(fly);

  const dx = to.left + to.width / 2 - (startX + size / 2);
  const dy = to.top + to.height / 2 - (startY + size / 2);
  const endScale = Math.max(10 / size, 0.08);
  const lift = Math.min(140, Math.max(60, Math.abs(dx) * 0.15));

  const anim = fly.animate(
    [
      { transform: 'translate(0px, 0px) scale(1) rotate(0deg)', opacity: 1 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.35 - lift}px) scale(0.55) rotate(-8deg)`,
        opacity: 1,
        offset: 0.5,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(${endScale}) rotate(6deg)`,
        opacity: 0.85,
      },
    ],
    {
      duration: 750,
      easing: 'cubic-bezier(0.22, 0.68, 0.24, 1)',
      fill: 'forwards',
    },
  );

  const finish = () => {
    fly.remove();
    pulseCart(cartBtn);
  };

  anim.onfinish = finish;
  anim.oncancel = finish;
}

export default flyToCart;
