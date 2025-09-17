
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Loader2, Search } from 'lucide-react';
import { marketPriceLookup, MarketPriceLookupOutput } from '@/ai/flows/market-price-lookup';

const initialMarketData: MarketPriceLookupOutput[] = [
  { crop: 'Wheat', variety: 'Lokwan', price: 2350, change: 1.5, unit: 'Quintal', trend: 'up' },
  { crop: 'Soybean', variety: 'JS-335', price: 4800, change: -0.8, unit: 'Quintal', trend: 'down' },
  { crop: 'Cotton', variety: 'BT', price: 7200, change: 2.1, unit: 'Quintal', trend: 'up' },
  { crop: 'Maize', variety: 'Hybrid', price: 2100, change: 0.5, unit: 'Quintal', trend: 'up' },
  { crop: 'Tomato', variety: 'Desi', price: 1800, change: -3.2, unit: 'Quintal', trend: 'down' },
  { crop: 'Onion', variety: 'Red', price: 2500, change: 5.0, unit: 'Quintal', trend: 'up' },
];

export default function MarketPricesPage() {
  const [marketData, setMarketData] = useState<MarketPriceLookupOutput[]>(initialMarketData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // If search is cleared, reset to initial data
      setMarketData(initialMarketData);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await marketPriceLookup({ cropName: searchQuery });
      
      const existingCropIndex = marketData.findIndex(
        (item) => item.crop.toLowerCase() === result.crop.toLowerCase()
      );

      if (existingCropIndex !== -1) {
        // Update existing crop data
        const updatedData = [...marketData];
        updatedData[existingCropIndex] = result;
        setMarketData(updatedData);
      } else {
        // Add new crop data to the top
        setMarketData([result, ...marketData]);
      }
    } catch (err) {
      console.error(err);
      setError('Could not fetch price for this crop. Please try another.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      // Reset to initial data when input is cleared
      setMarketData(initialMarketData);
      setError(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Market Prices</CardTitle>
        <CardDescription>
          Up-to-date prices for various crops from your local 'mandi' markets. Search for a crop to get the latest price.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a crop (e.g., 'Rice')"
              value={searchQuery}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="hidden sm:inline">Search</span>}
            {isLoading && <span className="sm:hidden"><Loader2 className="h-4 w-4 animate-spin" /></span>}
            {!isLoading && <span className="sm:hidden"><Search className="h-4 w-4" /></span>}
          </Button>
        </form>
        {error && <p className="text-destructive text-sm mb-4">{error}</p>}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead className="text-right">Price ({'\u20B9'} / Unit)</TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((item) => (
                <TableRow key={item.crop}>
                  <TableCell className="font-medium">{item.crop}</TableCell>
                  <TableCell>{item.variety}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {'\u20B9'}{item.price.toLocaleString('en-IN')} / {item.unit}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
