
'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { smartIrrigationPlanner, SmartIrrigationPlannerOutput } from '@/ai/flows/smart-irrigation-planner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Droplets, Clock, Info, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import stateDistrictData from '@/lib/india-states-districts.json';
import { useNavStore } from '@/hooks/use-nav-store';

const formSchema = z.object({
  cropType: z.string().min(1, 'Please select a crop type.'),
  cropStage: z.string().min(1, 'Please select a crop stage.'),
  soilMoisture: z.coerce.number().min(0).max(100, 'Soil moisture must be between 0 and 100.'),
  state: z.string().min(1, 'State is required.'),
  district: z.string().min(1, 'District is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function IrrigationPlannerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<SmartIrrigationPlannerOutput | null>(null);
  const { toast } = useToast();
  const { language } = useNavStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: 'Soybean',
      cropStage: 'Flowering',
      soilMoisture: 45,
      state: 'Madhya Pradesh',
      district: 'Indore',
    },
  });

  const selectedState = form.watch('state');

  const districts = useMemo(() => {
    if (!selectedState) return [];
    const state = stateDistrictData.states.find(s => s.state === selectedState);
    return state ? state.districts : [];
  }, [selectedState]);


  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await smartIrrigationPlanner({
        ...values,
        language: language === 'hi' ? 'Hindi' : 'English',
      });
      setRecommendation(result);
    } catch (error) {
      console.error('Failed to get irrigation plan', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: 'The AI model seems to be busy. Please try again in a moment.',
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
                      <SelectItem value="Tomato">Tomato</SelectItem>
                      <SelectItem value="Onion">Onion</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cropStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Stage</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a stage" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Germination">Germination</SelectItem>
                      <SelectItem value="Vegetative">Vegetative</SelectItem>
                      <SelectItem value="Flowering">Flowering</SelectItem>
                      <SelectItem value="Maturity">Maturity</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="soilMoisture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soil Moisture (%)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>State</FormLabel>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        form.resetField('district');
                    }} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stateDistrictData.states.map((state) => (
                            <SelectItem key={state.state} value={state.state}>{state.state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>District</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={!selectedState ? "Select a state first" : "Select a district"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                  </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Irrigation Plan
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="mt-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Generating your irrigation plan...</p>
        </div>
      )}

      {recommendation && (
        <div className="mt-8">
            <Card className={recommendation.irrigationRequired ? 'border-primary/50 bg-primary/5' : 'border-amber-500/50 bg-amber-500/5'}>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {recommendation.irrigationRequired 
                            ? <><CheckCircle className="text-primary" /> Irrigation Recommended</>
                            : <><XCircle className="text-amber-600"/> No Irrigation Needed</>
                        }
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {recommendation.irrigationRequired && recommendation.recommendedAmount && (
                         <div className="grid sm:grid-cols-2 gap-4">
                            <Alert>
                                <Droplets className="h-4 w-4" />
                                <AlertTitle>Water Amount</AlertTitle>
                                <AlertDescription>
                                    <p className="text-xl font-bold">{recommendation.recommendedAmount} mm</p>
                                    <p className="text-xs text-muted-foreground">({(recommendation.recommendedAmount * 10000).toLocaleString('en-IN')} Liters/hectare)</p>
                                </AlertDescription>
                            </Alert>
                             <Alert>
                                <Clock className="h-4 w-4" />
                                <AlertTitle>Best Time to Water</AlertTitle>
                                <AlertDescription>
                                    <p className="text-xl font-bold">{recommendation.timing}</p>
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Reasoning</AlertTitle>
                        <AlertDescription>
                            {recommendation.reasoning}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
      )}
    </>
  );
}
