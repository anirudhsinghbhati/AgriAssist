
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavStore } from "@/hooks/use-nav-store";
import { navConfig } from "@/lib/nav-config";
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function NavigationOrderPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { navOrder, setNavOrder } = useNavStore();
    
    const [localNavOrder, setLocalNavOrder] = React.useState(navOrder);

    const orderedNavConfig = React.useMemo(() => {
        const itemMap = new Map(navConfig.map(item => [item.id, item]));
        return localNavOrder.map(id => itemMap.get(id)).filter(Boolean);
    }, [localNavOrder]);
    
    React.useEffect(() => {
        setLocalNavOrder(navOrder);
    }, [navOrder]);
    
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
        setNavOrder(localNavOrder);
        toast({
            title: t('settings.toast.title'),
            description: t('settings.toast.description'),
        });
    };

    const handleCancel = () => {
        setLocalNavOrder(navOrder);
    };

    const hasChanges = JSON.stringify(localNavOrder) !== JSON.stringify(navOrder);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Navigation Order</CardTitle>
                    <CardDescription>Change the order of items in the sidebar. Locked items cannot be moved.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
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
