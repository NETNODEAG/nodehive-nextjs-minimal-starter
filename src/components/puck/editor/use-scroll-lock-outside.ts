'use client';

import { useEffect } from 'react';

/**
 * Locks the document's background scroll while `active` is true, without
 * touching <html>/<body> styles — so libraries that mirror those attributes
 * into child iframes (e.g. Puck's CopyHostStyles) don't freeze those
 * iframes' own scroll.
 *
 * Works by intercepting wheel and touchmove on the document and only
 * letting events through when a scrollable ancestor inside an element
 * matching `allowSelector` can consume them. Events anywhere else get
 * preventDefault'd, so scroll can't chain to the body behind the overlay.
 *
 * Skips in iframes so the preview document isn't affected.
 */
export function useScrollLockOutside(
  active: boolean,
  allowSelector: string
): void {
  useEffect(() => {
    if (!active) return;
    if (typeof window !== 'undefined' && window.self !== window.top) return;

    const canConsumeScroll = (el: Element, deltaY: number): boolean => {
      const style = getComputedStyle(el);
      if (!/auto|scroll|overlay/.test(style.overflowY)) return false;
      const he = el as HTMLElement;
      if (he.scrollHeight <= he.clientHeight) return false;
      if (deltaY < 0 && he.scrollTop <= 0) return false;
      if (deltaY > 0 && he.scrollTop + he.clientHeight >= he.scrollHeight)
        return false;
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      const target = e.target as Element | null;
      const allow = target?.closest?.(allowSelector);
      if (!allow) {
        e.preventDefault();
        return;
      }
      let el: Element | null = target;
      while (el && el !== allow) {
        if (canConsumeScroll(el, e.deltaY)) return;
        el = el.parentElement;
      }
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest?.(allowSelector)) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, [active, allowSelector]);
}
