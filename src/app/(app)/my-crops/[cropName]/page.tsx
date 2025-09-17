
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AlertTriangle, ChevronLeft, MessageCircle, Plus } from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---
const cropData = {
    soybean: {
        name: 'Soybean',
        iconId: 'soybean-crop',
        currentStage: 'Vegetative Growth',
        stages: [
            { name: 'Field Preparation', duration: '-30 - 0 days', status: 'completed', link: 'field-preparation' },
            { name: 'Sowing', duration: '0 - 1 days', status: 'completed', link: 'sowing' },
            { name: 'Emergence', duration: '3 - 10 days', status: 'active', link: 'emergence' },
            { name: 'Vegetative Growth', duration: '11 - 40 days', status: 'upcoming', link: 'vegetative-growth' },
            { name: 'Flowering', duration: '41 - 65 days', status: 'upcoming', link: 'flowering' },
            { name: 'Pod Development', duration: '66 - 95 days', status: 'upcoming', link: 'pod-development' },
            { name: 'Maturity', duration: '96 - 120 days', status: 'upcoming', link: 'maturity' },
        ],
        pests: [
            { name: 'Aphids', imageId: 'pest-aphids' },
            { name: 'Bihar hairy caterpillar', imageId: 'pest-caterpillar' },
            { name: 'Girdle beetle', imageId: 'pest-girdle-beetle' },
        ],
        expertAdvice: [
            { 
                id: 1, 
                author: 'Farmer',
                avatar: 'https://picsum.photos/seed/farmerq/40/40',
                date: '12 Sep',
                query: 'kon disease ke karan mera podha khrab ho raha hai or kaise thik kare ise',
            },
            {
                id: 2,
                author: 'AgriKrishi expert',
                avatar: 'https://picsum.photos/seed/expertq/40/40',
                date: '13 Sep',
                answer: 'नमस्ते किसान जी, आपका प्रश्न स्पष्ट नहीं है, इसलिए आ...',
                isExpert: true,
            }
        ],
        bestPractices: [
            { title: 'Climate requirement', imageId: 'practice-climate' },
            { title: 'Soil requirement', imageId: 'practice-soil' },
            { title: 'Sowing practices', imageId: 'practice-sowing' },
        ]
    }
    // Add other crops here
};

