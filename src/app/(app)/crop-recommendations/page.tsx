
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CropRecommendationsPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/ai-tools');
    }, [router]);
    
    return null;
}
