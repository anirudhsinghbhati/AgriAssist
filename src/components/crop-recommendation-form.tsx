'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { personalizedCropRecommendations } from '@/ai/flows/personalized-crop-recommendations';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  location: z.string().min(2, { message: 'Location is required.' }),
  ph: z.coerce.number().min(0).max(14),
  nitrogen: z.coerce.number().min(0),
  phosphorus: z.coerce.number().min(0),
  potassium: z.coerce.number().min(0),
  temperature: z.coerce.number(),
  rainfall: z.coerce.number().min(0),
  humidity: z.coerce.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

export default function CropRecommendationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      ph: 7,
      nitrogen: 50,
      phosphorus: 50,
      potassium: 50,
      temperature: 25,
      rainfall: 100,
      humidity: 60,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await personalizedCropRecommendations({
        location: values.location,
        soilData: JSON.stringify({
          ph: values.ph,
          nitrogen: values.nitrogen,
          phosphorus: values.phosphorus,
          potassium: values.potassium,
        }),
        weatherData: JSON.stringify({
          temperature: values.temperature,
          rainfall: values.rainfall,
          humidity: values.humidity,
        }),
      });
      setRecommendation(result.cropRecommendations);
    } catch (error) {
      console.error('Failed to get recommendations', error);
      // Here you might want to use a toast notification
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (City/Region)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Punjab, India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ph"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil pH Level</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nitrogen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nitrogen (N) Content (kg/ha)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phosphorus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phosphorus (P) Content (kg/ha)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="potassium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potassium (K) Content (kg/ha)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Temperature (°C)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="rainfall"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Rainfall (mm)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="humidity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Humidity (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Recommendations
          </Button>
        </form>
      </Form>
      {recommendation && (
        <Card className="mt-8 bg-primary/5">
            <CardHeader>
                <CardTitle>Your Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-line">{recommendation}</p>
            </CardContent>
        </Card>
      )}
    </>
  );
}
