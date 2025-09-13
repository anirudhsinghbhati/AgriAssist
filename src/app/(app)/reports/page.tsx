import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reports &amp; Analytics</CardTitle>
                <CardDescription>
                    Track your farm's productivity, soil health, and get yield predictions. This feature will be available soon.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Coming Soon!</h2>
                    <p className="text-muted-foreground mt-2">Detailed analytics to help you make data-driven decisions for your farm are coming.</p>
                    <Button className="mt-6">Notify Me</Button>
                </div>
            </CardContent>
        </Card>
    );
}
