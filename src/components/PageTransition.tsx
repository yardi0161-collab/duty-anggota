import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Page } from '../types';
import { swapStyle, useSwap } from '../lib';

const ORDER: Page[] = ['home', 'absensi', 'laporan', 'log', 'book', 'bar', 'profile'];

interface Props {
  page: Page;
  render: (p: Page) => ReactNode;
}

export default function PageTransition({ page, render }: Props) {
  const { shown, phase } = useSwap<Page>(page, 150);
  const dir = useRef(1);
  if (page !== shown) dir.current = ORDER.indexOf(page) >= ORDER.indexOf(shown) ? 1 : -1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [shown]);

  return <div style={swapStyle(phase, dir.current, 150, 12)}>{render(shown)}</div>;
}
