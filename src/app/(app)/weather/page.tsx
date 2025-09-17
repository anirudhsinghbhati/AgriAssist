
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
import { cn } from '@/lib/utils';


const weatherIcons: { [key: string]: JSX.Element } = {
    "Sunny": <Sun className="h-10 w-10 text-yellow-500" />,
    "Partly Cloudy": <Cloud className="h-10 w-10 text-gray-400" />,
    "Rainy": <CloudRain className="h-10 w-10 text-blue-500" />,
    "Cloudy": <Cloud className="h-10 w-10 text-gray-500" />,
}

const weatherBackgrounds: { [key: string]: string } = {
    "Sunny": "from-yellow-200 via-orange-200 to-yellow-300 text-slate-800",
    "Rainy": "from-blue-300 to-slate-400 text-white",
    "Cloudy": "from-gray-300 to-slate-400 text-slate-800",
    "Partly Cloudy": "from-sky-300 to-gray-400 text-slate-800",
};

export default function WeatherPage() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedState, setSelectedState] = useState('Rajasthan');
    const [selectedDistrict, setSelectedDistrict] = useState('Jaipur');
    const [currentLocation, setCurrentLocation] = useState({ district: 'Jaipur', state: 'Rajasthan' });

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
        fetchWeather('Jaipur', 'Rajasthan');
    }, []);

    const handleGetWeather = () => {
        if (selectedDistrict && selectedState) {
            fetchWeather(selectedDistrict, selectedState);
        }
    };

    const CurrentWeatherIcon = weather ? (weatherIcons[weather.condition] || <Cloud className="h-24 w-24 text-gray-400" />) : null;
    const backgroundClass = weather ? weatherBackgrounds[weather.condition] || 'bg-card' : 'bg-card';


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
                                    const newState = stateDistrictData.states.find(s => s.state === value);
                                    if (newState && newState.districts.length > 0) {
                                      setSelectedDistrict(newState.districts[0]);
                                    } else {
                                      setSelectedDistrict('');
                                    }
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

            {isLoading ? (
                <Skeleton className="h-24 w-full" />
            ) : weather?.alert ? (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{weather.alert.title}</AlertTitle>
                    <AlertDescription>
                       {weather.alert.description}
                    </AlertDescription>
                </Alert>
            ) : null }

            <div className="grid gap-6 lg:grid-cols-5">
                <Card className={cn("lg:col-span-3 transition-all duration-500 bg-gradient-to-br", backgroundClass)}>
                    <CardHeader>
                        <CardTitle className="text-inherit">Current Weather for {currentLocation.district}, {currentLocation.state}</CardTitle>
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
                                    {React.cloneElement(CurrentWeatherIcon!, { className: "h-24 w-24 text-inherit" })}
                                    <div>
                                        <p className="text-6xl font-bold">{weather.temperature}°C</p>
                                        <p className="opacity-80">Feels like {weather.feelsLike}°C</p>
                                    </div>
                                </div>
                            ) : null}
                        
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            {isLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-32" />)
                            ) : weather ? (
                                    <>
                                        <div className="flex items-center gap-2 opacity-80"><Wind className="h-5 w-5" /> Wind: {weather.wind} km/h</div>
                                        <div className="flex items-center gap-2 opacity-80"><Droplets className="h-5 w-5" /> Humidity: {weather.humidity}%</div>
                                        <div className="flex items-center gap-2 opacity-80"><Sunrise className="h-5 w-5" /> Sunrise: {weather.sunrise}</div>
                                        <div className="flex items-center gap-2 opacity-80"><Sunset className="h-5 w-5" /> Sunset: {weather.sunset}</div>
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
                            {isLoading ? <Skeleton className="h-10 w-10" /> : <Sun className="h-6 w-6 text-yellow-500"/>}
                            {isLoading ? <Skeleton className="h-5 w-8" /> : <p className="font-bold">30°</p>}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-muted-foreground">6 PM</p>
                             {isLoading ? <Skeleton className="h-10 w-10" /> : <Cloud className="h-6 w-6 text-gray-400"/>}
                             {isLoading ? <Skeleton className="h-5 w-8" /> : <p className="font-bold">27°</p>}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-muted-foreground">9 PM</p>
                            {isLoading ? <Skeleton className="h-10 w-10" /> : <Cloud className="h-6 w-6 text-gray-400"/>}
                            {isLoading ? <Skeleton className="h-5 w-8" /> : <p className="font-bold">24°</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>6-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                           <div key={i} className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                               <Skeleton className="h-6 w-10" />
                               <Skeleton className="h-10 w-10 rounded-full" />
                               <Skeleton className="h-8 w-12" />
                               <Skeleton className="h-5 w-20" />
                           </div>
                        ))
                    ) : weather?.forecast.map(day => (
                        <div key={day.day} className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                            <p className="font-semibold text-lg">{day.day}</p>
                            {React.cloneElement(weatherIcons[day.condition] || <Cloud />, { className: "h-10 w-10"})}
                            <p className="font-bold text-2xl">{day.temp}°C</p>
                            <p className="text-sm text-muted-foreground">{day.condition}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

    