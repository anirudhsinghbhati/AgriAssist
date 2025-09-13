import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Community Forum</CardTitle>
                <CardDescription>
                    Connect with local farmers, share success stories, and get answers from experts. This feature is coming soon!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Coming Soon!</h2>
                    <p className="text-muted-foreground mt-2">We are working hard to bring you a platform to connect and grow together.</p>
                    <Button className="mt-6">Notify Me</Button>
                </div>
            </CardContent>
        </Card>
    );
}
