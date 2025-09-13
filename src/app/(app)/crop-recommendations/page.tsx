import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CropRecommendationForm from "@/components/crop-recommendation-form";

export default function CropRecommendationsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Personalized Crop Recommendations</CardTitle>
                <CardDescription>
                    Fill in the details about your farm to receive AI-powered crop suggestions tailored to your conditions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CropRecommendationForm />
            </CardContent>
        </Card>
    );
}
