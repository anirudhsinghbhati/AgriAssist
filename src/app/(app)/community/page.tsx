
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageCircle, Search, PlusCircle, ChevronDown } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const forumPosts = [
  {
    id: 1,
    author: 'Rajesh Kumar',
    avatarId: 'avatar-rajesh',
    title: 'Best practices for Soybean cultivation in monsoon?',
    excerpt: 'I am planning to sow soybean on my 5-hectare farm near Indore. What are some of the best practices for soil preparation and seed treatment before the monsoon arrives? Looking for advice on fertilizers too.',
    tags: ['Soybean', 'Cultivation', 'Monsoon'],
    likes: 23,
    comments: 8,
  },
  {
    id: 2,
    author: 'Anjali Patel',
    avatarId: 'avatar-anjali',
    title: 'Urgent: Whitefly infestation in my cotton crop!',
    excerpt: 'There is a severe whitefly attack on my BT cotton plants. I have tried neem oil spray, but it doesn\'t seem to be very effective. Are there any organic solutions that work at a larger scale?',
    tags: ['Pest Control', 'Cotton', 'Organic Farming'],
    likes: 15,
    comments: 12,
  },
  {
    id: 3,
    author: 'Vikram Singh',
    avatarId: 'avatar-vikram',
    title: 'Market price for organic wheat is soaring',
    excerpt: 'Just sold my organic wheat harvest at the local mandi for a 30% higher price than last year. The demand for organic produce is definitely on the rise. Anyone else experiencing this?',
    tags: ['Market Prices', 'Wheat', 'Success Story'],
    likes: 45,
    comments: 18,
  },
    {
    id: 4,
    author: 'Sunita Devi',
    avatarId: 'avatar-sunita',
    title: 'How to use drip irrigation for vegetables?',
    excerpt: 'I am setting up a new drip irrigation system for my vegetable farm (tomatoes and cucumbers). How long should I run the system each day? And what is the best way to add fertilizers through it?',
    tags: ['Irrigation', 'Vegetables', 'Technology'],
    likes: 31,
    comments: 9,
  },
];

export default function CommunityPage() {
    const userAvatar = PlaceHolderImages.find(img => img.id === 'avatar');
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Community Forum</CardTitle>
                    <CardDescription>
                        Connect with local farmers, share success stories, and get answers from experts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex items-center gap-3">
                            {userAvatar && (
                                <Image
                                    src={userAvatar.imageUrl}
                                    alt={userAvatar.description}
                                    width={40}
                                    height={40}
                                    data-ai-hint={userAvatar.imageHint}
                                    className="h-10 w-10 rounded-full object-cover hidden sm:block"
                                />
                            )}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input placeholder="Search topics, questions..." className="pl-10" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full sm:w-auto">
                                        Filter by: Latest
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Latest</DropdownMenuItem>
                                    <DropdownMenuItem>Most Popular</DropdownMenuItem>
                                    <DropdownMenuItem>Unanswered</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button className="w-full sm:w-auto">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                New Post
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {forumPosts.map(post => {
                     const avatar = PlaceHolderImages.find(img => img.id === post.avatarId);
                     return(
                        <Card key={post.id}>
                            <CardContent className="p-6 flex gap-4">
                                <div className="hidden sm:flex flex-col items-center gap-2 pt-1">
                                     {avatar && (
                                        <Image
                                            src={avatar.imageUrl}
                                            alt={avatar.description}
                                            width={48}
                                            height={48}
                                            data-ai-hint={avatar.imageHint}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        {avatar && (
                                            <Image
                                                src={avatar.imageUrl}
                                                alt={avatar.description}
                                                width={24}
                                                height={24}
                                                data-ai-hint={avatar.imageHint}
                                                className="h-6 w-6 rounded-full object-cover sm:hidden"
                                            />
                                        )}
                                        <p className="text-sm font-semibold">{post.author}</p>
                                    </div>
                                    <h3 className="text-lg font-semibold text-primary hover:underline cursor-pointer">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map(tag => (
                                                <Badge key={tag} variant="secondary">{tag}</Badge>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <ThumbsUp className="h-4 w-4" />
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MessageCircle className="h-4 w-4" />
                                                <span>{post.comments}</span>
                                            </div>
                                        </div>
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
