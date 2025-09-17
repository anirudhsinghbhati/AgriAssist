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
import { useTranslation } from '@/hooks/use-translation';
import { useNavStore } from '@/hooks/use-nav-store';

type DetectionResult = {
  diagnosis: string;
  treatmentSuggestions: string;
};

export default function PestDetectionForm() {
  const { t } = useTranslation();
  const { language } = useNavStore();
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
        setError(t('pest_detection.form.error_file_size'));
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
      setError(t('pest_detection.form.error_no_image'));
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await aiDrivenPestDiseaseDetection({
        photoDataUri: preview,
        language: language === 'hi' ? 'Hindi' : 'English',
      });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError(t('pest_detection.form.error_analysis'));
      toast({
        variant: 'destructive',
        title: t('pest_detection.toast.title'),
        description: t('pest_detection.toast.description'),
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
                <p>{t('pest_detection.form.upload_instruction')}</p>
                <p className='text-xs'>{t('pest_detection.form.upload_size_limit')}</p>
            </div>
          )}
        </div>
        
        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        <Button type="submit" disabled={isLoading || !preview} className="w-full sm:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t('pest_detection.form.button_analyzing') : t('pest_detection.form.button_analyze')}
        </Button>
      </form>

      {result && (
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle>{t('pest_detection.results.diagnosis')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">{result.diagnosis}</p>
                </CardContent>
            </Card>
            <Card className="bg-accent/5">
                <CardHeader>
                    <CardTitle>{t('pest_detection.results.treatment')}</CardTitle>
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
