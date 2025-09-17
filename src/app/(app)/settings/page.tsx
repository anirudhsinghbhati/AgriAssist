
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
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { visibility, language, navOrder, setVisibility, setLanguage, setNavOrder } = useNavStore();
    
    const [localVisibility, setLocalVisibility] = React.useState(visibility);
    const [localLanguage, setLocalLanguage] = React.useState(language);
    const [localNavOrder, setLocalNavOrder] = React.useState(navOrder);

    const orderedNavConfig = React.useMemo(() => {
        const itemMap = new Map(navConfig.map(item => [item.id, item]));
        return localNavOrder.map(id => itemMap.get(id)).filter(Boolean);
    }, [localNavOrder]);
    
    React.useEffect(() => {
        setLocalVisibility(visibility);
        setLocalLanguage(language);
        setLocalNavOrder(navOrder);
    }, [visibility, language, navOrder]);

    const handleToggle = (id: string) => {
        const item = navConfig.find(item => item.id === id);
        if (item?.isLocked) return;
        setLocalVisibility(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    
    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...localNavOrder];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newOrder.length) {
            const itemToMove = newOrder[index];
            const itemIsLocked = navConfig.find(nav => nav.id === itemToMove)?.isLocked;
            const targetItemIsLocked = navConfig.find(nav => nav.id === newOrder[targetIndex])?.isLocked;
            if(itemIsLocked || targetItemIsLocked) return;

            [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
            setLocalNavOrder(newOrder);
        }
    };

    const handleApply = () => {
        setVisibility(localVisibility);
        setLanguage(localLanguage);
        setNavOrder(localNavOrder);
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
                        <p className="text-sm text-muted-foreground mb-4">Toggle visibility for each navigation item.</p>
                        <div className="space-y-4">
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
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Navigation Order</h3>
                         <p className="text-sm text-muted-foreground mb-4">Change the order of the items in the sidebar. Locked items cannot be moved.</p>
                        <div className="space-y-2">
                            {orderedNavConfig.map((item, index) => {
                                if (!item) return null;
                                return (
                                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">{t(`nav.${item.id}`)}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleMove(index, 'up')}
                                            disabled={item.isLocked || index === 0 || navConfig.find(i => i.id === localNavOrder[index - 1])?.isLocked}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleMove(index, 'down')}
                                            disabled={item.isLocked || index === localNavOrder.length - 1 || navConfig.find(i => i.id === localNavOrder[index + 1])?.isLocked}
                                        >
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )})}
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
