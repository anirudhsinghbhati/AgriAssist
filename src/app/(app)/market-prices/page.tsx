import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";

const marketData = [
    { crop: 'Wheat', variety: 'Lokwan', price: 2350, change: 1.5, unit: 'Quintal', trend: 'up' },
    { crop: 'Soybean', variety: 'JS-335', price: 4800, change: -0.8, unit: 'Quintal', trend: 'down' },
    { crop: 'Cotton', variety: 'BT', price: 7200, change: 2.1, unit: 'Quintal', trend: 'up' },
    { crop: 'Maize', variety: 'Hybrid', price: 2100, change: 0.5, unit: 'Quintal', trend: 'up' },
    { crop: 'Tomato', variety: 'Desi', price: 1800, change: -3.2, unit: 'Quintal', trend: 'down' },
    { crop: 'Onion', variety: 'Red', price: 2500, change: 5.0, unit: 'Quintal', trend: 'up' },
];

export default function MarketPricesPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Real-Time Market Prices</CardTitle>
                <CardDescription>
                    Up-to-date prices for various crops from your local 'mandi' markets.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Crop</TableHead>
                            <TableHead>Variety</TableHead>
                            <TableHead className="text-right">Price (₹ / Unit)</TableHead>
                            <TableHead className="text-right">Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {marketData.map((item) => (
                            <TableRow key={item.crop}>
                                <TableCell className="font-medium">{item.crop}</TableCell>
                                <TableCell>{item.variety}</TableCell>
                                <TableCell className="text-right">₹{item.price.toLocaleString('en-IN')} / {item.unit}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={item.trend === 'up' ? 'default' : 'destructive'} className={item.trend === 'up' ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30' : 'bg-red-500/20 text-red-700 hover:bg-red-500/30'}>
                                        {item.trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                                        {item.change}%
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
