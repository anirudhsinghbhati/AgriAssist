import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PestDetectionForm from "@/components/pest-detection-form";

export default function PestDetectionPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Pest & Disease Detection</CardTitle>
                <CardDescription>
                    Upload a photo of an affected crop, and our AI will analyze it to identify potential pests or diseases and suggest treatments.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PestDetectionForm />
            </CardContent>
        </Card>
    );
}
