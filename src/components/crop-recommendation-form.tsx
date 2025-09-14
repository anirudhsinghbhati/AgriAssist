'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { personalizedCropRecommendations, PersonalizedCropRecommendationsOutput } from '@/ai/flows/personalized-crop-recommendations';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

const cropSchema = z.object({
  name: z.string().min(1, 'Crop name is required'),
  expectedYield: z.coerce.number().min(0, 'Must be positive'),
  sellingPrice: z.coerce.number().min(0, 'Must be positive'),
  profitPerHectare: z.coerce.number().min(0, 'Must be positive'),
  investmentPerHectare: z.coerce.number().min(0, 'Must be positive'),
  maxAllocation: z.coerce.number().optional(),
  minAllocation: z.coerce.number().optional(),
});

const formSchema = z.object({
  totalLand: z.coerce.number().min(0.1, 'Total land is required.'),
  maxCapital: z.coerce.number().optional(),
  diversification: z.coerce.number().optional(),
  candidateCrops: z.array(cropSchema).min(1, 'Please add at least one crop.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CropRecommendationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PersonalizedCropRecommendationsOutput['recommendations'] | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalLand: 1,
      maxCapital: undefined,
      diversification: undefined,
      candidateCrops: [
        { name: 'Maize', expectedYield: 5, sellingPrice: 250, profitPerHectare: 500, investmentPerHectare: 300 },
        { name: 'Soybean', expectedYield: 3, sellingPrice: 500, profitPerHectare: 700, investmentPerHectare: 400 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'candidateCrops',
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await personalizedCropRecommendations(values);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error('Failed to get recommendations', error);
      // Here you might want to use a toast notification
    } finally {
      setIsLoading(false);
    }
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Farm Details</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="totalLand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Available Land (hectares)</FormLabel>
                    <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Investment Capital (optional)</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diversification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min. Crops for Diversification (optional)</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Candidate Crops</CardTitle>
                 <Button type="button" size="sm" variant="outline" onClick={() => append({ name: '', expectedYield: 0, sellingPrice: 0, profitPerHectare: 0, investmentPerHectare: 0 })}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Crop
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg relative space-y-4">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive"/>
                  </Button>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <FormField control={form.control} name={`candidateCrops.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Crop Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`candidateCrops.${index}.expectedYield`} render={({ field }) => (<FormItem><FormLabel>Yield (tons/ha)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`candidateCrops.${index}.sellingPrice`} render={({ field }) => (<FormItem><FormLabel>Price (per ton)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`candidateCrops.${index}.profitPerHectare`} render={({ field }) => (<FormItem><FormLabel>Profit/ha</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`candidateCrops.${index}.investmentPerHectare`} render={({ field }) => (<FormItem><FormLabel>Investment/ha</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </div>
              ))}
               {form.formState.errors.candidateCrops?.root && <p className="text-sm font-medium text-destructive">{form.formState.errors.candidateCrops.root.message}</p>}
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Recommendations
          </Button>
        </form>
      </Form>
      
      {recommendations && (
        <div className="mt-8 space-y-8">
            <h2 className="text-2xl font-bold">Your Personalized Recommendations</h2>
            {recommendations.map((strategy, index) => (
                <Card key={index} className="bg-muted/30">
                    <CardHeader>
                        <CardTitle>{strategy.strategyName}</CardTitle>
                        <CardDescription>{strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Crop</TableHead>
                                    <TableHead className="text-right">Allocation (ha)</TableHead>
                                    <TableHead className="text-right">Investment</TableHead>
                                    <TableHead className="text-right">Expected Profit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {strategy.allocations.map((alloc, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{alloc.crop}</TableCell>
                                        <TableCell className="text-right">{alloc.allocation.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(alloc.investment)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(alloc.expectedProfit)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-bold bg-muted/50">
                                    <TableCell>Total</TableCell>
                                    <TableCell className="text-right">{strategy.allocations.reduce((acc, a) => acc + a.allocation, 0).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(strategy.totalInvestment)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(strategy.totalProfit)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                         <div className="mt-4 text-right font-semibold">
                            <p>Return on Investment (ROI): <span className="text-primary">{strategy.roi.toFixed(2)}%</span></p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </>
  );
}
