
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PestDetectionPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/ai-tools?tab=pest-detection');
    }, [router]);
    
    return null;
}
