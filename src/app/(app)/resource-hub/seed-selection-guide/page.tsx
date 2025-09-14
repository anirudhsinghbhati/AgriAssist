
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, BarChart, Sun, Droplets, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const seedData = [
  {
    id: 'soybean-js335',
    name: 'Soybean JS-335',
    crop: 'Soybean',
    imageId: 'seed-soybean-js335',
    description: 'A popular and widely cultivated variety, known for its high yield potential and resistance to major pests.',
    features: [
      { icon: BarChart, text: 'High Yield Potential (2.5-3.0 t/ha)' },
      { icon: Sun, text: 'Matures in 95-100 days' },
      { icon: Shield, text: 'Resistant to Girdle Beetle and Stem Fly' },
    ],
    idealFor: ['Black Soil', 'Rainfed Conditions'],
  },
  {
    id: 'soybean-nrc37',
    name: 'Soybean NRC-37',
    crop: 'Soybean',
    imageId: 'seed-soybean-nrc37',
    description: 'A high-yielding variety suitable for mechanical harvesting, with good oil content.',
    features: [
      { icon: BarChart, text: 'Excellent Yield (3.0-3.5 t/ha)' },
      { icon: Droplets, text: 'Good drought tolerance' },
      { icon: Sun, text: 'Matures in 100-105 days' },
    ],
    idealFor: ['Central India', 'Mechanized Farms'],
  },
  {
    id: 'cotton-bt',
    name: 'Cotton BT',
    crop: 'Cotton',
    imageId: 'seed-cotton-bt',
    description: 'Genetically modified to be resistant to bollworms, a major pest for cotton crops.',
    features: [
      { icon: Shield, text: 'Resistant to Bollworm complex' },
      { icon: BarChart, text: 'High yield and good fiber quality' },
      { icon: Sun, text: 'Matures in 150-160 days' },
    ],
    idealFor: ['Pest-prone areas', 'High-input farming'],
  },
  {
    id: 'cotton-dch32',
    name: 'Cotton DCH-32',
    crop: 'Cotton',
    imageId: 'seed-cotton-dch32',
    description: 'A long-staple cotton variety known for its superior fiber quality and high market price.',
    features: [
      { icon: BarChart, text: 'Premium fiber quality' },
      { icon: Droplets, text: 'Requires good irrigation' },
      { icon: Sun, text: 'Matures in 160-180 days' },
    ],
    idealFor: ['Irrigated Lands', 'Export market focus'],
  },
];

const cropFilters = ['All', 'Soybean', 'Cotton'];

export default function SeedSelectionGuidePage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredSeeds = activeFilter === 'All'
    ? seedData
    : seedData.filter(seed => seed.crop === activeFilter);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seed Selection Guide</CardTitle>
          <CardDescription>
            Choosing the right seed is the first step towards a successful harvest. This guide will help you select the best varieties for your farm's conditions.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap gap-2">
        {cropFilters.map(filter => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'default' : 'outline'}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSeeds.map(seed => {
          const seedImage = PlaceHolderImages.find(img => img.id === seed.imageId);
          return (
            <Card key={seed.id} className="flex flex-col">
              <CardHeader>
                {seedImage && (
                  <div className="relative h-40 w-full mb-4">
                    <Image
                      src={seedImage.imageUrl}
                      alt={seedImage.description}
                      fill
                      data-ai-hint={seedImage.imageHint}
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <CardTitle>{seed.name}</CardTitle>
                <CardDescription>{seed.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                    <ul className="space-y-3 mb-4">
                    {seed.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                            <feature.icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <span>{feature.text}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Ideal For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {seed.idealFor.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
