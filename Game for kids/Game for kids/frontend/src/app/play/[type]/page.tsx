'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function PlayTypeRedirect() {
  const router = useRouter();
  const params = useParams();
  const type = params.type;

  useEffect(() => {
    if (type) {
      router.push(`/games/${type}`);
    }
  }, [type, router]);

  return null;
}
