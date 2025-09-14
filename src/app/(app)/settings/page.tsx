
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
import { useTranslation } from '@/hooks/use-translation';

export default function SettingsPage() {
    const { t } = useTranslation();
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
            title: t('settings.toast.title'),
            description: t('settings.toast.description'),
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('settings.title')}</CardTitle>
                <CardDescription>{t('settings.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('settings.language.title')}</h3>
                        <div className="max-w-xs">
                             <Select value={localLanguage} onValueChange={setLocalLanguage as (value: string) => void}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('settings.language.select_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">{t('settings.language.english')}</SelectItem>
                                    <SelectItem value="hi">{t('settings.language.hindi')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-4">{t('settings.customize_nav.title')}</h3>
                        <div className="space-y-4">
                            {navConfig.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <Label htmlFor={item.id} className="flex items-center gap-3 cursor-pointer">
                                        <item.icon className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{t(`nav.${item.id}`)}</span>
                                    </Label>
                                    <Switch
                                        id={item.id}
                                        checked={localVisibility[item.id] ?? true}
                                        onCheckedChange={() => handleToggle(item.id)}
                                        disabled={item.isLocked}
                                        aria-label={`Toggle ${t(`nav.${item.id}`)}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleApply}>{t('settings.apply_button')}</Button>
            </CardFooter>
        </Card>
    );
}
