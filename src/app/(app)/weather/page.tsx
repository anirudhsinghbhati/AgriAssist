
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sun, Cloud, CloudRain, Wind, Droplets, Sunrise, Sunset, AlertTriangle } from "lucide-react";
import { getCurrentWeather, WeatherData } from '@/app/actions/weather';
import { Skeleton } from '@/components/ui/skeleton';


const weatherIcons: { [key: string]: JSX.Element } = {
    "Sunny": <Sun className="h-10 w-10 text-yellow-500" />,
    "Partly Cloudy": <Cloud className="h-10 w-10 text-gray-400" />,
    "Rainy": <CloudRain className="h-10 w-10 text-blue-500" />,
    "Cloudy": <Cloud className="h-10 w-10 text-gray-500" />,
}

const forecastData = [
    { day: 'Tue', temp: '30°C', condition: 'Sunny' },
    { day: 'Wed', temp: '28°C', condition: 'Partly Cloudy' },
    { day: 'Thu', temp: '29°C', condition: 'Partly Cloudy' },
    { day: 'Fri', temp: '26°C', condition: 'Rainy' },
    { day: 'Sat', temp: '31°C', condition: 'Sunny' },
    { day: 'Sun', temp: '32°C', condition: 'Sunny' },
];

export default function WeatherPage() {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    useEffect(() => {
        async function fetchWeather() {
            const weatherData = await getCurrentWeather({ district: 'Indore', state: 'Madhya Pradesh' });
            setWeather(weatherData);
        }
        fetchWeather();
    }, []);

    const CurrentWeatherIcon = weather ? (weatherIcons[weather.condition] || <Cloud className="h-24 w-24 text-gray-400" />) : null;


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Weather &amp; Climate Alerts</CardTitle>
                    <CardDescription>Live forecast, warnings, and pest alerts for your location.</CardDescription>
                </CardHeader>
            </Card>

            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>High Pest Activity Warning</AlertTitle>
                <AlertDescription>
                    Conditions are favorable for aphid infestation. Monitor your crops closely.
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Current Weather</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {weather ? (
                             <div className="flex items-center gap-6">
                                {React.cloneElement(CurrentWeatherIcon!, { className: "h-24 w-24" })}
                                <div>
                                    <p className="text-6xl font-bold">{weather.temperature}°C</p>
                                    <p className="text-muted-foreground">Feels like {weather.feelsLike}°C</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-12 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        )}
                       
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                           {weather ? (
                                <>
                                    <div className="flex items-center gap-2"><Wind className="h-5 w-5 text-muted-foreground" /> Wind: {weather.wind} km/h</div>
                                    <div className="flex items-center gap-2"><Droplets className="h-5 w-5 text-muted-foreground" /> Humidity: {weather.humidity}%</div>
                                    <div className="flex items-center gap-2"><Sunrise className="h-5 w-5 text-muted-foreground" /> Sunrise: {weather.sunrise}</div>
                                    <div className="flex items-center gap-2"><Sunset className="h-5 w-5 text-muted-foreground" /> Sunset: {weather.sunset}</div>
                                </>
                           ) : (
                                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-32" />)
                           )}
                        </div>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Hourly Forecast</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center text-center">
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-muted-foreground">Now</p>
                            {weather ? (
                                <>
                                    {React.cloneElement(weatherIcons[weather.condition] || <Cloud />, { className: "h-6 w-6" })}
                                    <p className="font-bold">{weather.temperature}°</p>
                                </>
                            ) : <Skeleton className="h-10 w-10" />}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-muted-foreground">3 PM</p>
                            <Sun className="h-6 w-6 text-yellow-500"/>
                            <p className="font-bold">30°</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-muted-foreground">6 PM</p>
                            <Cloud className="h-6 w-6 text-gray-400"/>
                            <p className="font-bold">27°</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-muted-foreground">9 PM</p>
                            <Cloud className="h-6 w-6 text-gray-400"/>
                            <p className="font-bold">24°</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>6-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
                    {forecastData.map(day => (
                        <div key={day.day} className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                            <p className="font-semibold text-lg">{day.day}</p>
                            {weatherIcons[day.condition as keyof typeof weatherIcons]}
                            <p className="font-bold text-2xl">{day.temp}</p>
                            <p className="text-sm text-muted-foreground">{day.condition}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
