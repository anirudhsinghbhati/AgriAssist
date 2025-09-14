
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavStore } from "@/hooks/use-nav-store";
import { navConfig } from "@/lib/nav-config";
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
    const { toast } = useToast();
    const storeVisibility = useNavStore((state) => state.visibility);
    const setVisibility = useNavStore((state) => state.setVisibility);
    
    const [localVisibility, setLocalVisibility] = React.useState(storeVisibility);
    
    React.useEffect(() => {
        setLocalVisibility(storeVisibility);
    }, [storeVisibility]);

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
        toast({
            title: 'Settings Saved',
            description: 'Your navigation preferences have been updated.',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                    Customize your app experience. Manage navigation links and other preferences here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
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
