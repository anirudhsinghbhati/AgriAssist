import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConsultationPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Expert Consultation</CardTitle>
                <CardDescription>
                    Get one-on-one advice from agricultural specialists via chat, voice, or video. This feature is under development.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Coming Soon!</h2>
                    <p className="text-muted-foreground mt-2">Direct access to agricultural experts is on its way.</p>
                    <Button className="mt-6">Notify Me</Button>
                </div>
            </CardContent>
        </Card>
    );
}
