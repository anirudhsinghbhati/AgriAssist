import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Cloud, DollarSign, Leaf, Lightbulb, Sprout } from 'lucide-react';

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
            <CardTitle className="text-sm font-medium">Top Crop Suggestion</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Maize</div>
            <p className="text-xs text-muted-foreground">High yield potential</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profitability Score</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle>Crop Recommendations</CardTitle>
              <CardDescription>
                AI-powered suggestions based on your farm&apos;s data.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/crop-recommendations">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Sprout className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Soybean</p>
                  <p className="text-sm text-muted-foreground">
                    Ideal for current soil moisture levels.
                  </p>
                </div>
                <div className="ml-auto font-medium text-primary">+88% Match</div>
              </div>
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                <div className="bg-accent/10 p-3 rounded-full">
                  <Leaf className="h-6 w-6 text-accent" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">Cotton</p>
                  <p className="text-sm text-muted-foreground">
                    Good market price and high demand.
                  </p>
                </div>
                <div className="ml-auto font-medium text-accent">+75% Match</div>
              </div>
            </div>
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
                    <LineChart className="h-5 w-5"/>
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
