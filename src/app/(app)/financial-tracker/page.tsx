
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { IndianRupee, PlusCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const financialData = {
  summary: {
    revenue: 429500,
    expenses: 185200,
    profit: 244300,
  },
  chartData: [
    { month: 'Jan', income: 45000, expense: 22000 },
    { month: 'Feb', income: 48000, expense: 25000 },
    { month: 'Mar', income: 52000, expense: 20000 },
    { month: 'Apr', income: 60000, expense: 30000 },
    { month: 'May', income: 85000, expense: 40000 },
    { month: 'Jun', income: 95000, expense: 35000 },
  ],
  transactions: [
    { id: 'T001', date: '2024-06-25', description: 'Sold Soybean (5 Quintal)', type: 'Income', amount: 24000 },
    { id: 'T002', date: '2024-06-22', description: 'Fertilizer Purchase', type: 'Expense', amount: -8500 },
    { id: 'T003', date: '2024-06-20', description: 'Labor Wages', type: 'Expense', amount: -15000 },
    { id: 'T004', date: '2024-06-18', description: 'Sold Cotton (2 Quintal)', type: 'Income', amount: 14400 },
    { id: 'T005', date: '2024-06-15', description: 'Diesel for Tractor', type: 'Expense', amount: -3200 },
    { id: 'T006', date: '2024-06-12', description: 'Seed Purchase', type: 'Expense', amount: -12000 },
  ],
};

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function FinancialTrackerPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardTitle>Financial Tracker</CardTitle>
                <CardDescription>Monitor your farm's income, expenses, and overall profitability.</CardDescription>
            </div>
            <div className="flex gap-2">
                 <Button variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Add Income
                </Button>
                <Button>
                    <TrendingDown className="mr-2 h-4 w-4" />
                    Add Expense
                </Button>
            </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.summary.revenue)}</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.summary.expenses)}</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(financialData.summary.profit)}</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={financialData.chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A log of your recent income and expense activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData.transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date}</TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === 'Income' ? 'default' : 'secondary'} className={t.type === 'Income' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}>
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(t.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
