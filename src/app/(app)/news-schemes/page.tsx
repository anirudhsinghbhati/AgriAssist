
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

const schemes = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Scheme',
    category: 'Financial Aid',
    imageId: 'scheme-pm-kisan',
    description: 'The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a central sector scheme that provides income support to all landholding farmer families in the country.',
    link: '#',
  },
  {
    id: 'fasal-bima',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Insurance',
    imageId: 'scheme-fasal-bima',
    description: 'PMFBY is the government-sponsored crop insurance scheme that integrates multiple stakeholders on a single platform.',
    link: '#',
  },
  {
    id: 'soil-health-card',
    title: 'Soil Health Card Scheme',
    category: 'Soil Management',
    imageId: 'scheme-soil-health',
    description: 'A scheme to provide every farmer with a soil health card, which will help them to make informed decisions about the use of fertilizers.',
    link: '#',
  },
];

const news = [
  {
    id: 'monsoon-update',
    title: 'Monsoon arrives early in Kerala, farmers advised to expedite Kharif sowing',
    category: 'Weather',
    imageId: 'news-monsoon',
    description: 'The India Meteorological Department (IMD) has announced an early onset of the monsoon. Agricultural departments are urging farmers to prepare their fields.',
    link: '#',
  },
  {
    id: 'msp-hike',
    title: 'Government announces hike in Minimum Support Price (MSP) for Kharif crops',
    category: 'Market',
    imageId: 'news-msp-hike',
    description: 'The Cabinet Committee on Economic Affairs has approved an increase in the MSP for all mandated Kharif crops for the upcoming marketing season.',
    link: '#',
  },
];

export default function NewsAndSchemesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>News &amp; Government Schemes</CardTitle>
          <CardDescription>
            Stay updated with the latest agricultural news and beneficial government schemes for farmers.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="schemes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schemes">Government Schemes</TabsTrigger>
          <TabsTrigger value="news">Agricultural News</TabsTrigger>
        </TabsList>
        <TabsContent value="schemes">
          <div className="space-y-4 pt-4">
            {schemes.map((item) => {
              const image = PlaceHolderImages.find(img => img.id === item.imageId);
              return (
                <Card key={item.id} className="overflow-hidden">
                  <div className="grid md:grid-cols-3">
                    {image && (
                      <div className="relative h-48 md:h-full">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          data-ai-hint={image.imageHint}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="md:col-span-2 p-6">
                      <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                      <h3 className="text-xl font-bold mb-2 text-primary">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <Button asChild>
                        <a href={item.link}>
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="news">
          <div className="space-y-4 pt-4">
            {news.map((item) => {
              const image = PlaceHolderImages.find(img => img.id === item.imageId);
              return (
                 <Card key={item.id} className="overflow-hidden">
                  <div className="grid md:grid-cols-3">
                    {image && (
                      <div className="relative h-48 md:h-full">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          data-ai-hint={image.imageHint}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="md:col-span-2 p-6">
                      <Badge variant="outline" className="mb-2">{item.category}</Badge>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                       <Button asChild>
                        <a href={item.link}>
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
