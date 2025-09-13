import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sun, Cloud, CloudRain, Wind, Droplets, Sunrise, Sunset, AlertTriangle } from "lucide-react";

const weatherIcons = {
    "Sunny": <Sun className="h-6 w-6 text-yellow-500" />,
    "Partly Cloudy": <Cloud className="h-6 w-6 text-gray-400" />,
    "Rainy": <CloudRain className="h-6 w-6 text-blue-500" />,
}

const forecastData = [
    { day: 'Tue', temp: '30°C', condition: 'Sunny' },
    { day: 'Wed', temp: '28°C', condition: 'Partly Cloudy' },
    { day: 'Thu', temp: '29°C', condition: 'Partly Cloudy' },
    { day: 'Fri', temp: '26°C', condition: 'Rainy' },
    { day: 'Sat', temp: '31°C', condition: 'Sunny' },
];

export default function WeatherPage() {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Weather &amp; Climate Alerts</CardTitle>
                    <CardDescription>Live forecast, warnings, and pest alerts for your location.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>High Pest Activity Warning</AlertTitle>
                        <AlertDescription>
                            Conditions are favorable for aphid infestation. Monitor your crops closely.
                        </AlertDescription>
                    </Alert>
                    <Card>
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <Sun className="h-20 w-20 text-yellow-400" />
                                <div>
                                    <p className="text-6xl font-bold">28°C</p>
                                    <p className="text-muted-foreground">Feels like 32°C</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                <div className="flex items-center gap-2"><Wind className="h-4 w-4 text-muted-foreground" /> Wind: 12 km/h</div>
                                <div className="flex items-center gap-2"><Droplets className="h-4 w-4 text-muted-foreground" /> Humidity: 65%</div>
                                <div className="flex items-center gap-2"><Sunrise className="h-4 w-4 text-muted-foreground" /> Sunrise: 5:45 AM</div>
                                <div className="flex items-center gap-2"><Sunset className="h-4 w-4 text-muted-foreground" /> Sunset: 7:15 PM</div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>5-Day Forecast</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                            {forecastData.map(day => (
                                <div key={day.day} className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                                    <p className="font-medium">{day.day}</p>
                                    {weatherIcons[day.condition as keyof typeof weatherIcons]}
                                    <p className="font-bold text-lg">{day.temp}</p>
                                    <p className="text-xs text-muted-foreground">{day.condition}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    )
}
