
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronLeft, ArrowRight } from 'lucide-react';

const agronomicPractices = [
    { id: 'climate', title: 'Climate requirement', imageId: 'practice-climate' },
    { id: 'soil', title: 'Soil requirement', imageId: 'practice-soil' },
    { id: 'land', title: 'Land preparation', imageId: 'practice-land-prep' },
    { id: 'sowing', title: 'Season, Seed and sowing', imageId: 'practice-sowing' },
    { id: 'variety', title: 'Variety recommendation', imageId: 'practice-variety' },
    { id: 'seed', title: 'Seed selection and treatment', imageId: 'practice-seed-treatment' },
    { id: 'weed', title: 'Weed management', imageId: 'practice-weed-management' },
    { id: 'nutrition', title: 'Nutrition management', imageId: 'practice-nutrition' },
    { id: 'nutrient', title: 'Nutrient deficiency management', imageId: 'practice-nutrient-deficiency' },
    { id: 'water', title: 'Water management', imageId: 'practice-water-management' },
    { id: 'tips', title: 'Useful tips', imageId: 'practice-useful-tips' },
    { id: 'mechanisation', title: 'Mechanisation', imageId: 'practice-mechanisation' },
];

const stageData = {
  'field-preparation': {
    title: 'Field Preparation',
    dateRange: '-30 - 0 days',
    description: 'Deep summer ploughing once in 2-3 years or one normal summer ploughing followed by 2-3 cross harrowing or cultivation for ideal seed bed of good tilth for soybean crop.',
    imageIconId: 'practice-land-prep',
    content: {
        climate: [
            'Germination & seedling growth:',
            '• The ideal rainfall range is between 500 and 1000mm.',
            '• Soybean grows well in warm and moist climate. A temperature of 25 to 30°C appears to be the optimum for most of the varieties.',
            '• Soil temperatures of 15.5°C or above (upto 25 to 30C) favor rapid germination and vigorous seedling growth.',
            '• Growth rates decrease above 35°C and below 18°C.',
            '',
            'Flowering and Pod setting:',
            '• In some varieties, flowering may be delayed at temperatures below 24°C. Minimum temperatures for growth are about 10°C and for crop production about 15°C.',
            '• A lower temperature tends to delay the flowering. Day length is the key factor in most of the soybean varieties as they are short day plants. In northern India soybean can be planted from third week of June to first fortnight of July.',
            '• Only 25 to 30 percent of the flowers produce set pods, the final number depending on the plant vigour during the flowering period.',
            '• Temperatures below 21°C and above 32°C can reduce flowering and pod set. Extreme temperatures above 40°C are harmful for seed production.',
        ]
    }
  }
};

export default function CropStageDetailPage({ params }: { params: { cropName: string, stageName: string } }) {
    const data = stageData[params.stageName as keyof typeof stageData];
    const { cropName, stageName } = params;
    const helpCardImage = PlaceHolderImages.find(img => img.id === 'help-card-image');

    if (!data) {
        return <div className="p-4">Stage details not found</div>;
    }

    const imageIcon = PlaceHolderImages.find(img => img.id === data.imageIconId);

    return (
        <div className="bg-muted/20 min-h-screen">
             <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-primary px-4 sm:px-6">
                <Button asChild variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
                    <Link href={`/my-crops/${cropName}`}>
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold text-primary-foreground capitalize">{stageName.replace(/-/g, ' ')}</h1>
            </header>

            <main className="p-4 space-y-6 pb-24">
                <Card className="overflow-hidden">
                    <div className="bg-muted/50 h-32 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                            <line x1="22" x2="18" y1="11" y2="11" />
                            <line x1="6" x2="2" y1="11" y2="11" />
                            <line x1="15" x2="9" y1="18" y2="18" />
                        </svg>
                    </div>
                    <CardHeader>
                        <p className="text-sm text-muted-foreground">{data.dateRange}</p>
                        <div className="flex items-center gap-4">
                            {imageIcon && (
                                <Image
                                    src={imageIcon.imageUrl}
                                    alt={imageIcon.description}
                                    width={40}
                                    height={40}
                                    data-ai-hint={imageIcon.imageHint}
                                    className="h-10 w-10 object-contain"
                                />
                            )}
                            <CardTitle className="text-2xl">{data.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{data.description}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Agronomical practices.</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Accordion type="single" collapsible defaultValue="climate">
                            {agronomicPractices.map((practice) => {
                                const practiceImage = PlaceHolderImages.find(p => p.id === practice.imageId);
                                return (
                                <AccordionItem value={practice.id} key={practice.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-4">
                                            {practiceImage && (
                                                <Image
                                                    src={practiceImage.imageUrl}
                                                    alt={practiceImage.description}
                                                    width={40}
                                                    height={40}
                                                    data-ai-hint={practiceImage.imageHint}
                                                    className="h-10 w-10 object-cover rounded-md"
                                                />
                                            )}
                                            <span className="font-semibold">{practice.title}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4 border-l-2 border-primary/50 ml-6">
                                       <div className="prose prose-sm text-muted-foreground whitespace-pre-line">
                                            {(data.content[practice.id as keyof typeof data.content] as string[] || ['No information available for this section.']).join('\n')}
                                       </div>
                                    </AccordionContent>
                                </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </CardContent>
                </Card>

                <Card className="bg-primary/90 text-primary-foreground overflow-hidden">
                    <div className="grid grid-cols-2 items-center">
                        <div className="p-6">
                            <h3 className="text-lg font-bold">Do you need help with your crop?</h3>
                            <p className="text-sm text-primary-foreground/80 mb-4">Get assistance from agri experts.</p>
                            <Button variant="secondary">Ask query</Button>
                        </div>
                        <div className="relative h-full w-full min-h-[140px]">
                           {helpCardImage && (
                                <Image
                                    src={helpCardImage.imageUrl}
                                    alt={helpCardImage.description}
                                    fill
                                    data-ai-hint={helpCardImage.imageHint}
                                    className="object-cover"
                                />
                           )}
                        </div>
                    </div>
                </Card>
            </main>
            
             <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t flex justify-end">
                <Button size="lg">
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
