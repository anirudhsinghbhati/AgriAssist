import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Video, MessageSquare } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const experts = [
  {
    id: 1,
    name: 'Dr. Anil Sharma',
    avatarId: 'avatar-anil',
    specialization: 'Pest & Disease Management',
    experience: 15,
    rating: 4.9,
    status: 'Online',
  },
  {
    id: 2,
    name: 'Mrs. Kavita Reddy',
    avatarId: 'avatar-kavita',
    specialization: 'Soil Health & Nutrition',
    experience: 12,
    rating: 4.8,
    status: 'Online',
  },
  {
    id: 3,
    name: 'Prof. Ramesh Gupta',
    avatarId: 'avatar-ramesh',
    specialization: 'Crop Science & Genetics',
    experience: 25,
    rating: 4.9,
    status: 'Offline',
  },
  {
    id: 4,
    name: 'Dr. Sunita Singh',
    avatarId: 'avatar-sunita-expert',
    specialization: 'Organic Farming',
    experience: 10,
    rating: 4.7,
    status: 'Online',
  },
];

export default function ConsultationPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Connect with an Expert</CardTitle>
                    <CardDescription>
                        Get one-on-one advice from our team of agricultural specialists. Browse available experts below and start a conversation.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {experts.map(expert => {
                     const avatar = PlaceHolderImages.find(img => img.id === expert.avatarId);
                     return (
                        <Card key={expert.id} className="flex flex-col">
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                                {avatar && (
                                    <Image
                                        src={avatar.imageUrl}
                                        alt={avatar.description}
                                        width={80}
                                        height={80}
                                        data-ai-hint={avatar.imageHint}
                                        className="h-20 w-20 rounded-full object-cover border-4 border-primary/20"
                                    />
                                )}
                                <div className="space-y-1 flex-1">
                                    <CardTitle className="text-xl">{expert.name}</CardTitle>
                                    <CardDescription>{expert.specialization}</CardDescription>
                                    <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                            <span className="font-semibold">{expert.rating}</span>
                                        </div>
                                        <span>{expert.experience} yrs exp.</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-end">
                                <div className="flex justify-between items-center">
                                    <Badge variant={expert.status === 'Online' ? 'default' : 'outline'} className={expert.status === 'Online' ? 'bg-green-500/20 text-green-700' : ''}>
                                        {expert.status}
                                    </Badge>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" disabled={expert.status === 'Offline'}>
                                            <MessageSquare className="h-5 w-5" />
                                            <span className="sr-only">Chat</span>
                                        </Button>
                                        <Button variant="outline" size="icon" disabled={expert.status === 'Offline'}>
                                            <Phone className="h-5 w-5" />
                                            <span className="sr-only">Voice Call</span>
                                        </Button>
                                        <Button variant="outline" size="icon" disabled={expert.status === 'Offline'}>
                                            <Video className="h-5 w-5" />
                                            <span className="sr-only">Video Call</span>
                                        </Button>
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
