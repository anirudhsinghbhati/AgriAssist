
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { personalizedCropRecommendations, PersonalizedCropRecommendationsOutput } from '@/ai/flows/personalized-crop-recommendations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, TrendingUp, ShieldAlert, Thermometer, Bug, CalendarDays, MapPin, Sprout, ShoppingCart, Tractor, Phone, Leaf } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
    } catch (error)
      {
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
        <div className="mt-8 space-y-8">
            <div className='space-y-2'>
                <h2 className="text-3xl font-bold tracking-tight">🌾 Crop Recommendation for {recommendations.farmerName}</h2>
                <p className='text-muted-foreground'>Here is a detailed analysis and tailored farming plan for your land.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><MapPin className='text-primary'/> Location & Soil Analysis</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <p className='text-muted-foreground'>{recommendations.locationAndSoilAnalysis.summary}</p>
                    <div className='flex flex-wrap gap-2'>
                        <Badge variant="outline">Soil: {recommendations.locationAndSoilAnalysis.soilType}</Badge>
                        {recommendations.locationAndSoilAnalysis.suitableCrops.map(crop => (
                            <Badge variant="secondary" key={crop}>{crop}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div>
                 <h3 className="text-2xl font-bold tracking-tight mb-4">🥇 Top 3 Crop Choices</h3>
                 <div className='grid lg:grid-cols-3 gap-6'>
                    {recommendations.topCropChoices.map((strategy, index) => (
                        <Card key={index} className='flex flex-col'>
                             <CardHeader>
                                <Badge className='mb-2 w-fit'><Leaf className='mr-1.5 h-3 w-3'/> {strategy.recommendedCrops}</Badge>
                                <CardTitle>{strategy.strategyName}</CardTitle>
                            </CardHeader>
                             <CardContent className='space-y-4 flex-grow flex flex-col'>
                                <p className="text-sm text-muted-foreground border-l-2 border-primary/50 pl-3">{strategy.rationale}</p>
                                
                                <div className='space-y-3 mt-auto pt-4'>
                                    <h4 className='font-semibold text-sm'>Economics</h4>
                                    <div className="space-y-2 text-sm p-3 bg-muted/50 rounded-md">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Investment</span>
                                            <span className="font-bold">{formatCurrency(strategy.economics.totalInvestment)}</span>
                                        </div>
                                         <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Expected Profit</span>
                                            <span className="font-bold text-green-600">{formatCurrency(strategy.economics.expectedProfit)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Return on Investment</span>
                                            <span className="font-bold text-green-600">{strategy.economics.roi.toFixed(2)}%</span>
                                        </div>
                                    </div>
                                    <p className='text-xs text-center text-muted-foreground'>Expected Yield: {strategy.economics.expectedYield}</p>
                                </div>
                             </CardContent>
                        </Card>
                    ))}
                 </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><CalendarDays className='text-primary'/> Cultivation Calendar & Tasks</CardTitle>
                    <CardDescription>A general timeline for the recommended crops.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Recommended Crop</TableHead>
                                <TableHead>Month</TableHead>
                                <TableHead>Key Tasks</TableHead>
                            </TableRow>
                        </TableHeader>
                         <TableBody>
                            {recommendations.topCropChoices.map((strategy) => 
                                strategy.cultivationCalendar.map((step, stepIndex) => (
                                    <TableRow key={`${strategy.recommendedCrops}-${step.month}`}>
                                        {stepIndex === 0 && (
                                            <TableCell rowSpan={strategy.cultivationCalendar.length} className="font-semibold align-top text-primary">{strategy.recommendedCrops}</TableCell>
                                        )}
                                        <TableCell className='font-medium'>{step.month}</TableCell>
                                        <TableCell>{step.tasks}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><ShieldAlert className='text-primary'/> Risks & Mitigation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {recommendations.topCropChoices.map((strategy, index) => (
                            <div key={index}>
                                <h4 className='font-semibold mb-3 text-md text-primary'>{strategy.recommendedCrops}</h4>
                                <div className="space-y-3">
                                    <Alert variant="destructive" className="bg-red-500/5 border-red-500/20">
                                        <Thermometer className="h-4 w-4 text-red-600" />
                                        <AlertTitle>Weather</AlertTitle>
                                        <AlertDescription>{strategy.risksAndMitigation.weather}</AlertDescription>
                                    </Alert>
                                    <Alert className="bg-amber-500/5 border-amber-500/20">
                                        <Bug className="h-4 w-4 text-amber-600" />
                                        <AlertTitle>Pest & Disease</AlertTitle>
                                        <AlertDescription>{strategy.risksAndMitigation.pest}</AlertDescription>
                                    </Alert>
                                    <Alert className="bg-blue-500/5 border-blue-500/20">
                                        <TrendingUp className="h-4 w-4 text-blue-600" />
                                        <AlertTitle>Market</AlertTitle>
                                        <AlertDescription>{strategy.risksAndMitigation.market}</AlertDescription>
                                    </Alert>
                                </div>
                                {index < recommendations.topCropChoices.length - 1 && <Separator className="my-6" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <div className='space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'><Sprout className='text-primary'/> Sustainable Practices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                                {recommendations.sustainablePractices.map((practice, i) => <li key={i}>{practice}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'><ShoppingCart className='text-primary'/> Market Strategy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{recommendations.marketStrategy}</p>
                        </CardContent>
                    </Card>
                 </div>
            </div>

            <Card className="border-primary bg-primary/5">
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Tractor className='text-primary'/> Your Next Actions</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <ol className="list-decimal space-y-2 pl-5 font-medium">
                        {recommendations.nextActions.map((action, i) => <li key={i}>{action}</li>)}
                    </ol>
                    <Separator />
                    <div className='flex items-center gap-3 text-sm'>
                         <Phone className="h-5 w-5 text-primary"/>
                         <p className='text-muted-foreground'><span className='font-semibold text-foreground'>Helpline:</span> {recommendations.helplineInfo}</p>
                    </div>
                </CardContent>
            </Card>

        </div>
      )}
    </>
  );
}
