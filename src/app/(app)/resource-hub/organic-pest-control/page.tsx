
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const pestControlData = [
  {
    id: 'neem-oil',
    name: 'Neem Oil Spray',
    type: 'Spray',
    imageId: 'organic-neem-oil',
    description: 'A natural broad-spectrum pesticide and fungicide derived from the neem tree. It disrupts the life cycle of insects at all stages (egg, larvae, adult).',
    targets: ['Aphids', 'Mites', 'Whiteflies', 'Fungus Gnats'],
  },
  {
    id: 'companion-planting',
    name: 'Companion Planting',
    type: 'Technique',
    imageId: 'organic-companion-planting',
    description: 'The practice of planting different crops in proximity for pest control, pollination, providing habitat for beneficial insects, and maximizing use of space.',
    targets: ['Nematodes', 'Cabbage Moths', 'Aphids'],
  },
  {
    id: 'beneficial-insects',
    name: 'Beneficial Insects',
    type: 'Biological',
    imageId: 'resource-organic-pest',
    description: 'Introducing natural predators or parasites to control pest populations. Ladybugs, lacewings, and parasitic wasps are common examples.',
    targets: ['Aphids', 'Mites', 'Caterpillars', 'Whiteflies'],
  },
  {
    id: 'crop-rotation',
    name: 'Crop Rotation',
    type: 'Technique',
    imageId: 'resource-crop-rotation',
    description: 'The practice of growing a series of different types of crops in the same area across a sequence of growing seasons to reduce reliance on one set of nutrients and combat pest and weed buildup.',
    targets: ['Soil-borne diseases', 'Nematodes', 'Rootworms'],
  },
  {
    id: 'sticky-traps',
    name: 'Sticky Traps',
    type: 'Trap',
    imageId: 'organic-sticky-traps',
    description: 'These traps use a sticky surface and often a specific color (like yellow for aphids) to attract and capture flying insects.',
    targets: ['Aphids', 'Whiteflies', 'Thrips', 'Leafminers'],
  },
  {
    id: 'diatomaceous-earth',
    name: 'Diatomaceous Earth',
    type: 'Barrier',
    imageId: 'organic-diatomaceous-earth',
    description: 'A fine powder made from fossilized algae. Its sharp microscopic edges are abrasive to the exoskeleton of insects, causing them to dry out and die.',
    targets: ['Slugs', 'Snails', 'Ants', 'Beetles'],
  },
];

const typeFilters = ['All', 'Spray', 'Technique', 'Biological', 'Trap', 'Barrier'];

export default function OrganicPestControlPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredMethods = activeFilter === 'All'
    ? pestControlData
    : pestControlData.filter(method => method.type === activeFilter);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organic Pest Control Guide</CardTitle>
          <CardDescription>
            Discover sustainable and effective methods to manage pests on your farm without synthetic chemicals.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-wrap gap-2">
        {typeFilters.map(filter => (
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
        {filteredMethods.map(method => {
          const methodImage = PlaceHolderImages.find(img => img.id === method.imageId);
          return (
            <Card key={method.id} className="flex flex-col">
              <CardHeader>
                {methodImage && (
                  <div className="relative h-40 w-full mb-4">
                    <Image
                      src={methodImage.imageUrl}
                      alt={methodImage.description}
                      fill
                      data-ai-hint={methodImage.imageHint}
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
                <CardTitle>{method.name}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Effective Against:</h4>
                  <div className="flex flex-wrap gap-2">
                    {method.targets.map(tag => (
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
