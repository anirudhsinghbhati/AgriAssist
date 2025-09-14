
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PestDetectionForm from "@/components/pest-detection-form";
import { useTranslation } from "@/hooks/use-translation";

export default function PestDetectionPage() {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('pest_detection.title')}</CardTitle>
                <CardDescription>
                    {t('pest_detection.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PestDetectionForm />
            </CardContent>
        </Card>
    );
}
