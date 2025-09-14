
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, RefreshCw, GitBranch, Shield, Package } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const resources = [
  {
    title: "Seed Selection Guide",
    description: "Find the best seed varieties for your soil, climate, and desired yield. Compare options based on resistance, maturity, and market value.",
    icon: GitBranch,
    link: "/resource-hub/seed-selection-guide",
    imageId: "resource-seed-guide"
  },
  {
    title: "Crop Rotation Planner",
    description: "Design effective crop rotation schedules to improve soil health, manage pests, and increase long-term productivity.",
    icon: RefreshCw,
    link: "#",
    imageId: "resource-crop-rotation"
  },
  {
    title: "Organic Pest Control",
    description: "Explore a database of organic and sustainable methods to control common pests and diseases without synthetic chemicals.",
    icon: Shield,
    link: "#",
    imageId: "resource-organic-pest"
  },
  {
    title: "Post-Harvest Handling",
    description: "Learn the best practices for harvesting, storing, and transporting your crops to minimize loss and maximize market value.",
    icon: Package,
    link: "#",
    imageId: "resource-post-harvest"
  }
];

export default function ResourceHubPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Hub</CardTitle>
          <CardDescription>
            Access guides, planners, and tools to help you make informed decisions for your farm.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        {resources.map((resource) => {
          const resourceImage = PlaceHolderImages.find(img => img.id === resource.imageId);
          return (
            <Card key={resource.title} className="flex flex-col overflow-hidden">
                {resourceImage && (
                    <div className="relative h-40 w-full">
                        <Image
                            src={resourceImage.imageUrl}
                            alt={resourceImage.description}
                            fill
                            data-ai-hint={resourceImage.imageHint}
                            className="object-cover"
                        />
                    </div>
                )}
              <CardHeader className="flex-grow">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <resource.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription className="mt-2">{resource.description}</CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" disabled={resource.link === '#'}>
                  <Link href={resource.link}>
                    {resource.link === '#' ? 'Coming Soon' : 'Open Guide'}
                    {resource.link !== '#' && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}
