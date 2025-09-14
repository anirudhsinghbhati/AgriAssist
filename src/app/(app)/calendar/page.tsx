
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import { Sprout, Droplets, Bug, Combine, PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type EventType = 'Planting' | 'Irrigation' | 'Pest Control' | 'Harvesting';

type CalendarEvent = {
  date: Date;
  title: string;
  crop: string;
  type: EventType;
};

const initialEvents: CalendarEvent[] = [
  { date: startOfDay(new Date()), title: 'Soybean Planting', crop: 'Soybean', type: 'Planting' },
  { date: startOfDay(addDays(new Date(), 15)), title: 'Fertilizer Application', crop: 'Soybean', type: 'Irrigation' },
  { date: startOfDay(addDays(new Date(), 30)), title: 'Weed Control', crop: 'Cotton', type: 'Pest Control' },
  { date: startOfDay(addDays(new Date(), 60)), title: 'Scouting for Pests', crop: 'Soybean', type: 'Pest Control' },
  { date: startOfDay(addDays(new Date(), 90)), title: 'Cotton Harvest', crop: 'Cotton', type: 'Harvesting' },
];

const eventConfig: { [key in EventType]: { icon: React.ElementType, color: string } } = {
  'Planting': { icon: Sprout, color: 'bg-green-500' },
  'Irrigation': { icon: Droplets, color: 'bg-blue-500' },
  'Pest Control': { icon: Bug, color: 'bg-red-500' },
  'Harvesting': { icon: Combine, color: 'bg-yellow-500' },
};


export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCrop, setNewEventCrop] = useState('');

  const dayEvents = date ? events.filter(event => isSameDay(event.date, date)) : [];

  const handleAddEvent = () => {
    if (newEventTitle && newEventCrop && date) {
      // Simple type inference for demo
      const newType: EventType = newEventTitle.toLowerCase().includes('plant') ? 'Planting'
        : newEventTitle.toLowerCase().includes('water') || newEventTitle.toLowerCase().includes('fertili') ? 'Irrigation'
        : newEventTitle.toLowerCase().includes('pest') || newEventTitle.toLowerCase().includes('weed') ? 'Pest Control'
        : 'Harvesting';

      const newEvent: CalendarEvent = {
        date: startOfDay(date),
        title: newEventTitle,
        crop: newEventCrop,
        type: newType,
      };
      setEvents([...events, newEvent]);
      setNewEventTitle('');
      setNewEventCrop('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
          <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Select a day on the calendar, then add a task for that day.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                  <Input 
                    placeholder="Task title (e.g., Water soybean)" 
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                  />
                   <Select onValueChange={setNewEventCrop} value={newEventCrop}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Soybean">Soybean</SelectItem>
                        <SelectItem value="Cotton">Cotton</SelectItem>
                        <SelectItem value="Wheat">Wheat</SelectItem>
                         <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  <Button onClick={handleAddEvent} className="w-full sm:w-auto" disabled={!date}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                  </Button>
              </div>
          </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                components={{
                  DayContent: ({ date: dayDate }) => {
                    const dayEventsForCell = events.filter(event => isSameDay(event.date, dayDate));
                    const isToday = isSameDay(dayDate, new Date());
                    
                    return (
                      <div className={cn("relative h-full w-full p-1", isToday ? "text-primary font-bold" : "")}>
                        {format(dayDate, 'd')}
                        {dayEventsForCell.length > 0 && (
                          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex space-x-1">
                            {dayEventsForCell.slice(0, 3).map((event, i) => (
                              <div key={i} className={`h-1.5 w-1.5 rounded-full ${eventConfig[event.type].color}`} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground"/>
                Schedule for {date ? format(date, 'PPP') : '...'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dayEvents.length > 0 ? (
                dayEvents.map((event, i) => {
                  const Icon = eventConfig[event.type].icon;
                  const color = eventConfig[event.type].color;
                  return (
                    <div key={i} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className={cn("mt-1 p-2 rounded-full text-white", color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <Badge variant="secondary">{event.crop}</Badge>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center text-muted-foreground pt-10">
                  <p>No events scheduled for this day.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
