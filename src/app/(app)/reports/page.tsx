
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import { Download, Sprout, Droplets } from 'lucide-react';

const yieldData = [
  { crop: 'Soybean', yield: 2.5, fill: "var(--color-soybean)" },
  { crop: 'Cotton', yield: 1.8, fill: "var(--color-cotton)" },
  { crop: 'Wheat', yield: 4.2, fill: "var(--color-wheat)" },
  { crop: 'Maize', yield: 6.0, fill: "var(--color-maize)" },
];

const profitData = [
  { month: 'Jan', profit: 45000 },
  { month: 'Feb', profit: 48000 },
  { month: 'Mar', profit: 52000 },
  { month: 'Apr', profit: 60000 },
  { month: 'May', profit: 85000 },
  { month: 'Jun', profit: 95000 },
];

const harvestData = [
    { id: 'H001', crop: 'Wheat', quantity: 50, unit: 'Quintal', date: '2024-04-15', revenue: 117500 },
    { id: 'H002', crop: 'Soybean', quantity: 25, unit: 'Quintal', date: '2023-10-20', revenue: 120000 },
    { id: 'H003', crop: 'Cotton', quantity: 15, unit: 'Quintal', date: '2023-11-05', revenue: 108000 },
    { id: 'H004', crop: 'Maize', quantity: 40, unit: 'Quintal', date: '2023-09-30', revenue: 84000 },
];


const chartConfig = {
  yield: {
    label: "Yield (tons/ha)",
  },
  profit: {
    label: "Profit (₹)",
    color: "hsl(var(--chart-1))",
  },
  soybean: {
    label: "Soybean",
    color: "hsl(var(--chart-1))",
  },
  cotton: {
    label: "Cotton",
    color: "hsl(var(--chart-2))",
  },
  wheat: {
    label: "Wheat",
    color: "hsl(var(--chart-3))",
  },
  maize: {
    label: "Maize",
    color: "hsl(var(--chart-4))",
  },
};

export default function ReportsPage() {
    const totalRevenue = harvestData.reduce((acc, curr) => acc + curr.revenue, 0);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <CardTitle>Reports & Analytics</CardTitle>
                        <CardDescription>
                            Track your farm's productivity, soil health, and get yield predictions.
                        </CardDescription>
                    </div>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <span className="h-4 w-4 text-muted-foreground">₹</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                        <p className="text-xs text-muted-foreground">in the last 12 months</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
                        <Sprout className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3.6 tons/ha</div>
                        <p className="text-xs text-muted-foreground">+5% from last season</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
                        <Droplets className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.2M Liters</div>
                        <p className="text-xs text-muted-foreground">this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                        <span className="h-4 w-4 text-muted-foreground">₹</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42%</div>
                        <p className="text-xs text-muted-foreground">Average across all crops</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Yield per Crop (tons/hectare)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <BarChart accessibilityLayer data={yieldData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="crop" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="yield" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Profit Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <LineChart accessibilityLayer data={profitData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <YAxis 
                                    tickFormatter={(value) => `₹${(Number(value) / 1000).toLocaleString('en-IN')}k`}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value))} />} />
                                <Line
                                    dataKey="profit"
                                    type="monotone"
                                    stroke="var(--color-profit)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Harvests</CardTitle>
                    <CardDescription>A log of your recent crop harvests and their revenue.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Harvest ID</TableHead>
                                <TableHead>Crop</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Harvest Date</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {harvestData.map((harvest) => (
                                <TableRow key={harvest.id}>
                                    <TableCell className="font-medium">{harvest.id}</TableCell>
                                    <TableCell>{harvest.crop}</TableCell>
                                    <TableCell>{harvest.quantity} {harvest.unit}</TableCell>
                                    <TableCell>{harvest.date}</TableCell>
                                    <TableCell className="text-right">₹{harvest.revenue.toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
