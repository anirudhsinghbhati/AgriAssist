
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/hooks/use-translation';
import { ArrowRight, Languages, List } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const { t } = useTranslation();

    const settingsOptions = [
        {
            id: 'navigation',
            title: t('settings.customize_nav.title'),
            description: 'Change the order and visibility of items in the sidebar.',
            icon: List,
            href: '/settings/navigation'
        },
        {
            id: 'language',
            title: t('settings.language.title'),
            description: 'Choose the language for the application interface.',
            icon: Languages,
            href: '/settings/language'
        }
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.title')}</CardTitle>
                    <CardDescription>{t('settings.description')}</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {settingsOptions.map((option) => (
                    <Link href={option.href} key={option.id}>
                        <Card className="hover:border-primary transition-colors h-full flex flex-col">
                            <CardHeader className="flex-row gap-4 items-center">
                                <option.icon className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle>{option.title}</CardTitle>
                                    <CardDescription className="mt-1">{option.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-auto flex justify-end">
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
