
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TransactionForm, { TransactionFormValues } from '@/components/transaction-form';
import { format, getQuarter } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


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

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);

type Transaction = {
  id: string;
  date: string;
  description: string;
  type: 'Income' | 'Expense';
  amount: number;
};

type ChartView = 'daily' | 'monthly' | 'quarterly' | 'yearly';


export default function FinancialTrackerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [chartView, setChartView] = useState<ChartView>('monthly');


  const summary = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'Income') {
        acc.revenue += t.amount;
      } else {
        acc.expenses += Math.abs(t.amount);
      }
      acc.profit = acc.revenue - acc.expenses;
      return acc;
    }, { revenue: 0, expenses: 0, profit: 0 });
  }, [transactions]);

  const chartData = useMemo(() => {
    const dataMap: { [key: string]: { label: string; income: number; expense: number } } = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      let key = '';
      let label = '';

      if (chartView === 'daily') {
        key = format(date, 'yyyy-MM-dd');
        label = format(date, 'dd MMM');
      } else if (chartView === 'monthly') {
        key = format(date, 'yyyy-MM');
        label = format(date, 'MMM yy');
      } else if (chartView === 'quarterly') {
        const year = date.getFullYear();
        const quarter = getQuarter(date);
        key = `${year}-Q${quarter}`;
        label = `Q${quarter} ${year}`;
      } else if (chartView === 'yearly') {
        key = String(date.getFullYear());
        label = key;
      }

      if (!dataMap[key]) {
        dataMap[key] = { label, income: 0, expense: 0 };
      }

      if (t.type === 'Income') {
        dataMap[key].income += t.amount;
      } else {
        dataMap[key].expense += Math.abs(t.amount);
      }
    });
    
    return Object.values(dataMap).sort((a, b) => {
        // A simple sort that should work for most keys generated
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
    });
  }, [transactions, chartView]);


  const handleAddTransaction = (values: TransactionFormValues, type: 'Income' | 'Expense') => {
    const newTransaction: Transaction = {
      id: `T${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date(values.date).toISOString().split('T')[0],
      description: values.description,
      type,
      amount: type === 'Income' ? values.amount : -values.amount,
    };
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    if (type === 'Income') setIsIncomeModalOpen(false);
    if (type === 'Expense') setIsExpenseModalOpen(false);
  };
  

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle>Financial Tracker</CardTitle>
                <CardDescription>Monitor your farm's income, expenses, and overall profitability.</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Dialog open={isIncomeModalOpen} onOpenChange={setIsIncomeModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Add Income
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Income</DialogTitle>
                    </DialogHeader>
                    <TransactionForm type="Income" onSubmit={(values) => handleAddTransaction(values, 'Income')} />
                  </DialogContent>
                </Dialog>
                <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                        <TrendingDown className="mr-2 h-4 w-4" />
                        Add Expense
                    </Button>
                  </DialogTrigger>
                   <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <TransactionForm type="Expense" onSubmit={(values) => handleAddTransaction(values, 'Expense')} />
                  </DialogContent>
                </Dialog>
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
            <div className="text-2xl font-bold">{formatCurrency(summary.revenue)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.expenses)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
            <span className="h-4 w-4 text-muted-foreground"></span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-primary' : 'text-destructive'}`}>{formatCurrency(summary.profit)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle>Income vs. Expenses</CardTitle>
                <CardDescription>Visualize your financial performance over time.</CardDescription>
            </div>
             <Tabs defaultValue="monthly" onValueChange={(value) => setChartView(value as ChartView)}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
        {transactions.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
            <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
              <p>No data to display. Add a transaction to see your chart.</p>
            </div>
        )}
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
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{format(new Date(t.date), 'dd MMM yyyy')}</TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>
                      <Badge variant={t.type === 'Income' ? 'default' : 'secondary'} className={t.type === 'Income' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}>
                        {t.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${t.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(t.amount)}</TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No transactions yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
