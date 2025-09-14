
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { addDays, format, isSameDay } from 'date-fns';

const events = [
  { date: new Date(), title: 'Soybean Planting', crop: 'Soybean', color: 'bg-green-500' },
  { date: addDays(new Date(), 15), title: 'Fertilizer Application', crop: 'Soybean', color: 'bg-yellow-500' },
  { date: addDays(new Date(), 30), title: 'Weed Control', crop: 'Cotton', color: 'bg-red-500' },
  { date: addDays(new Date(), 60), title: 'Scouting for Pests', crop: 'Soybean', color: 'bg-purple-500' },
  { date: addDays(new Date(), 90), title: 'Cotton Harvest', crop: 'Cotton', color: 'bg-blue-500' },
];

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const dayEvents = date ? events.filter(event => isSameDay(event.date, date)) : [];

  return (
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
                  const originalDate = new Date(dayDate);
                  originalDate.setHours(0,0,0,0);
                  
                  return (
                    <div className="relative h-full w-full">
                       <span className={isSameDay(originalDate, new Date(new Date().setHours(0,0,0,0))) ? 'font-bold' : ''}>
                        {format(dayDate, 'd')}
                      </span>
                      {dayEventsForCell.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
                          {dayEventsForCell.slice(0, 3).map((event, i) => (
                            <div key={i} className={`h-1.5 w-1.5 rounded-full ${event.color}`} />
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
        <Card>
          <CardHeader>
            <CardTitle>Schedule for {date ? format(date, 'PPP') : '...'}</CardTitle>
            <CardDescription>Tasks and events for the selected day.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dayEvents.length > 0 ? (
              dayEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 h-3 w-3 rounded-full ${event.color}`} />
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <Badge variant="secondary">{event.crop}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No events scheduled for this day.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
