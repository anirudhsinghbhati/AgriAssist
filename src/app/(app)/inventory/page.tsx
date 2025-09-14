
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import InventoryForm, { InventoryFormValues } from '@/components/inventory-form';

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
};

const initialInventoryData = {
  seeds: [
    { id: 'S001', name: 'Soybean JS-335', quantity: 50, unit: 'kg', lastUpdated: '2024-06-12' },
    { id: 'S002', name: 'Cotton BT', quantity: 25, unit: 'kg', lastUpdated: '2024-05-28' },
    { id: 'S003', name: 'Wheat Lokwan', quantity: 120, unit: 'kg', lastUpdated: '2024-03-15' },
  ],
  fertilizers: [
    { id: 'F001', name: 'Urea', quantity: 15, unit: 'bags (50kg)', lastUpdated: '2024-06-22' },
    { id: 'F002', name: 'DAP', quantity: 8, unit: 'bags (50kg)', lastUpdated: '2024-06-22' },
  ],
  pesticides: [
    { id: 'P001', name: 'Neem Oil', quantity: 5, unit: 'liters', lastUpdated: '2024-06-18' },
    { id: 'P002', name: 'Monocrotophos', quantity: 2, unit: 'liters', lastUpdated: '2024-05-30' },
  ],
  equipment: [
    { id: 'E001', name: 'Tractor', quantity: 1, unit: 'unit', lastUpdated: '2024-01-10' },
    { id: 'E002', name: 'Sprayer', quantity: 2, unit: 'units', lastUpdated: '2024-03-05' },
    { id: 'E003', name: 'Plow', quantity: 1, unit: 'unit', lastUpdated: '2024-01-10' },
  ],
};

type InventoryCategory = keyof typeof initialInventoryData;

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventoryData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<InventoryCategory>('seeds');

  const handleAddItem = (values: InventoryFormValues) => {
    const newItem: InventoryItem = {
      id: `${activeTab.charAt(0).toUpperCase()}${String(inventory[activeTab].length + 1).padStart(3, '0')}`,
      name: values.name,
      quantity: values.quantity,
      unit: values.unit,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setInventory(prev => ({
      ...prev,
      [activeTab]: [newItem, ...prev[activeTab]],
    }));
    setIsModalOpen(false);
  };

  const renderTable = (category: InventoryCategory) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory[category].map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.quantity} {item.unit}</TableCell>
            <TableCell>{item.lastUpdated}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Keep track of your seeds, fertilizers, pesticides, and equipment.</CardDescription>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item to {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</DialogTitle>
              </DialogHeader>
              <InventoryForm onSubmit={handleAddItem} />
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InventoryCategory)} className="w-full">
            <TabsList className="m-4">
              <TabsTrigger value="seeds">Seeds</TabsTrigger>
              <TabsTrigger value="fertilizers">Fertilizers</TabsTrigger>
              <TabsTrigger value="pesticides">Pesticides</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
            </TabsList>
            <TabsContent value="seeds" className="p-4 pt-0">{renderTable('seeds')}</TabsContent>
            <TabsContent value="fertilizers" className="p-4 pt-0">{renderTable('fertilizers')}</TabsContent>
            <TabsContent value="pesticides" className="p-4 pt-0">{renderTable('pesticides')}</TabsContent>
            <TabsContent value="equipment" className="p-4 pt-0">{renderTable('equipment')}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
