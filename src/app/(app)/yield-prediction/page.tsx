
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function YieldPredictionPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/ai-tools?tab=yield-prediction');
    }, [router]);
    
    return null;
}
