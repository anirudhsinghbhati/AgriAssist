
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PlusCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TransactionForm, { TransactionFormValues } from '@/components/transaction-form';

const initialFinancialData = {
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

type Transaction = {
  id: string;
  date: string;
  description: string;
  type: 'Income' | 'Expense';
  amount: number;
};

export default function FinancialTrackerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialFinancialData.transactions);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const summary = transactions.reduce((acc, t) => {
    if (t.type === 'Income') {
      acc.revenue += t.amount;
    } else {
      acc.expenses += Math.abs(t.amount);
    }
    acc.profit = acc.revenue - acc.expenses;
    return acc;
  }, { revenue: 0, expenses: 0, profit: 0 });

  const handleAddTransaction = (values: TransactionFormValues, type: 'Income' | 'Expense') => {
    const newTransaction: Transaction = {
      id: `T${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date(values.date).toISOString().split('T')[0],
      description: values.description,
      type,
      amount: type === 'Income' ? values.amount : -values.amount,
    };
    setTransactions(prev => [newTransaction, ...prev]);
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
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">₹</span>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.profit >= 0 ? 'text-primary' : 'text-destructive'}`}>{formatCurrency(summary.profit)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart data={initialFinancialData.chartData}>
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
              {transactions.map((t) => (
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
