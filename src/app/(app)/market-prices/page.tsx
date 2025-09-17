
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const [filteredData, setFilteredData] = useState<MarketDataItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];

      try {
        const cachedDataString = localStorage.getItem('marketData');
        if (cachedDataString) {
          const cachedData: CachedMarketData = JSON.parse(cachedDataString);
          if (cachedData.date === today) {
            setMarketData(cachedData.prices);
            setFilteredData(cachedData.prices);
            setIsLoading(false);
            return;
          }
        }

        const result = await marketPriceLookup();
        setMarketData(result.prices);
        setFilteredData(result.prices);
        
        const newCachedData: CachedMarketData = { date: today, prices: result.prices };
        localStorage.setItem('marketData', JSON.stringify(newCachedData));
      } catch (err) {
        console.error(err);
        setError('Could not fetch the latest market prices. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = marketData.filter(item =>
      item.crop.toLowerCase().includes(lowercasedQuery) ||
      item.variety.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredData(filtered);
  }, [searchQuery, marketData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Market Prices</CardTitle>
        <CardDescription>
          Up-to-date prices for various crops from your local 'mandi' markets, powered by AI. Data is refreshed once daily.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isLoading || !!error}
            />
          </div>
        </div>
        {error && (
            <Alert variant="destructive">
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
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Loader2 className="h-4 w-4 animate-spin" /></TableCell>
                    <TableCell>Loading...</TableCell>
                    <TableCell className="text-right">...</TableCell>
                    <TableCell className="text-right">...</TableCell>
                  </TableRow>
                ))
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.crop}>
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
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
