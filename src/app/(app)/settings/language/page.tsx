
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavStore } from "@/hooks/use-nav-store";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';

export default function LanguageSettingsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { language, setLanguage } = useNavStore();
    
    const [localLanguage, setLocalLanguage] = React.useState(language);
    
    React.useEffect(() => {
        setLocalLanguage(language);
    }, [language]);


    const handleApply = () => {
        setLanguage(localLanguage);
        toast({
            title: t('settings.toast.title'),
            description: t('settings.toast.description'),
        });
    };

    const handleCancel = () => {
        setLocalLanguage(language);
    };

    const hasChanges = localLanguage !== language;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.language.title')}</CardTitle>
                    <CardDescription>Choose the language for the application interface.</CardDescription>
                </CardHeader>
                <CardContent>
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
