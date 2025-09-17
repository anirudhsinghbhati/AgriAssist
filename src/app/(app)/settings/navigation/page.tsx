
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavStore } from "@/hooks/use-nav-store";
import { navConfig } from "@/lib/nav-config";
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

export default function NavigationSettingsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { visibility, setVisibility } = useNavStore();
    
    const [localVisibility, setLocalVisibility] = React.useState(visibility);

    React.useEffect(() => {
        setLocalVisibility(visibility);
    }, [visibility]);

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
            title: t('settings.toast.title'),
            description: t('settings.toast.description'),
        });
    };

    const handleCancel = () => {
        setLocalVisibility(visibility);
    };

    const hasChanges = JSON.stringify(localVisibility) !== JSON.stringify(visibility);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.customize_nav.title')}</CardTitle>
                    <CardDescription>Toggle visibility for each navigation item in the sidebar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {navConfig.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <Label htmlFor={`visibility-${item.id}`} className="flex items-center gap-3 cursor-pointer">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{t(`nav.${item.id}`)}</span>
                            </Label>
                            <Switch
                                id={`visibility-${item.id}`}
                                checked={localVisibility[item.id] ?? true}
                                onCheckedChange={() => handleToggle(item.id)}
                                disabled={item.isLocked}
                                aria-label={`Toggle ${t(`nav.${item.id}`)}`}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {hasChanges && (
                <div className="sticky bottom-0 z-10">
                    <Card className="bg-background/95 backdrop-blur-sm">
                        <CardContent className="p-4 flex items-center justify-end gap-2">
                             <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                             <Button onClick={handleApply}>{t('settings.apply_button')}</Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
