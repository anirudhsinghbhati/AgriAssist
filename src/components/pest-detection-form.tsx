'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aiDrivenPestDiseaseDetection } from '@/ai/flows/ai-driven-pest-disease-detection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type DetectionResult = {
  diagnosis: string;
  treatmentSuggestions: string;
};

export default function PestDetectionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('File size must be less than 4MB.');
        setPreview(null);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!preview) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await aiDrivenPestDiseaseDetection({ photoDataUri: preview });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the image. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was a problem analyzing your image. Please try another one.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors" onClick={() => fileInputRef.current?.click()}>
          <Input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="hidden"
            id="crop-image"
          />
          {preview ? (
            <div className="relative w-full max-w-sm mx-auto aspect-square">
              <Image src={preview} alt="Crop preview" fill className="object-contain rounded-md" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="w-10 h-10" />
                <p>Click to upload or drag &amp; drop an image</p>
                <p className='text-xs'>(Max file size: 4MB)</p>
            </div>
          )}
        </div>
        
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        <Button type="submit" disabled={isLoading || !preview} className="w-full sm:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Analyzing...' : 'Analyze Crop Image'}
        </Button>
      </form>

      {result && (
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle>Diagnosis</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">{result.diagnosis}</p>
                </CardContent>
            </Card>
            <Card className="bg-accent/5">
                <CardHeader>
                    <CardTitle>Treatment Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">{result.treatmentSuggestions}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
