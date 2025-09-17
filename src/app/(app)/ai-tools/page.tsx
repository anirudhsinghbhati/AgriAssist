
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CropRecommendationForm from "@/components/crop-recommendation-form";
import PestDetectionForm from "@/components/pest-detection-form";
import IrrigationPlannerForm from "@/components/irrigation-planner-form";
import YieldPredictionForm from "@/components/yield-prediction-form";
import { Sprout, Bug, Droplets, TrendingUp } from "lucide-react";

export default function AiToolsPage() {
    return (
        <Tabs defaultValue="crop-recommendations" className="space-y-6">
            <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="crop-recommendations">
                        <Sprout className="mr-2 h-4 w-4" />
                        Crop Advisory
                    </TabsTrigger>
                    <TabsTrigger value="pest-detection">
                        <Bug className="mr-2 h-4 w-4" />
                        Pest Detection
                    </TabsTrigger>
                    <TabsTrigger value="irrigation-planner">
                        <Droplets className="mr-2 h-4 w-4" />
                        Irrigation
                    </TabsTrigger>
                    <TabsTrigger value="yield-prediction">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Yield Prediction
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="crop-recommendations">
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
            </TabsContent>
            <TabsContent value="pest-detection">
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
            </TabsContent>
            <TabsContent value="irrigation-planner">
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
            </TabsContent>
            <TabsContent value="yield-prediction">
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
            </TabsContent>
        </Tabs>
    );
}
