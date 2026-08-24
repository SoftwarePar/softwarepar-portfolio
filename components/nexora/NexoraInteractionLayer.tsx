'use client';

import { useEffect, useState } from 'react';

export default function NexoraInteractionLayer() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const onMove = (event: PointerEvent) => {
      root.style.setProperty('--nx-pointer-x', `${event.clientX}px`);
      root.style.setProperty('--nx-pointer-y', `${event.clientY}px`);
      setActive(true);
    };
    const onLeave = () => setActive(false);
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('button') : null;
      if (!(target instanceof HTMLButtonElement) || target.disabled) return;
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'nx-ripple';
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      target.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 620);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') root.dataset.nxKeyboard = 'true';
    };
    const onPointerDown = () => delete root.dataset.nxKeyboard;

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    document.addEventListener('click', onClick, true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return <div aria-hidden className={`nx-pointer-aura ${active ? 'is-active' : ''}`} />;
}
