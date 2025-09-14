
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { personalizedCropRecommendations, PersonalizedCropRecommendationsOutput } from '@/ai/flows/personalized-crop-recommendations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lightbulb } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const formSchema = z.object({
  totalLand: z.coerce.number().min(0.1, 'Total land is required.'),
  state: z.string().min(2, 'State is required.'),
  district: z.string().min(2, 'District is required.'),
  soilType: z.string().min(2, 'Soil type is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CropRecommendationForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PersonalizedCropRecommendationsOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalLand: 1,
      state: '',
      district: '',
      soilType: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await personalizedCropRecommendations(values);
      setRecommendations(result);
    } catch (error) {
      console.error('Failed to get recommendations', error);
      // Here you might want to use a toast notification
    } finally {
      setIsLoading(false);
    }
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="totalLand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('crop_recommendations.form.total_land')}</FormLabel>
                  <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('crop_recommendations.form.state')}</FormLabel>
                  <FormControl><Input placeholder={t('crop_recommendations.form.state_placeholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('crop_recommendations.form.district')}</FormLabel>
                  <FormControl><Input placeholder={t('crop_recommendations.form.district_placeholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('crop_recommendations.form.soil_type')}</FormLabel>
                  <FormControl><Input placeholder={t('crop_recommendations.form.soil_type_placeholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('crop_recommendations.form.submit_button')}
          </Button>
        </form>
      </Form>
      
      {isLoading && (
        <div className="mt-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">{t('crop_recommendations.loading')}</p>
        </div>
      )}

      {recommendations && (
        <div className="mt-8 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{t('crop_recommendations.results.title')}</h2>
            <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {recommendations.recommendations.map((strategy, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 text-left">
                           <h3 className="text-lg font-semibold text-primary">{strategy.strategyName}</h3>
                           <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                <span>{t('crop_recommendations.results.roi')}: <strong className="text-green-600">{strategy.roi.toFixed(2)}%</strong></span>
                                <span>{t('crop_recommendations.results.risk')}: <strong className="text-amber-600">{strategy.risk.split(' ')[0]}</strong></span>
                                <span>{t('crop_recommendations.results.crops')}: <span className="text-muted-foreground">{strategy.suggestedCrops}</span></span>
                           </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 p-2">
                            <p className="text-muted-foreground">{strategy.description}</p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">{t('crop_recommendations.results.investment_breakdown')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableBody>
                                                <TableRow><TableCell>{t('crop_recommendations.results.seeds')}</TableCell><TableCell className="text-right">{formatCurrency(strategy.investmentBreakdown.seeds)}</TableCell></TableRow>
                                                <TableRow><TableCell>{t('crop_recommendations.results.machinery')}</TableCell><TableCell className="text-right">{formatCurrency(strategy.investmentBreakdown.machinery)}</TableCell></TableRow>
                                                <TableRow><TableCell>{t('crop_recommendations.results.labor')}</TableCell><TableCell className="text-right">{formatCurrency(strategy.investmentBreakdown.labor)}</TableCell></TableRow>
                                                <TableRow><TableCell>{t('crop_recommendations.results.pesticides')}</TableCell><TableCell className="text-right">{formatCurrency(strategy.investmentBreakdown.pesticides)}</TableCell></TableRow>
                                                <TableRow><TableCell>{t('crop_recommendations.results.other')}</TableCell><TableCell className="text-right">{formatCurrency(strategy.investmentBreakdown.other)}</TableCell></TableRow>
                                                <TableRow className="font-bold bg-muted/50"><TableCell>{t('crop_recommendations.results.total_investment')}</TableCell><TableCell className="text-right">{formatCurrency(strategy.totalInvestment)}</TableCell></TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                                <Card>
                                     <CardHeader>
                                        <CardTitle className="text-base">{t('crop_recommendations.results.financial_projection')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                                            <span className="font-medium">{t('crop_recommendations.results.expected_profit')}</span>
                                            <span className="font-bold text-lg text-primary">{formatCurrency(strategy.expectedProfit)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                                            <span className="font-medium">{t('crop_recommendations.results.roi_full')}</span>
                                            <span className="font-bold text-lg text-primary">{strategy.roi.toFixed(2)}%</span>
                                        </div>
                                        <Alert>
                                            <AlertTitle className="font-semibold">{t('crop_recommendations.results.risk_assessment')}</AlertTitle>
                                            <AlertDescription>{strategy.risk}</AlertDescription>
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
            
            {recommendations.extraSuggestions && (
                 <Alert className="mt-8 border-primary/50 bg-primary/5">
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle className="font-semibold text-primary">{t('crop_recommendations.results.extra_suggestions')}</AlertTitle>
                    <AlertDescription className="whitespace-pre-line">
                        {recommendations.extraSuggestions}
                    </AlertDescription>
                </Alert>
            )}
        </div>
      )}
    </>
  );
}
