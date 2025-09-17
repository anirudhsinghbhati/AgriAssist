
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sun, Cloud, CloudRain, Wind, Droplets, Sunrise, Sunset, AlertTriangle, Loader2 } from "lucide-react";
import { getCurrentWeather, WeatherData } from '@/app/actions/weather';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import stateDistrictData from '@/lib/india-states-districts.json';


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
    const [isLoading, setIsLoading] = useState(true);
    const [selectedState, setSelectedState] = useState('Madhya Pradesh');
    const [selectedDistrict, setSelectedDistrict] = useState('Indore');
    const [currentLocation, setCurrentLocation] = useState({ district: 'Indore', state: 'Madhya Pradesh' });

    const districts = useMemo(() => {
        if (!selectedState) return [];
        const state = stateDistrictData.states.find(s => s.state === selectedState);
        return state ? state.districts : [];
    }, [selectedState]);


    const fetchWeather = async (district: string, state: string) => {
        setIsLoading(true);
        const weatherData = await getCurrentWeather({ district, state });
        setWeather(weatherData);
        setCurrentLocation({ district, state });
        setIsLoading(false);
    };

    useEffect(() => {
        fetchWeather('Indore', 'Madhya Pradesh');
    }, []);

    const handleGetWeather = () => {
        if (selectedDistrict && selectedState) {
            fetchWeather(selectedDistrict, selectedState);
        }
    };

    const CurrentWeatherIcon = weather ? (weatherIcons[weather.condition] || <Cloud className="h-24 w-24 text-gray-400" />) : null;


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Weather &amp; Climate Alerts</CardTitle>
                    <CardDescription>Select a location to view the live forecast, warnings, and pest alerts.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="grid sm:grid-cols-2 gap-4 w-full sm:w-auto flex-grow">
                             <div className='flex flex-col gap-2'>
                                <label className='text-sm font-medium'>State</label>
                                <Select onValueChange={(value) => {
                                    setSelectedState(value);
                                    setSelectedDistrict(''); // Reset district when state changes
                                }} value={selectedState}>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a state" />
                                    </SelectTrigger>
                                <SelectContent>
                                    {stateDistrictData.states.map((state) => (
                                        <SelectItem key={state.state} value={state.state}>{state.state}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label className='text-sm font-medium'>District</label>
                                <Select onValueChange={setSelectedDistrict} value={selectedDistrict} disabled={!selectedState}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={!selectedState ? "Select a state first" : "Select a district"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem key={district} value={district}>{district}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={handleGetWeather} disabled={isLoading || !selectedDistrict} className="w-full sm:w-auto">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Get Weather
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>High Pest Activity Warning</AlertTitle>
                <AlertDescription>
                    Conditions are favorable for aphid infestation in the selected region. Monitor your crops closely.
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Current Weather for {currentLocation.district}, {currentLocation.state}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {isLoading ? (
                                <div className="flex items-center gap-6">
                                    <Skeleton className="h-24 w-24 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-12 w-24" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            ) : weather ? (
                                <div className="flex items-center gap-6">
                                    {React.cloneElement(CurrentWeatherIcon!, { className: "h-24 w-24" })}
                                    <div>
                                        <p className="text-6xl font-bold">{weather.temperature}°C</p>
                                        <p className="text-muted-foreground">Feels like {weather.feelsLike}°C</p>
                                    </div>
                                </div>
                            ) : null}
                        
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            {isLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-32" />)
                            ) : weather ? (
                                    <>
                                        <div className="flex items-center gap-2"><Wind className="h-5 w-5 text-muted-foreground" /> Wind: {weather.wind} km/h</div>
                                        <div className="flex items-center gap-2"><Droplets className="h-5 w-5 text-muted-foreground" /> Humidity: {weather.humidity}%</div>
                                        <div className="flex items-center gap-2"><Sunrise className="h-5 w-5 text-muted-foreground" /> Sunrise: {weather.sunrise}</div>
                                        <div className="flex items-center gap-2"><Sunset className="h-5 w-5 text-muted-foreground" /> Sunset: {weather.sunset}</div>
                                    </>
                            ) : null}
                            </div>
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
                            {isLoading ? <Skeleton className="h-10 w-10" /> : weather ? (
                                <>
                                    {React.cloneElement(weatherIcons[weather.condition] || <Cloud />, { className: "h-6 w-6" })}
                                    <p className="font-bold">{weather.temperature}°</p>
                                </>
                            ) : null}
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
