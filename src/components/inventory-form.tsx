
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2, 'Item name is required.'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative.'),
  unit: z.string().min(1, 'Unit is required.'),
});

export type InventoryFormValues = z.infer<typeof formSchema>;

interface InventoryFormProps {
  onSubmit: (values: InventoryFormValues) => void;
  initialValues?: InventoryFormValues;
}

export default function InventoryForm({ onSubmit, initialValues }: InventoryFormProps) {
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: '',
      quantity: 0,
      unit: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Soybean JS-335" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 50" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., kg, bags, liters" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button type="submit" className="w-full">
          {initialValues ? 'Update Item' : 'Add Item'}
        </Button>
      </form>
    </Form>
  );
}
