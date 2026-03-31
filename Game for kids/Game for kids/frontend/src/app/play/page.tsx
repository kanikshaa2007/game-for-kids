'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PlayIndex() {
  const router = useRouter();

  useEffect(() => {
    router.push('/games');
  }, [router]);

  return null;
}
