
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Cloud, IndianRupee, Lightbulb, Sprout, Leaf, MessageSquare, PlusCircle, TrendingUp } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weather</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28°C Sunny</div>
            <p className="text-xs text-muted-foreground">Humidity: 65%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Snapshot</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,800/Qtl</div>
            <p className="text-xs text-muted-foreground">Soybean, +2.1% today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profitability Score</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Alerts</div>
            <p className="text-xs text-muted-foreground">Pest warning for your area</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>My Crops</CardTitle>
              <CardDescription>
                Track the growth stages of your crops.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                Add New Crop
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
                        Current Stage: <span className="font-semibold text-primary">{crop.stage}</span>
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild size="lg" className="w-full justify-start gap-2">
                <Link href="/pest-detection">
                    <Leaf className="h-5 w-5"/>
                    Detect Pest/Disease
                </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full justify-start gap-2">
                <Link href="/market-prices">
                    <Sprout className="h-5 w-5"/>
                    Check Market Prices
                </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full justify-start gap-2">
                <Link href="/consultation">
                    <MessageSquare className="h-5 w-5"/>
                    Consult an Expert
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
