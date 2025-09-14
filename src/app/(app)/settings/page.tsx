
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavStore } from "@/hooks/use-nav-store";
import { navConfig } from "@/lib/nav-config";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
    const { toast } = useToast();
    const { visibility, language, setVisibility, setLanguage } = useNavStore();
    
    const [localVisibility, setLocalVisibility] = React.useState(visibility);
    const [localLanguage, setLocalLanguage] = React.useState(language);
    
    React.useEffect(() => {
        setLocalVisibility(visibility);
    }, [visibility]);

    React.useEffect(() => {
        setLocalLanguage(language);
    }, [language]);

    const handleToggle = (id: string) => {
        const item = navConfig.find(item => item.id === id);
        if (item?.isLocked) return;
        setLocalVisibility(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    
    const handleApply = () => {
        setVisibility(localVisibility);
        setLanguage(localLanguage);
        toast({
            title: 'Settings Saved',
            description: 'Your preferences have been updated.',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                    Customize your app experience. Manage navigation links, language, and other preferences here.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Language</h3>
                        <div className="max-w-xs">
                             <Select value={localLanguage} onValueChange={setLocalLanguage}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-4">Customize Navigation Menu</h3>
                        <div className="space-y-4">
                            {navConfig.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <Label htmlFor={item.id} className="flex items-center gap-3 cursor-pointer">
                                        <item.icon className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{item.label}</span>
                                    </Label>
                                    <Switch
                                        id={item.id}
                                        checked={localVisibility[item.id] ?? true}
                                        onCheckedChange={() => handleToggle(item.id)}
                                        disabled={item.isLocked}
                                        aria-label={`Toggle ${item.label}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleApply}>Apply Changes</Button>
            </CardFooter>
        </Card>
    );
}
