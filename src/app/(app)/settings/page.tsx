'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavStore } from "@/hooks/use-nav-store";
import { navConfig } from "@/lib/nav-config";

export default function SettingsPage() {
    const visibility = useNavStore((state) => state.visibility);
    const toggleVisibility = useNavStore((state) => state.toggleVisibility);

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
                                        checked={visibility[item.id] ?? true}
                                        onCheckedChange={() => toggleVisibility(item.id)}
                                        disabled={item.isLocked}
                                        aria-label={`Toggle ${item.label}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
