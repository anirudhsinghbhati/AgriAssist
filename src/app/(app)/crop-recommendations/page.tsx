
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CropRecommendationForm from "@/components/crop-recommendation-form";
import { useTranslation } from "@/hooks/use-translation";

export default function CropRecommendationsPage() {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('crop_recommendations.title')}</CardTitle>
                <CardDescription>
                    {t('crop_recommendations.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CropRecommendationForm />
            </CardContent>
        </Card>
    );
}
