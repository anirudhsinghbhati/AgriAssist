
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Cloud, Lightbulb, Sprout, Leaf, MessageSquare, PlusCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/use-translation';
import { getCurrentWeather, WeatherData } from '@/app/actions/weather';
import { Skeleton } from '@/components/ui/skeleton';

const cropData = [
    { 
        name: 'Soybean', 
        stage: 'Flowering', 
        progress: 55, 
        image: PlaceHolderImages.find(img => img.id === 'soybean-crop'),
    },
    { 
        name: 'Cotton', 
        stage: 'Vegetative Growth', 
        progress: 40,
        image: PlaceHolderImages.find(img => img.id === 'cotton-crop'),
    },
];

const cropStages = [
    'Prep', 'Sowing', 'Emerge', 'Veg', 'Flower', 'Pod', 'Seed', 'Mature', 'Harvest'
];

export default function Dashboard() {
  const { t } = useTranslation();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'avatar');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      // In a real app, you might get the user's location dynamically
      const weatherData = await getCurrentWeather({ district: 'Jaipur', state: 'Rajasthan' });
      setWeather(weatherData);
    }
    fetchWeather();
  }, []);


  return (
    <div className="flex flex-1 flex-col gap-6 md:gap-8">
      
      <div className="flex items-center gap-4">
        {userAvatar && (
            <Image
                src={userAvatar.imageUrl}
                alt={userAvatar.description}
                width={64}
                height={64}
                data-ai-hint={userAvatar.imageHint}
                className="h-16 w-16 rounded-full object-cover border-4 border-primary/20"
            />
        )}
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.welcome_back')}</h1>
            <p className="text-muted-foreground">{t('dashboard.summary_today')}</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
           <Card>
             <CardHeader>
                <CardTitle>{t('dashboard.todays_focus.title')}</CardTitle>
                <CardDescription>{t('dashboard.todays_focus.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-4">
                    <Cloud className="h-8 w-8 text-blue-500" />
                    {weather ? (
                        <div>
                            <p className="font-semibold">{weather.temperature}°C {weather.condition}</p>
                            <p className="text-sm text-muted-foreground">Humidity: {weather.humidity}%</p>
                        </div>
                    ) : (
                         <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    )}
                </div>
                 <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <div>
                        <p className="font-semibold">₹4,800/Qtl</p>
                        <p className="text-sm text-muted-foreground">{t('dashboard.todays_focus.soybean_price')}</p>
                    </div>
                </div>
                 <Alert variant="destructive" className="sm:col-span-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{t('dashboard.todays_focus.pest_alert_title')}</AlertTitle>
                    <AlertDescription>
                        {t('dashboard.todays_focus.pest_alert_description')}
                    </AlertDescription>
                </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                <CardTitle>{t('dashboard.my_crops.title')}</CardTitle>
                <CardDescription>
                    {t('dashboard.my_crops.description')}
                </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                    {t('dashboard.my_crops.add_button')}
                    <PlusCircle className="h-4 w-4" />
                </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {cropData.map((crop) => (
                <Link key={crop.name} href={`/my-crops/${crop.name.toLowerCase()}`} className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="grid gap-3">
                    <div className="flex items-center gap-4">
                        {crop.image && (
                        <Image
                            src={crop.image.imageUrl}
                            alt={crop.image.description}
                            width={56}
                            height={56}
                            data-ai-hint={crop.image.imageHint}
                            className="h-14 w-14 rounded-lg object-cover"
                        />
                        )}
                        <div className="flex-1">
                        <p className="font-semibold leading-none text-lg">{crop.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {t('dashboard.my_crops.current_stage')}: <span className="font-semibold text-primary">{crop.stage}</span>
                        </p>
                        </div>
                        <Button variant="ghost" size="icon">
                            <ArrowUpRight className="h-5 w-5"/>
                        </Button>
                    </div>
                    <div>
                        <Progress value={crop.progress} className="h-2" />
                        <div className="mt-2 grid grid-cols-9 text-[10px] text-center text-muted-foreground">
                        {cropStages.map(stage => <span key={stage}>{stage}</span>)}
                        </div>
                    </div>
                    </div>
                </Link>
                ))}
            </CardContent>
            </Card>
        </div>
        
        <div className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.quick_actions.title')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Button asChild size="lg" className="w-full justify-start gap-3 p-6">
                    <Link href="/pest-detection">
                        <Leaf className="h-6 w-6"/>
                        <span className="text-base font-semibold">{t('dashboard.quick_actions.detect_pest')}</span>
                    </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="w-full justify-start gap-3 p-6">
                    <Link href="/market-prices">
                        <Sprout className="h-6 w-6"/>
                        <span className="text-base font-semibold">{t('dashboard.quick_actions.market_prices')}</span>
                    </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="w-full justify-start gap-3 p-6">
                    <Link href="/consultation">
                        <MessageSquare className="h-6 w-6"/>
                        <span className="text-base font-semibold">{t('dashboard.quick_actions.consult_expert')}</span>
                    </Link>
                </Button>
            </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboard.profitability.title')}</CardTitle>
                    <span className="h-4 w-4 text-muted-foreground">₹</span>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">85/100</div>
                    <p className="text-xs text-muted-foreground">{t('dashboard.profitability.change')}</p>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
