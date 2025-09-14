import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import YieldPredictionForm from "@/components/yield-prediction-form";

export default function YieldPredictionPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>AI-Powered Yield Prediction</CardTitle>
                <CardDescription>
                    Fill in your farm's details to receive an AI-generated estimate of your upcoming harvest.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <YieldPredictionForm />
            </CardContent>
        </Card>
    );
}
