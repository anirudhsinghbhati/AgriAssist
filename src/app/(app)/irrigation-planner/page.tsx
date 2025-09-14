import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import IrrigationPlannerForm from "@/components/irrigation-planner-form";

export default function IrrigationPlannerPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Smart Irrigation Planner</CardTitle>
                <CardDescription>
                    Get AI-powered irrigation schedules to optimize water usage and improve crop health based on real-time data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <IrrigationPlannerForm />
            </CardContent>
        </Card>
    );
}
