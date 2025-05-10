
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee, EmployeeTransaction } from '@/contexts/BalancesContext';
import { X } from 'lucide-react';

interface DistributorAccountDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string | null;
  employees: Employee[];
  transactions: EmployeeTransaction[];
}

const DistributorAccountDetails: React.FC<DistributorAccountDetailsProps> = ({
  open,
  onOpenChange,
  employeeId,
  employees,
  transactions,
}) => {
  const [activeTab, setActiveTab] = useState<string>('syriaTel');

  if (!employeeId) {
    return null;
  }

  const employee = employees.find((emp) => emp.id === employeeId);
  if (!employee) {
    return null;
  }

  const filteredTransactions = transactions.filter(
    (transaction) => transaction.employeeId === employeeId
  );

  const syriaTelTransactions = filteredTransactions.filter(
    (transaction) => transaction.type === 'syriaTel'
  );
  const mtnTransactions = filteredTransactions.filter(
    (transaction) => transaction.type === 'mtn'
  );
  const cashTransactions = filteredTransactions.filter(
    (transaction) => transaction.type === 'cash'
  );

  const renderTransactions = (transactionList: EmployeeTransaction[]) => {
    if (transactionList.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          لا توجد معاملات للعرض
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">التاريخ</TableHead>
            <TableHead className="text-right">الوصف</TableHead>
            <TableHead className="text-right">المبلغ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionList.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="font-semibold">
                {transaction.amount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="border-b pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              تفاصيل حساب: {employee.name}
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <Tabs defaultValue="syriaTel" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger 
              value="syriaTel" 
              className="data-[state=active]:bg-syriatel data-[state=active]:text-white"
            >
              سيرياتيل
            </TabsTrigger>
            <TabsTrigger 
              value="mtn" 
              className="data-[state=active]:bg-mtn data-[state=active]:text-black"
            >
              ام تي ان
            </TabsTrigger>
            <TabsTrigger 
              value="cash" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              نقدي
            </TabsTrigger>
          </TabsList>

          <TabsContent value="syriaTel" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {renderTransactions(syriaTelTransactions)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mtn" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {renderTransactions(mtnTransactions)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cash" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {renderTransactions(cashTransactions)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DistributorAccountDetails;
