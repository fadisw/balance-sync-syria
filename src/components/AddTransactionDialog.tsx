
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Employee } from '@/contexts/BalancesContext';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onAddTransaction: (employeeId: string, type: 'syriaTel' | 'mtn' | 'cash', amount: number, description: string) => void;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  onOpenChange,
  employees,
  onAddTransaction,
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState<'syriaTel' | 'mtn' | 'cash'>('syriaTel');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId && type && amount) {
      onAddTransaction(employeeId, type, parseFloat(amount), description);
      resetForm();
      onOpenChange(false);
    }
  };
  
  const resetForm = () => {
    setEmployeeId('');
    setType('syriaTel');
    setAmount('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">إضافة معاملة جديدة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="employee">الموظف</Label>
            <Select value={employeeId} onValueChange={setEmployeeId} required>
              <SelectTrigger id="employee" className="w-full">
                <SelectValue placeholder="اختر الموظف" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transactionType">نوع المعاملة</Label>
            <Select 
              value={type} 
              onValueChange={(value) => setType(value as 'syriaTel' | 'mtn' | 'cash')}
              required
            >
              <SelectTrigger id="transactionType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="syriaTel">سيرياتيل</SelectItem>
                <SelectItem value="mtn">ام تي ان</SelectItem>
                <SelectItem value="cash">نقدي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ"
              className="w-full"
              min="0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">الوصف (اختياري)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف المعاملة"
              className="w-full"
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={!employeeId || !amount || parseFloat(amount) <= 0}
            >
              إضافة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
