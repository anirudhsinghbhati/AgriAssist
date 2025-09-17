
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function IrrigationPlannerPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/ai-tools?tab=irrigation-planner');
    }, [router]);
    
    return null;
}