const PlantIcon = ({ status }: { status: 'completed' | 'active' | 'upcoming' }) => {
    let color = 'text-muted-foreground/50';
    if (status === 'active') color = 'text-primary';
    if (status === 'completed') color = 'text-primary/80';
    
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-10 h-10 ${color}`}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15.5v-1c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5v1c0 .28-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5zm3.5-2.5h-5c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v5c0 .28-.22.5-.5.5z" opacity="0.1" />
            <path d="M17.5 10.5c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5c0 .93.51 1.74 1.25 2.19V14h2.5v-1.31c.74-.45 1.25-1.26 1.25-2.19z" />
            <path d="M12 1c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 17c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.2"/>
             <path d="M12,4c-3.86,0-7,3.14-7,7s3.14,7,7,7s7-3.14,7-7S15.86,4,12,4z M15,14h-2v2h-2v-2H9v-2h2v-2h2v2h2V14z" opacity="0.1"/>
            <path d="M12.5,10.25 C12.5,9.83578644 12.1642136,9.5 11.75,9.5 C11.3357864,9.5 11,9.83578644 11,10.25 L11,12.5 L8.75,12.5 C8.33578644,12.5 8,12.8357864 8,13.25 C8,13.6642136 8.33578644,14 8.75,14 L11,14 L11,16.25 C11,16.6642136 11.3357864,17 11.75,17 C12.1642136,17 12.5,16.6642136 12.5,16.25 L12.5,14 L14.75,14 C15.1642136,14 15.5,13.6642136 15.5,13.25 C15.5,12.8357864 15.1642136,12.5 14.75,12.5 L12.5,12.5 L12.5,10.25 Z M12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 Z M12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 Z" opacity="0.1"/>
            <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7z M12,15c-1.65,0-3-1.35-3-3s1.35-3,3-3s3,1.35,3,3S13.65,15,12,15z" opacity="0.1"/>
        </svg>
    );
};

export default function MyCropDetailPage({ params }: { params: { cropName: string } }) {
    const data = cropData[params.cropName as keyof typeof cropData];

    if (!data) {
        return <div className="p-4">Crop not found</div>;
    }

    const icon = PlaceHolderImages.find(img => img.id === data.iconId);

    return (
        <div className="bg-muted/20 min-h-screen">
             <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-primary px-4 sm:px-6">
                <Button asChild variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
                    <Link href="/dashboard">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                     {icon && (
                        <div className="p-2 bg-primary-foreground rounded-lg">
                            <Image
                                src={icon.imageUrl}
                                alt={icon.description}
                                width={24}
                                height={24}
                                data-ai-hint={icon.imageHint}
                                className="h-6 w-6 object-contain"
                            />
                        </div>
                    )}
                    <h1 className="text-xl font-bold text-primary-foreground">{data.name}</h1>
                </div>
                <Button variant="secondary" size="icon" className="ml-auto rounded-full">
                    <Plus className="h-5 w-5" />
                </Button>
            </header>

            <main className="p-4 space-y-6 pb-24">
                {/* Crop Growth Stages */}
                <Card>
                    <CardHeader>
                        <CardTitle>Crop growth stages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex overflow-x-auto space-x-2 pb-2">
                            {data.stages.map((stage, index) => (
                                <Link key={stage.name} href={`/my-crops/${params.cropName}/${stage.link}`} className="block">
                                    <div className={`flex-shrink-0 w-28 text-center p-2 rounded-lg transition-all ${stage.status === 'active' ? 'bg-primary/10' : ''}`}>
                                        <p className={`text-sm font-semibold ${stage.status === 'active' ? 'text-primary' : 'text-foreground'}`}>{stage.name}</p>
                                        <p className="text-xs text-muted-foreground">{stage.duration}</p>
                                        <div className={`mt-4 h-20 flex flex-col justify-end items-center ${stage.status === 'active' ? 'bg-primary/10' : ''}`}>
                                            <div style={{ transform: `scale(${1 + index * 0.1})` }}>
                                                <PlantIcon status={stage.status} />
                                            </div>
                                        </div>
                                        <div className={`h-1 w-full rounded-full ${stage.status !== 'upcoming' ? 'bg-primary' : 'bg-muted'}`}/>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Pests and Diseases */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Pests and diseases</CardTitle>
                             <Link href="#" className="text-sm font-medium text-primary hover:underline">View all</Link>
                        </div>
                        <CardDescription>Showing results for {data.currentStage}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {data.pests.map(pest => {
                            const pestImage = PlaceHolderImages.find(img => img.id === pest.imageId);
                            return (
                                <div key={pest.name} className="space-y-2">
                                    {pestImage && (
                                        <Image
                                            src={pestImage.imageUrl}
                                            alt={pestImage.description}
                                            width={400}
                                            height={300}
                                            data-ai-hint={pestImage.imageHint}
                                            className="rounded-lg object-cover aspect-video"
                                        />
                                    )}
                                    <p className="text-sm font-medium text-center">{pest.name}</p>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
                
                {/* Videos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Videos</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-10">
                        <div className="flex justify-center items-center">
                            <AlertTriangle className="h-10 w-10 text-amber-500" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No data available</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Currently there is no data to show on this page.</p>
                    </CardContent>
                </Card>
                
                {/* Expert Advice */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Expert advice</CardTitle>
                             <Link href="/community" className="text-sm font-medium text-primary hover:underline">View all</Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.expertAdvice.map(advice => (
                           <div key={advice.id} className="p-4 border rounded-lg space-y-2 bg-background">
                                <div className="flex items-center gap-2">
                                     <Image src={advice.avatar} alt="avatar" width={24} height={24} className="rounded-full h-6 w-6" />
                                     <span className="text-sm font-semibold">{advice.author}</span>
                                     <span className="text-xs text-muted-foreground">{advice.date}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{advice.query || advice.answer}</p>
                                 <Link href="/community" className="text-sm font-medium text-primary hover:underline">
                                    {advice.query ? 'Read more' : 'View full answer'}
                                </Link>
                           </div>
                        ))}
                    </CardContent>
                </Card>
                
                {/* Best Practices */}
                <Card>
                     <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Best practices</CardTitle>
                             <Link href="#" className="text-sm font-medium text-primary hover:underline">View all</Link>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                         {data.bestPractices.map(practice => {
                            const practiceImage = PlaceHolderImages.find(img => img.id === practice.imageId);
                            return (
                                <div key={practice.title} className="relative rounded-lg overflow-hidden aspect-square">
                                    {practiceImage && (
                                        <Image
                                            src={practiceImage.imageUrl}
                                            alt={practiceImage.description}
                                            fill
                                            data-ai-hint={practiceImage.imageHint}
                                            className="object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                                    <p className="absolute bottom-2 left-2 text-sm font-semibold text-white">{practice.title}</p>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

            </main>
            
        </div>
    );
}
