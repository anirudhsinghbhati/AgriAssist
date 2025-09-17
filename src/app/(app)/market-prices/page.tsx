
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Loader2, Search, AlertTriangle } from 'lucide-react';
import { marketPriceLookup, MarketPriceListOutput } from '@/ai/flows/market-price-lookup';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type MarketDataItem = {
    crop: string;
    variety: string;
    price: number;
    change: number;
    unit: string;
    trend: "up" | "down" | "stable";
}

type CachedMarketData = {
  date: string;
  prices: MarketDataItem[];
};


export default function MarketPricesPage() {
  const [marketData, setMarketData] = useState<MarketDataItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialMarketData = async () => {
      setIsLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];

      try {
        const cachedDataString = localStorage.getItem('marketData');
        if (cachedDataString) {
          const cachedData: CachedMarketData = JSON.parse(cachedDataString);
          if (cachedData.date === today) {
            setMarketData(cachedData.prices);
            setIsLoading(false);
            return;
          }
        }

        const result = await marketPriceLookup();
        setMarketData(result.prices);
        
        const newCachedData: CachedMarketData = { date: today, prices: result.prices };
        localStorage.setItem('marketData', JSON.stringify(newCachedData));
      } catch (err) {
        console.error(err);
        setError('Could not fetch the latest market prices. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialMarketData();
  }, []);
  
  const handleSearch = async () => {
    if (!searchQuery) return;
    
    setIsSearching(true);
    setError(null);
    try {
        const result = await marketPriceLookup({ cropName: searchQuery });
        if (result.prices && result.prices.length > 0) {
            setMarketData(result.prices);
        } else {
            setError(`Could not find market price data for "${searchQuery}". Please check the crop name and try again.`);
            setMarketData([]);
        }
    } catch (err) {
        console.error(err);
        setError(`An error occurred while searching for "${searchQuery}". Please try again later.`);
    } finally {
        setIsSearching(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Market Prices</CardTitle>
        <CardDescription>
          Search for any crop to get the latest price from local 'mandi' markets, powered by AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
          <div className="relative flex-grow w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search any crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="pl-10"
              disabled={isLoading || isSearching}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading || isSearching || !searchQuery} className="w-full sm:w-auto">
            {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
        </div>
        {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead className="text-right">Price / Unit</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}><Loader2 className="h-4 w-4 animate-spin" /></TableCell>
                  </TableRow>
                ))
              ) : marketData.length > 0 ? (
                marketData.map((item) => (
                  <TableRow key={item.crop + item.variety}>
                    <TableCell className="font-medium">{item.crop}</TableCell>
                    <TableCell>{item.variety}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {item.price.toLocaleString('en-IN')} / {item.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}
                        className={
                          item.trend === 'up'
                            ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30'
                            : item.trend === 'down'
                            ? 'bg-red-500/20 text-red-700 hover:bg-red-500/30'
                            : ''
                        }
                      >
                        {item.trend === 'up' ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : item.trend === 'down' ? (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        ) : null}
                        {item.change}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : !error && (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No market data available. Try searching for a crop.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
