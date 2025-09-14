
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { yieldPrediction, YieldPredictionOutput } from '@/ai/flows/yield-prediction';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CalendarIcon, TrendingUp, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  cropType: z.string().min(1, 'Please select a crop type.'),
  landArea: z.coerce.number().min(0.1, 'Land area must be at least 0.1 hectares.'),
  soilType: z.string().min(1, 'Please select a soil type.'),
  plantingDate: z.date({ required_error: 'A planting date is required.' }),
  historicalAverageYield: z.coerce.number().optional(),
  weatherForecast: z.string().min(1, 'Please select a weather forecast.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function YieldPredictionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<YieldPredictionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: '',
      landArea: 1,
      soilType: '',
      plantingDate: new Date(),
      weatherForecast: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await yieldPrediction({
        ...values,
        plantingDate: format(values.plantingDate, 'yyyy-MM-dd'),
      });
      setPrediction(result);
    } catch (error) {
      console.error('Failed to get yield prediction', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Prediction',
        description: 'The AI model could not generate a prediction. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="cropType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a crop" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Soybean">Soybean</SelectItem>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Maize">Maize</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="landArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Area (hectares)</FormLabel>
                  <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Alluvial">Alluvial</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                      <SelectItem value="Loamy">Loamy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Planting Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weatherForecast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seasonal Weather Forecast</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select forecast" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Normal Monsoon">Normal Monsoon</SelectItem>
                      <SelectItem value="Above-average rainfall">Above-average rainfall</SelectItem>
                      <SelectItem value="Below-average rainfall">Below-average rainfall</SelectItem>
                      <SelectItem value="Drought conditions likely">Drought conditions likely</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="historicalAverageYield"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Yield (tons/ha)</FormLabel>
                  <FormControl><Input type="number" step="0.1" placeholder="Optional" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Predict Yield
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Running prediction models...</p>
        </div>
      )}

      {prediction && (
        <div className="mt-8 space-y-6">
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <TrendingUp />
                    Yield Prediction Result
                </CardTitle>
                <CardDescription>Based on the data you provided, here is the estimated yield for your crop.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="text-center p-4 bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground">Predicted Total Yield</p>
                        <p className="text-4xl font-bold text-primary">{prediction.predictedYield.toFixed(2)} tons</p>
                        <p className="text-sm font-semibold">{prediction.yieldPerHectare.toFixed(2)} tons / hectare</p>
                    </div>
                     <div className="p-4 bg-background rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                        <div className="flex items-center gap-2">
                             <Progress value={prediction.confidenceScore} className="h-2" />
                             <span className="font-bold text-primary">{prediction.confidenceScore}%</span>
                        </div>
                    </div>
                </div>
                 <div className="space-y-4">
                    <Alert className="bg-green-500/10 border-green-500/20">
                        <ThumbsUp className="h-4 w-4 text-green-700" />
                        <AlertTitle className="font-semibold text-green-800">Positive Factors</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-4 text-xs">
                                {prediction.factors.positive.map((factor, i) => <li key={i}>{factor}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                     <Alert className="bg-amber-500/10 border-amber-500/20">
                        <ThumbsDown className="h-4 w-4 text-amber-700" />
                        <AlertTitle className="font-semibold text-amber-800">Negative Factors & Risks</AlertTitle>
                        <AlertDescription>
                             <ul className="list-disc pl-4 text-xs">
                                {prediction.factors.negative.map((factor, i) => <li key={i}>{factor}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                </div>
            </CardContent>
          </Card>
          <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle className="font-semibold">Recommendations</AlertTitle>
              <AlertDescription>
                {prediction.recommendations}
              </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
